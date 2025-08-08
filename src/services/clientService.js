const Client = require('../models/clientModel');
const Log = require('../models/logModel');
const mongoose = require('mongoose');

// Données en mémoire pour le cas où MongoDB n'est pas disponible
let inMemoryClients = [
  {
    numero: '0123456789',
    statut: 'actif',
    nom: 'John Doe',
    email: 'john.doe@example.com',
  },
  {
    numero: '0987654321',
    statut: 'inactif',
    nom: 'Jane Smith',
    email: 'jane.smith@example.com',
  },
  {
    numero: '0112233445',
    statut: 'actif',
    nom: 'Albert Einstein',
    email: 'albert.einstein@example.com',
  },
];

// Fonction pour vérifier si MongoDB est disponible
const isMongoAvailable = () => {
  return process.env.MONGODB_URI && mongoose.connection.readyState === 1;
};

/**
 * Récupère un client par son numéro
 * @param {string} numero - Le numéro du client
 * @returns {Object} Le client trouvé
 * @throws {Error} Si le client n'est pas trouvé ou inactif
 */
const getClientByNumero = async (numero) => {
  try {
    if (isMongoAvailable()) {
      const client = await Client.findOne({ numero });
      if (!client) {
        await Log.create({
          numero,
          statut: 'erreur',
          message: 'Client non trouvé',
        });
        throw new Error('Client non trouvé');
      }

      if (client.statut !== 'actif') {
        await Log.create({
          numero,
          statut: 'erreur',
          message: 'Client inactif',
        });
        throw new Error('Client inactif');
      }

      await Log.create({
        numero,
        statut: 'succès',
        message: 'Client trouvé',
      });

      return client;
    } else {
      // Utiliser les données en mémoire
      const client = inMemoryClients.find(c => c.numero === numero);
      if (!client) {
        throw new Error('Client non trouvé');
      }

      if (client.statut !== 'actif') {
        throw new Error('Client inactif');
      }

      return client;
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Récupère tous les clients
 * @param {Object} filters - Filtres optionnels (statut, etc.)
 * @returns {Array} Liste des clients
 */
const getAllClients = async (filters = {}) => {
  try {
    if (isMongoAvailable()) {
      const clients = await Client.find(filters);
      
      await Log.create({
        numero: 'ALL',
        statut: 'succès',
        message: `${clients.length} clients récupérés`,
      });
      
      return clients;
    } else {
      // Utiliser les données en mémoire
      let clients = [...inMemoryClients];
      
      if (filters.statut) {
        clients = clients.filter(c => c.statut === filters.statut);
      }
      
      return clients;
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Crée un nouveau client
 * @param {Object} clientData - Les données du client
 * @returns {Object} Le client créé
 * @throws {Error} Si les données sont invalides ou si le numéro existe déjà
 */
const createClient = async (clientData) => {
  try {
    if (isMongoAvailable()) {
      // Vérifier si le numéro existe déjà
      const existingClient = await Client.findOne({ numero: clientData.numero });
      if (existingClient) {
        await Log.create({
          numero: clientData.numero,
          statut: 'erreur',
          message: 'Numéro de client déjà existant',
        });
        throw new Error('Un client avec ce numéro existe déjà');
      }

      const client = new Client(clientData);
      const savedClient = await client.save();
      
      await Log.create({
        numero: savedClient.numero,
        statut: 'succès',
        message: 'Client créé avec succès',
      });
      
      return savedClient;
    } else {
      // Utiliser les données en mémoire
      const existingClient = inMemoryClients.find(c => c.numero === clientData.numero);
      if (existingClient) {
        throw new Error('Un client avec ce numéro existe déjà');
      }

      const newClient = { ...clientData };
      inMemoryClients.push(newClient);
      return newClient;
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Met à jour un client existant
 * @param {string} numero - Le numéro du client à mettre à jour
 * @param {Object} updateData - Les nouvelles données du client
 * @returns {Object} Le client mis à jour
 * @throws {Error} Si le client n'est pas trouvé
 */
const updateClient = async (numero, updateData) => {
  try {
    if (isMongoAvailable()) {
      // Ne pas permettre la modification du numéro
      delete updateData.numero;
      
      const client = await Client.findOneAndUpdate(
        { numero },
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!client) {
        await Log.create({
          numero,
          statut: 'erreur',
          message: 'Client non trouvé pour mise à jour',
        });
        throw new Error('Client non trouvé');
      }
      
      await Log.create({
        numero,
        statut: 'succès',
        message: 'Client mis à jour avec succès',
      });
      
      return client;
    } else {
      // Utiliser les données en mémoire
      const clientIndex = inMemoryClients.findIndex(c => c.numero === numero);
      if (clientIndex === -1) {
        throw new Error('Client non trouvé');
      }

      inMemoryClients[clientIndex] = { ...inMemoryClients[clientIndex], ...updateData };
      return inMemoryClients[clientIndex];
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Supprime un client
 * @param {string} numero - Le numéro du client à supprimer
 * @returns {Object} Le client supprimé
 * @throws {Error} Si le client n'est pas trouvé
 */
const deleteClient = async (numero) => {
  try {
    if (isMongoAvailable()) {
      const client = await Client.findOneAndDelete({ numero });
      
      if (!client) {
        await Log.create({
          numero,
          statut: 'erreur',
          message: 'Client non trouvé pour suppression',
        });
        throw new Error('Client non trouvé');
      }
      
      await Log.create({
        numero,
        statut: 'succès',
        message: 'Client supprimé avec succès',
      });
      
      return client;
    } else {
      // Utiliser les données en mémoire
      const clientIndex = inMemoryClients.findIndex(c => c.numero === numero);
      if (clientIndex === -1) {
        throw new Error('Client non trouvé');
      }

      const deletedClient = inMemoryClients[clientIndex];
      inMemoryClients.splice(clientIndex, 1);
      return deletedClient;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getClientByNumero,
  getAllClients,
  createClient,
  updateClient,
  deleteClient
};

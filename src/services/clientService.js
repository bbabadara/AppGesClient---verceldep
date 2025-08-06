const Client = require('../models/clientModel');
const Log = require('../models/logModel');

/**
 * Récupère un client par son numéro
 * @param {string} numero - Le numéro du client
 * @returns {Object} Le client trouvé
 * @throws {Error} Si le client n'est pas trouvé ou inactif
 */
const getClientByNumero = async (numero) => {
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
};

/**
 * Récupère tous les clients
 * @param {Object} filters - Filtres optionnels (statut, etc.)
 * @returns {Array} Liste des clients
 */
const getAllClients = async (filters = {}) => {
  try {
    const clients = await Client.find(filters);
    
    await Log.create({
      numero: 'ALL',
      statut: 'succès',
      message: `${clients.length} clients récupérés`,
    });
    
    return clients;
  } catch (error) {
    await Log.create({
      numero: 'ALL',
      statut: 'erreur',
      message: `Erreur lors de la récupération des clients: ${error.message}`,
    });
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
  } catch (error) {
    await Log.create({
      numero: clientData.numero || 'UNKNOWN',
      statut: 'erreur',
      message: `Erreur lors de la création du client: ${error.message}`,
    });
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
  } catch (error) {
    await Log.create({
      numero,
      statut: 'erreur',
      message: `Erreur lors de la mise à jour du client: ${error.message}`,
    });
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
  } catch (error) {
    await Log.create({
      numero,
      statut: 'erreur',
      message: `Erreur lors de la suppression du client: ${error.message}`,
    });
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

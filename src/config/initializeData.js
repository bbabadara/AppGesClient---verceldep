const Client = require('../models/clientModel');
const Log = require('../models/logModel');
const mongoose = require('mongoose');

// Liste de clients à insérer dans la base de données
const clientsData = [
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

// Fonction pour initialiser les données
const initializeData = async () => {
  try {
    // Vérifier si MongoDB est connecté
    if (!process.env.MONGODB_URI || mongoose.connection.readyState !== 1) {
      console.log('⚠️  Base de données non disponible. Initialisation des données ignorée.');
      return;
    }

    // Vérifier si des clients existent déjà
    const existingClients = await Client.find();

    if (existingClients.length > 0) {
      console.log('✅ Les clients existent déjà dans la base de données.');
      return;
    }

    // Insérer des clients
    await Client.insertMany(clientsData);
    console.log('✅ Données des clients insérées avec succès !');

    // Insérer des logs de test
    const logsData = [
      { numero: '0123456789', statut: 'succès', message: 'Client trouvé' },
      { numero: '0987654321', statut: 'erreur', message: 'Client inactif' },
      { numero: '0112233445', statut: 'succès', message: 'Client trouvé' },
    ];

    await Log.insertMany(logsData);
    console.log('✅ Données des logs insérées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des données:', error.message);
    console.warn('⚠️  L\'application continuera sans données initiales');
  }
};

module.exports = initializeData;

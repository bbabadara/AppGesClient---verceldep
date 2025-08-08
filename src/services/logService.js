const Log = require('../models/logModel');
const mongoose = require('mongoose');

// Données en mémoire pour les logs
let inMemoryLogs = [
  { numero: '0123456789', statut: 'succès', message: 'Client trouvé' },
  { numero: '0987654321', statut: 'erreur', message: 'Client inactif' },
  { numero: '0112233445', statut: 'succès', message: 'Client trouvé' },
];

// Fonction pour vérifier si MongoDB est disponible
const isMongoAvailable = () => {
  return process.env.MONGODB_URI && mongoose.connection.readyState === 1;
};

const createLog = async (numero, statut, message) => {
  try {
    if (isMongoAvailable()) {
      const log = new Log({ numero, statut, message });
      await log.save();
    } else {
      // Utiliser les données en mémoire
      inMemoryLogs.push({ numero, statut, message });
    }
  } catch (error) {
    console.error('Erreur lors de la création du log:', error.message);
  }
};

const getLogs = async () => {
  try {
    if (isMongoAvailable()) {
      return await Log.find().sort({ createdAt: -1 });
    } else {
      // Utiliser les données en mémoire
      return inMemoryLogs;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des logs:', error.message);
    return inMemoryLogs;
  }
};

module.exports = { createLog, getLogs };

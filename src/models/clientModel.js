const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  numero: { type: String, required: true, unique: true },
  statut: { type: String, enum: ['actif', 'inactif'], required: true },
  nom: { type: String, required: true },
  email: { type: String, required: false },
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;

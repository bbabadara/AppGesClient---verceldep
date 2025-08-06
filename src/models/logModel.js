const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  numero: { type: String, required: true },
  statut: { type: String, enum: ['succès', 'erreur'], required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;

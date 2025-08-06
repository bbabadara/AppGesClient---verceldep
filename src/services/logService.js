const Log = require('../models/logModel');

const createLog = async (numero, statut, message) => {
  const log = new Log({ numero, statut, message });
  await log.save();
};

module.exports = { createLog };

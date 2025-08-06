const express = require('express');
const {
  getAllClients,
  getClient,
  createClient,
  updateClient,
  deleteClient
} = require('../controllers/clientController');

const router = express.Router();

// Routes pour les clients
router.get('/', getAllClients);           
router.get('/:numero', getClient);        
router.post('/', createClient);           
router.put('/:numero', updateClient);     
router.delete('/:numero', deleteClient);  

module.exports = router;

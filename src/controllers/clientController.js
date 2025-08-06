const clientService = require('../services/clientService');

/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       required:
 *         - numero
 *         - statut
 *         - nom
 *       properties:
 *         numero:
 *           type: string
 *           description: Numéro unique du client
 *           example: "CLI001"
 *         statut:
 *           type: string
 *           enum: [actif, inactif]
 *           description: Statut du client
 *           example: "actif"
 *         nom:
 *           type: string
 *           description: Nom du client
 *           example: "Jean Dupont"
 *         email:
 *           type: string
 *           format: email
 *           description: Email du client (optionnel)
 *           example: "jean.dupont@email.com"
 *     ClientInput:
 *       type: object
 *       required:
 *         - numero
 *         - statut
 *         - nom
 *       properties:
 *         numero:
 *           type: string
 *           description: Numéro unique du client
 *           example: "CLI001"
 *         statut:
 *           type: string
 *           enum: [actif, inactif]
 *           description: Statut du client
 *           example: "actif"
 *         nom:
 *           type: string
 *           description: Nom du client
 *           example: "Jean Dupont"
 *         email:
 *           type: string
 *           format: email
 *           description: Email du client (optionnel)
 *           example: "jean.dupont@email.com"
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Message d'erreur
 *           example: "Client non trouvé"
 */

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Récupère tous les clients
 *     tags: [Clients]
 *     parameters:
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *           enum: [actif, inactif]
 *         description: Filtrer par statut
 *     responses:
 *       200:
 *         description: Liste des clients récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const getAllClients = async (req, res) => {
  try {
    const filters = {};
    if (req.query.statut) {
      filters.statut = req.query.statut;
    }
    
    const clients = await clientService.getAllClients(filters);
    return res.json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

/**
 * @swagger
 * /api/clients/{numero}:
 *   get:
 *     summary: Récupère un client par son numéro
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: numero
 *         required: true
 *         schema:
 *           type: string
 *         description: Numéro du client
 *         example: "CLI001"
 *     responses:
 *       200:
 *         description: Client trouvé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Client'
 *       400:
 *         description: Client non trouvé ou inactif
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Client non trouvé"
 */
const getClient = async (req, res) => {
  try {
    const { numero } = req.params;
    const client = await clientService.getClientByNumero(numero);
    return res.json({
      success: true,
      data: client
    });
  } catch (err) {
    return res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Crée un nouveau client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientInput'
 *     responses:
 *       201:
 *         description: Client créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Client créé avec succès"
 *                 data:
 *                   $ref: '#/components/schemas/Client'
 *       400:
 *         description: Données invalides ou numéro déjà existant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Un client avec ce numéro existe déjà"
 */
const createClient = async (req, res) => {
  try {
    const clientData = req.body;
    
    // Validation basique
    if (!clientData.numero || !clientData.statut || !clientData.nom) {
      return res.status(400).json({
        success: false,
        message: 'Les champs numero, statut et nom sont obligatoires'
      });
    }
    
    const client = await clientService.createClient(clientData);
    return res.status(201).json({
      success: true,
      message: 'Client créé avec succès',
      data: client
    });
  } catch (err) {
    return res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

/**
 * @swagger
 * /api/clients/{numero}:
 *   put:
 *     summary: Met à jour un client existant
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: numero
 *         required: true
 *         schema:
 *           type: string
 *         description: Numéro du client à mettre à jour
 *         example: "772641040"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [actif, inactif]
 *                 example: "actif"
 *               nom:
 *                 type: string
 *                 example: "Jean Dupont"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jean.dupont@email.com"
 *     responses:
 *       200:
 *         description: Client mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Client mis à jour avec succès"
 *                 data:
 *                   $ref: '#/components/schemas/Client'
 *       400:
 *         description: Client non trouvé ou données invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Client non trouvé"
 */
const updateClient = async (req, res) => {
  try {
    const { numero } = req.params;
    const updateData = req.body;
    
    const client = await clientService.updateClient(numero, updateData);
    return res.json({
      success: true,
      message: 'Client mis à jour avec succès',
      data: client
    });
  } catch (err) {
    return res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

/**
 * @swagger
 * /api/clients/{numero}:
 *   delete:
 *     summary: Supprime un client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: numero
 *         required: true
 *         schema:
 *           type: string
 *         description: Numéro du client à supprimer
 *         example: "CLI001"
 *     responses:
 *       200:
 *         description: Client supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Client supprimé avec succès"
 *                 data:
 *                   $ref: '#/components/schemas/Client'
 *       400:
 *         description: Client non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Client non trouvé"
 */
const deleteClient = async (req, res) => {
  try {
    const { numero } = req.params;
    const client = await clientService.deleteClient(numero);
    return res.json({
      success: true,
      message: 'Client supprimé avec succès',
      data: client
    });
  } catch (err) {
    return res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

module.exports = {
  getAllClients,
  getClient,
  createClient,
  updateClient,
  deleteClient
};

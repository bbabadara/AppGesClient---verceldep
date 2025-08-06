const Log = require('../models/logModel');
//swagger components
/**
 * @swagger
 * components:
 *   schemas:
 *     Log:
 *       type: object
 *       required:
 *         - numero
 *         - statut
 *         - message
 *       properties:
 *         numero:
 *           type: string
 *           description: Numéro unique du log
 *           example: "772641040"
 *         statut:
 *           type: string
 *           enum: [actif, inactif]
 *           description: Statut du log
 *           example: "actif"
 *         message:
 *           type: string
 *           description: Message du log
 *           example: "Client trouvé"
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date du log
 *           example: "2024-06-01T12:34:56.789Z"
 */



//ducumentation swagger
/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Récupère tous les logs
 *     tags: [Logs]
 *     responses:
 *       200:
 *         description: Liste des logs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Log'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const getLogs = async (req, res) => {
  const logs = await Log.find().sort({ date: -1 });
  res.json(logs);
};

module.exports = { getLogs };

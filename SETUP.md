# Configuration de l'environnement

## Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Configuration MongoDB
MONGODB_URI=mongodb://localhost:27017/gesclient

# Configuration du serveur
PORT=3000

# Configuration pour le développement
NODE_ENV=development
```

## Installation et démarrage

1. **Installer les dépendances :**
   ```bash
   npm install
   ```

2. **Configurer MongoDB (optionnel) :**
   - Installez MongoDB localement
   - Ou utilisez MongoDB Atlas (service cloud)
   - Ou laissez vide pour fonctionner sans base de données

3. **Démarrer en mode développement :**
   ```bash
   npm run dev
   ```

4. **Démarrer en mode production :**
   ```bash
   npm start
   ```

5. **Démarrer avec Vercel :**
   ```bash
   vercel dev
   ```

## Endpoints disponibles

- **GET /** - Page d'accueil de l'API
- **GET /api/clients** - Liste des clients
- **GET /api/clients/:numero** - Détails d'un client
- **POST /api/clients** - Créer un client
- **PUT /api/clients/:numero** - Modifier un client
- **DELETE /api/clients/:numero** - Supprimer un client
- **GET /logs** - Liste des logs
- **GET /api/api-docs** - Documentation Swagger

## Notes importantes

- L'application fonctionne même sans base de données MongoDB
- Les données sont stockées en mémoire si MongoDB n'est pas disponible
- Pour la production, configurez une vraie base de données MongoDB 
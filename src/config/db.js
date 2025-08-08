const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Vérifier si MONGODB_URI est définie
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️  MONGODB_URI non définie. L\'application fonctionnera sans base de données.');
      console.warn('💡 Créez un fichier .env avec MONGODB_URI=mongodb://localhost:27017/gesclient');
      return;
    }

    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ MongoDB connecté avec succès');
    }
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    console.warn('⚠️  L\'application continuera sans base de données');
    // Ne pas arrêter l'application, juste afficher l'erreur
  }
};

module.exports = connectDB;

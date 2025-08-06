class BaseService {
  constructor(model) {
    this.model = model; // Le modèle Mongoose pour le CRUD
  }

  // Méthode pour créer un document
  async create(data) {
    try {
      const document = await this.model.create(data);
      return document;
    } catch (error) {
      throw new Error(`Erreur lors de la création: ${error.message}`);
    }
  }

  // Méthode pour obtenir un document par son identifiant
  async findById(id) {
    try {
      const document = await this.model.findById(id);
      if (!document) throw new Error('Document non trouvé');
      return document;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération: ${error.message}`);
    }
  }

  // Méthode pour obtenir un document par un critère
  async findOne(criteria) {
    try {
      const document = await this.model.findOne(criteria);
      if (!document) throw new Error('Document non trouvé');
      return document;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération: ${error.message}`);
    }
  }

  // Méthode pour obtenir plusieurs documents
  async find(criteria = {}) {
    try {
      const documents = await this.model.find(criteria);
      return documents;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des documents: ${error.message}`);
    }
  }

  // Méthode pour mettre à jour un document
  async update(id, data) {
    try {
      const document = await this.model.findByIdAndUpdate(id, data, { new: true });
      if (!document) throw new Error('Document non trouvé');
      return document;
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
    }
  }

  // Méthode pour supprimer un document
  async delete(id) {
    try {
      const document = await this.model.findByIdAndDelete(id);
      if (!document) throw new Error('Document non trouvé');
      return document;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression: ${error.message}`);
    }
  }
}

module.exports = BaseService;

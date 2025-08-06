class BaseController {
  // Méthode pour envoyer une réponse de succès
  static sendSuccessResponse(res, data, message = 'Opération réussie') {
    return res.status(200).json({
      status: 'success',
      message,
      data,
    });
  }

  // Méthode pour envoyer une réponse d'erreur
  static sendErrorResponse(res, error, statusCode = 400) {
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Une erreur est survenue',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}

module.exports = BaseController;

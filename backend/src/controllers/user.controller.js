const userService = require("../services/user.service");

/**
 * Controller pour la gestion des utilisateurs
 * Responsabilité : Gérer les requêtes HTTP, valider les entrées, retourner les réponses
 */
class UserController {
  /**
   * Créer un nouvel utilisateur
   * POST /api/users
   */
  async createUser(req, res) {
    try {
      const { name, first_name, email, birthdate, gender, role } = req.body;

      // Validation des champs requis
      if (!name || !first_name || !email || !birthdate || !gender) {
        return res.status(400).json({
          success: false,
          message:
            "Tous les champs sont requis (name, first_name, email, birthdate, gender)",
        });
      }

      // Appeler le service
      const user = await userService.createUser({
        name,
        first_name,
        email,
        birthdate,
        gender,
        role,
      });

      return res.status(201).json({
        success: true,
        message: "Utilisateur créé avec succès",
        data: user,
      });
    } catch (error) {
      console.error("Erreur création utilisateur:", error);

      // Gestion des erreurs métier
      if (
        error.message.includes("existe déjà") ||
        error.message.includes("invalide") ||
        error.message.includes("au moins")
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Erreur lors de la création de l'utilisateur",
        error: error.message,
      });
    }
  }

  /**
   * Récupérer tous les utilisateurs (admin)
   * GET /api/users?page=1&limit=10
   */
  async getAllUsers(req, res) {
    try {
      // Vérifier que l'utilisateur est admin (sera géré par un middleware)
      const role = req.session?.role;
      if (role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Accès réservé aux administrateurs",
        });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await userService.getAllUsers(page, limit);

      return res.status(200).json({
        success: true,
        message: "Liste des utilisateurs",
        data: result.users,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Erreur récupération utilisateurs:", error);

      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des utilisateurs",
        error: error.message,
      });
    }
  }

  /**
   * Récupérer un utilisateur par ID
   * GET /api/users/:id
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "ID utilisateur requis",
        });
      }

      const user = await userService.getUserById(id);

      return res.status(200).json({
        success: true,
        message: "Utilisateur trouvé",
        data: user,
      });
    } catch (error) {
      console.error("Erreur récupération utilisateur:", error);

      if (error.message === "Utilisateur non trouvé") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération de l'utilisateur",
        error: error.message,
      });
    }
  }

  /**
   * Mettre à jour un utilisateur
   * PUT /api/users/:id
   */
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, first_name, email, birthdate, gender } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "ID utilisateur requis",
        });
      }

      // Au moins un champ doit être fourni
      if (!name && !first_name && !email && !birthdate && !gender) {
        return res.status(400).json({
          success: false,
          message: "Au moins un champ doit être fourni pour la mise à jour",
        });
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (first_name) updateData.first_name = first_name;
      if (email) updateData.email = email;
      if (birthdate) updateData.birthdate = birthdate;
      if (gender) updateData.gender = gender;

      const user = await userService.updateUser(id, updateData);

      return res.status(200).json({
        success: true,
        message: "Utilisateur mis à jour avec succès",
        data: user,
      });
    } catch (error) {
      console.error("Erreur mise à jour utilisateur:", error);

      if (error.message === "Utilisateur non trouvé") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      if (
        error.message.includes("déjà utilisé") ||
        error.message.includes("invalide")
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour de l'utilisateur",
        error: error.message,
      });
    }
  }

  /**
   * Supprimer un utilisateur
   * DELETE /api/users/:id
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "ID utilisateur requis",
        });
      }

      // Vérifier que l'utilisateur est admin
      const role = req.session?.role;
      if (role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Accès réservé aux administrateurs",
        });
      }

      const user = await userService.deleteUser(id);

      return res.status(200).json({
        success: true,
        message: "Utilisateur supprimé avec succès",
        data: user,
      });
    } catch (error) {
      console.error("Erreur suppression utilisateur:", error);

      if (error.message === "Utilisateur non trouvé") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Erreur lors de la suppression de l'utilisateur",
        error: error.message,
      });
    }
  }

  /**
   * Obtenir les statistiques des utilisateurs
   * GET /api/users/stats
   */
  async getUserStats(req, res) {
    try {
      // Vérifier que l'utilisateur est admin
      const role = req.session?.role;
      if (role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Accès réservé aux administrateurs",
        });
      }

      const stats = await userService.getUserStats();

      return res.status(200).json({
        success: true,
        message: "Statistiques des utilisateurs",
        data: stats,
      });
    } catch (error) {
      console.error("Erreur récupération stats:", error);

      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des statistiques",
        error: error.message,
      });
    }
  }
}

module.exports = new UserController();

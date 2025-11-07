const userService = require("../services/user.service");

class UserController {
  async createUser(req, res) {
    try {
      const { name, first_name, email, password, birthdate, gender, role } =
        req.body;

      if (
        !name ||
        !first_name ||
        !email ||
        !password ||
        !birthdate ||
        !gender
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Tous les champs sont requis (name, first_name, email,password, birthdate, gender)",
        });
      }

      const user = await userService.createUser({
        name,
        first_name,
        email,
        password,
        birthdate,
        gender,
        role,
      });

      return res.status(201).json({
        success: true,
        message: "Utilisateur créé avec succès",
        data: user,
        // chrinoro supprime le data et laise l'objet user dans faire partie message
      });
    } catch (error) {
      console.error("Erreur création utilisateur:", error);

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

  async alluser(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const jump = (page - 1) * limit;
    try {
      const alluser = await userService.getAll(jump);
      res.status(200).json({ message: "allUsers", alluser });
    } catch (error) {
      console.error("Erreur getAll users:", error);
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await userService.login(email, password);

      if (!result) {
      }

      return res.status(200).json({
        success: true,
        message: "Connexion réussie",
        data: result,
        // chrinore parreile ici
      });
    } catch (error) {
      if (error.message.includes("incorrect")) {
        return res.status(401).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la connexion",
        error: error.message,
      });
    }
  }
  async updateUser(req, res) {
    try {
      const { email: emailQuery } = req.query;
      const { email, name, first_name, password, birthdate, gender, role } =
        req.body;

      if (!emailQuery) {
        return res.status(400).json({
          success: false,
          message: "Email requis pour modification",
        });
      }

      const updatedUser = await userService.userUpdate({
        email: emailQuery,
        name,
        first_name,
        password,
        birthdate,
        gender,
        role,
      });

      res.status(200).json({
        success: true,
        message: "Utilisateur modifié avec succès",
        data: updatedUser,
        // chrinore parreile ici
      });
    } catch (error) {
      console.error("Erreur updateUser:", error);

      if (error.message.includes("Aucun")) {
        return res.status(404).json({
          success: false,
          message: "Aucun utilisateur trouvé",
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  }
  async deleteUSer(req, res) {
    try {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email requis dans les paramètres de requête",
        });
      }

      const userdelete = await userService.deleUser(email);
      res.status(200).json({
        success: true,
        message: "Utilisateur supprimé avec succès",
        data: userdelete,
        // chrinore parreile ici
      });
    } catch (error) {
      console.error("Erreur deleteUser:", error);

      if (error.message.includes("existe")) {
        return res.status(404).json({
          success: false,
          message: "Aucun utilisateur trouvé",
          error: error.message,
        });
      }
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  }
}

module.exports = new UserController();

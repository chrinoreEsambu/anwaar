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
    try {
      const alluser = await userService.getAll();
      res.status(200).json({ message: "okey", alluser });
    } catch (error) {
      console.error("Erreur getAll users:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Erreur serveur",
          error: error.message,
        });
    }
  }
}

module.exports = new UserController();

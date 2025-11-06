const categoryServices = require("../services/category.service");

class categoryController {
  async createCategory(req, res) {
    const { name, description } = req.body;
    try {
      const createCat = await categoryServices.createCategory({
        name,
        description,
      });
      res.status(201).json({
        message: "categorie creer avec sucess",
        sucess: true,
        data: createCat,
      });
    } catch (error) {
      if (error.message.includes("similaire")) {
        res
          .status(409)
          .json({ message: "une categorie similaire existe déja  " });
      }
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la création de l'utilisateur",
        error: error.message,
      });
    }
  }
}

module.exports = new categoryController();

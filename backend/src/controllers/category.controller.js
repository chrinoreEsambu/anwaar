const categoryServices = require("../services/category.service");

class categoryController {
  async createCategory(req, res) {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Le nom et la description sont requis",
      });
    }
    try {
      const createCat = await categoryServices.createCategory({
        name,
        description,
      });
      res.status(201).json({
        message: "Catégorie créée avec succès",
        success: true,
        data: createCat,
      });
    } catch (error) {
      if (error.message.includes("similaire")) {
        return res.status(409).json({
          success: false,
          message: "Une catégorie similaire existe déjà",
        });
      }
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la création de la catégorie",
        error: error.message,
      });
    }
  }
  async getAllCategory(req, res) {
    try {
      const getAllCategory = await categoryServices.getAllCategory();
      res
        .status(200)
        .json({ message: "categiries disponible :", getAllCategory });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la création de la catégorie",
        error: error.message,
      });
    }
  }

  async updateCategory(req, res) {
    const { name: namequery } = req.query;
    const { name,description } = req.body;
    try {
      const update = await categoryServices.updateCategory({
        namequery,
        name: name,
        description: description,
      });
      res
        .status(200)
        .json({ message: "categorie modifier avec success", update });
    } catch (error) {
      if (error.message.includes("pas")) {
        return res.status(409).json({
          success: false,
          message: "Désolé cette categorie n'existe pas ! ",
        });
      }
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la création de la catégorie",
        error: error.message,
      });
    }
  }
}

module.exports = new categoryController();

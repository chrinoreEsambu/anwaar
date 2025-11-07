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
    const getAllCategory = await categoryServices.getAllCategory();
    res
      .status(200)
      .json({ message: "categiries disponible :", getAllCategory });
  }
}

module.exports = new categoryController();

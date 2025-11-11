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
      res.status(200).json({
        success: true,
        message: "Catégories disponibles",
        data: getAllCategory,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des catégories",
        error: error.message,
      });
    }
  }

  async updateCategory(req, res) {
    const { name: namequery } = req.query;
    const { name, description } = req.body;

    if (!namequery) {
      return res.status(400).json({
        success: false,
        message: "Le nom de la catégorie est requis dans les paramètres",
      });
    }

    try {
      const update = await categoryServices.updateCategory({
        namequery,
        name,
        description,
      });
      res.status(200).json({
        success: true,
        message: "Catégorie modifiée avec succès",
        update,
      });
    } catch (error) {
      if (error.message.includes("existe pas")) {
        return res.status(404).json({
          success: false,
          message: "Désolé, cette catégorie n'existe pas",
        });
      }
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la modification de la catégorie",
        error: error.message,
      });
    }
  }
  async deleteCategory(req, res) {
    const { namequery } = req.query;
    try {
      
    } catch (error) {
      
    }
  }
}

module.exports = new categoryController();

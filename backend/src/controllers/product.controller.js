const productService = require("../services/product.service");

class productController {
  async createProduct(req, res) {
    const { name, description, price, state, categoryName } = req.body;
    if (!name || !description || !price || !state || !categoryName) {
      return res
        .status(400)
        .json({ message: "Veuillez remplir tous les champs !" });
    }
    const file = req.file;
    try {
      const productData = {
        name,
        description,
        price,
        state,
        categoryName,
        file,
      };
      const create = await productService.createProduct(productData, file);
      return res.status(201).json({
        success: true,
        message: "Produit créé avec succès",
        create,
      });
    } catch (error) {
      if (error.message.includes("existe déjà")) {
        return res.status(409).json({
          message: "Un produit avec ce nom existe déjà",
        });
      }
      if (error.message.includes("n'existe pas")) {
        return res.status(400).json({
          message: "La catégorie spécifiée n'existe pas",
        });
      }
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la création du produit",
        error: error.message,
      });
    }
  }
  async getAllProduts(req, res) {
    try {
      const Produts = await productService.getAllProduct();
      res.status(200).json({ success: true, message: "All products", Produts });
    } catch (error) {
      if (error.message.includes("getProducts")) {
        res.status(404).json({
          success: false,
          message: "Aucun produit existant dans votre base de donnée",
        });
      }
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la recherche produit",
        error: error.message,
      });
    }
  }
  async getProductByName(req, res) {
    const { productName } = req.query;
    if (!productName) {
      return res.status(400).json({
        message: "Le nom du produit est requis pour faire cette recherche",
      });
    }
    try {
      const find = await productService.getProductByName(productName);
      res.status(200).json({ message: "product find :", find });
    } catch (error) {
      if (error.message.includes("Aucun")) {
        res.status(404).json({
          success: false,
          message: "Aucun produit ne correspond a votre recherche !",
        });
      }
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la recherche du produit",
        error: error.message,
      });
    }
  }
  async updateProduct(req, res) {
    const { name: namequery } = req.query;
    const { name, description, price, state, categoryName } = req.body;
    if (!namequery) {
      return res.status(400).json({
        success: false,
        message: "Le nom du produit est requis dans les paramètres",
      });
    }
    try {
      const update = await productService.updateProduct({
        namequery,
        name,
        description,
        price,
        state,
        categoryName,
      });
      res.status(200).json({
        success: true,
        message: "Produit mis à jour avec succès",
        update,
      });
    } catch (error) {
      if (error.message.includes("n'existe plus")) {
        res.status(404).json({
          success: false,
          message: "Le produit n'existe pas",
        });
      }
      if (error.message.includes("catégorie")) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour du produit",
        error: error.message,
      });
    }
  }
  async deleteproduct(req, res) {
    const { productName } = req.query;
    if (!productName) {
      return res.status(400).json({
        success: false,
        message: "Le nom du produit est requis",
      });
    }
    try {
      const deleteProd = await productService.deleteProduct(productName);
      res.status(200).json({
        success: true,
        message: "Produit supprimé avec succès",
        deleteProd,
      });
    } catch (error) {
      if (error.message.includes("n'existe plus")) {
        res.status(404).json({
          success: false,
          message: "Le produit n'existe pas",
        });
      }
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la suppression du produit",
        error: error.message,
      });
    }
  }
}

module.exports = new productController();

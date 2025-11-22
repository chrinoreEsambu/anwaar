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
    try {
      const find = await productService.getProductByName({ productName });
      if (!find) {
        res.status(404).json({
          message: "le nom du produit est requis pour faire cette recherche",
        });
      }
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
    const { element } = req.query;
    try {
      const update = await productService.updateProduct({ element });
      res.status(201).json({
        success: true,
        messae: "produit mis a jour avec succès",
        update,
      });
    } catch (error) {
      if (error.message.includes("n'existe plus !")) {
        res.status(404).json({
          success: false,
          message: "Le produit voulant etre mis ajour n'existe plus !",
        });
      }
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la mis a jour du produit",
        error: error.message,
      });
    }
  }
  async deleteproduct(req, res) {
    const { productName } = req.query;
    try {
      const deleteProd = await productService.deleteProduct({ productName });
      res
        .status(200)
        .json({
          success: true,
          message: "Produit supprimer avec succès",
          deleteProd,
        });
    } catch (error) {
      if (error.message.includes("n'existe plus !")) {
        res.status(404).json({
          success: false,
          message: "Le produit voulant etre supprimer n'existe plus !",
        });
      }
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la mis a jour du produit",
        error: error.message,
      });
    }
  }
}

module.exports = new productController();

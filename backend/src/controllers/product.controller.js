const productService = require("../services/product.service");

class productController {
  async createProduct(req, res) {
    const { name, description, price, state, categoryName } = req.body;
    if (!name || !description || !price || !state || !categoryName) {
      return res
        .status(404)
        .json({ message: "Veuillez remplir les champs vide !" });
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
    } catch (error) {
      if (error.message.includes("existe déjà")) {
        return res.status(409).json({
          message: " Un produit avec ce nom existe déjà",
        });
      }
      if (error.message.includes("n'existe pas")) {
        return res.status(409).json({
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
}

module.exports = productController();

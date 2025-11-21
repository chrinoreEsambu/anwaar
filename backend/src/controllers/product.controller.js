const productService = require("../services/product.service");

class productController {
  async createProduct(req, res) {
    const {
      reference,
      name,
      description,
      price,
      picture_url,
      state,
      categoryName,
    } = req.body;
  }
}

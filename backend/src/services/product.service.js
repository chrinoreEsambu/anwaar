const productRepository = require("../repositories/product.repository");
const categoryRepository = require("../repositories/category.repository");
const cloudinary = require("../config/cloudinary");

class productService {
  async createProduct(productData, file) {
    const existingProduct = await productRepository.findByName(
      productData.name
    );
    if (existingProduct) {
      throw new Error("Un produit avec ce nom existe déjà");
    }

    if (productData.category) {
      const existingCategory = await categoryRepository.getCategoryByName(
        productData.category
      );
      if (!existingCategory) {
        throw new Error("La catégorie spécifiée n'existe pas");
      }
    }
    let pictureUrl = null;

    if (file) {
      const upload = cloudinary.uploader.upload(file.path, {
        folder: "products",
      });
    }
    pictureUrl = uploaded.secure_url;

    const create = await productRepository.createProduct({
      reference: productData.reference,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      picture_url: pictureUrl,
      state: productData.state,
      categoryName: productData.category,
    });

    return create;
  }
}

module.exports = new productService();

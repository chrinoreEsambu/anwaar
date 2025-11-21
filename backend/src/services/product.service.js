const productRepository = require("../repositories/product.repository");
const categoryRepository = require("../repositories/category.repository");
const crypto = require("crypto");
const cloudinary = require("../config/cloudinary");

class productService {
  async createProduct(productData, file) {
    const existingProduct = await productRepository.findProductByName(
      productData.name
    );
    if (existingProduct) {
      throw new Error("Un produit avec ce nom existe déjà");
    }

    if (productData.categoryName) {
      const existingCategory = await categoryRepository.getCategoryByName(
        productData.categoryName
      );
      if (!existingCategory) {
        throw new Error("La catégorie spécifiée n'existe pas");
      }
    }
    let pictureUrl = null;

    if (file) {
      const uploaded = await cloudinary.uploader.upload(file.path, {
        folder: "products",
      });
      pictureUrl = uploaded.secure_url;
    }
    const date = new Date().getFullYear();
    const uuid = crypto.randomUUID();
    const shortuuid = uuid.substring(0, 8);
    const suffix = `${shortuuid}-${date}`;

    const create = await productRepository.createProduct({
      reference: suffix,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      picture_url: pictureUrl,
      state: productData.state,
      categoryName: productData.categoryName,
    });

    return create;
  }
}

module.exports = new productService();

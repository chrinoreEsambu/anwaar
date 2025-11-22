const productRepository = require("../repositories/product.repository");
const categoryRepository = require("../repositories/category.repository");
const crypto = require("crypto");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

class productService {
  async createProduct(productData, file) {
    const existingProduct = await productRepository.findProductByName(
      productData.name
    );
    if (existingProduct) {
      throw new Error("Un produit avec ce nom existe déjà");
    }

    if (productData.categoryName) {
      const existingCategory = await categoryRepository.getAllCategoriesByname(
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

    // Supprimer le fichier local après upload
    if (file && file.path) {
      fs.unlink(file.path, (err) => {
        if (err) console.error("Erreur suppression fichier local:", err);
      });
    }

    return create;
  }
  async getAllProduct() {
    const getProducts = await productRepository.getAllProduct();
    if (!getProducts) {
      throw new Error("Aucun produit existant dans votre base de donnée");
    }
    return getProducts;
  }
  async getProductByName(productName) {
    const finder = await productRepository.findProductByName(productName.name);
    if (!finder) {
      throw new Error("Aucun produit ne correspond a votre recherche !");
    }
    return finder;
  }
  async updateProduct(pruductData) {
    const { element } = req.query;
    const finder = await productRepository.findProductByName(element.name);
    if (!finder) {
      throw new Error("Le produit voulant etre mis ajour n'existe plus !");
    }
    const update = await productRepository.updateProduct(element);
    return update;
  }

  async deleteProduct(productData) {
    const finder = await productRepository.findProductByName(productData.name);
    if (!finder) {
      throw new Error("Le produit voulant etre supprimer n'existe plus !");
    }
    const deleteProd = await productRepository.deleteProduct(productData);
    return deleteProd;
  }
}

module.exports = new productService();

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
    if (!getProducts || getProducts.length === 0) {
      throw new Error("getProducts");
    }
    return getProducts;
  }
  async getProductByName(productName) {
    if (!productName) {
      throw new Error("Le nom du produit est requis");
    }
    const finder = await productRepository.findProductByName(productName);
    if (!finder) {
      throw new Error("Aucun");
    }
    return finder;
  }
  async updateProduct(data) {
    const { namequery, name, description, price, state, categoryName } = data;
    const existing = await productRepository.findProductByName(namequery);
    if (!existing) {
      throw new Error("n'existe plus !");
    }
    if (categoryName) {
      const category = await categoryRepository.getAllCategoriesByname(
        categoryName
      );
      if (!category) {
        throw new Error("La catégorie spécifiée n'existe pas");
      }
    }
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (state) updateData.state = state;
    if (categoryName) updateData.categoryName = categoryName;
    return await productRepository.updateProduct(namequery, updateData);
  }

  async deleteProduct(productName) {
    const existing = await productRepository.findProductByName(productName);
    if (!existing) {
      throw new Error("n'existe plus !");
    }
    return await productRepository.deleteProduct(productName);
  }
}

module.exports = new productService();

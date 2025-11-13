const productRepository = require("../repositories/product.repository");
const categoryRepository = require("../repositories/category.repository");

class productService {
  async createProduct(productData) {
    const existingProduct = await productRepository.findByName(
      productData.name
    );
    if (existingProduct) {
      throw new Error("Un produit avec ce nom existe déjà");
    }

    if (productData.category) {
      const existingCategory = await categoryRepository.getCategoryByName(
        productData.categor
      );
      if (!existingCategory) {
        throw new Error("La catégorie spécifiée n'existe pas");
      }
    }

    const create = await productRepository.createProduct({
      reference: productData.reference,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      picture_url: productData.picture_url,
      state: productData.state,
      categoryId: productData.category,
    });

    return create;
  }
}

module.exports = new productService();

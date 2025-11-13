const prisma = require("../config/prismaClient");

class productRepository {
  async createProduct(productData) {
    return await prisma.products.create({
      data: productData,
    });
  }
}

module.exports = new productRepository();

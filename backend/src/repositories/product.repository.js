const prisma = require("../config/prismaClient");

class productRepository {
  async createProduct(productData) {
    return await prisma.products.create({
      data: productData,
    });
  }
  async findProductByName(name) {
    return await prisma.products.findUnique({ where: { name: name } });
  }
}

module.exports = new productRepository();

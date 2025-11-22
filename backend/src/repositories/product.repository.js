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

  async getAllProduct() {
    return await prisma.products.findMany();
  }
  async updateProduct(productData) {
    return await prisma.products.update({
      where: { name: productData.name },
      data: productData,
    });
  }
  async deleteProduct(productData) {
    return await prisma.products.delete({ where: { name: productData.name } });
  }
}

module.exports = new productRepository();

const prisma = require("../config/prismaClient");

class categoryRepository {
  async createCategory(categoryData) {
      const create = await prisma.category.create({
          data: {
              name: categoryData.name,
              description: categoryData.description
          }
    });
      return create;
  }
}

module.exports = new categoryRepository();

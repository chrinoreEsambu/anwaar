const prisma = require("../config/prismaClient");

class categoryRepository {
  async createCategory(categoryData) {
    const create = await prisma.category.create({
      data: {
        name: categoryData.name,
        description: categoryData.description,
      },
    });
    return create;
  }

  async getAllCategories() {
    return await prisma.category.findMany();
    // return getAll;
    }
    
    
}

module.exports = new categoryRepository();

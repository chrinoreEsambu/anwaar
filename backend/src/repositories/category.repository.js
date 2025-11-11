const prisma = require("../config/prismaClient");

class categoryRepository {
  async createCategory(categoryData) {
    return await prisma.category.create({
      data: {
        name: categoryData.name,
        description: categoryData.description,
      },
    });
  }

  async getAllCategories() {
    return await prisma.category.findMany();
  }
  async getAllCategoriesByname(name) {
    return await prisma.category.findUnique({ where: { name: name } });
  }
  async updateCategory(categoryUpdateData) {
    return await prisma.category.update({
      where: { name: categoryUpdateData.namequery },
      data: {
        name: categoryUpdateData.name,
        description: categoryUpdateData.description,
      },
    });
  }
  async deleteCategory(name) {
    return await prisma.category.delete({ where: { name: name } });
  }
}

module.exports = new categoryRepository();

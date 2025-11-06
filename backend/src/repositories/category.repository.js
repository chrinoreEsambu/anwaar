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
  async getAllCategoriesByname(name) {
    return await prisma.category.findUnique({ where: { name: name } });
  }
  async updateCategory(name, categoryUpdateData) {
    return await prisma.category.update({
      where: { name: name },
      data: categoryUpdateData,
    });
  }
}

module.exports = new categoryRepository();

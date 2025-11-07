const categoryRepository = require("../repositories/category.repository.js");

class categoryServices {
  async createCategory(categoryData) {
    const existingCategorie = await categoryRepository.getAllCategoriesByname(
      categoryData.name
    );

    if (existingCategorie) {
      throw new Error("une categorie similaire existe déjà");
    }
    const createCatagory = await categoryRepository.createCategory({
      name: categoryData.name,
      description: categoryData.description,
    });
    return createCatagory;
  }
  async getAllCategory() {
    const getCategories = await categoryRepository.getAllCategories();
    return getCategories;
  }
  async updateCategory(name, categoryUpdateData) {
    const existingCategorieName =
      await categoryRepository.getAllCategoriesByname(categoryUpdateData.name);

    try {
      const updatecategory = await categoryRepository.updateCategory(
        categoryUpdateData.name,
        {
          description: categoryUpdateData.description,
        }
      );
      return updatecategory;
    } catch (error) {
      if (!existingCategorieName) {
        throw new Error("cette categorie n'existe pas");
      }
      throw error;
    }
  }
}

module.exports = new categoryServices();

const categoryRepository = require("../repositories/category.repository.js");

class categoryServices {
  async createCategory(categoryData) {
    const existingCategorie = await categoryRepository.getAllCategoriesByname(
      categoryData.name
    );

    if (existingCategorie) {
      throw new Error("Une catégorie similaire existe déjà");
    }
    const createCategory = await categoryRepository.createCategory({
      name: categoryData.name,
      description: categoryData.description,
    });
    return createCategory;
  }
  async getAllCategory() {
    const getCategories = await categoryRepository.getAllCategories();
    return getCategories;
  }
  async updateCategory(categoryUpdateData) {
    const existingCategorie = await categoryRepository.getAllCategoriesByname(
      categoryUpdateData.namequery
    );

    if (!existingCategorie) {
      throw new Error("Cette catégorie n'existe pas");
    }

    const updatecategory = await categoryRepository.updateCategory(
      categoryUpdateData
    );

    return updatecategory;
  }
}

module.exports = new categoryServices();

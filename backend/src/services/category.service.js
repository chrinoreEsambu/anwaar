const categoryRepository = require("../repositories/category.repository.js");

class categoryServices {
  async createCategory(categoryData) {
    const existingCategorie = await categoryRepository.getAllCategoriesByname(
      categoryData.name
    );
    if (existingUser) {
      throw new Error("une categorie similaire existe déjà");
    }
    const createCatagory = await categoryRepository.createCategory({
      name: categoryData.name,
      description: categoryData.description,
    });
  }
}

module.exports = new categoryServices();

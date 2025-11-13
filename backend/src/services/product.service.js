const productRepository = require("../repositories/product.repository");

class productService {
    async createProduct(pruductData) {
       const existingUser = await userRepository.findByEmail(userData.email);
          if (existingUser) {
            throw new Error("Un utilisateur avec cet email existe déjà");
          }
  }
}

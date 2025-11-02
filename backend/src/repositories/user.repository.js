const prisma = require("../config/prismaClient");

class UserRepository {
  async create(userData) {
    return await prisma.users.create({
      data: userData,
    });
  }

  async findByEmail(email) {
    return await prisma.users.findUnique({
      where: { email },
    });
  }
}

module.exports = new UserRepository();

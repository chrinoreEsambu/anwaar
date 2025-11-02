const prisma = require("../config/prismaClient");

class UserRepository {
  async createUser (userData) {
    return await prisma.users.create({
      data: userData,
    });
  }

  async findAll() {
    return await prisma.users.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findByEmail(email) {
    // if (!email) return null;
    return await prisma.users.findUnique({
      where: { email },
    });
  }
}

module.exports = new UserRepository();

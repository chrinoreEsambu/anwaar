const prisma = require("../config/prismaClient");

class UserRepository {
  async create(userData) {
    return await prisma.users.create({
      data: userData,
    });
  }

  async findAll() {
    return await prisma.users.findMany({
      orderBy: {
        created_at: "desc",
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

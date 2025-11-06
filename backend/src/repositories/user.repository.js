const prisma = require("../config/prismaClient");

class UserRepository {
  async createUser(userData) {
    return await prisma.users.create({
      data: userData,
    });
  }

  async findAll(jump) {
    const limit = 10;
    return await prisma.users.findMany({
      orderBy: {
        createdAt: "asc",
      },
      skip: jump,
      take: limit,
    });
  }

  async findByEmail(email) {
    return await prisma.users.findUnique({
      where: { email },
    });
  }

  async update(email, updateData) {
    return await prisma.users.update({
      where: { email },
      data: updateData,
    });
  }

  async deleteUser(userid) {
    return await prisma.users.delete({ where: { id: userid } });
  }
}

module.exports = new UserRepository();

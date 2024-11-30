import prisma from '../db/index.js'; 

async function insertUser(userData) {
  let newUser = await prisma.user.create({
    data: {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role,
    },
  });
  return newUser;
}

async function findUsers() {
  let users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  return users;
}

async function findUserById(id) {
  let user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  return user;
}

async function editUser(id, userData) {
  let updatedUser = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role,
    },
  });
  return updatedUser;
}

async function deleteUser(id) {
  await prisma.user.delete({
    where: {
      id: parseInt(id),
    },
  });
}

export default { insertUser, findUsers, findUserById, editUser, deleteUser };

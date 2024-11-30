import bcrypt from "bcrypt";
import userRepository from "./user.repository.js";

async function createUser(newUserData) {
  let hashedPassword = await bcrypt.hash(newUserData.password, 10);

  newUserData.password = hashedPassword;
  let newUser = await userRepository.insertUser(newUserData);
  return newUser;
}

async function getAllUsers() {
  let users = await userRepository.findUsers();
  return users;
}

async function getUserById(id) {
  let user = await userRepository.findUserById(id);
  if (!user) {
    throw Error("User not found");
  }
  return user;
}

async function editUserById(id, userData) {
  if (userData.password) {
    let hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
  }
  await getUserById(id);
  let updatedUser = await userRepository.editUser(id, userData);
  return updatedUser;
}

async function deleteUserById(id) {
  await getUserById(id);
  await userRepository.deleteUser(id);
}

export default {
  createUser,
  getAllUsers,
  getUserById,
  editUserById,
  deleteUserById,
};
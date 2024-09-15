// repositories/AuthorizedUserRepository.js
import AuthorizedUser from "../models/AuthorizedUsers.js";

export async function addAuthorizedUser(userId, promotedBy) {
  try {
    const authorizedUser = new AuthorizedUser({
      userId,
      promotedBy,
    });
    return await authorizedUser.save();
  } catch (error) {
    throw new Error("Error adding authorized user: " + error.message);
  }
}

export async function getAuthorizedUserById(userId) {
  try {
    return await AuthorizedUser.findOne({ userId });
  } catch (error) {
    throw new Error("Error fetching authorized user: " + error.message);
  }
}

export async function getAllAuthorizedUsers() {
  try {
    return await AuthorizedUser.find();
  } catch (error) {
    throw new Error("Error fetching authorized users: " + error.message);
  }
}

export async function deleteAuthorizedUser(userId) {
  try {
    return await AuthorizedUser.deleteOne({ userId });
  } catch (error) {
    throw new Error("Error deleting authorized user: " + error.message);
  }
}

// controllers/AuthorizedUserController.js
import {
  addAuthorizedUser,
  getAuthorizedUserById,
  getAllAuthorizedUsers,
  deleteAuthorizedUser,
} from "../repositories/AuthorizedRepository.js";

export async function createAuthorizedUser(req, res) {
  const { userId, promotedBy } = req.body;
  try {
    const authorizedUser = await addAuthorizedUser(userId, promotedBy);
    res.status(201).json(authorizedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getAuthorizedUser(req, res) {
  const { userId } = req.params;
  try {
    const authorizedUser = await getAuthorizedUserById(userId);
    if (!authorizedUser) {
      return res.status(404).json({ message: "Authorized user not found" });
    }
    res.json(authorizedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getAllAuthorizedUsersHandler(req, res) {
  try {
    const authorizedUsers = await getAllAuthorizedUsers();
    res.json(authorizedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteAuthorizedUserHandler(req, res) {
  const { userId } = req.params;
  try {
    await deleteAuthorizedUser(userId);
    res.status(200).json({ message: "Authorized user deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

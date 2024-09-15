// routes/authorizedUserRoutes.js
import express from "express";
import {
  createAuthorizedUser,
  getAuthorizedUser,
  getAllAuthorizedUsersHandler,
  deleteAuthorizedUserHandler,
} from "../controllers/authorizedUsersController.js";

const router = express.Router();

// Route to create a new authorized user
router.post("/authorized-users", createAuthorizedUser);

// Route to get a specific authorized user by userId
router.get("/authorized-users/:userId", getAuthorizedUser);

// Route to get all authorized users
router.get("/authorized-users", getAllAuthorizedUsersHandler);

// Route to delete an authorized user
router.delete("/authorized-users/:userId", deleteAuthorizedUserHandler);

export default router;

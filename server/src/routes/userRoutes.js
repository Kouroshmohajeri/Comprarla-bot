import express from "express";
import UserController from "../controllers/UserController.js";

const router = express.Router();

// POST request to save or update user data
router.post("/add", UserController.handleUserData);

// GET request to fetch user details by ID
router.get("/:userId", UserController.getUserDetails);

// PUT request to update user details
router.put("/:userId", UserController.updateUserDetails);

// DELETE request to delete a user by ID
router.delete("/:userId", UserController.deleteUser);

// GET request to fetch all users
router.get("/", UserController.getAllUsers);

export default router;

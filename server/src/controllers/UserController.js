// src/controllers/UserController.js

import UserRepository from "../repositories/UserRepository.js";

class UserController {
  // Handle the creation or update of user data
  async handleUserData(req, res) {
    const {
      userId,
      username,
      dateJoined,
      points,
      invitations,
      tasksDone,
      isOG,
      profilePhotoUrl, // Add this line
    } = req.body;

    try {
      let user = await UserRepository.findUserById(userId);

      if (!user) {
        user = await UserRepository.createUser({
          userId,
          username,
          dateJoined,
          points,
          invitations,
          tasksDone,
          isOG,
          profilePhotoUrl, // Add this line
        });
      } else {
        user.username = username;
        user.dateJoined = dateJoined;
        user.points = points;
        user.invitations = invitations;
        user.tasksDone = tasksDone;
        user.isOG = isOG;
        user.profilePhotoUrl = profilePhotoUrl; // Add this line
        await user.save();
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error handling user data", error });
    }
  }

  // Get user details by ID
  async getUserDetails(req, res) {
    const { userId } = req.params;

    try {
      const user = await UserRepository.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user details", error });
    }
  }

  // Update user details by ID
  async updateUserDetails(req, res) {
    const { userId } = req.params;
    const updateData = req.body;

    try {
      const updatedUser = await UserRepository.updateUser(userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error updating user details", error });
    }
  }

  // Delete a user by ID
  async deleteUser(req, res) {
    const { userId } = req.params;

    try {
      const deletedUser = await UserRepository.deleteUser(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error });
    }
  }

  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await UserRepository.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error });
    }
  }
}

export default new UserController();

import UserRepository from "../repositories/UserRepository.js";
import { v4 as uuidv4 } from "uuid";

class UserController {
  // Handle the creation or update of user data
  async handleUserData(req, res) {
    const {
      userId,
      username,
      firstName,
      lastName,
      dateJoined,
      profilePhotoUrl,
      invitationCode, // Capture invitation code if present
    } = req.body;

    try {
      let user = await UserRepository.findUserById(userId);

      if (!user) {
        // Create a new user with 100 points and generate a unique invitation code
        const generatedInvitationCode = uuidv4(); // Generate a unique code
        let points = 100; // Base points for the new user

        // Check if the user joined via an invitation link
        let invitedByUser = null;
        if (invitationCode) {
          invitedByUser = await UserRepository.findUserByInvitationCode(
            invitationCode
          );
          if (invitedByUser) {
            points += 50; // Award 50 bonus points to the new user
            invitedByUser.points += 100; // Award 100 points to the inviter
            invitedByUser.invitations.push(userId); // Add new user's ID to the inviter's invitations list
            await invitedByUser.save(); // Save the updated inviter details
          }
        }

        // Create the new user with the calculated points and generated invitation code
        user = await UserRepository.createUser({
          userId,
          username,
          firstName,
          lastName,
          dateJoined,
          points,
          invitations: [], // Start with an empty invitations list
          invitationCode: generatedInvitationCode,
          invitedBy: invitedByUser ? invitedByUser.userId : null,
          tasksDone: 0,
          isOG: false,
          profilePhotoUrl,
        });
      } else {
        // Update existing user information
        user.username = username;
        user.firstName = firstName;
        user.lastName = lastName;
        user.profilePhotoUrl = profilePhotoUrl;
        await user.save(); // Save the updated user details
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error handling user data", error });
    }
  }

  // Generate a new invitation code
  async generateInvitationCode(req, res) {
    const { userId } = req.params;

    try {
      const user = await UserRepository.findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const newInvitationCode = uuidv4();
      user.invitationCode = newInvitationCode;
      await user.save();

      res.status(200).json({ invitationCode: newInvitationCode });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error generating invitation code", error });
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

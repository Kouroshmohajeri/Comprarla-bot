import User from "../models/User.js";

class UserRepository {
  async findUserById(userId) {
    return await User.findOne({ userId });
  }

  async createUser(data) {
    const user = new User(data);
    return await user.save();
  }

  async getUserById(userId) {
    return await User.findOne({ userId });
  }

  async updateUser(userId, updateData) {
    return await User.findOneAndUpdate({ userId }, updateData, { new: true });
  }

  async deleteUser(userId) {
    return await User.findOneAndDelete({ userId });
  }

  async getAllUsers() {
    return await User.find({});
  }
}

export default new UserRepository();

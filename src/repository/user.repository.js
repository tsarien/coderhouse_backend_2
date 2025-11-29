import User from "../dao/models/user.model.js";

export default class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(id) {
    return await User.findById(id);
  }

  async createUser(data) {
    return await User.create(data);
  }

  async updateUser(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }
}

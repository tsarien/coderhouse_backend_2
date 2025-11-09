import User from "./models/user.model";

export class UsuariosMongoManager {
  static async getUsers() {
    return await User.find().lean();
  }

  static async getUserBy(filtro = {}) {
    return await User.findOne(filtro).lean();
  }

  static async createUser(usuario) {
    let nuevoUsuario = await User.create(usuario);
    return nuevoUsuario.toJSON();
  }
}

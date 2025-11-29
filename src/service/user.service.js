import UserRepository from "../repository/user.repository.js";
import { generaHash, validaPass } from "../utils.js";

const userRepository = new UserRepository();

export default class UserService {
  async register(data) {
    const { first_name, last_name, email, age, password } = data;

    if (!first_name || !email || !password) {
      throw new Error("El nombre, email y contraseña son obligatorios.");
    }

    const existe = await userRepository.findByEmail(email);
    if (existe) throw new Error(`El email ${email} ya está registrado.`);

    const nuevo = await userRepository.createUser({
      first_name,
      last_name,
      email,
      age,
      password: generaHash(password),
    });

    const userObj = nuevo.toObject();
    delete userObj.password;
    return userObj;
  }

  async login(email, password) {
    const usuario = await userRepository.findByEmail(email);
    if (!usuario) throw new Error("Credenciales inválidas.");

    const esValido = validaPass(password, usuario.password);
    if (!esValido) throw new Error("Credenciales inválidas.");

    const userObj = usuario.toObject();
    delete userObj.password;
    return userObj;
  }

  async getUserById(id) {
    const usuario = await userRepository.findById(id);
    if (!usuario) throw new Error("Usuario no encontrado.");
    return usuario;
  }

  async updateUser(id, data) {
    if (data.password) {
      data.password = generaHash(data.password);
    }

    const actualizado = await userRepository.updateUser(id, data);
    if (!actualizado) throw new Error("Usuario no encontrado.");

    const userObj = actualizado.toObject();
    delete userObj.password;

    return userObj;
  }

  async deleteUser(id) {
    const eliminado = await userRepository.deleteUser(id);
    if (!eliminado) throw new Error("Usuario no encontrado.");
    return eliminado;
  }
}

import UserService from "../service/user.service.js";

const userService = new UserService();

export default class UserController {
  async getUser(req, res) {
    try {
      const usuario = await userService.getUserById(req.params.uid);
      res.json(usuario);
    } catch (error) {
      res.status(404).json({ status: "error", message: "Error al obtener el usuario", error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const usuario = await userService.updateUser(req.params.uid, req.body);
      res.json({ message: "Usuario actualizado", usuario });
    } catch (error) {
      res.status(400).json({ status: "error", message: "Error al actualizar el usuario", error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      await userService.deleteUser(req.params.uid);
      res.json({ message: "Usuario eliminado" });
    } catch (error) {
      res.status(404).json({ status: "error", message: "Error al eliminar el usuario", error: error.message });
    }
  }
}

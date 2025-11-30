import Cart from "../dao/models/cart.model.js";
import User from "../dao/models/user.model.js";

export const getOrCreateCart = async (req, res, next) => {
  try {
    let cartId = null;

    // Si el usuario está autenticado, usar su carrito
    if (req.user?._id) {
      // Solo seleccionar el campo cart para evitar traer datos innecesarios
      const user = await User.findById(req.user._id).select("cart").lean();
      
      if (user?.cart) {
        cartId = user.cart.toString();
      } else {
        // Crear carrito y asignarlo al usuario en una sola operación
        const newCart = await Cart.create({});
        await User.findByIdAndUpdate(req.user._id, { cart: newCart._id });
        cartId = newCart._id.toString();
      }
    } else if (req.session?.cartId) {
      // Verificar que el carrito de sesión existe (solo verificar existencia, no traer datos)
      const cartExists = await Cart.exists({ _id: req.session.cartId });
      cartId = cartExists ? req.session.cartId : null;
    }

    // Si no hay carrito, crear uno nuevo
    if (!cartId) {
      const newCart = await Cart.create({});
      cartId = newCart._id.toString();
      
      if (req.user?._id) {
        await User.findByIdAndUpdate(req.user._id, { cart: newCart._id });
      } else {
        if (!req.session) req.session = {};
        req.session.cartId = cartId;
      }
    }

    res.locals.cartId = cartId;
    req.cartId = cartId;
    next();
  } catch (error) {
    console.error("Error al obtener/crear carrito:", error);
    // En caso de error, intentar crear un carrito de emergencia
    try {
      const newCart = await Cart.create({});
      const cartId = newCart._id.toString();
      res.locals.cartId = cartId;
      req.cartId = cartId;
      if (req.session) req.session.cartId = cartId;
    } catch (createError) {
      console.error("Error al crear carrito de emergencia:", createError);
      res.locals.cartId = null;
      req.cartId = null;
    }
    next();
  }
};

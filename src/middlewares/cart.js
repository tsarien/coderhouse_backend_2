import Cart from "../dao/models/cart.model.js";
import User from "../dao/models/user.model.js";

export const getOrCreateCart = async (req, res, next) => {
  try {
    let cartId = null;

    if (req.user && req.user._id) {
      try {
        const user = await User.findById(req.user._id).populate("cart");

        if (user) {
          if (user.cart) {
            cartId = user.cart._id.toString();
          } else {
            const newCart = await Cart.create({});
            user.cart = newCart._id;
            await user.save();
            cartId = newCart._id.toString();
          }
        }
      } catch (userError) {
        console.error("Error al buscar usuario:", userError);
      }
    }

    if (!cartId) {
      if (req.session && req.session.cartId) {
        try {
          const cart = await Cart.findById(req.session.cartId);
          if (cart) {
            cartId = req.session.cartId;
          } else {
            const newCart = await Cart.create({});
            req.session.cartId = newCart._id.toString();
            cartId = newCart._id.toString();
          }
        } catch (cartError) {
          const newCart = await Cart.create({});
          req.session.cartId = newCart._id.toString();
          cartId = newCart._id.toString();
        }
      } else {
        const newCart = await Cart.create({});
        if (!req.session) {
          req.session = {};
        }
        req.session.cartId = newCart._id.toString();
        cartId = newCart._id.toString();
      }
    }

    res.locals.cartId = cartId;
    req.cartId = cartId;

    next();
  } catch (error) {
    console.error("Error al obtener/crear carrito:", error);
    try {
      const newCart = await Cart.create({});
      res.locals.cartId = newCart._id.toString();
      req.cartId = newCart._id.toString();
      if (req.session) {
        req.session.cartId = newCart._id.toString();
      }
    } catch (createError) {
      console.error("Error al crear carrito de emergencia:", createError);
      res.locals.cartId = null;
      req.cartId = null;
    }
    next();
  }
};

import Cart from "../dao/models/cart.model.js";
import User from "../dao/models/user.model.js";

export const getOrCreateCart = async (req, res, next) => {
  try {
    let cartId = null;

    if (req.user?._id) {
      const user = await User.findById(req.user._id).select("cart").lean();
      
      if (user?.cart) {
        cartId = user.cart.toString();
      } else {
        const newCart = await Cart.create({});
        await User.findByIdAndUpdate(req.user._id, { cart: newCart._id });
        cartId = newCart._id.toString();
      }
    } else if (req.session?.cartId) {
      const cartExists = await Cart.exists({ _id: req.session.cartId });
      cartId = cartExists ? req.session.cartId : null;
    }

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

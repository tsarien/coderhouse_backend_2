import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true, index: true },
  age: Number,
  password: String,
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", index: true },
  role: { type: String, default: "user", index: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

userSchema.index({ email: 1, cart: 1 });

const User = mongoose.model("User", userSchema);
export default User;

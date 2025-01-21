import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["customer", "agent", "admin"],
    default: "customer",
  },
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const generateToken = (user) => {
  console.log("user",user)
 const payload = {
   uuid: user._id,
   name: user.name,
   email: user.email,
   role:user.role
 };

 // Generate the JWT token
 const token = jwt.sign(
   payload,
   process.env.JWT_SECRET,
   { expiresIn: '24h' } // Token expires in 10 minutes
 );

 return token;
};

const User =new mongoose.model("User", UserSchema);
export { User,generateToken}; 

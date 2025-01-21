import bcrypt from "bcryptjs";
import {generateToken, User} from "../models/user.js";
import dotenv from "dotenv";

dotenv.config()

// Register a new user
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    
    try {
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: "User already exists" });
  
      const user = await User.create({ name, email, password, role });
      const newUser = {
          name: user.name,
          email: user.email,
          role: user.role
      };
      
      res.status(201).json({
        message: "User registered successfully",
        newUser,
        token: generateToken(user),
      });
    } catch (error) {
      console.error("Error registering user:", error);  
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
 
// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Request Body:", req.body);

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      const newUser = {
        name: user.name,
        email: user.email,
        role: user.role,
      };

      // Generate token using only user._id
      const token = generateToken(user);
      // Respond with user info and token
      res.status(200).json({
        message: "User login successfully",
        newUser,
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

  

export {registerUser, loginUser}
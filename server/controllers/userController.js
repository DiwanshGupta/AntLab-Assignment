import bcrypt from "bcryptjs";
import {generateToken, User} from "../models/user.js";
import dotenv from "dotenv";
import Ticket from "../models/tickets.js";

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
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      const newUser = {
        name: user.name,
        email: user.email,
        role: user.role,
      };

      const token = generateToken(user);
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


// Get total number of customers and tickets
const getStats = async (req, res) => {
  try {
    const customerCount = await User.countDocuments({ role: 'customer' });
    const ticketCount = await Ticket.countDocuments();

    res.status(200).json({ customers: customerCount, tickets: ticketCount });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


//  Create a new customer
const createCustomer = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const customerExists = await User.findOne({ email });
    if (customerExists) return res.status(400).json({ message: 'Customer already exists' });

    const customer = await User.create({ name, email, password, role: 'customer' });

    res.status(201).json({ message: 'Customer created successfully', customer });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find(); 

    res.status(200).json({
      message: 'Customers fetched successfully',
      customers,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      message: 'Failed to fetch customers',
      error: error.message,
    });
  }
};
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user (for all roles)
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (role) user.role = role;

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {registerUser, loginUser,getStats, updateUser, deleteUser ,createCustomer,getAllCustomers}
import express from "express";
import { createCustomer,  deleteUser,  getAllCustomers, getStats, loginUser, registerUser, updateUser } from "../controllers/userController.js";
import authenticateUser from "../middleware/authorization.js";

const authRouter = express.Router();


authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get('/stats', getStats);
authRouter.put('/customer/:id', updateUser);
authRouter.delete('/customer/:id', deleteUser);
authRouter.post('/customer', createCustomer);
authRouter.get('/customer/all', authenticateUser, getAllCustomers);
export default authRouter;
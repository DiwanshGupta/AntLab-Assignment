import express from "express";
import { addNoteAgent, addNoteToTicket, createTicket, getNotesForTicket, getTickets, getTicketsByCustomerId, getUserTickets, updateTicketStatus } from "../controllers/ticketControllers.js";
import authenticateUser from "../middleware/authorization.js";

const ticketRouter = express.Router();

ticketRouter.post("/",authenticateUser, createTicket);
ticketRouter.get("/", getUserTickets);
ticketRouter.get("/get/all", authenticateUser,getTickets);
ticketRouter.get("/get/customer", authenticateUser, getTicketsByCustomerId);
ticketRouter.post("/addNote", authenticateUser,addNoteToTicket);
ticketRouter.post("/agent/addNote", authenticateUser,addNoteAgent);
ticketRouter.put("/agent/updateStatus", authenticateUser,updateTicketStatus);
ticketRouter.get("/:ticketId/notes", authenticateUser,getNotesForTicket);

export default ticketRouter;
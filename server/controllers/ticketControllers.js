import mongoose from "mongoose";
import Ticket from "../models/tickets.js";
import { User } from "../models/user.js";

// Create a new ticket
const createTicket = async (req, res) => {
  const { title } = req.body;
  const customerUuid = req.user.uuid; // Assuming uuid is passed from user data in the request

  try {
    // Find the user by uuid
    const user = await User.findOne({ _id: customerUuid });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the customer ID is valid (optional, as it's already validated with the user query)
    if (!mongoose.Types.ObjectId.isValid(user._id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Create the ticket with the user's _id as the customer reference
    const ticket = await Ticket.create({
      title,
      customer: user._id, // Use the user _id as the customer reference
    });

    // Respond with the created ticket
    res.status(201).json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Failed to create ticket", error: error.message });
  }
};

// Get all tickets
const getTickets = async (req, res) => {
  try {
    const  userId  = req.user.uuid; 
    
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    
    const user = await User.findById(userId);
    
    
    if (!user || (user.role !== 'admin' && user.role !== 'agent')) {
      return res.status(403).json({ message: "Forbidden: You do not have the required role" });
    }

    
    const tickets = await Ticket.find()
      .populate("customer", "name email") 
      .exec();

    if (tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found" });
    }

    res.status(200).json(tickets); 
  } catch (error) {
    console.error("Error fetching tickets:", error); 
    res.status(500).json({ message: "Server error" });
  }
};

// update status
const updateTicketStatus = async (req, res) => {
  const { selectedTicketId, status } = req.body;

  console.log("data",req.body)
  if (!selectedTicketId || !status) {
    return res.status(400).json({ message: "Ticket ID and new status are required" });
  }

  try {
    
    const allowedRoles = ["admin", "agent"];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }

    
    const ticket = await Ticket.findById(selectedTicketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    
    ticket.status = status;

    
    await ticket.save();

    
    const updatedTicket = await Ticket.findById(selectedTicketId)
      .populate("customer", "name email"); 

    res.status(200).json({ message: "Ticket status updated successfully", ticket: updatedTicket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating ticket status." });
  }
};

// Get uset Tickets
const getUserTickets = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tickets = await Ticket.find({ customer: req.user.uuid })
      .populate("customer", "name email")
      .exec();

    if (tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found for this user" });
    }

    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching user tickets:", error); 
    res.status(500).json({ message: "Server error" });
  }
};

// Get tickets by customerId
const getTicketsByCustomerId = async (req, res) => {
  const customerUuid = req.user.uuid; // Assuming uuid is passed from user data in the request

  try {
    // Find the user by uuid
    const user = await User.findOne({ _id: customerUuid });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch tickets for the user (customerId is the user._id)
    const tickets = await Ticket.find({ customer: user._id }).populate("customer", "name email");

    // If no tickets found
    if (tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found for this customer" });
    }

    // Respond with the fetched tickets
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addNoteToTicket = async (req, res) => {
  const { ticketId, note } = req.body;

  if (!ticketId || !note) {
    return res.status(400).json({ message: "Ticket ID and note are required" });
  }

  try {
    // Ensure that the ticket exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Create the new note object
    const newNote = {
      text: note,
      addedBy: {
        userId: req.user.uuid, // Store the user ID
        name: req.user.name,   // Store the user's name
      },
    };

    // Push the new note into the ticket's notes array
    ticket.notes.push(newNote);

    // Save the ticket with the new note
    await ticket.save();

    // Manually populate the user data for the notes
    for (let note of ticket.notes) {
      note.addedBy = await User.findById(note.addedBy.userId).select("name");
    }

    res.status(200).json(ticket); // Return the updated ticket
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while adding note." });
  }
};

// add  notes and replies
const addNoteAgent = async (req, res) => {
  const { selectedTicketId, newNote } = req.body.notes;
  
  // Validate the input
  if (!selectedTicketId || !newNote) {
    return res.status(400).json({ message: "Ticket ID and note are required" });
  }

  try {
    // Ensure the user has the correct role
    const allowedRoles = ["admin", "agent"];  
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }

    // Check if the ticket exists
    const ticket = await Ticket.findById(selectedTicketId)
    .populate("customer", "name email");
    
      if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Create the new note object
    const note = {
      text: newNote,
      addedBy: {
        userId: req.user.uuid, // Store the user ID
        name: req.user.name,   // Store the user's name
      },
    };

    // Push the new note into the ticket's notes array
    ticket.notes.push(note);

    // Save the ticket with the new note
    await ticket.save();

    // Optionally populate the user data for the notes
    for (let note of ticket.notes) {
      note.addedBy = await User.findById(note.addedBy.userId).select("name");
    }

    res.status(200).json(ticket); // Return the updated ticket
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while adding note." });
  }
};


// Function to fetch notes for a specific ticket
const getNotesForTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    if (!ticketId) {
      return res.status(400).json({ message: "Ticket ID is required." });
    }

    // Find the ticket and populate the notes
    const ticket = await Ticket.findById(ticketId).select("notes");
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    res.status(200).json(ticket.notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

const deleteTicket = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'agent')) {
      return res.status(403).json({ message: "Forbidden: You do not have the required role" });
    }
    const ticketId = req.params.ticketId;
    const ticket = await Ticket.findByIdAndDelete(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    return res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export {createTicket,getTickets,getTicketsByCustomerId, deleteTicket ,updateTicketStatus,addNoteAgent,getNotesForTicket,addNoteToTicket,getUserTickets}
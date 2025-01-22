import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import instance from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";

const CustomerDashboard = () => {
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [title, setTitle] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [tickets, setTickets] = useState([]);
  const [note, setNote] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const token = localStorage.getItem("token");
  const [showNotesModal, setShowNotesModal] = useState(false);
  const navigate = useNavigate(); // Hook to navigate between routes

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    navigate("/login"); // Redirect to the login page
  };

  // Toggle modal for creating new ticket
  const toggleModal = () => {
    setShowCreateTicketModal(!showCreateTicketModal);
  };

  // Toggle modal for adding notes to an existing ticket
  const toggleAddNoteModal = (ticketId) => {
    setTicketId(ticketId);
    setShowAddNoteModal(!showAddNoteModal);
  };

  // Handle form submission to create a new ticket
  const handleCreateTicket = async (e) => {
    e.preventDefault();

    const newTicket = { title }; // Replace with actual customer ID

    try {
      const response = await instance.post("/tickets", newTicket, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the Authorization header
        },
      });
      Swal.fire({
        title: "Success!",
        text: "Ticket created successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      setTickets((prevTickets) => [...prevTickets, response.data]);
      setShowCreateTicketModal(false);
      setTitle("");
    } catch (error) {
      console.error("Error creating ticket:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to create ticket. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Fetch all tickets
  const fetchTickets = async () => {
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await instance.get("/tickets/get/customer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const toggleNotesModal = (ticket) => {
    setSelectedTicket(ticket);
    setShowNotesModal(!showNotesModal);
  };

  // Handle note submission
  const handleAddNote = async (e) => {
    e.preventDefault();
  
    const newNote = { ticketId, note };
  
    try {
      const response = await instance.post("/tickets/addNote", newNote, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      Swal.fire({
        title: "Success!",
        text: "Note added successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
  
      // Update ticket UI with the new note
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === ticketId
            ? { ...ticket, notes: [...ticket.notes, response.data.notes[response.data.notes.length - 1]] }
            : ticket
        )
      );
  
      setShowAddNoteModal(false); // Close modal
      setNote(""); // Reset form
    } catch (error) {
      console.error("Error adding note:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to add note. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  

  useEffect(() => {
       
    if (!token) {
      navigate("/login");
      return; 
    }
    fetchTickets();
  }, []);

  return (
    <div className="text-center min-h-screen p-4">
      <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-semibold mb-4">Welcome We are here to help You!</h1>

        <div className='text-white font-semibold flex-row flex gap-2 bg-red-light-100 p-3 cursor-pointer rounded-lg' onClick={handleLogout}>
            Logout <IoMdLogOut size={24}/>
        </div>      
      </div>
       <ul className="list-none">
        <li>
          <button
            onClick={toggleModal}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Create a new support ticket
          </button>
        </li>
       
      </ul>

      {/* Ticket Creation Modal */}
      {showCreateTicketModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Create New Ticket</h2>
            <form onSubmit={handleCreateTicket}>
              <div className="mb-4">
                <label className="block text-left text-sm font-semibold mb-2">
                  Ticket Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter ticket title"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-2"
              >
                Create Ticket
              </button>
              <button
                type="button"
                onClick={toggleModal}
                className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Note Addition Modal */}
      {showAddNoteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Add Note</h2>
            <form onSubmit={handleAddNote}>
              <div className="mb-4">
                <label className="block text-left text-sm font-semibold mb-2">
                  Note
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  required
                  placeholder="Enter your note"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-2"
              >
                Add Note
              </button>
              <button
                type="button"
                onClick={() => setShowAddNoteModal(false)}
                className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tickets Table */}
      {tickets.length > 0 ? (
        <div className="mt-6 max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Your Tickets</h3>
          <table className="w-full min-w-5 overflow-x-auto">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-4 py-2">Ticket Title</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id} className="border-b hover:bg-gray-200">
                  <td className="px-4 py-2 capitalize text-sm">{ticket.title}</td>
                  <td className="px-4 py-2">{ticket.status || "Open"}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => toggleAddNoteModal(ticket._id)}
                      className="px-2 py-1 m-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Add Note
                    </button>
                    {/* Display Notes */}
                    <button
                      onClick={() => toggleNotesModal(ticket)}
                      className="px-2 py-1 m-1 flex-row flex  bg-purple-500 text-white rounded hover:bg-purple-600 "
                    >
                      View Notes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center mt-7 text-gray-500">No tickets found.</p>
      )}
         {showNotesModal && selectedTicket && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Notes for {selectedTicket.title}</h2>
            <div className="max-h-64 overflow-y-auto">
              {selectedTicket.notes?.length > 0 ? (
                selectedTicket.notes.map((note, index) => (
                  <div key={index} className="border-b text-start pb-2 mb-2">
                    <span className="capitalize">{note.addedBy?.name} : </span> 
                    <span className=" capitalize">{note.text}</span>
                    <p className="text-sm pt-5 text-gray-500">
                     at {new Date(note.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p>No notes yet</p>
              )}
            </div>
            <button
              onClick={() => setShowNotesModal(false)}
              className="w-full py-2 mt-4 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;

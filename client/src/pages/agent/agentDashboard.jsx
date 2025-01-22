import React, { useEffect, useState } from 'react';
import instance from '../../utils/axios';
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const AgentDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [status, setStatus] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // Hook to navigate between routes

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    navigate("/login"); // Redirect to the login page
  };
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await instance.get('/tickets/get/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response?.data) {
          setTickets(response.data); // Set the tickets state with the fetched data
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, [token]);

  const handleAddNote = async () => {
    if (!newNote || !selectedTicketId) {
      alert('Please enter a note and select a ticket.');
      return;
    }
    
    const notes= {selectedTicketId,newNote };
    console.log(notes)
    try {
      const response = await instance.post("/tickets/agent/addNote", {
        notes
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTickets(tickets.map(ticket =>
        ticket._id === selectedTicketId ? response.data : ticket
      ));
      setNewNote('');
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleUpdateStatus = async () => {
    if (!status || !selectedTicketId) {
      alert('Please select a status and ticket.');
      return;
    }
    console.log("first",selectedTicketId,status)
    try {
      const response = await instance.put("/tickets/agent/updateStatus",
        {status,selectedTicketId},
        {
          headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setTickets(tickets.map(ticket =>
        ticket._id === selectedTicketId ? response.data.ticket : ticket
      ));
      setStatus('');
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-semibold mb-4">Welcome, Customer Service Agent!</h1>

        <div className='text-white font-semibold flex-row flex gap-2 bg-red-light-100 p-3 cursor-pointer rounded-lg' onClick={handleLogout}>
            Logout <IoMdLogOut size={24}/>
        </div>      
      </div>
      <h2 className="text-2xl font-semibold mb-4">Tickets</h2>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white table-auto">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              <th className="py-3 px-4 border-b">Ticket Title</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Customer</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-4">{ticket.title}</td>
                <td className="py-3 px-4">{ticket.status}</td>
                <td className="py-3 px-4">{ticket.customer?.name || "N/A"}</td>
                <td className="py-3 px-4">
                <button
                  className={`${
                    selectedTicketId === ticket._id ? "bg-gray-500" : "bg-blue-500"
                  } text-white px-4 py-2 rounded`}
                  onClick={() => {
                    setSelectedTicketId(ticket._id);
                    console.log("Selected Ticket ID:", ticket._id);
                  }}
                >
                  {selectedTicketId === ticket._id ? "Selected" : "Select Ticket"}
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTicketId && (
        <div className="mt-6">
          <h3 className="text-2xl font-semibold mt-6 mb-4">Update Ticket Status</h3>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4"
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </select>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={handleUpdateStatus}
          >
            Update Status
          </button>
        </div>
      )}
      {selectedTicketId && (
        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-4">Add Note or Reply</h3>

          {/* Display existing notes */}
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Existing Notes</h4>
            {tickets.find(ticket => ticket._id === selectedTicketId)?.notes.length ? (
              <ul className="list-disc pl-5">
                {tickets.find(ticket => ticket._id === selectedTicketId).notes.map((note, index) => (
                  <li key={index} className="mb-2">
                    {note?.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No notes added yet.</p>
            )}
          </div>

          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter your note..."
            className="w-full p-3 border border-gray-300 rounded mb-4"
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleAddNote}
          >
            Add Note
          </button>
        </div>
      )}

    </div>
  );
};

export default AgentDashboard;

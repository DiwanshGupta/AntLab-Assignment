import React, { useEffect, useState } from 'react';
import instance from '../../utils/axios';
import Swal from 'sweetalert2';
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { IoMdLogOut } from "react-icons/io";

const ProfileManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({ customers: 0, tickets: 0 });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook to navigate between routes

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    navigate("/login"); // Redirect to the login page
  };
  // Fetch stats and customers on component mount
  useEffect(() => {
    const fetchStatsAndCustomers = async () => {
      try {
        // Fetch stats
        const statsResponse = await instance.get('/user/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (statsResponse?.data) {
          setStats(statsResponse.data);
        }

        // Fetch customers (users)
        const customersResponse = await instance.get('/user/customer/all', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (customersResponse?.data?.customers) {
          setCustomers(customersResponse.data.customers);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to fetch data.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    };

    fetchStatsAndCustomers();
  }, []);

  // Handle customer creation
  const handleCreateCustomer = async (e) => {
    e.preventDefault();

    try {
      const response = await instance.post(
        '/user/customer',
        { name, email, password },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          title: 'Success!',
          text: 'Customer created successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setCustomers([...customers, response.data.customer]);
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to create customer.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  // Handle customer deletion
  const handleDeleteCustomer = async (customerId) => {
    const confirmation = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    });

    if (confirmation.isConfirmed) {
      try {
        // Delete customer
        const response = await instance.delete(`/user/customer/${customerId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 200) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Customer has been deleted.',
            icon: 'success',
            confirmButtonText: 'OK',
          });

          // Update customers list after deletion
          setCustomers(customers.filter((customer) => customer._id !== customerId));

          // Fetch updated stats
          const statsResponse = await instance.get('/user/stats', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (statsResponse?.data) {
            setStats(statsResponse.data);
          }
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to delete customer.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  return (
    <div className="p-4">
         <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Welcome, Admin!</h1>
        <div className=' flex flex-row gap-3 items-center'>
        <a
          href="/admin"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Go to Tickets
        </a>
        <div className='text-red-light-300' onClick={handleLogout}>
        <IoMdLogOut size={24}/>
        </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-6">Manage Customers</h1>

      {/* Stats Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">System Statistics</h2>
        <div className="bg-gray-100 p-4 rounded shadow">
          <p className="mb-2">
            Total Customers: <strong>{stats.customers}</strong>
          </p>
          <p>Total Tickets: <strong>{stats.tickets}</strong></p>
        </div>
      </div>

      {/* Customer Creation Form */}
      <form className="bg-white p-6 rounded shadow mb-6" onSubmit={handleCreateCustomer}>
        <h2 className="text-xl font-semibold mb-4">Create New Customer</h2>
        <div className="mb-4">
          <label className="block font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Customer
        </button>
      </form>

      {/* Existing Customers Table */}
      <h2 className="text-xl font-semibold mb-4">Existing Customers</h2>
      <div className="overflow-x-auto shadow-md rounded-lg">
        {customers.length > 0 ? (
          <table className="min-w-full bg-white table-auto">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Email</th>
                <th className="py-3 px-4 border-b">Role</th>
                <th className="py-3 px-4 border-b">Created At</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td className="py-2 px-4 border-b">{customer.name}</td>
                  <td className="py-2 px-4 border-b">{customer.email}</td>
                  <td className="py-2 px-4 border-b">{customer.role}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(customer.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="text-red-600"
                      onClick={() => handleDeleteCustomer(customer._id)}
                    >
                      <MdDelete size={24} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No customers found.</p>
        )}
      </div>
    </div>
  );
};

export default ProfileManagement;

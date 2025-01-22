import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import instance from "../../utils/axios";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      Swal.fire({
        title: "Error!",
        text: "Password must be at least 8 characters long.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return; 
    }
    const newUser = {
      name,
      email,
      password,
    };

    try {
      console.log("User Registered:", newUser);
      const response = await instance.post("/user/register", newUser);
      const data = response.data;

      if (response.status === 201) {
        Swal.fire({
          title: "Success!",
          text: "Sign-up successful! Please log in.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          localStorage.setItem("token", response.data.token);
          const role = data.newUser.role?.trim().toLowerCase();  

          if (role === "customer") {
            navigate("/customer");
          } else if (role === "agent") {
            navigate("/agent");
          } else if (role === "admin") {
            navigate("/admin");
          } else {
            console.error("Unknown role:", role);
    
            Swal.fire({
              title: "Error!",
              text: "Unknown user role. Please contact support.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: response.data.message || "Something went wrong.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Login failed. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
    
  };


  return (
    <div className="flex justify-center items-center min-h-screen  ">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white rounded-md text-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;

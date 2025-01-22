import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

const Home = () => {
  const [welcomeText, setWelcomeText] = useState(""); 
  const [helpText, setHelpText] = useState(false); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const token = localStorage.getItem("token"); 

    
    if (!token) {
      navigate("/login");
      return; 
    }

    const welcomeWords = ["Welcome", "to", "Help", "Desk"];
    const delays = [500, 1000, 1500, 2000]; 

    let combinedText = ""; 

    welcomeWords.forEach((word, index) => {
      setTimeout(() => {
        combinedText += (combinedText ? " " : "") + word; 
        setWelcomeText(combinedText); 

        if (index === welcomeWords.length - 1) {
          setTimeout(() => setHelpText(true), 1000); 
        }
      }, delays[index]);
    });
  }, [navigate]); 

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-2xl sm:text-4xl font-bold text-red-light-200 ">
        🚀  {welcomeText} 🚀
      </h1>
      {helpText && (
        <h2 className="text-lg sm:text-xl font-bold animate-pulse text-red-light-300 mt-4 ">
          We are here to help you
        </h2>
      )}
    </div>
  );
};

export default Home;

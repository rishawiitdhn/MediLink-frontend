import React, { useState, useEffect } from "react";
import { FaUserMd, FaHospital, FaPills, FaBars, FaTimes } from "react-icons/fa";
import SearchIcon from "@mui/icons-material/Search";
import medilink from "../assets/medilink.png";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";
import { toast } from "react-toastify";


export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    if (userIdFromStorage) setIsLoggedIn(true);
  }, []);

  const handleLogOut = async () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/");
    toast.success("Successfully logged out!");
  };

  return (
    <>
      <nav className="bg-white shadow-md px-4 py-4 flex justify-between items-center relative gap-2">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:cursor-default ml-10"
          >
            <img src={medilink} alt="MediLink Logo" className="h-8 w-8 cursor-pointer" />
            <h1 className="text-2xl font-bold text-[#2B6CB0] tracking-wide cursor-pointer">
              Medi<span className="text-[#38B2AC]">Link</span>
            </h1>
          </div>

        {/* --- Desktop Buttons --- */}
        {!isLoggedIn && (
          <div className="flex gap-2 lg:mr-10">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition hover:cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition cursor-pointer"
            >
              Register
            </button>
          </div>
        )}
        {isLoggedIn && (
          <div className="profile">
            <button
              onClick={handleLogOut}
              className="px-4 py-2 bg-red-600 text-white rounded-lg lg:mr-10 hover:bg-red-700 transition hover:cursor-pointer"
            >
              Log out
            </button>
          </div>
        )}
      </nav>
    </>
  );
}

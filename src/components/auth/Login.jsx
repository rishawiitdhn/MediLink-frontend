import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import Footer from "../Footer";
import doctorImg from "../../assets/doctor.png";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import LinearProgress from "@mui/material/LinearProgress";
import { toast } from "react-toastify";
import { useAuth } from "../../AuthContex";

export default function Login() {
  const navigate = useNavigate();
  const { currUser, setCurrUser, currRole, setCurrRole } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const role = watch("role"); //watches the value when role changes actually
  const [isRole, setIsRole] = useState(false);

  useEffect(() => {
    if (role) {
      if (role !== "") setIsRole(true);
    }
  });

  const onSubmit = async (data) => {
    try {
      const result = await axios.post("https://medilink-backend-1-26fb.onrender.com/login", {
        email: data.email,
        password: data.password,
        role: data.role,
        adminCode: data.adminCode,
      });

      localStorage.setItem("token", result.data.token);
      localStorage.setItem("userId", result.data.userId);
      localStorage.setItem("role", result.data.role);
      setCurrRole(result.data.role);
      setCurrUser(result.data.userId);

      toast.success("Welcome back to MediLink!");
      navigate("/");
    } catch (err) {
      console.error("Error registering user: ", err);
      if (err.response && err.response.data) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Network error");
      }
    }
  };

  return (
    <>
      <Navbar />
      {isSubmitting && <LinearProgress />}
      <div className="flex justify-center relative">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center w-3/4 md:w-1/2 lg:w-1/2 gap-1.5 shadow-2xl p-10 md:pl-20 md:pr-20 mt-6 rounded-lg bg-white"
        >
          <h1 className="text-2xl text-center text-blue-900 font-bold mb-3">
            Login your account
          </h1>
          
          <label htmlFor="email" className="font-semibold text-[1.1rem]">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            {...register("email", { required: "*This is a required field" })}
            className="p-1.5 pl-3 bg-gray-100 rounded-md border-gray-200 border-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && (
            <div className="text-red-700 font-semibold text-sm">
              {errors.email.message}
            </div>
          )}

          <label htmlFor="password" className="font-semibold text-[1.1rem]">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            {...register("password", {
              required: "*This is a required field",
              minLength: { value: 8, message: "*Minimum length should be 8" },
            })}
            className="p-1.5 pl-3 bg-gray-100 rounded-md border-gray-200 border-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.password && (
            <div className="text-red-700 font-semibold text-sm">
              {errors.password.message}
            </div>
          )}


          <label htmlFor="role" className="font-semibold text-[1.1rem]">
            Role
          </label>
          <select
            id="role"
            name="role"
            {...register("role", { required: "*This is a required field" })}
            className="p-1.5 pl-3 bg-gray-100 rounded-md border-gray-200 border-2 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:cursor-pointer"
          >
            <option value="">--Select--</option>
            <option value="doctor">Doctor </option>
            <option value="patient">Patient </option>
            <option value="pharmacy">Pharmacy </option>
            <option value="admin">Admin </option>
          </select>
          {errors.role && (
            <div className="text-red-700 font-semibold text-sm">
              {errors.role.message}
            </div>
          )}

          {isRole && role === "admin" && (
            <>
              <label htmlFor="adminCode" className="font-semibold text-[1.1rem]">
                Admin Code
              </label>
              <input
                type="password"
                id="adminCode"
                name="adminCode"
                {...register("adminCode", {
                  required: "*This is a required field",
                })}
                className="p-1.5 pl-3 bg-gray-100 rounded-md border-gray-200 border-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.adminCode && (
                <div className="text-red-700 font-semibold text-sm">
                  {errors.adminCode.message}
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={!isRole || isSubmitting}
            className={`px-4 py-2 mt-4 bg-blue-600 text-white rounded-lg transition hover:bg-blue-700 ${
              (isRole || isSubmitting) ? "hover:cursor-pointer" : "cursor-not-allowed opacity-50"
            }`}
          >
            {isSubmitting ? <p>Logging in please wait...</p> : <p>Login</p>}
          </button>

          <div className="flex justify-center gap-2 border-3 rounded-md py-3 border-gray-300 text-md sm:text-lg mt-2">
            <p className="font-medium text-gray-700 pl-2 text-center">
              New to MediLink? &nbsp;
              <Link
                to="/register"
                className="text-blue-500 font-semibold pr-2 text-center"
              >
                Register now!
              </Link>
            </p>
          </div>
        </form>
      </div>
      <div className="flex flex-col">
        <Footer />
      </div>
      
    </>
  );
}

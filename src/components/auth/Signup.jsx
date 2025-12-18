import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import Footer from "../Footer";
import doctorImg from "../../assets/doctor.png";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import LinearProgress from "@mui/material/LinearProgress";
import { toast } from "react-toastify";

export default function Signup() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const role = watch("role"); //watches the value when role changes actually
  const hospital = watch("hospital");

  const [isRole, setIsRole] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (role) {
      if (role !== "") setIsRole(true);
    }
  });

  
  useEffect(() => {
    const getAllHospitals = async () => {
      try {
        const allHospitals = await axios.get(
          "http://localhost:3000/admin/hospitals"
        );
        console.log(allHospitals.data);
        setHospitals(allHospitals.data);
      } catch (err) {
        console.error("Error fetching hospitals: ", err);
        toast.error("Some error occured");
      }
    };
    getAllHospitals();
  }, []);

  useEffect(()=> {
    const getHospital = async () => {
      try{
        if(hospital){
          const res = await axios.get(`http://localhost:3000/admin/hospital/${hospital}`);
          setDepartments(res.data.departments);
        }
      }catch(err){
        console.error("Error fetching hospital by name: ", err);
        toast.error("Some error occured");
      }
    }
    getHospital();
  }, [hospital])

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const result = await axios.post("http://localhost:3000/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        contact: data.contact,
        specialisation: data.specialisation,
        role: data.role,
        hospitalName: data.hospital,
        adminCode: data.adminCode,
      });

      console.log(result);

      localStorage.setItem("token", result.data.token);
      localStorage.setItem("userId", result.data.userId);
      localStorage.setItem("role", result.data.role);

      toast.success("Welcome to MediLink!");
      if (role === "admin") navigate("/adminDashboard");
      else navigate("/");
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
            Create your account
          </h1>
          <label htmlFor="name" className="font-semibold text-[1.1rem]">
            Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "*This is a required field" })}
            className="p-1.5 pl-3 bg-gray-100 rounded-md border-gray-200 border-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.name && (
            <div className="text-red-700 font-semibold text-sm">
              {errors.name.message}
            </div>
          )}
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

          <label htmlFor="contact" className="font-semibold text-[1.1rem]">
            Contact No.
          </label>
          <input
            type="number"
            id="contact"
            name="contact"
            {...register("contact", {
              required: "*This is a required field",
              minLength: { value: 8, message: "*Length should be 10 digits" },
            })}
            className="p-1.5 pl-3 bg-gray-100 rounded-md border-gray-200 border-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.contact && (
            <div className="text-red-700 font-semibold text-sm">
              {errors.contact.message}
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
              <label
                htmlFor="adminCode"
                className="font-semibold text-[1.1rem]"
              >
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

          {isRole && (role === "doctor" || role === "pharmacy") && (
            <>
              <label htmlFor="hospital" className="font-semibold text-[1.1rem]">
                Hospital
              </label>
              <select
                id="hospital"
                {...register("hospital", {
                  required: "*This is a required field",
                })}
                name="hospital"
                className="p-1.5 pl-3 bg-gray-100 rounded-md border-gray-200 border-2 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:cursor-pointer"
              >
                <option value="">--Select--</option>
                {hospitals.map((hospital) => (
                  <option value={hospital.name} key={hospital._id}>
                    {hospital.name}
                  </option>
                ))}
              </select>
              {errors.specialisation && (
                <div className="text-red-700 font-semibold text-sm">
                  {errors.specialisation.message}
                </div>
              )}
            </>
          )}

          {isRole && role === "doctor" && (
            <>
              <label
                htmlFor="specialisation"
                className="font-semibold text-[1.1rem]"
              >
                Specialisation
              </label>
              <select
                id="specialisation"
                name="specialisation"
                {...register("specialisation", {
                  required: "*This is a required field",
                })}
                className="p-1.5 pl-3 bg-gray-100 rounded-md border-gray-200 border-2 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:cursor-pointer"
              >
                <option value="">--Select--</option>
                {departments.map((dept, idx)=>{
                  return <option key={idx} value={dept}>{dept[0].toUpperCase()}{dept.slice(1)}</option>
                })}
              </select>
              {errors.specialisation && (
                <div className="text-red-700 font-semibold text-sm">
                  {errors.specialisation.message}
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={!isRole || isSubmitting}
            className={`px-4 py-2 mt-4 bg-blue-600 text-white rounded-lg transition hover:bg-blue-700 ${
              isRole ? "hover:cursor-pointer" : "cursor-not-allowed opacity-50"
            }`}
          >
            Register
          </button>

          <div className="flex justify-center gap-2 border-3 rounded-md py-3 border-gray-300 text-md sm:text-lg mt-2">
            <p className="font-medium text-gray-700 pl-2">
              Already have an account? &nbsp;
              <Link
                to="/login"
                className="text-blue-500 font-semibold pr-2 text-center"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
        {/* <img
          src={doctorImg}
          alt="doctor_img"
          className="h-120 w-90 absolute right-0 hidden md:flex md:right-1 lg:right-40 top-45"
        /> */}
      </div>
      <hr className="border-2 bg-gray-400 mt-5" />
      <Footer />
    </>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import LinearProgress from "@mui/material/LinearProgress";
import { toast } from "react-toastify";
import Navbar from "../../../Navbar";
import Footer from "../../../Footer";
import { useParams } from "react-router-dom";

const options = [
  "Orthopedics",
  "Neurology",
  "Pediatrics",
  "Dermatology",
  "Gastroenterology",
  "Anesthesiology",
  "Emergency Medicine",
  "OB-GYN",
];

export default function UpdateHospital() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const { hospitalId } = useParams();
  const [hospital, setHospital] = useState({});
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("address", data.address);
      formData.append("contact", data.contact);
      formData.append("hospital_image", data.image[0] ? data.image[0] : "");

      data.departments.forEach((dept) => {
        formData.append("departments[]", dept);
      });

      const res = await axios.patch(
        `http://localhost:3000/admin/hospitals/${hospital._id}`, formData,
        {
          headers: {
            Authorization: `Bearer ${role}`,
          },
        }
      );

      console.log(data);
      navigate(`/admin/hospital/${hospital._id}`, {
        state: { from: "AddHospital" },
      });
      toast.success("Hospital  data Updated successfully!!");
    } catch (err) {
      console.error("Error Updating hospital: ", err);
      if (err.response && err.response.message) {
        toast.error(err.response.message);
      } else {
        toast.error("Network error");
      }
    }
  };

  useEffect(() => {
    const getHospital = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/admin/hospitals/${hospitalId}`,
          {
            headers: {
              Authorization: `Bearer ${role}`,
            },
          }
        );
        setHospital(res.data);

        //filling the input fields
        setValue("name", res.data.name);
        setValue("email", res.data.email);
        setValue("address", res.data.address);
        setValue("contact", res.data.contact);
        setValue("departments", res.data.departments);
      } catch (err) {
        console.error("Error during fetching hospital by id: ", err);
        if (err.response && err.response.message) {
          toast.error(err.response.message);
        } else toast.error("Something went wrong!!");
      }
    };
    getHospital();
  }, []);
  return (
    <>
      <Navbar />
      {isSubmitting && <LinearProgress />}
      <div className="flex justify-center relative pb-24">
        <form
          encType="multipart/form-data"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center w-3/4 md:w-1/2 lg:w-1/2 gap-1.5 shadow-2xl p-10 md:pl-20 md:pr-20 mt-6 rounded-lg bg-white"
        >
          <h1 className="text-2xl text-center text-blue-900 font-bold mb-3">
            Update Hospital
          </h1>

          <label htmlFor="name" className="font-semibold text-[1.1rem]">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
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
            // value={Hospital.email}
            {...register("email", { required: "*This is a required field" })}
            className="p-1.5 pl-3 bg-gray-100 rounded-md border-gray-200 border-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && (
            <div className="text-red-700 font-semibold text-sm">
              {errors.email.message}
            </div>
          )}

          <label htmlFor="image" className="font-semibold text-[1.1rem]">
            Image
          </label>
          <input
            id="image"
            type="file"
            accept=".jpg, .jpeg, .png"
            {...register("image")}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm
                 file:bg-blue-600 file:text-white file:rounded-lg file:px-4 file:py-2 
                 file:border-none hover:file:bg-blue-700 transition cursor-pointer"
          />

          {errors.email && (
            <div className="text-red-700 font-semibold text-sm">
              {errors.email.message}
            </div>
          )}

          <label htmlFor="address" className="font-semibold text-[1.1rem]">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            {...register("address", {
              required: "*This is a required field",
            })}
            className="p-1.5 pl-3 bg-gray-100 rounded-md border-gray-200 border-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.address && (
            <div className="text-red-700 font-semibold text-sm">
              {errors.address.message}
            </div>
          )}

          <label htmlFor="contact" className="font-semibold text-[1.1rem]">
            Contact No.
          </label>
          <input
            type="number"
            id="contact"
            name="contact"
            {...register("contact", { required: "*This is a required field" })}
            className="p-1.5 pl-3 bg-gray-100 rounded-md border-gray-200 border-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.contact && (
            <div className="text-red-700 font-semibold text-sm">
              {errors.contact.message}
            </div>
          )}

          <label className="font-semibold text-[1.1rem]">Departments</label>
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 text-md">
            {options.map((item, idx) => {
              return (
                <label key={idx} className="flex items-center gap-1">
                  <input
                    type="checkBox"
                    value={item.toLowerCase()}
                    {...register("departments")}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <p>{item}</p>
                </label>
              );
            })}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 mt-4 bg-blue-600 text-white rounded-lg transition hover:bg-blue-700 hover:${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"}
              }`}
          >
            Update
          </button>
        </form>
      </div>

      <div className="bottom-0 left-0 w-full bg-blue-950">
        <hr className="border-2 bg-gray-400 mt-5" />
        <Footer />
      </div>
    </>
  );
}

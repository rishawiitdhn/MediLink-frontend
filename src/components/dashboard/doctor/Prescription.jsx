import Footer from "../../Footer";
import Navbar from "../../Navbar";
import { useForm } from "react-hook-form";
import LinearProgress from "@mui/material/LinearProgress";
import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Controller } from "react-hook-form";
import {
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Prescription() {
  const doctorId = localStorage.getItem("userId");
  const {patientId} = useParams();

  const [items, setItems] = useState([""]);
  const [doctor, setDoctor] = useState({});
  const [pharmacies, setPharmacies] = useState([]);
  const [role, setRole] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const getDoctorById = async () => {
      try {
        const res = await axios.get(`https://medilink-backend-1-26fb.onrender.com/doctor/${doctorId}`);
        setDoctor(res.data);
      } catch (err) {
        console.error("Error during fetching doctor by ID: ", err);
        if (err.response && err.response.data.message) {
          toast.error(err.response.data.message);
        } else toast.error("Something went wrong!!");
      }
    };

    getDoctorById();
  }, []);

  useEffect(() => {
    const roleFromStorage = localStorage.getItem("role");
    setRole(roleFromStorage);
    const getPharmacies = async () => {
      try {
        const res = await axios.get(
          `https://medilink-backend-1-26fb.onrender.com/pharmacy/${doctor?.hospital?._id}`
        );
        setPharmacies(res.data);
      } catch (err) {
        console.error("Error during fetching pharmacies: ", err);
        if (err.response && err.response.data.message) {
          toast.error(err.response.data.message);
        } else toast.error("Something went wrong!!");
      }
    };
    if (doctor?.hospital) {
      getPharmacies();
    }
  }, [doctor]);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const addItem = () => {
    const updated = [...items, ""];
    setItems(updated);
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    if (items.length > 1) setItems(updated);
  };

  const onSubmit = async (data) => {
    console.log(data);
    const medicines = [{}];
    for (let i = 0; i < data.dose.length; i++) {
      let object = {
        name: data.medicine[i],
        dose: data.dose[i],
        duration: data.duration[i],
        instruction: data.instruction[i],
      };
      medicines[i] = object;
    }

    try {
        const res = await axios.post(
          `https://medilink-backend-1-26fb.onrender.com/doctor/prescription`,
          {
            patientId,
            hospitalId: doctor.hospital._id,
            doctorId: doctor._id,
            pharmacyName: data.pharmacy,
            medicines,
          },
        {
          headers: {
            Authorization: `Bearer ${role}`,
          },
        }
        );
        toast.success(res.data.message);
        navigate(`/doctor/${patientId}`);
    } catch (err) {
      console.error("Error during sumitting prescription: ", err);
      if (err.response && err.response.message) {
        toast.error(err.response.message);
      } else toast.error("Something went wrong!!");
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* --- Navbar --- */}
        <Navbar />
        <div className="shadow-2xl p-4 rounded-xl flex justify-center w-full">
          <div className="flex justify-center relative w-full">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="gap-1.5 shadow-2xl p-4 sm:p-8 lg:p-10 mt-4 rounded-lg bg-white w-full max-w-6xl"
            >
              <h1 className="text-2xl text-center text-blue-900 font-bold mb-6">
                Write prescription
              </h1>

              <div className="space-y-6">
                {/*  MEDICINES LIST  */}
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="
              flex flex-col lg:flex-row
              gap-4 lg:gap-6
              w-full bg-gray-50 border border-gray-200 p-4 rounded-lg
            "
                  >
                    {/* Medicine */}
                    <div className="flex flex-col w-full lg:w-1/4">
                      <label
                        htmlFor={`medicine-${index}`}
                        className="font-semibold text-gray-700"
                      >
                        Medicine Name
                      </label>

                      <input
                        type="text"
                        id={`medicine-${index}`}
                        {...register(`medicine.${index}`, {
                          required: "*This is a required field",
                        })}
                        className="p-2 bg-gray-100 rounded-md border border-gray-300 
                  focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />

                      {errors.medicine?.[index] && (
                        <div className="text-red-600 text-sm mt-1">
                          {errors.medicine[index].message}
                        </div>
                      )}
                    </div>

                    {/* Dose */}
                    <div className="flex flex-col w-full lg:w-1/5">
                      <label className="font-semibold text-gray-700">
                        Dose
                      </label>
                      <input
                        type="text"
                        id={`dose-${index}`}
                        {...register(`dose.${index}`, {
                          required: "*This is a required field",
                        })}
                        className="p-2 bg-gray-100 rounded-md border border-gray-300 
                  focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      {errors.dose?.[index] && (
                        <div className="text-red-600 text-sm mt-1">
                          {errors.dose[index].message}
                        </div>
                      )}
                    </div>

                    {/* Duration */}
                    <div className="flex flex-col w-full lg:w-1/5">
                      <label className="font-semibold text-gray-700">
                        Duration
                      </label>
                      <input
                        type="text"
                        id={`duration-${index}`}
                        {...register(`duration.${index}`, {
                          required: "*This is a required field",
                        })}
                        className="p-2 bg-gray-100 rounded-md border border-gray-300 
                  focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      {errors.duration?.[index] && (
                        <div className="text-red-600 text-sm mt-1">
                          {errors.duration[index].message}
                        </div>
                      )}
                    </div>

                    {/* Instruction */}
                    <div className="flex flex-col w-full lg:w-1/4">
                      <label className="font-semibold text-gray-700">
                        Instruction
                      </label>
                      <input
                        type="text"
                        id={`instruction-${index}`}
                        {...register(`instruction.${index}`, {
                          required: "*This is a required field",
                        })}
                        className="p-2 bg-gray-100 rounded-md border border-gray-300 
                  focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      {errors.instruction?.[index] && (
                        <div className="text-red-600 text-sm mt-1">
                          {errors.instruction[index].message}
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    <div className="flex justify-end lg:justify-center items-center w-full lg:w-auto">
                      <IconButton
                        color="error"
                        onClick={() => removeItem(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                ))}

                {/* PHARMACY SELECT */}
                <div className="w-full">
                  <Controller
                    name="pharmacy"
                    control={control}
                    defaultValue=""
                    rules={{ required: "*This is a required field" }}
                    render={({ field }) => (
                      <FormControl
                        variant="standard"
                        fullWidth
                        error={Boolean(errors.pharmacy)}
                      >
                        <InputLabel>Select Pharmacy</InputLabel>
                        <Select {...field}>
                          <MenuItem value="">Select Pharmacy</MenuItem>
                          {pharmacies.map((pharmacy) => {
                            return (
                              <MenuItem value={pharmacy.name}>
                                {pharmacy.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    )}
                  />
                  {errors.pharmacy && (
                    <div className="text-red-700 font-semibold text-sm mt-1">
                      {errors.pharmacy.message}
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="mt-4 bg-green-600 w-full sm:w-1/2 text-white py-3 text-lg font-semibold rounded-lg"
                  >
                    Submit Prescription
                  </button>
                </div>

                <div className="w-full flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={addItem}
                    className="bg-blue-900 px-6 py-2 text-white text-lg font-semibold rounded-lg"
                  >
                    Add Medicine
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* --- Footer --- */}
        <div className="mt-auto bg-blue-950">
          <hr className="border-2"></hr>
          <Footer />
        </div>
      </div>
    </>
  );
}

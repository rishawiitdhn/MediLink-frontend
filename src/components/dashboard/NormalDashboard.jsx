import Button from "@mui/material/Button";
import Navbar from "../Navbar";
import axios from "axios";
import { FaStethoscope } from "react-icons/fa";
import { LiaHospitalSolid } from "react-icons/lia";
import { BsCapsule } from "react-icons/bs";
import { FaBedPulse } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import CircularProgress from '@mui/material/CircularProgress';

export default function NormalDashboard() {
  const navigate = useNavigate();
  const [doctorCount, setDoctorCount] = useState(0);
  const [hospitalCount, setHospitalCount] = useState(0);
  const [pharmacyCount, setPharmacyCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const res1 = await axios.get(
        "https://medilink-backend-1-26fb.onrender.com/doctor/all"
      );
      setDoctorCount(res1.data.length);
      setDoctors(res1.data);

      const res2 = await axios.get(
        "https://medilink-backend-1-26fb.onrender.com/pharmacy/all"
      );
      setPharmacyCount(res2.data.length);

      const res3 = await axios.get(
        "https://medilink-backend-1-26fb.onrender.com/patient/all"
      );
      setPatientCount(res3.data.length);

      const res4 = await axios.get(
        "https://medilink-backend-1-26fb.onrender.com/admin/hospitals"
      );
      setHospitalCount(res4.data.length);
      setIsLoading(false);
    };

    getData();
  }, []);

  const handleChange = (e) => {
    setSearchVal(e.target.value);
  };

  useEffect(() => {
    if (searchVal === "") {
      setSearchResults(doctors);
    } else {
      let filterDoctors = doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchVal.toLowerCase()) ||
          doctor.hospital.name
            .toLowerCase()
            .includes(searchVal.toLowerCase()) ||
          doctor.specialisation.toLowerCase().includes(searchVal.toLowerCase())
      );
      setSearchResults(filterDoctors);
    }
  }, [searchVal, doctors, searchResults]);

  const handleAppointment = () => {
    const user = localStorage.getItem("userId");
    if (!user) {
      toast.error("You must be logged in!");
      navigate("/login");
    }
  };

  if (isLoading)
    return (
      <>
        <div className="flex justify-center items-center min-h-screen">
          <CircularProgress size="3rem" />
        </div>
      </>
    );

  return (
    <>
      <div className="min-h-screen flex flex-col relative">
        <Navbar />

        {/* search Input */}
        <div className="flex justify-center mt-5">
          <div className="search relative flex flex-col sm:flex-row items-center sm:items-stretch justify-center gap-2 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto p-2">
            {/* Search box wrapper */}
            <div className="relative grow w-full">
              <SearchIcon className="absolute top-3 left-2 text-gray-500" />
              <input
                type="text"
                placeholder="Search for doctors, hospitals..."
                className="pl-8 pr-3 py-2 bg-gray-100 rounded-md border border-none w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={handleChange}
                value={searchVal}
              />
            </div>

            {/* Button */}
            <button className=" bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-200 p-1 w-full sm:w-30">
              Get Started
            </button>
          </div>
        </div>

        {/* Dashboard functioning */}
        <div className="dashboard">
          <div className="heading text-center font-medium font-serif leading-12 animate-pulse mt-3 text-2xl md:text-4xl">
            <p>Connecting Patients, Doctors</p>
            <p>and Hospitals Seamlessly</p>
          </div>
          <div className="categories grid grid-cols-2 gap-5 justify-items-center mt-8 md:flex md:justify-center">
            <div className="doctors w-fit shadow-lg rounded-lg pl-6 pr-6 pt-4 pb-4 bg-white">
              <div className="flex gap-2 items-center">
                <p className="text-blue-700">
                  <FaStethoscope className="w-7 h-7" />
                </p>
                <p className="text-2xl font-semibold">{doctorCount}+</p>
              </div>
              <p className="text-center font-medium text-gray-600">Doctors</p>
            </div>
            <div className="hospitals w-fit shadow-lg rounded-lg pl-6 pr-6 pt-4 pb-4 bg-white">
              <div className="flex gap-2 items-center">
                <p className="text-blue-700">
                  <LiaHospitalSolid className="w-9 h-9" />
                </p>
                <p className="text-2xl font-semibold">{hospitalCount}+</p>
              </div>
              <p className="text-center font-medium text-gray-600">Hospitals</p>
            </div>
            <div className="pharmacies w-fit shadow-lg rounded-lg pl-6 pr-6 pt-4 pb-4 bg-white">
              <div className="flex gap-2 items-center">
                <p className="text-blue-700">
                  <BsCapsule className="w-8 h-8" />
                </p>
                <p className="text-2xl font-semibold">{pharmacyCount}+</p>
              </div>
              <p className="text-center font-medium text-gray-600">
                Pharmacies
              </p>
            </div>
            <div className="pharmacies w-fit shadow-lg rounded-lg pl-6 pr-6 pt-4 pb-4 bg-white">
              <div className="flex gap-2 items-center">
                <p className="text-blue-700">
                  <FaBedPulse className="w-8 h-8" />
                </p>
                <p className="text-2xl font-semibold">{patientCount}+</p>
              </div>
              <p className="text-center font-medium text-gray-600">
                Patients Served
              </p>
            </div>
          </div>

          {/* Doctors Lists */}
          <div className="doctorsList mt-10 bg-white">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-700 text-center pt-5">
              Featured Doctors
            </h1>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 m-3">
              {searchResults.map((doctor) => {
                return (
                  <div
                    key={doctor._id}
                    className="card shadow-2xl p-5 flex-col gap-5 justify-center m-3 rounded-lg bg-blue-50"
                  >
                    <div className="flex justify-center">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/8815/8815112.png"
                        alt="doctor_img"
                        className="w-20 h-20 rounded-full self-center"
                      />
                    </div>
                    <div className="details mt-2">
                      <p className="font-semibold text-center text-lg">
                        Dr. {doctor.name}
                      </p>
                      <p className="text-gray-600 text-center">
                        {doctor.specialisation}
                      </p>
                      <p className="text-gray-800 text-center">
                        ( {doctor.hospital.name} )
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <button
                        className=" bg-blue-500 text-white font-medium rounded-sm hover:bg-blue-600 transition w-38 p-1 mt-2 mr-2 hover:cursor-pointer"
                        onClick={handleAppointment}
                      >
                        Take Appointment
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-auto bg-blue-950">
          <hr className="border-2"></hr>
          <Footer />
        </div>
      </div>
    </>
  );
}

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { IoMdCheckmarkCircle } from "react-icons/io";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";

export default function Doctor() {
  const [doctors, setDoctors] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const role = localStorage.getItem("role");
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const res1 = await axios.get(
        "https://medilink-backend-1-26fb.onrender.com/doctor/all"
      );
      setDoctors(res1.data);
      setIsLoading(false);
    };

    getData();
  }, []);

  //search doctors logic
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
  }, [searchVal, doctors]);

  const handleChange = (e) => {
    setSearchVal(e.target.value);
  };

  const approveDoctors = async (id) => {
    try {
      setIsApproving(true);
      const res = await axios.patch(
        `https://medilink-backend-1-26fb.onrender.com/admin/doctor/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${role}`,
          },
        }
      );
      const res1 = await axios.get(
        "https://medilink-backend-1-26fb.onrender.com/doctor/all"
      );
      setDoctors(res1.data);
      setIsApproving(false);
      toast.success("Verified!!");
    } catch (err) {
      console.log("Error during approving doctor: ", err);
      if (err.response && err.response.data) {
        toast.error(err.response.data.message);
      } else toast.error("Some error occured. Please try again later!");
    }
  };

  const disapproveDoctors = async (id) => {
    try {
      setIsApproving(true);
      const res = await axios.patch(
        `https://medilink-backend-1-26fb.onrender.com/admin/doctor/disapprove/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${role}`,
          },
        }
      );

      const res1 = await axios.get(
        "https://medilink-backend-1-26fb.onrender.com/doctor/all"
      );
      setDoctors(res1.data);

      setIsApproving(false);
      toast.info("Changes Updated!!");
    } catch (err) {
      console.log("Error during disapproving doctor: ", err);
      if (err.response && err.response.data) {
        toast.error(err.response.data.message);
      } else toast.error("Some error occured. Please try again later!");
    }
  };

  if (isLoading)
    return (
      <>
        <div className="flex justify-center items-center h-full">
          <CircularProgress size="3rem" />
        </div>
      </>
    );
  return (
    <>
      <div className="flex justify-center mt-5 relative z-10">
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

      {/* Doctors Lists */}
      <div className="doctorsList bg-white">
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
                    ( {doctor?.hospital?.name} )
                  </p>
                  <div className="flex justify-end">
                    <button
                      disabled={isApproving}
                      onClick={
                        doctor.verified === false
                          ? () => approveDoctors(doctor._id)
                          : () => disapproveDoctors(doctor._id)
                      }
                      className={`px-4 py-1 text-white rounded-lg font-semibold mt-2 ${
                        doctor.verified === true
                          ? "bg-green-500 hover:bg-green-600 transition"
                          : "bg-red-500 hover:bg-red-600 transition"
                      } ${isApproving ? "cursor-not-allowed opacity-50" : "cursor-pointer opacity-100"}`}
                    >
                      {doctor.verified === true ? (
                        <p className="flex items-center gap-2">
                          Verified <IoMdCheckmarkCircle />{" "}
                        </p>
                      ) : (
                        "Approve"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

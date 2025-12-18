import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

export default function Hospitals() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const [hospitals, setHospitals] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const getAllHospitals = async () => {
      try {
        const res = await axios.get("https://medilink-backend-1-26fb.onrender.com/admin/hospitals", {
          headers: {
            Authorization: `Bearer ${role}`,
          },
        });
        // console.log(res);
        setHospitals(res.data);
      } catch (err) {
        console.error("Error fetching Hospitals: ", err);
      }
    };
    getAllHospitals();
  }, []);

  //search hospitals logic
  useEffect(() => {
    if (searchVal === "") {
      setSearchResults(hospitals);
    } else {
      let filterHospitals = hospitals.filter((hospital) =>
        hospital.name.toLowerCase().includes(searchVal.toLowerCase())
      );
      setSearchResults(filterHospitals);
    }
  }, [searchVal, hospitals]);

  const handleChange = (e) => {
    setSearchVal(e.target.value);
  };

  return (
    <>
      <div className="flex justify-center mt-5 relative z-10">
        <div className="search relative flex flex-col sm:flex-row items-center sm:items-stretch justify-center gap-2 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto p-2">
          {/* Search box wrapper */}
          <div className="relative grow w-full">
            <SearchIcon className="absolute top-3 left-2 text-gray-500" />
            <input
              type="text"
              placeholder="Search for hospitals..."
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

      {/* Hospital Lists */}
      <div className="hospitalLists bg-white">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-700 text-center pt-5">
          Featured Hospitals
        </h1>
        {searchResults.length === 0 && (
          <h1 className="text-lg font-semibold text-gray-700">
            No Hopitals Found...
          </h1>
        )}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 m-3">
          {searchResults.map((hospital) => {
            return (
              <div
                key={hospital._id}
                className="card shadow-2xl p-5 flex-col gap-5 justify-center m-3 rounded-lg bg-blue-50 hover:cursor-pointer hover:opacity-85 transition-all"
                onClick={() => navigate(`/admin/hospital/${hospital._id}`)}
              >
                <div className="flex justify-around items-center">
                  <img
                    src={hospital.image.url}
                    className="w-30 h-30 self-center"
                  />
                  <p className="font-bold text-center text-2xl">
                    {hospital.name}
                  </p>
                </div>
                <hr className="m-2 text-gray-900" />
                <div className="details mt-2 flex-col justify-center text-lg px-2">
                  <div className="flex justify-between">
                    <p className="font-semibold text-gray-700 text-left ">
                      Departments
                    </p>
                    <p className="font-semibold text-gray-700 text-left">
                      {hospital.departments.length}+
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="font-semibold text-gray-700 text-left ">
                      Doctors
                    </p>
                    <p className="font-semibold text-gray-700 text-left">
                      {hospital.doctors.length}+
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="font-semibold text-gray-700 text-left ">
                      Pharmacies
                    </p>
                    <p className="font-semibold text-gray-700 text-left">
                      {hospital.pharmacies.length}+
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="addButton bottom-50 right-2 md:right-10 fixed">
        <button
          onClick={() => navigate("/admin/hospital")}
          className="px-4 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition hover:cursor-pointer"
        >
          Add Hospital
        </button>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import Navbar from "../../Navbar";
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import Footer from "../../Footer";
import { IoMdHome } from "react-icons/io";
import Overview from "./Overview";
import { FaStethoscope } from "react-icons/fa";
import { LiaHospitalSolid } from "react-icons/lia";
import { BsCapsule } from "react-icons/bs";
import { FaBedPulse } from "react-icons/fa6";
import { GiProgression } from "react-icons/gi";
import Doctor from "./Doctor";
import Hospitals from "./hospital/Hospitals";
import { useLocation } from "react-router-dom";
import Pharmacy from "./Pharmacy";
import Analytics from "./Analytics";

export default function AdminDashboard() {
  const location = useLocation();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [isOverview, setIsOverview] = useState(true);
  const [isDoctors, setIsDoctors] = useState(false);
  const [isHospitals, setIsHospitals] = useState(false);
  const [isPatients, setIsPatients] = useState(false);
  const [isAnalytics, setIsAnalytics] = useState(false);
  const [isPharmacies, setIsPharmacies] = useState(false);


  const listItems = [
    setIsOverview,
    setIsDoctors,
    setIsHospitals,
    setIsPharmacies,
    setIsAnalytics,
    setIsPatients,
  ];

  useEffect(()=>{
    if((location.state) && (location.state.from==="AddHospital")){
      setIsOverview(false);
      setIsHospitals(true);
    }
    if((location.state) && (location.state.from==="deleteHospital")){
      setIsOverview(false);
      setIsHospitals(true);
    }
  }, [location.state]);

  const handleSidebarList = (listItem) => {
    listItem(true);
    for (let item of listItems) {
      if (item !== listItem) item(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* --- Navbar --- */}
        <Navbar />

        {/* --- Sidebar toggle icon --- */}
        <p
          onClick={() => setOpenSidebar(!openSidebar)}
          className="absolute top-4 left-2 text-4xl border-2 rounded-md text-gray-700 hover:bg-gray-200 transition-all hover:cursor-pointer z-10"
        >
          <TbLayoutSidebarLeftExpandFilled />
        </p>

        {/* --- Main Section (Sidebar + Main Content) --- */}
        <div className="flex flex-1">
          {/* Sidebar — below Navbar, scrolls with page */}
          <div
            className={`sidebarList absolute z-50 min-h-screen bg-blue-950 rounded-sm text-white font-semibold text-md transition-all duration-500 ease-in-out
              ${
                openSidebar
                  ? "w-50 opacity-100"
                  : "w-0 opacity-0 overflow-hidden"
              }`}
          >
            <div className="pt-6">
              <div
                onClick={() => handleSidebarList(setIsOverview)}
                className={`flex gap-2 items-center hover:bg-blue-900 pl-4 py-2 cursor-pointer transition-all duration-200 ${
                  isOverview ? "bg-blue-900" : ""
                }`}
              >
                <p className="text-2xl">
                  <IoMdHome />
                </p>
                <p>Overview</p>
              </div>

              <div
                onClick={() => handleSidebarList(setIsHospitals)}
                className={`flex gap-2 items-center hover:bg-blue-900 pl-4 py-2 cursor-pointer transition-all duration-200 ${
                  isHospitals ? "bg-blue-900" : ""
                }`}
              >
                <p className="text-2xl">
                  <LiaHospitalSolid />
                </p>
                <p>Hospitals</p>
              </div>

              <div
                onClick={() => handleSidebarList(setIsDoctors)}
                className={`flex gap-2 items-center hover:bg-blue-900 pl-4 py-2 cursor-pointer transition-all duration-200 ${
                  isDoctors ? "bg-blue-900" : ""
                }`}
              >
                <p className="text-2xl">
                  <FaStethoscope />
                </p>
                <p>Doctors</p>
              </div>

              {/* <div
                onClick={() => handleSidebarList(setIsPatients)}
                className={`flex gap-2 items-center hover:bg-blue-900 pl-4 py-2 cursor-pointer transition-all duration-200 ${
                  isPatients ? "bg-blue-900" : ""
                }`}
              >
                <p className="text-2xl">
                  <FaBedPulse />
                </p>
                <p>Patients</p>
              </div> */}

              <div
                onClick={() => handleSidebarList(setIsPharmacies)}
                className={`flex gap-2 items-center hover:bg-blue-900 pl-4 py-2 cursor-pointer transition-all duration-200 ${
                  isPharmacies ? "bg-blue-900" : ""
                }`}
              >
                <p className="text-2xl">
                  <BsCapsule />
                </p>
                <p>Pharmacies</p>
              </div>

              <div
                onClick={() => handleSidebarList(setIsAnalytics)}
                className={`flex gap-2 items-center hover:bg-blue-900 pl-4 py-2 cursor-pointer transition-all duration-200 ${
                  isAnalytics ? "bg-blue-900" : ""
                }`}
              >
                <p className="text-2xl">
                  <GiProgression />
                </p>
                <p>Analytics</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={`flex-1 p-6 bg-gray-50`}>
            {isOverview && <Overview />}
            {isDoctors && <Doctor />}
            {isHospitals && <Hospitals />}
            {isPharmacies && <Pharmacy />}
            {isAnalytics && <Analytics />}
          </div>
        </div>

        {/* --- Footer --- */}
        <div className="mt-auto bg-blue-950">
          <Footer />
        </div>
      </div>
    </>
  );
}

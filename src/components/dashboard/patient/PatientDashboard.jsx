import { useEffect, useState } from "react";
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import { IoMdHome } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaBookMedical } from "react-icons/fa";
import { CiReceipt } from "react-icons/ci";
import Overview from "./Overview";
import Navbar from "../../Navbar";
import Footer from "../../Footer";
import AppointmentView from "./AppointmentView";

import MedicalReport from "../doctor/MedicalReport"
import axios from "axios";
import ViewPrescription from "../doctor/ViewPrescription";
import { toast } from "react-toastify";

const patientId = localStorage.getItem("userId");
export default function PatientDashboard() {

  const [patient, setPatient] = useState({});

    const location = useLocation();
  const [openSidebar, setOpenSidebar] = useState(false);
    //patient sidebar items
  const [isOverview, setIsOverview] = useState(true);
  const [upcomingAppointments, setUpcomingAppointments] = useState(false);
  const [isMedicalRecords, setIsMedicalRecords] = useState(false);
  const [isPrescription, setIsPrescription] = useState(false);

  //handling patient dashboard
  const listItems = [
    setIsOverview,
    setUpcomingAppointments,
    setIsMedicalRecords,
    setIsPrescription,
  ];

  // useEffect(()=>{
  //   if((location.state) && (location.state.from==="AddHospital")){
  //     setIsOverview(false);
  //     setIsHospitals(true);
  //   }
  //   if((location.state) && (location.state.from==="deleteHospital")){
  //     setIsOverview(false);
  //     setIsHospitals(true);
  //   }
  // }, [location.state]);

   useEffect(() => {
    const getPatient = async () => {
      try {
        const res = await axios.get(
          `https://medilink-backend-1-26fb.onrender.com/patient/${patientId}`
        );
        console.log(res.data);
        setPatient(res.data);
      } catch (err) {
        console.error("Error during fetching patient details: ", err);
        if (err.response && err.response.message) {
          toast.error(err.response.message);
        } else toast.error("Something went wrong!!");
      }
    };
    getPatient();
  }, []);

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
                onClick={() => handleSidebarList(setUpcomingAppointments)}
                className={`flex gap-2 items-center hover:bg-blue-900 pl-4 py-2 cursor-pointer transition-all duration-200 mt-2 ${
                  upcomingAppointments ? "bg-blue-900" : ""
                }`}
              >
                <p className="text-3xl">
                  <MdOutlinePendingActions />
                </p>
                <p>Upcoming Appointments</p>
              </div>

              <div
                onClick={() => handleSidebarList(setIsMedicalRecords)}
                className={`flex gap-2 items-center hover:bg-blue-900 pl-4 py-2 cursor-pointer mt-2 transition-all duration-200 ${
                  isMedicalRecords ? "bg-blue-900" : ""
                }`}
              >
                <p className="text-2xl">
                  <FaBookMedical />
                </p>
                <p>Medical Records</p>
              </div>

              <div
                onClick={() => handleSidebarList(setIsPrescription)}
                className={`flex gap-2 items-center hover:bg-blue-900 pl-4 py-2 mt-2 cursor-pointer transition-all duration-200 ${
                  isPrescription ? "bg-blue-900" : ""
                }`}
              >
                <p className="text-3xl">
                  <CiReceipt />
                </p>
                <p>Prescriptions</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={`flex-1 p-6 bg-gray-50`}>
            {isOverview && <Overview/>}
            {upcomingAppointments && <AppointmentView/>}
            {isMedicalRecords && <MedicalReport patient={patient}/> }
            {isPrescription && <ViewPrescription patient={patient}/> }
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

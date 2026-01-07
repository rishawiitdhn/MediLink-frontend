import { useParams } from "react-router-dom";
import Navbar from "../../Navbar";
import Footer from "../../Footer";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaHospital } from "react-icons/fa";
import LinearProgress from "@mui/material/LinearProgress";
import MedicalReport from "./MedicalReport";
import { CircularProgress } from "@mui/material";

//dialog import
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";
import ViewPrescription from "./ViewPrescription";

const doctorId = localStorage.getItem("userId");
const role = localStorage.getItem("role");
export default function ViewPatient() {
  const { patientId } = useParams();

  const [patient, setPatient] = useState({});
  const [doctor, setDoctor] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [desc, setDesc] = useState("");
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAppointmentCompleting, setIsAppointmentCompleting] = useState(false);

  const isFirstRender = useRef(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getPatient = async () => {
      try {
        if(isFirstRender.current)setIsLoading(true);
        const res = await axios.get(
          `https://medilink-backend-1-26fb.onrender.com/patient/${patientId}`
        );
        const res1 = await axios.get(
          `https://medilink-backend-1-26fb.onrender.com/doctor/${doctorId}`
        );
        setPatient(res.data);
        setDoctor(res1.data);
        if(isFirstRender.current){
          setIsLoading(false);
          isFirstRender.current = false;
      }
      } catch (err) {
        console.error("Error during fetching doctor details: ", err);
        if (err.response && err.response.message) {
          toast.error(err.response.message);
        } else toast.error("Something went wrong!!");
      }
    };
    getPatient();
  }, [isUploading]);

  const patientName = patient?.name
    ? patient?.name?.toUpperCase()[0] + patient?.name?.slice(1)
    : "";

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const files = document.querySelector("#report").files;
    const inputVal = document.querySelector("#report");

    if (!files || files.length === 0) {
      return toast.info("Please select some files");
    }

    const formData = new FormData();
    for (let f of files) formData.append("reports", f);

    formData.append("description", desc);
    try {
      setIsUploading(true);
      const res = await axios.post(
        `https://medilink-backend-1-26fb.onrender.com/doctor/report/${patientId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${role}`,
          },
        }
      );
      setIsUploading(false);

      inputVal.value = "";
      setDesc("");
      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.message) {
        toast.error(err.response.message);
      } else toast.error("Something went wrong!!");
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setDesc(e.target.value);
  };

  const handleCompletedAppointment = async () => {
    try {
      setIsAppointmentCompleting(true);
      const res = await axios.post(
        "https://medilink-backend-1-26fb.onrender.com/doctor/completedAppointment",
        {
          patientId: patient._id,
          doctorId: doctorId,
        },
        {
          headers: {
            Authorization: `Bearer ${role}`,
          },
        }
      );
      toast.success(res.data.message);
      setIsAppointmentCompleting(false);
      navigate(`/`);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.message) {
        toast.error(err.response.message);
      } else toast.error("Something went wrong!!");
    }
  };
  //dialog fn
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isLoading)
    return (
      <>
        <div className="flex justify-center items-center h-full min-h-screen">
          <CircularProgress size="3rem" />
        </div>
      </>
    );
  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* --- Navbar --- */}
        <Navbar />
        {isUploading && <LinearProgress />}
        <div className="flex justify-center m-5">
          <div className="patient shadow-2xl p-10 rounded-xl bg-white md:flex md:items-center">
            <div>
              <div className="content">
                <h1 className="text-3xl text-blue-900 font-semibold">
                  {patientName}
                </h1>
                <p className="text-gray-600 text-lg font-medium">Patient</p>
              </div>
              <div className="contacts mt-5">
                <p className="flex items-center gap-2 text-xl font-semibold mt-2">
                  <MdEmail />
                  {patient.email}
                </p>
                <p className="flex items-center gap-2 text-xl font-semibold mt-2">
                  <FaPhoneAlt />
                  +91 {patient.contact}
                </p>
                <p className="flex items-center gap-2 text-xl font-semibold mt-2">
                  <FaHospital />
                  {doctor?.hospital?.name}
                </p>
                <button
                  className="px-4 py-2 mt-5 w-full max-w-sm bg-linear-to-br from-green-600 to-green-800 
               text-white font-semibold rounded-lg hover:bg-green-700 transition 
               hover:cursor-pointer shadow-md"
                  onClick={handleClickOpen}
                >
                  Visited?
                </button>
              </div>
            </div>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              disableEnforceFocus
              disableRestoreFocus
            >
              <DialogTitle id="alert-dialog-title">
                {"Patient Visited? ⚠️"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure that patient has visited?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" onClick={handleClose}>
                  NO
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCompletedAppointment}
                  disabled={isAppointmentCompleting}
                >
                  YES
                  {isAppointmentCompleting && (
                    <CircularProgress
                      size={20}
                      sx={{ ml: 1 }}
                      color="inherit"
                    />
                  )}
                </Button>
              </DialogActions>
            </Dialog>

            <div className="md:border-l-2 md:h-full md:ml-10 border-b-2 mt-5"></div>
            <div className="flex flex-col items-center justify-center gap-8 mt-8 md:ml-10 px-4">
              {/* Upload Report Section */}
              <form
                action=""
                encType="multipart/form-data"
                className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl shadow-md w-full max-w-sm"
                onSubmit={handleSubmit}
              >
                <label
                  htmlFor="desc"
                  className="text-gray-700 font-medium text-left"
                >
                  Describe something about report
                </label>
                <input
                  id="desc"
                  type="text"
                  value={desc}
                  onChange={handleChange}
                  required
                  className="border-2 rounded-md px-2 py-1 font-medium"
                />

                <label htmlFor="report" className="text-gray-700 font-medium">
                  Upload file in .pdf, .jpg or .jpeg format
                </label>

                <input
                  id="report"
                  type="file"
                  accept=".pdf, .jpg, .jpeg, .png"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm
                 file:bg-blue-600 file:text-white file:rounded-lg file:px-4 file:py-2 
                 file:border-none hover:file:bg-blue-700 transition cursor-pointer"
                  multiple
                />

                <button
                  type="submit"
                  className={`px-4 py-2 w-full  
                 text-white font-semibold rounded-lg transition 
                 hover:opacity-90 ${
                   isUploading
                     ? "hover:cursor-not-allowed bg-linear-to-br from-blue-400 to-blue-500"
                     : "hover:cursor-pointer bg-linear-to-br from-blue-600 to-blue-800"
                 } `}
                  disabled={isUploading}
                >
                  Upload Report
                </button>
              </form>

              {/* Prescription Button */}
              <button
                className="px-4 py-3 w-full max-w-sm bg-linear-to-br from-blue-600 to-blue-800 
               text-white font-semibold rounded-lg hover:bg-blue-700 transition 
               hover:cursor-pointer shadow-md"
                onClick={() => navigate(`/doctor/prescription/${patientId}`)}
              >
                Prescription
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-center w-full">
          <MedicalReport patient={patient} />
          <ViewPrescription patient={patient} />
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

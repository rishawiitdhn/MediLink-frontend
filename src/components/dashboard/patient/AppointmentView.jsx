import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AppointmentView() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState({});
  const [open, setOpen] = React.useState(false);
  const [refresh, setRefresh] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const patientId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  useEffect(() => {
    const getPatientAppointments = async () => {
      try {
        const res = await axios.get(
          `https://medilink-backend-1-26fb.onrender.com/patient/appointments/${patientId}`
        );
        setAppointments(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching patient appointments: ", err);
        if (err.response && err.response.data) {
          toast.error(err.response.message);
        } else toast.error("Something went wrong!");
      }
    };
    getPatientAppointments();
  }, [refresh]);

  const handleClickOpen = (appointment) => {
    setSelectedAppointment(appointment);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteAppointment = async () => {
    try {
      const res = await axios.delete(
        `https://medilink-backend-1-26fb.onrender.com/patient/appointment/${selectedAppointment._id}`,
        {
          headers: {
            Authorization: `Bearer ${role}`
          }
        }
      );
      toast(res.data.message);
      handleClose();
      setRefresh(!refresh);
    } catch (err) {
      console.error("Error during cancelling appointment: ", err);
      if (err.response && err.response.message) {
        toast.error(err.response.message);
      } else toast.error("Something went wrong!!");
    }
  };

  //search-bar
  const handleChange = (e) => {
    setSearchVal(e.target.value);
  };

  useEffect(() => {
    if (searchVal === "") {
      setSearchResults(appointments);
    } else {
      let filterAppointments = appointments.filter(
        (appt) =>
          appt.doctor.name.toLowerCase().replace(/\s+/g, "").includes(searchVal.replace(/\s+/g, "").toLowerCase()) ||
          appt.hospital.name
            .toLowerCase()
            .includes(searchVal.toLowerCase())
      );
      setSearchResults(filterAppointments);
    }
  }, [searchVal, appointments]);

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-700 text-center pt-5">
        Upcoming Appointments
      </h1>

      <div className="flex justify-center mt-5">
        <div className="search relative flex flex-col sm:flex-row items-center sm:items-stretch justify-center gap-2 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto p-2">
          {/* Search box wrapper */}
          <div className="relative grow w-full">
            <SearchIcon className="absolute top-3 left-2 text-gray-500" />
            <input
              type="text"
              placeholder="Search for doctors, hospitals..."
              className="pl-8 pr-3 py-2 bg-gray-200 rounded-md border border-none w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              value={searchVal}
            />
          </div>
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        container={document.body}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Cancel Appointment? ⚠️"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure want to cancel the appointment? This action can't be
            undone
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleClose}>
            No
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteAppointment}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {appointments && appointments.length == 0 && (
        <div className="flex justify-center">
          <p
            className="mt-8 px-10 py-3 text-lg font-semibold 
    rounded-2xl shadow-lg border border-blue-300 
    bg-white/60 backdrop-blur-sm 
    text-transparent bg-clip-text 
    bg-linear-to-r from-blue-600 to-indigo-600"
          >
            No Upcoming Appointments!
          </p>
        </div>
      )}

      {searchResults && searchResults.length == 0 && (searchVal!=="") && (
        <div className="flex justify-center">
          <p
            className="mt-8 px-10 py-3 text-lg font-semibold 
    rounded-2xl shadow-lg border border-blue-300 
    bg-white/60 backdrop-blur-sm 
    text-transparent bg-clip-text 
    bg-linear-to-r from-blue-600 to-indigo-600"
          >
            No results for "{searchVal}"
          </p>
        </div>
      )}
      <div className="appointment-cards grid md:grid-cols-2 gap-5 mt-10">
        {searchResults.length>0 && searchResults.map((appointment) => {
          return (
            <div
              className="appointment-card drop-shadow-2xl bg-blue-100 p-3 pl-5 border border-gray-600 rounded-lg flex justify-between"
              key={appointment._id}
            >
              <div>
                <p className="text-xl font-bold">
                  {appointment.date.split("T")[0]}
                </p>
                
                <p className="text-lg font-semibold font-serif text-gray-800">
                  Dr. {appointment.doctor.name}
                </p>

                <p className="text-md font-medium font-serif text-gray-500">
                  {/* {appointment?.doctor?.specialisation[0].toUpperCase()}{appointment?.doctor?.specialisation.slice(1)} */}
                  {appointment.doctor.specialisation}
                </p>
                <p className="text-md font-semibold text-gray-600">
                  ( {appointment.hospital.name} )
                </p>
              </div>
              <div className="flex flex-col gap-2 justify-center items-center">
                <button
                  onClick={() => handleClickOpen(appointment)}
                  className="px-6 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-500 transition duration-300 hover:cursor-pointer font-semibold"
                >
                  Cancel
                </button>

                <p
                  className="px-3 py-1 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition duration-300 font-semibold"
                >
                  Pending...
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

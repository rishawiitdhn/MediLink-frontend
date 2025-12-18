import Footer from "../../../Footer";
import Navbar from "../../../Navbar";
import AdminDashboard from "../AdminDashboard";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import DoctorView from "./DoctorView";
import React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { useNavigate } from "react-router-dom";

//for dialog box
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function HospitalView() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const [hospital, setHospital] = useState({});
  const { hospitalId } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  //for dialog box
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //normal
  useEffect(() => {
    const getHospitalById = async () => {
      try {
        const res = await axios.get(
          `https://medilink-backend-1-26fb.onrender.com/admin/hospitals/${hospitalId}`,
          {
            headers: {
              Authorization: `Bearer ${role}`,
            },
          }
        );
        setHospital(res.data);
        setDoctors(res.data.doctors);
      } catch (err) {
        console.error("Error fetching hospital: ", err);
        if (err.response && err.response.data) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Something went wrong!!");
        }
      }
    };
    getHospitalById();
  }, []);

  const handleDelete = async (id) => {
    try {
      setIsDeleting(true);
      const res = await axios.delete(
        `https://medilink-backend-1-26fb.onrender.com/admin/hospitals/${id}`,
        {
          headers: {
            Authorization: `Bearer ${role}`,
          },
        }
      );
      navigate("/adminDashboard", {
        state: { from: "deleteHospital" },
      });
      setIsDeleting(false);
      toast.success("Hospital deleted successfully!!");
    } catch (err) {
      console.error("Error deleting hospital: ", err);
      if (err.response && err.response.data) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong!!");
      }
    }
  };

  const handleUpdate = (hospitalId) => {
    navigate(`/admin/hospital/update/${hospitalId}`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <div className="flex justify-center items-center mt-5">
          <Card sx={{ maxWidth: 600 }}>
            <h1 className="font-bold text-3xl text-center m-2">
              {hospital.name}
            </h1>
            <img src={hospital.image?.url} alt="hospital_image" className=" w-lg p-5" />
            <hr className="mx-2" />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {hospital.address}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
              ></Typography>
            </CardContent>
            <div className="flex gap-4 justify-self-end m-3">
              <Button
                onClick={() => handleUpdate(hospital._id)}
                variant="contained"
                size="small"
              >
                Update
              </Button>

              <Button
                onClick={handleClickOpen}
                variant="contained"
                size="small"
                color="error"
              >
                Remove
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Delete Hospital? ⚠️"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Are you sure want to remove this hospital? This action can't
                    be undone ❌
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button variant="contained" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(hospital._id)}
                    autoFocus
                  >
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </Card>
        </div>

        {/* Showing available departments */}
        <div className="departments bg-white mt-5">
          <p className="text-2xl md:text-3xl font-semibold text-gray-700 text-center pt-5 underline">
            Available Departments
          </p>
          <div className=" grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-5 p-10 justify-center">
            {hospital.departments &&
              hospital.departments.map((department, idx) => {
                return (
                  <p
                    key={idx}
                    className="shadow-xl rounded-md p-3 text-center font-semibold text-gray-700"
                  >
                    {department && department.toUpperCase()}
                  </p>
                );
              })}
            {hospital.departments && hospital.departments.length == 0 && (
              <p className=" font-semibold shadow-md pl-2 text-center text-blue-700 text-lg">
                No departments yet!
              </p>
            )}
          </div>
        </div>

        {/* showing doctor lists */}
        {doctors && doctors.length > 0 && (
          <DoctorView doctorList={doctors} hospitalId={hospital._id} />
        )}
      </div>
      <div className="bg-blue-950 py-2">
        <Footer />
      </div>
    </>
  );
}

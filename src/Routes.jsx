import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

//Auth context
import { useAuth } from "./AuthContex";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";

import Dashboard from "./components/dashboard/Dashboard";
import AdminDashboard from "./components/dashboard/admin/AdminDashboard";
import HospitalView from "./components/dashboard/admin/hospital/HospitalView";
import AddHospital from "./components/dashboard/admin/hospital/AddHospital";
import UpdateHospital from "./components/dashboard/admin/hospital/UpdateHospital";
import PatientDashboard from "./components/dashboard/patient/PatientDashboard";
import ViewPatient from "./components/dashboard/doctor/ViewPatient";
import Prescription from "./components/dashboard/doctor/Prescription";
import NotAuthorised from "./components/NotAuthorised";
import NotFound from "./components/NotFound";


const ProjectRoutes = () => {
  const { currUser, setCurrUser } = useAuth();
  const [role, setRole] = useState(()=>localStorage.getItem("role"));
  const navigate = useNavigate();
  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    const roleFromStorage = localStorage.getItem("role");
    if (
      !userIdFromStorage &&
      !["/login", "/signup", "/"].includes(window.location.pathname)
    ) {
      navigate("/");
    }

    if (userIdFromStorage && !currUser) {
      setCurrUser(userIdFromStorage);
      setRole(roleFromStorage);
    }
  }, [currUser, setCurrUser, navigate]);

  const element = useRoutes([
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/register",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/adminDashboard",
      element: role === "admin" ? <AdminDashboard /> : <NotAuthorised />,
    },
    {
      path: "/admin/hospital/:hospitalId",
      element: role === "admin" ? <HospitalView /> : <NotAuthorised />,
    },
    {
      path: "/admin/hospital",
      element: role === "admin" ? <AddHospital /> : <NotAuthorised />,
    },
    {
      path: "/admin/hospital/update/:hospitalId",
      element: role === "admin" ? <UpdateHospital /> : <NotAuthorised />,
    },
    {
      path: "/patientDashboard",
      element: role === "patient" ? <PatientDashboard /> : <NotAuthorised />,
    },
    {
      path: "/doctor/prescription/:patientId",
      element: role === "doctor" ? <Prescription /> : <NotAuthorised />,
    },
    {
      path: "/doctor/:patientId",
      element: role === "doctor" ? <ViewPatient /> : <NotAuthorised />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  return element;
};

export default ProjectRoutes;

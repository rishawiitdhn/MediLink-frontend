import React, { useEffect, useState } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import { CircularProgress } from "@mui/material";

// Auth context
import { useAuth } from "./AuthContex";

// Pages
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

import ProtectedRoute from "./ProtectedRoute";

const ProjectRoutes = () => {
  const { currUser, setCurrUser, currRole, setCurrRole } = useAuth();
  
  const element = useRoutes([
    { path: "/", element: <Dashboard /> },
    { path: "/register", element: <Signup /> },
    { path: "/login", element: <Login /> },

    {
      path: "/adminDashboard",
      element: (
        <ProtectedRoute currRole={currRole} allowedRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/hospital/:hospitalId",
      element: (
        <ProtectedRoute currRole={currRole} allowedRole="admin">
          <HospitalView />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/hospital",
      element: (
        <ProtectedRoute currRole={currRole} allowedRole="admin">
          <AddHospital />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/hospital/update/:hospitalId",
      element: (
        <ProtectedRoute currRole={currRole} allowedRole="admin">
          <UpdateHospital />
        </ProtectedRoute>
      ),
    },
    {
      path: "/patientDashboard",
      element: (
        <ProtectedRoute currRole={currRole} allowedRole="patient">
          <PatientDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/doctor/prescription/:patientId",
      element: (
        <ProtectedRoute currRole={currRole} allowedRole="doctor">
          <Prescription />
        </ProtectedRoute>
      ),
    },
    {
      path: "/doctor/:patientId",
      element: (
        <ProtectedRoute currRole={currRole} allowedRole="doctor">
          <ViewPatient />
        </ProtectedRoute>
      ),
    },

    { path: "/not-authorised", element: <NotAuthorised /> },
    { path: "*", element: <NotFound /> },
  ]);

   const [isReady, setIsReady] = useState(false);

useEffect(() => {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  if (userId && role) {
    setCurrUser(userId);
    setCurrRole(role);
  }
  setIsReady(true);

}, []);

if (!isReady)
  return (
    <div className="flex justify-center items-center min-h-screen">
      <CircularProgress size="3rem" />
    </div>
  );

  return element;
};

export default ProjectRoutes;

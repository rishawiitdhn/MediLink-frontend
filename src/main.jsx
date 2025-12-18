import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./AuthContex.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import ProjectRoutes from "./Routes.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Router>
      <ToastContainer position="bottom-right"/>
      <ProjectRoutes />
    </Router>
  </AuthProvider>
);

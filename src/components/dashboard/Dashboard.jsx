import AdminDashboard from "./admin/AdminDashboard";
import DoctorDashboard from "./doctor/DoctorDashboard";
import NormalDashboard from "./NormalDashboard";
import PatientDashboard from "./patient/PatientDashboard";
import PharmacyDashboard from "./pharmacy/PharmacyDashboard";

export default function Dashboard(){
    const role = localStorage.getItem("role");
    if(role==="admin")return <AdminDashboard/>;
    if(role==="patient")return <PatientDashboard/>
    if(role==="doctor")return <DoctorDashboard/>
    if(role==="pharmacy")return <PharmacyDashboard/>
    return <NormalDashboard/>
}
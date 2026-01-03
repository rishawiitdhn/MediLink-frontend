import axios from "axios";
import { FaStethoscope } from "react-icons/fa";
import { LiaHospitalSolid } from "react-icons/lia";
import { BsCapsule } from "react-icons/bs";
import { FaBedPulse } from "react-icons/fa6";
import { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';

export default function Overview() {
  const [doctorCount, setDoctorCount] = useState(0);
  const [hospitalCount, setHospitalCount] = useState(0);
  const [pharmacyCount, setPharmacyCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const role = localStorage.getItem("role");

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const res1 = await axios.get("https://medilink-backend-1-26fb.onrender.com/doctor/all");
      setDoctorCount(res1.data.length);
      setDoctors(res1.data);

      const res2 = await axios.get("https://medilink-backend-1-26fb.onrender.com/pharmacy/all");
      setPharmacyCount(res2.data.length);

      const res3 = await axios.get("https://medilink-backend-1-26fb.onrender.com/patient/all");
      setPatientCount(res3.data.length);

      const res4 = await axios.get("https://medilink-backend-1-26fb.onrender.com/admin/hospitals", {
          headers: {
            Authorization: `role ${role}`,
          }});
      setHospitalCount(res4.data.length);
      setIsLoading(false);
    };

    getData();
  }, []);

  if(isLoading)return (
    <>
    <div className="flex justify-center items-center h-full">
      <CircularProgress size="3rem"/>
    </div>
    </>
  )
  return (
    <>
      <div className="categories grid grid-cols-2 gap-5 justify-items-center mt-8 md:flex md:justify-center">
        <div className="doctors w-fit shadow-lg rounded-lg pl-6 pr-6 pt-4 pb-4 bg-white">
          <div className="flex gap-2 items-center">
            <p className="text-blue-700">
              <FaStethoscope className="w-7 h-7" />
            </p>
            <p className="text-2xl font-semibold">{doctorCount}+</p>
          </div>
          <p className="text-center font-medium text-gray-600">Doctors</p>
        </div>
        <div className="hospitals w-fit shadow-lg rounded-lg pl-6 pr-6 pt-4 pb-4 bg-white">
          <div className="flex gap-2 items-center">
            <p className="text-blue-700">
              <LiaHospitalSolid className="w-9 h-9" />
            </p>
            <p className="text-2xl font-semibold">{hospitalCount}+</p>
          </div>
          <p className="text-center font-medium text-gray-600">Hospitals</p>
        </div>
        <div className="pharmacies w-fit shadow-lg rounded-lg pl-6 pr-6 pt-4 pb-4 bg-white">
          <div className="flex gap-2 items-center">
            <p className="text-blue-700">
              <BsCapsule className="w-8 h-8" />
            </p>
            <p className="text-2xl font-semibold">{pharmacyCount}+</p>
          </div>
          <p className="text-center font-medium text-gray-600">Pharmacies</p>
        </div>
        <div className="pharmacies w-fit shadow-lg rounded-lg pl-6 pr-6 pt-4 pb-4 bg-white">
          <div className="flex gap-2 items-center">
            <p className="text-blue-700">
              <FaBedPulse className="w-8 h-8" />
            </p>
            <p className="text-2xl font-semibold">{patientCount}+</p>
          </div>
          <p className="text-center font-medium text-gray-600">
            Patients Served
          </p>
        </div>
      </div>

      {/* Doctors Lists */}
      <div className="doctorsList mt-10 bg-white">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-700 text-center pt-5">
          Featured Doctors
        </h1>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 m-3">
          {doctors.map((doctor) => {
            return (
              <div
                key={doctor._id}
                className="card shadow-2xl p-5 flex-col gap-5 justify-center m-3 rounded-lg bg-blue-50"
              >
                <div className="flex justify-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/8815/8815112.png"
                    alt="doctor_img"
                    className="w-20 h-20 rounded-full self-center"
                  />
                </div>
                <div className="details mt-2">
                  <p className="font-semibold text-center text-lg">
                    Dr. {doctor.name}
                  </p>
                  <p className="text-gray-600 text-center">
                    {doctor.specialisation}
                  </p>
                  <p className="text-gray-800 text-center">
                    ( {doctor?.hospital?.name} )
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

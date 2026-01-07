import { useEffect, useState } from "react";
import Navbar from "../../Navbar";
import Footer from "../../Footer";
import { toast } from "react-toastify";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [doctor, setDoctor] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const doctorId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  useEffect(() => {
    const getTodayAppointments = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `https://medilink-backend-1-26fb.onrender.com/doctor/appointments/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${role}`,
            },
          }
        );

        console.log(res.data);
        const appts = res.data.filter((appt) => appt.isDone === false);
        setTodayAppointments(appts);

        const res1 = await axios.get(
          `https://medilink-backend-1-26fb.onrender.com/doctor/${doctorId}`
        );
        setDoctor(res1.data);
        setIsLoading(false);
      } catch (err) {
        console.error(
          "Error during fetching today's doctor appointments: ",
          err
        );
        if (err.response && err.response.data.message) {
          toast.error(err.response.data.message);
        } else toast.error("Something went wrong!!");
      } finally{
        setIsLoading(false);
      }
    };

    getTodayAppointments();
  }, []);

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

        {/* Main content */}
        {!doctor.verified && (
          <div className="p-6 flex justify-center bg-linear-to-br from-blue-50 to-blue-100 rounded-3xl shadow-lg">
            <p className="text-center text-red-700 p-3 text-xl shadow-xl w-fit font-semibold rounded-lg border-blue-700 border-2">
              Sorry, You are not verified till now!!
            </p>
          </div>
        )}
        {doctor.verified && (
          <div className="p-6 bg-linear-to-br from-blue-50 to-blue-100 rounded-3xl shadow-lg">
            <h1 className="text-2xl font-bold text-blue-700 mb-5">
              Today's Appointments
            </h1>
            {todayAppointments.length === 0 && (
              <div className="flex justify-center">
                <p className="text-center p-3 text-xl shadow-xl w-fit font-semibold rounded-lg">
                  No Appointments for today!!
                </p>
              </div>
            )}
            {todayAppointments.length > 0 && (
              <TableContainer
                component={Paper}
                className="rounded-2xl shadow-md border border-blue-200"
              >
                <Table sx={{ minWidth: 650 }} aria-label="appointments table">
                  <TableHead>
                    <TableRow className="bg-blue-600">
                      <TableCell align="left">
                        <p className="text-white font-semibold text-lg pl-4">
                          Patient Name
                        </p>
                      </TableCell>
                      <TableCell align="right">
                        <p className="text-white font-semibold text-lg">
                          Email
                        </p>
                      </TableCell>
                      <TableCell align="right">
                        <p className="text-white font-semibold text-lg">
                          Contact
                        </p>
                      </TableCell>
                      <TableCell align="right">
                        <p className="text-white font-semibold text-lg">
                          Hospital
                        </p>
                      </TableCell>
                      <TableCell align="right">
                        <p className="text-white font-semibold text-lg">
                          Doctor
                        </p>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {todayAppointments &&
                      todayAppointments.length > 0 &&
                      todayAppointments.map((appt, index) => (
                        <TableRow
                          onClick={() =>
                            navigate(`/doctor/${appt.patient._id}`)
                          }
                          key={appt._id}
                          className={`${
                            index % 2 === 0 ? "bg-blue-50" : "bg-white"
                          } hover:bg-blue-100 transition-all cursor-pointer`}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            className="font-medium pl-4"
                          >
                            {appt?.patient?.name}
                          </TableCell>

                          <TableCell align="right" className="text-gray-700">
                            {appt?.patient?.email}
                          </TableCell>

                          <TableCell align="right" className="text-gray-700">
                            {appt?.patient?.contact}
                          </TableCell>

                          <TableCell
                            align="right"
                            className="text-gray-700 font-medium"
                          >
                            {doctor?.hospital?.name || "—"}
                          </TableCell>

                          <TableCell
                            align="right"
                            className="text-gray-700 font-medium"
                          >
                            Dr. {doctor?.name || ""}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        )}
        {/* --- Footer --- */}
        <div className="mt-auto bg-blue-950">
          <hr className="border-2"></hr>
          <Footer />
        </div>
      </div>
    </>
  );
}

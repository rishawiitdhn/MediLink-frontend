import Modal from "@mui/material/Modal";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";

export default function ViewPrescription({ patient }) {
  const [open, setOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescription, setPrescription] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isFirstRender = useRef(true);

  const handleOpen = (presc) => {
    setOpen(true);
    setPrescription(presc);
  };
  const handleClose = () => setOpen(false);
  useEffect(() => {
    const getPatientPrescription = async () => {
      try {
        {isFirstRender.current && setIsLoading(true);}
        if (patient._id === undefined) return;
        const res = await axios.get(
          `https://medilink-backend-1-26fb.onrender.com/patient/prescriptions/${patient?._id}`
        );
        setPrescriptions(res.data);
        setIsLoading(false);
        isFirstRender.current = false;
      } catch (err) {
        console.error("Error during fetching patient prescription: ", err);
        if (err.response && err.response.message) {
          toast.error(err.response.message);
        } else toast.error("Something went wrong!!");
      }
    };
    getPatientPrescription();
  }, [patient?._id]);

  if (isLoading)
    return (
      <>
        <div className="flex justify-center items-center h-full">
          <CircularProgress size="3rem" />
        </div>
      </>
    );
  return (
    <>
      <div className="m-3 sm:m-5 w-full">
        <div className="patient shadow-2xl p-4 sm:p-6 lg:p-10 rounded-xl bg-white">
          <h1 className="text-2xl sm:text-3xl font-semibold text-blue-800 underline text-center mb-5">
            Prescriptions
          </h1>

          {/* Modal */}
          {prescription.medicines && prescription.medicines.length > 0 && (
            <Modal open={open} onClose={handleClose}>
              <div className="m-5 sm:m-10 md:m-20 xl:m-50">
                <TableContainer
                  component={Paper}
                  className="rounded-2xl shadow-md border border-blue-200"
                >
                  <Table sx={{ minWidth: 400 }} aria-label="appointments table">
                    <TableHead>
                      <TableRow className="bg-blue-600">
                        <TableCell align="left">
                          <p className="text-white font-semibold text-lg pl-4">
                            Medicine Name
                          </p>
                        </TableCell>
                        <TableCell align="right">
                          <p className="text-white font-semibold text-lg">
                            Dose
                          </p>
                        </TableCell>
                        <TableCell align="right">
                          <p className="text-white font-semibold text-lg">
                            Duration
                          </p>
                        </TableCell>
                        <TableCell align="right">
                          <p className="text-white font-semibold text-lg">
                            Instruction
                          </p>
                        </TableCell>
                        <TableCell align="right">
                          <p className="text-white font-semibold text-lg">
                            Doctor
                          </p>
                        </TableCell>
                        <TableCell align="right">
                          <p className="text-white font-semibold text-lg">
                            Hospital
                          </p>
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {prescription.medicines.map((medicine, index) => (
                        <TableRow
                          key={medicine._id}
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
                            {medicine.name}
                          </TableCell>

                          <TableCell align="right" className="text-gray-700">
                            {medicine.dose}
                          </TableCell>

                          <TableCell align="right" className="text-gray-700">
                            {medicine.duration}
                          </TableCell>

                          <TableCell
                            align="right"
                            className="text-gray-700 font-medium"
                          >
                            {medicine.instruction}
                          </TableCell>

                          <TableCell
                            align="right"
                            className="text-gray-700 font-medium"
                          >
                            Dr. {prescription?.doctor?.name || ""}
                          </TableCell>
                          <TableCell
                            align="right"
                            className="text-gray-700 font-medium"
                          >
                            {prescription?.hospital?.name || ""}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Modal>
          )}

          {prescriptions.length === 0 && (
            <div className="flex justify-center">
              <p className="text-center p-3 text-base sm:text-xl shadow-xl w-fit font-semibold rounded-lg">
                No Prescriptions available!!
              </p>
            </div>
          )}

          {/* Prescription list */}
          {prescriptions.length > 0 && (
            <div className="space-y-3 mt-4">
              {prescriptions.map((presc) => (
                <div
                  key={presc._id}
                  className="
                flex flex-col sm:flex-row
                items-start sm:items-center
                justify-between
                gap-3
                border border-gray-300
                rounded-lg
                p-3 sm:px-6
              "
                >
                  <p className="text-sm sm:text-lg font-semibold wrap-break-word">
                    By Dr. {presc.doctor.name}
                    <span className="block sm:inline text-gray-600">
                      {" "}
                      ({presc.issuedDate.split("T")[0]})
                    </span>
                  </p>

                  <button
                    onClick={() => handleOpen(presc)}
                    className="
                  bg-gray-200
                  px-3 py-1
                  rounded-lg
                  text-sm
                  font-medium
                  hover:bg-gray-300
                  transition
                  whitespace-nowrap
                "
                  >
                    See prescription
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

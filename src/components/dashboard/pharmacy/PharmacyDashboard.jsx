import Footer from "../../Footer";
import Navbar from "../../Navbar";
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
import Button from "@mui/material/Button";
import { SiTicktick } from "react-icons/si";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";

export default function PharmacyDashboard() {
  const [open, setOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescription, setPrescription] = useState({});
  let [searchVal, setSearchVal] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [pharmacy, setPharmacy] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDispensing, setIsDispensing] = useState(false);

  const isFirstRender = useRef(true);

  const handleOpen = (presc) => {
    setOpen(true);
    setPrescription(presc);
  };

  useEffect(() => {
    const getAllPrescriptions = async () => {
      try {
        if (isFirstRender.current) setIsLoading(true);
        const pharmacyId = localStorage.getItem("userId");
        const role = localStorage.getItem("role");
        const res = await axios.get(
          `https://medilink-backend-1-26fb.onrender.com/pharmacy/prescriptions/${pharmacyId}`,
          {
            headers: {
              Authorization: `Bearer ${role}`,
            },
          }
        );
        setPrescriptions(res.data);
        const res2 = await axios.get(
          `https://medilink-backend-1-26fb.onrender.com/pharmacy/pharmacy/${pharmacyId}`
        );
        setPharmacy(res2.data);
        if (isFirstRender.current) {
          setIsLoading(false);
          isFirstRender.current = false;
        }
      } catch (err) {
        console.error("Error during fetching All prescriptions: ", err);
        if (err.response && err.response.message) {
          toast.error(err.response.message);
        } else toast.error("Something went wrong!!");
      }
    };
    getAllPrescriptions();
  }, [open]);
  const handleClose = () => setOpen(false);

  const handlePrescriptionStatus = async () => {
    try {
      const role = localStorage.getItem("role");
      setIsDispensing(true);
      const res = await axios.patch(
        `https://medilink-backend-1-26fb.onrender.com/pharmacy/${prescription._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${role}`,
          },
        }
      );
      handleClose();
      setIsDispensing(false);
      if (res.data.status === "pending") toast.info("Changes updated!");
      else toast.success("Medicines dispensed successfully");
    } catch (err) {
      console.error("Error during changing prescription status ", err);
      if (err.response && err.response.message) {
        toast.error(err.response.message);
      } else toast.error("Something went wrong!!");
    }
  };

  //search patient or doctor logic
  useEffect(() => {
    if (prescriptions.length > 0) {
      if (searchVal === "") {
        setSearchResults(prescriptions);
      } else {
        const query = searchVal.trim().toLowerCase();
        let filterPrescriptions = prescriptions.filter(
          (prescription) =>
            prescription.patient.name
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            prescription.doctor.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filterPrescriptions);
      }
    }
  }, [searchVal, prescriptions]);

  const handleChange = (e) => {
    setSearchVal(e.target.value);
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

        <div className=" w-full sm:p-5 p-2">
          <div className="patient shadow-2xl p-4 sm:p-6 lg:p-10 rounded-xl bg-white">
            <h1 className="text-2xl sm:text-3xl font-semibold text-blue-800 underline text-center mb-5">
              Prescriptions
            </h1>

            {/* search Input */}
            <div className="flex justify-center mt-5">
              <div className="search relative flex flex-col sm:flex-row items-center sm:items-stretch justify-center gap-2 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto p-2">
                {/* Search box wrapper */}
                <div className="relative grow w-full">
                  <SearchIcon className="absolute top-2 left-2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search for patients, doctors..."
                    className="pl-8 pr-3 py-2 bg-gray-100 rounded-md border border-none w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={handleChange}
                    value={searchVal}
                  />
                </div>
              </div>
            </div>

            {!pharmacy.verified && (
              <div className="p-6 flex justify-center bg-linear-to-br from-blue-50 to-blue-100 rounded-3xl shadow-lg">
                <p className="text-center text-red-700 p-3 text-xl shadow-xl w-fit font-semibold rounded-lg border-blue-700 border-2">
                  Sorry, You are not verified till now!!
                </p>
              </div>
            )}
            {/* Modal */}
            {pharmacy.verified &&
              prescription.medicines &&
              prescription.medicines.length > 0 && (
                <Modal open={open} onClose={handleClose}>
                  <div className="m-5 sm:m-10 md:m-20 xl:m-50">
                    <TableContainer
                      component={Paper}
                      className="rounded-2xl shadow-md border border-blue-200"
                    >
                      <Table
                        sx={{ minWidth: 400 }}
                        aria-label="appointments table"
                      >
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
                              } hover:bg-blue-100 transition-all`}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                className="font-medium pl-4"
                              >
                                {medicine.name}
                              </TableCell>

                              <TableCell
                                align="right"
                                className="text-gray-700"
                              >
                                {medicine.dose}
                              </TableCell>

                              <TableCell
                                align="right"
                                className="text-gray-700"
                              >
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
                    <div className="flex justify-end p-1 bg-white">
                      <Button
                        onClick={handlePrescriptionStatus}
                        variant="contained"
                        disabled={isDispensing}
                        color={
                          prescription.status === "dispensed"
                            ? "success"
                            : "warning"
                        }
                        sx={{ textTransform: "none" }}
                      >
                        {prescription.status === "dispensed" ? (
                          <>
                            Dispensed &nbsp; <SiTicktick />
                          </>
                        ) : (
                          "Dispense"
                        )}
                        {isDispensing && (
                          <CircularProgress
                            size={20}
                            sx={{ ml: 1 }}
                            color="inherit"
                          />
                        )}
                      </Button>
                    </div>
                  </div>
                </Modal>
              )}

            {pharmacy.verified && searchResults.length === 0 && (
              <div className="flex justify-center">
                <p className="text-center p-3 text-base sm:text-xl shadow-xl w-fit font-semibold rounded-lg">
                  No Prescriptions available!!
                </p>
              </div>
            )}

            {/* Prescription list */}
            {searchResults.length > 0 && (
              <div className="space-y-3 mt-4">
                {searchResults.map((presc) => (
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
                      {presc.patient.name}
                    </p>

                    <p className="text-sm sm:text-lg font-semibold wrap-break-word">
                      By Dr. {presc.doctor.name}
                      <span className="block sm:inline text-gray-600">
                        {" "}
                        ({presc.issuedDate.split("T")[0]})
                      </span>
                    </p>

                    <span
                      className={`text-sm sm:text-md font-semibold wrap-break-word p-1 px-2 rounded-md ${
                        presc.status === "dispensed"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {presc.status === "dispensed" ? (
                        <p className="flex justify-center items-center gap-2">
                          Dispensed <SiTicktick />
                        </p>
                      ) : (
                        "Pending..."
                      )}
                    </span>

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

        {/* --- Footer --- */}
        <div className="mt-auto bg-blue-950">
          <hr className="border-2"></hr>
          <Footer />
        </div>
      </div>
    </>
  );
}

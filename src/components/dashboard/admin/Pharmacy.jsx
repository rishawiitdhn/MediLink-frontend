import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdCheckmarkCircle } from "react-icons/io";
import CircularProgress from "@mui/material/CircularProgress";

const role = localStorage.getItem("role");
export default function () {
  const [pharmacies, setPharmacies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const getAllPharmacies = async () => {
      try {
        if(isFirstRender.current)setIsLoading(true);
        const res = await axios.get(
          "https://medilink-backend-1-26fb.onrender.com/pharmacy/all"
        );
        setPharmacies(res.data);
        if(isFirstRender.current){
          setIsLoading(false);
          isFirstRender.current = false;
        }
      } catch (err) {
        console.error("Error during fetching all pharmacies: ", err);
        if (err.response && err.response.message) {
          toast.error(err.response.message);
        } else toast.error("Network error");
      }
    };
    getAllPharmacies();
  }, [isApproving]);

  const handleApprovePharmacies = async (pharmacyId) => {
    try {
      setIsApproving(true);
      const res = await axios.patch(
        `https://medilink-backend-1-26fb.onrender.com/admin/pharmacy/${pharmacyId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${role}`,
          },
        }
      );
      console.log(res.data);
      if (res.data.verified === true)
        toast.success(`${res.data.name} verified successfully!!`);
      else toast.info(`Changes Updated!!`);
      setIsApproving(false);
    } catch (err) {
      console.error("Error during fetching all pharmacies: ", err);
      if (err.response && err.response.message) {
        toast.error(err.response.message);
      } else toast.error("Network error");
    }
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pharmacies.length > 0 &&
          pharmacies.map((pharmacy) => (
            <div
              key={pharmacy._id}
              className="border border-gray-300 p-5 rounded-2xl shadow-sm hover:shadow-md transition bg-white w-full max-w-sm mx-auto"
            >
              <div>
                <p className="text-2xl font-semibold font-serif text-green-600 wrap-break-word">
                  {pharmacy.name}
                </p>
                <hr className="my-3" />

                <div>
                  <p className="text-lg font-bold text-blue-800">
                    {pharmacy.hospital?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {pharmacy.hospital?.address[0].toUpperCase()}
                    {pharmacy.hospital?.address.slice(1)}
                  </p>
                </div>
              </div>

              <hr className="my-3" />

              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm font-semibold text-green-900 break-all">
                  <FaPhoneAlt className="shrink-0" />
                  (+91) {pharmacy.contact}
                </p>
                <p className="flex items-center gap-2 text-sm font-semibold text-blue-950 break-all">
                  <MdEmail className="shrink-0" />
                  {pharmacy.email}
                </p>
              </div>

              <div className="flex justify-end mt-5">
                <button
                  disabled={isApproving}
                  onClick={() => handleApprovePharmacies(pharmacy._id)}
                  className={`px-4 py-1.5 text-white rounded-lg font-semibold flex items-center gap-2 ${
                    pharmacy.verified
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  } ${
                    isApproving
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer opacity-100"
                  } transition`}
                >
                  {pharmacy.verified ? (
                    <>
                      Verified <IoMdCheckmarkCircle />
                    </>
                  ) : (
                    "Approve"
                  )}
                  
                </button>
              </div>
            </div>
          ))}
        {pharmacies.length === 0 && (
          <div className="flex justify-center">
            <p className="text-center p-3 text-base sm:text-xl shadow-xl w-fit font-semibold rounded-lg">
              No Pharmacies Available!!
            </p>
          </div>
        )}
      </div>
    </>
  );
}

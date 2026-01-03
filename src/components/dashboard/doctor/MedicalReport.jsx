import CircularProgress from "@mui/material/CircularProgress";
export default function MedicalReport({ patient }) {
  return (
    <>
      <div className="m-3 sm:m-5 w-full">
        <div className="patient shadow-2xl p-4 sm:p-6 lg:p-10 rounded-xl bg-white">
          <h1 className="text-2xl sm:text-3xl font-semibold text-blue-800 underline text-center mb-5">
            Medical Records
          </h1>

          {/* No records */}
          {patient?.medicalRecords?.length === 0 && (
            <div className="flex justify-center">
              <p className="text-center p-3 text-base sm:text-xl shadow-xl w-fit font-semibold rounded-lg">
                No medical records!
              </p>
            </div>
          )}

          <div className="space-y-3">
            {patient?.medicalRecords?.length > 0 &&
              patient?.medicalRecords?.map((record) => (
                <div
                  key={record._id}
                  className="
                flex flex-col sm:flex-row
                items-start sm:items-center
                justify-between
                gap-2
                border border-gray-300
                rounded-lg
                p-3 sm:px-6
              "
                >
                  <p className="text-sm sm:text-lg font-semibold wrap-break-word">
                    {record.description}
                    <span className="block sm:inline text-gray-600">
                      {" "}
                      ({record.date.split("T")[0]})
                    </span>
                  </p>

                  <a
                    href={record.url}
                    target="_blank"
                    rel="noopener noreferrer"
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
                    See report
                  </a>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

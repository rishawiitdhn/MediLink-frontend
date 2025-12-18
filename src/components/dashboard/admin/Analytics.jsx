import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { PieChart, Pie, Cell, Legend } from "recharts";
import { BarChart, Bar } from "recharts";

const COLORS = [
  "#6366F1", // indigo
  "#22C55E", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#06B6D4", // cyan
  "#A855F7", // purple
  "#EC4899", // pink
];

export default function Analytics() {
  const [appointmentsData, setAppointmentData] = useState([]);
  const [specializationData, setSpecializationData] = useState([]);
  const [hospitalData, setHospitalData] = useState([]);

  useEffect(() => {
    const getAppointmentsPerDay = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/admin/analytics/appointmentsperday"
        );
        // console.log(res.data);
        setAppointmentData(res.data);
      } catch (err) {
        console.error("Error during getting appointment per day data: ", err);
        if (err.response && err.response.message) {
          toast.error(err.response.message);
        } else toast.error("Something went wrong!!");
      }
    };
    getAppointmentsPerDay();
    const fetchSpeciallisationData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/admin/analytics/speciallisation"
        );
        // console.log(res.data);
        setSpecializationData(res.data);
      } catch (err) {
        console.error("Error during getting appointment per day data: ", err);
        if (err.response && err.response.message) {
          toast.error(err.response.message);
        } else toast.error("Something went wrong!!");
      }
    };
    fetchSpeciallisationData();

    const fetchHospitalData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/admin/analytics/prescriptions"
        );
        setHospitalData(res.data);
      } catch (err) {
        console.error("Error during getting appointment per day data: ", err);
        if (err.response && err.response.message) {
          toast.error(err.response.message);
        } else toast.error("Something went wrong!!");
      }
    };
    fetchHospitalData();
  }, []);
  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="Line-Chart px-10 pt-2 w-full h-[400px] sm:h-[350px] shadow-xl rounded-lg border-gray-300 border">
          <h1 className="text-2xl mb-2 font-serif font-bold text-blue-900 text-center">
            Number of Appointments per day
          </h1>
          <ResponsiveContainer width="100%" height="100%" className="pb-25">
            <LineChart width={600} height={300} data={appointmentsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="_id"
                label={{
                  value: "Date",
                  position: "insideBottom",
                  dy: 10,
                  style: {
                    fill: "#555",
                    fontSize: 18,
                    fontWeight: 600,
                  },
                }}
              />
              <YAxis
                label={{
                  value: "Number of appointments",
                  position: "insideStart",
                  angle: -90,
                  dx: -24,
                  style: {
                    fill: "#555",
                    fontSize: 18,
                    fontWeight: 600,
                  },
                }}
              />
              <Tooltip />
              <Line type="monotone" dataKey="count" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bar-chart w-full h-[450px] p-5 bg-white rounded-xl shadow ">
          <h1 className="text-2xl mt-2 mb-2 font-serif font-bold text-blue-900 text-center">
            Doctors by Specialization
          </h1>

          <ResponsiveContainer width="100%" height="100%" className="py-8">
            <PieChart>
              <Pie
                data={specializationData}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={110}
                innerRadius={60} // makes it donut style
                paddingAngle={3}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {specializationData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full h-[450px] p-5 bg-linear-to-br from-blue-50 to-white rounded-2xl shadow-lg">
          <h1 className="text-2xl mb-4 font-serif font-bold text-blue-900 text-center">
            Prescriptions by Hospital
          </h1>

          <ResponsiveContainer width="100%" height="100%" className="py-10">
            <BarChart
              data={hospitalData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

              <XAxis
                dataKey="hospitalName"
                tick={{ fill: "#374151", fontSize: 12 }}
                angle={-20}
                textAnchor="end"
                interval={0}
                label={{
                  value: "Hospital",
                  position: "insideBottom",
                  dy: 50,
                  style: { fill: "#374151", fontSize: 16, fontWeight: 600 },
                }}
              />

              <YAxis
                tick={{ fill: "#374151", fontSize: 12 }}
                label={{
                  value: "Prescriptions Dispensed",
                  angle: -90,
                  position: "inside",
                  dx: -18,
                  style: { fill: "#374151", fontSize: 16, fontWeight: 600 },
                }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                }}
              />


              <Bar
                dataKey="count"
                radius={[8, 8, 0, 0]} // rounded bars
              >
                {hospitalData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

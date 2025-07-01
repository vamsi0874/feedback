import React, { useEffect } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

type Employee = {
  id: string;
  name: string;
  feedback_count: number;
  sentiment_summary: {
    positive: number;
    neutral: number;
    negative: number;
  };
}
const ManagerDashboard = () => {
  const [dashboardData, setDashboardData] = React.useState<{
    team_size: number;
    total_feedbacks: number;
    employees: Employee[];
  }>();

  const navigate = useNavigate();



  const fetchdashboardData = async () => {
    const response = await api.get("/dashboard/");
    // console.log("Dashboard data:", response.data);
    setDashboardData(response.data);
  };

  useEffect(() => {
    fetchdashboardData();
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manager Dashboard</h1>
        <button  onClick={()=>navigate('/feedbacks/create')} className="bg-blue-500 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition cursor-pointer">
          Create Feedback
        </button>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <p className="text-lg font-medium text-gray-700">Team Size: <span className="font-semibold">{dashboardData?.team_size}</span></p>
          <p className="text-lg font-medium text-gray-700">Total Feedbacks: <span className="font-semibold">{dashboardData?.total_feedbacks}</span></p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Employees</h2>
          <div className="space-y-4">
            {dashboardData?.employees.map((employee: Employee, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md cursor-pointer transition"
                onClick={() => navigate(`/feedbacks/${employee.id}`)}
              >
                <p className="text-lg font-medium text-gray-800">👤 {employee.name}</p>
                <p className="text-sm text-gray-600">Feedback Count: <span className="font-semibold">{employee.feedback_count}</span></p>

                <div className="mt-2 text-sm text-gray-700">
                  <p className="font-semibold">Sentiment Summary:</p>
                  <div className="flex gap-4 mt-1">
                    <p className="text-green-600">Positive: {employee.sentiment_summary.positive}</p>
                    <p className="text-yellow-600">Neutral: {employee.sentiment_summary.neutral}</p>
                    <p className="text-red-600">Negative: {employee.sentiment_summary.negative}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;

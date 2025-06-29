import React, { useEffect } from "react";
import { api } from "../api";
import { useNavigate, useParams } from "react-router-dom";

const FeedbacksPage = () => {
  const [feedbacks, setFeedbacks] = React.useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const fetchFeedbacks = async () => {
    const response = await api.get(`/feedbacks/manager/employee/${id}`);
    const data = await response.data;
    setFeedbacks(data);
    console.log("Feedbacks:", data);
  };

  const updateFeedBack = (feedback: any) => {
    navigate(`/feedbacks/update/${feedback.id}`, { state: { data: feedback } });
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Employee Feedbacks</h1>
        <button  onClick={()=>navigate('/feedbacks/create')} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition cursor-pointer">
          Create Feedback
        </button>
        </div>

        <div className="space-y-6">
          {feedbacks.length === 0 ? (
            <p className="text-gray-600">No feedbacks found.</p>
          ) : (
            feedbacks.map((feedback: any, index: number) => (
            
          <div
              key={index}
              className="bg-white shadow-sm rounded-lg p-5 border border-gray-200 hover:shadow-md transition"
            >
              <div className="mb-4">
                <p className="text-gray-800 font-medium"> Employee: {feedback.employee.name} ({feedback.employee.email})</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
                <div><span className="font-semibold">Strengths:</span> {feedback.strengths}</div>
                <div><span className="font-semibold">Areas to Improve:</span> {feedback.areas_to_improve}</div>
                <div><span className="font-semibold">Sentiment:</span> {feedback.sentiment}</div>
                <div><span className="font-semibold">Tags:</span> {feedback.tags.join(", ")}</div>
                <div><span className="font-semibold">Acknowledged:</span> {feedback.acknowledged ? " Yes" : "No"}</div>
                <div><span className="font-semibold">Employee Comments:</span> {feedback.employee_comments || "—"}</div>
                <div><span className="font-semibold">Created At:</span> {new Date(feedback.created_at).toLocaleDateString()}</div>
                <div><span className="font-semibold">Updated At:</span> {new Date(feedback.updated_at).toLocaleDateString()}</div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => updateFeedBack(feedback)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition"
                >
                   Update Feedback
                </button>
              </div>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
};

export default FeedbacksPage;

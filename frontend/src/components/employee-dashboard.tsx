import { useEffect, useState } from "react";
import { api } from "../api";
import ReactMarkdown from "react-markdown";

interface Feedback {
  id: string;
  manager: {
    name: string;
  };
  employee: {
    name: string;
    email: string;
  };
  strengths: string;
  areas_to_improve: string;
  sentiment: string;
  tags: string[];
  employee_comments: string;
  acknowledged: boolean;
  created_at: string;
  updated_at: string;
}
const EmployeeDashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/my-feedbacks/");
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const acknowledgeFeedback = async (feedbackId: string) => {
    try {
      await api.post(`/feedbacks/${feedbackId}/acknowledge/`);
      fetchDashboardData();
    } catch (error) {
      console.error("Error acknowledging feedback:", error);
    }
  };

  const submitComment = async (feedbackId: string) => {
    try {
      await api.patch(`/feedbacks/${feedbackId}/comment/`, {
        employee_comments: comment,
      });
      setComment("");
      setCommentingId(null);
      await fetchDashboardData();
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment.");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-4 mt-3">
      <h2 className="text-xl font-semibold mb-4">Feedback Timeline</h2>
      {dashboardData.length === 0 ? (
        <p className="text-gray-600">No feedback received yet.</p>
      ) : (
        dashboardData.map((feedback: Feedback, index: number) => (
          <div
            key={index}
            className="border p-4 rounded-md shadow-sm transition relative"
          >
            <p>
              <span className="font-medium">Manager:</span>{" "}
              {feedback.manager?.name}
            </p>
            <p>
              <span className="font-medium">Strengths:</span>{" "}
              {feedback.strengths}
            </p>
            <p>
              <span className="font-medium">Areas to Improve:</span>{" "}
              {feedback.areas_to_improve}
            </p>
            <p>
              <span className="font-medium">Sentiment:</span>{" "}
              {feedback.sentiment}
            </p>
            <p>
              <span className="font-medium">Tags:</span>{" "}
              {feedback.tags?.join(", ")}
            </p>
            {/* <p>
              <span className="font-medium">Comment:</span>{" "}
              {feedback.employee_comments || "No Comments"}
            </p> */}
         <div className="mt-2">
            <p className="font-medium">Comment:</p>
            {feedback.employee_comments ? (
                <div className="prose max-w-none">
                <ReactMarkdown>{feedback.employee_comments}</ReactMarkdown>
                </div>
            ) : (
                <p className="text-gray-500 italic">No Comments</p>
            )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(feedback.created_at).toLocaleDateString()}
            </p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => acknowledgeFeedback(feedback.id)}
                className={`px-4 py-2 rounded text-white ${
                  feedback.acknowledged
                    ? "bg-green-600 cursor-default"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={feedback.acknowledged}
              >
                {feedback.acknowledged ? "Acknowledged" : "Acknowledge"}
              </button>

              <button
                onClick={() =>
                  setCommentingId(
                    commentingId === feedback.id ? null : feedback.id
                  )
                }
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {commentingId === feedback.id ? "Cancel" : "Comment"}
              </button>
            </div>

            {commentingId === feedback.id && (
              <div className="mt-4">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Add a comment..."
                ></textarea>
                <button
                  onClick={() => submitComment(feedback.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default EmployeeDashboard;

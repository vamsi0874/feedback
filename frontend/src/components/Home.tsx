import { useEffect, useState } from 'react';
import { api } from '../api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Assignment {
  id: number;
  title: string;
  description: string;
  due_date: string;
}

const Home = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get('/view-assignments/');
        setAssignments(response.data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-600">Loading assignments...</p>
      </div>
    );
  }

  //  Student View
  if (user?.role === 'student') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Available Assignments</h2>

        {assignments.length === 0 ? (
          <p className="text-center text-gray-500">No assignments available at the moment.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <Link to={`/submit-assignment/${assignment.id}`} key={assignment.id}>
                <li className="bg-white border rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200">
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">{assignment.title}</h3>
                  <p className="text-gray-700 mb-3">{assignment.description}</p>
                  <p className="text-sm text-gray-500">
                     Due Date:{' '}
                    {new Date(assignment.due_date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
    );
  }

  //  Teacher View
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr ">
      <div className="bg-gray-100 p-10 rounded-2xl shadow-xl text-center max-w-sm w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6"> Welcome, Teacher</h1>

        <div className="flex flex-col gap-4">
          <Link
            to="/create-assignment"
            className="hover:bg-gray-400 text-black py-3 px-6 rounded-lg text-lg font-medium transition-all duration-200"
          >
             Create Assignment
          </Link>

          <Link
            to="/view-submissions"
            className=" hover:bg-gray-400 text-black py-3 px-6 rounded-lg text-lg font-medium transition-all duration-200"
          >
             View Submissions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

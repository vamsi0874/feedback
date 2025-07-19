import { useEffect, useState, useCallback } from 'react';
import { api } from '../../api';

interface Submission {
  id: number;
  student_name: string;
  comment: string;
  file: string;
  submitted_at: string;
}

const ViewSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const getSubmissions = useCallback(async () => {
    try {
      const res = await api.get('/view-submissions/');
      setSubmissions(res.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getSubmissions();
  }, [getSubmissions]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-lg text-gray-600 animate-pulse">Loading submissions...</p>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
         Student Submissions
      </h2>

      {submissions.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No submissions available.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="rounded-2xl shadow-sm border border-gray-200 bg-white hover:shadow-lg transition duration-200 p-6 flex flex-col justify-between"
            >
              <div>
                <p className="text-xl font-semibold text-indigo-700 mb-2">
                   {sub.student_name}
                </p>

                <p className="text-gray-700 mb-2">
                  <span className="font-medium text-gray-800">Comment:</span>{' '}
                  {sub.comment || <em className="text-gray-500">No comment</em>}
                </p>

                <p className="text-sm text-gray-500 mb-4">
                  <strong>Submitted:</strong>{' '}
                  {new Date(sub.submitted_at).toLocaleString()}
                </p>
              </div>

              {sub.file ? (
                <a
                  href={sub.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-block  text-black text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-100 transition"
                >
                   Download File
                </a>
              ) : (
                <p className="mt-auto text-sm text-gray-400 italic">No file uploaded</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ViewSubmissions;

import { useParams } from 'react-router-dom';
import { api } from '../../api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitAssignmentSchema } from '../../schemas/shemas';
import { useCallback, useMemo } from 'react';

const SubmitAssignment = () => {
  const { id } = useParams();

  const formConfig = useMemo(
    () => ({
      resolver: zodResolver(submitAssignmentSchema),
    }),
    []
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm(formConfig);

  const onSubmit = useCallback(
    async (data: any) => {
      const formData = new FormData();
      formData.append('comment', data.comment);
      formData.append('file', data.file[0]);

      try {
        const res = await api.post(`/submit-assignment/${id}/`, formData);
   
        alert(`Assignment ${id} submitted with comment: ${data.comment}`);
        reset();
      } catch (error) {
        console.error('Submission failed:', error);
        alert('Submission failed. Please try again.');
      }
    },
    [id]
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Submit Assignment #{id}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload File
            </label>
            <input
              type="file"
              className="w-full border border-gray-300 rounded-md p-2"
              {...register('file')}
            />
            {errors.file && (
              <p className="text-sm text-red-600 mt-1">
                {errors.file.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comment
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2"
              rows={4}
              placeholder="Enter your comments..."
              {...register('comment')}
            />
            {errors.comment && (
              <p className="text-sm text-red-600 mt-1">
                {errors.comment.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 transition-colors text-white font-medium py-2 px-4 rounded-md"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitAssignment;

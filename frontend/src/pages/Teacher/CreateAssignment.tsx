import { useCallback, useMemo } from 'react';
import { api, BASE_URL } from '../../api';
import { assignmnetSchema } from '../../schemas/shemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface Assignment {
  title: string;
  description: string;
  due_date: string;
  file?: FileList;
}

const CreateAssignment = () => {
  const schema = useMemo(() => assignmnetSchema, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Assignment>({
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(async (data: Assignment) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('due_date', data.due_date);
    if (data.file) {
      formData.append('file', data.file[0]);
    }
    try {
     await api.post(`${BASE_URL}/create-assignment/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(` Assignment Created: ${data.title}`);
      reset();
  
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert(' Failed to create assignment');
    }
  }, [reset]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  px-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6"> Create New Assignment</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Title</label>
            <input
              type="text"
              {...register('title')}
              placeholder="Enter assignment title"
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.title ? 'border-red-500 ring-red-300' : 'focus:ring-blue-400'
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              {...register('description')}
              placeholder="Enter description"
              rows={4}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 resize-none ${
                errors.description ? 'border-red-500 ring-red-300' : 'focus:ring-blue-400'
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">File</label>
            <input
              type="file"
              className="w-full border border-gray-300 rounded-md p-2"
              {...register('file')}/>
          </div>
          {errors.file && (
            <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-1">Due Date</label>
            <input
              type="date"
              {...register('due_date')}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.due_date ? 'border-red-500 ring-red-300' : 'focus:ring-blue-400'
              }`}
            />
            {errors.due_date && (
              <p className="text-red-500 text-sm mt-1">{errors.due_date.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md disabled:opacity-60"
          >
            {isSubmitting ? 'Creating...' : 'Create Assignment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignment;

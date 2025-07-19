import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { api } from '../api';
import { useNavigate } from 'react-router-dom';

interface FeedbackFormData {
    employee_id: string;
    strengths: string;
    areas_to_improve: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    tags?: string | undefined;
    employee_comments?: string | undefined;
}
const feedbackSchema = z.object({
  employee_id: z.string().min(1),
  strengths: z.string().min(1, 'Strengths are required'),
  areas_to_improve: z.string().min(1, 'Areas to improve are required'),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  tags: z.string().optional(),
  employee_comments: z.string().optional(),
});

export default function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

       const [employees, setEmployees] = React.useState([]);
       const navigate = useNavigate();

      const managerEmployees = React.useCallback(async () => {
        try {
          const response = await api.get('/dashboard/');
          setEmployees(response.data.employees || []);
        } catch (error) {
          console.error('Failed to load employees:', error);
        }
      }, []);


  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(feedbackSchema),
    // defaultValues: {
    //   employee_id: employeeId,
    //   sentiment: 'neutral',
    // },
  });

  const onSubmit = async (data:FeedbackFormData) => {
    const payload = {
      ...data,
      tags: data.tags ? data.tags.split(',').map((t:string) => t.trim()) : [],
    };
setIsSubmitting(true);
try {
  await api.post('/feedbacks/create/', payload);
  reset();
  navigate('/feedbacks/' + data.employee_id);
} catch (err) {
  console.error(err);
  alert('Failed to submit feedback');
} finally {
  setIsSubmitting(false);
}

  };

React.useEffect(() => {
  managerEmployees();
}, [managerEmployees]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto p-6 shadow rounded space-y-4"
    >
      <h2 className="text-2xl font-semibold mb-4">Submit Feedback</h2>

      <div>
        <label className="block font-medium">Strengths</label>
        <textarea
          {...register('strengths')}
          className="w-full p-2 border rounded"
        />
        {errors.strengths && (
          <p className="text-red-500 text-sm">{errors.strengths.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium">Areas to Improve</label>
        <textarea
          {...register('areas_to_improve')}
          className="w-full p-2 border rounded"
        />
        {errors.areas_to_improve && (
          <p className="text-red-500 text-sm">{errors.areas_to_improve.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium">Sentiment</label>
        <select
          {...register('sentiment')}
          className="w-full p-2 border rounded"
        >
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Tags (comma separated)</label>
        <input
          type="text"
          {...register('tags')}
          className="w-full p-2 border rounded"
        />
      </div>

      
      <div>
        <div>Employee</div>
         <select {...register('employee_id')} className="w-full p-2 border rounded">
        {employees.map((employee:{id:string, name:string}, index: number) => (

              <option key={index} value={employee.id}>
              {employee.name}
            </option>
 
        ))}
          </select>
      </div> 

        <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

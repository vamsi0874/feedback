import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { api } from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect } from 'react';

const feedbackSchema = z.object({
  strengths: z.string().min(1, 'Strengths are required'),
  areas_to_improve: z.string().min(1, 'Areas to improve are required'),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  tags: z.string().optional(),
  employee_comments: z.string().optional(),
});

export default function UpdateForm({ data }:any) {
    
    const {id} = useParams();
    const empId = data?.employee?.id || '';
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
 
      strengths: data.strengths,
        areas_to_improve: data.areas_to_improve,
        sentiment: data.sentiment,
        tags: data.tags,

    },
  });

  const onSubmit = async (data:any) => {
    const payload = {
      ...data,
      tags: data.tags ? data.tags.split(',').map((t:any) => t.trim()) : [],
    };
  // console.log('Payload:', payload);
   setIsSubmitting(true);
try {
  await api.put(`/feedbacks/${id}/update/`, payload);
  reset({ strengths: '', areas_to_improve: '', sentiment: 'neutral', tags: '' });
  navigate('/feedbacks/' + empId);
} catch (err) {
  alert('Failed to submit feedback');
} finally {
  setIsSubmitting(false);
}
  };
useEffect(() => {
  if (data) {
    reset({
      strengths: data.strengths || '',
      areas_to_improve: data.areas_to_improve || '',
      sentiment: data.sentiment || 'neutral',
      tags: data.tags?.join(', ') || '',
    });
  }
}, [data, reset]);


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

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={isSubmitting}
>
  {isSubmitting ? 'Updating...' : 'Update'}
</button>
    </form>
  );
}

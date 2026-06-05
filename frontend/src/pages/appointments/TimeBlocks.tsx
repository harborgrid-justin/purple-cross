/**
 * WF-COMP-XXX | TimeBlocks.tsx - Time Blocks
 * NOTE: Migrated from Redux to TanStack Query hooks - 2025-10-24
 * Purpose: React component for TimeBlocks functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { z } from 'zod';
import {
  useTimeBlocks,
  useCreateTimeBlock,
  useDeleteTimeBlock,
} from '../../hooks/useTimeBlocks';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

interface TimeBlockRow {
  id: string;
  title?: string;
  type?: string;
  startTime: string;
  endTime: string;
}

const timeBlockSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.string().min(1, 'Type is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
});

type TimeBlockFormData = z.infer<typeof timeBlockSchema>;

const BLOCK_TYPES = ['procedure', 'break', 'meeting', 'emergency'].map((v) => ({
  value: v,
  label: v.charAt(0).toUpperCase() + v.slice(1),
}));

const TimeBlocks = () => {
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isError } = useTimeBlocks({ limit: 100 });
  const blocks = (data as { data?: TimeBlockRow[] } | undefined)?.data ?? [];

  const createTimeBlock = useCreateTimeBlock();
  const deleteTimeBlock = useDeleteTimeBlock();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm(timeBlockSchema);

  const onSubmit = (formData: TimeBlockFormData): void => {
    createTimeBlock.mutate(formData, {
      onSuccess: () => {
        reset();
        setShowForm(false);
      },
    });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Time Block Management</h1>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowForm((prev) => !prev)}
          aria-expanded={showForm}
        >
          {showForm ? 'Close Form' : '+ Create Block'}
        </button>
      </header>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
          {createTimeBlock.isError && (
            <div className="alert alert-error" role="alert">
              {createTimeBlock.error instanceof Error
                ? createTimeBlock.error.message
                : 'Failed to create time block'}
            </div>
          )}
          <FormField label="Title" registration={register('title')} error={errors.title} required />
          <FormField
            label="Type"
            registration={register('type')}
            error={errors.type}
            options={BLOCK_TYPES}
            required
          />
          <FormField
            label="Start Time"
            type="datetime-local"
            registration={register('startTime')}
            error={errors.startTime}
            required
          />
          <FormField
            label="End Time"
            type="datetime-local"
            registration={register('endTime')}
            error={errors.endTime}
            required
          />
          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || createTimeBlock.isPending}
            >
              {createTimeBlock.isPending ? 'Saving...' : 'Save Block'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                reset();
                setShowForm(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading time blocks...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load time blocks. Please try again.</p>
          </div>
        ) : blocks.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No time blocks defined. Create a block to get started.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Time blocks">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Type</th>
                <th scope="col">Start</th>
                <th scope="col">End</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blocks.map((block) => (
                <tr key={block.id}>
                  <th scope="row">{block.title || 'Untitled'}</th>
                  <td>{block.type || 'N/A'}</td>
                  <td>
                    <time dateTime={block.startTime}>
                      {new Date(block.startTime).toLocaleString()}
                    </time>
                  </td>
                  <td>
                    <time dateTime={block.endTime}>
                      {new Date(block.endTime).toLocaleString()}
                    </time>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-action"
                      onClick={() => deleteTimeBlock.mutate(block.id)}
                      disabled={deleteTimeBlock.isPending}
                      aria-label={`Delete time block ${block.title ?? ''}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TimeBlocks;

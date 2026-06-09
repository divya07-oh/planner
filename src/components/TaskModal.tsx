import React, { useState, useEffect } from 'react';
import { usePlanner } from '../context/PlannerContext';
import type { Task, TaskPriority, TaskStatus } from '../types';
import { Dialog, Input, Dropdown, Button } from './UI';
import { getRelativeDateString } from '../mockData';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task; // If provided, we are editing, otherwise adding
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, taskToEdit }) => {
  const { addTask, updateTask } = usePlanner();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [category, setCategory] = useState('Work');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description);
        setPriority(taskToEdit.priority);
        setStatus(taskToEdit.status);
        setCategory(taskToEdit.category);
        setDueDate(taskToEdit.dueDate);
      } else {
        // Defaults for new task
        setTitle('');
        setDescription('');
        setPriority('medium');
        setStatus('todo');
        setCategory('Work');
        setDueDate(getRelativeDateString(0));
      }
      setError('');
    }
  }, [isOpen, taskToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    const taskData = {
      title,
      description,
      priority,
      status,
      category,
      dueDate,
    };

    if (taskToEdit) {
      updateTask({ ...taskToEdit, ...taskData });
    } else {
      addTask(taskData);
    }
    onClose();
  };

  const priorityOptions = [
    { value: 'low', label: 'Low (Green)' },
    { value: 'medium', label: 'Medium (Orange)' },
    { value: 'high', label: 'High (Red)' },
  ];

  const statusOptions = [
    { value: 'todo', label: 'Todo' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const categoryOptions = [
    { value: 'Work', label: 'Work' },
    { value: 'Personal', label: 'Personal' },
    { value: 'Health', label: 'Health' },
    { value: 'Study', label: 'Study' },
  ];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Edit Task' : 'Add New Task'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Task Title *"
          placeholder="e.g., Learn React hooks"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={error}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a brief task description..."
            className="w-full h-20 px-4 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Dropdown
            label="Priority"
            options={priorityOptions}
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          />

          <Dropdown
            label="Category"
            options={categoryOptions}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <Dropdown
            label="Status"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          />
        </div>

        <div className="flex gap-3 justify-end mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {taskToEdit ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

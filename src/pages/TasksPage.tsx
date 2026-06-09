import React, { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import type { Task, TaskStatus } from '../types';
import { Badge, Button } from '../components/UI';
import { TaskModal } from '../components/TaskModal';
import {
  Plus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Calendar,
  FolderDot
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TasksPage: React.FC = () => {
  const { tasks, deleteTask, updateTask } = usePlanner();

  // Modal and filters state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [localSearch, setLocalSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date'); // 'date' | 'priority' | 'title'

  // Drag and Drop implementation
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const task = tasks.find(t => t.id === id);
    if (task && task.status !== newStatus) {
      const updatedTask = { ...task, status: newStatus };
      updateTask(updatedTask);

      if (newStatus === 'completed') {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.7 }
        });
      }
    }
  };

  const moveTask = (task: Task, direction: 'left' | 'right') => {
    const statusOrder: TaskStatus[] = ['todo', 'in_progress', 'completed'];
    const currentIndex = statusOrder.indexOf(task.status);
    let newIndex = currentIndex;

    if (direction === 'left' && currentIndex > 0) {
      newIndex--;
    } else if (direction === 'right' && currentIndex < 2) {
      newIndex++;
    }

    if (newIndex !== currentIndex) {
      const nextStatus = statusOrder[newIndex];
      updateTask({ ...task, status: nextStatus });
      
      if (nextStatus === 'completed') {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.7 }
        });
      }
    }
  };

  const openAddTask = () => {
    setTaskToEdit(undefined);
    setIsModalOpen(true);
  };

  const openEditTask = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  // Prioritize priority levels
  const priorityWeight = { high: 3, medium: 2, low: 1 };

  // Filter and sort tasks
  const processedTasks = tasks
    .filter(t => {
      const matchesSearch =
        t.title.toLowerCase().includes(localSearch.toLowerCase()) ||
        t.description.toLowerCase().includes(localSearch.toLowerCase());
      const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
      return matchesSearch && matchesPriority && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (sortBy === 'priority') {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return a.title.localeCompare(b.title);
    });

  // Split tasks by status (Tailwind light-themed styles)
  const columns: { title: string; status: TaskStatus; bgClass: string; textClass: string }[] = [
    { title: 'Todo', status: 'todo', bgClass: 'bg-slate-100/50', textClass: 'text-slate-700' },
    { title: 'In Progress', status: 'in_progress', bgClass: 'bg-indigo-50/20 border-indigo-500/5', textClass: 'text-[#4F46E5]' },
    { title: 'Completed', status: 'completed', bgClass: 'bg-green-50/15 border-green-500/5', textClass: 'text-[#22C55E]' },
  ];

  return (
    <div className="flex flex-col gap-6 p-8 h-full max-w-[1600px] mx-auto w-full overflow-hidden select-none">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
            Kanban Board
          </h2>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Organize tasks, set priorities, and track execution lanes.
          </p>
        </div>
        <Button
          onClick={openAddTask}
          className="flex items-center gap-2 self-start sm:self-auto bg-primary shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {/* Filters & Controls bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Health">Health</option>
            <option value="Study">Study</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="date">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
            <option value="title">Sort: Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden h-full pb-4">
        {columns.map((col) => {
          const colTasks = processedTasks.filter(t => t.status === col.status);
          return (
            <div
              key={col.status}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.status)}
              className={`flex flex-col h-full rounded-2xl p-4 border border-slate-200/50 ${col.bgClass}`}
            >
              {/* Column Title Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/50">
                <span className={`text-sm font-bold tracking-tight ${col.textClass}`}>
                  {col.title}
                </span>
                <Badge variant="neutral">{colTasks.length}</Badge>
              </div>

              {/* Task Cards Container */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 scroll-smooth">
                {colTasks.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                    Drop items here
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="glass-panel card-lift rounded-xl p-4 cursor-grab active:cursor-grabbing border border-[#E2E8F0] hover:border-primary/20 shadow-sm transition-all group relative bg-white"
                    >
                      {/* Priority Tag & Actions */}
                      <div className="flex justify-between items-start gap-2 mb-2.5">
                        <Badge
                          variant={
                            task.priority === 'high'
                              ? 'high'
                              : task.priority === 'medium'
                              ? 'medium'
                              : 'low'
                          }
                        >
                          {task.priority}
                        </Badge>

                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => openEditTask(task, e)}
                            className="p-1 rounded bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1 rounded bg-slate-50 border border-slate-200 text-slate-400 hover:text-danger transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h4 className="text-xs font-bold text-slate-800 leading-tight">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-[11px] font-medium text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Card Details Footer */}
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                        {/* Due Date */}
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{task.dueDate}</span>
                        </div>

                        {/* Category */}
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                          <FolderDot className="w-3.5 h-3.5" />
                          <span>{task.category}</span>
                        </div>
                      </div>

                      {/* Column Movement controls for responsive/touch accessibility */}
                      <div className="flex justify-between mt-3.5 pt-2 border-t border-slate-100 md:hidden">
                        <button
                          disabled={task.status === 'todo'}
                          onClick={() => moveTask(task, 'left')}
                          className="flex items-center gap-1 text-[10px] font-bold text-slate-400 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronLeft className="w-3 h-3" /> Prev
                        </button>
                        <button
                          disabled={task.status === 'completed'}
                          onClick={() => moveTask(task, 'right')}
                          className="flex items-center gap-1 text-[10px] font-bold text-slate-400 disabled:opacity-30 cursor-pointer"
                        >
                          Next <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

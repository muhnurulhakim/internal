import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Task } from '../types';
import { encryptData, decryptData } from '../utils/encryption';
import { format } from 'date-fns';
import { Plus, CheckCircle, Edit, X } from 'lucide-react';

export default function TasksPage() {
  const user = useAuthStore((state) => state.user);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editReason, setEditReason] = useState('');

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(decryptData(storedTasks));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTask) {
      const editHistory = {
        id: Date.now().toString(),
        userId: user?.id!,
        timestamp: new Date().toISOString(),
        action: 'edit',
        reason: editReason,
        approved: user?.role === 'manager' ? true : undefined,
        approvedBy: user?.role === 'manager' ? user?.id : undefined,
      };

      const updatedTask = {
        ...editingTask,
        title,
        description,
        editHistory: [...editingTask.editHistory, editHistory],
      };

      const updatedTasks = tasks.map((t) =>
        t.id === editingTask.id ? updatedTask : t
      );

      localStorage.setItem('tasks', encryptData(updatedTasks));
      setTasks(updatedTasks);
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        userId: user?.id!,
        title,
        description,
        completed: false,
        date: format(new Date(), 'yyyy-MM-dd'),
        shift: user?.shift!,
        editHistory: [],
      };

      const updatedTasks = [...tasks, newTask];
      localStorage.setItem('tasks', encryptData(updatedTasks));
      setTasks(updatedTasks);
    }

    setTitle('');
    setDescription('');
    setEditReason('');
    setEditingTask(null);
    setShowForm(false);
  };

  const handleToggleComplete = (task: Task) => {
    const editHistory = {
      id: Date.now().toString(),
      userId: user?.id!,
      timestamp: new Date().toISOString(),
      action: task.completed ? 'uncomplete' : 'complete',
      approved: user?.role === 'manager' ? true : undefined,
      approvedBy: user?.role === 'manager' ? user?.id : undefined,
    };

    const updatedTask = {
      ...task,
      completed: !task.completed,
      editHistory: [...task.editHistory, editHistory],
    };

    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? updatedTask : t
    );

    localStorage.setItem('tasks', encryptData(updatedTasks));
    setTasks(updatedTasks);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Tugas</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Tugas</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingTask ? 'Edit Tugas' : 'Tambah Tugas Baru'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingTask(null);
                  setTitle('');
                  setDescription('');
                  setEditReason('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>

              {editingTask && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alasan Edit
                  </label>
                  <textarea
                    value={editReason}
                    onChange={(e) => setEditReason(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                {editingTask ? 'Simpan Perubahan' : 'Tambah Tugas'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white p-6 rounded-xl shadow-sm ${
              task.completed ? 'border-l-4 border-green-500' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-gray-800">{task.title}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleComplete(task)}
                  className={`p-1 rounded-lg ${
                    task.completed
                      ? 'text-green-600 bg-green-100'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleEdit(task)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{task.description}</p>

            <div className="flex justify-between text-sm text-gray-500">
              <span>Shift {task.shift}</span>
              <span>{task.date}</span>
            </div>

            {task.editHistory.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Terakhir diubah:{' '}
                  {format(
                    new Date(task.editHistory[task.editHistory.length - 1].timestamp),
                    'dd/MM/yyyy HH:mm'
                  )}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
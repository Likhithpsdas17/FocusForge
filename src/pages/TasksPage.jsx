import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiCheckCircle, FiCircle, FiList, FiClock, FiCheckSquare } from 'react-icons/fi';

const TasksPage = () => {
  // --- State ---
  const demoTasks = [
    {
      id: 1,
      title: "Complete Digital Heroes Assignment",
      completed: true,
      createdAt: "Jun 22, 2026",
    },
    {
      id: 2,
      title: "Prepare React Interview Questions",
      completed: false,
      createdAt: "Jun 22, 2026",
    },
    {
      id: 3,
      title: "Deploy FocusForge on Vercel",
      completed: false,
      createdAt: "Jun 22, 2026",
    },
  ];

  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("focusforge_tasks");

      return savedTasks
        ? JSON.parse(savedTasks)
        : demoTasks;
    } catch {
      return demoTasks;
    }
  });

  const [taskTitle, setTaskTitle] = useState('');

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('focusforge_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // --- Handlers ---
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask = {
      id: Date.now(),
      title: taskTitle.trim(),
      completed: false,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setTasks([newTask, ...tasks]);
    setTaskTitle('');
  };

  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // --- Derived State ---
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* --- Header Section --- */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Tasks
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your daily goals and track progress.
          </p>
        </div>

        {/* --- Statistics Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Tasks */}
          <div className="backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 flex items-center justify-between shadow-xl transition-all duration-300 hover:border-slate-700/50">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Tasks</p>
              <h3 className="text-2xl font-bold text-white mt-1">{totalTasks}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
              <FiList size={20} />
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 flex items-center justify-between shadow-xl transition-all duration-300 hover:border-slate-700/50">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Completed Tasks</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">{completedTasks}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
              <FiCheckSquare size={20} />
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 flex items-center justify-between shadow-xl transition-all duration-300 hover:border-slate-700/50">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pending Tasks</p>
              <h3 className="text-2xl font-bold text-amber-400 mt-1">{pendingTasks}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
              <FiClock size={20} />
            </div>
          </div>
        </div>

        {/* --- Task Input Section --- */}
        <form onSubmit={handleAddTask} className="backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Add a new task to your forge..."
              className="w-full flex-1 bg-slate-950/60 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10 transition-all duration-200 active:scale-95 shrink-0"
            >
              <FiPlus size={16} />
              <span>Add Task</span>
            </button>
          </div>
        </form>

        {/* --- Task List Section --- */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            /* Empty State */
            <div className="backdrop-blur-md bg-slate-900/20 border border-dashed border-slate-800 rounded-xl p-12 text-center shadow-inner">
              <div className="inline-flex p-4 bg-slate-900/60 text-slate-500 rounded-full mb-3 border border-slate-800">
                <FiList size={24} />
              </div>
              <h3 className="text-sm font-medium text-slate-300">No tasks found</h3>
              <p className="text-xs text-slate-500 mt-1">Get started by creating your first daily goal above.</p>
            </div>
          ) : (
            /* Active List */
            tasks.map((task) => (
              <div
                key={task.id}
                className={`backdrop-blur-md bg-slate-900/40 border rounded-xl p-4 flex items-center justify-between gap-4 shadow-md transition-all duration-200 group ${task.completed ? 'border-slate-900/40 opacity-60' : 'border-slate-800/60 hover:border-slate-700/50'
                  }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => handleToggleComplete(task.id)}
                    className={`transition-colors shrink-0 focus:outline-none ${task.completed ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-400'
                      }`}
                  >
                    {task.completed ? <FiCheckCircle size={20} /> : <FiCircle size={20} />}
                  </button>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium transition-all truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'
                      }`}>
                      {task.title}
                    </p>
                    <span className="text-[11px] text-slate-500 block mt-0.5 font-medium tracking-wide">
                      {task.createdAt}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-2 text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all duration-200 shrink-0"
                  title="Delete Task"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default TasksPage;
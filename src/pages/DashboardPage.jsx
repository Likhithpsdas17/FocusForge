import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiTrendingUp, 
  FiCheckCircle, 
  FiClock, 
  FiBriefcase, 
  FiZap, 
  FiActivity, 
  FiPlusCircle, 
  FiPlayCircle, 
  FiFilePlus, 
  FiGrid 
} from 'react-icons/fi';

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- State ---
  const [data, setData] = useState({
    name: '',
    dailyTasksGoal: 5,
    dailyPomodoroGoal: 4,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    sessionsCompleted: 0,
    totalApps: 0,
    interviewCount: 0,
    selectedCount: 0,
    rejectedCount: 0,
    productivityScore: 0,
    recentActivity: []
  });

  // --- Process and Aggregate Metrics ---
  useEffect(() => {
    // 1. Fetch from LocalStorage
    const savedSettings = localStorage.getItem('focusforge_settings');
    const savedTasks = localStorage.getItem('focusforge_tasks');
    const savedSessions = localStorage.getItem('focusforge_pomodoro_sessions');
    const savedInterviews = localStorage.getItem('focusforge_interviews');

    const settings = savedSettings ? JSON.parse(savedSettings) : null;
    const tasks = savedTasks ? JSON.parse(savedTasks) : [];
    const sessions = savedSessions ? parseInt(savedSessions, 10) : 0;
    const interviews = savedInterviews ? JSON.parse(savedInterviews) : [];

    // 2. Compute Core Stat Counters
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    const totalApps = interviews.length;
    const interviewCount = interviews.filter(a => a.status === 'Interview' || a.status === 'OA').length;
    const selectedCount = interviews.filter(a => a.status === 'Selected').length;
    const rejectedCount = interviews.filter(a => a.status === 'Rejected').length;

    // 3. Compute Weighted Productivity Score (0 - 100)
    // Formula Requirements: Tasks (50%), Pomodoro (30%), Applications (20%)
    const taskWeight = totalTasks > 0 ? (completedTasks / totalTasks) * 50 : 0;
    const focusWeight = Math.min((sessions / (settings?.dailyPomodoroGoal || 4)) * 30, 30);
    const appWeight = totalApps > 0 ? Math.min((totalApps / 5) * 20, 20) : 0; // Baseline normalized against 5 apps target for standard scaling
    
    let productivityScore = Math.round(taskWeight + focusWeight + appWeight);
    if (totalTasks === 0 && sessions === 0 && totalApps === 0) {
      productivityScore = 0;
    }
    productivityScore = Math.min(Math.max(productivityScore, 0), 100);

    // 4. Trace and Compile Contextual Activity Logs
    const activities = [];

    // Map Tasks
    tasks.forEach(task => {
      activities.push({
        id: `task-add-${task.id}`,
        type: 'Task',
        title: `Added task: "${task.title}"`,
        timestamp: task.createdAt,
        unixTime: task.id,
        color: 'text-blue-400 bg-blue-500/10'
      });
      if (task.completed) {
        activities.push({
          id: `task-comp-${task.id}`,
          type: 'Task',
          title: `Completed task: "${task.title}"`,
          timestamp: 'Completed',
          unixTime: task.id + 1, // Offset for chronosorting sorting
          color: 'text-emerald-400 bg-emerald-500/10'
        });
      }
    });

    // Map Job Applications
    interviews.forEach(app => {
      activities.push({
        id: `app-${app.id}`,
        type: 'Application',
        title: `Logged application for ${app.role} at ${app.company}`,
        timestamp: app.dateApplied,
        unixTime: app.id,
        color: 'text-purple-400 bg-purple-500/10'
      });
    });

    // Map Pomodoro Milestones
    if (sessions > 0) {
      activities.push({
        id: 'pomodoro-aggregate',
        type: 'Session',
        title: `Registered ${sessions} deep focus pomodoro block cycles`,
        timestamp: 'Active Cycle',
        unixTime: Date.now(),
        color: 'text-amber-400 bg-amber-500/10'
      });
    }

    // Sort logs chronologically descending
    const sortedActivities = activities
      .sort((a, b) => b.unixTime - a.unixTime)
      .slice(0, 4);

    setData({
      name: settings?.name || '',
      dailyTasksGoal: settings?.dailyTasksGoal || 5,
      dailyPomodoroGoal: settings?.dailyPomodoroGoal || 4,
      totalTasks,
      completedTasks,
      pendingTasks,
      sessionsCompleted: sessions,
      totalApps,
      interviewCount,
      selectedCount,
      rejectedCount,
      productivityScore,
      recentActivity: sortedActivities
    });
  }, [location.pathname]);

  // --- Dynamic Math Clamps for Progress Bars ---
  const taskProgressPct = Math.min(Math.round((data.completedTasks / data.dailyTasksGoal) * 100), 100) || 0;
  const pomodoroProgressPct = Math.min(Math.round((data.sessionsCompleted / data.dailyPomodoroGoal) * 100), 100) || 0;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* --- Dynamic Greeting Header --- */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            {data.name ? `Welcome back, ${data.name} ` : 'Welcome back '}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track tasks, focus sessions, and interview progress from one workspace.
          </p>
        </div>

        {/* --- Quick Actions Section --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/tasks')}
            className="backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 flex items-center gap-3 shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/30 hover:bg-slate-900/60 text-left group"
          >
            <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500/20 transition-colors">
              <FiPlusCircle size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">New Task</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Forge an objective</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/pomodoro')}
            className="backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 flex items-center gap-3 shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-500/30 hover:bg-slate-900/60 text-left group"
          >
            <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <FiPlayCircle size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Focus Session</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Start deep work block</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/interviews')}
            className="backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 flex items-center gap-3 shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-500/30 hover:bg-slate-900/60 text-left group"
          >
            <div className="p-2.5 bg-purple-500/10 rounded-lg text-purple-400 group-hover:bg-purple-500/20 transition-colors">
              <FiFilePlus size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Add Application</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Log new opportunity</p>
            </div>
          </button>
        </div>

        {/* --- Metric Card Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tasks Completed */}
          <div className="backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 flex items-center justify-between shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-emerald-500/5">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Tasks Completed</p>
              <h3 className="text-2xl font-bold text-white mt-1 font-mono">{data.completedTasks}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0">
              <FiCheckCircle size={20} />
            </div>
          </div>

          {/* Focus Sessions */}
          <div className="backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 flex items-center justify-between shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-amber-500/5">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Focus Sessions</p>
              <h3 className="text-2xl font-bold text-white mt-1 font-mono">{data.sessionsCompleted}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400 shrink-0">
              <FiClock size={20} />
            </div>
          </div>

          {/* Productivity Score */}
          <div className="backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 flex items-center justify-between shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-blue-500/5">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Productivity</p>
              <h3 className="text-2xl font-bold text-blue-400 mt-1 font-mono">{data.productivityScore}%</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 shrink-0">
              <FiZap size={20} />
            </div>
          </div>

          {/* Applications Tracked */}
          <div className="backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 flex items-center justify-between shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-purple-500/5">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Apps Tracked</p>
              <h3 className="text-2xl font-bold text-white mt-1 font-mono">{data.totalApps}</h3>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400 shrink-0">
              <FiBriefcase size={20} />
            </div>
          </div>
        </div>

        {/* --- Two Column Core Layout --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Goal Progress Section (2 Columns Width) */}
          <div className="lg:col-span-2 backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 shadow-xl space-y-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FiTrendingUp className="text-blue-500" size={16} /> Daily Targets Fulfillment
            </h2>

            <div className="space-y-5">
              {/* Task Goal Progression bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-end text-sm">
                  <div>
                    <span className="font-semibold text-slate-200 block">Task Optimization Goal</span>
                    <span className="text-xs text-slate-500">Targeting {data.dailyTasksGoal} tasks daily</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-blue-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                    {data.completedTasks} / {data.dailyTasksGoal} ({taskProgressPct}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)] transition-all duration-500"
                    style={{ width: `${taskProgressPct}%` }}
                  />
                </div>
              </div>

              {/* Pomodoro Goal Progression bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-end text-sm">
                  <div>
                    <span className="font-semibold text-slate-200 block">Daily Focus Goal</span>
                    <span className="text-xs text-slate-500">Targeting {data.dailyPomodoroGoal} deep work blocks daily</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-amber-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                    {data.sessionsCompleted} / {data.dailyPomodoroGoal} ({pomodoroProgressPct}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)] transition-all duration-500"
                    style={{ width: `${pomodoroProgressPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed Section (1 Column Width) */}
          <div className="backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FiActivity className="text-purple-400" size={16} /> Workspace Activity Logs
            </h2>

            {data.recentActivity.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-slate-800/60 rounded-xl bg-slate-950/20">
                <div className="inline-flex p-3 bg-slate-900/60 text-slate-600 rounded-full mb-3 border border-slate-800">
                  <FiGrid size={18} />
                </div>
                <p className="text-xs text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                  Complete tasks, focus sessions, or log interview applications to seed data arrays.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 relative before:absolute before:top-2 before:bottom-2 before:left-[18px] before:w-[1px] before:bg-slate-800/80">
                {data.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-3 relative items-start group animate-fade-in">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0 border border-slate-800/60 ${activity.color}`}>
                      {activity.type[0]}
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-xs font-medium text-slate-200 leading-tight block truncate" title={activity.title}>
                        {activity.title}
                      </p>
                      <span className="text-[10px] font-semibold text-slate-500 tracking-wide uppercase block mt-1">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
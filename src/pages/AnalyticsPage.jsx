import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiCheckCircle, FiActivity, FiBriefcase, FiAward, FiClock, FiPieChart, FiBarChart2 } from 'react-icons/fi';

const AnalyticsPage = () => {
  // --- State ---
  const [metrics, setMetrics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    pomodoroSessions: 0,
    totalApps: 0,
    interviews: 0,
    selected: 0,
    rejected: 0,
    successRate: 0,
    hasData: false
  });

  // --- Load and Calculate Metrics ---
  useEffect(() => {
    // 1. Fetch from LocalStorage
    const savedTasks = localStorage.getItem('focusforge_tasks');
    const savedSessions = localStorage.getItem('focusforge_pomodoro_sessions');
    const savedInterviews = localStorage.getItem('focusforge_interviews');

    const tasks = savedTasks ? JSON.parse(savedTasks) : [];
    const sessions = savedSessions ? parseInt(savedSessions, 10) : 0;
    const interviewsList = savedInterviews ? JSON.parse(savedInterviews) : [];

    // 2. Calculations
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    const totalApps = interviewsList.length;
    const interviews = interviewsList.filter(a => a.status === 'Interview' || a.status === 'OA').length;
    const selected = interviewsList.filter(a => a.status === 'Selected').length;
    const rejected = interviewsList.filter(a => a.status === 'Rejected').length;

    // Success Rate = (Selected / Total Applications Closed/Decided) or simply (Selected / Total Apps) safely handled
    const successRate = totalApps > 0 ? Math.round((selected / totalApps) * 100) : 0;

    // Check if any telemetry/data exists across the platform
    const hasData = totalTasks > 0 || sessions > 0 || totalApps > 0;

    setMetrics({
      totalTasks,
      completedTasks,
      pendingTasks,
      pomodoroSessions: sessions,
      totalApps,
      interviews,
      selected,
      rejected,
      successRate,
      hasData
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* --- Header Section --- */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Analytics Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time diagnostics of your productivity engine, focus blocks, and application metrics.
          </p>
        </div>

        {!metrics.hasData ? (
          /* --- Empty State --- */
          <div className="backdrop-blur-md bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl p-16 text-center shadow-inner">
            <div className="inline-flex p-4 bg-slate-900/60 text-slate-500 rounded-full mb-4 border border-slate-800">
              <FiBarChart2 size={28} />
            </div>
            <h3 className="text-base font-semibold text-slate-300">No telemetry data available</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Populate your workspace by creating tasks, finishing Pomodoro focus blocks, or logging job applications.
            </p>
          </div>
        ) : (
          /* --- Dashboard Layout --- */
          <div className="space-y-6">
            
            {/* High Level Highlight Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Focus Velocity Card */}
              <div className="backdrop-blur-md bg-gradient-to-b from-slate-900/60 to-slate-900/20 border border-slate-800/60 rounded-xl p-6 shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Deep Work Blocks</p>
                    <h3 className="text-3xl font-black text-white mt-2 font-mono">{metrics.pomodoroSessions}</h3>
                    <p className="text-xs text-slate-500 mt-2">Completed Pomodoro sessions</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                    <FiClock size={22} />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500/30" />
              </div>

              {/* Task Completion Rate Card */}
              <div className="backdrop-blur-md bg-gradient-to-b from-slate-900/60 to-slate-900/20 border border-slate-800/60 rounded-xl p-6 shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Task Completion</p>
                    <h3 className="text-3xl font-black text-emerald-400 mt-2 font-mono">
                      {metrics.totalTasks > 0 ? Math.round((metrics.completedTasks / metrics.totalTasks) * 100) : 0}%
                    </h3>
                    <p className="text-xs text-slate-500 mt-2">{metrics.completedTasks} of {metrics.totalTasks} objectives hit</p>
                  </div>
                  <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <FiCheckCircle size={22} />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-500/30" />
              </div>

              {/* Interview Success Rate Card */}
              <div className="backdrop-blur-md bg-gradient-to-b from-slate-900/60 to-slate-900/20 border border-slate-800/60 rounded-xl p-6 shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Placement Rate</p>
                    <h3 className="text-3xl font-black text-amber-400 mt-2 font-mono">{metrics.successRate}%</h3>
                    <p className="text-xs text-slate-500 mt-2">Offer conversions based on pipeline</p>
                  </div>
                  <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
                    <FiTrendingUp size={22} />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-500/30" />
              </div>

            </div>

            {/* Segmented Modules Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Task Strategy Core */}
              <div className="backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 shadow-xl space-y-6">
                <h3 className="text-sm font-semibold text-slate-300 tracking-wide uppercase flex items-center gap-2">
                  <FiActivity className="text-blue-400" size={16} /> Task Fulfillment Distribution
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-950/40 border border-slate-800/40 rounded-lg p-4 text-center">
                    <span className="text-xs text-slate-500 block font-medium">Total</span>
                    <span className="text-xl font-bold text-slate-200 font-mono mt-1 block">{metrics.totalTasks}</span>
                  </div>
                  <div className="bg-slate-950/40 border border-slate-800/40 rounded-lg p-4 text-center">
                    <span className="text-xs text-emerald-500 block font-medium">Completed</span>
                    <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">{metrics.completedTasks}</span>
                  </div>
                  <div className="bg-slate-950/40 border border-slate-800/40 rounded-lg p-4 text-center">
                    <span className="text-xs text-amber-500 block font-medium">Pending</span>
                    <span className="text-xl font-bold text-amber-400 font-mono mt-1 block">{metrics.pendingTasks}</span>
                  </div>
                </div>
                {/* Visual Distribution Tracker Line */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Task Backlog Ratio</span>
                    <span>{metrics.totalTasks > 0 ? Math.round((metrics.pendingTasks / metrics.totalTasks) * 100) : 0}% Open</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-emerald-500 transition-all duration-500" 
                      style={{ width: `${metrics.totalTasks > 0 ? (metrics.completedTasks / metrics.totalTasks) * 100 : 0}%` }}
                    />
                    <div 
                      className="bg-amber-500 transition-all duration-500" 
                      style={{ width: `${metrics.totalTasks > 0 ? (metrics.pendingTasks / metrics.totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Application Pipeline Core */}
              <div className="backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 shadow-xl space-y-6">
                <h3 className="text-sm font-semibold text-slate-300 tracking-wide uppercase flex items-center gap-2">
                  <FiBriefcase className="text-purple-400" size={16} /> Interview Funnel Metrics
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-950/40 border border-slate-800/40 rounded-lg p-3 text-center">
                    <span className="text-[11px] text-slate-500 block font-medium uppercase">Applications</span>
                    <span className="text-lg font-bold text-white font-mono mt-0.5 block">{metrics.totalApps}</span>
                  </div>
                  <div className="bg-slate-950/40 border border-slate-800/40 rounded-lg p-3 text-center">
                    <span className="text-[11px] text-purple-400 block font-medium uppercase">Interviews</span>
                    <span className="text-lg font-bold text-purple-400 font-mono mt-0.5 block">{metrics.interviews}</span>
                  </div>
                  <div className="bg-slate-950/40 border border-slate-800/40 rounded-lg p-3 text-center">
                    <span className="text-[11px] text-emerald-400 block font-medium uppercase">Selected</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono mt-0.5 block">{metrics.selected}</span>
                  </div>
                  <div className="bg-slate-950/40 border border-slate-800/40 rounded-lg p-3 text-center">
                    <span className="text-[11px] text-rose-400 block font-medium uppercase">Rejected</span>
                    <span className="text-lg font-bold text-rose-400 font-mono mt-0.5 block">{metrics.rejected}</span>
                  </div>
                </div>

                {/* Conversion Efficiency Stat */}
                <div className="p-3.5 bg-slate-950/30 border border-slate-800/80 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FiAward className="text-amber-400 shrink-0" size={18} />
                    <span className="text-xs text-slate-400 font-medium">Pipeline Conversion Efficiency</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-200 bg-slate-900 px-2.5 py-1 rounded border border-slate-800 font-mono">
                    {metrics.totalApps > 0 ? Math.round(((metrics.interviews + metrics.selected) / metrics.totalApps) * 100) : 0}% Response Rate
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AnalyticsPage;
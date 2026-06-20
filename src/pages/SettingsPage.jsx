import React, { useState, useEffect } from 'react';
import { FiUser, FiTarget, FiSave, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';

const SettingsPage = () => {
  // --- State ---
  const [settings, setSettings] = useState({
    name: 'Likhith',
    dailyTasksGoal: 5,
    dailyPomodoroGoal: 4,
  });

  const [showToast, setShowToast] = useState(false);

  // --- Load Settings ---
  useEffect(() => {
    const savedSettings = localStorage.getItem('focusforge_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: name.includes('Goal') ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('focusforge_settings', JSON.stringify(settings));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleReset = () => {
    const defaultSettings = {
      name: 'Likhith',
      dailyTasksGoal: 5,
      dailyPomodoroGoal: 4,
    };
    setSettings(defaultSettings);
    localStorage.setItem('focusforge_settings', JSON.stringify(defaultSettings));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 p-6 md:p-10 relative">
      
      {/* --- Success Toast --- */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md text-emerald-400 text-sm font-medium px-4 py-3 rounded-xl shadow-2xl animate-fade-in-down">
          <FiCheckCircle size={18} />
          <span>Configuration saved successfully!</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* --- Header Section --- */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Customize your engine thresholds, target matrices, and system profile.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* --- Configuration Form Card --- */}
          <div className="lg:col-span-2 backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 shadow-xl space-y-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FiUser className="text-blue-400" size={16} /> Identity & Engine Targets
            </h2>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Profile Name</label>
                <input
                  type="text"
                  name="name"
                  value={settings.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Daily Task Goal</label>
                  <input
                    type="number"
                    name="dailyTasksGoal"
                    min="1"
                    max="99"
                    value={settings.dailyTasksGoal}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Daily Pomodoro Goal</label>
                  <input
                    type="number"
                    name="dailyPomodoroGoal"
                    min="1"
                    max="99"
                    value={settings.dailyPomodoroGoal}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
              </div>

              {/* --- Action Controls --- */}
              <div className="pt-4 border-t border-slate-800/40 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-medium text-xs px-4 py-2.5 rounded-lg transition-all active:scale-95"
                >
                  <FiRefreshCw size={14} />
                  <span>Restore Defaults</span>
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-5 py-2.5 rounded-lg transition-all active:scale-95 shadow-lg shadow-blue-600/10"
                >
                  <FiSave size={14} />
                  <span>Save Parameters</span>
                </button>
              </div>
            </form>
          </div>

          {/* --- Live Telemetry Preview Card --- */}
          <div className="backdrop-blur-md bg-gradient-to-b from-slate-900/40 to-slate-900/10 border border-slate-800/60 rounded-xl p-6 shadow-xl space-y-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FiTarget className="text-amber-400" size={16} /> Live Preview
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-slate-950/40 border border-slate-800/40 rounded-lg">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Active Operator</span>
                <span className="text-lg font-bold text-white mt-1 block truncate">
                  {settings.name || <span className="text-slate-600 italic">Unspecified</span>}
                </span>
              </div>

              <div className="p-4 bg-slate-950/40 border border-slate-800/40 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Task Target</span>
                  <span className="text-xs text-slate-400 mt-0.5 block">Objectives per day</span>
                </div>
                <span className="text-xl font-black text-blue-400 font-mono bg-slate-900 px-3 py-1 rounded border border-slate-800">
                  {settings.dailyTasksGoal}
                </span>
              </div>

              <div className="p-4 bg-slate-950/40 border border-slate-800/40 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Focus Target</span>
                  <span className="text-xs text-slate-400 mt-0.5 block">Sessions per day</span>
                </div>
                <span className="text-xl font-black text-amber-400 font-mono bg-slate-900 px-3 py-1 rounded border border-slate-800">
                  {settings.dailyPomodoroGoal}
                </span>
              </div>
            </div>
            
            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              These values feed directly into your localized dashboard progress metrics and threshold caps.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
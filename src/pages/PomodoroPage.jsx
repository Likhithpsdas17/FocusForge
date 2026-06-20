import React, { useState, useEffect, useRef } from 'react';
import { FiPlay, FiPause, FiRefreshCw, FiAward, FiCoffee, FiTarget } from 'react-icons/fi';

const PomodoroPage = () => {
  // --- Constants ---
  const FOCUS_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  // --- State ---
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(() => {
    try {
      const savedSessions = localStorage.getItem(
        "focusforge_pomodoro_sessions"
      );
      return savedSessions ? parseInt(savedSessions, 10) : 0;
    } catch {
      return 0;
    }
  });

  const timerRef = useRef(null);

  // --- Sync Sessions with LocalStorage ---
  useEffect(() => {
    localStorage.setItem('focusforge_pomodoro_sessions', sessionsCompleted.toString());
  }, [sessionsCompleted]);

  // --- Timer Logic ---
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            handlePhaseCompletion();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, mode]);

  // --- Phase Switcher ---
  const handlePhaseCompletion = () => {
    if (mode === 'focus') {
      setSessionsCompleted((prev) => prev + 1);
      setMode('break');
      setTimeLeft(BREAK_TIME);
    } else {
      setMode('focus');
      setTimeLeft(FOCUS_TIME);
    }
    setIsActive(true);
  };

  // --- Controls ---
  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    clearInterval(timerRef.current);
    setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME);
  };

  // --- Helper Functions ---
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = mode === 'focus'
    ? ((FOCUS_TIME - timeLeft) / FOCUS_TIME) * 100
    : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* --- Header Section --- */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Pomodoro Timer
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Optimize your productivity using the power of deep focus blocks.
          </p>
        </div>

        {/* --- Quick Stats Card --- */}
        <div className="backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 flex items-center justify-between shadow-xl transition-all duration-300 hover:border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
              <FiAward size={24} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Completed Sessions</p>
              <h3 className="text-2xl font-bold text-white mt-0.5">{sessionsCompleted}</h3>
            </div>
          </div>
          <div className="text-xs text-slate-500 font-medium bg-slate-950/40 px-3 py-1.5 rounded-full border border-slate-800/80">
            Goal: 4 daily
          </div>
        </div>

        {/* --- Main Timer Interface --- */}
        <div className="backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8 md:p-12 shadow-xl flex flex-col items-center text-center relative overflow-hidden">

          {/* Progress Bar Top Indicator */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-950">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${mode === 'focus' ? 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]' : 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Mode Pill Indicator */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-xs tracking-wider uppercase mb-6 border ${mode === 'focus'
              ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}>
            {mode === 'focus' ? <FiTarget size={14} /> : <FiCoffee size={14} />}
            <span>{mode === 'focus' ? 'Focus Session' : 'Short Break'}</span>
          </div>

          {/* Giant Time Display */}
          <div className="text-7xl md:text-8xl font-black font-mono tracking-tight text-white mb-8 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none">
            {formatTime(timeLeft)}
          </div>

          {/* Controls Container */}
          <div className="flex items-center gap-4">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={toggleTimer}
              className={`w-16 h-16 rounded-full flex items-center justify-center font-semibold text-white shadow-lg transition-all duration-200 active:scale-95 ${isActive
                  ? 'bg-slate-800 hover:bg-slate-700 shadow-slate-900/50'
                  : mode === 'focus'
                    ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                }`}
            >
              {isActive ? <FiPause size={24} /> : <FiPlay size={24} className="ml-1" />}
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={resetTimer}
              className="w-12 h-12 rounded-full bg-slate-950/60 hover:bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 active:scale-95"
              title="Reset Timer"
            >
              <FiRefreshCw size={18} />
            </button>
          </div>

          {/* Helpful Dynamic Instruction Hint */}
          <p className="text-xs text-slate-500 mt-8 max-w-xs font-medium">
            {isActive
              ? `Stay locked in! ${mode === 'focus' ? 'Focusing on your objective.' : 'Enjoying a well-deserved rest.'}`
              : `Ready? Hit start to begin your ${mode === 'focus' ? '25-minute block' : '5-minute break'}.`}
          </p>
        </div>

      </div>
    </div>
  );
};

export default PomodoroPage;
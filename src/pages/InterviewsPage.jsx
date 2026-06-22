import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiBriefcase, FiCalendar, FiTrendingUp, FiCheckCircle, FiXCircle, FiGrid, FiClock } from 'react-icons/fi';

const InterviewsPage = () => {
  // --- State ---
const demoApplications = [
  {
    id: 1,
    company: "Infosys",
    role: "Frontend Developer",
    dateApplied: "2026-06-20",
    status: "Interview",
    notes: "Technical round scheduled"
  },
  {
    id: 2,
    company: "TCS",
    role: "React Developer",
    dateApplied: "2026-06-18",
    status: "Applied",
    notes: "Waiting for OA"
  },
  {
    id: 3,
    company: "Accenture",
    role: "Software Engineer",
    dateApplied: "2026-06-15",
    status: "OA",
    notes: "Assessment completed"
  }
];

const [applications, setApplications] = useState(() => {
  try {
    const savedApps = localStorage.getItem("focusforge_interviews");

    return savedApps
      ? JSON.parse(savedApps)
      : demoApplications;
  } catch {
    return demoApplications;
  }
});

  const [form, setForm] = useState({
    company: '',
    role: '',
    dateApplied: '',
    status: 'Applied',
    notes: ''
  });

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('focusforge_interviews', JSON.stringify(applications));
  }, [applications]);

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddApplication = (e) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) return;

    const newApp = {
      id: Date.now(),
      company: form.company.trim(),
      role: form.role.trim(),
      dateApplied: form.dateApplied || new Date().toISOString().split('T')[0],
      status: form.status,
      notes: form.notes.trim()
    };

    const exists = applications.some(
      (app) =>
        app.company.toLowerCase() === form.company.toLowerCase() &&
        app.role.toLowerCase() === form.role.toLowerCase()
    );

    if (exists) return;

    setApplications([newApp, ...applications]);
    setForm({ company: '', role: '', dateApplied: '', status: 'Applied', notes: '' });
  };

  const handleStatusChange = (id, newStatus) => {
    setApplications(
      applications.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  const handleDeleteApplication = (id) => {
    setApplications(applications.filter((app) => app.id !== id));
  };

  // --- Derived Statistics ---
  const totalApps = applications.length;
  const interviewCount = applications.filter((app) => app.status === 'Interview' || app.status === 'OA').length;
  const selectedCount = applications.filter((app) => app.status === 'Selected').length;
  const rejectedCount = applications.filter((app) => app.status === 'Rejected').length;

  // --- Status Badge Styling Helper ---
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Applied': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'OA': return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
      case 'Interview': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'Selected': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'Rejected': return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      default: return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* --- Header Section --- */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Interview Tracker
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track job applications, online assessments, and interview pipelines.
          </p>
        </div>

        {/* --- Statistics Cards --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Applications</p>
              <h3 className="text-2xl font-bold text-white mt-1">{totalApps}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 hidden sm:block">
              <FiBriefcase size={20} />
            </div>
          </div>

          <div className="backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Interviews / OA</p>
              <h3 className="text-2xl font-bold text-amber-400 mt-1">{interviewCount}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400 hidden sm:block">
              <FiTrendingUp size={20} />
            </div>
          </div>

          <div className="backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Selected</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">{selectedCount}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400 hidden sm:block">
              <FiCheckCircle size={20} />
            </div>
          </div>

          <div className="backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Rejected</p>
              <h3 className="text-2xl font-bold text-rose-400 mt-1">{rejectedCount}</h3>
            </div>
            <div className="p-3 bg-rose-500/10 rounded-lg text-rose-400 hidden sm:block">
              <FiXCircle size={20} />
            </div>
          </div>
        </div>

        {/* --- Form Section --- */}
        <div className="backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 shadow-xl">
          <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <FiPlus size={16} className="text-blue-400" /> Track New Opportunity
          </h2>
          <form onSubmit={handleAddApplication} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Company Name *</label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleInputChange}
                required
                placeholder="Google, Stripe, etc."
                className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Role *</label>
              <input
                type="text"
                name="role"
                value={form.role}
                onChange={handleInputChange}
                required
                placeholder="Frontend Engineer"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Date Applied</label>
              <input
                type="date"
                name="dateApplied"
                value={form.dateApplied}
                onChange={handleInputChange}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleInputChange}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50"
              >
                <option value="Applied">Applied</option>
                <option value="OA">OA</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Notes (Optional)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="notes"
                  value={form.notes}
                  onChange={handleInputChange}
                  placeholder="Referral, Next steps..."
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-4 py-2 rounded-lg flex items-center justify-center transition-all shrink-0 active:scale-95 shadow-md shadow-blue-600/10"
                >
                  <FiPlus size={18} />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* --- Applications Table / List Container --- */}
        <div className="backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl overflow-hidden shadow-xl">
          {applications.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center">
              <div className="inline-flex p-4 bg-slate-900/60 text-slate-500 rounded-full mb-3 border border-slate-800">
                <FiGrid size={24} />
              </div>
              <h3 className="text-sm font-medium text-slate-300">No applications tracked yet</h3>
              <p className="text-xs text-slate-500 mt-1">Start populating your dashboard by adding your current job hunts.</p>
            </div>
          ) : (
            /* Desktop/Tablet Table Layout */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-950/20 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-4 px-5">Company</th>
                    <th className="py-4 px-5">Role</th>
                    <th className="py-4 px-5">Date Applied</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5">Notes</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-sm">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-950/20 transition-colors group">
                      <td className="py-3.5 px-5 font-semibold text-white">{app.company}</td>
                      <td className="py-3.5 px-5 text-slate-300">{app.role}</td>
                      <td className="py-3.5 px-5 text-slate-400 text-xs">
                        <span className="inline-flex items-center gap-1.5">
                          <FiCalendar size={12} className="text-slate-500" />
                          {app.dateApplied}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border bg-transparent focus:outline-none cursor-pointer transition-colors ${getStatusStyles(app.status)}`}
                        >
                          <option value="Applied" className="bg-[#0B0F19] text-blue-400">Applied</option>
                          <option value="OA" className="bg-[#0B0F19] text-purple-400">OA</option>
                          <option value="Interview" className="bg-[#0B0F19] text-amber-400">Interview</option>
                          <option value="Selected" className="bg-[#0B0F19] text-emerald-400">Selected</option>
                          <option value="Rejected" className="bg-[#0B0F19] text-rose-400">Rejected</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-5 text-slate-400 max-w-xs truncate text-xs" title={app.notes}>
                        {app.notes || <span className="text-slate-600 italic">No notes</span>}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteApplication(app.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
                          title="Delete Application"
                        >
                          <FiTrash2 size={14} />
                          <span className="text-xs font-medium">Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default InterviewsPage;
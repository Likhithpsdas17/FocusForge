import { NavLink, useLocation } from 'react-router-dom'
import {
  HiOutlineViewGrid,
  HiOutlineClock,
  HiOutlineClipboardList,
  HiOutlineBriefcase,
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineX,
} from 'react-icons/hi'
import { FaBolt } from 'react-icons/fa'

const navItems = [
  { path: '/', label: 'Dashboard', icon: HiOutlineViewGrid },
  { path: '/pomodoro', label: 'Pomodoro Timer', icon: HiOutlineClock },
  { path: '/tasks', label: 'Tasks', icon: HiOutlineClipboardList },
  { path: '/interviews', label: 'Interview Tracker', icon: HiOutlineBriefcase },
  { path: '/analytics', label: 'Analytics', icon: HiOutlineChartBar },
  { path: '/settings', label: 'Settings', icon: HiOutlineCog },
]

function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[260px] bg-bg-secondary border-r border-border-default
          flex flex-col z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border-default">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center">
              <FaBolt className="text-white text-sm" />
            </div>
            <span className="text-lg font-semibold text-text-primary tracking-tight">
              FocusForge
            </span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-text-secondary hover:text-text-primary transition-colors"
          >
            <HiOutlineX className="text-xl" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 relative
                  ${isActive
                    ? 'nav-item-active text-white bg-accent-indigo/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                  }
                `}
              >
                {/* Active glow dot */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-accent-indigo to-accent-violet" />
                )}

                <Icon className={`text-lg flex-shrink-0 transition-colors duration-200 ${isActive ? 'text-accent-indigo' : 'text-text-muted group-hover:text-text-secondary'
                  }`} />

                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  {item.label}
                </span>
              </NavLink>
            )
          })}
        </nav>

        {/* Bottom: Upgrade Card */}
        <div className="px-4 pb-4">
          <div className="glass-card p-4 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center">
              <FaBolt className="text-white text-sm" />
            </div>
            <h3 className="font-semibold text-white">
              FocusForge
            </h3>

            <p className="text-sm text-slate-400">
              Productivity & Interview Tracker
            </p>

            <p className="text-xs text-slate-500">
              Built by Likhith P S Das
            </p>
            <button className="w-full py-1.5 rounded-lg bg-gradient-to-r from-accent-indigo to-accent-violet text-white text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer">
              View Project
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

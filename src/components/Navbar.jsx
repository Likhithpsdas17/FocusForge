import { HiOutlineSearch, HiOutlineBell, HiOutlineMenuAlt2 } from 'react-icons/hi'

function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 border-b border-border-default bg-bg-primary/80 backdrop-blur-xl">
      {/* Left: hamburger + search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <HiOutlineMenuAlt2 className="text-2xl" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-elevated border border-border-default text-text-muted text-sm w-64 transition-colors focus-within:border-accent-indigo/40">
          <HiOutlineSearch className="text-base flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none w-full text-text-primary placeholder-text-muted text-sm"
          />
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        {/* Mobile search */}
        <button className="sm:hidden text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
          <HiOutlineSearch className="text-xl" />
        </button>

        {/* Notifications */}
        <button className="relative text-text-secondary hover:text-text-primary transition-colors p-2 rounded-xl hover:bg-bg-hover cursor-pointer">
          <HiOutlineBell className="text-xl" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-rose animate-glow-pulse" />
        </button>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:ring-2 hover:ring-accent-indigo/30 transition-all">
          U
        </div>
      </div>
    </header>
  )
}

export default Navbar

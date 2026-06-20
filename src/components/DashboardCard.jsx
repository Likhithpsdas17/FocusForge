import { HiArrowUp, HiArrowDown, HiArrowRight  } from 'react-icons/hi'

const colorMap = {
  indigo: {
    bg: 'bg-accent-indigo/10',
    text: 'text-accent-indigo',
    glow: 'shadow-accent-indigo/20',
  },
  purple: {
    bg: 'bg-accent-purple/10',
    text: 'text-accent-purple',
    glow: 'shadow-accent-purple/20',
  },
  amber: {
    bg: 'bg-accent-amber/10',
    text: 'text-accent-amber',
    glow: 'shadow-accent-amber/20',
  },
  emerald: {
    bg: 'bg-accent-emerald/10',
    text: 'text-accent-emerald',
    glow: 'shadow-accent-emerald/20',
  },
  rose: {
    bg: 'bg-accent-rose/10',
    text: 'text-accent-rose',
    glow: 'shadow-accent-rose/20',
  },
  sky: {
    bg: 'bg-accent-sky/10',
    text: 'text-accent-sky',
    glow: 'shadow-accent-sky/20',
  },
}

function DashboardCard({ icon, title, value, subtitle, trend, trendDirection = 'up', color = 'indigo', className = '' }) {
  const palette = colorMap[color] || colorMap.indigo
  const isPositive = trendDirection === 'up'

  return (
    <div className={`glass-card glass-card-hover p-5 space-y-4 ${className}`}>
      {/* Header: icon + trend */}
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl ${palette.bg} flex items-center justify-center`}>
          <span className={`text-lg ${palette.text}`}>{icon}</span>
        </div>

        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-full ${
            isPositive
              ? 'text-accent-emerald bg-accent-emerald/10'
              : 'text-accent-rose bg-accent-rose/10'
          }`}>
            {isPositive ? <HiArrowUp className="text-xs" /> : <HiArrowDown className="text-xs" />}
            {trend}
          </span>
        )}
      </div>

      {/* Value */}
      <div>
        <p className="text-2xl font-bold text-text-primary tracking-tight">{value}</p>
        <p className="text-sm text-text-secondary mt-0.5">{title}</p>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs text-text-muted">{subtitle}</p>
      )}
    </div>
  )
}

export default DashboardCard

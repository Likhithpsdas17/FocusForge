import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import PomodoroPage from './pages/PomodoroPage'
import TasksPage from './pages/TasksPage'
import InterviewsPage from './pages/InterviewsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/pomodoro" element={<PomodoroPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/interviews" element={<InterviewsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}

export default App

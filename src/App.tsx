import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TeamsPage from './pages/TeamsPage'
import TeamPage from './pages/TeamPage'
import LineupEditorPage from './pages/LineupEditorPage'
import SharedLineup from './pages/SharedLineup'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TeamsPage />} />
        <Route path="/team/:teamId" element={<TeamPage />} />
        <Route path="/lineup/:lineupId" element={<LineupEditorPage />} />
        <Route path="/share/:lineupId" element={<SharedLineup />} />
      </Routes>
    </BrowserRouter>
  )
}

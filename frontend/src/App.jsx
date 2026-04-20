import { Navigate, Route, Routes } from 'react-router-dom'
import SplashPage from './pages/SplashPage'
import HomePage from './pages/HomePage'
import PortalPage from './pages/PortalPage'
import ResultsPage from './pages/ResultsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/portal" element={<PortalPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

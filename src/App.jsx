import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Levels from './pages/Levels'
import LevelPage from './pages/LevelPage'
import LessonsList from './pages/LessonsList'
import LessonDetail from './pages/LessonDetail'
import TestHub from './pages/TestHub'
import Progress from './pages/Progress'
import Mistakes from './pages/Mistakes'
import PlacementTest from './pages/PlacementTest'
import { useProgress } from './context/ProgressContext'
import './App.css'

function LoadingScreen() {
  return (
    <div className="boot">
      <div className="boot__mark">Li</div>
      <p className="boot__text">Veri tabanı hazırlanıyor…</p>
    </div>
  )
}

export default function App() {
  const { ready } = useProgress()

  if (!ready) return <LoadingScreen />

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/seviyeler" element={<Levels />} />
          <Route path="/seviye/:id" element={<LevelPage />} />
          <Route path="/dersler" element={<LessonsList />} />
          <Route path="/ders/:id" element={<LessonDetail />} />
          <Route path="/test" element={<TestHub />} />
          <Route path="/seviye-testi" element={<PlacementTest />} />
          <Route path="/yanlislar" element={<Mistakes />} />
          <Route path="/ilerleme" element={<Progress />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="container">
          <span>Lingua · İngilizce Dilbilgisi</span>
          <span>SQLite (WASM) ile yerel ilerleme takibi</span>
        </div>
      </footer>
    </>
  )
}

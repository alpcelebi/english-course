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
import VocabularyPractice from './pages/VocabularyPractice'
import { useProgress } from './context/ProgressContext'
import { useLanguage } from './context/LanguageContext'
import './App.css'

function LoadingScreen() {
  const { t } = useLanguage()

  return (
    <div className="boot">
      <div className="boot__mark">Li</div>
      <p className="boot__text">{t('boot')}</p>
    </div>
  )
}

export default function App() {
  const { ready } = useProgress()
  const { t } = useLanguage()

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
          <Route path="/kelimeler/:levelId" element={<VocabularyPractice />} />
          <Route path="/yanlislar" element={<Mistakes />} />
          <Route path="/ilerleme" element={<Progress />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="container">
          <span>{t('footerBrand')}</span>
          <span className="site-footer__credit">
            {t('footerCreditLead')} <strong>Alp Eren ÇELEBİ</strong>
            <em>{t('footerCreditYear')}</em>
          </span>
        </div>
      </footer>
    </>
  )
}

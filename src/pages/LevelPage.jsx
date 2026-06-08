import { Link, useParams } from 'react-router-dom'
import { getLevel } from '../data/levels'
import { getTopicsByLevel, isLevelReady } from '../data'
import { useProgress } from '../context/ProgressContext'
import LessonCard from '../components/LessonCard'
import './LevelPage.css'

export default function LevelPage() {
  const { id } = useParams()
  const level = getLevel(id)
  const { completed } = useProgress()
  const topics = getTopicsByLevel(id)

  if (!level || !isLevelReady(id)) {
    return (
      <div className="container level-page__missing">
        <h1>Seviye bulunamadı</h1>
        <Link to="/seviyeler" className="btn btn--primary">
          Seviyelere dön
        </Link>
      </div>
    )
  }

  const doneCount = topics.filter((t) => completed[t.id]).length
  const totalExamples = topics.reduce(
    (n, t) => n + t.sections.reduce((m, s) => m + s.examples.length, 0),
    0
  )

  return (
    <div className="level-page">
      <header className="level-hero">
        <div className="container level-hero__inner">
          <Link to="/seviyeler" className="level-hero__back">
            ← Seviyeler
          </Link>
          <div className="level-hero__main">
            <span className="level-hero__code">{level.code}</span>
            <div>
              <span className="eyebrow">{level.tag}</span>
              <h1>{level.name}</h1>
              <p className="level-hero__desc">{level.description}</p>
            </div>
          </div>

          <div className="level-hero__stats">
            <span>
              <strong>{topics.length}</strong> konu
            </span>
            <span>
              <strong>{totalExamples}+</strong> örnek
            </span>
            <span>
              <strong>
                {doneCount}/{topics.length}
              </strong>{' '}
              tamamlandı
            </span>
          </div>

          <Link to={`/test?level=${level.id}`} className="btn btn--primary level-hero__test">
            {level.code} Karışık Testini Çöz →
          </Link>
        </div>
      </header>

      <section className="container level-page__topics">
        <div className="lesson-grid">
          {topics.map((topic, i) => (
            <LessonCard key={topic.id} lesson={topic} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}

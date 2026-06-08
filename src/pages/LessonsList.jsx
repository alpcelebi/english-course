import { Link } from 'react-router-dom'
import { levels } from '../data/levels'
import { getTopicsByLevel, isLevelReady } from '../data'
import LessonCard from '../components/LessonCard'
import './LessonsList.css'

export default function LessonsList() {
  const readyLevels = levels.filter((l) => l.active && isLevelReady(l.id))

  return (
    <div className="container lessons-list">
      <header className="lessons-list__head">
        <span className="eyebrow">Müfredat</span>
        <h1>Tüm Konular</h1>
        <p>
          Her ünite, kavram açıklamaları ve bol örnek cümleyle başlar; sonunda
          interaktif bir quiz ile pekiştirirsin.
        </p>
      </header>

      {readyLevels.map((level) => {
        const topics = getTopicsByLevel(level.id)
        return (
          <section key={level.id} className="lessons-list__level">
            <div className="lessons-list__levelhead">
              <span className="lessons-list__code">{level.code}</span>
              <div>
                <h2>{level.name}</h2>
                <span className="lessons-list__tag">{level.tag}</span>
              </div>
              <Link to={`/seviye/${level.id}`} className="lessons-list__more">
                Seviye sayfası →
              </Link>
            </div>
            <div className="lesson-grid">
              {topics.map((topic, i) => (
                <LessonCard key={topic.id} lesson={topic} index={i} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

import { Link } from 'react-router-dom'
import { levels } from '../data/levels'
import { getTopicsByLevel, isLevelReady } from '../data'
import { useProgress } from '../context/ProgressContext'
import './Levels.css'

export default function Levels() {
  const { completed } = useProgress()

  return (
    <div className="container levels-page">
      <header className="levels-page__head">
        <span className="eyebrow">CEFR Müfredatı</span>
        <h1>Seviyeler</h1>
        <p>
          Avrupa Dil Ölçeği’ne (A1’den C2’ye) göre düzenlenmiş konular. Her
          seviyede dersler, quizler ve ayrı bir test bankası seni bekliyor.
        </p>
      </header>

      <div className="levels-grid">
        {levels.map((level, i) => {
          const ready = isLevelReady(level.id) && level.active
          const topics = getTopicsByLevel(level.id)
          const doneCount = topics.filter((t) => completed[t.id]).length
          const pct = topics.length
            ? Math.round((doneCount / topics.length) * 100)
            : 0

          const Card = ready ? Link : 'div'
          const cardProps = ready ? { to: `/seviye/${level.id}` } : {}

          return (
            <Card
              key={level.id}
              {...cardProps}
              className={`level-card ${ready ? '' : 'level-card--soon'}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="level-card__top">
                <span className="level-card__code">{level.code}</span>
                <span className="level-card__tag">{level.tag}</span>
              </div>
              <h3 className="level-card__name">{level.name}</h3>
              <p className="level-card__desc">{level.description}</p>

              <div className="level-card__foot">
                {ready ? (
                  <>
                    <span className="level-card__count">
                      {topics.length} konu
                    </span>
                    <div className="level-card__bar" aria-hidden>
                      <span style={{ width: `${pct}%` }} />
                    </div>
                    <span className="level-card__pct">{pct}%</span>
                  </>
                ) : (
                  <span className="level-card__soon">Yakında</span>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

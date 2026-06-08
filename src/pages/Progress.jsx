import { Link } from 'react-router-dom'
import { levels } from '../data/levels'
import { allTopics, getTopicsByLevel, getQuiz, isLevelReady } from '../data'
import { useProgress } from '../context/ProgressContext'
import './Progress.css'

export default function Progress() {
  const { completed, bestScores, resetProgress } = useProgress()

  const doneCount = allTopics.filter((t) => completed[t.id]).length
  const overallPct = allTopics.length
    ? Math.round((doneCount / allTopics.length) * 100)
    : 0
  const quizzesTaken = allTopics.filter((t) => bestScores[t.id]).length
  const readyLevels = levels.filter((l) => l.active && isLevelReady(l.id))

  async function handleReset() {
    if (window.confirm('Tüm ilerlemen silinecek. Emin misin?')) {
      await resetProgress()
    }
  }

  return (
    <div className="container progress-page">
      <header className="progress-page__head">
        <div>
          <span className="eyebrow">İlerleme Takibi</span>
          <h1>Nerede kaldın?</h1>
          <p>Veriler tarayıcında SQLite (WASM) ile saklanıyor.</p>
        </div>
        <button className="btn btn--ghost" onClick={handleReset}>
          İlerlemeyi Sıfırla
        </button>
      </header>

      <div className="progress-summary">
        <div className="progress-ring-card">
          <div className="progress-ring" style={{ '--p': `${overallPct}%` }}>
            <span>{overallPct}%</span>
          </div>
          <div>
            <strong>{doneCount} / {allTopics.length} konu</strong>
            <p>tamamlandı</p>
          </div>
        </div>
        <div className="progress-mini">
          <span className="progress-mini__num">{quizzesTaken}</span>
          <span className="progress-mini__label">Çözülen quiz</span>
        </div>
      </div>

      {readyLevels.map((level) => {
        const topics = getTopicsByLevel(level.id)
        return (
          <section key={level.id} className="progress-level">
            <h2 className="progress-level__title">
              <span className="progress-level__code">{level.code}</span>
              {level.name}
            </h2>
            <div className="progress-list">
              {topics.map((topic) => {
                const done = completed[topic.id]
                const best = bestScores[topic.id]
                const totalQ = getQuiz(topic.id).length
                return (
                  <Link
                    to={`/ders/${topic.id}`}
                    key={topic.id}
                    className="progress-row"
                  >
                    <span className="progress-row__badge">{topic.accent}</span>
                    <div className="progress-row__info">
                      <strong>{topic.title}</strong>
                      <span>{topic.subtitle}</span>
                    </div>
                    <div className="progress-row__status">
                      {best && (
                        <span className="progress-row__quiz">
                          Quiz: {best.score}/{best.total ?? totalQ}
                        </span>
                      )}
                      <span
                        className={`progress-row__state ${done ? 'is-done' : ''}`}
                      >
                        {done ? '✓ Tamamlandı' : 'Başlanmadı'}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}

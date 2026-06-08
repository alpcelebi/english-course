import { Link } from 'react-router-dom'
import { levels } from '../data/levels'
import { allTopics, getTopicsByLevel, getQuiz, isLevelReady } from '../data'
import { useProgress } from '../context/ProgressContext'
import { useLanguage } from '../context/LanguageContext'
import { localizeLevel, localizeTopic, localizeTopics } from '../i18n/content'
import './Progress.css'

export default function Progress() {
  const { completed, bestScores, mistakes, resetProgress } = useProgress()
  const { language, t } = useLanguage()

  const doneCount = allTopics.filter((t) => completed[t.id]).length
  const overallPct = allTopics.length
    ? Math.round((doneCount / allTopics.length) * 100)
    : 0
  const quizzesTaken = allTopics.filter((t) => bestScores[t.id]).length
  const readyLevels = levels.filter((l) => l.active && isLevelReady(l.id))

  async function handleReset() {
    const message =
      language === 'en'
        ? 'All your progress will be deleted. Are you sure?'
        : 'Tüm ilerlemen silinecek. Emin misin?'
    if (window.confirm(message)) {
      await resetProgress()
    }
  }

  return (
    <div className="container progress-page">
      <header className="progress-page__head">
        <div>
          <span className="eyebrow">{language === 'en' ? 'Progress Tracking' : 'İlerleme Takibi'}</span>
          <h1>{language === 'en' ? 'Where did you leave off?' : 'Nerede kaldın?'}</h1>
          <p>
            {language === 'en'
              ? 'Your data is stored locally in your browser with SQLite (WASM).'
              : 'Veriler tarayıcında SQLite (WASM) ile saklanıyor.'}
          </p>
        </div>
        <button className="btn btn--ghost" onClick={handleReset}>
          {language === 'en' ? 'Reset Progress' : 'İlerlemeyi Sıfırla'}
        </button>
      </header>

      <div className="progress-summary">
        <div className="progress-ring-card">
          <div className="progress-ring" style={{ '--p': `${overallPct}%` }}>
            <span>{overallPct}%</span>
          </div>
          <div>
            <strong>{doneCount} / {allTopics.length} {t('topics')}</strong>
            <p>{t('completed').toLocaleLowerCase(language === 'tr' ? 'tr-TR' : 'en-US')}</p>
          </div>
        </div>
        <div className="progress-mini">
          <span className="progress-mini__num">{quizzesTaken}</span>
          <span className="progress-mini__label">{language === 'en' ? 'Solved quizzes' : 'Çözülen quiz'}</span>
        </div>
        <Link to="/yanlislar" className="progress-mini">
          <span className="progress-mini__num">{mistakes.length}</span>
          <span className="progress-mini__label">{language === 'en' ? 'Active mistakes' : 'Aktif yanlış'}</span>
        </Link>
      </div>

      {readyLevels.map((rawLevel) => {
        const level = localizeLevel(rawLevel, language)
        const rawTopics = getTopicsByLevel(rawLevel.id)
        const topics = localizeTopics(rawTopics, language)
        return (
          <section key={rawLevel.id} className="progress-level">
            <h2 className="progress-level__title">
              <span className="progress-level__code">{level.code}</span>
              {level.name}
            </h2>
            <div className="progress-list">
              {rawTopics.map((rawTopic, index) => {
                const topic = topics[index] ?? localizeTopic(rawTopic, language)
                const done = completed[rawTopic.id]
                const best = bestScores[rawTopic.id]
                const totalQ = getQuiz(rawTopic.id).length
                return (
                  <Link
                    to={`/ders/${rawTopic.id}`}
                    key={rawTopic.id}
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
                        {done ? `✓ ${t('completed')}` : t('started')}
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

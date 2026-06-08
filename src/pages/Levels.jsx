import { Link } from 'react-router-dom'
import { levels } from '../data/levels'
import { getTopicsByLevel, isLevelReady } from '../data'
import { useProgress } from '../context/ProgressContext'
import { useLanguage } from '../context/LanguageContext'
import { localizeLevel } from '../i18n/content'
import './Levels.css'

export default function Levels() {
  const { completed } = useProgress()
  const { language, t } = useLanguage()

  return (
    <div className="container levels-page">
      <header className="levels-page__head">
        <span className="eyebrow">{language === 'en' ? 'CEFR Curriculum' : 'CEFR Müfredatı'}</span>
        <h1>{t('navLevels')}</h1>
        <p>
          {language === 'en'
            ? 'Grammar topics organized by the CEFR scale from A1 to C2. Each level includes lessons, quizzes, and a separate test bank.'
            : 'Avrupa Dil Ölçeği’ne (A1’den C2’ye) göre düzenlenmiş konular. Her seviyede dersler, quizler ve ayrı bir test bankası seni bekliyor.'}
        </p>
      </header>

      <div className="levels-grid">
        {levels.map((rawLevel, i) => {
          const level = localizeLevel(rawLevel, language)
          const ready = isLevelReady(rawLevel.id) && rawLevel.active
          const topics = getTopicsByLevel(rawLevel.id)
          const doneCount = topics.filter((t) => completed[t.id]).length
          const pct = topics.length
            ? Math.round((doneCount / topics.length) * 100)
            : 0

          const Card = ready ? Link : 'div'
          const cardProps = ready ? { to: `/seviye/${level.id}` } : {}

          return (
            <Card
              key={rawLevel.id}
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
                      {topics.length} {t('topics')}
                    </span>
                    <div className="level-card__bar" aria-hidden>
                      <span style={{ width: `${pct}%` }} />
                    </div>
                    <span className="level-card__pct">{pct}%</span>
                  </>
                ) : (
                  <span className="level-card__soon">{t('soon')}</span>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

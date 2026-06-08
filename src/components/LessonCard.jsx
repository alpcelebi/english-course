import { Link } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { useLanguage } from '../context/LanguageContext'
import './LessonCard.css'

export default function LessonCard({ lesson, index }) {
  const { completed, bestScores } = useProgress()
  const { t } = useLanguage()
  const isDone = completed[lesson.id]
  const best = bestScores[lesson.id]
  const exampleCount = lesson.sections.reduce((n, s) => n + s.examples.length, 0)

  return (
    <Link
      to={`/ders/${lesson.id}`}
      className="lesson-card"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="lesson-card__top">
        <span className="lesson-card__badge">{lesson.accent}</span>
        <div className="lesson-card__meta">
          <span className="lesson-card__num">{t('unit')} {lesson.order}</span>
          {isDone && <span className="lesson-card__done">✓ {t('completed')}</span>}
        </div>
      </div>

      <h3 className="lesson-card__title">{lesson.title}</h3>
      <p className="lesson-card__subtitle">{lesson.subtitle}</p>
      <p className="lesson-card__summary">{lesson.summary}</p>

      <div className="lesson-card__foot">
        <span className="lesson-card__stat">
          {lesson.sections.length} {lesson.sections.length === 1 ? t('section') : t('sections')}
        </span>
        <span className="lesson-card__dot" />
        <span className="lesson-card__stat">
          {exampleCount} {exampleCount === 1 ? t('example') : t('examples')}
        </span>
        {best && (
          <>
            <span className="lesson-card__dot" />
            <span className="lesson-card__stat lesson-card__stat--score">
              Quiz: {best.score}/{best.total}
            </span>
          </>
        )}
        <span className="lesson-card__arrow" aria-hidden>→</span>
      </div>
    </Link>
  )
}

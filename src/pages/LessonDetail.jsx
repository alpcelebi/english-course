import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getLesson, getQuiz, getLevelSiblings } from '../data'
import { getLevel } from '../data/levels'
import { useProgress } from '../context/ProgressContext'
import { RichText } from '../utils/richText'
import Quiz from '../components/Quiz'
import './LessonDetail.css'

export default function LessonDetail() {
  const { id } = useParams()
  const lesson = getLesson(id)
  const { markLessonViewed, markLessonCompleted, completed } = useProgress()
  const [tab, setTab] = useState('lesson')

  useEffect(() => {
    if (lesson) markLessonViewed(lesson.id)
    setTab('lesson')
    window.scrollTo(0, 0)
  }, [lesson, markLessonViewed])

  if (!lesson) {
    return (
      <div className="container lesson-detail__missing">
        <h1>Konu bulunamadı</h1>
        <Link to="/seviyeler" className="btn btn--primary">Seviyelere dön</Link>
      </div>
    )
  }

  const siblings = getLevelSiblings(lesson.id)
  const idx = siblings.findIndex((l) => l.id === lesson.id)
  const prev = siblings[idx - 1]
  const next = siblings[idx + 1]
  const questions = getQuiz(lesson.id)
  const isDone = completed[lesson.id]
  const level = getLevel(lesson.level)

  return (
    <article className="lesson-detail">
      <div className="lesson-detail__hero">
        <div className="container">
          <Link to={`/seviye/${lesson.level}`} className="lesson-detail__back">
            ← {level ? `${level.code} Konuları` : 'Konular'}
          </Link>
          <div className="lesson-detail__heading">
            <span className="lesson-detail__badge">{lesson.accent}</span>
            <div>
              <span className="eyebrow">Ünite {lesson.order}</span>
              <h1>{lesson.title}</h1>
              <p className="lesson-detail__subtitle">{lesson.subtitle}</p>
            </div>
          </div>
          <p className="lesson-detail__summary">{lesson.summary}</p>

          <div className="lesson-tabs" role="tablist">
            <button
              role="tab"
              aria-selected={tab === 'lesson'}
              className={`lesson-tab ${tab === 'lesson' ? 'active' : ''}`}
              onClick={() => setTab('lesson')}
            >
              Ders
            </button>
            <button
              role="tab"
              aria-selected={tab === 'quiz'}
              className={`lesson-tab ${tab === 'quiz' ? 'active' : ''}`}
              onClick={() => setTab('quiz')}
            >
              Quiz · {questions.length} soru
            </button>
          </div>
        </div>
      </div>

      <div className="container lesson-detail__body">
        {tab === 'lesson' ? (
          <>
            {lesson.sections.map((section, si) => (
              <section
                key={si}
                className="concept"
                style={{ animationDelay: `${si * 80}ms` }}
              >
                <div className="concept__head">
                  <span className="concept__index">{String(si + 1).padStart(2, '0')}</span>
                  <div>
                    <h2>{section.heading}</h2>
                    <p className="concept__sub">{section.subheading}</p>
                  </div>
                </div>

                <ul className="concept__notes">
                  {section.notes.map((note, ni) => (
                    <li key={ni}>{note}</li>
                  ))}
                </ul>

                <div className="examples">
                  {section.examples.map((ex, ei) => (
                    <div key={ei} className="example">
                      <p className="example__en">
                        <RichText text={ex.en} />
                      </p>
                      <p className="example__tr">{ex.tr}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            <div className="lesson-detail__finish">
              {!isDone ? (
                <button
                  className="btn btn--primary"
                  onClick={() => markLessonCompleted(lesson.id)}
                >
                  Bu konuyu tamamlandı olarak işaretle
                </button>
              ) : (
                <span className="lesson-detail__doneTag">✓ Bu konuyu tamamladın</span>
              )}
              <button className="btn btn--ghost" onClick={() => setTab('quiz')}>
                Quiz’e geç →
              </button>
            </div>
          </>
        ) : (
          <div className="lesson-detail__quizwrap">
            <Quiz topicId={lesson.id} questions={questions} />
          </div>
        )}

        <nav className="lesson-nav">
          {prev ? (
            <Link to={`/ders/${prev.id}`} className="lesson-nav__item">
              <span>← Önceki</span>
              <strong>{prev.title}</strong>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/ders/${next.id}`} className="lesson-nav__item lesson-nav__item--next">
              <span>Sonraki →</span>
              <strong>{next.title}</strong>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </article>
  )
}

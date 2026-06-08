import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getLesson, getQuiz, getLevelSiblings } from '../data'
import { getLevel } from '../data/levels'
import { useProgress } from '../context/ProgressContext'
import { useLanguage } from '../context/LanguageContext'
import { localizeLevel, localizeTopic, localizeTopics } from '../i18n/content'
import { RichText } from '../utils/richText'
import Quiz from '../components/Quiz'
import './LessonDetail.css'

export default function LessonDetail() {
  const { id } = useParams()
  const rawLesson = getLesson(id)
  const { markLessonViewed, markLessonCompleted, completed } = useProgress()
  const { language, t } = useLanguage()
  const [tab, setTab] = useState('lesson')
  const lesson = localizeTopic(rawLesson, language)

  useEffect(() => {
    if (rawLesson) markLessonViewed(rawLesson.id)
    setTab('lesson')
    window.scrollTo(0, 0)
  }, [rawLesson, markLessonViewed])

  if (!lesson) {
    return (
      <div className="container lesson-detail__missing">
        <h1>{t('noTopicFound')}</h1>
        <Link to="/seviyeler" className="btn btn--primary">
          {language === 'en' ? 'Back to levels' : 'Seviyelere dön'}
        </Link>
      </div>
    )
  }

  const siblings = getLevelSiblings(rawLesson.id)
  const localizedSiblings = localizeTopics(siblings, language)
  const idx = siblings.findIndex((l) => l.id === rawLesson.id)
  const prev = localizedSiblings[idx - 1]
  const next = localizedSiblings[idx + 1]
  const questions = language === 'en' ? lesson.quiz : getQuiz(rawLesson.id)
  const isDone = completed[lesson.id]
  const level = localizeLevel(getLevel(lesson.level), language)

  return (
    <article className="lesson-detail">
      <div className="lesson-detail__hero">
        <div className="container">
          <Link to={`/seviye/${lesson.level}`} className="lesson-detail__back">
            ← {level ? `${level.code} ${t('topics')}` : t('topics')}
          </Link>
          <div className="lesson-detail__heading">
            <span className="lesson-detail__badge">{lesson.accent}</span>
            <div>
              <span className="eyebrow">{t('unit')} {lesson.order}</span>
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
              {language === 'en' ? 'Lesson' : 'Ders'}
            </button>
            <button
              role="tab"
              aria-selected={tab === 'quiz'}
              className={`lesson-tab ${tab === 'quiz' ? 'active' : ''}`}
              onClick={() => setTab('quiz')}
            >
              Quiz · {questions.length} {t('questions')}
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
                      {language === 'tr' && <p className="example__tr">{ex.tr}</p>}
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
                  {language === 'en' ? 'Mark this topic as completed' : 'Bu konuyu tamamlandı olarak işaretle'}
                </button>
              ) : (
                <span className="lesson-detail__doneTag">
                  ✓ {language === 'en' ? 'You completed this topic' : 'Bu konuyu tamamladın'}
                </span>
              )}
              <button className="btn btn--ghost" onClick={() => setTab('quiz')}>
                {language === 'en' ? 'Go to quiz →' : 'Quiz’e geç →'}
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
              <span>{language === 'en' ? '← Previous' : '← Önceki'}</span>
              <strong>{prev.title}</strong>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/ders/${next.id}`} className="lesson-nav__item lesson-nav__item--next">
              <span>{language === 'en' ? 'Next →' : 'Sonraki →'}</span>
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

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getPlacementRecommendation,
  getPlacementTestQuestions,
  levels,
} from '../data'
import { useProgress } from '../context/ProgressContext'
import { useLanguage } from '../context/LanguageContext'
import { localizeLevel, localizeQuestionSet } from '../i18n/content'
import { RichText } from '../utils/richText'
import './PlacementTest.css'

const LETTERS = ['A', 'B', 'C', 'D']

function buildAnswerRecord(question, selectedIndex) {
  const correct = selectedIndex === question.answer

  return {
    correct,
    sourceTopicId: question.topicId,
    sourceTitle: question.topicTitle,
    levelId: question.levelId,
    levelCode: question.levelCode,
    questionKey: String(question.prompt),
    prompt: question.prompt,
    selectedAnswer: question.options[selectedIndex],
    correctAnswer: question.options[question.answer],
    explanation: question.explain,
  }
}

function scoreByLevel(answers) {
  return levels
    .filter((level) => level.active)
    .map((level) => {
      const levelAnswers = answers.filter((answer) => answer.levelId === level.id)
      const correct = levelAnswers.filter((answer) => answer.correct).length

      return {
        level,
        correct,
        total: levelAnswers.length,
      }
    })
    .filter((item) => item.total > 0)
}

export default function PlacementTest() {
  const { language, t } = useLanguage()
  const rawQuestions = useMemo(() => getPlacementTestQuestions(), [])
  const questions = useMemo(
    () => localizeQuestionSet(rawQuestions, language),
    [rawQuestions, language]
  )
  const { saveQuizResult } = useProgress()
  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [locked, setLocked] = useState(false)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState(0)

  const q = questions[current]
  const total = questions.length
  const progressPct = total ? Math.round(((current + 1) / total) * 100) : 0

  function choose(idx) {
    if (locked) return
    setSelected(idx)
    setLocked(true)
    setAnswers((prev) => {
      const nextAnswers = [...prev]
      nextAnswers[current] = buildAnswerRecord(q, idx)
      return nextAnswers
    })
  }

  async function next() {
    if (current + 1 < total) {
      setCurrent((c) => c + 1)
      setSelected(null)
      setLocked(false)
      return
    }

    const finalAnswers = answers.filter(Boolean)
    const finalScore = finalAnswers.filter((answer) => answer.correct).length

    setScore(finalScore)
    setFinished(true)
    await saveQuizResult('placement-test', finalScore, total, finalAnswers)
    window.scrollTo(0, 0)
  }

  function restart() {
    setStarted(true)
    setCurrent(0)
    setSelected(null)
    setLocked(false)
    setAnswers([])
    setFinished(false)
    setScore(0)
    window.scrollTo(0, 0)
  }

  if (!started) {
    return (
      <div className="container placement-page">
        <section className="placement-intro">
          <div className="placement-intro__copy">
            <span className="eyebrow">{language === 'en' ? 'Placement Test' : 'Seviye Sınavı'}</span>
            <h1>
              {language === 'en'
                ? 'Find the right level to start from.'
                : 'Başlamak için en doğru seviyeyi bul.'}
            </h1>
            <p>
              {language === 'en'
                ? 'This test is optional. Measure your general level in 20 questions, then start from the recommended level.'
                : 'Bu test mecburi değil. İstersen 20 soruda genel seviyeni ölç, sonra önerilen seviyeden çalışmaya başla.'}
            </p>
            <div className="placement-intro__actions">
              <button className="btn btn--primary" onClick={() => setStarted(true)}>
                {language === 'en' ? 'Start 20-Question Test' : '20 Soruluk Teste Başla'}
              </button>
              <Link to="/seviyeler" className="btn btn--ghost">
                {language === 'en' ? 'View Levels' : 'Seviyeleri Gör'}
              </Link>
            </div>
          </div>

          <div className="placement-intro__panel">
            <strong>20</strong>
            <span>{t('questions')}</span>
            <p>
              {language === 'en'
                ? 'A mixed but gradual measurement from A1 to C2.'
                : 'A1’den C2’ye kadar karışık ama kademeli ölçüm.'}
            </p>
          </div>
        </section>
      </div>
    )
  }

  if (finished) {
    const pct = total ? Math.round((score / total) * 100) : 0
    const recommendation = getPlacementRecommendation(score, total)
    const breakdown = scoreByLevel(answers.filter(Boolean))
    const recommendedLevel = localizeLevel(recommendation.level, language)

    return (
      <div className="container placement-result">
        <section className="quiz quiz--result placement-result__card">
          <div
            className="quiz-result__ring quiz-result__ring--great"
            style={{ '--p': `${pct}%` }}
          >
            <span className="quiz-result__pct">{pct}%</span>
          </div>
          <span className="eyebrow">
            {language === 'en' ? 'Recommended starting point' : 'Önerilen başlangıç'}
          </span>
          <h1>{recommendedLevel.code} {recommendedLevel.name}</h1>
          <p>
            {language === 'en'
              ? `You answered ${score} / ${total} correctly. Use this result as a starting point; you can still choose an easier or harder level if you prefer.`
              : `${score} / ${total} doğru yaptın. Bu sonuç başlangıç noktanı seçmek için kullanılır; istersen daha kolay ya da daha zor seviyeden de devam edebilirsin.`}
          </p>

          <div className="placement-breakdown">
            {breakdown.map(({ level, correct, total: levelTotal }) => {
              const displayLevel = localizeLevel(level, language)
              return (
              <div key={displayLevel.id} className="placement-breakdown__row">
                <span>{displayLevel.code}</span>
                <strong>
                  {correct}/{levelTotal}
                </strong>
              </div>
            )})}
          </div>

          <div className="placement-result__actions">
            <Link to={recommendation.path} className="btn btn--primary">
              {language === 'en' ? 'Start From This Level' : 'Bu Seviyeden Başla'}
            </Link>
            <button className="btn btn--ghost" onClick={restart}>
              {language === 'en' ? 'Retake Test' : 'Testi Tekrar Çöz'}
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="container placement-run">
      <button className="placement-run__back" onClick={() => setStarted(false)}>
        {language === 'en' ? '← Back to intro' : '← Girişe dön'}
      </button>
      <header className="placement-run__head">
        <span className="eyebrow">
          {language === 'en' ? 'Placement Test' : 'Seviye Sınavı'} · {total} {t('questions')}
        </span>
        <h1>{t('question')} {current + 1}</h1>
      </header>

      <div className="quiz">
        <div className="quiz__bar" aria-hidden>
          <span style={{ width: `${progressPct}%` }} />
        </div>

        <div className="quiz__head">
          <span className="quiz__count">
            {t('question')} {current + 1} / {total}
          </span>
          <span className="quiz__score">{q.levelCode}</span>
        </div>

        <p className="quiz__prompt">
          <RichText text={q.prompt} />
        </p>

        <div className="quiz__options">
          {q.options.map((opt, idx) => {
            let state = ''
            if (locked) {
              if (idx === q.answer) state = 'correct'
              else if (idx === selected) state = 'wrong'
              else state = 'dim'
            }

            return (
              <button
                key={idx}
                className={`quiz-option ${state}`}
                onClick={() => choose(idx)}
                disabled={locked}
              >
                <span className="quiz-option__letter">{LETTERS[idx]}</span>
                <span className="quiz-option__text">{opt}</span>
                {state === 'correct' && <span className="quiz-option__icon">✓</span>}
                {state === 'wrong' && <span className="quiz-option__icon">✕</span>}
              </button>
            )
          })}
        </div>

        {locked && (
          <div className="quiz__explain">
            <strong>{selected === q.answer ? t('correctFeedback') : t('explanation')}</strong>
            {q.explain}
          </div>
        )}

        <div className="quiz__actions">
          <button className="btn btn--primary" onClick={next} disabled={!locked}>
            {current + 1 < total ? t('nextQuestion') : t('seeResult')}
          </button>
        </div>
      </div>
    </div>
  )
}

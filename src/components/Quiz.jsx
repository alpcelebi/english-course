import { useMemo, useState } from 'react'
import { useProgress } from '../context/ProgressContext'
import { useLanguage } from '../context/LanguageContext'
import { RichText } from '../utils/richText'
import './Quiz.css'

const LETTERS = ['A', 'B', 'C', 'D']

function sourceTopicIdFrom(topicId, question) {
  if (question.topicId) return question.topicId
  return topicId.replace(/^test:/, '')
}

function buildAnswerRecord(topicId, question, selectedIndex) {
  const correct = selectedIndex === question.answer
  const sourceTopicId = sourceTopicIdFrom(topicId, question)

  return {
    correct,
    sourceTopicId,
    sourceTitle: question.topicTitle,
    questionKey: String(question.prompt),
    prompt: question.prompt,
    selectedAnswer: question.options[selectedIndex],
    correctAnswer: question.options[question.answer],
    explanation: question.explain,
  }
}

export default function Quiz({ topicId, questions }) {
  const { saveQuizResult } = useProgress()
  const { t } = useLanguage()
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [locked, setLocked] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)
  const [savedKey, setSavedKey] = useState(null)

  const q = questions[current]
  const total = questions.length
  const progressPct = useMemo(
    () => Math.round(((current + (finished ? 1 : 0)) / total) * 100),
    [current, finished, total]
  )

  function choose(idx) {
    if (locked) return
    setSelected(idx)
    setLocked(true)
    setAnswers((prev) => {
      const nextAnswers = [...prev]
      nextAnswers[current] = buildAnswerRecord(topicId, q, idx)
      return nextAnswers
    })
    if (idx === q.answer) setScore((s) => s + 1)
  }

  async function next() {
    if (current + 1 < total) {
      setCurrent((c) => c + 1)
      setSelected(null)
      setLocked(false)
    } else {
      setFinished(true)
      // Persist the final score once.
      const key = `${topicId}-${score}`
      if (savedKey !== key) {
        setSavedKey(key)
        await saveQuizResult(topicId, score, total, answers.filter(Boolean))
      }
    }
  }

  function restart() {
    setCurrent(0)
    setSelected(null)
    setLocked(false)
    setScore(0)
    setAnswers([])
    setFinished(false)
    setSavedKey(null)
  }

  if (finished) {
    const pct = Math.round((score / total) * 100)
    const tone = pct >= 80 ? 'great' : pct >= 50 ? 'ok' : 'low'
    const message =
      tone === 'great'
        ? t('resultGreat')
        : tone === 'ok'
        ? t('resultOk')
        : t('resultLow')

    return (
      <div className="quiz quiz--result">
        <div
          className={`quiz-result__ring quiz-result__ring--${tone}`}
          style={{ '--p': `${pct}%` }}
        >
          <span className="quiz-result__pct">{pct}%</span>
        </div>
        <h3 className="quiz-result__score">
          {score} / {total} {t('correct')}
        </h3>
        <p className="quiz-result__msg">{message}</p>
        <button className="btn btn--primary" onClick={restart}>
          {t('retry')}
        </button>
      </div>
    )
  }

  return (
    <div className="quiz">
      <div className="quiz__bar" aria-hidden>
        <span style={{ width: `${progressPct}%` }} />
      </div>

      <div className="quiz__head">
        <span className="quiz__count">
          {t('question')} {current + 1} / {total}
        </span>
        <span className="quiz__score">{t('score')}: {score}</span>
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
  )
}

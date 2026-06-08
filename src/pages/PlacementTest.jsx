import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getPlacementRecommendation,
  getPlacementTestQuestions,
  levels,
} from '../data'
import { useProgress } from '../context/ProgressContext'
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
  const questions = useMemo(() => getPlacementTestQuestions(), [])
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
            <span className="eyebrow">Seviye Sınavı</span>
            <h1>Başlamak için en doğru seviyeyi bul.</h1>
            <p>
              Bu test mecburi değil. İstersen 20 soruda genel seviyeni ölç,
              sonra önerilen seviyeden çalışmaya başla.
            </p>
            <div className="placement-intro__actions">
              <button className="btn btn--primary" onClick={() => setStarted(true)}>
                20 Soruluk Teste Başla
              </button>
              <Link to="/seviyeler" className="btn btn--ghost">
                Seviyeleri Gör
              </Link>
            </div>
          </div>

          <div className="placement-intro__panel">
            <strong>20</strong>
            <span>soru</span>
            <p>A1’den C2’ye kadar karışık ama kademeli ölçüm.</p>
          </div>
        </section>
      </div>
    )
  }

  if (finished) {
    const pct = total ? Math.round((score / total) * 100) : 0
    const recommendation = getPlacementRecommendation(score, total)
    const breakdown = scoreByLevel(answers.filter(Boolean))

    return (
      <div className="container placement-result">
        <section className="quiz quiz--result placement-result__card">
          <div
            className="quiz-result__ring quiz-result__ring--great"
            style={{ '--p': `${pct}%` }}
          >
            <span className="quiz-result__pct">{pct}%</span>
          </div>
          <span className="eyebrow">Önerilen başlangıç</span>
          <h1>{recommendation.title}</h1>
          <p>
            {score} / {total} doğru yaptın. Bu sonuç başlangıç noktanı seçmek
            için kullanılır; istersen daha kolay ya da daha zor seviyeden de
            devam edebilirsin.
          </p>

          <div className="placement-breakdown">
            {breakdown.map(({ level, correct, total: levelTotal }) => (
              <div key={level.id} className="placement-breakdown__row">
                <span>{level.code}</span>
                <strong>
                  {correct}/{levelTotal}
                </strong>
              </div>
            ))}
          </div>

          <div className="placement-result__actions">
            <Link to={recommendation.path} className="btn btn--primary">
              Bu Seviyeden Başla
            </Link>
            <button className="btn btn--ghost" onClick={restart}>
              Testi Tekrar Çöz
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="container placement-run">
      <button className="placement-run__back" onClick={() => setStarted(false)}>
        ← Girişe dön
      </button>
      <header className="placement-run__head">
        <span className="eyebrow">Seviye Sınavı · {total} soru</span>
        <h1>Soru {current + 1}</h1>
      </header>

      <div className="quiz">
        <div className="quiz__bar" aria-hidden>
          <span style={{ width: `${progressPct}%` }} />
        </div>

        <div className="quiz__head">
          <span className="quiz__count">
            Soru {current + 1} / {total}
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
            <strong>{selected === q.answer ? 'Doğru! ' : 'Açıklama: '}</strong>
            {q.explain}
          </div>
        )}

        <div className="quiz__actions">
          <button className="btn btn--primary" onClick={next} disabled={!locked}>
            {current + 1 < total ? 'Sonraki Soru' : 'Sonucu Gör'}
          </button>
        </div>
      </div>
    </div>
  )
}

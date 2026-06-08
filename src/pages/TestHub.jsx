import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { levels } from '../data/levels'
import {
  getTopicsByLevel,
  isLevelReady,
  getLevelMixedTest,
  getTopicTestQuestions,
} from '../data'
import { useProgress } from '../context/ProgressContext'
import Quiz from '../components/Quiz'
import './TestHub.css'

const activeLevels = levels.filter((l) => l.active && isLevelReady(l.id))

export default function TestHub() {
  const [params, setParams] = useSearchParams()
  const { bestScores } = useProgress()

  const levelFromUrl = params.get('level')
  const initialLevel = activeLevels.some((l) => l.id === levelFromUrl)
    ? levelFromUrl
    : activeLevels[0]?.id

  const [levelId, setLevelId] = useState(initialLevel)
  // active test: { id, title, questions } or null while picking
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (levelFromUrl && levelFromUrl !== levelId) setLevelId(levelFromUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelFromUrl])

  const topics = useMemo(() => getTopicsByLevel(levelId), [levelId])
  const level = levels.find((l) => l.id === levelId)

  function selectLevel(id) {
    setLevelId(id)
    setActive(null)
    setParams({ level: id }, { replace: true })
  }

  function startTopicTest(topic) {
    setActive({
      id: `test:${topic.id}`,
      title: `${level.code} · ${topic.title}`,
      questions: getTopicTestQuestions(topic),
    })
    window.scrollTo(0, 0)
  }

  function startMixedTest() {
    const questions = getLevelMixedTest(levelId, 20)
    setActive({
      id: `mixtest:${levelId}`,
      title: `${level.code} · Karışık Test`,
      questions,
    })
    window.scrollTo(0, 0)
  }

  if (active) {
    return (
      <div className="container test-run">
        <button className="test-run__back" onClick={() => setActive(null)}>
          ← Test seçimine dön
        </button>
        <header className="test-run__head">
          <span className="eyebrow">Test · {active.questions.length} soru</span>
          <h1>{active.title}</h1>
        </header>
        <Quiz
          key={active.id}
          topicId={active.id}
          questions={active.questions}
        />
      </div>
    )
  }

  return (
    <div className="container test-hub">
      <header className="test-hub__head">
        <span className="eyebrow">Sınav Salonu</span>
        <h1>Test Bankası</h1>
        <p>
          Derslerdeki quizlerden ayrı, daha geniş bir soru havuzu. Bir konuyu
          tek tek test et ya da tüm seviyeyi karışık bir sınavla ölç.
        </p>
      </header>

      <div className="test-hub__levels" role="tablist">
        {activeLevels.map((l) => (
          <button
            key={l.id}
            role="tab"
            aria-selected={l.id === levelId}
            className={`level-pill ${l.id === levelId ? 'active' : ''}`}
            onClick={() => selectLevel(l.id)}
          >
            <span className="level-pill__code">{l.code}</span>
            <span className="level-pill__name">{l.name}</span>
          </button>
        ))}
      </div>

      <Link to="/seviye-testi" className="test-placement">
        <div className="test-placement__icon">20</div>
        <div className="test-placement__copy">
          <strong>Seviyeni Bul</strong>
          <span>A1’den C2’ye kadar 20 soruluk isteğe bağlı seviye sınavı</span>
        </div>
        <span className="test-placement__arrow" aria-hidden>→</span>
      </Link>

      <button className="test-mixed" onClick={startMixedTest}>
        <div className="test-mixed__icon">∑</div>
        <div className="test-mixed__copy">
          <strong>{level?.code} Karışık Testi</strong>
          <span>
            {level?.name} seviyesinin tüm konularından karışık 20 soru
          </span>
        </div>
        <span className="test-mixed__arrow" aria-hidden>→</span>
      </button>

      <h2 className="test-hub__sub">Konu Testleri</h2>
      <div className="test-grid">
        {topics.map((topic, i) => {
          const best = bestScores[`test:${topic.id}`]
          return (
            <button
              key={topic.id}
              className="test-card"
              onClick={() => startTopicTest(topic)}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="test-card__badge">{topic.accent}</span>
              <div className="test-card__body">
                <strong>{topic.title}</strong>
                <span className="test-card__sub">{topic.subtitle}</span>
              </div>
              <div className="test-card__meta">
                <span className="test-card__count">
                  {getTopicTestQuestions(topic).length} soru
                </span>
                {best && (
                  <span className="test-card__best">
                    En iyi: {best.score}/{best.total}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

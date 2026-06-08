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
import { useLanguage } from '../context/LanguageContext'
import {
  localizeLevel,
  localizeQuestionSet,
  localizeTopic,
  localizeTopics,
} from '../i18n/content'
import Quiz from '../components/Quiz'
import './TestHub.css'

const activeLevels = levels.filter((l) => l.active && isLevelReady(l.id))

export default function TestHub() {
  const [params, setParams] = useSearchParams()
  const { bestScores } = useProgress()
  const { language, t } = useLanguage()

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

  const rawTopics = useMemo(() => getTopicsByLevel(levelId), [levelId])
  const topics = useMemo(() => localizeTopics(rawTopics, language), [rawTopics, language])
  const level = localizeLevel(levels.find((l) => l.id === levelId), language)

  function selectLevel(id) {
    setLevelId(id)
    setActive(null)
    setParams({ level: id }, { replace: true })
  }

  function startTopicTest(topic) {
    const localizedTopic = localizeTopic(topic, language)
    setActive({
      id: `test:${topic.id}`,
      title: `${level.code} · ${localizedTopic.title}`,
      questions: localizeQuestionSet(getTopicTestQuestions(topic), language),
    })
    window.scrollTo(0, 0)
  }

  function startMixedTest() {
    const questions = getLevelMixedTest(levelId, 20)
    setActive({
      id: `mixtest:${levelId}`,
      title: language === 'en' ? `${level.code} · Mixed Test` : `${level.code} · Karışık Test`,
      questions: localizeQuestionSet(questions, language),
    })
    window.scrollTo(0, 0)
  }

  if (active) {
    return (
      <div className="container test-run">
        <button className="test-run__back" onClick={() => setActive(null)}>
          {language === 'en' ? '← Back to test selection' : '← Test seçimine dön'}
        </button>
        <header className="test-run__head">
          <span className="eyebrow">Test · {active.questions.length} {t('questions')}</span>
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
        <span className="eyebrow">{language === 'en' ? 'Exam Room' : 'Sınav Salonu'}</span>
        <h1>{language === 'en' ? 'Test Bank' : 'Test Bankası'}</h1>
        <p>
          {language === 'en'
            ? 'A wider question pool separate from lesson quizzes. Test one topic at a time or measure a whole level with a mixed exam.'
            : 'Derslerdeki quizlerden ayrı, daha geniş bir soru havuzu. Bir konuyu tek tek test et ya da tüm seviyeyi karışık bir sınavla ölç.'}
        </p>
      </header>

      <div className="test-hub__levels" role="tablist">
        {activeLevels.map((rawLevel) => {
          const l = localizeLevel(rawLevel, language)
          return (
          <button
            key={rawLevel.id}
            role="tab"
            aria-selected={rawLevel.id === levelId}
            className={`level-pill ${rawLevel.id === levelId ? 'active' : ''}`}
            onClick={() => selectLevel(rawLevel.id)}
          >
            <span className="level-pill__code">{l.code}</span>
            <span className="level-pill__name">{l.name}</span>
          </button>
        )})}
      </div>

      <Link to="/seviye-testi" className="test-placement">
        <div className="test-placement__icon">20</div>
        <div className="test-placement__copy">
          <strong>{language === 'en' ? 'Find Your Level' : 'Seviyeni Bul'}</strong>
          <span>
            {language === 'en'
              ? 'Optional 20-question placement test from A1 to C2'
              : 'A1’den C2’ye kadar 20 soruluk isteğe bağlı seviye sınavı'}
          </span>
        </div>
        <span className="test-placement__arrow" aria-hidden>→</span>
      </Link>

      <button className="test-mixed" onClick={startMixedTest}>
        <div className="test-mixed__icon">∑</div>
        <div className="test-mixed__copy">
          <strong>
            {language === 'en' ? `${level?.code} Mixed Test` : `${level?.code} Karışık Testi`}
          </strong>
          <span>
            {language === 'en'
              ? `20 mixed questions from all ${level?.name} topics`
              : `${level?.name} seviyesinin tüm konularından karışık 20 soru`}
          </span>
        </div>
        <span className="test-mixed__arrow" aria-hidden>→</span>
      </button>

      <h2 className="test-hub__sub">{language === 'en' ? 'Topic Tests' : 'Konu Testleri'}</h2>
      <div className="test-grid">
        {rawTopics.map((rawTopic, i) => {
          const topic = topics[i]
          const best = bestScores[`test:${rawTopic.id}`]
          return (
            <button
              key={rawTopic.id}
              className="test-card"
              onClick={() => startTopicTest(rawTopic)}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="test-card__badge">{topic.accent}</span>
              <div className="test-card__body">
                <strong>{topic.title}</strong>
                <span className="test-card__sub">{topic.subtitle}</span>
              </div>
              <div className="test-card__meta">
                <span className="test-card__count">
                  {getTopicTestQuestions(topic).length} {t('questions')}
                </span>
                {best && (
                  <span className="test-card__best">
                    {t('best')}: {best.score}/{best.total}
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

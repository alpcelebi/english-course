import { Link } from 'react-router-dom'
import { levels } from '../data/levels'
import { allTopics, getTopicsByLevel, isLevelReady } from '../data'
import { useProgress } from '../context/ProgressContext'
import { useLanguage } from '../context/LanguageContext'
import { localizeLevel } from '../i18n/content'
import './Home.css'

export default function Home() {
  const { completed } = useProgress()
  const { language, t } = useLanguage()
  const doneCount = allTopics.filter((t) => completed[t.id]).length
  const totalExamples = allTopics.reduce(
    (n, t) => n + t.sections.reduce((m, s) => m + s.examples.length, 0),
    0
  )
  const readyLevels = levels.filter((l) => l.active && isLevelReady(l.id))

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <span className="eyebrow">
              {language === 'en' ? 'Interactive Grammar · A1 → C2' : 'İnteraktif Dilbilgisi · A1 → C2'}
            </span>
            {language === 'en' ? (
              <h1 className="hero__title">
                Learn English grammar
                <span className="hero__accent"> level by level</span>,
                <span className="hero__accent"> with examples and tests</span>.
              </h1>
            ) : (
              <h1 className="hero__title">
                İngilizce gramerini
                <span className="hero__accent"> seviye seviye</span>,
                <span className="hero__accent"> örnek ve testlerle</span> öğren.
              </h1>
            )}
            <p className="hero__lead">
              {language === 'en'
                ? 'CEFR-based grammar topics with clear examples, instant-feedback quizzes, and a separate test bank. Your progress is stored locally in your browser with SQLite.'
                : 'CEFR seviyelerine göre düzenlenmiş konular; her biri bol örnek cümle, anında geri bildirimli quizler ve ayrı bir test bankasıyla. İlerlemen tarayıcında SQLite ile saklanır.'}
            </p>
            <div className="hero__cta">
              <Link to="/seviyeler" className="btn btn--primary">
                {language === 'en' ? 'Start Levels' : 'Seviyelere Başla'}
              </Link>
              <Link to="/seviye-testi" className="btn btn--ghost">
                {language === 'en' ? 'Find Your Level' : 'Seviyeni Bul'}
              </Link>
              <Link to="/test" className="btn btn--ghost">
                {language === 'en' ? 'Test Bank' : 'Test Bankası'}
              </Link>
            </div>
          </div>

          <div className="hero__stats">
            <div className="stat-card">
              <span className="stat-card__num">{allTopics.length}</span>
              <span className="stat-card__label">{language === 'en' ? 'Topic Units' : 'Konu Ünitesi'}</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__num">{totalExamples}+</span>
              <span className="stat-card__label">{language === 'en' ? 'Example Sentences' : 'Örnek Cümle'}</span>
            </div>
            <div className="stat-card stat-card--accent">
              <span className="stat-card__num">{doneCount}/{allTopics.length}</span>
              <span className="stat-card__label">{language === 'en' ? 'Completed' : 'Tamamladığın'}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container home__section">
        <div className="section-head">
          <h2>{t('navLevels')}</h2>
          <Link to="/seviyeler" className="section-head__link">
            {language === 'en' ? 'View all →' : 'Tümünü gör →'}
          </Link>
        </div>
        <div className="home-levels">
          {levels.map((rawLevel) => {
            const level = localizeLevel(rawLevel, language)
            const ready = rawLevel.active && isLevelReady(rawLevel.id)
            const topics = getTopicsByLevel(rawLevel.id)
            const done = topics.filter((t) => completed[t.id]).length
            const Card = ready ? Link : 'div'
            const props = ready ? { to: `/seviye/${rawLevel.id}` } : {}
            return (
              <Card
                key={rawLevel.id}
                {...props}
                className={`home-level ${ready ? '' : 'home-level--soon'}`}
              >
                <span className="home-level__code">{level.code}</span>
                <span className="home-level__name">{level.name}</span>
                <span className="home-level__meta">
                  {ready ? `${done}/${topics.length} ${t('topics')}` : t('soon')}
                </span>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}

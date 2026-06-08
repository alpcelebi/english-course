import { Link } from 'react-router-dom'
import { levels } from '../data/levels'
import { allTopics, getTopicsByLevel, isLevelReady } from '../data'
import { useProgress } from '../context/ProgressContext'
import './Home.css'

export default function Home() {
  const { completed } = useProgress()
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
            <span className="eyebrow">İnteraktif Dilbilgisi · A1 → C2</span>
            <h1 className="hero__title">
              İngilizce gramerini
              <span className="hero__accent"> seviye seviye</span>,
              <span className="hero__accent"> örnek ve testlerle</span> öğren.
            </h1>
            <p className="hero__lead">
              CEFR seviyelerine göre düzenlenmiş konular; her biri bol örnek
              cümle, anında geri bildirimli quizler ve ayrı bir test bankasıyla.
              İlerlemen tarayıcında SQLite ile saklanır.
            </p>
            <div className="hero__cta">
              <Link to="/seviyeler" className="btn btn--primary">
                Seviyelere Başla
              </Link>
              <Link to="/seviye-testi" className="btn btn--ghost">
                Seviyeni Bul
              </Link>
              <Link to="/test" className="btn btn--ghost">
                Test Bankası
              </Link>
            </div>
          </div>

          <div className="hero__stats">
            <div className="stat-card">
              <span className="stat-card__num">{allTopics.length}</span>
              <span className="stat-card__label">Konu Ünitesi</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__num">{totalExamples}+</span>
              <span className="stat-card__label">Örnek Cümle</span>
            </div>
            <div className="stat-card stat-card--accent">
              <span className="stat-card__num">{doneCount}/{allTopics.length}</span>
              <span className="stat-card__label">Tamamladığın</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container home__section">
        <div className="section-head">
          <h2>Seviyeler</h2>
          <Link to="/seviyeler" className="section-head__link">
            Tümünü gör →
          </Link>
        </div>
        <div className="home-levels">
          {levels.map((level) => {
            const ready = level.active && isLevelReady(level.id)
            const topics = getTopicsByLevel(level.id)
            const done = topics.filter((t) => completed[t.id]).length
            const Card = ready ? Link : 'div'
            const props = ready ? { to: `/seviye/${level.id}` } : {}
            return (
              <Card
                key={level.id}
                {...props}
                className={`home-level ${ready ? '' : 'home-level--soon'}`}
              >
                <span className="home-level__code">{level.code}</span>
                <span className="home-level__name">{level.name}</span>
                <span className="home-level__meta">
                  {ready ? `${done}/${topics.length} konu` : 'Yakında'}
                </span>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}

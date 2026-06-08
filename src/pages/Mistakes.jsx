import { Link } from 'react-router-dom'
import { getLevel, getTopic } from '../data'
import { useProgress } from '../context/ProgressContext'
import { RichText } from '../utils/richText'
import './Mistakes.css'

function formatDate(value) {
  if (!value) return ''

  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export default function Mistakes() {
  const { mistakes, clearMistake, clearAllMistakes } = useProgress()
  const hasMistakes = mistakes.length > 0

  async function handleClearAll() {
    if (window.confirm('Tüm aktif yanlışları defterden kaldırmak istiyor musun?')) {
      await clearAllMistakes()
    }
  }

  return (
    <div className="container mistakes-page">
      <header className="mistakes-page__head">
        <div>
          <span className="eyebrow">Yanlışlar Defteri</span>
          <h1>Tekrar bakman gereken sorular</h1>
          <p>
            Quizlerde yanlış yaptığın sorular burada kalır. Aynı soruyu doğru
            çözdüğünde ya da “Öğrendim” dediğinde listeden düşer.
          </p>
        </div>
        {hasMistakes && (
          <button className="btn btn--ghost" onClick={handleClearAll}>
            Tümünü Temizle
          </button>
        )}
      </header>

      <div className="mistakes-summary">
        <div>
          <strong>{mistakes.length}</strong>
          <span>aktif yanlış</span>
        </div>
        <Link to="/test">Test çöz</Link>
      </div>

      {!hasMistakes ? (
        <section className="mistakes-empty">
          <span className="mistakes-empty__mark">✓</span>
          <h2>Şu an defter temiz.</h2>
          <p>Yeni quiz veya test çözdükçe yanlış cevapların burada görünür.</p>
          <div className="mistakes-empty__actions">
            <Link to="/test" className="btn btn--primary">
              Test Bankasına Git
            </Link>
            <Link to="/seviye-testi" className="btn btn--ghost">
              Seviye Testi Çöz
            </Link>
          </div>
        </section>
      ) : (
        <div className="mistake-list">
          {mistakes.map((mistake) => {
            const topic = getTopic(mistake.topicId)
            const level = topic ? getLevel(topic.level) : null
            const title = topic?.title ?? mistake.sourceTitle ?? 'Konu'

            return (
              <article
                key={`${mistake.topicId}:${mistake.questionKey}`}
                className="mistake-card"
              >
                <div className="mistake-card__top">
                  <div>
                    <span className="mistake-card__meta">
                      {level?.code ?? 'Test'} · {formatDate(mistake.lastWrongAt)}
                    </span>
                    <h2>{title}</h2>
                  </div>
                  <span className="mistake-card__attempts">
                    {mistake.attempts} kez
                  </span>
                </div>

                <p className="mistake-card__prompt">
                  <RichText text={mistake.prompt} />
                </p>

                <div className="mistake-card__answers">
                  <div>
                    <span>Senin cevabın</span>
                    <strong>{mistake.selectedAnswer}</strong>
                  </div>
                  <div>
                    <span>Doğru cevap</span>
                    <strong>{mistake.correctAnswer}</strong>
                  </div>
                </div>

                {mistake.explanation && (
                  <p className="mistake-card__explain">
                    <RichText text={mistake.explanation} />
                  </p>
                )}

                <div className="mistake-card__actions">
                  {topic && (
                    <Link to={`/ders/${topic.id}`} className="btn btn--ghost">
                      Derse Dön
                    </Link>
                  )}
                  <button
                    className="btn btn--primary"
                    onClick={() => clearMistake(mistake.topicId, mistake.questionKey)}
                  >
                    Öğrendim
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

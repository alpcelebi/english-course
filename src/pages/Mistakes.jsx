import { Link } from 'react-router-dom'
import { getLevel, getTopic } from '../data'
import { useProgress } from '../context/ProgressContext'
import { useLanguage } from '../context/LanguageContext'
import { localizeLevel, localizeTopic, toEnglishText } from '../i18n/content'
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
  const { language } = useLanguage()
  const hasMistakes = mistakes.length > 0

  async function handleClearAll() {
    const message =
      language === 'en'
        ? 'Do you want to remove all active mistakes from the notebook?'
        : 'Tüm aktif yanlışları defterden kaldırmak istiyor musun?'
    if (window.confirm(message)) {
      await clearAllMistakes()
    }
  }

  return (
    <div className="container mistakes-page">
      <header className="mistakes-page__head">
        <div>
          <span className="eyebrow">{language === 'en' ? 'Mistake Notebook' : 'Yanlışlar Defteri'}</span>
          <h1>{language === 'en' ? 'Questions you should review' : 'Tekrar bakman gereken sorular'}</h1>
          <p>
            {language === 'en'
              ? 'Questions you answer incorrectly stay here. They disappear when you answer the same question correctly or mark them as learned.'
              : 'Quizlerde yanlış yaptığın sorular burada kalır. Aynı soruyu doğru çözdüğünde ya da “Öğrendim” dediğinde listeden düşer.'}
          </p>
        </div>
        {hasMistakes && (
          <button className="btn btn--ghost" onClick={handleClearAll}>
            {language === 'en' ? 'Clear All' : 'Tümünü Temizle'}
          </button>
        )}
      </header>

      <div className="mistakes-summary">
        <div>
          <strong>{mistakes.length}</strong>
          <span>{language === 'en' ? 'active mistakes' : 'aktif yanlış'}</span>
        </div>
        <Link to="/test">{language === 'en' ? 'Take a test' : 'Test çöz'}</Link>
      </div>

      {!hasMistakes ? (
        <section className="mistakes-empty">
          <span className="mistakes-empty__mark">✓</span>
          <h2>{language === 'en' ? 'Your notebook is clear.' : 'Şu an defter temiz.'}</h2>
          <p>
            {language === 'en'
              ? 'Incorrect answers from new quizzes and tests will appear here.'
              : 'Yeni quiz veya test çözdükçe yanlış cevapların burada görünür.'}
          </p>
          <div className="mistakes-empty__actions">
            <Link to="/test" className="btn btn--primary">
              {language === 'en' ? 'Go to Test Bank' : 'Test Bankasına Git'}
            </Link>
            <Link to="/seviye-testi" className="btn btn--ghost">
              {language === 'en' ? 'Take Placement Test' : 'Seviye Testi Çöz'}
            </Link>
          </div>
        </section>
      ) : (
        <div className="mistake-list">
          {mistakes.map((mistake) => {
            const rawTopic = getTopic(mistake.topicId)
            const topic = localizeTopic(rawTopic, language)
            const level = rawTopic ? localizeLevel(getLevel(rawTopic.level), language) : null
            const title =
              topic?.title ??
              (language === 'en'
                ? toEnglishText(mistake.sourceTitle, 'Topic')
                : mistake.sourceTitle) ??
              (language === 'en' ? 'Topic' : 'Konu')
            const prompt =
              language === 'en'
                ? toEnglishText(mistake.prompt, 'Review this question.')
                : mistake.prompt
            const explanation =
              language === 'en'
                ? toEnglishText(mistake.explanation, 'Review the grammar rule and try again.')
                : mistake.explanation

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
                  <RichText text={prompt} />
                </p>

                <div className="mistake-card__answers">
                  <div>
                    <span>{language === 'en' ? 'Your answer' : 'Senin cevabın'}</span>
                    <strong>{mistake.selectedAnswer}</strong>
                  </div>
                  <div>
                    <span>{language === 'en' ? 'Correct answer' : 'Doğru cevap'}</span>
                    <strong>{mistake.correctAnswer}</strong>
                  </div>
                </div>

                {explanation && (
                  <p className="mistake-card__explain">
                    <RichText text={explanation} />
                  </p>
                )}

                <div className="mistake-card__actions">
                  {topic && (
                    <Link to={`/ders/${topic.id}`} className="btn btn--ghost">
                      {language === 'en' ? 'Back to Lesson' : 'Derse Dön'}
                    </Link>
                  )}
                  <button
                    className="btn btn--primary"
                    onClick={() => clearMistake(mistake.topicId, mistake.questionKey)}
                  >
                    {language === 'en' ? 'Learned' : 'Öğrendim'}
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

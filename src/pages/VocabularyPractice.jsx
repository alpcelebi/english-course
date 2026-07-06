import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getLevel } from '../data/levels'
import { getVocabularyByLevel, TARGET_PER_LEVEL } from '../data/vocabulary'
import { useLanguage } from '../context/LanguageContext'
import { localizeLevel } from '../i18n/content'
import './VocabularyPractice.css'

const categoryLabels = {
  'social-issues': { tr: 'Sosyal konular', en: 'Social issues' },
  resources: { tr: 'Kaynaklar', en: 'Resources' },
  qualities: { tr: 'Nitelikler', en: 'Qualities' },
  skills: { tr: 'Beceriler', en: 'Skills' },
}

function shuffle(items) {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function VocabularyPractice() {
  const { levelId } = useParams()
  const { language } = useLanguage()
  const rawLevel = getLevel(levelId)
  const level = localizeLevel(rawLevel, language)
  const vocabulary = useMemo(() => getVocabularyByLevel(levelId), [levelId])
  const [queue, setQueue] = useState(() => shuffle(vocabulary))
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [seen, setSeen] = useState(0)
  const [known, setKnown] = useState(0)

  const current = queue[index]
  const categoryLabel = categoryLabels[current?.category]?.[language] ?? current?.category ?? ''

  useEffect(() => {
    setQueue(shuffle(vocabulary))
    setIndex(0)
    setRevealed(false)
    setSeen(0)
    setKnown(0)
  }, [vocabulary])

  function nextCard(markKnown = false) {
    if (!queue.length) return
    setKnown((value) => value + (markKnown ? 1 : 0))
    setSeen((value) => value + 1)
    setRevealed(false)

    if (index >= queue.length - 1) {
      setQueue(shuffle(vocabulary))
      setIndex(0)
      return
    }

    setIndex((value) => value + 1)
  }

  if (!rawLevel) {
    return (
      <div className="container vocab-empty">
        <h1>{language === 'en' ? 'Level not found' : 'Seviye bulunamadı'}</h1>
        <Link to="/seviyeler" className="btn btn--primary">
          {language === 'en' ? 'Back to levels' : 'Seviyelere dön'}
        </Link>
      </div>
    )
  }

  if (!vocabulary.length) {
    return (
      <div className="container vocab-empty">
        <Link to={`/seviye/${rawLevel.id}`} className="vocab-back">
          ← {level.code}
        </Link>
        <span className="eyebrow">{language === 'en' ? 'Vocabulary' : 'Kelimeler'}</span>
        <h1>{language === 'en' ? `${level.code} word bank is coming soon` : `${level.code} kelime bankası yakında`}</h1>
        <p>
          {language === 'en'
            ? `The target is ${TARGET_PER_LEVEL} words and phrases for this level. B2 is ready first.`
            : `Bu seviye için hedef ${TARGET_PER_LEVEL} kelime ve söz kalıbı. İlk olarak B2 hazırlandı.`}
        </p>
      </div>
    )
  }

  return (
    <div className="vocab-practice">
      <header className="container vocab-practice__header">
        <Link to={`/seviye/${rawLevel.id}`} className="vocab-back">
          ← {level.code} {language === 'en' ? 'topics' : 'konuları'}
        </Link>
        <div>
          <span className="eyebrow">{language === 'en' ? 'Random Vocabulary Practice' : 'Rastgele Kelime Çalış'}</span>
          <h1>{language === 'en' ? `${level.code} Words & Phrases` : `${level.code} Kelimeler ve Söz Kalıpları`}</h1>
          <p>
            {language === 'en'
              ? 'Look at the word or phrase first. If you are not sure, reveal the meaning and example sentence.'
              : 'Önce kelimeyi ya da kalıbı gör. Emin değilsen anlamını ve örnek cümlede kullanımını aç.'}
          </p>
        </div>
      </header>

      <section className="container vocab-practice__layout">
        <article className={`vocab-card ${revealed ? 'is-revealed' : ''}`}>
          <div className="vocab-card__meta">
            <span>{categoryLabel}</span>
            <span>
              {index + 1}/{queue.length}
            </span>
          </div>

          <h2>{current.term}</h2>
          <p className="vocab-card__prompt">
            {language === 'en' ? 'Do you know this meaning?' : 'Bu kelimenin anlamını biliyor musun?'}
          </p>

          {revealed && (
            <div className="vocab-card__answer">
              <div>
                <span>{language === 'en' ? 'Meaning' : 'Anlamı'}</span>
                <strong>{current.meaning}</strong>
              </div>
              <div>
                <span>{language === 'en' ? 'In a sentence' : 'Cümlede kullanımı'}</span>
                <p>{current.example}</p>
              </div>
            </div>
          )}

          <div className="vocab-card__actions">
            {!revealed ? (
              <>
                <button type="button" className="btn btn--ghost" onClick={() => setRevealed(true)}>
                  {language === 'en' ? 'I am not sure' : 'Bilmiyorum'}
                </button>
                <button type="button" className="btn btn--primary" onClick={() => nextCard(true)}>
                  {language === 'en' ? 'I know it' : 'Biliyorum'}
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn--ghost" onClick={() => nextCard(false)}>
                  {language === 'en' ? 'Still learning' : 'Tekrar çalışacağım'}
                </button>
                <button type="button" className="btn btn--primary" onClick={() => nextCard(true)}>
                  {language === 'en' ? 'Got it →' : 'Anladım →'}
                </button>
              </>
            )}
          </div>
        </article>

        <aside className="vocab-panel">
          <div>
            <span>{language === 'en' ? 'Cards' : 'Kart'}</span>
            <strong>{vocabulary.length}</strong>
          </div>
          <div>
            <span>{language === 'en' ? 'Seen' : 'Görülen'}</span>
            <strong>{seen}</strong>
          </div>
          <div>
            <span>{language === 'en' ? 'Known' : 'Bilinen'}</span>
            <strong>{known}</strong>
          </div>
          <button
            type="button"
            className="vocab-panel__shuffle"
            onClick={() => {
              setQueue(shuffle(vocabulary))
              setIndex(0)
              setRevealed(false)
            }}
          >
            {language === 'en' ? 'Shuffle again' : 'Yeniden karıştır'}
          </button>
        </aside>
      </section>
    </div>
  )
}

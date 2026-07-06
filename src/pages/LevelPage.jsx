import { Link, useParams } from 'react-router-dom'
import { getLevel } from '../data/levels'
import { getTopicsByLevel, isLevelReady } from '../data'
import { getVocabularyCount, TARGET_PER_LEVEL } from '../data/vocabulary'
import { useProgress } from '../context/ProgressContext'
import { useLanguage } from '../context/LanguageContext'
import { localizeLevel, localizeTopics } from '../i18n/content'
import LessonCard from '../components/LessonCard'
import './LevelPage.css'

export default function LevelPage() {
  const { id } = useParams()
  const rawLevel = getLevel(id)
  const { completed } = useProgress()
  const { language, t } = useLanguage()
  const rawTopics = getTopicsByLevel(id)
  const vocabularyCount = getVocabularyCount(id)
  const level = localizeLevel(rawLevel, language)
  const topics = localizeTopics(rawTopics, language)

  if (!rawLevel || !isLevelReady(id)) {
    return (
      <div className="container level-page__missing">
        <h1>{language === 'en' ? 'Level not found' : 'Seviye bulunamadı'}</h1>
        <Link to="/seviyeler" className="btn btn--primary">
          {language === 'en' ? 'Back to levels' : 'Seviyelere dön'}
        </Link>
      </div>
    )
  }

  const doneCount = rawTopics.filter((topic) => completed[topic.id]).length
  const totalExamples = rawTopics.reduce(
    (n, t) => n + t.sections.reduce((m, s) => m + s.examples.length, 0),
    0
  )

  return (
    <div className="level-page">
      <header className="level-hero">
        <div className="container level-hero__inner">
          <Link to="/seviyeler" className="level-hero__back">
            ← {t('navLevels')}
          </Link>
          <div className="level-hero__main">
            <span className="level-hero__code">{level.code}</span>
            <div>
              <span className="eyebrow">{level.tag}</span>
              <h1>{level.name}</h1>
              <p className="level-hero__desc">{level.description}</p>
            </div>
          </div>

          <div className="level-hero__stats">
            <span>
              <strong>{topics.length}</strong> {t('topics')}
            </span>
            <span>
              <strong>{totalExamples}+</strong> {t('examples')}
            </span>
            <span>
              <strong>
                {doneCount}/{topics.length}
              </strong>{' '}
              {t('completed').toLocaleLowerCase(language === 'tr' ? 'tr-TR' : 'en-US')}
            </span>
          </div>

          <Link to={`/test?level=${level.id}`} className="btn btn--primary level-hero__test">
            {language === 'en' ? `Take ${level.code} Mixed Test →` : `${level.code} Karışık Testini Çöz →`}
          </Link>
        </div>
      </header>

      <section className="container level-page__vocabulary" aria-labelledby="level-vocabulary-title">
        <div className="level-vocab-card">
          <div className="level-vocab-card__copy">
            <span className="eyebrow">{language === 'en' ? 'Vocabulary' : 'Kelimeler'}</span>
            <h2 id="level-vocabulary-title">
              {language === 'en' ? `${level.code} Word Practice` : `${level.code} Kelime Çalış`}
            </h2>
            <p>
              {vocabularyCount
                ? language === 'en'
                  ? `${vocabularyCount} B2 words and phrases with Turkish meanings and example sentences. Study random cards and reveal the answer when you are unsure.`
                  : `${vocabularyCount} kelime ve söz kalıbı; anlamı ve cümle içinde kullanımıyla. Rastgele kart çalış, bilemediğinde cevabı aç.`
                : language === 'en'
                ? `The target is ${TARGET_PER_LEVEL} words and phrases for this level. This bank will be added soon.`
                : `Bu seviye için hedef ${TARGET_PER_LEVEL} kelime ve söz kalıbı. Bu banka yakında eklenecek.`}
            </p>
          </div>
          <div className="level-vocab-card__side">
            <strong>{vocabularyCount || TARGET_PER_LEVEL}</strong>
            <span>{language === 'en' ? (vocabularyCount ? 'cards ready' : 'target cards') : vocabularyCount ? 'kart hazır' : 'hedef kart'}</span>
            {vocabularyCount ? (
              <Link to={`/kelimeler/${level.id}`} className="btn btn--primary">
                {language === 'en' ? 'Study Words →' : 'Kelime Çalış →'}
              </Link>
            ) : (
              <span className="level-vocab-card__soon">{t('soon')}</span>
            )}
          </div>
        </div>
      </section>

      <section className="container level-page__topics">
        <div className="lesson-grid">
          {topics.map((topic, i) => (
            <LessonCard key={topic.id} lesson={topic} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}

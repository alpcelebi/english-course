import { Link } from 'react-router-dom'
import { levels } from '../data/levels'
import { getTopicsByLevel, isLevelReady } from '../data'
import { useLanguage } from '../context/LanguageContext'
import { localizeLevel, localizeTopics } from '../i18n/content'
import LessonCard from '../components/LessonCard'
import './LessonsList.css'

export default function LessonsList() {
  const readyLevels = levels.filter((l) => l.active && isLevelReady(l.id))
  const { language } = useLanguage()

  return (
    <div className="container lessons-list">
      <header className="lessons-list__head">
        <span className="eyebrow">{language === 'en' ? 'Curriculum' : 'Müfredat'}</span>
        <h1>{language === 'en' ? 'All Topics' : 'Tüm Konular'}</h1>
        <p>
          {language === 'en'
            ? 'Each unit starts with grammar explanations and natural examples, then reinforces the topic with an interactive quiz.'
            : 'Her ünite, kavram açıklamaları ve bol örnek cümleyle başlar; sonunda interaktif bir quiz ile pekiştirirsin.'}
        </p>
      </header>

      {readyLevels.map((rawLevel) => {
        const level = localizeLevel(rawLevel, language)
        const topics = localizeTopics(getTopicsByLevel(rawLevel.id), language)
        return (
          <section key={rawLevel.id} className="lessons-list__level">
            <div className="lessons-list__levelhead">
              <span className="lessons-list__code">{level.code}</span>
              <div>
                <h2>{level.name}</h2>
                <span className="lessons-list__tag">{level.tag}</span>
              </div>
              <Link to={`/seviye/${rawLevel.id}`} className="lessons-list__more">
                {language === 'en' ? 'Level page →' : 'Seviye sayfası →'}
              </Link>
            </div>
            <div className="lesson-grid">
              {topics.map((topic, i) => (
                <LessonCard key={topic.id} lesson={topic} index={i} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

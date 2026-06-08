import { useLanguage } from '../context/LanguageContext'
import './LanguageToggle.css'

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()
  const isEnglish = language === 'en'

  return (
    <button
      type="button"
      className="language-toggle"
      onClick={toggleLanguage}
      aria-label={isEnglish ? 'Switch to Turkish' : 'İngilizce dile geç'}
      title={isEnglish ? 'Turkish' : 'English'}
    >
      <span className={isEnglish ? 'is-active' : ''}>EN</span>
      <span className={!isEnglish ? 'is-active' : ''}>TR</span>
    </button>
  )
}

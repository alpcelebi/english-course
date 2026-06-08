import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import './ThemeToggle.css'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()
  const isDark = theme === 'dark'

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? t('toLightTheme') : t('toDarkTheme')}
      title={isDark ? t('themeLight') : t('themeDark')}
    >
      <span className={`tt-track ${isDark ? 'is-dark' : ''}`}>
        <span className="tt-thumb">{isDark ? '☾' : '☀'}</span>
      </span>
    </button>
  )
}

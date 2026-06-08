import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'
import TopicSearch from './TopicSearch'
import { useLanguage } from '../context/LanguageContext'
import './Header.css'

const NAV = [
  { to: '/', labelKey: 'navHome', end: true },
  { to: '/seviyeler', labelKey: 'navLevels' },
  { to: '/test', labelKey: 'navTest' },
  { to: '/yanlislar', labelKey: 'navMistakes' },
  { to: '/ilerleme', labelKey: 'navProgress' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navRef = useRef(null)
  const { language, t } = useLanguage()

  // Close the dropdown whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Close on Escape and on clicks outside the nav cluster.
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    function onClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onClick)
    }
  }, [open])

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link
          to="/"
          className="brand"
          aria-label={language === 'en' ? 'Lingua home' : 'Lingua ana sayfa'}
        >
          <span className="brand__mark">Li</span>
          <span className="brand__text">
            Lingua
            <em>{t('brandSub')}</em>
          </span>
        </Link>

        <div className="site-header__actions" ref={navRef}>
          <TopicSearch className="topic-search--desktop" />

          <nav
            id="primary-nav"
            className={`site-nav ${open ? 'is-open' : ''}`}
            aria-label={t('navAria')}
          >
            <TopicSearch className="topic-search--mobile" />

            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className="site-nav__link"
                onClick={() => setOpen(false)}
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
          </nav>

          <LanguageToggle />
          <ThemeToggle />

          <button
            type="button"
            className={`nav-toggle ${open ? 'is-open' : ''}`}
            aria-label={open ? t('menuClose') : t('menuOpen')}
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="nav-toggle__bar" />
            <span className="nav-toggle__bar" />
            <span className="nav-toggle__bar" />
          </button>
        </div>
      </div>
    </header>
  )
}

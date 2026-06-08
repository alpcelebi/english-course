import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { allTopics, levels } from '../data'
import { useLanguage } from '../context/LanguageContext'
import { localizeLevel, localizeTopic } from '../i18n/content'
import './TopicSearch.css'

const MIN_QUERY_LENGTH = 2
const MAX_RESULTS = 6
const SEARCH_ALIASES = [
  {
    match: ['conditional', 'koşul', 'kosul', 'unless', 'as long as', 'wish', 'if only'],
    keywords:
      'if clause if clauses conditional clause conditional clauses conditional sentence conditionals kosul cumleleri',
  },
  {
    match: ['passive', 'edilgen'],
    keywords: 'passive voice passive form edilgen cati',
  },
  {
    match: ['reported', 'dolaylı', 'dolayli', 'indirect'],
    keywords: 'reported speech indirect speech dolayli anlatim',
  },
  {
    match: ['relative', 'who', 'which'],
    keywords: 'relative clause relative clauses adjective clause ilgi cumlecigi',
  },
  {
    match: ['modal', 'can', 'could', 'should', 'must', 'may', 'might'],
    keywords: 'modals modal verbs yardımcı fiiller yardimci fiiller',
  },
  {
    match: ['gerund', 'infinitive'],
    keywords: 'verb patterns ing to gerund infinitive',
  },
  {
    match: ['present simple', 'geniş', 'genis'],
    keywords: 'simple present genis zaman present simple',
  },
  {
    match: ['present continuous', 'şimdiki', 'simdiki'],
    keywords: 'present progressive simdiki zaman present continuous',
  },
  {
    match: ['past simple', 'geçmiş', 'gecmis'],
    keywords: 'simple past past tense gecmis zaman',
  },
  {
    match: ['present perfect'],
    keywords: 'perfect tense have has v3 present perfect',
  },
]

function normalizeSearch(value) {
  return String(value)
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
}

const normalizedAliases = SEARCH_ALIASES.map((group) => ({
  ...group,
  match: group.match.map(normalizeSearch),
}))

function aliasKeywordsFor(normalizedText) {
  return normalizedAliases
    .filter((group) => group.match.some((term) => normalizedText.includes(term)))
    .map((group) => group.keywords)
    .join(' ')
}

export default function TopicSearch({ className = '' }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { language, t } = useLanguage()

  const searchIndex = useMemo(() => {
    const levelById = new Map(
      levels.map((level) => [level.id, localizeLevel(level, language)])
    )

    return allTopics.map((topic) => {
      const localizedTopic = localizeTopic(topic, language)
      const level = levelById.get(localizedTopic.level)
      const levelLabel = level ? `${level.code} ${level.name} ${level.tag}` : topic.level

      const baseText = [
        localizedTopic.title,
        localizedTopic.subtitle,
        localizedTopic.summary,
        localizedTopic.keywords?.join(' '),
        levelLabel,
        localizedTopic.sections?.map((section) => `${section.heading} ${section.subheading}`).join(' '),
      ].join(' ')
      const normalizedBaseText = normalizeSearch(baseText)

      return {
        ...localizedTopic,
        levelCode: level?.code ?? localizedTopic.level.toUpperCase(),
        searchable: normalizeSearch(
          `${baseText} ${aliasKeywordsFor(normalizedBaseText)}`
        ),
      }
    })
  }, [language])

  const results = useMemo(() => {
    const normalizedQuery = normalizeSearch(query.trim())
    if (normalizedQuery.length < MIN_QUERY_LENGTH) return []

    return searchIndex
      .filter((topic) => topic.searchable.includes(normalizedQuery))
      .slice(0, MAX_RESULTS)
  }, [query, searchIndex])

  useEffect(() => {
    setQuery('')
    setOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    function onPointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      setOpen(false)
      return
    }

    if (event.key === 'Enter' && results[0]) {
      event.preventDefault()
      navigate(`/ders/${results[0].id}`)
      setQuery('')
      setOpen(false)
    }
  }

  const showPanel = open && query.trim().length >= MIN_QUERY_LENGTH

  return (
    <div ref={rootRef} className={`topic-search ${className}`}>
      <label className="topic-search__box">
        <span className="topic-search__icon" aria-hidden>
          ⌕
        </span>
        <input
          type="search"
          value={query}
          placeholder={t('searchPlaceholder')}
          aria-label={t('searchAria')}
          autoComplete="off"
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            type="button"
            className="topic-search__clear"
            aria-label={t('clearSearch')}
            onClick={() => {
              setQuery('')
              setOpen(false)
            }}
          >
            ×
          </button>
        )}
      </label>

      {showPanel && (
        <div className="topic-search__panel" role="listbox" aria-label={t('searchResults')}>
          {results.length ? (
            results.map((topic) => (
              <Link
                key={topic.id}
                to={`/ders/${topic.id}`}
                className="topic-search__result"
                role="option"
              >
                <span className="topic-search__meta">{topic.levelCode} · {t('unit')} {topic.order}</span>
                <strong>{topic.title}</strong>
                <span>{topic.subtitle}</span>
              </Link>
            ))
          ) : (
            <div className="topic-search__empty">{t('noTopicFound')}</div>
          )}
        </div>
      )}
    </div>
  )
}

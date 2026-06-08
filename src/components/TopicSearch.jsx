import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { allTopics, levels } from '../data'
import './TopicSearch.css'

const MIN_QUERY_LENGTH = 2
const MAX_RESULTS = 6

function normalizeSearch(value) {
  return String(value)
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
}

export default function TopicSearch({ className = '' }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  const searchIndex = useMemo(() => {
    const levelById = new Map(levels.map((level) => [level.id, level]))

    return allTopics.map((topic) => {
      const level = levelById.get(topic.level)
      const levelLabel = level ? `${level.code} ${level.name} ${level.tag}` : topic.level

      return {
        ...topic,
        levelCode: level?.code ?? topic.level.toUpperCase(),
        searchable: normalizeSearch(
          [
            topic.title,
            topic.subtitle,
            topic.summary,
            levelLabel,
            topic.sections?.map((section) => `${section.heading} ${section.subheading}`).join(' '),
          ].join(' ')
        ),
      }
    })
  }, [])

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
          placeholder="Konu ara"
          aria-label="Konu ara"
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
            aria-label="Aramayı temizle"
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
        <div className="topic-search__panel" role="listbox" aria-label="Arama sonuçları">
          {results.length ? (
            results.map((topic) => (
              <Link
                key={topic.id}
                to={`/ders/${topic.id}`}
                className="topic-search__result"
                role="option"
              >
                <span className="topic-search__meta">{topic.levelCode} · Ünite {topic.order}</span>
                <strong>{topic.title}</strong>
                <span>{topic.subtitle}</span>
              </Link>
            ))
          ) : (
            <div className="topic-search__empty">Konu bulunamadı</div>
          )}
        </div>
      )}
    </div>
  )
}

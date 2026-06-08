import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { query, execute } from '../db/database'

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const [completed, setCompleted] = useState({}) // lessonId -> true
  const [bestScores, setBestScores] = useState({}) // topicId -> { score, total }
  const [ready, setReady] = useState(false)

  // Load existing progress from SQLite on mount.
  useEffect(() => {
    let active = true
    ;(async () => {
      const progressRows = await query('SELECT lesson_id, completed FROM lesson_progress')
      const scoreRows = await query(
        `SELECT topic_id, MAX(score) AS score, total
         FROM quiz_results GROUP BY topic_id`
      )
      if (!active) return

      const c = {}
      for (const r of progressRows) if (r.completed) c[r.lesson_id] = true

      const s = {}
      for (const r of scoreRows) s[r.topic_id] = { score: r.score, total: r.total }

      setCompleted(c)
      setBestScores(s)
      setReady(true)
    })()
    return () => {
      active = false
    }
  }, [])

  const markLessonViewed = useCallback(async (lessonId) => {
    const now = new Date().toISOString()
    await execute(
      `INSERT INTO lesson_progress (lesson_id, completed, last_viewed)
       VALUES (?, 0, ?)
       ON CONFLICT(lesson_id) DO UPDATE SET last_viewed = excluded.last_viewed`,
      [lessonId, now]
    )
  }, [])

  const markLessonCompleted = useCallback(async (lessonId) => {
    const now = new Date().toISOString()
    await execute(
      `INSERT INTO lesson_progress (lesson_id, completed, last_viewed)
       VALUES (?, 1, ?)
       ON CONFLICT(lesson_id) DO UPDATE SET completed = 1, last_viewed = excluded.last_viewed`,
      [lessonId, now]
    )
    setCompleted((prev) => ({ ...prev, [lessonId]: true }))
  }, [])

  const saveQuizResult = useCallback(async (topicId, score, total) => {
    const now = new Date().toISOString()
    await execute(
      `INSERT INTO quiz_results (topic_id, score, total, taken_at) VALUES (?, ?, ?, ?)`,
      [topicId, score, total, now]
    )
    setBestScores((prev) => {
      const prevBest = prev[topicId]?.score ?? -1
      if (score > prevBest) return { ...prev, [topicId]: { score, total } }
      return prev
    })
  }, [])

  const resetProgress = useCallback(async () => {
    await execute('DELETE FROM lesson_progress')
    await execute('DELETE FROM quiz_results')
    setCompleted({})
    setBestScores({})
  }, [])

  return (
    <ProgressContext.Provider
      value={{
        ready,
        completed,
        bestScores,
        markLessonViewed,
        markLessonCompleted,
        saveQuizResult,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}

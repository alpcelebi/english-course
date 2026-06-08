import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { query, execute } from '../db/database'

const ProgressContext = createContext(null)

function mapMistakeRows(rows) {
  return rows.map((row) => ({
    id: row.id,
    topicId: row.topic_id,
    questionKey: row.question_key,
    prompt: row.prompt,
    selectedAnswer: row.selected_answer,
    correctAnswer: row.correct_answer,
    explanation: row.explanation,
    sourceTitle: row.source_title,
    lastWrongAt: row.last_wrong_at,
    attempts: row.attempts,
  }))
}

async function loadActiveMistakes() {
  const rows = await query(
    `SELECT id, topic_id, question_key, prompt, selected_answer, correct_answer,
            explanation, source_title, last_wrong_at, attempts
     FROM quiz_mistakes
     WHERE resolved = 0
     ORDER BY last_wrong_at DESC`
  )

  return mapMistakeRows(rows)
}

export function ProgressProvider({ children }) {
  const [completed, setCompleted] = useState({}) // lessonId -> true
  const [bestScores, setBestScores] = useState({}) // topicId -> { score, total }
  const [mistakes, setMistakes] = useState([])
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
      const mistakeRows = await loadActiveMistakes()
      if (!active) return

      const c = {}
      for (const r of progressRows) if (r.completed) c[r.lesson_id] = true

      const s = {}
      for (const r of scoreRows) s[r.topic_id] = { score: r.score, total: r.total }

      setCompleted(c)
      setBestScores(s)
      setMistakes(mistakeRows)
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

  const saveQuizResult = useCallback(async (topicId, score, total, answers = []) => {
    const now = new Date().toISOString()
    await execute(
      `INSERT INTO quiz_results (topic_id, score, total, taken_at) VALUES (?, ?, ?, ?)`,
      [topicId, score, total, now]
    )

    for (const answer of answers) {
      if (!answer?.questionKey) continue

      const sourceTopicId = answer.sourceTopicId || topicId

      if (answer.correct) {
        await execute(
          `UPDATE quiz_mistakes
           SET resolved = 1
           WHERE topic_id = ? AND question_key = ?`,
          [sourceTopicId, answer.questionKey]
        )
        continue
      }

      await execute(
        `INSERT INTO quiz_mistakes (
          topic_id, question_key, prompt, selected_answer, correct_answer,
          explanation, source_title, last_wrong_at, attempts, resolved
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 0)
        ON CONFLICT(topic_id, question_key) DO UPDATE SET
          prompt = excluded.prompt,
          selected_answer = excluded.selected_answer,
          correct_answer = excluded.correct_answer,
          explanation = excluded.explanation,
          source_title = excluded.source_title,
          last_wrong_at = excluded.last_wrong_at,
          attempts = quiz_mistakes.attempts + 1,
          resolved = 0`,
        [
          sourceTopicId,
          answer.questionKey,
          answer.prompt,
          answer.selectedAnswer,
          answer.correctAnswer,
          answer.explanation ?? null,
          answer.sourceTitle ?? null,
          now,
        ]
      )
    }

    setBestScores((prev) => {
      const prevBest = prev[topicId]?.score ?? -1
      if (score > prevBest) return { ...prev, [topicId]: { score, total } }
      return prev
    })

    if (answers.length) setMistakes(await loadActiveMistakes())
  }, [])

  const resetProgress = useCallback(async () => {
    await execute('DELETE FROM lesson_progress')
    await execute('DELETE FROM quiz_results')
    await execute('DELETE FROM quiz_mistakes')
    setCompleted({})
    setBestScores({})
    setMistakes([])
  }, [])

  const clearMistake = useCallback(async (topicId, questionKey) => {
    await execute(
      `UPDATE quiz_mistakes
       SET resolved = 1
       WHERE topic_id = ? AND question_key = ?`,
      [topicId, questionKey]
    )
    setMistakes((prev) =>
      prev.filter((m) => m.topicId !== topicId || m.questionKey !== questionKey)
    )
  }, [])

  const clearAllMistakes = useCallback(async () => {
    await execute('UPDATE quiz_mistakes SET resolved = 1 WHERE resolved = 0')
    setMistakes([])
  }, [])

  return (
    <ProgressContext.Provider
      value={{
        ready,
        completed,
        bestScores,
        mistakes,
        markLessonViewed,
        markLessonCompleted,
        saveQuizResult,
        resetProgress,
        clearMistake,
        clearAllMistakes,
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

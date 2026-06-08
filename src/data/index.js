/**
 * Curriculum aggregator. Bundles every authored level into one place and exposes
 * lookup helpers used across the app. Each topic carries its own lesson content,
 * a 10-question `quiz` (paired with the lesson) and a distinct 10-question `test`
 * bank used by the separate Test section.
 */
import { levels, getLevel } from './levels'
import a1 from './curriculum/a1'
import a2 from './curriculum/a2'
import b1 from './curriculum/b1'
import b2 from './curriculum/b2'
import c1 from './curriculum/c1'
import c2 from './curriculum/c2'
import extra from './curriculum/extra'

const byLevel = {
  a1: [...a1, ...extra.a1],
  a2: [...a2, ...extra.a2],
  b1: [...b1, ...extra.b1],
  b2: [...b2, ...extra.b2],
  c1: [...c1, ...extra.c1],
  c2: [...c2, ...extra.c2],
}

export const getTopicTestQuestions = (topic) => {
  if (!topic) return []
  return topic.test?.length ? topic.test : topic.quiz ?? []
}

const placementQuotas = {
  a1: 4,
  a2: 4,
  b1: 4,
  b2: 4,
  c1: 2,
  c2: 2,
}

function withQuestionSource(question, topic) {
  const level = getLevel(topic.level)

  return {
    ...question,
    topicId: topic.id,
    topicTitle: topic.title,
    levelId: topic.level,
    levelCode: level?.code ?? topic.level.toUpperCase(),
  }
}

function takeDistributedQuestions(topics, quota) {
  const selected = []
  let questionOffset = 0

  while (selected.length < quota && questionOffset < 10) {
    for (const topic of topics) {
      const question = getTopicTestQuestions(topic)[questionOffset]
      if (question) selected.push(withQuestionSource(question, topic))
      if (selected.length === quota) break
    }
    questionOffset += 1
  }

  return selected
}

/** Flat list of every authored topic, in level → order sequence. */
export const allTopics = levels
  .filter((l) => byLevel[l.id])
  .flatMap((l) => byLevel[l.id])

/** Topics for a single level, ordered. */
export const getTopicsByLevel = (levelId) => byLevel[levelId] ?? []

/** Whether a level has authored content yet. */
export const isLevelReady = (levelId) => Boolean(byLevel[levelId])

/** Full topic record (lesson + quiz + test) by id. */
export const getTopic = (id) => allTopics.find((t) => t.id === id)

/** Backwards-compatible alias — a topic *is* a lesson. */
export const getLesson = getTopic

/** Quiz questions paired with a lesson. */
export const getQuiz = (id) => getTopic(id)?.quiz ?? []

/** Distinct test-bank questions for a topic. */
export const getTest = (id) => getTopicTestQuestions(getTopic(id))

/** Sibling topics within the same level (for prev/next navigation). */
export const getLevelSiblings = (id) => {
  const topic = getTopic(id)
  if (!topic) return []
  return getTopicsByLevel(topic.level)
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * A mixed test for a whole level: pulls every topic's test bank, tags each
 * question with its source topic, shuffles, and returns up to `limit` items.
 */
export const getLevelMixedTest = (levelId, limit = 20) => {
  const pool = getTopicsByLevel(levelId).flatMap((t) =>
    getTopicTestQuestions(t).map((q) => withQuestionSource(q, t))
  )
  return shuffle(pool).slice(0, limit)
}

export const getPlacementTestQuestions = () =>
  levels
    .filter((l) => l.active && byLevel[l.id])
    .flatMap((level) =>
      takeDistributedQuestions(byLevel[level.id], placementQuotas[level.id] ?? 3)
    )
    .slice(0, 20)

export const getPlacementRecommendation = (score, total = 20) => {
  const pct = total ? score / total : 0
  const recommendedId =
    pct <= 0.25
      ? 'a1'
      : pct <= 0.4
      ? 'a2'
      : pct <= 0.6
      ? 'b1'
      : pct <= 0.75
      ? 'b2'
      : pct <= 0.9
      ? 'c1'
      : 'c2'

  const level = getLevel(recommendedId)

  return {
    level,
    title: `${level.code} ${level.name}`,
    path: `/seviye/${level.id}`,
  }
}

export { levels, getLevel }

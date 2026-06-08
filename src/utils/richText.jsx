import { Fragment } from 'react'

// Renders a lightweight markup string: **bold** and ~~strikethrough~~.
export function RichText({ text }) {
  const tokens = text.split(/(\*\*[^*]+\*\*|~~[^~]+~~)/g)
  return (
    <>
      {tokens.map((tok, i) => {
        if (tok.startsWith('**') && tok.endsWith('**')) {
          return <strong key={i} className="rt-strong">{tok.slice(2, -2)}</strong>
        }
        if (tok.startsWith('~~') && tok.endsWith('~~')) {
          return <s key={i} className="rt-strike">{tok.slice(2, -2)}</s>
        }
        return <Fragment key={i}>{tok}</Fragment>
      })}
    </>
  )
}

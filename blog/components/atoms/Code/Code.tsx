import React from 'react'
import {Marker, Refractor, registerLanguage} from 'react-refractor'
import js from 'refractor/lang/javascript'

registerLanguage(js)

export function Code(props: { language: string; code: string; highlightedLines: (number | Marker)[] | undefined }) {
  return (
    <Refractor
      language={props.language}
      value={props.code}
    />
  )
}
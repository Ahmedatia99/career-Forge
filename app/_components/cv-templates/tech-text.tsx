"use client"

import { parseTextWithTechKeywords } from "@/lib/tech-keywords"

interface TechTextProps {
  text: string
  className?: string
}

export function TechText({ text, className }: TechTextProps) {
  const segments = parseTextWithTechKeywords(text)

  return (
    <span className={className}>
      {segments.map((segment, index) =>
        segment.isTech ? (
          <strong key={index} className="font-bold">
            {segment.text}
          </strong>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </span>
  )
}

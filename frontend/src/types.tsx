export interface ScoreBreakdown {
  code_quality: number
  documentation: number
  tests: number
}

export interface Score {
  overall: number
  rank: string
  breakdown: ScoreBreakdown
}

export interface Roadmap {
  immediate: string[]
  short_term: string[]
  long_term: string[]
}

export interface ApiResponse {
  score: Score
  summary: string
  roadmap: Roadmap
}
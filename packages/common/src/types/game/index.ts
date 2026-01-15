export type Player = {
  id: string
  clientId: string
  connected: boolean
  username: string
  points: number
}

export type Answer = {
  playerId: string
  answerId: number
  points: number
}

export type TextAnswer = {
  playerId: string
  answer: string
  points: number
}

export type Quizz = {
  subject: string
  type?: "multiple-choice" | "spelling"
  questions: {
    question: string
    image?: string
    answers?: string[]
    solution: number | string
    cooldown: number
    time: number
    // Spelling quiz specific fields
    audio?: string
  }[]
}

export type QuizzWithId = Quizz & { id: string }

export type GameUpdateQuestion = {
  current: number
  total: number
}

"use client"

import { CommonStatusDataMap } from "@rahoot/common/types/game/status"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/stores/player"
import { SFX_ANSWERS_MUSIC, SFX_ANSWERS_SOUND } from "@rahoot/web/utils/constants"
import clsx from "clsx"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import useSound from "use-sound"

type Props = {
  data: CommonStatusDataMap["TYPE_ANSWER"]
}

const TypeAnswer = ({
  data: { question, audio, time, totalPlayer, wordLength },
}: Props) => {
  const { gameId }: { gameId?: string } = useParams()
  const { socket } = useSocket()
  const { player } = usePlayerStore()

  const [cooldown, setCooldown] = useState(time)
  const [totalAnswer, setTotalAnswer] = useState(0)
  const [currentWord, setCurrentWord] = useState("")
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false)
  const [correctAnswer, setCorrectAnswer] = useState("")

  // Use actual word length from server
  const letterBoxes = Array(wordLength).fill("")

  const [sfxPop] = useSound(SFX_ANSWERS_SOUND, {
    volume: 0.1,
  })

  const [playMusic, { stop: stopMusic }] = useSound(SFX_ANSWERS_MUSIC, {
    volume: 0.2,
    interrupt: true,
    loop: true,
  })

  const [playAudio] = useSound(audio || "", {
    volume: 0.8,
  })

  // Virtual keyboard layout
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['⌫', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '✓']
  ]

  const handleKeyPress = (key: string) => {
    if (hasSubmitted) return
    
    if (key === '⌫') {
      setCurrentWord(prev => prev.slice(0, -1))
    } else if (key === '✓') {
      handleSubmit()
    } else if (currentWord.length < wordLength) {
      setCurrentWord(prev => prev + key.toLowerCase())
    }
  }

  const handleSubmit = () => {
    if (!player || hasSubmitted || !currentWord.trim()) {
      return
    }

    socket?.emit("player:typedAnswer", {
      gameId,
      data: {
        answer: currentWord.trim().toLowerCase(),
      },
    })
    
    setHasSubmitted(true)
    sfxPop()
  }

  const playWordAudio = () => {
    if (audio && audio.startsWith('/sounds/')) {
      // Try to play local audio file
      playAudio()
    } else {
      // Use online text-to-speech for the word
      const wordToSpeak = audio || correctAnswer || "word"
      playTextToSpeech(wordToSpeak)
    }
  }

  // Text-to-speech function using Web Speech API
  const playTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8 // Slightly slower for clarity
      utterance.pitch = 1.0
      utterance.volume = 0.8
      
      // Try to use a clear English voice
      const voices = window.speechSynthesis.getVoices()
      const englishVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.name.includes('Google')
      ) || voices.find(voice => voice.lang.startsWith('en'))
      
      if (englishVoice) {
        utterance.voice = englishVoice
      }
      
      window.speechSynthesis.speak(utterance)
    } else {
      // Fallback: try online TTS service
      playOnlineTTS(text)
    }
  }

  // Fallback to online TTS service
  const playOnlineTTS = (text: string) => {
    // Use Google Translate TTS as fallback
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(text)}`
    const audio = new Audio(audioUrl)
    audio.volume = 0.8
    audio.play().catch(error => {
      console.warn('Online TTS failed:', error)
      // Could add more fallback services here
    })
  }

  useEffect(() => {
    playMusic()

    return () => {
      stopMusic()
    }
  }, [playMusic, stopMusic])

  useEvent("game:cooldown", (sec) => {
    setCooldown(sec)
  })

  useEvent("game:playerAnswer", (count) => {
    setTotalAnswer(count)
    sfxPop()
  })

  // Listen for correct answer reveal (you'll need to add this event)
  useEvent("game:showCorrectAnswer", (answer) => {
    setCorrectAnswer(answer)
    setShowCorrectAnswer(true)
  })

  return (
    <div className="flex h-full flex-1 flex-col justify-between">
      <div className="mx-auto inline-flex h-full w-full max-w-7xl flex-1 flex-col items-center justify-center gap-5">
        {/* Question/Hint */}
        <h2 className="text-center text-2xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
          {question}
        </h2>

        {/* Audio Button */}
        {audio && (
          <button
            onClick={playWordAudio}
            className="shadow-inset bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-xl transition-colors"
          >
            🔊 Play Word
          </button>
        )}

        {/* Letter Boxes */}
        <div className="flex gap-2 mb-6">
          {letterBoxes.map((_, index) => (
            <div
              key={index}
              className={clsx(
                "shadow-inset w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center text-2xl md:text-3xl font-bold transition-colors",
                {
                  "bg-white text-black": !showCorrectAnswer,
                  "bg-green-500 text-white": showCorrectAnswer && correctAnswer[index],
                  "bg-red-500 text-white": showCorrectAnswer && !correctAnswer[index] && currentWord[index],
                }
              )}
            >
              {showCorrectAnswer 
                ? correctAnswer[index]?.toUpperCase() || ""
                : currentWord[index]?.toUpperCase() || ""
              }
            </div>
          ))}
        </div>

        {/* Show correct answer message */}
        {showCorrectAnswer && (
          <div className="text-center">
            <p className="text-xl font-semibold text-yellow-300 bg-black/40 px-4 py-2 rounded-lg">
              Correct Answer: {correctAnswer.toUpperCase()}
            </p>
          </div>
        )}

        {/* Virtual Keyboard */}
        <div className="w-full max-w-2xl">
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1 mb-2">
              {row.map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  disabled={hasSubmitted || (key === '✓' && !currentWord.trim())}
                  className={clsx(
                    "shadow-inset px-3 py-2 md:px-4 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-colors",
                    "min-w-[40px] md:min-w-[50px]",
                    {
                      // Delete button styling (red)
                      "bg-red-500 hover:bg-red-600 text-white": key === '⌫',
                      // Submit button styling (green)
                      "bg-green-500 hover:bg-green-600 text-white": key === '✓',
                      // Regular letter keys (white)
                      "bg-white hover:bg-gray-200 text-black": key !== '⌫' && key !== '✓',
                      // Disabled state
                      "bg-gray-400 cursor-not-allowed": hasSubmitted || (key === '✓' && !currentWord.trim())
                    }
                  )}
                >
                  {key === '✓' ? (hasSubmitted ? '✓' : '✓') : key}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div>
        <div className="mx-auto mb-4 flex w-full max-w-7xl justify-between gap-1 px-2 text-lg font-bold text-white md:text-xl">
          <div className="flex flex-col items-center rounded-full bg-black/40 px-4 text-lg font-bold">
            <span className="translate-y-1 text-sm">Time</span>
            <span>{cooldown}</span>
          </div>
          <div className="flex flex-col items-center rounded-full bg-black/40 px-4 text-lg font-bold">
            <span className="translate-y-1 text-sm">Answers</span>
            <span>
              {totalAnswer}/{totalPlayer}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TypeAnswer
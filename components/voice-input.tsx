"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, MicOff, Loader2, Volume2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface VoiceInputProps {
  onTranscript: (text: string) => void
  placeholder?: string
  language?: string
}

export function VoiceInput({
  onTranscript,
  placeholder = "Press the microphone to speak...",
  language = "en-IN",
}: VoiceInputProps) {
  const { toast } = useToast()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeechSupported, setIsSpeechSupported] = useState(true)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check if SpeechRecognition is supported
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setIsSpeechSupported(false)
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support voice input. Please try using a different browser like Chrome.",
        variant: "destructive",
      })
      return
    }

    // Initialize speech recognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = language

    recognitionRef.current.onresult = (event: any) => {
      const current = event.resultIndex
      const result = event.results[current]
      const transcriptText = result[0].transcript

      setTranscript(transcriptText)
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error", event.error)
      if (event.error === "not-allowed") {
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access to use voice input.",
          variant: "destructive",
        })
      }
      stopListening()
    }

    recognitionRef.current.onend = () => {
      if (isListening) {
        recognitionRef.current.start()
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [language, toast, isListening])

  const toggleListening = () => {
    if (!isSpeechSupported) return

    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const startListening = () => {
    setTranscript("")
    setIsListening(true)
    recognitionRef.current.start()

    toast({
      title: "Listening...",
      description: "Speak clearly into your microphone.",
      variant: "default",
    })
  }

  const stopListening = () => {
    setIsListening(false)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const handleSubmit = () => {
    if (!transcript.trim()) return

    setIsProcessing(true)

    // Process the transcript
    setTimeout(() => {
      onTranscript(transcript)
      setTranscript("")
      setIsProcessing(false)
    }, 1000)
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language
      window.speechSynthesis.speak(utterance)
    } else {
      toast({
        title: "Text-to-speech not supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="p-4 flex flex-col items-center">
      <div className="w-full flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <div
            className={`min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${isListening ? "border-primary" : ""}`}
          >
            {transcript ? <p>{transcript}</p> : <p className="text-muted-foreground">{placeholder}</p>}
            {isListening && (
              <div className="absolute right-3 bottom-3 flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-pulse"
                  style={{ animationDelay: "300ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-pulse"
                  style={{ animationDelay: "600ms" }}
                ></div>
              </div>
            )}
          </div>
        </div>

        <Button
          variant={isListening ? "destructive" : "default"}
          size="icon"
          onClick={toggleListening}
          disabled={!isSpeechSupported || isProcessing}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>

        {transcript && (
          <Button variant="outline" size="icon" onClick={() => speakText(transcript)} disabled={isProcessing}>
            <Volume2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Button className="w-full" onClick={handleSubmit} disabled={!transcript.trim() || isProcessing}>
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Submit"
        )}
      </Button>
    </Card>
  )
}

"use client";

import { useEffect, useState } from "react";

interface VoiceWaveformProps {
    onTranscript: (text: string) => void;
    disabled: boolean;
}

const Speak = ({ onTranscript, disabled }: VoiceWaveformProps) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");

    useEffect(() => {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in your browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Stop after one sentence
        recognition.interimResults = false; // Only final results
        recognition.lang = "en-US"; // Language

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setTranscript(transcript);
            onTranscript(transcript); // Send transcript to parent
            setIsListening(false); // Stop listening after result
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };

        if (isListening && !disabled) {
            recognition.start();
        } else {
            recognition.stop();
        }

        return () => {
            recognition.stop();
        };
    }, [isListening, disabled, onTranscript]);

    const toggleListening = () => {
        if (disabled) return;
        setIsListening((prev) => !prev);
    };

    return (
        <div className="flex items-center gap-2 w-full">
            <button
                className={`p-2 rounded-full ${
                    isListening
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
                onClick={toggleListening}
                disabled={disabled}
            >
                {isListening ? "🛑" : "🎤"}
            </button>
            <div className="flex-1 p-2 border rounded-lg bg-gray-100">
                {transcript || "Speak to type..."}
            </div>
        </div>
    );
};

export default Speak;

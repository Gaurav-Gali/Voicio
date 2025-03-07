"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast, Toaster } from "sonner";
import { Prompts } from "@/prompts";
import VoiceWaveform from "../landingPage/VoiceWaveform";

import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";

interface Message {
    role: "agent" | "user";
    content: string;
    timestamp: string;
}

export default function ChatInterface() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [prompts, setPrompt] = useState("");
    const [messages, setMessages] = useState<Message[]>(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("chatMessages") || "[]");
        }
        return [];
    });

    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
    const [isListening, setIsListening] = useState<boolean>(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Timeout reference

    const speakText = (text: string) => {
        if (!window.speechSynthesis) {
            alert("Speech synthesis not supported in your browser!");
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const chatEndRef = useRef<HTMLDivElement | null>(null);

    // Scroll to latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem("chatMessages", JSON.stringify(messages));
        } else {
            const userMessage: Message = {
                role: "agent",
                content: "Hello, how may I help you today!",
                timestamp: new Date().toLocaleTimeString(),
            };
            speakText("Hello, how may I help you today!");
            setMessages([userMessage]);
        }
    }, [messages]);

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy text!");
        }
    };

    const handleChat = async () => {
        // Stop listening if it's currently active
        if (isListening) {
            stopListening();
        }

        const currentTone = localStorage.getItem("tone") || "Formal";

        let prompt = Prompts(prompts, currentTone);
        if (!prompt.trim()) return;

        const userMessage: Message = {
            role: "user",
            content: prompts,
            timestamp: new Date().toLocaleTimeString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setPrompt("");
        setIsLoading(true);

        try {
            const contextMessages = messages.slice(-5).map((msg) => ({
                role: msg.role,
                content: msg.content,
            }));

            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [
                        ...contextMessages,
                        { role: "user", content: prompt },
                    ],
                }),
            });

            const data = await res.json();

            if (!data || !data.response) {
                throw new Error("Empty response from API");
            }

            speakText(data.response);

            const agentMessage: Message = {
                role: "agent",
                content: data.response,
                timestamp: new Date().toLocaleTimeString(),
            };

            setMessages((prev) => [...prev, agentMessage]);
        } catch (error) {
            console.error("Error fetching response:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "agent",
                    content: "Error fetching response.",
                    timestamp: new Date().toLocaleTimeString(),
                },
            ]);
        }
        setIsLoading(false);
    };

    const startListening = () => {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech Recognition is not supported in this browser!");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true; // Enable continuous listening
        recognition.interimResults = true; // Show intermediate results
        recognition.lang = "en-US";

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => {
            setIsListening(false);
            // Restart listening if it ends unexpectedly
            if (isListening) {
                startListening();
            }
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let finalTranscript = "";
            for (let i = 0; i < event.results.length; i++) {
                finalTranscript += event.results[i][0].transcript + " ";
            }
            setPrompt(finalTranscript.trim());

            // Reset the timeout for detecting pauses
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Set a new timeout for 3 seconds
            timeoutRef.current = setTimeout(() => {
                handleChat(); // Automatically send the query after 3 seconds of silence
            }, 3000);
        };

        recognition.start();
        recognitionRef.current = recognition; // Store the recognition instance
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null; // Clear the reference
        }
        // Clear the timeout when stopping listening
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    // Automatically start listening when the component mounts
    useEffect(() => {
        startListening();

        return () => {
            stopListening(); // Stop listening when the component unmounts
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="flex flex-col justify-between h-[90vh] w-full">
            <Toaster position="bottom-center" />
            <ScrollArea className="flex-1 p-4 w-full h-screen overflow-y-auto border-b">
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex gap-2",
                                message.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            )}
                        >
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">
                                        {message.role === "agent"
                                            ? "Voicio"
                                            : "You"}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {message.timestamp}
                                    </span>
                                    {message.role === "agent" && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 cursor-pointer"
                                            onClick={() =>
                                                handleCopy(message.content)
                                            }
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                <div
                                    className={cn(
                                        "p-3 rounded-lg",
                                        message.role === "user"
                                            ? "bg-gradient-to-r from-blue-500 to-blue-500 text-white"
                                            : "bg-gray-50 border text-black"
                                    )}
                                >
                                    <p className="text-sm whitespace-pre-wrap leading-5">
                                        {message.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
            </ScrollArea>
            <div>
                <div className="p-4 flex items-center gap-2">
                    <input
                        type="text"
                        className="flex-1 p-2 border rounded-lg focus:outline-none"
                        placeholder="Type a message..."
                        value={prompts}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleChat()}
                    />
                    <Button
                        onClick={isListening ? stopListening : startListening}
                        disabled={isLoading}
                        className="bg-white border text-black cursor-pointer hover:bg-gray-100 py-5"
                    >
                        {isListening ? "Stop Listening" : "Start Listening"}
                    </Button>
                    <Button
                        onClick={handleChat}
                        disabled={isLoading || !prompts}
                    >
                        {isLoading ? "Sending..." : "Send"}
                    </Button>
                    {isSpeaking && (
                        <Button
                            className="cursor-pointer"
                            onClick={() => {
                                window.speechSynthesis.cancel();
                                setIsSpeaking(false);
                            }}
                        >
                            Stop
                        </Button>
                    )}
                </div>
                {isSpeaking && (
                    <div>
                        <VoiceWaveform />
                    </div>
                )}
            </div>
        </div>
    );
}

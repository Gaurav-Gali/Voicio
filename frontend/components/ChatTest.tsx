"use client";
import { useState } from "react";
import { Prompts } from "@/prompts";



export default function ChatTest() {
    const [prompt, setPrompt] = useState<string>("");
    const [response, setResponse] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        setResponse("");

        try {
            const promptText = Prompts(prompt, "Casual");
            console.log(promptText);

            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: promptText }), // Ensure correct structure
            });

            const data: { response?: string; error?: string } =
                await res.json();
            setResponse(data.response || "No response from API");
        } catch (error) {
            setResponse("Error fetching response.");
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Gemini AI Chat</h1>
            <textarea
                className="border p-2 w-80 rounded"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt..."
            />
            <button
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                onClick={handleGenerate}
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate"}
            </button>
            <h3 className="mt-4 text-lg font-semibold">Response:</h3>
            <p className="mt-2">{response}</p>
        </div>
    );
}

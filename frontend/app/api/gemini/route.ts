import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();
        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: "Invalid request format" },
                { status: 400 }
            );
        }

        // Initialize Gemini API
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // Convert messages into a single prompt while ensuring proper context
        const promptText = messages
            .map((m) =>
                m.role === "user" ? `User: ${m.content}` : `AI: ${m.content}`
            )
            .join("\n");

        // Generate Response
        const result = await model.generateContent(promptText);
        const responseText =
            result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response from API";

        // Clean up any "AI:" or "agent:" prefixes from the response
        const cleanedResponse = responseText.replace(/^AI:\s*/, "").trim();

        return NextResponse.json(
            { response: cleanedResponse },
            { status: 200 }
        );
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch response from Gemini API" },
            { status: 500 }
        );
    }
}

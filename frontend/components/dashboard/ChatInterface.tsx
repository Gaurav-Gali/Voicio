"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast, Toaster } from "sonner";

interface Message {
    role: "agent" | "user";
    content: string;
    timestamp: string;
}

export default function ChatInterface() {
    const [messages] = useState<Message[]>([
        {
            role: "agent",
            content:
                "Hello, I am a generative AI agent. How may I assist you today?",
            timestamp: "4:08:28 PM",
        },
        {
            role: "user",
            content: "Hi, I'd like to check my bill.",
            timestamp: "4:08:37 PM",
        },
        {
            role: "agent",
            content:
                "Please hold for a second.\n\nOk, I can help you with that\n\nI'm pulling up your current bill information\n\nYour current bill is $150, and it is due on August 31, 2024.\n\nIf you need more details, feel free to ask!",
            timestamp: "4:08:37 PM",
        },
    ]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success("Copied to clipboard!");
        });
    };

    return (
        <div className="flex-1 flex flex-col w-full">
            {/* Add the Toaster component to render toasts */}
            <Toaster position="bottom-center" />

            <ScrollArea className="flex-1 p-4 w-full">
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
                            <div
                                className={cn(
                                    "space-y-2",
                                    message.role === "user"
                                        ? "items-end"
                                        : "items-start"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">
                                        {message.role === "agent"
                                            ? "Voicio"
                                            : "You"}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {message.timestamp}
                                    </span>
                                    {/* Copy Button */}
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
                                        "p-3 bg-muted/50 rounded-lg",
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
                </div>
            </ScrollArea>
        </div>
    );
}

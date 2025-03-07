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

interface Product {
    id: number;
    product_name: string;
    category: string;
    brand: string;
    description: string;
    price: string;
    discount_price: string;
    quantity_available: number;
    reorder_level: number;
    date_added: string;
    last_updated: string;
    supplier: number;
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

    const [productData, setProductData] = useState<Product[]>([]);
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
    const [isListening, setIsListening] = useState<boolean>(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
                content:
                    "Hello! I'm here to assist you. You can ask me about our products or start speaking in any way you like. 😊",
                timestamp: new Date().toLocaleTimeString(),
            };
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

    // Fetch all products from the API - no query required
    const fetchProductData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/products/`); // Ensure trailing slash
            console.log("Response status:", response.status); // Log the status code

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetched product data:", data); // Log the data
            setProductData(data);
            return data;
        } catch (error) {
            console.error("Error fetching product data:", error);
            toast.error(
                "Failed to fetch product data. Please try again later."
            );
            return null;
        }
    };

    // Function to determine if query is about products
    const isProductQuery = (text: string) => {
        const productKeywords = [
            "product",
            "products",
            "item",
            "items",
            "catalog",
            "price",
            "cost",
            "buy",
            "purchase",
            "availability",
            "in stock",
            "category",
            "categories",
            "inventory",
            "iphone",
            "electronics",
            "discount",
            "brand",
            "supplier",
        ];

        const lowercaseText = text.toLowerCase();
        return productKeywords.some((keyword) =>
            lowercaseText.includes(keyword)
        );
    };

    // Function to find relevant products based on user query
    const filterProductsByQuery = (products: Product[], query: string) => {
        if (!products || products.length === 0) return [];

        const lowercaseQuery = query.toLowerCase();

        return products.filter((product) => {
            // Check various fields for matches
            return (
                product.product_name.toLowerCase().includes(lowercaseQuery) ||
                product.category.toLowerCase().includes(lowercaseQuery) ||
                product.brand.toLowerCase().includes(lowercaseQuery) ||
                product.description.toLowerCase().includes(lowercaseQuery) ||
                // For numeric values, convert to string first
                product.price.toString().includes(lowercaseQuery) ||
                product.discount_price.toString().includes(lowercaseQuery)
            );
        });
    };

    // Function to format product data for response
    const formatProductResponse = (products: Product[], query: string) => {
        if (!products || products.length === 0) {
            return "I couldn't find any products matching your query. Could you please try a different search?";
        }

        // Determine what kind of product query this is
        const lowercaseQuery = query.toLowerCase();

        // Price query
        if (
            lowercaseQuery.includes("price") ||
            lowercaseQuery.includes("cost") ||
            lowercaseQuery.includes("how much")
        ) {
            return `Here are the prices for the products matching your query:\n\n${products
                .map((p) => {
                    const discountInfo =
                        p.discount_price !== p.price
                            ? ` (Discounted from $${p.price} to $${p.discount_price})`
                            : "";
                    return `${p.product_name}: $${p.discount_price}${discountInfo}`;
                })
                .join("\n")}`;
        }

        // Stock/availability query
        if (
            lowercaseQuery.includes("stock") ||
            lowercaseQuery.includes("available") ||
            lowercaseQuery.includes("availability")
        ) {
            return `Here's the availability of products matching your query:\n\n${products
                .map(
                    (p) =>
                        `${p.product_name}: ${
                            p.quantity_available > 0
                                ? `${p.quantity_available} in stock`
                                : "Out of stock"
                        }`
                )
                .join("\n")}`;
        }

        // Category query
        if (
            lowercaseQuery.includes("category") ||
            lowercaseQuery.includes("categories") ||
            lowercaseQuery.includes("type")
        ) {
            const categories = [...new Set(products.map((p) => p.category))];
            return `I found products in the following categories: ${categories.join(
                ", "
            )}`;
        }

        // Brand query
        if (
            lowercaseQuery.includes("brand") ||
            lowercaseQuery.includes("manufacturer") ||
            lowercaseQuery.includes("make")
        ) {
            const brands = [...new Set(products.map((p) => p.brand))];
            return `I found products from the following brands: ${brands.join(
                ", "
            )}`;
        }

        // Discount query
        if (
            lowercaseQuery.includes("discount") ||
            lowercaseQuery.includes("sale") ||
            lowercaseQuery.includes("deal")
        ) {
            const discountedProducts = products.filter(
                (p) => p.price !== p.discount_price
            );

            if (discountedProducts.length === 0) {
                return "I couldn't find any products currently on discount.";
            }

            return `Here are the products currently on discount:\n\n${discountedProducts
                .map(
                    (p) =>
                        `${p.product_name}\nOriginal Price: $${
                            p.price
                        }\nDiscounted Price: $${p.discount_price}\nSavings: $${(
                            parseFloat(p.price) - parseFloat(p.discount_price)
                        ).toFixed(2)}`
                )
                .join("\n\n")}`;
        }

        // Default: general product info
        return `Here are the products matching your query:\n\n${products
            .map(
                (p) =>
                    `${p.product_name}\nBrand: ${p.brand}\nPrice: $${
                        p.discount_price
                    }${
                        p.discount_price !== p.price
                            ? ` (Original: $${p.price})`
                            : ""
                    }\nCategory: ${p.category}\n${
                        p.quantity_available > 0
                            ? `${p.quantity_available} in stock`
                            : "Out of stock"
                    }\n${p.description ? `Description: ${p.description}` : ""}`
            )
            .join("\n\n")}`;
    };

    const handleChat = async (inputText = prompts) => {
        // Stop listening if it's currently active
        if (isListening) {
            stopListening();
        }

        // Clear timeout to prevent auto-send after manual send
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        // Use the provided inputText or fall back to prompts state
        const textToSend = inputText.trim();
        if (!textToSend) return;

        const userMessage: Message = {
            role: "user",
            content: textToSend,
            timestamp: new Date().toLocaleTimeString(),
        };

        // Clear the prompt state
        setPrompt("");

        // Add user message to chat
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            let response;

            // Check if this is a product-related query
            if (isProductQuery(textToSend)) {
                // Fetch all product data from API
                const allProducts = await fetchProductData();

                console.log("Products : ", allProducts);
                

                if (allProducts && allProducts.length > 0) {
                    // Filter products based on the query
                    const filteredProducts = filterProductsByQuery(
                        allProducts,
                        textToSend
                    );

                    if (filteredProducts.length > 0) {
                        // Format response based on filtered product data
                        response = formatProductResponse(
                            filteredProducts,
                            textToSend
                        );
                    } else {
                        // No matching products, enhance query with product context and use AI
                        const productContext = `The user is asking about products, but I couldn't find exact matches. Here's our product catalog: ${JSON.stringify(
                            allProducts.slice(0, 3)
                        )}. Based on this catalog and the user query: "${textToSend}", provide a helpful response.`;
                        response = await getAIResponse(productContext);
                    }
                } else {
                    // No products found, use AI fallback
                    response = await getAIResponse(
                        `The user asked about products: "${textToSend}", but our database seems to be empty or unavailable. Please provide a general helpful response.`
                    );
                }
            } else {
                // Not a product query, use normal AI response
                response = await getAIResponse(textToSend);
            }

            speakText(response);

            const agentMessage: Message = {
                role: "agent",
                content: response,
                timestamp: new Date().toLocaleTimeString(),
            };

            setMessages((prev) => [...prev, agentMessage]);
        } catch (error) {
            console.error("Error fetching response:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "agent",
                    content:
                        "Sorry, I couldn't process your request. Please try again.",
                    timestamp: new Date().toLocaleTimeString(),
                },
            ]);
        }
        setIsLoading(false);

        // Restart listening with a fresh recognition instance after a short delay
        if (isListening) {
            setTimeout(() => {
                restartListening();
            }, 500);
        }
    };

    // Function to get AI response from Gemini API
    const getAIResponse = async (text: string) => {
        const currentTone = localStorage.getItem("tone") || "Formal";
        const promptWithTone = Prompts(text, currentTone);

        const contextMessages = messages.slice(-5).map((msg) => ({
            role: msg.role === "agent" ? "assistant" : "user",
            content: msg.content,
        }));

        const res = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: [
                    ...contextMessages,
                    { role: "user", content: promptWithTone },
                ],
            }),
        });

        if (!res.ok) {
            throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();

        if (!data || !data.response) {
            throw new Error("Empty response from API");
        }

        return data.response;
    };

    // Function to restart speech recognition with a clean state
    const restartListening = () => {
        // First ensure any existing recognition is stopped
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }

        // Wait a brief moment to ensure it's fully stopped
        setTimeout(() => {
            // Start fresh
            startListening();
        }, 200);
    };

    const startListening = () => {
        // Clear prompt first
        setPrompt("");

        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech Recognition is not supported in this browser!");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
            console.log("Speech recognition started");
            setIsListening(true);
        };

        recognition.onend = () => {
            console.log("Speech recognition ended");
            setIsListening(false);
            // Only auto-restart if we're supposed to be listening
            if (isListening && !isLoading) {
                startListening();
            }
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let transcript = "";
            // Just get the latest result - not cumulative results
            const latestResult = event.results[event.results.length - 1];

            if (latestResult.isFinal) {
                transcript = latestResult[0].transcript.trim();
                console.log("Final transcript:", transcript);

                // Get all previous transcripts to construct the full prompt
                let fullTranscript = prompts;
                if (fullTranscript && !fullTranscript.endsWith(" ")) {
                    fullTranscript += " ";
                }
                fullTranscript += transcript;

                setPrompt(fullTranscript);

                // Reset the timeout for detecting pauses
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }

                // Set timeout for auto-sending after pause
                if (fullTranscript.trim()) {
                    timeoutRef.current = setTimeout(() => {
                        console.log(
                            "Auto-sending after pause:",
                            fullTranscript
                        );
                        handleChat(fullTranscript);
                    }, 3000);
                }
            } else {
                // For interim results, just show what's being processed
                transcript = latestResult[0].transcript.trim();

                // Get all previous transcripts plus this interim one
                let fullTranscript = prompts;
                if (fullTranscript && !fullTranscript.endsWith(" ")) {
                    fullTranscript += " ";
                }
                fullTranscript += transcript;

                setPrompt(fullTranscript);
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);

            // Attempt to restart on errors
            setTimeout(() => {
                if (isListening && !isLoading) {
                    startListening();
                }
            }, 1000);
        };

        try {
            recognition.start();
            recognitionRef.current = recognition;
        } catch (error) {
            console.error("Error starting speech recognition:", error);
        }
    };

    const stopListening = () => {
        setIsListening(false);

        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            // Clear the prompt before starting
            setPrompt("");
            startListening();
        }
    };

    // Automatically start listening when the component mounts
    useEffect(() => {
        // Prefetch product data on load
        fetchProductData();
        startListening();

        return () => {
            stopListening();
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
                        onClick={toggleListening}
                        disabled={isLoading}
                        className="bg-white border text-black cursor-pointer hover:bg-gray-100 py-5"
                    >
                        {isListening ? "Stop Listening" : "Start Listening"}
                    </Button>
                    <Button
                        onClick={() => handleChat()}
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

"use client";
import { useState } from "react"; // Import useState
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Settings,
    ChevronDown,
    ChevronUp,
    X,
    ShoppingBag,
    ShoppingBasket,
} from "lucide-react";

import { UserButton, useUser } from "@clerk/nextjs";
import CallCard from "@/components/dashboard/CallCard";
import Loader from "@/components/dashboard/Loader";
import { useEffect } from "react";

import { db } from "@/lib/firebase"; // Ensure Firebase is correctly imported
import {
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    query,
    where,
} from "firebase/firestore";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { isLoaded, user } = useUser();
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);
    const [openSection, setOpenSection] = useState<
        "orders" | "pendingOrders" | "settings" | null
    >(null);

    const [tone, setTone] = useState("formal");

    useEffect(() => {
        const storedTone = localStorage.getItem("tone") || "formal";
        setTone(storedTone);
    }, []);

    const handleToneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTone = e.target.value;
        setTone(newTone);
        localStorage.setItem("tone", newTone);
    };

    const saveConversation = async () => {
        setSaving(true);
        try {
            const chatMessages = JSON.parse(
                localStorage.getItem("chatMessages") || "[]"
            );

            if (chatMessages.length === 0) {
                setSaving(false);
                alert("No messages to save!");
                return;
            }

            await addDoc(collection(db, "messages"), {
                userId: user?.id,
                messages: chatMessages,
                timestamp: serverTimestamp(),
            });

            setSaving(false);
            alert("Conversation saved successfully!");
            localStorage.removeItem("chatMessages"); // Clear after saving
        } catch (error) {
            console.error("Error saving conversation:", error);
            setSaving(false);
            alert("Failed to save conversation!");
        }
        setSaving(false);
        window.location.reload();
    };

    useEffect(() => {
        const fetchMessages = async () => {
            if (!user) return;
            setLoading(true);

            try {
                const messagesRef = collection(db, "messages");
                const q = query(messagesRef, where("userId", "==", user.id));
                const querySnapshot = await getDocs(q);

                const fetchedMessages = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setMessages(fetchedMessages);
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMessages();
        }
    }, [user]);

    if (!isLoaded) {
        return <Loader />;
    }

    const handleCallCardClick = (message: any) => {
        // Clear current chats in local storage
        localStorage.removeItem("chatMessages");

        // Replace with the chats from the selected call
        localStorage.setItem("chatMessages", JSON.stringify(message.messages));

        // Reload the page
        window.location.reload();
    };

    // Toggle dropdown sections
    const toggleSection = (
        section: "orders" | "pendingOrders" | "settings"
    ) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <div className="w-64 border-r bg-muted/10 flex flex-col">
                <div className="p-4 border-b">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
                        <span className="font-semibold">Voicio</span>
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="space-y-4 p-4">
                        <nav className="space-y-2">
                            {/* Orders Dropdown */}
                            <div>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between cursor-pointer"
                                    onClick={() => toggleSection("orders")}
                                >
                                    <div className="flex items-center">
                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                        Orders
                                    </div>
                                    {openSection === "orders" ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </Button>
                                {openSection === "orders" && (
                                    <div className="pl-8 mt-2 space-y-2">
                                        <p className="text-sm">Order 1</p>
                                        <p className="text-sm">Order 2</p>
                                        <p className="text-sm">Order 3</p>
                                    </div>
                                )}
                            </div>

                            {/* Pending Orders Dropdown */}
                            <div>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between cursor-pointer"
                                    onClick={() =>
                                        toggleSection("pendingOrders")
                                    }
                                >
                                    <div className="flex items-center">
                                        <ShoppingBasket className="mr-2 h-4 w-4" />
                                        Pending Orders
                                    </div>
                                    {openSection === "pendingOrders" ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </Button>
                                {openSection === "pendingOrders" && (
                                    <div className="pl-8 mt-2 space-y-2">
                                        <p className="text-sm">
                                            Pending Order 1
                                        </p>
                                        <p className="text-sm">
                                            Pending Order 2
                                        </p>
                                        <p className="text-sm">
                                            Pending Order 3
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Settings Dropdown */}
                            <div>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between cursor-pointer"
                                    onClick={() =>
                                        setOpenSection(
                                            openSection === "settings"
                                                ? null
                                                : "settings"
                                        )
                                    }
                                >
                                    <div className="flex items-center">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </div>
                                    {openSection === "settings" ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </Button>
                                {openSection === "settings" && (
                                    <div className="pl-8 mt-2 space-y-2">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-medium">
                                                Tone of Reply
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={tone}
                                                    onChange={handleToneChange}
                                                    className="appearance-none w-full p-2 border outline-none rounded-lg text-sm bg-white cursor-pointer"
                                                >
                                                    <option value="formal">
                                                        Formal
                                                    </option>
                                                    <option value="casual">
                                                        Casual
                                                    </option>
                                                    <option value="friendly">
                                                        Friendly
                                                    </option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                                    <ChevronDown className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </div>
                </ScrollArea>

                {/* User Section */}
                <div className="border-t p-4">
                    <div className="flex items-center gap-3">
                        <UserButton afterSignOutUrl="/" />
                        <div className="flex-1">
                            <p className="text-sm font-medium">
                                {user?.fullName || "User"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {user?.primaryEmailAddress?.emailAddress ||
                                    "user@example.com"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex">
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <header className="h-14 border-b px-4 flex items-center justify-between">
                        <h1 className="text-sm font-medium">
                            Voice conversation
                        </h1>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="cursor-pointer"
                                onClick={() => saveConversation()}
                            >
                                {saving ? (
                                    <p>Saving conversation...</p>
                                ) : (
                                    <p>Save conversation</p>
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </header>
                    {children}
                </div>

                {/* Right Panel */}
                <div className="w-80 border-l">
                    <div className="h-14 border-b px-4 flex items-center">
                        <h2 className="font-medium">Conversation details</h2>
                    </div>
                    <div className="p-4">
                        <div className="border-b pb-4">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="rounded-lg cursor-pointer text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-[90%] transition-all duration-150 p-5 w-full"
                                onClick={() => {
                                    localStorage.setItem("chatMessages", "[]");
                                    window.location.reload();
                                }}
                            >
                                Start call
                            </Button>
                        </div>
                        {/* Calls */}
                        <div className="h-[85vh] overflow-y-auto">
                            {messages.map((message, index) => {
                                return (
                                    <div
                                        className={
                                            index !== messages.length - 1
                                                ? "border-b"
                                                : ""
                                        }
                                        key={index}
                                        onClick={() =>
                                            handleCallCardClick(message)
                                        }
                                    >
                                        <CallCard
                                            call={{
                                                ...message,
                                                status: "completed",
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

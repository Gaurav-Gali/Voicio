"use client";
import { useState } from "react"; // Import useState
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    LayoutGrid,
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

interface CallDetails {
    duration: string;
    topic: string;
    date: string;
    participant: string;
    status: "completed" | "in call";
}

export default function Layout({ children }: { children: React.ReactNode }) {
    const { isLoaded, user } = useUser();
    const [openSection, setOpenSection] = useState<
        "orders" | "pendingOrders" | "settings" | null
    >(null); // State for dropdown

    const meetings: CallDetails[] = [
        {
            duration: "45 minutes",
            topic: "Quarterly Business Review",
            date: "March 15, 2024 - 2:30 PM",
            participant: "Sarah Anderson",
            status: "in call",
        },
        {
            duration: "30 minutes",
            topic: "Product Launch Planning",
            date: "March 10, 2024 - 10:00 AM",
            participant: "John Doe",
            status: "completed",
        },
        {
            duration: "1 hour",
            topic: "Marketing Strategy Discussion",
            date: "March 5, 2024 - 3:00 PM",
            participant: "Emily Clark",
            status: "completed",
        },
        {
            duration: "15 minutes",
            topic: "Budget Approval",
            date: "March 1, 2024 - 11:00 AM",
            participant: "Michael Brown",
            status: "completed",
        },
        {
            duration: "1 hour 30 minutes",
            topic: "Team Building Workshop",
            date: "February 25, 2024 - 9:00 AM",
            participant: "Laura Wilson",
            status: "completed",
        },
    ];

    if (!isLoaded) {
        return <Loader />;
    }

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
                                    onClick={() => toggleSection("settings")}
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
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                placeholder="Enter phone number"
                                                className="p-2 border rounded-lg text-sm"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-medium">
                                                Tone of Reply
                                            </label>
                                            <div className="relative">
                                                <select className="appearance-none w-full p-2 border outline-none rounded-lg text-sm bg-white cursor-pointer">
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
                                                {/* Custom dropdown arrow */}
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                                    <svg
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/s"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 9l-7 7-7-7"
                                                        />
                                                    </svg>
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
                            <Button variant="ghost" size="sm">
                                Save conversation
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
                            >
                                Start call
                            </Button>
                        </div>
                        {/* Calls */}
                        <div className="h-[85vh] overflow-y-auto">
                            {meetings.map((meeting, index) => {
                                return (
                                    <div
                                        className={
                                            index !== meetings.length - 1
                                                ? "border-b"
                                                : ""
                                        }
                                        key={index}
                                    >
                                        <CallCard call={meeting} />
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

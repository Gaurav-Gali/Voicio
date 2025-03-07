import React from "react";
import { Clock, Calendar } from "lucide-react";

interface CallDetails {
    participant: string;
    timestamp: number | { seconds: number; nanoseconds: number }; // Handle both formats
    status: "completed" | "in call";
}

export default function CallCard({ call }: { call: CallDetails }) {
    // Convert timestamp to Date object
    let dateObj: Date;

    if (typeof call.timestamp === "number") {
        // If it's a number (milliseconds since epoch)
        dateObj = new Date(call.timestamp);
    } else if (call.timestamp?.seconds) {
        // If it's a Firestore timestamp object
        dateObj = new Date(call.timestamp.seconds * 1000);
    } else {
        dateObj = new Date(); // Fallback in case of missing timestamp
    }

    // Format date and time
    const formattedDate = dateObj.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
    const formattedTime = dateObj.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="bg-white p-5 hover:bg-gray-50 cursor-pointer my-1 rounded-lg">
            {/* Status Badge */}
            <div className="flex justify-between items-start mb-4">
                <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                        call.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                    }`}
                >
                    {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                </div>
            </div>

            {/* Call Details */}
            <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-3" />
                    <span className="text-sm">{formattedTime}</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3" />
                    <span className="text-sm">{formattedDate}</span>
                </div>
            </div>
        </div>
    );
}

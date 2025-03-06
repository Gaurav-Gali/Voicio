import React from "react";
import { Clock, Calendar } from "lucide-react";

interface CallDetails {
    duration: string;
    topic: string;
    date: string;
    participant: string;
    status: "completed" | "in call";
}

export default function CallCard({ call }: { call: CallDetails }) {
    return (
        <div className="bg-white p-5 hover:bg-gray-50 cursor-pointer my-1">
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
                    <span className="text-sm">{call.duration}</span>
                </div>

                <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3" />
                    <span className="text-sm">{call.date}</span>
                </div>
            </div>
        </div>
    );
}

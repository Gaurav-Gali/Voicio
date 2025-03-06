"use client";

import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import WavePaths from "@/components/landingPage/WavePaths";
import VoiceWaveform from "@/components/landingPage/VoiceWaveform";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white">
            <div className="absolute inset-0 opacity-20">
                <WavePaths position={1} />
                <WavePaths position={-1} />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6 inline-flex items-center justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-blue-500 blur-xl opacity-20"></div>
                        </div>
                    </div>

                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-4  bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                        Voicio
                    </h1>

                    <p className="text-xl md:text-2xl mb-8 text-slate-600 max-w-2xl mx-auto">
                        Query your databases with the power of your voice. No
                        more complex SQL - just ask and receive.
                    </p>
                    <VoiceWaveform />
                    <Button
                        onClick={() => router.push("/dashboard")}
                        className="rounded-xl cursor-pointer text-lg font-semibold 
                          bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-[90%] transition-all duration-150 text-white p-7"
                    >
                        <div className="flex items-center justify-center gap-3 m-1">
                            <span>Try Voicio Now</span>
                            <Mic />
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    );
}

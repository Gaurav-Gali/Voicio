"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

function WavePaths({ position }: { position: number }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        width: 0.5 + i * 0.03,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 696 316" fill="none">
                <title>Voice Wave Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="#3B82F6"
                        strokeWidth={path.width}
                        strokeOpacity={0.05 + path.id * 0.01}
                        initial={{ pathLength: 0.3, opacity: 0.4 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.2, 0.4, 0.2],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: 15 + Math.random() * 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

function VoiceWaveform() {
    const bars = Array.from({ length: 20 }, (_, i) => i);

    return (
        <div className="flex items-center justify-center gap-1 h-16 my-8">
            {bars.map((bar) => (
                <motion.div
                    key={bar}
                    className="w-1.5 bg-blue-500 rounded-full"
                    initial={{ height: 10 }}
                    animate={{
                        height: [
                            10 + Math.random() * 10,
                            30 + Math.random() * 40,
                            10 + Math.random() * 20,
                        ],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        delay: bar * 0.05,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

export default function VoicioHero() {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white">
            <div className="absolute inset-0 opacity-20">
                <WavePaths position={1} />
                <WavePaths position={-1} />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="max-w-4xl mx-auto"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="mb-6 inline-flex items-center justify-center"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-blue-500 blur-xl opacity-20 animate-pulse"></div>
                            <div className="relative bg-blue-500 p-3 rounded-full">
                                <Mic className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-4 tracking-tighter text-slate-900">
                        {"Voicio".split("").map((letter, letterIndex) => (
                            <motion.span
                                key={letterIndex}
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{
                                    delay: letterIndex * 0.08,
                                    type: "spring",
                                    stiffness: 150,
                                    damping: 20,
                                }}
                                className="inline-block"
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="text-xl md:text-2xl mb-8 text-slate-600 max-w-2xl mx-auto"
                    >
                        Query your databases with the power of your voice. No
                        more complex SQL - just ask and receive.
                    </motion.p>

                    <VoiceWaveform />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                    >
                        <div
                            className="inline-block group relative bg-blue-500 
                          p-px rounded-2xl overflow-hidden shadow-lg hover:shadow-xl 
                          hover:shadow-blue-500/20 transition-shadow duration-300"
                        >
                            <Button
                                variant="secondary"
                                className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold 
                              bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 
                              group-hover:-translate-y-0.5 border-none
                              hover:shadow-md"
                            >
                                <span className="mr-2">Try Voicio Now</span>
                                <motion.span
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.7, 1, 0.7],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <Mic className="w-5 h-5" />
                                </motion.span>
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.6, duration: 1 }}
                        className="mt-12 text-slate-500 text-sm"
                    >
                        Works with MySQL, PostgreSQL, MongoDB, and more
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

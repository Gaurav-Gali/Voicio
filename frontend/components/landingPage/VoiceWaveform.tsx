"use client"

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function VoiceWaveform() {
    const bars = Array.from({ length: 20 }, (_, i) => i);
    const [barHeights, setBarHeights] = useState(Array(20).fill(20));
    const audioRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        async function setupAudio() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
                const audioContext = new AudioContext(); // ✅ Fixed error here
                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 32;
                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);
                audioRef.current = analyser;

                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                const updateWaveform = () => {
                    if (audioRef.current) {
                        audioRef.current.getByteFrequencyData(dataArray);
                        const averageVolume =
                            dataArray.reduce((a, b) => a + b, 0) / bufferLength;

                        if (averageVolume > 50) {
                            const normalizedData = Array.from(dataArray)
                                .slice(0, 20)
                                .map((value) =>
                                    Math.max(20, (value / 255) * 80)
                                );
                            setBarHeights(normalizedData);
                        } else {
                            setBarHeights(
                                bars.map(
                                    (_, i) =>
                                        20 + Math.sin(i + Date.now() / 300) * 10
                                )
                            );
                        }
                    }
                    animationFrameRef.current =
                        requestAnimationFrame(updateWaveform);
                };

                updateWaveform();
            } catch (error) {
                console.error("Error accessing microphone:", error);
            }
        }

        setupAudio();

        return () => {
            if (animationFrameRef.current)
                cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    return (
        <div className="flex justify-center items-center gap-1 mb-8 h-24">
            {bars.map((i) => (
                <motion.div
                    key={i}
                    className="w-1 bg-blue-500 rounded-full"
                    animate={{ height: barHeights[i] }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                />
            ))}
        </div>
    );
}

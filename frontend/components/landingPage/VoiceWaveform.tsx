import { motion } from "framer-motion";

export default function VoiceWaveform() {
    const bars = Array.from({ length: 20 }, (_, i) => i);

    return (
        <div className="flex justify-center items-center gap-1 mb-8 h-24">
            {bars.map((i) => (
                <motion.div
                    key={i}
                    className="w-1 bg-blue-500 rounded-full"
                    initial={{ height: 20 }}
                    animate={{
                        height: [20, 40 + Math.random() * 40, 20],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

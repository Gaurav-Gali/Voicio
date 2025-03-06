import { motion } from "framer-motion";

export default function WavePaths({ position }: { position: number }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        width: 0.4 + i * 0.02, // Made it thinner
    }));

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 696 316" fill="none">
                <title>Voice Wave Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="rgb(24, 24, 27)" // Tailwind zinc-900
                        strokeWidth={path.width}
                        strokeOpacity={0.1 + path.id * 0.005} // Adjusted for visibility
                        initial={{ pathLength: 0.2, opacity: 0.5 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.4, 0.7, 0.4], // Subtle animation
                        }}
                        transition={{
                            duration: 12 + Math.random() * 5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

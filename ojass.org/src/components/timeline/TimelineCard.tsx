import { DayKey } from "@/lib/constants";
import { AnimatePresence, motion, Variants } from "framer-motion";
import EventMap from "./Map";

function TimelineCard({
    selectedDay,
    direction,
    isMobile
}: {
    selectedDay: DayKey;
    direction: "left" | "right";
    isMobile: boolean;
}) {
    const pageVariants: Variants = {
        initial: (custom: { direction: "left" | "right" }) => ({
            x: custom.direction === "left" ? "-20vw" : "20vw",
            rotate: custom.direction === "left" ? -5 : 5,
            opacity: 0,
        }),
        animate: {
            x: 0,
            rotate: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
            },
        },
        exit: (custom: { direction: "left" | "right" }) => ({
            x: custom.direction === "left" ? "20vw" : "-20vw",
            rotate: custom.direction === "left" ? 5 : -5,
            opacity: 0,
            transition: { type: "tween", duration: 0.45, ease: "easeInOut" },
        }),
    };

    return (
        <AnimatePresence mode="wait" custom={{ direction }}>
            <motion.div
                key={selectedDay}
                custom={{ direction }}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="min-h-screen absolute inset-0">
                <EventMap selectedDay={selectedDay} isMobile={isMobile} />
            </motion.div>
        </AnimatePresence>
    );
}

export default TimelineCard;

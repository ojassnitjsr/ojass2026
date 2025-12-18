import CoinToss from "@/components/OverlayLayout/ThemeToggle/CoinToss";
import { motion } from "framer-motion";

const ThemeToggleButton = ({ onToggle }: { onToggle: () => Promise<void> }) => {
    return (
        <motion.div
            className="fixed bottom-4 sm:right-20 right-12 z-[9999] cursor-pointer"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.1 }}>
            <CoinToss onToggle={onToggle} />
        </motion.div>
    );
};

export default ThemeToggleButton;

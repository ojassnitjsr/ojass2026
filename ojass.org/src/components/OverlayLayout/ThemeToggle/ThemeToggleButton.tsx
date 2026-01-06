import CoinToss from "@/components/OverlayLayout/ThemeToggle/CoinToss";

const ThemeToggleButton = ({ onToggle }: { onToggle: () => Promise<void> }) => {
    return (
        <div className="fixed bottom-4 sm:right-20 right-12 z-[9999] cursor-pointer animate-float hover:scale-110 transition-transform duration-300">
            <CoinToss onToggle={onToggle} />
        </div>
    );
};

export default ThemeToggleButton;

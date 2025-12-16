import { useLoginTheme } from "../login/theme";

const Button = ({
    onClick,
    content,
}: {
    onClick?: () => void;
    content?: string;
}) => {
    const theme = useLoginTheme();
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2.5 text-xs font-mono uppercase transition-all backdrop-blur-sm border ${theme.buttonPrimary} font-bold`}
            style={{
                clipPath:
                    "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
            }}>
            {content}
        </button>
    );
};

export default Button;

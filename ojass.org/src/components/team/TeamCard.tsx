import { useLoginTheme } from "@/components/login/theme";
import Image from "next/image";
import { FC } from "react";
import { FaPhone } from "react-icons/fa";
import { MdMail } from "react-icons/md";

export interface TeamCardProps {
    name: string;
    role: string;
    imageUrl: string;
    phone: string;
    email: string;
}

const CLIP_PATH = `path("M1 18.3657V380.245C1 384.802 2.79117 389.176 5.98718 392.424L45.8532 432.814C49.1176 436.131 53.5772 438 58.2316 438H217.365C221.672 438 225.826 439.601 229.019 442.491L250.571 461.999C253.764 464.889 257.918 466.49 262.225 466.49H290.247C299.838 466.49 307.612 458.715 307.612 449.124V92.4971C307.612 82.9063 299.838 75.1314 290.247 75.1314H234.691C230.037 75.1314 225.577 73.2626 222.313 69.9449L178.574 25.3145C175.31 21.9968 170.15 20.128 166.096 20.128H18.3657C8.77487 20.128 1 12.3531 1 18.3657Z")`;

const TeamCard: FC<TeamCardProps> = ({
    name,
    role,
    imageUrl,
    phone,
    email,
}) => {
    const theme = useLoginTheme();

    return (
        <div className="relative w-[313px] h-[462px] scale-97 m-[3vmin_0.8vmax] cursor-pointer group">
            {/* Top Decoration */}
            <div
                className={`absolute z-[-2] width-[150px] height-[80px] left-0 top-0 w-[150px] h-[80px] rounded-[10px] ${theme.accentBg} opacity-0 transition-all duration-300 transform translate-x-[100px] translate-y-[100px] group-hover:translate-x-[150px] group-hover:translate-y-[25px] group-hover:opacity-100`}
            />

            {/* Bottom Decoration */}
            <div
                className={`absolute z-[-2] w-[285px] h-[80px] right-0 bottom-0 rounded-[10px] ${theme.accentBg} opacity-0 transition-all duration-300 transform translate-y-[-100px] group-hover:translate-x-[-20px] group-hover:translate-y-[-5px] group-hover:opacity-100`}
            />

            {/* Border */}
            <div
                className={`absolute top-0 left-0 w-full h-full ${theme.borderColor} border-opacity-50 transition-duration-100 z-[-1] scale-[1.007] bg-opacity-20`}
                style={{ clipPath: CLIP_PATH, backgroundColor: "currentColor" }}
            />

            {/* Main Card */}
            <section
                className={`relative w-[313px] h-[462px] ${theme.bgGlass} backdrop-blur-md overflow-hidden border ${theme.borderColorDim}`}
                style={{ clipPath: CLIP_PATH }}>
                {/* Image */}
                <Image
                    src={imageUrl}
                    alt={name}
                    height={500}
                    width={500}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 transition-duration-300 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Text Content */}
                <div className="absolute bottom-10 right-5 z-10 text-right text-white">
                    <h2
                        className={`m-0 mb-[5px] text-2xl font-bold ${theme.textColor} ${theme.textGlow}`}>
                        {name}
                    </h2>
                    <p
                        className={`m-0 text-sm opacity-90 ${theme.textColorDim}`}>
                        {role}
                    </p>
                </div>

                {/* Social Links */}
                <div className="absolute bottom-10 left-[35px] flex flex-row gap-[15px] z-10">
                    <SocialLink
                        href={`tel:${phone}`}
                        ariaLabel="Phone"
                        theme={theme}>
                        <FaPhone />
                    </SocialLink>

                    <SocialLink
                        href={`mailto:${email}`}
                        ariaLabel="Email"
                        theme={theme}>
                        <MdMail />
                    </SocialLink>
                </div>
            </section>
        </div>
    );
};

const SocialLink = ({
    href,
    children,
    ariaLabel,
    theme,
}: {
    href: string;
    children: React.ReactNode;
    ariaLabel: string;
    theme: any;
}) => (
    <a
        href={href}
        aria-label={ariaLabel}
        className={`w-[45px] h-[45px] bg-white/10 backdrop-blur-[10px] border-2 ${theme.borderColorDim} rounded-full flex justify-center items-center text-white transition-all duration-300 hover:${theme.accentBg} hover:border-white/60 hover:scale-110`}>
        {children}
    </a>
);

export default TeamCard;

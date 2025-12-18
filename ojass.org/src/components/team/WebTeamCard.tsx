import { useLoginTheme } from "@/components/login/theme";
import Image from "next/image";
import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

interface TeamCardSquareProps {
    name: string;
    role: string;
    imageUrl: string;
    linkedinUrl: string;
    githubUrl: string;
}

const CLIP_PATH = `path("M1 15.5V312C1 316.5 2.8 320.8 6 324L38 356C41.2 359.2 45.5 361 50 361H178C182.3 361 186.5 362.6 189.7 365.5L207 381C210.2 383.9 214.4 385.5 218.7 385.5H378C387.4 385.5 395 377.9 395 368.5V76C395 66.6 387.4 59 378 59H309C304.3 59 299.9 57.1 296.6 53.8L257.5 14C254.2 10.7 249.8 8.8 245.1 8.8H21C11.6 8.8 4 16.4 4 15.5Z")`;

const TeamCardSquare: React.FC<TeamCardSquareProps> = ({
    name,
    role,
    imageUrl,
    linkedinUrl,
    githubUrl,
}) => {
    const theme = useLoginTheme();

    return (
        <div className="relative w-[400px] h-[400px] scale-70 sm:scale-75 m-[3vmin_0.8vmax] cursor-pointer group">
            {/* Hover Decoration 1 (Top Left) */}
            <div
                className={`absolute z-[-2] w-[130px] h-[70px] left-0 top-0 rounded-[10px] ${theme.accentBg} opacity-0 transition-all duration-300 transform translate-x-[100px] translate-y-[100px] group-hover:translate-x-[130px] group-hover:translate-y-[20px] group-hover:opacity-100`}
            />

            {/* Hover Decoration 2 (Bottom Right) */}
            <div
                className={`absolute z-[-2] w-[245px] h-[70px] right-0 bottom-0 rounded-[10px] ${theme.accentBg} opacity-0 transition-all duration-300 transform translate-y-[-100px] group-hover:translate-x-[-150px] group-hover:translate-y-[-21px] group-hover:opacity-100`}
            />

            {/* Card Border Layer */}
            <div
                className={`absolute top-0 left-0 w-full h-full ${theme.borderColor} transition-duration-100 z-[-1] scale-[1.007] bg-opacity-20`}
                style={{ clipPath: CLIP_PATH, backgroundColor: "currentColor" }}
            />

            {/* Main Card */}
            <section
                className={`relative w-[400px] h-[400px] ${theme.bgGlass} backdrop-blur-md overflow-hidden ${theme.borderColorDim}`}
                style={{ clipPath: CLIP_PATH }}>
                {/* Portrait Image */}
                <Image
                    width={500}
                    height={500}
                    src={imageUrl}
                    alt={name}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />

                <div
                    className="absolute inset-0 transition-duration-300"
                    style={{
                        backgroundImage: `linear-gradient(to top, black, black, transparent, transparent, transparent)`,
                        backgroundSize: "cover",
                    }}
                />

                {/* Text Content - Right Aligned */}
                <div className="absolute bottom-10 right-5 z-10 text-right text-white">
                    <h2
                        className={`m-0 mb-[5px] text-2xl font-bold drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] ${theme.textColor} ${theme.textGlow}`}>
                        {name}
                    </h2>
                    <p
                        className={`m-0 text-sm opacity-90 drop-shadow-[1px_1px_3px_rgba(0,0,0,0.8)] ${theme.textColorDim}`}>
                        {role}
                    </p>
                </div>

                {/* Social Links - Left Aligned */}
                <div className="absolute bottom-[45px] left-[35px] flex flex-row gap-[15px] z-10">
                    {/* LinkedIn */}
                    <SocialLink
                        href={linkedinUrl}
                        ariaLabel="LinkedIn"
                        theme={theme}>
                        <FaLinkedin />
                    </SocialLink>

                    {/* GitHub */}
                    <SocialLink
                        href={githubUrl}
                        ariaLabel="GitHub"
                        theme={theme}>
                        <FaGithub />
                    </SocialLink>
                </div>
            </section>
        </div>
    );
};

// Reusable Button Component for consistency
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
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={`w-[45px] h-[45px] bg-white/10 backdrop-blur-[10px] border-2 ${theme.borderColorDim} rounded-full flex justify-center items-center text-white transition-all duration-300 hover:${theme.accentBg} hover:border-white/60 hover:scale-110`}>
        {children}
    </a>
);

export default TeamCardSquare;

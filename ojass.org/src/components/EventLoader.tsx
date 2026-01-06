import React from "react";
interface EventLoaderProps {
    theme: string;
}

const EventLoader: React.FC<EventLoaderProps> = ({ theme }) => {
    const isDystopia = theme === "dystopia";

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md">
            <div className="relative">
                {/* Outer Ring */}
                <div className={`h-40 w-40 rounded-full border-b-2 border-t-2 animate-spin [animation-duration:3s] ${ isDystopia ? "border-[#ee8f59]" : "border-cyan-500"    }`}
                />

                {/* Middle Ring */}
                <div className={`absolute top-2 left-2 h-36 w-36 rounded-full border-r-2 border-l-2 animate-spin direction-reverse [animation-duration:2s] ${isDystopia ? 'border-[#ee8f59]/50' : 'border-cyan-500/50'}`}
                />

                {/* Inner Ring */}
                <div className={`absolute top-6 left-6 h-28 w-28 rounded-full border-t-4 animate-spin [animation-duration:1.5s] ${isDystopia ? 'border-[#ee8f59]/80' : 'border-cyan-500/80'}`}
                />

                {/* Core Pulse */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full blur-xl animate-scale-pulse ${isDystopia ? "bg-[#ee8f59]" : "bg-cyan-500"}`}
                />

                {/* Center Text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
                    <span className={`text-xs font-bold font-mono tracking-widest ${isDystopia ? 'text-[#ee8f59]' : 'text-cyan-500'} animate-pulse`}>
                        {isDystopia ? 'DYSTOPIA' : 'UTOPIA'}
                    </span>
                </div>
            </div>

            {/* Loading Status Text */}
            <div className="mt-12 text-center z-10 animate-fade-in-up opacity-0 [animation-delay:0.5s] [animation-fill-mode:forwards]">
                <div className={`text-sm font-mono tracking-[0.3em] font-bold ${isDystopia ? "text-[#ee8f59]" : "text-cyan-500"}`}>
                    INITIALIZING EVENTS
                </div>

                {/* Progress Bar Container */}
                <div className={`mt-4 h-1 w-64 mx-auto overflow-hidden bg-white/10 rounded-full`}>
                    <div className={`h-full w-full ${isDystopia ? "bg-[#ee8f59]" : "bg-cyan-500"}`} style={{animation:"horizontal-scroll-2 1.5s linear infinite reverse"}} />
                </div>
            </div>
        </div>
    );
};

export default EventLoader;

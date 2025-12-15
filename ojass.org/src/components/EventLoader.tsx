import React from 'react';
import { motion } from 'framer-motion';

interface EventLoaderProps {
    theme: string;
}

const EventLoader: React.FC<EventLoaderProps> = ({ theme }) => {
    const isDystopia = theme === 'dystopia';

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md">
            <div className="relative">
                {/* Outer Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className={`h-40 w-40 rounded-full border-b-2 border-t-2 ${isDystopia ? 'border-[#ee8f59]' : 'border-cyan-500'
                        }`}
                />

                {/* Middle Ring */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className={`absolute top-2 left-2 h-36 w-36 rounded-full border-r-2 border-l-2 ${isDystopia ? 'border-[#ee8f59]/50' : 'border-cyan-500/50'
                        }`}
                />

                {/* Inner Ring */}
                <motion.div
                    animate={{ rotate: 90 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute top-6 left-6 h-28 w-28 rounded-full border-t-4 ${isDystopia ? 'border-[#ee8f59]/80' : 'border-cyan-500/80'
                        }`}
                />

                {/* Core Pulse */}
                <motion.div
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full blur-xl ${isDystopia ? 'bg-[#ee8f59]' : 'bg-cyan-500'
                        }`}
                />

                {/* Center Text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
                    <span className={`text-xs font-bold font-mono tracking-widest ${isDystopia ? 'text-[#ee8f59]' : 'text-cyan-500'} animate-pulse`}>
                        {isDystopia ? 'DYSTOPIA' : 'UTOPIA'}
                    </span>
                </div>
            </div>

            {/* Loading Status Text */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 text-center z-10"
            >
                <div className={`text-sm font-mono tracking-[0.3em] font-bold ${isDystopia ? 'text-[#ee8f59]' : 'text-cyan-500'}`}>
                    INITIALIZING EVENTS
                </div>

                {/* Progress Bar Container */}
                <div className={`mt-4 h-1 w-64 mx-auto overflow-hidden bg-white/10 rounded-full`}>
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className={`h-full w-full ${isDystopia ? 'bg-[#ee8f59]' : 'bg-cyan-500'}`}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default EventLoader;

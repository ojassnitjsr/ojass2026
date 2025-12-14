"use client";
import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';

export default function Bot() {
  const { theme } = useTheme();
  const router = useRouter();
  const isDystopia = theme === "dystopia";
  return (
    <motion.div
      className='fixed bottom-0 left-20 z-[100] cursor-pointer'
      animate={{
        y: [0, -15, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      whileHover={{ scale: 1.1 }}
      onClick={() => router.push('/bot')}
    >
      <Image src={!isDystopia ? "/robo_eut.png" : "/robo_dys.png"} alt="Bot" width={100} height={100} className='h-full w-auto' />
    </motion.div>
  )
}

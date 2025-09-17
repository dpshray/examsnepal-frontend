'use client';

import {motion} from 'framer-motion';
import {cn} from '@/lib/utils';
import React from 'react';

interface LogoLoadingProps {
    width?: number;
    height?: number;
    text?: string;
    className?: string;
    fullscreen?: boolean;
}

export default function LogoLoading({
                                        width = 125,
                                        height = 55,
                                        text = 'Logging in...',
                                        className,
                                        fullscreen = true,
                                    }: LogoLoadingProps) {
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className={cn(
                fullscreen
                ? "fixed inset-0 z-50 bg-white/70 backdrop-blur-md flex items-center justify-center"
                : "flex items-center justify-center", 
                className
            )}
        >
            <motion.svg
                width={width}
                height={height}
                viewBox="0 0 125 55"
                xmlns="http://www.w3.org/2000/svg"
                className="origin-center"
                animate={{scale: [1, 1.05, 1]}}
                transition={{duration: 2.5, repeat: Infinity, ease: 'easeInOut'}}
            >
                <g clipPath="url(#clip0)">
                    <motion.path
                        d="M0.968 54.032C2.260 55.322 4.353 55.322 5.644 54.032L16.659 43.022L27.674 54.032C28.965 55.322 31.059 55.322 32.35 54.032C33.641 52.741 33.641 50.649 32.35 49.358L16.659 33.673L0.968 49.358C-0.323 50.649 -0.323 52.741 0.968 54.032Z"
                        fill="#991b1b"
                        animate={{fill: ['#991b1b', '#f87171', '#991b1b']}}
                        transition={{duration: 2, repeat: Infinity, ease: 'easeInOut'}}
                    />
                    <motion.path
                        d="M53.817 0.97C55.108 2.262 55.108 4.358 53.817 5.651L16.652 42.878L0.968 27.168C-0.323 25.875 -0.323 23.78 0.968 22.487C2.259 21.194 4.351 21.194 5.642 22.487L16.652 33.515L49.144 0.97C50.434 -0.323 52.527 -0.323 53.817 0.97Z"
                        fill="#047857"
                        animate={{fill: ['#047857', '#34d399', '#047857']}}
                        transition={{duration: 2, repeat: Infinity, ease: 'easeInOut'}}
                    />
                    <motion.text
                        x="43"
                        y="48"
                        fontSize="10"
                        fontFamily="Arial, sans-serif"
                        fill="#a3a3a3"
                        animate={{opacity: [0.4, 1, 0.4]}}
                        transition={{duration: 1.8, repeat: Infinity, ease: 'easeInOut'}}
                    >
                        {text}
                    </motion.text>
                </g>
                <defs>
                    <clipPath id="clip0">
                        <rect width="125" height="55" fill="white"/>
                    </clipPath>
                </defs>
            </motion.svg>
        </motion.div>
    );
}

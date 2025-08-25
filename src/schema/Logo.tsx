export default function Logo() {
    return (
        <svg
            width="125"
            height="55"
            viewBox="0 0 125 55"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="origin-center animate-scalePulse"
        >
            <g clipPath="url(#clip0_193_230)">
                {/* Red Pulse Shape */}
                <path
                    className="fill-red-700 animate-fillPulseRed"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.968 54.032C2.260 55.322 4.353 55.322 5.644 54.032L16.659 43.022L27.674 54.032C28.965 55.322 31.059 55.322 32.35 54.032C33.641 52.741 33.641 50.649 32.35 49.358L16.659 33.673L0.968 49.358C-0.323 50.649 -0.323 52.741 0.968 54.032Z"
                />
                {/* Green Pulse Shape */}
                <path
                    className="fill-green-700 animate-fillPulseGreen"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M53.817 0.97C55.108 2.262 55.108 4.358 53.817 5.651L16.652 42.878L0.968 27.168C-0.323 25.875 -0.323 23.78 0.968 22.487C2.259 21.194 4.351 21.194 5.642 22.487L16.652 33.515L49.144 0.97C50.434 -0.323 52.527 -0.323 53.817 0.97Z"
                />

            </g>
            <defs>
                <clipPath id="clip0_193_230">
                    <rect width="125" height="55" fill="white"/>
                </clipPath>
            </defs>

            <style jsx>{`
                @keyframes scalePulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }

                @keyframes fillPulseRed {
                    0%, 100% {
                        fill: #991b1b;
                    }
                    50% {
                        fill: #f87171;
                    }
                }

                @keyframes fillPulseGreen {
                    0%, 100% {
                        fill: #047857;
                    }
                    50% {
                        fill: #34d399;
                    }
                }

                @keyframes textShimmer {
                    0% {
                        fill: #a3a3a3;
                    }
                    50% {
                        fill: #e5e5e5;
                    }
                    100% {
                        fill: #a3a3a3;
                    }
                }

                .animate-scalePulse {
                    animation: scalePulse 2.5s ease-in-out infinite;
                }

                .animate-fillPulseRed {
                    animation: fillPulseRed 2s ease-in-out infinite;
                }

                .animate-fillPulseGreen {
                    animation: fillPulseGreen 2s ease-in-out infinite;
                }

                .animate-textShimmer {
                    animation: textShimmer 1.8s ease-in-out infinite;
                }
            `}</style>
        </svg>
    );
}

const SpaceTunnel = () => {
    const walls = [
        {
            id: "right",
            style: { transform: "rotateY(90deg) translateZ(500px)" },
        },
        {
            id: "left",
            style: { transform: "rotateY(-90deg) translateZ(500px)" },
        },
        { id: "top", style: { transform: "rotateX(90deg) translateZ(500px)" } },
        {
            id: "bottom",
            style: { transform: "rotateX(-90deg) translateZ(500px)" },
        },
        {
            id: "back",
            style: { transform: "rotateX(180deg) translateZ(500px)" },
        },
    ];

    const wrappers = [
        { id: 1, animationDelay: "0s" },
        { id: 2, animationDelay: "6s" },
    ];

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
            <style>{`
                @keyframes tunnel-move {
                    0% { transform: translateZ(-500px) rotate(0deg); }
                    100% { transform: translateZ(500px) rotate(0deg); }
                }
                @keyframes tunnel-fade {
                    0% { opacity: 0; }
                    25% { opacity: 1; }
                    75% { opacity: 1; }
                    100% { opacity: 0; }
                }
                .tunnel-wrap {
                    transform-style: preserve-3d;
                    animation: tunnel-move 12s infinite linear;
                    animation-fill-mode: forwards;
                }
                .tunnel-wall {
                    animation: tunnel-fade 12s infinite linear;
                }
            `}</style>

            <div
                className="relative perspective-[5px] perspective-origin-center"
                style={{ transformStyle: "preserve-3d" }}>
                {wrappers.map((wrap) => (
                    <div
                        key={wrap.id}
                        className="tunnel-wrap absolute left-1/2 top-1/2 -ml-[500px] -mt-[500px] h-[1000px] w-[1000px]"
                        style={{ animationDelay: wrap.animationDelay }}>
                        {walls.map((wall) => (
                            <div
                                key={wall.id}
                                className="tunnel-wall absolute h-full w-full opacity-0 bg-cover"
                                style={{
                                    ...wall.style,
                                    backgroundImage: `url('/login/space-tunnel-image.jpg')`,
                                    animationDelay: wrap.animationDelay,
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpaceTunnel;

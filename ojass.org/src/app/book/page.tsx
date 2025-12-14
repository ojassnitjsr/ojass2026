"use client";

import { Experience } from "@/components/book/Experience";
import { UI } from "@/components/book/UI";
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";

function App() {
    const [cameraZ, setCameraZ] = useState(6);

    useEffect(() => {
        const handleResize = () => setCameraZ(window.innerWidth > 800 ? 4 : 9);
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            <div className="absolute inset-0 bg-[url('/bg_main_eut.jpg')] z-1 bg-center bg-cover blur-xs" />
            <div className="absolute inset-0 bg-[url('/book/book_bg_eut_nobg.png')] z-2 bg-center bg-cover" />

            <div className="relative z-10 h-full w-full">
                <UI />
                <Loader />
                <Canvas
                    shadows
                    camera={{
                        position: [-0.5, 1, cameraZ],
                        fov: 45,
                    }}>
                    <group position-y={0}>
                        <Suspense fallback={null}>
                            <Experience />
                        </Suspense>
                    </group>
                </Canvas>
            </div>
        </div>
    );
}

export default App;

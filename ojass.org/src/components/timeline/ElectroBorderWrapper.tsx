"use client";

import dynamic from "next/dynamic";
import { CSSProperties, PropsWithChildren } from "react";

const ElectroBorder = dynamic(() => import("./ElectroBorder"), {
    ssr: false,
    loading: () => null,
});

export interface ElectroBorderProps extends PropsWithChildren {
    borderColor?: string;
    borderWidth?: number;
    distortion?: number;
    animationSpeed?: number;
    radius?: string | number;

    glow?: boolean;
    aura?: boolean;
    effects?: boolean;

    glowBlur?: number;
    className?: string;
    style?: CSSProperties;

    isMobile?: boolean;
}

export const ElectroBorderWrapper: React.FC<ElectroBorderProps> = (props) => {
    if (props.isMobile) return <>{props.children}</>;

    return <ElectroBorder {...props} />;
};

export default ElectroBorderWrapper;

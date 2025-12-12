/**
 * Type definitions for BrokenGlass component
 */

export interface Vertex {
    x: number;
    y: number;
}

export interface Cell {
    center: Vertex;
    vertices: Vertex[];
    centroid: Vertex;
}

export interface BoundingBox {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
}

export interface ShardState {
    x: number;
    y: number;
    rotation: number;
    scatteredX: number;
    scatteredY: number;
    scatteredRotation: number;
    targetX: number;
    targetY: number;
    targetRotation: number;
    vx: number;
    vy: number;
    vr: number;
}

export interface BrokenGlassProps {
    /** Image source URL or path */
    imageSrc: string;

    /** Number of rows for the grid (affects shard count) */
    rows?: number;

    /** Number of columns for the grid (affects shard count) */
    cols?: number;

    /** Canvas width in pixels */
    width?: number;

    /** Canvas height in pixels */
    height?: number;

    /** Initial state - true for assembled, false for scattered */
    initialAssembled?: boolean;

    /** Enable/disable controls */
    showControls?: boolean;

    /** Enable/disable click to toggle */
    clickToToggle?: boolean;

    /** Custom class name for the container */
    className?: string;

    /** Callback when assembly state changes */
    onToggle?: (isAssembled: boolean) => void;
}

export interface AnimationConfig {
    /** Spring stiffness for assembled state */
    assembledStiffness: number;

    /** Spring stiffness for scattered state */
    scatteredStiffness: number;

    /** Damping factor for assembled state */
    assembledDamping: number;

    /** Damping factor for scattered state */
    scatteredDamping: number;

    /** Rotation stiffness multiplier */
    rotationStiffness: number;

    /** Scatter distance multiplier */
    scatterDistance: number;

    /** Maximum rotation angle in radians */
    maxRotation: number;
}

export interface VoronoiConfig {
    /** Grid size for Voronoi calculation */
    gridSize: number;

    /** Minimum distance between points */
    minDistanceMultiplier: number;

    /** Maximum attempts to place a point */
    maxPlacementAttempts: number;
}

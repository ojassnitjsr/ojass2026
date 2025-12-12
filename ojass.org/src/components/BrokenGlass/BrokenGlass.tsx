"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';

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

interface Vertex {
    x: number;
    y: number;
}

interface Cell {
    center: Vertex;
    vertices: Vertex[];
    centroid: Vertex;
}

class Shard {
    cell: Cell;
    vertices: Vertex[];
    centroid: Vertex;
    image: HTMLImageElement | HTMLCanvasElement;
    imageOffsetX: number;
    imageOffsetY: number;
    imageWidth: number;
    imageHeight: number;
    bbox: {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
        width: number;
        height: number;
    };
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

    constructor(
        cell: Cell,
        image: HTMLImageElement | HTMLCanvasElement,
        imageOffsetX: number,
        imageOffsetY: number,
        imageWidth: number,
        imageHeight: number
    ) {
        this.cell = cell;
        this.vertices = cell.vertices;
        this.centroid = cell.centroid;
        this.image = image;
        this.imageOffsetX = imageOffsetX;
        this.imageOffsetY = imageOffsetY;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;

        this.bbox = this.calculateBoundingBox();

        this.x = this.centroid.x;
        this.y = this.centroid.y;
        this.rotation = 0;

        this.scatteredX = this.centroid.x;
        this.scatteredY = this.centroid.y;
        this.scatteredRotation = 0;

        this.targetX = this.centroid.x;
        this.targetY = this.centroid.y;
        this.targetRotation = 0;
        this.vx = 0;
        this.vy = 0;
        this.vr = 0;
    }

    calculateBoundingBox() {
        const xs = this.vertices.map((v) => v.x);
        const ys = this.vertices.map((v) => v.y);
        return {
            minX: Math.min(...xs),
            minY: Math.min(...ys),
            maxX: Math.max(...xs),
            maxY: Math.max(...ys),
            width: Math.max(...xs) - Math.min(...xs),
            height: Math.max(...ys) - Math.min(...ys),
        };
    }

    update(dt: number, isAssembled: boolean) {
        if (isAssembled) {
            this.targetX = this.centroid.x;
            this.targetY = this.centroid.y;
            this.targetRotation = 0;
        } else {
            this.targetX = this.scatteredX || this.x;
            this.targetY = this.scatteredY || this.y;
            this.targetRotation = this.scatteredRotation || this.rotation;
        }

        const stiffness = isAssembled ? 0.12 : 0.08;
        const damping = isAssembled ? 0.88 : 0.85;

        this.vx += (this.targetX - this.x) * stiffness;
        this.vy += (this.targetY - this.y) * stiffness;
        this.vr += (this.targetRotation - this.rotation) * stiffness * 0.4;

        this.vx *= damping;
        this.vy *= damping;
        this.vr *= damping;

        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.rotation += this.vr * dt;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.beginPath();
        this.vertices.forEach((vertex, index) => {
            const relativeX = vertex.x - this.centroid.x;
            const relativeY = vertex.y - this.centroid.y;
            if (index === 0) {
                ctx.moveTo(relativeX, relativeY);
            } else {
                ctx.lineTo(relativeX, relativeY);
            }
        });
        ctx.closePath();
        ctx.clip();

        const scaleX =
            this.image instanceof HTMLImageElement
                ? this.image.naturalWidth / this.imageWidth
                : this.image.width / this.imageWidth;
        const scaleY =
            this.image instanceof HTMLImageElement
                ? this.image.naturalHeight / this.imageHeight
                : this.image.height / this.imageHeight;

        ctx.drawImage(
            this.image,
            this.imageOffsetX * scaleX,
            this.imageOffsetY * scaleY,
            this.imageWidth * scaleX,
            this.imageHeight * scaleY,
            -this.centroid.x,
            -this.centroid.y,
            this.imageWidth,
            this.imageHeight
        );

        ctx.restore();
    }

    scatter(W: number, H: number) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * Math.min(W, H) * 0.08;

        this.scatteredX = this.centroid.x + Math.cos(angle) * distance;
        this.scatteredY = this.centroid.y + Math.sin(angle) * distance;
        this.scatteredRotation = (Math.random() - 0.5) * Math.PI * 0.5;

        this.vx = Math.cos(angle) * distance * 0.02;
        this.vy = Math.sin(angle) * distance * 0.02;
        this.vr = (Math.random() - 0.5) * 0.05;
    }
}

const BrokenGlass: React.FC<BrokenGlassProps> = ({
    imageSrc,
    rows = 12,
    cols = 12,
    width = 800,
    height = 800,
    initialAssembled = false,
    showControls = true,
    clickToToggle = true,
    className = '',
    onToggle,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isAssembled, setIsAssembled] = useState(initialAssembled);
    const [shardCount, setShardCount] = useState(0);
    const [currentRows, setCurrentRows] = useState(rows);
    const [currentCols, setCurrentCols] = useState(cols);

    const shardsRef = useRef<Shard[]>([]);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const animationIdRef = useRef<number | null>(null);
    const imageLoadedRef = useRef(false);
    const canvasSizeRef = useRef({ W: width, H: height });

    const createConvexHull = useCallback((points: Vertex[]): Vertex[] => {
        if (points.length < 3) return points;

        const sorted = points.slice().sort((a, b) => a.x - b.x || a.y - b.y);
        const lower: Vertex[] = [];
        const upper: Vertex[] = [];

        const cross = (o: Vertex, a: Vertex, b: Vertex) => {
            return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
        };

        for (const point of sorted) {
            while (
                lower.length >= 2 &&
                cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0
            ) {
                lower.pop();
            }
            lower.push(point);
        }

        for (let i = sorted.length - 1; i >= 0; i--) {
            const point = sorted[i];
            while (
                upper.length >= 2 &&
                cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0
            ) {
                upper.pop();
            }
            upper.push(point);
        }

        lower.pop();
        upper.pop();
        return lower.concat(upper);
    }, []);

    const createVoronoiCells = useCallback((
        points: Vertex[],
        offsetX: number,
        offsetY: number,
        imageWidth: number,
        imageHeight: number
    ): Cell[] => {
        const cells: Cell[] = [];
        const gridSize = 2;
        const gridWidth = Math.ceil(imageWidth / gridSize);
        const gridHeight = Math.ceil(imageHeight / gridSize);

        const grid = Array(gridHeight)
            .fill(null)
            .map(() => Array(gridWidth).fill(-1));

        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                const worldX = offsetX + x * gridSize;
                const worldY = offsetY + y * gridSize;

                let minDist = Infinity;
                let closestPoint = 0;

                for (let i = 0; i < points.length; i++) {
                    const dist = Math.sqrt(
                        Math.pow(worldX - points[i].x, 2) +
                        Math.pow(worldY - points[i].y, 2)
                    );
                    if (dist < minDist) {
                        minDist = dist;
                        closestPoint = i;
                    }
                }

                grid[y][x] = closestPoint;
            }
        }

        for (let i = 0; i < points.length; i++) {
            const cell: Cell = {
                center: points[i],
                vertices: [],
                centroid: { x: 0, y: 0 },
            };

            const cellPixels: Vertex[] = [];
            for (let y = 0; y < gridHeight; y++) {
                for (let x = 0; x < gridWidth; x++) {
                    if (grid[y][x] === i) {
                        cellPixels.push({
                            x: offsetX + x * gridSize,
                            y: offsetY + y * gridSize,
                        });
                    }
                }
            }

            if (cellPixels.length === 0) continue;

            cell.centroid.x =
                cellPixels.reduce((sum, p) => sum + p.x, 0) / cellPixels.length;
            cell.centroid.y =
                cellPixels.reduce((sum, p) => sum + p.y, 0) / cellPixels.length;

            cell.vertices = createConvexHull(cellPixels);

            cells.push(cell);
        }

        return cells;
    }, [createConvexHull]);

    const createShards = useCallback(() => {
        if (!imageLoadedRef.current || !imageRef.current) {
            console.log('Image not loaded yet');
            return;
        }

        const { W, H } = canvasSizeRef.current;
        shardsRef.current = [];
        const numShards = currentRows * currentCols;

        const image = imageRef.current;
        const imageAspect = image.naturalWidth / image.naturalHeight;
        const canvasAspect = W / H;

        let imageWidth: number, imageHeight: number, offsetX: number, offsetY: number;

        // Use 'cover' mode - image fills canvas completely, centered, maintaining aspect ratio
        if (imageAspect > canvasAspect) {
            // Image is wider - fit to height, center horizontally
            imageHeight = H;
            imageWidth = H * imageAspect;
            offsetX = (W - imageWidth) / 2;
            offsetY = 0;
        } else {
            // Image is taller - fit to width, center vertically
            imageWidth = W;
            imageHeight = W / imageAspect;
            offsetX = 0;
            offsetY = (H - imageHeight) / 2;
        }

        const points: Vertex[] = [];
        const minDistance = (Math.min(imageWidth, imageHeight) / Math.sqrt(numShards)) * 0.8;

        for (let i = 0; i < numShards; i++) {
            let attempts = 0;
            let point: Vertex;

            do {
                point = {
                    x: offsetX + Math.random() * imageWidth,
                    y: offsetY + Math.random() * imageHeight,
                };
                attempts++;
            } while (
                attempts < 30 &&
                points.some(
                    (p) =>
                        Math.sqrt(Math.pow(p.x - point.x, 2) + Math.pow(p.y - point.y, 2)) <
                        minDistance
                )
            );

            points.push(point);
        }

        const cells = createVoronoiCells(points, offsetX, offsetY, imageWidth, imageHeight);

        cells.forEach((cell) => {
            const shard = new Shard(cell, image, offsetX, offsetY, imageWidth, imageHeight);
            shardsRef.current.push(shard);
        });

        setShardCount(shardsRef.current.length);

        // Scatter shards with staggered timing
        shardsRef.current.forEach((shard) => {
            setTimeout(() => {
                shard.scatter(W, H);
            }, Math.random() * 1000);
        });
    }, [currentRows, currentCols, createVoronoiCells]);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { W, H } = canvasSizeRef.current;
        const dt = 16.666 / 1000;

        shardsRef.current.forEach((shard) => shard.update(dt, isAssembled));

        ctx.clearRect(0, 0, W, H);

        shardsRef.current.forEach((shard) => {
            shard.draw(ctx);
        });

        animationIdRef.current = requestAnimationFrame(animate);
    }, [isAssembled]);

    const toggle = () => {
        const newState = !isAssembled;
        setIsAssembled(newState);

        if (!newState) {
            const { W, H } = canvasSizeRef.current;
            shardsRef.current.forEach((shard, index) => {
                setTimeout(() => {
                    shard.scatter(W, H);
                }, index * 20);
            });
        }

        onToggle?.(newState);
    };

    const randomize = useCallback(() => {
        createShards();
        setIsAssembled(false);
        onToggle?.(false);
    }, [createShards, onToggle]);

    // Initialize image and canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const { W, H } = canvasSizeRef.current;
        canvas.width = W;
        canvas.height = H;

        const image = new Image();
        imageRef.current = image;

        image.onload = () => {
            console.log('Image loaded successfully');
            imageLoadedRef.current = true;
            createShards();
            animate();
        };

        image.onerror = () => {
            console.error('Failed to load image');
            // Create fallback gradient
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = W;
            tempCanvas.height = H;
            const tempCtx = tempCanvas.getContext('2d');

            if (tempCtx) {
                const gradient = tempCtx.createLinearGradient(0, 0, W, H);
                gradient.addColorStop(0, '#ff6b6b');
                gradient.addColorStop(0.5, '#4ecdc4');
                gradient.addColorStop(1, '#45b7d1');
                tempCtx.fillStyle = gradient;
                tempCtx.fillRect(0, 0, W, H);

                tempCtx.fillStyle = 'white';
                tempCtx.font = '48px Arial';
                tempCtx.textAlign = 'center';
                tempCtx.fillText('Image Failed', W / 2, H / 2);

                imageRef.current = tempCanvas as unknown as HTMLImageElement;
                imageLoadedRef.current = true;
                createShards();
                animate();
            }
        };

        image.src = imageSrc;

        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
        };
    }, [imageSrc, animate, createShards]);

    // Update shards when rows/cols change
    useEffect(() => {
        if (imageLoadedRef.current) {
            randomize();
        }
    }, [currentRows, currentCols, randomize]);

    // Update assembled state when initialAssembled prop changes (theme change)
    useEffect(() => {
        setIsAssembled(initialAssembled);
    }, [initialAssembled]);

    const handleCanvasClick = () => {
        if (clickToToggle) {
            toggle();
        }
    };

    return (
        <div className={`broken-glass-container ${className}`}>
            <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    background: 'transparent',
                    cursor: clickToToggle ? 'pointer' : 'default',
                }}
            />

            {showControls && (
                <div style={{ marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                        onClick={toggle}
                        style={{
                            background: '#0b74ff',
                            border: 'none',
                            color: '#fff',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        {isAssembled ? 'Scatter' : 'Assemble'}
                    </button>
                    <button
                        onClick={randomize}
                        style={{
                            background: '#0b74ff',
                            border: 'none',
                            color: '#fff',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        Randomize shards
                    </button>
                    <div style={{ flex: 1 }} />
                    <label style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>
                        Rows{' '}
                        <input
                            type="range"
                            min="4"
                            max="32"
                            value={currentRows}
                            onChange={(e) => setCurrentRows(parseInt(e.target.value))}
                        />
                    </label>
                    <label style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>
                        Cols{' '}
                        <input
                            type="range"
                            min="4"
                            max="32"
                            value={currentCols}
                            onChange={(e) => setCurrentCols(parseInt(e.target.value))}
                        />
                    </label>
                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>
                        Pieces: {shardCount}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrokenGlass;

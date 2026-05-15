import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Boid, type SimulationConfig } from '../engine/Boid';
import { Vector } from '../engine/Vector';

interface CanvasViewProps {
	config: SimulationConfig;
}

export interface CanvasRef {
	exportPNG: () => void;
}

export const CanvasView = forwardRef<CanvasRef, CanvasViewProps>(({ config }, ref) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const configRef = useRef<SimulationConfig>(config);
	const mouseRef = useRef<Vector | null>(null);

	// Text Dragging State
	const textPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
	const isDraggingRef = useRef(false);

	useEffect(() => {
		configRef.current = config;
	}, [config]);

	// Expose the export functionality to the parent App component
	useImperativeHandle(ref, () => ({
		exportPNG: () => {
			const canvas = canvasRef.current;
			if (!canvas) return;
			const dataUrl = canvas.toDataURL('image/png');
			const link = document.createElement('a');
			link.download = 'boids-banner.png';
			link.href = dataUrl;
			link.click();
		}
	}));

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let animationFrameId: number;
		const boids: Boid[] = [];
		const numBoids = 75;

		// --- Dragging & Interaction Logic ---
		const handleMouseDown = (e: MouseEvent) => {
			if (!configRef.current.bannerText) return;

			const rect = canvas.getBoundingClientRect();
			const clickX = e.clientX - rect.left;
			const clickY = e.clientY - rect.top;

			ctx.font = `normal 15vw ${configRef.current.fontFamily}`;
			const metrics = ctx.measureText(configRef.current.bannerText);
			const textWidth = metrics.width;
			const textHeight = window.innerWidth * 0.15; // Approximate height based on 15vw

			// Check if click is inside the text bounding box
			const dx = Math.abs(clickX - textPosRef.current.x);
			const dy = Math.abs(clickY - textPosRef.current.y);

			if (dx < textWidth / 2 && dy < textHeight / 2) {
				isDraggingRef.current = true;
				canvas.style.cursor = 'grabbing';
			}
		};

		const handleMouseMove = (e: MouseEvent) => {
			const rect = canvas.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			const dpr = window.devicePixelRatio || 1;
			mouseRef.current = new Vector(x * dpr, y * dpr);

			if (isDraggingRef.current) {
				textPosRef.current = { x, y };
			}
		};

		const handleMouseUp = () => {
			isDraggingRef.current = false;
			canvas.style.cursor = 'default';
		};

		const handleMouseLeave = () => {
			mouseRef.current = null;
			isDraggingRef.current = false;
			canvas.style.cursor = 'default';
		};

		canvas.addEventListener('mousedown', handleMouseDown);
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
		canvas.addEventListener('mouseleave', handleMouseLeave);

		const resizeCanvas = () => {
			const dpr = window.devicePixelRatio || 1;
			canvas.width = window.innerWidth * dpr;
			canvas.height = window.innerHeight * dpr;
			canvas.style.width = `${window.innerWidth}px`;
			canvas.style.height = `${window.innerHeight}px`;
			ctx.scale(dpr, dpr);

			// Recenter text on resize if it hasn't been dragged
			if (!isDraggingRef.current) {
				textPosRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
			}
		};

		window.addEventListener('resize', resizeCanvas);
		resizeCanvas();

		for (let i = 0; i < numBoids; i++) {
			boids.push(new Boid(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
		}

		// --- Render Loop ---
		const render = () => {
			ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

			const { bannerText, fontFamily, boidColor } = configRef.current;

			if (bannerText) {
				ctx.font = `normal 15vw ${fontFamily}`;
				ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(bannerText, textPosRef.current.x, textPosRef.current.y);
			}

			ctx.font = 'bold 16px "Fira Code", "JetBrains Mono", monospace';
			ctx.fillStyle = boidColor;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';

			const glyphs = ['>', '↘', 'v', '↙', '<', '↖', '^', '↗'];

			const currentMouse = mouseRef.current
				? new Vector(mouseRef.current.x / (window.devicePixelRatio || 1), mouseRef.current.y / (window.devicePixelRatio || 1))
				: null;

			for (const boid of boids) {
				boid.flock(boids, configRef.current, currentMouse);
				boid.update();
				boid.borders(window.innerWidth, window.innerHeight);

				const heading = Math.atan2(boid.velocity.y, boid.velocity.x);
				let octant = Math.round(8 * heading / (2 * Math.PI));
				octant = (octant + 8) % 8;

				ctx.fillText(glyphs[octant], boid.position.x, boid.position.y);
			}

			animationFrameId = requestAnimationFrame(render);
		};

		render();

		return () => {
			canvas.removeEventListener('mousedown', handleMouseDown);
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
			canvas.removeEventListener('mouseleave', handleMouseLeave);
			window.removeEventListener('resize', resizeCanvas);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="absolute inset-0 block w-full h-full cursor-default"
		/>
	);
});
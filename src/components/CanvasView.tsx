import { useEffect, useRef } from 'react';
import { Boid, type SimulationConfig } from '../engine/Boid';

interface CanvasViewProps {
	config: SimulationConfig;
}

export function CanvasView({ config }: CanvasViewProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const configRef = useRef<SimulationConfig>(config);

	useEffect(() => {
		configRef.current = config;
	}, [config]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let animationFrameId: number;
		const boids: Boid[] = [];
		const numBoids = 75;

		const resizeCanvas = () => {
			const dpr = window.devicePixelRatio || 1;

			canvas.width = window.innerWidth * dpr;
			canvas.height = window.innerHeight * dpr;

			canvas.style.width = `${window.innerWidth}px`;
			canvas.style.height = `${window.innerHeight}px`;

			ctx.scale(dpr, dpr);
		};

		window.addEventListener('resize', resizeCanvas);
		resizeCanvas();

		for (let i = 0; i < numBoids; i++) {
			boids.push(new Boid(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
		}

		const render = () => {
			ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

			ctx.font = 'bold 16px "Fira Code", "JetBrains Mono", monospace';
			ctx.fillStyle = '#064e3b';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';

			const glyphs = ['>', '↘', 'v', '↙', '<', '↖', '^', '↗'];

			for (const boid of boids) {
				boid.flock(boids, configRef.current);
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
			window.removeEventListener('resize', resizeCanvas);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="absolute inset-0 block w-full h-full pointer-events-none"
		/>
	);
}
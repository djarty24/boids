import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Boid, type SimulationConfig } from '../engine/Boid';
import { Vector } from '../engine/Vector';
import GIF from 'gif.js';

interface CanvasViewProps {
	config: SimulationConfig;
}

export interface CanvasRef {
	exportGIF: (onComplete: () => void) => void;
}

export const CanvasView = forwardRef<CanvasRef, CanvasViewProps>(({ config }, ref) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const configRef = useRef<SimulationConfig>(config);
	const mouseRef = useRef<Vector | null>(null);

	const textPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
	const isDraggingRef = useRef(false);

	const isRecordingRef = useRef(false);
	const gifRef = useRef<GIF | null>(null);
	const frameCountRef = useRef(0);
	const recordedFramesRef = useRef(0);
	const onCompleteRef = useRef<(() => void) | null>(null);

	useEffect(() => {
		configRef.current = config;
	}, [config]);

	const resizeCanvas = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		canvas.width = window.innerWidth * dpr;
		canvas.height = window.innerHeight * dpr;
		canvas.style.width = `${window.innerWidth}px`;
		canvas.style.height = `${window.innerHeight}px`;
		ctx.scale(dpr, dpr);

		if (!isDraggingRef.current && !isRecordingRef.current) {
			textPosRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
		}
	};

	useImperativeHandle(ref, () => ({
		exportGIF: (onComplete) => {
			const canvas = canvasRef.current;
			if (!canvas || isRecordingRef.current) return;

			onCompleteRef.current = onComplete;
			isRecordingRef.current = true;
			frameCountRef.current = 0;
			recordedFramesRef.current = 0;

			canvas.width = 1200;
			canvas.height = 400;
			canvas.style.width = '1200px';
			canvas.style.height = '400px';

			textPosRef.current = { x: 600, y: 200 };

			gifRef.current = new GIF({
				workers: 2,
				quality: 10,
				width: 1200,
				height: 400,
				workerScript: '/gif.worker.js',
				transparent: null
			});

			gifRef.current.on('finished', (blob: Blob) => {
				const url = URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.download = 'github-banner.gif';
				link.href = url;
				link.click();

				isRecordingRef.current = false;
				if (onCompleteRef.current) onCompleteRef.current();
				resizeCanvas();
			});
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

		const handleMouseDown = (e: MouseEvent) => {
			if (!configRef.current.bannerText) return;
			const rect = canvas.getBoundingClientRect();
			const clickX = e.clientX - rect.left;
			const clickY = e.clientY - rect.top;
			ctx.font = `normal 15vw ${configRef.current.fontFamily}`;
			const metrics = ctx.measureText(configRef.current.bannerText);
			const dx = Math.abs(clickX - textPosRef.current.x);
			const dy = Math.abs(clickY - textPosRef.current.y);
			if (dx < metrics.width / 2 && dy < (window.innerWidth * 0.15) / 2) {
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
			if (isDraggingRef.current) textPosRef.current = { x, y };
		};
		const handleMouseUp = () => { isDraggingRef.current = false; canvas.style.cursor = 'default'; };
		const handleMouseLeave = () => { mouseRef.current = null; isDraggingRef.current = false; canvas.style.cursor = 'default'; };

		canvas.addEventListener('mousedown', handleMouseDown);
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
		canvas.addEventListener('mouseleave', handleMouseLeave);
		window.addEventListener('resize', resizeCanvas);

		resizeCanvas();

		for (let i = 0; i < numBoids; i++) {
			boids.push(new Boid(Math.random() * 1200, Math.random() * 400));
		}

		const render = (time: number) => {
			const { bannerText, fontFamily, boidColor, skyColors } = configRef.current;
			const renderWidth = isRecordingRef.current ? 1200 : window.innerWidth;
			const renderHeight = isRecordingRef.current ? 400 : window.innerHeight;

			const angle = time * 0.0002;
			const x2 = renderWidth * (0.5 + 0.5 * Math.cos(angle));
			const y2 = renderHeight * (0.5 + 0.5 * Math.sin(angle));
			const gradient = ctx.createLinearGradient(0, 0, x2, y2);
			gradient.addColorStop(0, skyColors.c1);
			gradient.addColorStop(0.5, skyColors.c2);
			gradient.addColorStop(1, skyColors.c3);

			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, renderWidth, renderHeight);

			if (bannerText) {
				const fontSize = isRecordingRef.current ? '180px' : '15vw';
				ctx.font = `normal ${fontSize} ${fontFamily}`;
				ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(bannerText, textPosRef.current.x, textPosRef.current.y);
			}

			ctx.font = 'bold 16px "Fira Code", "JetBrains Mono", monospace';
			ctx.fillStyle = boidColor;

			const glyphs = ['>', '↘', 'v', '↙', '<', '↖', '^', '↗'];
			const currentMouse = mouseRef.current && !isRecordingRef.current
				? new Vector(mouseRef.current.x / (window.devicePixelRatio || 1), mouseRef.current.y / (window.devicePixelRatio || 1))
				: null;

			for (const boid of boids) {
				boid.flock(boids, configRef.current, currentMouse);
				boid.update();
				boid.borders(renderWidth, renderHeight);
				const heading = Math.atan2(boid.velocity.y, boid.velocity.x);
				let octant = Math.round(8 * heading / (2 * Math.PI));
				octant = (octant + 8) % 8;
				ctx.fillText(glyphs[octant], boid.position.x, boid.position.y);
			}

			if (isRecordingRef.current && gifRef.current) {
				if (frameCountRef.current % 2 === 0) {
					gifRef.current.addFrame(ctx, { copy: true, delay: 33 });
					recordedFramesRef.current++;
				}
				if (recordedFramesRef.current >= 120) {
					gifRef.current.render();
					isRecordingRef.current = false;
				}
			}

			frameCountRef.current++;
			animationFrameId = requestAnimationFrame(render);
		};

		animationFrameId = requestAnimationFrame(render);

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
		<canvas ref={canvasRef} className={`absolute inset-0 block w-full h-full ${isRecordingRef.current ? 'pointer-events-none' : ''}`} />
	);
});
import { useEffect, useRef } from 'react';
import { Boid } from '../engine/Boid';

export function CanvasView() {
const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
	const canvas = canvasRef.current;
	if (!canvas) return;

	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	let animationFrameId: number;
	const boids: Boid[] = [];
	const numBoids = 150;

	const resizeCanvas = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	};

	window.addEventListener('resize', resizeCanvas);
	resizeCanvas();

	for (let i = 0; i < numBoids; i++) {
	boids.push(new Boid(Math.random() * canvas.width, Math.random() * canvas.height));
	}

	const render = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = '#065f46';

	for (const boid of boids) {
		boid.flock(boids);
		boid.update();
		boid.borders(canvas.width, canvas.height);

		ctx.beginPath();
		ctx.arc(boid.position.x, boid.position.y, 3, 0, Math.PI * 2);
		ctx.fill();
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
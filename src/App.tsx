import { useState, useEffect, useRef } from 'react';
import { CanvasView, type CanvasRef } from './components/CanvasView';
import { ControlPanel } from './components/ControlPanel';
import { EducationalModal } from './components/EducationalModal';
import type { SimulationConfig } from './engine/Boid';

function App() {
	const canvasRef = useRef<CanvasRef>(null);

	const [config, setConfig] = useState<SimulationConfig>({
		separationWeight: 1.5,
		alignmentWeight: 1.0,
		cohesionWeight: 1.0,
		maxSpeed: 4.0,
		bannerText: '',
		boidColor: '#082f49',
		fontFamily: '"Instrument Serif", serif',
		skyColors: { c1: '#bae6fd', c2: '#ccfbf1', c3: '#cffafe' }
	});

	useEffect(() => {
		document.documentElement.style.setProperty('--sky-1', config.skyColors.c1);
		document.documentElement.style.setProperty('--sky-2', config.skyColors.c2);
		document.documentElement.style.setProperty('--sky-3', config.skyColors.c3);
	}, [config.skyColors]);

	const handleExport = () => {
		if (canvasRef.current) {
			canvasRef.current.exportPNG();
		}
	};

	return (
		<main className="relative w-screen h-screen overflow-hidden bg-sky-50">
			<div className="absolute inset-0 z-0 animate-gradient" />
			<CanvasView ref={canvasRef} config={config} />
			<ControlPanel config={config} setConfig={setConfig} onExport={handleExport} />
			<EducationalModal />
		</main>
	)
}

export default App;
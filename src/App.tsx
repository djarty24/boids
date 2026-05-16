import { useState, useRef } from 'react';
import { CanvasView, type CanvasRef } from './components/CanvasView';
import { ControlPanel } from './components/ControlPanel';
import { EducationalModal } from './components/EducationalModal';
import type { SimulationConfig } from './engine/Boid';

function App() {
	const canvasRef = useRef<CanvasRef>(null);
	const [isRecording, setIsRecording] = useState(false);

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

	const handleExport = () => {
		setIsRecording(true);
		if (canvasRef.current) {
			canvasRef.current.exportGIF(() => setIsRecording(false));
		}
	};

	return (
		<main className="relative w-screen h-screen overflow-hidden bg-sky-50">
			<CanvasView ref={canvasRef} config={config} />
			<ControlPanel config={config} setConfig={setConfig} onExport={handleExport} isRecording={isRecording} />
			<EducationalModal />
		</main>
	)
}

export default App;
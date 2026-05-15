import { useState } from 'react';
import { CanvasView } from './components/CanvasView';
import { ControlPanel } from './components/ControlPanel';
import type { SimulationConfig } from './engine/Boid';

function App() {
	const [config, setConfig] = useState<SimulationConfig>({
		separationWeight: 1.5,
		alignmentWeight: 1.0,
		cohesionWeight: 1.0,
		maxSpeed: 4.0,
	});

	return (
		<main className="relative w-screen h-screen overflow-hidden bg-sky-50">
			<div className="absolute inset-0 z-0 animate-gradient bg-linear-to-br from-sky-200 via-teal-100 to-cyan-100" />
			<CanvasView config={config} />
			<ControlPanel config={config} setConfig={setConfig} />
		</main>
	)
}

export default App
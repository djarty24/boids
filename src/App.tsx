import { useState } from 'react';
import { CanvasView } from './components/CanvasView';
import type { SimulationConfig } from './engine/Boid';

function App() {
  const [config, setConfig] = useState<SimulationConfig>({
    separationWeight: 1.5,
    alignmentWeight: 1.0,
    cohesionWeight: 1.0,
    maxSpeed: 4.0,
  });

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-green-50">
      <div className="absolute inset-0 z-0 animate-gradient bg-linear-to-br from-green-200 via-emerald-100 to-rose-100" />
      <CanvasView config={config} />
    </main>
  )
}

export default App
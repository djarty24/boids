import { CanvasView } from './components/CanvasView';

function App() {
return (
	<main className="relative w-screen h-screen overflow-hidden bg-green-50">
	<div className="absolute inset-0 z-0 bg-linear-to-br from-green-100 via-emerald-50 to-rose-50" />
	<CanvasView />
	</main>
)
}

export default App
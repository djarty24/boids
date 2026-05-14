function App() {
return (
	<main className="relative w-screen h-screen overflow-hidden bg-green-50">
	<div className="absolute inset-0 z-0 bg-linear-to-br from-green-100 via-emerald-50 to-rose-50" />
	
	<div className="relative z-10 flex items-center justify-center w-full h-full">
		<h1 className="text-rose-400 font-mono text-2xl tracking-widest uppercase">Boids Initialized</h1>
	</div>
	</main>
)
}

export default App
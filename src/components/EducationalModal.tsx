import { useState } from 'react';

export function EducationalModal() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="absolute top-8 right-8 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-xl border border-white/40 shadow-lg text-slate-700 hover:bg-white/40 hover:scale-105 transition-all cursor-pointer"
				aria-label="Learn about the Boids algorithm"
			>
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
					<circle cx="12" cy="12" r="10"></circle>
					<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
					<line x1="12" y1="17" x2="12.01" y2="17"></line>
				</svg>
			</button>

			{isOpen && (
				<div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-sky-900/20 backdrop-blur-sm transition-opacity">
					<div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 md:p-12 rounded-4xl bg-white/60 backdrop-blur-2xl backdrop-saturate-150 border border-white/40 shadow-[0_16px_64px_rgba(0,0,0,0.1)] text-slate-800 font-sans">

						<button
							onClick={() => setIsOpen(false)}
							className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/40 transition-colors text-slate-500 hover:text-slate-800"
							aria-label="Close modal"
						>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<line x1="18" y1="6" x2="6" y2="18"></line>
								<line x1="6" y1="6" x2="18" y2="18"></line>
							</svg>
						</button>

						<h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6 leading-tight">
							How does the Boids Algorithm Work?
						</h2>

						<div className="space-y-8 text-sm md:text-base leading-relaxed text-slate-700">
							<p className="text-lg font-medium text-slate-800">
								Boids (stands for bird-oid object!) is an artificial life program developed by Craig Reynolds in 1987. It simulates the flocking behavior of birds using three forces.
							</p>

							<div>
								<h3 className="text-sm font-bold text-slate-900 tracking-widest uppercase mb-2">1. Separation</h3>
								<p>Boids steer to avoid crowding local flocks. If another boid enters another flock's radius, a new vector is calculated to push them away from each other, which stops the flock from collapsing into one point.</p>
							</div>

							<div>
								<h3 className="text-sm font-bold text-slate-900 tracking-widest uppercase mb-2">2. Alignment</h3>
								<p>Boids steer towards the average heading of their local flockmates. By looking at the velocity of their neighbors and adjusting their own velocity to match, we can get them to move synchronously in a unified direction.</p>
							</div>

							<div>
								<h3 className="text-sm font-bold text-slate-900 tracking-widest uppercase mb-2">3. Cohesion</h3>
								<p>Boids steer to move towards the center of mass of their local flockmates. This keeps the group together. The swirly movements you see are known as murmurations.</p>
							</div>

							<div className="pt-8 border-t border-slate-900/10">
								<h4 className="font-bold text-slate-900 tracking-widest uppercase text-xs mb-4">References (These are the ones I used to learn the algorithm!)</h4>
								<ul className="space-y-3 list-none text-slate-600">
									<li>
										<a href="https://www.red3d.com/cwr/boids/" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-sky-600 transition-colors font-medium">
											<span>Craig Reynolds' Original Paper (1987)</span>
											<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
										</a>
									</li>
									<li>
										<a href="http://www.vergenet.net/~conrad/boids/pseudocode.html" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-sky-600 transition-colors font-medium">
											<span>Boids Pseudocode Reference</span>
											<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
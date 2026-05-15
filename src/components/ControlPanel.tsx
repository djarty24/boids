import type { SimulationConfig } from '../engine/Boid';

interface ControlPanelProps {
	config: SimulationConfig;
	setConfig: React.Dispatch<React.SetStateAction<SimulationConfig>>;
}

interface StepperProps {
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	onChange: (val: number) => void;
}

function Stepper({ label, value, min, max, step, onChange }: StepperProps) {
	const handleDec = () => onChange(Math.max(min, Number((value - step).toFixed(1))));
	const handleInc = () => onChange(Math.min(max, Number((value + step).toFixed(1))));

	const progress = ((value - min) / (max - min)) * 100;

	return (
		<div className="relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 border border-white/20 overflow-hidden">
			<div
				className="absolute left-0 bottom-0 h-1 bg-sky-400/50 transition-all duration-300"
				style={{ width: `${progress}%` }}
			/>
			<span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">
				{label}
			</span>
			<div className="flex items-center gap-4 z-10">
				<button
					onClick={handleDec}
					className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-slate-700 transition-colors cursor-pointer shadow-sm"
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
						<path d="M5 12h14" />
					</svg>
				</button>
				<span className="text-lg font-medium text-slate-800 w-12 text-center tabular-nums">
					{value.toFixed(1)}
				</span>
				<button
					onClick={handleInc}
					className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-slate-700 transition-colors cursor-pointer shadow-sm"
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
						<path d="M12 5v14M5 12h14" />
					</svg>
				</button>
			</div>
		</div>
	);
}

export function ControlPanel({ config, setConfig }: ControlPanelProps) {
	const updateParam = (key: keyof SimulationConfig, value: number) => {
		setConfig(prev => ({ ...prev, [key]: value }));
	};

	return (
		<div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl p-4 rounded-4xl bg-white/20 backdrop-blur-2xl backdrop-saturate-150 border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex flex-col md:flex-row items-center gap-6 font-sans transition-all">
			<h2 className="text-3xl font-serif text-slate-900 px-6">Controls</h2>

			<div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
				<Stepper label="Separation" value={config.separationWeight} min={0} max={5} step={0.1} onChange={(v) => updateParam('separationWeight', v)}/>
				<Stepper label="Alignment" value={config.alignmentWeight} min={0} max={5} step={0.1} onChange={(v) => updateParam('alignmentWeight', v)}/>
				<Stepper label="Cohesion" value={config.cohesionWeight} min={0} max={5} step={0.1} onChange={(v) => updateParam('cohesionWeight', v)}/>
				<Stepper label="Max Speed" value={config.maxSpeed} min={1} max={10} step={0.5} onChange={(v) => updateParam('maxSpeed', v)}/>
			</div>
		</div>
	);
}
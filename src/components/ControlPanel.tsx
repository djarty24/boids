import { useState } from 'react';
import type { SimulationConfig } from '../engine/Boid';

interface ControlPanelProps {
	config: SimulationConfig;
	setConfig: React.Dispatch<React.SetStateAction<SimulationConfig>>;
	onExport: () => void;
	isRecording: boolean;
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
			<div className="absolute left-0 bottom-0 h-1 bg-sky-400/50 transition-all duration-300" style={{ width: `${progress}%` }} />
			<span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">{label}</span>
			<div className="flex items-center gap-4 z-10">
				<button onClick={handleDec} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-slate-700 transition-colors cursor-pointer shadow-sm">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14" /></svg>
				</button>
				<span className="text-lg font-medium text-slate-800 w-12 text-center tabular-nums">{value.toFixed(1)}</span>
				<button onClick={handleInc} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-slate-700 transition-colors cursor-pointer shadow-sm">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
				</button>
			</div>
		</div>
	);
}

export function ControlPanel({ config, setConfig, onExport, isRecording }: ControlPanelProps) {
	const [isCollapsed, setIsCollapsed] = useState(false); // NEW: Collapse state

	const updateParam = (key: keyof SimulationConfig, value: any) => {
		setConfig(prev => ({ ...prev, [key]: value }));
	};

	const updateSky = (index: keyof typeof config.skyColors, color: string) => {
		setConfig(prev => ({ ...prev, skyColors: { ...prev.skyColors, [index]: color } }));
	};

	return (
		<div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl p-6 bg-white/20 backdrop-blur-2xl backdrop-saturate-150 border-2 border-slate-700/50 shadow-[8px_8px_0px_rgba(15,23,42,0.1)] flex flex-col font-sans transition-all duration-500 handdrawn-panel`}>

			<div className="flex items-center justify-between w-full px-2 md:px-6">
				<h2 className="text-3xl font-serif text-slate-900">Controls</h2>
				<button
					onClick={() => setIsCollapsed(!isCollapsed)}
					className="p-2 border-2 border-slate-700/30 hover:bg-white/30 text-slate-800 transition-colors handdrawn-button"
					title={isCollapsed ? "Expand Controls" : "Collapse Controls"}
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
					>
						<polyline points="6 9 12 15 18 9"></polyline>
					</svg>
				</button>
			</div>

			<div className={`w-full overflow-hidden transition-all duration-500 ease-in-out flex flex-col ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-200 opacity-100 mt-4'}`}>

				<div className="flex flex-col md:flex-row items-center gap-6 w-full">
					<div className="flex flex-col items-center md:items-start px-6 gap-2">
						<div className="flex gap-2 bg-white/30 p-2 border-2 border-slate-700/30 handdrawn-button">
							<input type="color" value={config.skyColors.c1} onChange={(e) => updateSky('c1', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none bg-transparent" title="Sky Color 1" />
							<input type="color" value={config.skyColors.c2} onChange={(e) => updateSky('c2', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none bg-transparent" title="Sky Color 2" />
							<input type="color" value={config.skyColors.c3} onChange={(e) => updateSky('c3', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none bg-transparent" title="Sky Color 3" />
							<input type="color" value={config.boidColor} onChange={(e) => updateParam('boidColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none bg-transparent ml-2" title="Boid Color" />
						</div>
					</div>

					<div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
						<Stepper label="Separation" value={config.separationWeight} min={0} max={5} step={0.1} onChange={(v) => updateParam('separationWeight', v)} />
						<Stepper label="Alignment" value={config.alignmentWeight} min={0} max={5} step={0.1} onChange={(v) => updateParam('alignmentWeight', v)} />
						<Stepper label="Cohesion" value={config.cohesionWeight} min={0} max={5} step={0.1} onChange={(v) => updateParam('cohesionWeight', v)} />
						<Stepper label="Max Speed" value={config.maxSpeed} min={1} max={10} step={0.5} onChange={(v) => updateParam('maxSpeed', v)} />
					</div>
				</div>

				<div className="w-full flex flex-col sm:flex-row items-center gap-4 mt-6 pt-6 border-t-2 border-slate-700/20 px-2 md:px-6">
					<select
						value={config.fontFamily}
						onChange={(e) => updateParam('fontFamily', e.target.value)}
						className="bg-white/30 backdrop-blur-sm border-2 border-slate-700/40 px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 handdrawn-button cursor-pointer"
					>
						<option value='"Instrument Serif", serif'>Instrument Serif</option>
						<option value='"Inter", sans-serif'>Inter</option>
						<option value='"Fira Code", monospace'>Fira Code</option>
					</select>

					<input
						type="text"
						placeholder="Enter Banner Text..."
						maxLength={20}
						value={config.bannerText}
						onChange={(e) => updateParam('bannerText', e.target.value)}
						className="flex-1 w-full bg-white/30 backdrop-blur-sm border-2 border-slate-700/40 px-4 py-3 text-slate-800 placeholder-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all handdrawn-panel"
					/>

					<button
						onClick={onExport}
						disabled={isRecording}
						className={`w-full sm:w-auto px-8 py-3 font-bold tracking-wide transition-all flex items-center justify-center gap-2 whitespace-nowrap border-2 border-slate-800 handdrawn-button shadow-[4px_4px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(15,23,42,1)] ${isRecording ? 'bg-sky-200 text-slate-800 cursor-wait animate-pulse' : 'bg-slate-800 text-white cursor-pointer'}`}
					>
						{isRecording ? (
							<span>Compiling GIF...</span>
						) : (
							<span>Record GitHub Banner</span>
						)}
					</button>
				</div>

			</div>
		</div>
	);
}
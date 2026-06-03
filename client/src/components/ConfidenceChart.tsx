interface Props {
	confidences: { [key: string]: number };
  }
  
  export default function ConfidenceChart({ confidences }: Props) {
	const maxConf = Math.max(...Object.values(confidences));
	const maxKey = Object.keys(confidences).find(k => confidences[k] === maxConf);
  
	return (
	  <div className="space-y-2">
		{Object.entries(confidences).map(([label, value]) => (
		  <div key={label}>
			<div className="flex justify-between text-sm mb-1">
			  <span className={label === maxKey ? 'font-semibold text-blue-700' : 'text-slate-600'}>
				{label}
			  </span>
			  <span className="text-slate-500">{(value * 100).toFixed(1)}%</span>
			</div>
			<div className="w-full bg-slate-100 rounded-full h-2">
			  <div
				className={`h-2 rounded-full transition-all duration-500 ${
				  label === maxKey ? 'bg-blue-600' : 'bg-slate-400'
				}`}
				style={{ width: `${value * 100}%` }}
			  />
			</div>
		  </div>
		))}
	  </div>
	);
  }
interface Props {
	imageBase64: string | null;
	originalPreview?: string; // optional original image for comparison
  }
  
  export default function GradCAMViewer({ imageBase64, originalPreview }: Props) {
	if (!imageBase64) return null;
  
	return (
	  <div className="mt-6">
		<h3 className="font-semibold text-slate-700 mb-3">Explainability Heatmap (Grad-CAM)</h3>
		<div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
		  <div className="border rounded-xl overflow-hidden shadow-sm">
			<img src={originalPreview || ''} alt="Original MRI" className="w-64 h-64 object-contain" />
			<p className="text-xs text-center text-slate-500 py-1">Original</p>
		  </div>
		  <div className="border rounded-xl overflow-hidden shadow-sm">
			<img src={imageBase64} alt="Grad-CAM Heatmap" className="w-64 h-64 object-contain" />
			<p className="text-xs text-center text-slate-500 py-1">Grad-CAM Overlay</p>
		  </div>
		</div>
	  </div>
	);
  }
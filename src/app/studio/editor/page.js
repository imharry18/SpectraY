'use client';
import { useState, useRef, useEffect } from 'react';
import { 
  Crop, Sun, Sliders, Palette, Wand2, Layers, Download, 
  RotateCw, FlipHorizontal, FlipVertical, Type,
  ZoomIn, ZoomOut, Image as ImageIcon,
  ChevronLeft, UploadCloud, Move, Maximize,
  Sparkles, Contrast, FileDown 
} from 'lucide-react';
import EditorSlider from '@/components/ui/EditorSlider';
import Link from 'next/link';

// --- CUSTOM HOOK: Debounce (Waits 300ms before sending request) ---
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// --- CONFIGURATION ---
const TOOL_CATEGORIES = [
  { id: 'adjust', icon: Sliders, label: 'Adjust' },
  { id: 'color', icon: Palette, label: 'Color' },
  { id: 'effects', icon: Wand2, label: 'Effects' },
  { id: 'transform', icon: Crop, label: 'Transform' },
];

const TOOLS = {
  transform: [
    { id: 'rotate', label: 'Rotate 90°', icon: RotateCw, type: 'button', action: 'rotate90' },
    { id: 'flip-h', label: 'Flip Horizontal', icon: FlipHorizontal, type: 'button', action: 'flipH' },
    { id: 'flip-v', label: 'Flip Vertical', icon: FlipVertical, type: 'button', action: 'flipV' },
  ],
  adjust: [
    { id: 'brightness', label: 'Brightness', icon: Sun, type: 'slider', min: -100, max: 100 },
    { id: 'contrast', label: 'Contrast', icon: Layers, type: 'slider', min: -100, max: 100 },
    { id: 'blur', label: 'Blur', icon: Type, type: 'slider', min: 0, max: 20 },
    { id: 'sharpness', label: 'Sharpness', icon: Maximize, type: 'slider', min: 0, max: 100 },
  ],
  color: [
    { id: 'saturation', label: 'Saturation', icon: Palette, type: 'slider', min: -100, max: 100 },
    { id: 'hue', label: 'Hue', icon: Palette, type: 'slider', min: 0, max: 180 },
  ],
  effects: [
    // CRITICAL FIX: Added icons here to prevent the crash
    { id: 'grayscale', label: 'Grayscale', icon: Sparkles, type: 'toggle' },
    { id: 'invert', label: 'Invert Colors', icon: Contrast, type: 'toggle' },
  ]
};

export default function EditorPage() {
  const [activeCategory, setActiveCategory] = useState('adjust');
  
  // Image State
  const [imageSrc, setImageSrc] = useState(null);
  const [filename, setFilename] = useState("Untitled.png");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dimensions, setDimensions] = useState("0 x 0");

  // Edit Parameters (Sent to Python)
  const [editValues, setEditValues] = useState({
    rotate: 0,
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
    blur: 0,
    sharpness: 0,
    grayscale: false,
    invert: false,
    flipH: 1, 
    flipV: 1, 
  });
  
  // UI View State
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const fileInputRef = useRef(null);

  // Debounced Values for API
  const debouncedValues = useDebounce(editValues, 300);

  // --- 1. UPLOAD HANDLER ---
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFilename(file.name);
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const base64Data = event.target.result;
        setImageSrc(base64Data); // Show immediately
        
        try {
            // console.log("Uploading to backend...");
            const res = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64Data })
            });

            if (!res.ok) throw new Error("Upload failed. Is Python running?");
            // const data = await res.json();
            // console.log("Upload Success:", data);
        } catch (err) {
            alert("Connection Error: Please run 'python backend/server.py' in a new terminal.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- 2. EXPORT HANDLER (NEW) ---
  const handleExport = () => {
    if (!imageSrc) return;
    
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `edited-${filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- 3. PROCESSING EFFECT ---
  useEffect(() => {
    if (!imageSrc) return;

    const processImage = async () => {
      setIsProcessing(true);
      try {
        const res = await fetch('http://localhost:5000/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ params: debouncedValues })
        });
        
        if (!res.ok) throw new Error("Processing failed");
        
        const data = await res.json();
        if (data.status === "success") {
            setImageSrc(data.processed_image);
        }
      } catch (err) {
        console.error("Backend Error:", err);
      } finally {
        setIsProcessing(false);
      }
    };

    processImage();
  }, [debouncedValues]);


  // --- HELPERS ---
  const updateValue = (key, value) => {
    setEditValues(prev => ({ ...prev, [key]: value }));
  };
  const toggleValue = (key) => {
    setEditValues(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const handleButtonAction = (action) => {
    if (action === 'flipH') updateValue('flipH', editValues.flipH * -1);
    if (action === 'flipV') updateValue('flipV', editValues.flipV * -1);
    if (action === 'rotate90') updateValue('rotate', (editValues.rotate + 90) % 360);
  };
  
  const handleReset = () => {
    setEditValues({
      rotate: 0, brightness: 0, contrast: 0, saturation: 0, hue: 0, blur: 0,
      sharpness: 0, grayscale: false, invert: false, flipH: 1, flipV: 1
    });
    setZoom(100);
    setPan({ x: 0, y: 0 });
  };

  // Mouse Handlers for Panning
  const handleMouseDown = (e) => { if (zoom > 100) setIsPanning(true); };
  const handleMouseMove = (e) => {
    if (isPanning) setPan(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
  };
  const handleMouseUp = () => setIsPanning(false);


  return (
    <div className="flex h-screen w-screen bg-black text-white overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-20 bg-zinc-950 border-r border-white/10 flex flex-col items-center py-6 z-20 shrink-0">
        <Link href="/studio">
            <div className="mb-8 p-3 hover:bg-white/10 rounded-xl cursor-pointer text-gray-400 hover:text-white">
                <ChevronLeft size={24} />
            </div>
        </Link>
        <div className="flex flex-col gap-6 w-full">
          {TOOL_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                disabled={!imageSrc}
                className={`flex flex-col items-center gap-2 w-full py-4 transition-all ${
                    !imageSrc ? 'opacity-30 cursor-not-allowed' : 
                    isActive ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <cat.icon size={24} />
                <span className="text-[10px] font-medium">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* CENTER CANVAS */}
      <div className="flex-1 flex flex-col relative min-w-0">
        <header className="h-16 border-b border-white/10 bg-zinc-900/80 backdrop-blur-md flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400">
               <ImageIcon size={18} />
             </div>
             <div>
               <h1 className="text-sm font-bold text-white">{filename}</h1>
               <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                  {dimensions} • {isProcessing ? <span className="text-cyan-400 animate-pulse">PROCESSING...</span> : "READY"}
               </div>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => { setImageSrc(null); handleReset(); }} className={`text-xs font-bold text-gray-400 hover:text-red-400 mr-4 ${!imageSrc && 'hidden'}`}>Close File</button>
             <button 
                onClick={handleExport} 
                disabled={!imageSrc} 
                className="px-6 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-gray-200 flex items-center gap-2 disabled:opacity-50"
             >
               <FileDown size={16} /> Export
             </button>
          </div>
        </header>

        <main 
            className="flex-1 bg-zinc-900/50 relative overflow-hidden flex items-center justify-center"
            onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          {!imageSrc ? (
             <div className="text-center p-12 border-2 border-dashed border-white/10 rounded-3xl hover:border-white/20 transition-all">
                <UploadCloud size={32} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold mb-2">Upload Image</h3>
                <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                <button onClick={() => fileInputRef.current?.click()} className="px-6 py-2 bg-cyan-500 text-black font-bold rounded-full hover:scale-105 transition-transform">Browse Files</button>
             </div>
          ) : (
            <div 
                className={`relative shadow-2xl transition-transform duration-100 ease-out ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`, 
                }}
            >
                <img 
                    src={imageSrc} 
                    alt="Workplace" 
                    draggable={false}
                    className="max-w-none object-contain"
                    style={{ maxHeight: '70vh' }}
                    onLoad={(e) => setDimensions(`${e.target.naturalWidth} x ${e.target.naturalHeight}`)}
                />
            </div>
          )}
          
          {imageSrc && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-zinc-950/90 rounded-full border border-white/10 shadow-xl z-30">
                <button onClick={() => setZoom(z => Math.max(10, z - 10))} className="text-gray-400 hover:text-white"><ZoomOut size={16}/></button>
                <span className="text-xs font-mono w-10 text-center">{zoom}%</span>
                <button onClick={() => setZoom(z => Math.min(500, z + 10))} className="text-gray-400 hover:text-white"><ZoomIn size={16}/></button>
                <div className="w-px h-4 bg-white/20 mx-2" />
                <button onClick={() => { setZoom(100); setPan({x:0, y:0}) }} className="text-[10px] font-bold text-cyan-400">FIT</button>
            </div>
          )}
        </main>
      </div>

      {/* RIGHT SIDEBAR (CONTROLS) */}
      <aside className="w-80 bg-zinc-950 border-l border-white/10 flex flex-col z-20 shrink-0">
        <div className="px-6 py-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-sm font-bold capitalize flex gap-2"><Sliders size={14} className="text-cyan-400"/> {activeCategory}</h2>
            <button onClick={handleReset} className="text-[10px] text-gray-500 hover:text-red-400 underline">RESET ALL</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {!imageSrc ? <div className="text-center opacity-50 mt-10"><Move size={40} className="mx-auto mb-2"/>Import Image to Edit</div> : 
            TOOLS[activeCategory]?.map((tool) => (
                <div key={tool.id} className="group">
                    <div className="flex justify-between mb-2 text-gray-300 text-xs font-bold uppercase">
                        <span className="flex gap-2">
                           {/* SAFE GUARD: Check if icon exists before rendering */}
                           {tool.icon && <tool.icon size={14} className="text-cyan-500"/>} 
                           {tool.label}
                        </span>
                        {tool.type === 'slider' && <span>{editValues[tool.id]}</span>}
                    </div>
                    
                    {tool.type === 'slider' && (
                        <EditorSlider 
                            value={editValues[tool.id] || 0} 
                            min={tool.min} max={tool.max} 
                            onChange={(val) => updateValue(tool.id, val)} 
                        />
                    )}

                    {tool.type === 'toggle' && (
                        <button onClick={() => toggleValue(tool.id)} className={`w-full py-2 border rounded text-xs font-bold flex justify-between px-3 ${editValues[tool.id] ? 'border-cyan-500 text-cyan-400 bg-cyan-950/30' : 'border-white/10 hover:bg-white/5'}`}>
                            {tool.label} <div className={`w-2 h-2 rounded-full ${editValues[tool.id] ? 'bg-cyan-400' : 'bg-gray-600'}`} />
                        </button>
                    )}

                    {tool.type === 'button' && (
                        <button onClick={() => handleButtonAction(tool.action)} className="w-full py-3 bg-zinc-900 border border-white/10 rounded hover:bg-zinc-800 transition-colors text-xs font-bold text-gray-300">
                           Execute
                        </button>
                    )}
                </div>
            ))}
        </div>
      </aside>
    </div>
  );
}
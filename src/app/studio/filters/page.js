'use client';
import { useState, useRef, useEffect } from 'react';
import { 
  Wand2, Droplets, Zap, Image as ImageIcon, 
  ChevronLeft, UploadCloud, Download, Maximize, 
  Sun, Moon, Contrast, Sparkles, Pencil, Search,
  Flame, Snowflake, Layers, Aperture
} from 'lucide-react';
import Link from 'next/link';
import EditorSlider from '@/components/ui/EditorSlider';

// --- CUSTOM HOOK: Debounce ---
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

// --- FILTER DEFINITIONS ---
// These map directly to the parameters your Python backend understands (or can simulate)
const FILTERS = [
  { 
    id: 'grayscale', 
    name: 'Grayscale', 
    icon: Droplets, 
    params: { grayscale: true, contrast: 10 } 
  },
  { 
    id: 'bw', 
    name: 'Black & White', 
    icon: Contrast, 
    params: { grayscale: true, contrast: 50, brightness: 10 } 
  },
  { 
    id: 'sepia', 
    name: 'Sepia', 
    icon: Layers, 
    params: { sepia: 100 } // Requires backend update or RGB simulation
  },
  { 
    id: 'invert', 
    name: 'Negative', 
    icon: Zap, 
    params: { invert: true } 
  },
  { 
    id: 'warm', 
    name: 'Warm Tone', 
    icon: Flame, 
    params: { saturation: 20, hue: 5 } 
  },
  { 
    id: 'cool', 
    name: 'Cool Tone', 
    icon: Snowflake, 
    params: { saturation: 10, hue: -10 } 
  },
  { 
    id: 'high-contrast', 
    name: 'High Contrast', 
    icon: Sun, 
    params: { contrast: 60, brightness: 5 } 
  },
  { 
    id: 'muted', 
    name: 'Low Saturation', 
    icon: Moon, 
    params: { saturation: -60, contrast: 10 } 
  },
  { 
    id: 'blur', 
    name: 'Gaussian Blur', 
    icon: Aperture, 
    params: { blur: 5 },
    hasIntensity: true, // Shows slider
    intensityParam: 'blur',
    maxIntensity: 20
  },
  { 
    id: 'sharpen', 
    name: 'Sharpen', 
    icon: Sparkles, 
    params: { sharpness: 60 },
    hasIntensity: true,
    intensityParam: 'sharpness',
    maxIntensity: 100
  },
  { 
    id: 'edge', 
    name: 'Edge Detect', 
    icon: Search, 
    params: { edge: true } 
  },
  { 
    id: 'sketch', 
    name: 'Sketch Effect', 
    icon: Pencil, 
    params: { sketch: true } 
  }
];

export default function FiltersPage() {
  // --- STATE ---
  const [activeFilterId, setActiveFilterId] = useState(null);
  const [intensity, setIntensity] = useState(0); // For filters with sliders
  
  const [imageSrc, setImageSrc] = useState(null);
  const [filename, setFilename] = useState("Untitled.png");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef(null);

  // Derive current parameters based on selection + intensity
  const getCurrentParams = () => {
    if (!activeFilterId) return {};
    
    const filter = FILTERS.find(f => f.id === activeFilterId);
    let params = { ...filter.params };

    // If this filter uses a slider, override the default param value
    if (filter.hasIntensity) {
      params[filter.intensityParam] = intensity;
    }

    return params;
  };

  const debouncedParams = useDebounce(getCurrentParams(), 300);

  // --- HANDLERS ---
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFilename(file.name);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target.result;
        setImageSrc(base64Data);
        
        // Upload to backend
        try {
            await fetch('http://localhost:5000/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64Data })
            });
        } catch (err) {
            alert("Connection Failed. Run 'python backend/server.py'");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFilterClick = (filter) => {
    setActiveFilterId(filter.id);
    // Set initial intensity if applicable
    if (filter.hasIntensity) {
      setIntensity(filter.params[filter.intensityParam]);
    }
  };

  const handleExport = () => {
    if (!imageSrc) return;
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `filtered-${filename}`;
    link.click();
  };

  // --- API CALL ---
  useEffect(() => {
    if (!imageSrc || !activeFilterId) return;

    const processImage = async () => {
      setIsProcessing(true);
      try {
        const res = await fetch('http://localhost:5000/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ params: debouncedParams })
        });
        const data = await res.json();
        if (data.status === "success") {
            setImageSrc(data.processed_image);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    };

    processImage();
  }, [debouncedParams]);

  const activeFilterData = FILTERS.find(f => f.id === activeFilterId);

  return (
    <div className="flex h-screen w-screen bg-black text-white overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* ==============================================
          LEFT SIDEBAR: FILTER GALLERY
      ============================================== */}
      <aside className="w-80 bg-zinc-950 border-r border-white/10 flex flex-col z-20 shrink-0">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center gap-4">
            <Link href="/studio">
                <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                    <ChevronLeft size={20} />
                </button>
            </Link>
            <h1 className="text-sm font-bold tracking-wider text-white uppercase">Filter Library</h1>
        </div>

        {/* Filter Grid */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-2 gap-3">
                {FILTERS.map((filter) => {
                    const isActive = activeFilterId === filter.id;
                    return (
                        <button
                            key={filter.id}
                            onClick={() => handleFilterClick(filter)}
                            disabled={!imageSrc}
                            className={`relative group flex flex-col items-center justify-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                                !imageSrc ? 'opacity-40 cursor-not-allowed border-white/5 bg-zinc-900' :
                                isActive 
                                    ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                                    : 'bg-zinc-900 border-white/5 hover:bg-zinc-800 hover:border-white/10'
                            }`}
                        >
                            <div className={`p-3 rounded-full ${isActive ? 'bg-cyan-400 text-black' : 'bg-zinc-800 text-gray-400 group-hover:text-white group-hover:bg-zinc-700'} transition-colors`}>
                                <filter.icon size={20} />
                            </div>
                            <span className={`text-xs font-medium ${isActive ? 'text-cyan-400' : 'text-gray-400 group-hover:text-white'}`}>
                                {filter.name}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
      </aside>

      {/* ==============================================
          CENTER CANVAS: PREVIEW
      ============================================== */}
      <div className="flex-1 flex flex-col relative min-w-0">
        
        {/* Header */}
        <header className="h-16 border-b border-white/10 bg-zinc-900/80 backdrop-blur-md flex items-center justify-between px-6 z-20">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">
                    <Wand2 size={18} />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-white">{activeFilterId ? activeFilterData?.name : 'No Filter Selected'}</h2>
                    <p className="text-[10px] text-gray-500 font-mono">
                         {isProcessing ? <span className="text-cyan-400 animate-pulse">RENDERING...</span> : filename}
                    </p>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className={`text-xs font-bold text-gray-400 hover:text-white transition-colors mr-2`}
                >
                    {imageSrc ? 'Replace Image' : 'Open Image'}
                </button>
                <button 
                    onClick={handleExport}
                    disabled={!imageSrc} 
                    className="px-5 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-gray-200 flex items-center gap-2 disabled:opacity-50"
                >
                    <Download size={16} /> Save
                </button>
            </div>
        </header>

        {/* Main Canvas */}
        <main className="flex-1 bg-zinc-900/50 relative overflow-hidden flex items-center justify-center p-8">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            {!imageSrc ? (
                 <div className="text-center">
                    <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="group flex flex-col items-center gap-4 p-12 border-2 border-dashed border-white/10 rounded-3xl hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all"
                    >
                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <UploadCloud size={32} className="text-gray-400 group-hover:text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Import Photo</h3>
                            <p className="text-gray-500 text-sm mt-1">Select an image to start filtering</p>
                        </div>
                    </button>
                 </div>
            ) : (
                <div className="relative shadow-2xl border border-white/10">
                    <img 
                        src={imageSrc} 
                        alt="Preview" 
                        className="max-h-[70vh] max-w-full object-contain"
                    />
                </div>
            )}
        </main>
      </div>

      {/* ==============================================
          RIGHT PANEL: CONTROLS
      ============================================== */}
      <aside className="w-72 bg-zinc-950 border-l border-white/10 flex flex-col z-20 shrink-0">
         <div className="p-6 border-b border-white/5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Properties</h3>
         </div>

         <div className="p-6">
            {!activeFilterId ? (
                <div className="text-center text-gray-600 mt-10 text-sm">
                    Select a filter from the library <br/> to see options.
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-white mb-6">
                         {activeFilterData && <activeFilterData.icon size={24} className="text-cyan-400" />}
                         <span className="text-lg font-bold">{activeFilterData?.name}</span>
                    </div>

                    {activeFilterData?.hasIntensity ? (
                        <div>
                            <div className="flex justify-between text-xs text-gray-400 mb-2 font-mono">
                                <span>Intensity</span>
                                <span>{intensity}</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={activeFilterData.maxIntensity}
                                value={intensity}
                                onChange={(e) => setIntensity(Number(e.target.value))}
                                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300"
                            />
                        </div>
                    ) : (
                        <div className="p-4 bg-zinc-900 rounded-lg border border-white/5 text-xs text-gray-400 leading-relaxed">
                            This filter applies a fixed preset effect. No manual adjustments available.
                        </div>
                    )}

                    <div className="pt-6 border-t border-white/5">
                        <button 
                            onClick={() => { setActiveFilterId(null); handleFileChange({target: {files: []}}); }} // This resets logic, ideally reload image
                            className="w-full py-3 border border-white/10 rounded-lg hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 transition-all text-xs font-bold text-gray-400"
                        >
                            Reset / Remove Filter
                        </button>
                    </div>
                </div>
            )}
         </div>
      </aside>

    </div>
  );
}
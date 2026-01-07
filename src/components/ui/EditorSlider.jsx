export default function EditorSlider({ label, value, min = -100, max = 100, onChange }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between text-xs font-medium text-gray-400 mb-2 font-mono">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
      />
    </div>
  );
}
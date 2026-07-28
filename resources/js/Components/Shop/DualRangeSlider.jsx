import { useState, useRef, useEffect } from 'react';

function fmt(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

export default function DualRangeSlider({ 
    min, 
    max, 
    valueMax, 
    onChange,
    priceRange 
}) {
    const [maxVal, setMaxVal] = useState(valueMax || max);
    const maxValRef = useRef(valueMax || max);

    // Sync with props
    useEffect(() => {
        const newVal = valueMax || max;
        setMaxVal(newVal);
        maxValRef.current = newVal;
    }, [valueMax, max]);

    const handleChange = (e) => {
        const value = Number(e.target.value);
        setMaxVal(value);
        maxValRef.current = value;
        onChange(value);
    };

    const percent = max > 0 ? (maxVal / max) * 100 : 100;

    return (
        <div className="space-y-4">
            {/* Price Range Display */}
            <div className="text-sm text-gray-600 font-medium">
                Range: Rp 0 — {fmt(maxVal)}
            </div>

            {/* Single Range Slider */}
            <div className="relative w-full h-6">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={maxVal}
                    step="1000"
                    onChange={handleChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, #111827 0%, #111827 ${percent}%, #e5e7eb ${percent}%, #e5e7eb 100%)`,
                    }}
                />
            </div>

            {/* Custom CSS for slider thumb */}
            <style>{`
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #111827;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    margin-top: -2px;
                }
                input[type="range"]::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #111827;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                input[type="range"]::-webkit-slider-runnable-track {
                    height: 8px;
                    border-radius: 4px;
                }
                input[type="range"]::-moz-range-track {
                    height: 8px;
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
}

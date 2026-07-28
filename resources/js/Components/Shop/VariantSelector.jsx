const COLOR_MAP = {
    'white': '#FFFFFF', 'black': '#111111', 'grey': '#6B7280', 'gray': '#6B7280',
    'charcoal': '#374151', 'navy': '#1E3A8A', 'blue': '#3B82F6', 'skyblue': '#7DD3FC',
    'lightblue': '#BFDBFE', 'darkblue': '#1E40AF', 'red': '#DC2626', 'maroon': '#7F1D1D',
    'burgundy': '#991B1B', 'green': '#059669', 'darkgreen': '#065F46', 'olive': '#65A30D',
    'yellow': '#EAB308', 'mustard': '#CA8A04', 'brown': '#78350F', 'beige': '#D4C4B0',
    'cream': '#FEF3C7', 'tan': '#D2B48C', 'khaki': '#C4B5A0', 'pink': '#EC4899',
    'purple': '#9333EA', 'orange': '#F97316', 'rose gold': '#E8B4B8',
};

// Hue order: Reds → Oranges → Yellows → Greens → Blues → Purples → Pinks → Neutrals
const COLOR_SORT_ORDER = {
    'red': 100, 'maroon': 101, 'burgundy': 102,
    'orange': 200,
    'yellow': 300, 'mustard': 301,
    'olive': 400, 'green': 401, 'darkgreen': 402,
    'navy': 500, 'darkblue': 501, 'blue': 502, 'skyblue': 503, 'lightblue': 504,
    'purple': 600,
    'pink': 700, 'rose gold': 701,
    'white': 800, 'cream': 801, 'beige': 802, 'tan': 803, 'khaki': 804, 'brown': 805,
    'gray': 900, 'grey': 900, 'charcoal': 901, 'black': 902,
};

const ATTR_ORDER = ['color', 'neck', 'sleeve', 'size'];

const ATTR_LABELS = {
    color: 'Color',
    size: 'Size',
    neck: 'Neck Style',
    sleeve: 'Sleeve Length',
};

export default function VariantSelector({ variants, selectedAttributes, onAttributeChange }) {
    const detectedAttributes = ATTR_ORDER.filter(attr => {
        return variants.some(v => v[attr] && v[attr].toString().trim() !== '');
    });

    const getUniqueOptions = (attrCode) => {
        const unique = [...new Set(
            variants
                .map(v => v[attrCode])
                .filter(v => v && v.toString().trim() !== '')
        )];

        if (attrCode === 'color') {
            return unique.sort((a, b) => {
                const orderA = COLOR_SORT_ORDER[a.toLowerCase().trim()] ?? 999;
                const orderB = COLOR_SORT_ORDER[b.toLowerCase().trim()] ?? 999;
                return orderA - orderB;
            });
        }

        return unique.sort();
    };

    const isOptionAvailable = (attrCode, optionValue) => {
        if (attrCode === 'color') {
            return variants.some(v => {
                const matchColor = v[attrCode]?.toString().toLowerCase() === optionValue?.toString().toLowerCase();
                return matchColor;
            });
        }

        const otherSelections = Object.entries(selectedAttributes).filter(([k, val]) => k !== attrCode && val);
        if (otherSelections.length === 0) return true;

        return variants.some(v => {
            if (selectedAttributes.color) {
                const matchColor = v.color?.toString().toLowerCase() === selectedAttributes.color?.toString().toLowerCase();
                if (!matchColor) return false;
            }
            const matchOthers = otherSelections.every(([k, val]) =>
                v[k]?.toString().toLowerCase() === val?.toString().toLowerCase()
            );
            const matchThis = v[attrCode]?.toString().toLowerCase() === optionValue?.toString().toLowerCase();
            return matchOthers && matchThis;
        });
    };

    const getColorHex = (name) => COLOR_MAP[name?.toLowerCase().trim()] || '#CCCCCC';

    return (
        <div className="space-y-6">
            {detectedAttributes.map(attrCode => {
                const options = getUniqueOptions(attrCode);
                if (options.length === 0) return null;

                const label = ATTR_LABELS[attrCode] || attrCode;
                const selected = selectedAttributes[attrCode];

                if (attrCode === 'color') {
                    return (
                        <div key={attrCode}>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                                {label}
                                <span className="font-normal text-gray-400 ml-1.5 normal-case tracking-normal">
                                    — {selected || 'Choose'}
                                </span>
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {options.map(opt => {
                                    const hex = getColorHex(opt);
                                    const isSelected = selected?.toLowerCase() === opt?.toLowerCase();
                                    const isAvailable = isOptionAvailable(attrCode, opt);
                                    const isLight = ['#FFFFFF', '#FEF3C7', '#BFDBFE', '#D4C4B0', '#E8B4B8'].includes(hex);

                                    return (
                                        <button
                                            key={opt}
                                            onClick={() => isAvailable && onAttributeChange(attrCode, opt)}
                                            title={opt}
                                            className={`relative group/swatch transition-all duration-200 ${
                                                isAvailable ? 'cursor-pointer' : 'cursor-not-allowed'
                                            }`}
                                        >
                                            <span className={`block w-10 h-10 rounded-full transition-all duration-200 ${
                                                isLight ? 'border-2 border-gray-200' : 'border-2 border-transparent'
                                            } ${
                                                isSelected
                                                    ? 'ring-2 ring-offset-2 ring-gray-900 scale-110 shadow-lg'
                                                    : isAvailable
                                                    ? 'hover:scale-110 hover:shadow-md'
                                                    : 'opacity-30'
                                            }`}
                                                style={{ backgroundColor: hex }}
                                            />
                                            {/* Tooltip */}
                                            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-medium px-2 py-0.5 rounded-md opacity-0 group-hover/swatch:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                {opt}
                                            </span>
                                            {/* Unavailable slash */}
                                            {!isAvailable && (
                                                <span className="absolute inset-0 flex items-center justify-center">
                                                    <span className="block w-[140%] h-[1.5px] bg-red-400 rotate-45 rounded-full" />
                                                </span>
                                            )}
                                            {/* Selected checkmark */}
                                            {isSelected && (
                                                <span className="absolute inset-0 flex items-center justify-center">
                                                    <svg className={`w-4 h-4 ${isLight ? 'text-gray-800' : 'text-white'} drop-shadow-sm`} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                                    </svg>
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                }

                return (
                    <div key={attrCode}>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                            {label}
                            <span className="font-normal text-gray-400 ml-1.5 normal-case tracking-normal">
                                — {selected || 'Choose'}
                            </span>
                        </p>
                        <div className="flex flex-wrap gap-2.5">
                            {options.map(opt => {
                                const isSelected = selected?.toLowerCase() === opt?.toLowerCase();
                                const isAvailable = isOptionAvailable(attrCode, opt);

                                return (
                                    <button
                                        key={opt}
                                        onClick={() => isAvailable && onAttributeChange(attrCode, opt)}
                                        className={`px-5 py-2.5 text-xs font-bold border-2 rounded-xl transition-all duration-200 uppercase tracking-wider ${
                                            !isAvailable
                                                ? 'border-gray-100 text-gray-300 line-through cursor-not-allowed bg-white'
                                                : isSelected
                                                ? 'border-gray-900 bg-gray-900 text-white shadow-lg shadow-gray-900/20 scale-[1.02]'
                                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-900 hover:text-gray-900 hover:shadow-md cursor-pointer'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

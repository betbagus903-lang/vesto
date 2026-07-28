import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, X, Search } from 'lucide-react';
import DualRangeSlider from './DualRangeSlider';

function fmt(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

const COLOR_HEX = {
    'white': '#FFFFFF', 'black': '#111111', 'grey': '#6B7280', 'gray': '#6B7280',
    'charcoal': '#374151', 'navy': '#1E3A8A', 'blue': '#3B82F6', 'skyblue': '#7DD3FC',
    'lightblue': '#BFDBFE', 'darkblue': '#1E40AF', 'red': '#DC2626', 'maroon': '#7F1D1D',
    'burgundy': '#991B1B', 'green': '#059669', 'darkgreen': '#065F46', 'olive': '#65A30D',
    'yellow': '#EAB308', 'mustard': '#CA8A04', 'brown': '#78350F', 'beige': '#D4C4B0',
    'cream': '#FEF3C7', 'tan': '#D2B48C', 'khaki': '#C4B5A0', 'pink': '#EC4899',
    'purple': '#9333EA', 'orange': '#F97316', 'rose gold': '#E8B4B8', 'silver': '#C0C0C0',
};

const COLOR_SORT = {
    'red': 100, 'maroon': 101, 'burgundy': 102,
    'orange': 200,
    'yellow': 300, 'mustard': 301,
    'olive': 400, 'green': 401, 'darkgreen': 402,
    'navy': 500, 'darkblue': 501, 'blue': 502, 'skyblue': 503, 'lightblue': 504,
    'purple': 600,
    'pink': 700, 'rose gold': 701,
    'white': 800, 'cream': 801, 'beige': 802, 'tan': 803, 'khaki': 804, 'brown': 805,
    'silver': 860, 'gold': 861,
    'gray': 900, 'grey': 900, 'charcoal': 901, 'black': 902,
};

const getColorHex = (name) => COLOR_HEX[name?.toLowerCase().trim()] || '#CCCCCC';
const getColorSort = (name) => COLOR_SORT[name?.toLowerCase().trim()] ?? 999;

export default function SidebarFilter({ 
    categories, 
    activeCategory, 
    priceRange,
    currentPriceMax,
    filterableAttributes,
    color_filters = [],
    activeColors = [],
    onFilterChange,
    onClearAll 
}) {
    const [expandedSections, setExpandedSections] = useState({
        price: true,
        category: true,
        color: true,
        size: true,
        brand: true,
    });

    const [priceMax, setPriceMax] = useState(currentPriceMax);
    // Gunakan activeColors langsung sebagai source of truth (sudah di-sync dari Shop.jsx via useEffect)
    const [selectedColors, setSelectedColors] = useState(activeColors);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [showAllSizes, setShowAllSizes] = useState(false);
    const priceTimer = useRef(null);

    // Sync saat activeColors berubah (dari URL/props Inertia)
    useEffect(() => {
        setSelectedColors(activeColors);
    }, [activeColors.join(',')]);

    // Sync priceMax saat prop berubah
    useEffect(() => {
        setPriceMax(currentPriceMax);
    }, [currentPriceMax]);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handlePriceChange = (max) => {
        setPriceMax(max);
        clearTimeout(priceTimer.current);
        priceTimer.current = setTimeout(() => {
            onFilterChange({ price_max: max });
        }, 300);
    };

    const handleCategoryToggle = (categorySlug) => {
        onFilterChange({ 
            category: categorySlug === activeCategory ? '' : categorySlug,
        });
    };

    const handleColorToggle = (color) => {
        const newColors = selectedColors.includes(color)
            ? selectedColors.filter(c => c !== color)
            : [...selectedColors, color];
        setSelectedColors(newColors);
        onFilterChange({ colors: newColors });
    };

    const handleSizeToggle = (size) => {
        const newSizes = selectedSizes.includes(size)
            ? selectedSizes.filter(s => s !== size)
            : [...selectedSizes, size];
        setSelectedSizes(newSizes);
        onFilterChange({ sizes: newSizes });
    };

    const handleBrandToggle = (brand) => {
        const newBrands = selectedBrands.includes(brand)
            ? selectedBrands.filter(b => b !== brand)
            : [...selectedBrands, brand];
        setSelectedBrands(newBrands);
        onFilterChange({ brands: newBrands });
    };

    const handleClearAll = () => {
        setPriceMax(priceRange.max);
        setSelectedColors([]);
        setSelectedSizes([]);
        setSelectedBrands([]);
        setShowAllSizes(false);
        onClearAll();
    };

    const colorAttribute = filterableAttributes?.find(a => a.code === 'color');
    const sizeAttribute = filterableAttributes?.find(a => a.code === 'size');
    const brandAttribute = filterableAttributes?.find(a => a.code === 'brand');

    const displayedSizes = showAllSizes 
        ? sizeAttribute?.options 
        : sizeAttribute?.options?.slice(0, 5);

    return (
        <div className="w-full bg-white border-r border-gray-200 sticky top-24 self-start">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
                <button 
                    onClick={handleClearAll}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                    <X className="w-4 h-4" />
                    Clear All
                </button>
            </div>

            <div className="p-6 space-y-6">
                {/* Price Filter */}
                <div className="border-b border-gray-100 pb-6">
                    <button 
                        onClick={() => toggleSection('price')}
                        className="w-full flex items-center justify-between font-semibold text-gray-900 mb-4 text-base"
                    >
                        <span>Price</span>
                        {expandedSections.price ? (
                            <ChevronUp className="w-5 h-5" />
                        ) : (
                            <ChevronDown className="w-5 h-5" />
                        )}
                    </button>
                    {expandedSections.price && (
                        <DualRangeSlider
                            min={priceRange.min}
                            max={priceRange.max}
                            valueMax={priceMax}
                            onChange={handlePriceChange}
                            priceRange={priceRange}
                        />
                    )}
                </div>

                {/* Category Filter */}
                <div className="border-b border-gray-100 pb-6">
                    <button 
                        onClick={() => toggleSection('category')}
                        className="w-full flex items-center justify-between font-semibold text-gray-900 mb-4 text-base"
                    >
                        <span>Category {activeCategory && <span className="text-xs font-normal text-gray-500">(1)</span>}</span>
                        {expandedSections.category ? (
                            <ChevronUp className="w-5 h-5" />
                        ) : (
                            <ChevronDown className="w-5 h-5" />
                        )}
                    </button>
                    {expandedSections.category && (
                        <div className="space-y-3">
                            {categories.map(category => (
                                <label key={category.id} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={activeCategory === category.slug}
                                        onChange={() => handleCategoryToggle(category.slug)}
                                        className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                    />
                                    <span className="text-sm text-gray-700">{category.name}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Color Filter */}
                {color_filters.length > 0 && (
                    <div className="border-b border-gray-100 pb-6">
                        <button 
                            onClick={() => toggleSection('color')}
                            className="w-full flex items-center justify-between font-semibold text-gray-900 mb-4 text-base"
                        >
                        <span>Color {selectedColors.length > 0 && <span className="text-xs font-normal text-gray-500">({selectedColors.length})</span>}</span>
                            {expandedSections.color ? (
                                <ChevronUp className="w-5 h-5" />
                            ) : (
                                <ChevronDown className="w-5 h-5" />
                            )}
                        </button>
                        {expandedSections.color && (
                            <div className="space-y-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search color..."
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    {[...color_filters].sort((a, b) => getColorSort(a.name) - getColorSort(b.name)).map((color, index) => (
                                        <label key={index} className="flex items-center gap-3 cursor-pointer group/swatch">
                                            <input
                                                type="checkbox"
                                                checked={selectedColors.includes(color.name)}
                                                onChange={() => handleColorToggle(color.name)}
                                                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                            />
                                            <div 
                                                className={`w-5 h-5 rounded-full flex-shrink-0 transition-transform group-hover/swatch:scale-110 ${
                                                    ['#FFFFFF', '#FEF3C7', '#BFDBFE', '#D4C4B0', '#E8B4B8', '#C0C0C0'].includes(getColorHex(color.name))
                                                        ? 'border border-gray-300' : 'border border-transparent'
                                                }`}
                                                style={{ backgroundColor: getColorHex(color.name) }}
                                            />
                                            <span className="text-sm text-gray-700">{color.name}</span>
                                            <span className="text-xs text-gray-400 ml-auto">({color.count})</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Size Filter */}
                {sizeAttribute && (
                    <div className="border-b border-gray-100 pb-6">
                        <button 
                            onClick={() => toggleSection('size')}
                            className="w-full flex items-center justify-between font-semibold text-gray-900 mb-4 text-base"
                        >
                            <span>Size</span>
                            {expandedSections.size ? (
                                <ChevronUp className="w-5 h-5" />
                            ) : (
                                <ChevronDown className="w-5 h-5" />
                            )}
                        </button>
                        {expandedSections.size && (
                            <div className="space-y-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search size..."
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    {displayedSizes?.map(option => (
                                        <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedSizes.includes(option.admin_name)}
                                                onChange={() => handleSizeToggle(option.admin_name)}
                                                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                            />
                                            <span className="text-sm text-gray-700">{option.admin_name}</span>
                                        </label>
                                    ))}
                                </div>
                                {sizeAttribute?.options?.length > 5 && !showAllSizes && (
                                    <button
                                        onClick={() => setShowAllSizes(true)}
                                        className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                                    >
                                        View More
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Brand Filter */}
                {brandAttribute && (
                    <div className="pb-6">
                        <button 
                            onClick={() => toggleSection('brand')}
                            className="w-full flex items-center justify-between font-semibold text-gray-900 mb-4 text-base"
                        >
                            <span>Brand</span>
                            {expandedSections.brand ? (
                                <ChevronUp className="w-5 h-5" />
                            ) : (
                                <ChevronDown className="w-5 h-5" />
                            )}
                        </button>
                        {expandedSections.brand && (
                            <div className="space-y-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search brand..."
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    {brandAttribute.options?.map(option => (
                                        <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedBrands.includes(option.admin_name)}
                                                onChange={() => handleBrandToggle(option.admin_name)}
                                                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                            />
                                            <span className="text-sm text-gray-700">{option.admin_name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react';

export default function AdvancedSearch({ onSearch, initialFilters = {} }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
    const [priceRange, setPriceRange] = useState({
        min: initialFilters.price_min || 0,
        max: initialFilters.price_max || 10000000,
    });
    const [selectedCategories, setSelectedCategories] = useState(initialFilters.categories || []);
    const [selectedBrands, setSelectedBrands] = useState(initialFilters.brands || []);
    const [selectedSizes, setSelectedSizes] = useState(initialFilters.sizes || []);
    const [selectedColors, setSelectedColors] = useState(initialFilters.colors || []);
    const [inStockOnly, setInStockOnly] = useState(initialFilters.in_stock_only || false);
    const [onSaleOnly, setOnSaleOnly] = useState(initialFilters.on_sale_only || false);

    const CATEGORIES = ['Mens', 'Womens', 'Accessories', 'Footwear', 'Selfcare'];
    const BRANDS = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Converse', 'Vans', 'New Balance'];
    const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Gray', 'Brown', 'Beige'];

    useEffect(() => {
        setSearchTerm(initialFilters.search || '');
        setPriceRange({
            min: initialFilters.price_min || 0,
            max: initialFilters.price_max || 10000000,
        });
        setSelectedCategories(initialFilters.categories || []);
        setSelectedBrands(initialFilters.brands || []);
        setSelectedSizes(initialFilters.sizes || []);
        setSelectedColors(initialFilters.colors || []);
        setInStockOnly(initialFilters.in_stock_only || false);
        setOnSaleOnly(initialFilters.on_sale_only || false);
    }, [initialFilters]);

    const toggleCategory = (cat) => {
        setSelectedCategories(prev =>
            prev.includes(cat)
                ? prev.filter(c => c !== cat)
                : [...prev, cat]
        );
    };

    const toggleBrand = (brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand)
                ? prev.filter(b => b !== brand)
                : [...prev, brand]
        );
    };

    const toggleSize = (size) => {
        setSelectedSizes(prev =>
            prev.includes(size)
                ? prev.filter(s => s !== size)
                : [...prev, size]
        );
    };

    const toggleColor = (color) => {
        setSelectedColors(prev =>
            prev.includes(c => c.toLowerCase() === color.toLowerCase())
                ? prev.filter(c => c.toLowerCase() !== color.toLowerCase())
                : [...prev, color]
        );
    };

    const handleSearch = () => {
        onSearch?.({
            search: searchTerm,
            price_min: priceRange.min,
            price_max: priceRange.max,
            categories: selectedCategories,
            brands: selectedBrands,
            sizes: selectedSizes,
            colors: selectedColors,
            in_stock_only: inStockOnly,
            on_sale_only: onSaleOnly,
        });
        setIsOpen(false);
    };

    const handleClear = () => {
        setSearchTerm('');
        setPriceRange({ min: 0, max: 10000000 });
        setSelectedCategories([]);
        setSelectedBrands([]);
        setSelectedSizes([]);
        setSelectedColors([]);
        setInStockOnly(false);
        setOnSaleOnly(false);
    };

    const hasActiveFilters = 
        searchTerm ||
        priceRange.min > 0 ||
        priceRange.max < 10000000 ||
        selectedCategories.length > 0 ||
        selectedBrands.length > 0 ||
        selectedSizes.length > 0 ||
        selectedColors.length > 0 ||
        inStockOnly ||
        onSaleOnly;

    return (
        <div className="relative">
            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search products..."
                    className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 bg-white"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`absolute right-12 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${
                        hasActiveFilters ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    <SlidersHorizontal size={20} />
                </button>
            </div>

            {/* Advanced Filters Modal */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Advanced Filters</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">Price Range</label>
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                                        placeholder="Min"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                                    />
                                </div>
                                <span className="text-gray-400">-</span>
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                        placeholder="Max"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">Categories</label>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => toggleCategory(cat)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            selectedCategories.includes(cat)
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Brands */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">Brands</label>
                            <div className="flex flex-wrap gap-2">
                                {BRANDS.map((brand) => (
                                    <button
                                        key={brand}
                                        onClick={() => toggleBrand(brand)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            selectedBrands.includes(brand)
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {brand}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">Sizes</label>
                            <div className="flex flex-wrap gap-2">
                                {SIZES.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => toggleSize(size)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            selectedSizes.includes(size)
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Colors */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">Colors</label>
                            <div className="flex flex-wrap gap-2">
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => toggleColor(color)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            selectedColors.some(c => c.toLowerCase() === color.toLowerCase())
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Toggles */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={inStockOnly}
                                    onChange={(e) => setInStockOnly(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                />
                                <span className="text-sm text-gray-700">In Stock Only</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={onSaleOnly}
                                    onChange={(e) => setOnSaleOnly(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                />
                                <span className="text-sm text-gray-700">On Sale Only</span>
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                        <button
                            onClick={handleClear}
                            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={handleSearch}
                            className="flex-1 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

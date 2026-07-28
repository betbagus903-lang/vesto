import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X, Check } from 'lucide-react';

export default function SearchableSelect({ 
    value, 
    onChange, 
    options = [], 
    placeholder = 'Search...',
    labelKey = 'name',
    valueKey = 'id',
    isLoading = false,
    onSearch = null,
    clearable = true 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayValue, setDisplayValue] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (value) {
            const selected = options.find(opt => opt[valueKey] === value);
            setDisplayValue(selected);
        } else {
            setDisplayValue(null);
        }
    }, [value, options, valueKey]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (onSearch) {
            onSearch(term);
        }
    };

    const handleSelect = (option) => {
        onChange(option[valueKey]);
        setDisplayValue(option);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleClear = () => {
        onChange(null);
        setDisplayValue(null);
        setSearchTerm('');
    };

    const filteredOptions = options.filter(option => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        const label = String(option[labelKey] || '').toLowerCase();
        return label.includes(searchLower);
    });

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between px-4 py-3 bg-gray-700 border-2 rounded-xl cursor-pointer transition-all ${
                    isOpen ? 'border-blue-500' : 'border-gray-600 hover:border-gray-500'
                }`}
            >
                <div className="flex-1 min-w-0">
                    {displayValue ? (
                        <span className="text-white truncate">{displayValue[labelKey]}</span>
                    ) : (
                        <span className="text-gray-400">{placeholder}</span>
                    )}
                </div>
                <div className="flex items-center gap-2 ml-3">
                    {clearable && displayValue && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClear();
                            }}
                            className="p-1 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    )}
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-700">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Options */}
                    <div className="max-h-64 overflow-y-auto">
                        {isLoading ? (
                            <div className="p-4 text-center text-gray-400">
                                Loading...
                            </div>
                        ) : filteredOptions.length === 0 ? (
                            <div className="p-4 text-center text-gray-400">
                                No results found
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <button
                                    key={option[valueKey]}
                                    onClick={() => handleSelect(option)}
                                    className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center justify-between ${
                                        value === option[valueKey] ? 'bg-gray-700' : ''
                                    }`}
                                >
                                    <span className="text-white truncate">{option[labelKey]}</span>
                                    {value === option[valueKey] && (
                                        <Check className="w-4 h-4 text-blue-500 flex-shrink-0 ml-2" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

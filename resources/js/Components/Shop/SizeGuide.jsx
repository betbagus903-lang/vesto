import { useState } from 'react';
import { X, Ruler } from 'lucide-react';

export default function SizeGuide({ onClose }) {
    const [selectedType, setSelectedType] = useState('clothing');

    const SIZE_CHARTS = {
        clothing: {
            name: 'Clothing Size Chart',
            sizes: [
                { size: 'XS', chest: '34-36', waist: '28-30', hips: '34-36' },
                { size: 'S', chest: '36-38', waist: '30-32', hips: '36-38' },
                { size: 'M', chest: '38-40', waist: '32-34', hips: '38-40' },
                { size: 'L', chest: '40-42', waist: '34-36', hips: '40-42' },
                { size: 'XL', chest: '42-44', waist: '36-38', hips: '42-44' },
                { size: 'XXL', chest: '44-46', waist: '38-40', hips: '44-46' },
            ],
            unit: 'inches',
        },
        shoes: {
            name: 'Shoe Size Chart',
            sizes: [
                { size: 'US 6', uk: '5', eu: '39', cm: '24.5' },
                { size: 'US 7', uk: '6', eu: '40', cm: '25.5' },
                { size: 'US 8', uk: '7', eu: '41', cm: '26' },
                { size: 'US 9', uk: '8', eu: '42', cm: '27' },
                { size: 'US 10', uk: '9', eu: '43', cm: '28' },
                { size: 'US 11', uk: '10', eu: '44', cm: '28.5' },
                { size: 'US 12', uk: '11', eu: '45', cm: '29.5' },
            ],
            unit: 'cm',
        },
        accessories: {
            name: 'Accessory Size Chart',
            sizes: [
                { type: 'Belts', size: 'S', length: '90-95 cm' },
                { type: 'Belts', size: 'M', length: '100-105 cm' },
                { type: 'Belts', size: 'L', length: '110-115 cm' },
                { type: 'Hats', size: 'S', head: '54-56 cm' },
                { type: 'Hats', size: 'M', head: '57-59 cm' },
                { type: 'Hats', size: 'L', head: '60-62 cm' },
            ],
            unit: 'cm',
        },
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Ruler className="w-6 h-6 text-gray-700" />
                        <h2 className="text-xl font-bold text-gray-900">Size Guide</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-700" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Type Selector */}
                    <div className="flex gap-2 mb-6">
                        {Object.keys(SIZE_CHARTS).map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                                    selectedType === type
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    {/* Size Chart */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {SIZE_CHARTS[selectedType].name}
                        </h3>
                        
                        {selectedType === 'clothing' && (
                            <div className="overflow-x-auto">
                                <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Size</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Chest ({SIZE_CHARTS.clothing.unit})</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Waist ({SIZE_CHARTS.clothing.unit})</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Hips ({SIZE_CHARTS.clothing.unit})</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {SIZE_CHARTS.clothing.sizes.map((item, index) => (
                                            <tr key={index} className="border-t border-gray-200">
                                                <td className="px-4 py-3 font-medium text-gray-900">{item.size}</td>
                                                <td className="px-4 py-3 text-gray-600">{item.chest}</td>
                                                <td className="px-4 py-3 text-gray-600">{item.waist}</td>
                                                <td className="px-4 py-3 text-gray-600">{item.hips}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {selectedType === 'shoes' && (
                            <div className="overflow-x-auto">
                                <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">US Size</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">UK Size</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">EU Size</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Foot Length ({SIZE_CHARTS.shoes.unit})</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {SIZE_CHARTS.shoes.sizes.map((item, index) => (
                                            <tr key={index} className="border-t border-gray-200">
                                                <td className="px-4 py-3 font-medium text-gray-900">{item.size}</td>
                                                <td className="px-4 py-3 text-gray-600">{item.uk}</td>
                                                <td className="px-4 py-3 text-gray-600">{item.eu}</td>
                                                <td className="px-4 py-3 text-gray-600">{item.cm}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {selectedType === 'accessories' && (
                            <div className="overflow-x-auto">
                                <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Size</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Measurement ({SIZE_CHARTS.accessories.unit})</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {SIZE_CHARTS.accessories.sizes.map((item, index) => (
                                            <tr key={index} className="border-t border-gray-200">
                                                <td className="px-4 py-3 font-medium text-gray-900 capitalize">{item.type}</td>
                                                <td className="px-4 py-3 text-gray-600">{item.size}</td>
                                                <td className="px-4 py-3 text-gray-600">{item.length || item.head}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Tips */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-2">How to Measure</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• For clothing: Measure around the fullest part of your chest, waist, and hips</li>
                            <li>• For shoes: Measure from heel to toe of your foot</li>
                            <li>• For accessories: Refer to specific product measurements</li>
                            <li>• If you're between sizes, size up for a looser fit</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { X, Check, Minus } from 'lucide-react';

function fmt(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
    }).format(value ?? 0);
}

export default function ProductComparison({ products = [], onClose }) {
    if (products.length === 0) return null;

    const [selectedFeatures, setSelectedFeatures] = useState(['price', 'description', 'stock']);

    const allFeatures = [
        { key: 'price', label: 'Price' },
        { key: 'description', label: 'Description' },
        { key: 'stock', label: 'Stock' },
        { key: 'sku', label: 'SKU' },
        { key: 'weight', label: 'Weight' },
        { key: 'material', label: 'Material' },
        { key: 'dimensions', label: 'Dimensions' },
    ];

    const toggleFeature = (feature) => {
        setSelectedFeatures(prev =>
            prev.includes(feature)
                ? prev.filter(f => f !== feature)
                : [...prev, feature]
        );
    };

    const getFeatureValue = (product, feature) => {
        switch (feature) {
            case 'price':
                return fmt(product.price);
            case 'description':
                return product.description || 'N/A';
            case 'stock':
                return product.stock > 0 ? `${product.stock} available` : 'Out of stock';
            case 'sku':
                return product.sku || 'N/A';
            case 'weight':
                return product.weight ? `${product.weight} kg` : 'N/A';
            case 'material':
                return product.material || 'N/A';
            case 'dimensions':
                return product.dimensions || 'N/A';
            default:
                return 'N/A';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Compare Products ({products.length})</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-700" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Feature Toggle */}
                    <div className="mb-6">
                        <p className="text-sm font-semibold text-gray-900 mb-3">Select features to compare:</p>
                        <div className="flex flex-wrap gap-2">
                            {allFeatures.map((feature) => (
                                <button
                                    key={feature.key}
                                    onClick={() => toggleFeature(feature.key)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        selectedFeatures.includes(feature.key)
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {feature.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comparison Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="text-left p-4 font-semibold text-gray-900 bg-gray-50 rounded-tl-lg">
                                        Feature
                                    </th>
                                    {products.map((product) => (
                                        <th key={product.id} className="p-4 min-w-[250px]">
                                            <div className="space-y-3">
                                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                    {product.image || product.images?.[0] ? (
                                                        <img
                                                            src={product.image || product.images[0]}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <span className="text-gray-400">No image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="font-semibold text-gray-900 line-clamp-2">{product.name}</p>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {selectedFeatures.map((feature) => {
                                    const featureInfo = allFeatures.find(f => f.key === feature);
                                    return (
                                        <tr key={feature} className="border-t border-gray-200">
                                            <td className="p-4 font-medium text-gray-700 bg-gray-50">
                                                {featureInfo?.label}
                                            </td>
                                            {products.map((product) => (
                                                <td key={product.id} className="p-4 text-gray-900">
                                                    {getFeatureValue(product, feature)}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

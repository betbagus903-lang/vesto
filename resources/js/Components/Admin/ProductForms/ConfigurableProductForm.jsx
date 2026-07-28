import { useState } from 'react';

export default function ConfigurableProductForm({ data, onChange, errors = {}, attributeFamily = null }) {
    const [showConfigureModal, setShowConfigureModal] = useState(false);
    const [selectedAttributes, setSelectedAttributes] = useState(data.configurable_attributes || []);

    const handleAttributeToggle = (attributeId) => {
        const newSelected = selectedAttributes.includes(attributeId)
            ? selectedAttributes.filter(id => id !== attributeId)
            : [...selectedAttributes, attributeId];
        
        setSelectedAttributes(newSelected);
        onChange('configurable_attributes', newSelected);
    };

    const getAvailableAttributes = () => {
        if (!attributeFamily || !attributeFamily.attributeGroups) return [];
        
        const attributes = [];
        attributeFamily.attributeGroups.forEach(group => {
            if (group.attributes) {
                group.attributes.forEach(attr => {
                    // Only show select/multiselect attributes for variants
                    if (attr.type === 'select' || attr.type === 'multiselect') {
                        attributes.push(attr);
                    }
                });
            }
        });
        return attributes;
    };

    const availableAttributes = getAvailableAttributes();

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name || ''}
                            onChange={(e) => onChange('name', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter product name"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            SKU Parent <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.sku || ''}
                            onChange={(e) => onChange('sku', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                                errors.sku ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter parent SKU"
                        />
                        {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Short Description
                    </label>
                    <textarea
                        value={data.short_description || ''}
                        onChange={(e) => onChange('short_description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="Enter short description"
                    />
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        value={data.description || ''}
                        onChange={(e) => onChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="Enter product description"
                    />
                </div>
            </div>

            {/* Configure Attributes Button */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Configurable Attributes</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Select attributes to create variants (e.g., Color, Size)
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowConfigureModal(true)}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Configure Attributes
                    </button>
                </div>

                {selectedAttributes.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {selectedAttributes.map(attrId => {
                            const attr = availableAttributes.find(a => a.id === attrId);
                            if (!attr) return null;
                            return (
                                <span key={attr.id} className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm">
                                    {attr.admin_name}
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Configure Attributes Modal */}
            {showConfigureModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Configure Attributes
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setShowConfigureModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {availableAttributes.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">
                                    No selectable attributes available. Please add filterable attributes to the product's category.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {availableAttributes.map(attr => (
                                        <label key={attr.id} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                checked={selectedAttributes.includes(attr.id)}
                                                onChange={() => handleAttributeToggle(attr.id)}
                                                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900">{attr.admin_name}</p>
                                                <p className="text-sm text-gray-500">{attr.code}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowConfigureModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowConfigureModal(false)}
                                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Variants Section */}
            {selectedAttributes.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Variants
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        After saving, variants will be automatically generated based on selected attributes.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                        <p>Variants will be created after saving the product.</p>
                        <p className="text-sm mt-1">
                            Total variants: {selectedAttributes.length > 0 ? 'Will be calculated' : '0'}
                        </p>
                    </div>
                </div>
            )}

            {/* Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
                
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.is_active || false}
                            onChange={(e) => onChange('is_active', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                        <span className="text-sm text-gray-700">Active</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.new || false}
                            onChange={(e) => onChange('new', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                        <span className="text-sm text-gray-700">New</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.featured || false}
                            onChange={(e) => onChange('featured', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                        <span className="text-sm text-gray-700">Featured</span>
                    </label>
                </div>
            </div>
        </div>
    );
}

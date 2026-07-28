import { useState } from 'react';

export default function BundleProductForm({ data, onChange, errors = {}, allProducts = [] }) {
    const [bundleProducts, setBundleProducts] = useState(data.bundle_products || []);

    const handleAddProduct = () => {
        setBundleProducts([
            ...bundleProducts,
            { 
                associated_product_id: '', 
                quantity: 1, 
                is_required: false, 
                is_default: false,
                position: bundleProducts.length 
            }
        ]);
    };

    const handleRemoveProduct = (index) => {
        const newProducts = bundleProducts.filter((_, i) => i !== index);
        setBundleProducts(newProducts);
        onChange('bundle_products', newProducts);
    };

    const handleProductChange = (index, field, value) => {
        const newProducts = [...bundleProducts];
        newProducts[index][field] = value;
        setBundleProducts(newProducts);
        onChange('bundle_products', newProducts);
    };

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
                            SKU <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.sku || ''}
                            onChange={(e) => onChange('sku', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                                errors.sku ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter SKU"
                        />
                        {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.price || ''}
                            onChange={(e) => onChange('price', parseFloat(e.target.value) || 0)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                                errors.price ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Compare At Price
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.compare_at_price || ''}
                            onChange={(e) => onChange('compare_at_price', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                            placeholder="0.00"
                        />
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

            {/* Bundle Options */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Bundle Options</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Add products to this bundle. Customers can select from these options.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleAddProduct}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Add Option
                    </button>
                </div>

                {bundleProducts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No bundle options added yet. Click "Add Option" to start.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bundleProducts.map((item, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product
                                        </label>
                                        <select
                                            value={item.associated_product_id}
                                            onChange={(e) => handleProductChange(index, 'associated_product_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        >
                                            <option value="">Select a product</option>
                                            {allProducts.map(product => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name} ({product.sku})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        />
                                    </div>

                                    <div className="flex items-end">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveProduct(index)}
                                            className="w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={item.is_required}
                                            onChange={(e) => handleProductChange(index, 'is_required', e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                        />
                                        <span className="text-sm text-gray-700">Required</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={item.is_default}
                                            onChange={(e) => handleProductChange(index, 'is_default', e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                        />
                                        <span className="text-sm text-gray-700">Default Option</span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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

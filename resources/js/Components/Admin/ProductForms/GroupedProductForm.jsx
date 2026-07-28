import { useState } from 'react';

export default function GroupedProductForm({ data, onChange, errors = {}, allProducts = [] }) {
    const [groupedProducts, setGroupedProducts] = useState(data.grouped_products || []);

    const handleAddProduct = () => {
        setGroupedProducts([
            ...groupedProducts,
            { associated_product_id: '', quantity: 1, position: groupedProducts.length }
        ]);
    };

    const handleRemoveProduct = (index) => {
        const newProducts = groupedProducts.filter((_, i) => i !== index);
        setGroupedProducts(newProducts);
        onChange('grouped_products', newProducts);
    };

    const handleProductChange = (index, field, value) => {
        const newProducts = [...groupedProducts];
        newProducts[index][field] = value;
        setGroupedProducts(newProducts);
        onChange('grouped_products', newProducts);
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

            {/* Grouped Products */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Grouped Products</h3>
                    <button
                        type="button"
                        onClick={handleAddProduct}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Add Product
                    </button>
                </div>

                {groupedProducts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No products added yet. Click "Add Product" to start.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {groupedProducts.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                                <div className="flex-1">
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

                                <div className="w-32">
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

                                <button
                                    type="button"
                                    onClick={() => handleRemoveProduct(index)}
                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    Remove
                                </button>
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

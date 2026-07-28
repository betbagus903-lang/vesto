import { useState } from 'react';

export default function DownloadableProductForm({ data, onChange, errors = {} }) {
    const [downloadableData, setDownloadableData] = useState(data.downloadable || {});

    const handleChange = (field, value) => {
        onChange(field, value);
    };

    const handleDownloadableChange = (field, value) => {
        const newData = { ...downloadableData, [field]: value };
        setDownloadableData(newData);
        onChange('downloadable', newData);
    };

    const handleFileChange = (field, file) => {
        if (file) {
            const newData = { ...downloadableData, [field]: file };
            setDownloadableData(newData);
            onChange('downloadable', newData);
        }
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
                            onChange={(e) => handleChange('name', e.target.value)}
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
                            onChange={(e) => handleChange('sku', e.target.value)}
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
                            onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
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
                            onChange={(e) => handleChange('compare_at_price', parseFloat(e.target.value) || 0)}
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
                        onChange={(e) => handleChange('short_description', e.target.value)}
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
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="Enter product description"
                    />
                </div>
            </div>

            {/* Downloadable Links */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Downloadable Links</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Download File <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            onChange={(e) => handleFileChange('file', e.target.files[0])}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                            accept=".pdf,.zip,.rar,.doc,.docx,.mp3,.mp4"
                        />
                        {downloadableData.file_path && (
                            <p className="text-sm text-gray-500 mt-1">
                                Current file: {downloadableData.file_path}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sample File
                        </label>
                        <input
                            type="file"
                            onChange={(e) => handleFileChange('sample_file', e.target.files[0])}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                            accept=".pdf,.zip,.rar,.doc,.docx,.mp3,.mp4"
                        />
                        {downloadableData.sample_file_path && (
                            <p className="text-sm text-gray-500 mt-1">
                                Current sample: {downloadableData.sample_file_path}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Download Limit
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={downloadableData.download_limit || ''}
                            onChange={(e) => handleDownloadableChange('download_limit', parseInt(e.target.value) || null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                            placeholder="Leave empty for unlimited"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited downloads</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date
                        </label>
                        <input
                            type="date"
                            value={downloadableData.expiry_date || ''}
                            onChange={(e) => handleDownloadableChange('expiry_date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty for no expiry</p>
                    </div>
                </div>
            </div>

            {/* Downloadable Product Notice */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Downloadable Product</h3>
                <p className="text-sm text-purple-700">
                    This is a downloadable product. Shipping, weight, dimensions, and physical inventory are not applicable.
                </p>
            </div>

            {/* Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
                
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.is_active || false}
                            onChange={(e) => handleChange('is_active', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                        <span className="text-sm text-gray-700">Active</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.new || false}
                            onChange={(e) => handleChange('new', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                        <span className="text-sm text-gray-700">New</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.featured || false}
                            onChange={(e) => handleChange('featured', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                        <span className="text-sm text-gray-700">Featured</span>
                    </label>
                </div>
            </div>
        </div>
    );
}

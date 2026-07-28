import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ChevronLeft, Save, Plus, Trash2, Package, Eye } from 'lucide-react';

export default function CollectionEdit({ collection }) {
    const { data, setData, put, processing, errors } = useForm({
        name: collection.name,
        description: collection.description || '',
        type: collection.type,
        is_active: collection.is_active,
        sort_order: collection.sort_order,
        rules: collection.rules?.map((rule, index) => ({
            id: rule.id,
            field: rule.field,
            operator: rule.operator,
            value: rule.value,
            logical_operator: rule.logical_operator,
            sort_order: rule.sort_order,
        })) || [],
    });

    const [previewCount, setPreviewCount] = useState(0);
    const [previewLoading, setPreviewLoading] = useState(false);

    const ruleFields = [
        { value: 'category', label: 'Category', type: 'select' },
        { value: 'product_type', label: 'Product Type', type: 'select' },
        { value: 'brand', label: 'Brand', type: 'select' },
        { value: 'price', label: 'Price', type: 'number' },
        { value: 'discount', label: 'Discount %', type: 'number' },
        { value: 'stock', label: 'Stock', type: 'number' },
        { value: 'status', label: 'Status', type: 'select' },
        { value: 'created_date', label: 'Created Date', type: 'date' },
    ];

    const operators = [
        { value: '=', label: 'Equals' },
        { value: '!=', label: 'Not Equals' },
        { value: '>', label: 'Greater Than' },
        { value: '<', label: 'Less Than' },
        { value: '>=', label: 'Greater Than or Equal' },
        { value: '<=', label: 'Less Than or Equal' },
        { value: 'contains', label: 'Contains' },
        { value: 'in', label: 'In' },
    ];

    const addRule = () => {
        setData('rules', [
            ...data.rules,
            {
                id: Date.now(),
                field: 'category',
                operator: '=',
                value: '',
                logical_operator: 'AND',
                sort_order: data.rules.length,
            },
        ]);
    };

    const removeRule = (ruleId) => {
        setData('rules', data.rules.filter((rule) => rule.id !== ruleId));
    };

    const updateRule = (ruleId, field, value) => {
        setData(
            'rules',
            data.rules.map((rule) =>
                rule.id === ruleId ? { ...rule, [field]: value } : rule
            )
        );
    };

    const previewRules = async () => {
        setPreviewLoading(true);
        try {
            const response = await fetch(route('admin.cms.collections.preview'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rules: data.rules }),
            });
            const result = await response.json();
            setPreviewCount(result.count);
        } catch (error) {
            console.error('Failed to preview rules:', error);
        } finally {
            setPreviewLoading(false);
        }
    };

    useEffect(() => {
        if (data.rules.length > 0) {
            previewRules();
        } else {
            setPreviewCount(0);
        }
    }, [data.rules]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!data.name) {
            alert('Please enter a collection name');
            return;
        }
        if (data.type === 'dynamic' && data.rules.length === 0) {
            alert('Please add at least one rule for dynamic collections');
            return;
        }

        put(route('admin.cms.collections.update', collection.id));
    };

    return (
        <AdminLayout>
            <Head title="Edit Collection" />

            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={route('admin.cms.collections.index')}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Collections
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Edit Collection</h1>
                    <p className="text-gray-400">Edit {collection.name} collection</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Collection Details */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Collection Info Card */}
                            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl">
                                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Collection Details
                                </h2>
                                
                                <div className="space-y-5">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Name <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="Summer Sale"
                                        />
                                        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                            rows={3}
                                            placeholder="Collection description (optional)"
                                        />
                                        {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                                    </div>

                                    {/* Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Type <span className="text-red-400">*</span>
                                        </label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        >
                                            <option value="dynamic">Dynamic (Rule-based)</option>
                                            <option value="manual">Manual (Manual selection)</option>
                                        </select>
                                        {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type}</p>}
                                    </div>

                                    {/* Sort Order */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Sort Order
                                        </label>
                                        <input
                                            type="number"
                                            value={data.sort_order}
                                            onChange={(e) => setData('sort_order', parseInt(e.target.value))}
                                            className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                        <p className="text-gray-500 text-xs mt-1">Lower numbers appear first</p>
                                        {errors.sort_order && <p className="text-red-400 text-sm mt-1">{errors.sort_order}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Preview Card */}
                            {data.type === 'dynamic' && (
                                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl">
                                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <Eye className="w-5 h-5" />
                                        Preview
                                    </h2>
                                    <div className="text-center py-4">
                                        {previewLoading ? (
                                            <p className="text-gray-400">Loading...</p>
                                        ) : (
                                            <>
                                                <p className="text-4xl font-bold text-white mb-2">{previewCount}</p>
                                                <p className="text-gray-400 text-sm">Products match these rules</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Rule Builder */}
                        <div className="lg:col-span-2 space-y-6">
                            {data.type === 'dynamic' ? (
                                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-lg font-semibold text-white">Rule Builder</h2>
                                        <button
                                            type="button"
                                            onClick={addRule}
                                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Rule
                                        </button>
                                    </div>

                                    {data.rules.length === 0 ? (
                                        <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-xl">
                                            <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                            <p className="text-gray-400 mb-4">No rules added yet</p>
                                            <button
                                                type="button"
                                                onClick={addRule}
                                                className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add First Rule
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {data.rules.map((rule, index) => (
                                                <div
                                                    key={rule.id}
                                                    className="bg-gray-700/50 rounded-xl p-4 border border-gray-600"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        {/* Logical Operator */}
                                                        {index > 0 && (
                                                            <select
                                                                value={rule.logical_operator}
                                                                onChange={(e) => updateRule(rule.id, 'logical_operator', e.target.value)}
                                                                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                                            >
                                                                <option value="AND">AND</option>
                                                                <option value="OR">OR</option>
                                                            </select>
                                                        )}

                                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                                                            {/* Field */}
                                                            <select
                                                                value={rule.field}
                                                                onChange={(e) => updateRule(rule.id, 'field', e.target.value)}
                                                                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                                            >
                                                                {ruleFields.map((field) => (
                                                                    <option key={field.value} value={field.value}>
                                                                        {field.label}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            {/* Operator */}
                                                            <select
                                                                value={rule.operator}
                                                                onChange={(e) => updateRule(rule.id, 'operator', e.target.value)}
                                                                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                                            >
                                                                {operators.map((op) => (
                                                                    <option key={op.value} value={op.value}>
                                                                        {op.label}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            {/* Value */}
                                                            <input
                                                                type="text"
                                                                value={rule.value}
                                                                onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                                                                className="md:col-span-2 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                                                placeholder="Value"
                                                            />
                                                        </div>

                                                        {/* Delete Rule */}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeRule(rule.id)}
                                                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl">
                                    <h2 className="text-lg font-semibold text-white mb-4">Manual Selection</h2>
                                    <p className="text-gray-400 mb-4">
                                        For manual collections, you will be able to select products individually after saving.
                                    </p>
                                    <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-xl">
                                        <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-400">Product selection will be available after saving</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-700">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-8 py-3 rounded-xl transition-colors font-medium"
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'Saving...' : 'Save Collection'}
                        </button>
                        <Link
                            href={route('admin.cms.collections.index')}
                            className="px-8 py-3 border-2 border-gray-600 text-gray-300 hover:bg-gray-700 rounded-xl transition-colors font-medium"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

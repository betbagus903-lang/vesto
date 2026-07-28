import { useState, useRef } from 'react';
import { X, Upload, Trash2, ExternalLink } from 'lucide-react';

export default function EditVariantModal({ variant, onClose, onSaved }) {
    const [formData, setFormData] = useState({
        name: variant.name || '',
        sku: variant.sku || '',
        price: variant.price || 0,
        stock: variant.stock || 0,
        weight: variant.weight || 0,
        is_active: variant.is_active ?? true,
    });
    const [existingImages, setExistingImages] = useState(variant.images || []);
    const [newImageFiles, setNewImageFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setNewImageFiles(prev => [...prev, ...Array.from(files)]);
        e.target.value = '';
    };

    const handleRemoveExisting = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveNew = (index) => {
        setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const form = new FormData();
            form.append('name', formData.name);
            form.append('sku', formData.sku);
            form.append('price', formData.price);
            form.append('stock', formData.stock);
            form.append('weight', formData.weight);
            form.append('is_active', formData.is_active ? '1' : '0');

            // Add existing images
            existingImages.forEach((img, idx) => {
                form.append(`existing_images[${idx}]`, img);
            });

            // Add new images
            newImageFiles.forEach((file, idx) => {
                form.append(`new_images[${idx}]`, file);
            });

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            const response = await fetch(`/admin/product-variants/${variant.id}/update`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: form,
            });

            if (response.ok) {
                setLoading(false);
                setShowSuccess(true);
                setNewImageFiles([]);
                if (onSaved) {
                    onSaved();
                }
                setTimeout(() => {
                    onClose();
                    setShowSuccess(false);
                }, 1500);
            } else {
                const errorData = await response.json();
                setErrors(errorData.errors || {});
                setLoading(false);
            }
        } catch (error) {
            console.error('Error updating variant:', error);
            setLoading(false);
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 40,
                }}
                onClick={onClose}
            />

            {/* Right Side Drawer (ORIGINAL POSITION!) */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '420px',
                    height: '100vh',
                    backgroundColor: '#101827',
                    borderLeft: '1px solid #1E293B',
                    zIndex: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideIn 0.3s ease-out',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        height: '64px',
                        padding: '12px 24px',
                        borderBottom: '1px solid #1E293B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'sticky',
                        top: 0,
                        backgroundColor: '#101827',
                        zIndex: 10,
                    }}
                >
                    <span style={{ fontSize: '16px', fontWeight: 600, color: '#F8FAFC' }}>
                        Edit Variant
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: loading ? '#1E293B' : '#3B82F6',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 500,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.6 : 1,
                            }}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#94A3B8',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '24px',
                    }}
                >
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Name */}
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: '#94A3B8', marginBottom: '8px' }}>
                                Name <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    backgroundColor: '#0C1524',
                                    border: `1px solid ${errors.name ? '#EF4444' : '#1E293B'}`,
                                    borderRadius: '8px',
                                    color: '#F8FAFC',
                                    fontSize: '14px',
                                    outline: 'none',
                                }}
                            />
                            {errors.name && <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.name}</p>}
                        </div>

                        {/* SKU */}
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: '#94A3B8', marginBottom: '8px' }}>
                                SKU <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    backgroundColor: '#0C1524',
                                    border: `1px solid ${errors.sku ? '#EF4444' : '#1E293B'}`,
                                    borderRadius: '8px',
                                    color: '#F8FAFC',
                                    fontSize: '14px',
                                    outline: 'none',
                                }}
                            />
                            {errors.sku && <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.sku}</p>}
                        </div>

                        {/* Price */}
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: '#94A3B8', marginBottom: '8px' }}>
                                Price <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    backgroundColor: '#0C1524',
                                    border: `1px solid ${errors.price ? '#EF4444' : '#1E293B'}`,
                                    borderRadius: '8px',
                                    color: '#F8FAFC',
                                    fontSize: '14px',
                                    outline: 'none',
                                }}
                            />
                            {errors.price && <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.price}</p>}
                        </div>

                        {/* Status */}
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: '#94A3B8', marginBottom: '8px' }}>
                                Status
                            </label>
                            <select
                                name="is_active"
                                value={formData.is_active ? '1' : '0'}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === '1' }))}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    backgroundColor: '#0C1524',
                                    border: '1px solid #1E293B',
                                    borderRadius: '8px',
                                    color: '#F8FAFC',
                                    fontSize: '14px',
                                    outline: 'none',
                                }}
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>

                        {/* Weight */}
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: '#94A3B8', marginBottom: '8px' }}>
                                Weight
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    backgroundColor: '#0C1524',
                                    border: '1px solid #1E293B',
                                    borderRadius: '8px',
                                    color: '#F8FAFC',
                                    fontSize: '14px',
                                    outline: 'none',
                                }}
                            />
                        </div>

                        {/* Divider */}
                        <div style={{ height: '1px', backgroundColor: '#1E293B', margin: '8px 0' }} />

                        {/* Quantities */}
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: '#94A3B8', marginBottom: '8px' }}>
                                Stock
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    backgroundColor: '#0C1524',
                                    border: `1px solid ${errors.stock ? '#EF4444' : '#1E293B'}`,
                                    borderRadius: '8px',
                                    color: '#F8FAFC',
                                    fontSize: '14px',
                                    outline: 'none',
                                }}
                            />
                            {errors.stock && <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.stock}</p>}
                        </div>

                        {/* Divider */}
                        <div style={{ height: '1px', backgroundColor: '#1E293B', margin: '8px 0' }} />

                        {/* Images */}
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: '#94A3B8', marginBottom: '8px' }}>
                                Images
                            </label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 16px',
                                    backgroundColor: '#0C1524',
                                    border: '1px solid #1E293B',
                                    borderRadius: '8px',
                                    color: '#94A3B8',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                }}
                            >
                                <Upload size={16} />
                                Upload Image
                            </button>

                            {/* Existing and New Images */}
                            {(existingImages.length > 0 || newImageFiles.length > 0) && (
                                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                                    {/* Existing Images */}
                                    {existingImages.map((img, index) => (
                                        <div key={`existing-${index}`} style={{ position: 'relative' }}>
                                            <img
                                                src={img.startsWith('http') ? img : `/storage/${img}`}
                                                alt={`Variant image ${index + 1}`}
                                                style={{
                                                    width: '64px',
                                                    height: '64px',
                                                    borderRadius: '8px',
                                                    objectFit: 'cover',
                                                    backgroundColor: '#0C1524',
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveExisting(index)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '-6px',
                                                    right: '-6px',
                                                    padding: '4px',
                                                    borderRadius: '50%',
                                                    backgroundColor: '#EF4444',
                                                    color: '#fff',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* New Images */}
                                    {newImageFiles.map((file, index) => (
                                        <div key={`new-${index}`} style={{ position: 'relative' }}>
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`New image ${index + 1}`}
                                                style={{
                                                    width: '64px',
                                                    height: '64px',
                                                    borderRadius: '8px',
                                                    objectFit: 'cover',
                                                    backgroundColor: '#0C1524',
                                                    opacity: 0.8,
                                                    outline: '2px dashed #3B82F6',
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveNew(index)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '-6px',
                                                    right: '-6px',
                                                    padding: '4px',
                                                    borderRadius: '50%',
                                                    backgroundColor: '#EF4444',
                                                    color: '#fff',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {newImageFiles.length > 0 && (
                                <p style={{ marginTop: '6px', fontSize: '11px', color: '#3B82F6' }}>
                                    {newImageFiles.length} image(s) will be uploaded when you Save
                                </p>
                            )}
                        </div>

                        {/* Divider */}
                        <div style={{ height: '1px', backgroundColor: '#1E293B', margin: '8px 0' }} />

                        {/* Open Full Variant Detail */}
                        <button
                            type="button"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 16px',
                                backgroundColor: 'transparent',
                                border: '1px solid #1E293B',
                                borderRadius: '8px',
                                color: '#94A3B8',
                                fontSize: '13px',
                                cursor: 'pointer',
                                width: '100%',
                            }}
                        >
                            <ExternalLink size={16} />
                            Open Full Variant Detail
                        </button>
                    </form>
                </div>

                {/* Success Toast */}
                {showSuccess && (
                    <div
                        style={{
                            position: 'fixed',
                            bottom: '24px',
                            right: '24px',
                            padding: '12px 20px',
                            backgroundColor: '#10B981',
                            color: '#fff',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 500,
                            zIndex: 60,
                            animation: 'fadeIn 0.3s ease-out',
                        }}
                    >
                        Variant saved successfully
                    </div>
                )}

                <style>{`
                    @keyframes slideIn {
                        from {
                            transform: translateX(100%);
                        }
                        to {
                            transform: translateX(0);
                        }
                    }
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>
            </div>
        </>
    );
}

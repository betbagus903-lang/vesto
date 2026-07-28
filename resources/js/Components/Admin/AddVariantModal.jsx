import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddVariantModal({ show, onClose, productId, familyGroups, configurableAttributeIds, onSuccess }) {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Extract configurable attributes with their options from familyGroups
    const configurableAttributes = React.useMemo(() => {
        console.log('=== AddVariantModal: Building configurable attributes ===');
        console.log('Raw props:');
        console.log('  - show:', show);
        console.log('  - productId:', productId);
        console.log('  - familyGroups:', familyGroups);
        console.log('  - configurableAttributeIds:', configurableAttributeIds);
        
        const result = [];
        
        if (!familyGroups || !Array.isArray(familyGroups)) {
            console.error('  ERROR: familyGroups is not an array!', typeof familyGroups);
            return result;
        }
        
        if (!configurableAttributeIds || !Array.isArray(configurableAttributeIds)) {
            console.error('  ERROR: configurableAttributeIds is not an array!', typeof configurableAttributeIds);
            return result;
        }
        
        console.log('  Processing', familyGroups.length, 'groups...');
        familyGroups.forEach(group => {
            console.log('    Group:', group.name);
            if (!group.attributes || !Array.isArray(group.attributes)) {
                console.warn('      No attributes array in group');
                return;
            }
            
            group.attributes.forEach(attr => {
                console.log('      Attr:', attr.id, attr.code, '- Checking if in config IDs...');
                if (configurableAttributeIds.includes(attr.id)) {
                    console.log('        ✓ MATCH! Adding to result');
                    console.log('          Options:', attr.options?.length || 0);
                    result.push(attr);
                } else {
                    console.log('        ✗ Not in config IDs');
                }
            });
        });
        
        console.log('  Final result:', result.length, 'attributes');
        return result;
    }, [familyGroups, configurableAttributeIds, show]);

    if (!show) return null;

    const handleChange = (attrCode, value) => {
        setFormData(prev => ({ ...prev, [attrCode]: value }));
        setErrors(prev => ({ ...prev, [attrCode]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const csrf = document.querySelector('meta[name="csrf-token"]')?.content || '';

        try {
            const response = await fetch(`/admin/products/${productId}/variants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ attributes: formData }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    alert(data.message || 'Failed to create variant');
                }
                setLoading(false);
                return;
            }

            // Success
            setFormData({});
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error('Add variant error:', err);
            alert('Error creating variant: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const modalStyle = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
    };

    const modalContent = {
        backgroundColor: '#1E293B',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
        border: '1px solid #334155',
    };

    const header = {
        padding: '20px 24px',
        borderBottom: '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    };

    const body = {
        padding: '24px',
    };

    const footer = {
        padding: '16px 24px',
        borderTop: '1px solid #334155',
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
    };

    const inputStyle = (hasError) => ({
        width: '100%',
        padding: '10px 12px',
        backgroundColor: '#0F172A',
        border: `1px solid ${hasError ? '#EF4444' : '#334155'}`,
        borderRadius: '8px',
        color: '#F8FAFC',
        fontSize: '14px',
        outline: 'none',
    });

    const labelStyle = {
        display: 'block',
        fontSize: '13px',
        fontWeight: 500,
        color: '#94A3B8',
        marginBottom: '8px',
    };

    const errorStyle = {
        fontSize: '12px',
        color: '#EF4444',
        marginTop: '4px',
    };

    return (
        <div style={modalStyle} onClick={onClose}>
            <div style={modalContent} onClick={(e) => e.stopPropagation()}>
                <div style={header}>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#F8FAFC', margin: 0 }}>
                        Add Variant
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            padding: '4px',
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={body}>
                        {configurableAttributes && configurableAttributes.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {configurableAttributes.map((attr) => (
                                    <div key={attr.code}>
                                        <label style={labelStyle}>
                                            {attr.admin_name}
                                            {attr.is_required && <span style={{ color: '#EF4444' }}> *</span>}
                                        </label>
                                        
                                        {attr.type === 'select' && attr.options && attr.options.length > 0 ? (
                                            <select
                                                value={formData[attr.code] || ''}
                                                onChange={(e) => handleChange(attr.code, e.target.value)}
                                                style={inputStyle(errors[attr.code])}
                                                required={attr.is_required}
                                            >
                                                <option value="">— Select {attr.admin_name} —</option>
                                                {attr.options.map((opt) => (
                                                    <option key={opt.id} value={opt.id}>
                                                        {opt.admin_name}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                value={formData[attr.code] || ''}
                                                onChange={(e) => handleChange(attr.code, e.target.value)}
                                                style={inputStyle(errors[attr.code])}
                                                placeholder={`Enter ${attr.admin_name}`}
                                                required={attr.is_required}
                                            />
                                        )}
                                        
                                        {errors[attr.code] && (
                                            <div style={errorStyle}>{errors[attr.code]}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ 
                                textAlign: 'center', 
                                padding: '40px 20px', 
                                color: '#64748B',
                                backgroundColor: '#0F172A',
                                borderRadius: '8px',
                                border: '1px dashed #334155',
                            }}>
                                <p style={{ fontSize: 14, marginBottom: 8, color: '#94A3B8' }}>
                                    No configurable attributes found.
                                </p>
                                <p style={{ fontSize: 12, marginBottom: 20, color: '#64748B' }}>
                                    Please configure product attributes first before adding variants.
                                </p>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    style={{
                                        padding: '8px 20px',
                                        fontSize: 13,
                                        fontWeight: 500,
                                        backgroundColor: '#3B82F6',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    OK, Got it
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={footer}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '8px 16px',
                                fontSize: '14px',
                                fontWeight: 500,
                                backgroundColor: '#334155',
                                color: '#F8FAFC',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !configurableAttributes || configurableAttributes.length === 0}
                            style={{
                                padding: '8px 20px',
                                fontSize: '14px',
                                fontWeight: 500,
                                backgroundColor: loading ? '#64748B' : '#3B82F6',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.6 : 1,
                            }}
                        >
                            {loading ? 'Adding...' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

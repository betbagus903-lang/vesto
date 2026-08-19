import { useState } from 'react';
import { router } from '@inertiajs/react';
import { X, Check, Zap } from 'lucide-react';

export default function ConfigurableAttributesModal({ product, attributeFamily, onClose, onSuccess }) {
    // Initialize with ALL options selected by default
    const [selectedOptions, setSelectedOptions] = useState(() => {
        const init = {};
        if (!attributeFamily?.attributeGroups) return init;
        attributeFamily.attributeGroups.forEach(group => {
            (group.attributes || []).forEach(attr => {
                if ((attr.type === 'select' || attr.type === 'multiselect') && attr.is_configurable) {
                    init[attr.id] = (attr.options || []).map(o => o.id);
                }
            });
        });
        return init;
    });
    const [loading, setLoading] = useState(false);

    const availableAttributes = (() => {
        if (!attributeFamily?.attributeGroups) return [];
        const result = [];
        attributeFamily.attributeGroups.forEach(group => {
            (group.attributes || []).forEach(attr => {
                if ((attr.type === 'select' || attr.type === 'multiselect') && attr.is_configurable) {
                    result.push(attr);
                }
            });
        });
        return result;
    })();

    const toggleOption = (attrId, optId) => {
        setSelectedOptions(prev => {
            const cur = prev[attrId] || [];
            return {
                ...prev,
                [attrId]: cur.includes(optId) ? cur.filter(id => id !== optId) : [...cur, optId],
            };
        });
    };

    const selectAllOptions = (attrId) => {
        const attr = availableAttributes.find(a => a.id === attrId);
        if (!attr) return;
        setSelectedOptions(prev => ({
            ...prev,
            [attrId]: (attr.options || []).map(o => o.id),
        }));
    };

    const deselectAllOptions = (attrId) => {
        setSelectedOptions(prev => ({
            ...prev,
            [attrId]: [],
        }));
    };

    // Total variants = product of selected counts (only attrs with ≥1 selection)
    const totalVariants = (() => {
        const counts = Object.values(selectedOptions).filter(arr => arr.length > 0).map(arr => arr.length);
        return counts.length === 0 ? 0 : counts.reduce((a, b) => a * b, 1);
    })();

    const hasSelection = totalVariants > 0;

    const handleGenerate = () => {
        if (!hasSelection) return;
        setLoading(true);
        router.post(`/admin/products/${product.id}/configure-attributes`, {
            selected_options: selectedOptions,
        }, {
            onFinish: () => setLoading(false),
            onSuccess: (page) => {
                // Check for redirect in response or props
                const redirectUrl = page.props.redirect_url || (page.props.flash?.redirect_url);
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                } else {
                    // Fallback to configurable edit page (note: configurableedit without hyphen)
                    window.location.href = `/admin/products/${product.id}/configurableedit`;
                }
            },
            onError: (errors) => {
                console.error('Error generating variants:', errors);
                setLoading(false);
            },
        });
    };

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 50,
                backgroundColor: 'rgba(0,0,0,0.75)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '24px',
            }}
        >
            <div style={{
                backgroundColor: '#101827',
                border: '1px solid #1E293B',
                borderRadius: '14px',
                width: '100%',
                maxWidth: '640px',
                maxHeight: '88vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}>

                {/* ── HEADER (fixed) ── */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #1E293B',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexShrink: 0,
                }}>
                    <div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                            Configure Variant Attributes
                        </h3>
                        <p style={{ fontSize: 12, color: '#64748B', marginTop: 4, marginBottom: 0 }}>
                            Select options to generate product variants
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#64748B', padding: 4, borderRadius: 6,
                            display: 'flex', alignItems: 'center',
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ── BODY (scrollable) ── */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
                    {availableAttributes.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#475569' }}>
                            <p style={{ fontSize: 14 }}>No configurable attributes found in this Attribute Family.</p>
                            <p style={{ fontSize: 12, marginTop: 6 }}>
                                Add select/multiselect attributes with <em>is_configurable</em> enabled.
                            </p>
                        </div>
                    ) : (
                        availableAttributes.map((attr, idx) => {
                            const selected = selectedOptions[attr.id] || [];
                            return (
                                <div
                                    key={attr.id}
                                    style={{
                                        marginBottom: idx < availableAttributes.length - 1 ? 28 : 0,
                                    }}
                                >
                                    {/* Attribute label + divider */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                        <span style={{
                                            fontSize: 13, fontWeight: 700,
                                            color: '#CBD5E1', textTransform: 'uppercase',
                                            letterSpacing: '0.07em', whiteSpace: 'nowrap',
                                        }}>
                                            {attr.admin_name}
                                        </span>
                                        {selected.length > 0 && (
                                            <span style={{
                                                fontSize: 11, color: '#3B82F6',
                                                backgroundColor: '#1D4ED820',
                                                border: '1px solid #3B82F640',
                                                borderRadius: 20, padding: '1px 8px',
                                            }}>
                                                {selected.length} selected
                                            </span>
                                        )}
                                        <div style={{ flex: 1, height: 1, backgroundColor: '#1E293B' }} />
                                        {/* Select All / Deselect All buttons */}
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button
                                                type="button"
                                                onClick={() => selectAllOptions(attr.id)}
                                                style={{
                                                    padding: '4px 10px',
                                                    fontSize: 11,
                                                    border: '1px solid #3B82F6',
                                                    borderRadius: 6,
                                                    backgroundColor: '#1D4ED820',
                                                    color: '#3B82F6',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Select All
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deselectAllOptions(attr.id)}
                                                style={{
                                                    padding: '4px 10px',
                                                    fontSize: 11,
                                                    border: '1px solid #EF4444',
                                                    borderRadius: 6,
                                                    backgroundColor: '#7F1D1D20',
                                                    color: '#EF4444',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Deselect All
                                            </button>
                                        </div>
                                    </div>

                                    {/* Chips */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        {(attr.options || []).map(opt => {
                                            const isSelected = selected.includes(opt.id);
                                            return (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => toggleOption(attr.id, opt.id)}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 5,
                                                        padding: '6px 14px',
                                                        borderRadius: 8,
                                                        fontSize: 13,
                                                        fontWeight: isSelected ? 600 : 400,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.15s',
                                                        border: isSelected
                                                            ? '1.5px solid #3B82F6'
                                                            : '1.5px solid #1E293B',
                                                        backgroundColor: isSelected
                                                            ? '#1D4ED820'
                                                            : '#0C1524',
                                                        color: isSelected ? '#60A5FA' : '#475569',
                                                        opacity: isSelected ? 1 : 0.45,
                                                        textDecoration: isSelected ? 'none' : 'line-through',
                                                    }}
                                                >
                                                    {isSelected && (
                                                        <Check size={12} strokeWidth={3} style={{ color: '#3B82F6', flexShrink: 0 }} />
                                                    )}
                                                    {opt.admin_name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* ── FOOTER (fixed) ── */}
                <div style={{
                    borderTop: '1px solid #1E293B',
                    backgroundColor: '#0C1524',
                    padding: '16px 24px',
                    flexShrink: 0,
                }}>
                    {/* Summary row */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        marginBottom: 14,
                    }}>
                        {/* Per-attribute counts */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px' }}>
                            {availableAttributes.map(attr => {
                                const count = (selectedOptions[attr.id] || []).length;
                                if (count === 0) return null;
                                return (
                                    <span key={attr.id} style={{ fontSize: 12, color: '#64748B' }}>
                                        <span style={{ color: '#94A3B8', fontWeight: 600 }}>{attr.admin_name}</span>
                                        {' '}
                                        <span style={{ color: '#3B82F6' }}>{count}</span>
                                    </span>
                                );
                            })}
                        </div>

                        {/* Total variants */}
                        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                            <span style={{ fontSize: 12, color: '#64748B' }}>Variants to generate: </span>
                            <span style={{
                                fontSize: 15, fontWeight: 700,
                                color: hasSelection ? '#F8FAFC' : '#475569',
                            }}>
                                {totalVariants}
                            </span>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '8px 18px',
                                border: '1px solid #1E293B',
                                borderRadius: 8,
                                color: '#94A3B8',
                                backgroundColor: 'transparent',
                                cursor: 'pointer',
                                fontSize: 13,
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleGenerate}
                            disabled={!hasSelection || loading}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 7,
                                padding: '8px 20px',
                                borderRadius: 8,
                                fontSize: 13, fontWeight: 600,
                                color: '#fff',
                                border: 'none',
                                cursor: hasSelection && !loading ? 'pointer' : 'not-allowed',
                                backgroundColor: hasSelection && !loading ? '#3B82F6' : '#1E293B',
                                opacity: hasSelection && !loading ? 1 : 0.6,
                                transition: 'background-color 0.15s',
                            }}
                        >
                            {loading ? (
                                <>
                                    <div style={{
                                        width: 14, height: 14,
                                        border: '2px solid #fff',
                                        borderTopColor: 'transparent',
                                        borderRadius: '50%',
                                        animation: 'spin .6s linear infinite',
                                    }} />
                                    Generating…
                                </>
                            ) : (
                                <>
                                    <Zap size={14} />
                                    Generate Variants{hasSelection ? ` (${totalVariants})` : ''}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

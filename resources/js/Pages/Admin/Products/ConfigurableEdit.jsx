


import React, { useState, useRef, useEffect, useCallback } from "react";
import { router } from "@inertiajs/react";
import AdminLayout from "../../../Components/Admin/AdminLayout";
import RichTextEditor from "../../../Components/Admin/RichTextEditor";
import EditVariantModal from "../../../Components/Admin/EditVariantModal";
import CategoryMultiSelectTree from "../../../Components/Admin/CategoryMultiSelectTree";
import {
    Save, X, Plus, Trash2,
    ChevronDown, ChevronRight,
    Search, Upload, Video,
    PlusCircle, Zap, RefreshCw,
} from "lucide-react";

/* ─── shared input style ──────────────────────────────────────── */
const inp = (err = false) => ({
    width: "100%", padding: "9px 12px",
    backgroundColor: "#0C1524",
    border: `1px solid ${err ? "#EF4444" : "#1E293B"}`,
    borderRadius: "8px", color: "#F8FAFC",
    fontSize: "14px", outline: "none",
    height: "44px", boxSizing: "border-box",
});

const cardStyle = {
    backgroundColor: "#101827",
    border: "1px solid #1E293B",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
};

const cardTitle = {
    fontSize: "16px", fontWeight: "700",
    color: "#FFFFFF", marginBottom: "20px",
};

/* ─── Toggle switch ───────────────────────────────────────────── */
function Toggle({ checked, onChange }) {
    return (
        <div
            onClick={onChange}
            style={{
                width: "44px", height: "24px", borderRadius: "12px", cursor: "pointer",
                backgroundColor: checked ? "#3B82F6" : "#4B5563",
                position: "relative", transition: "background-color 0.2s", flexShrink: 0,
            }}
        >
            <div style={{
                position: "absolute", top: "4px", width: "16px", height: "16px",
                backgroundColor: "#fff", borderRadius: "50%", transition: "transform 0.2s",
                transform: checked ? "translateX(24px)" : "translateX(4px)",
            }} />
        </div>
    );
}

/* ─── Dynamic attribute field renderer ───────────────────────── */
function AttrField({ attr, value, onChange }) {
    const label = (
        <label style={{ display: "block", fontSize: "13px", color: "#94A3B8", marginBottom: "6px" }}>
            {attr.admin_name}
            {attr.is_required && <span style={{ color: "#EF4444" }}> *</span>}
        </label>
    );

    if (attr.type === "textarea") return (
        <div>
            {label}
            <textarea rows={4} value={value ?? ""} onChange={e => onChange(e.target.value)}
                style={{ ...inp(), height: "auto", padding: "9px 12px", resize: "vertical" }} />
        </div>
    );

    if (attr.type === "boolean") return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {label}
            <Toggle checked={!!value} onChange={() => onChange(!value)} />
        </div>
    );

    if (attr.type === "select") return (
        <div>
            {label}
            <select value={value ?? ""} onChange={e => onChange(e.target.value)}
                style={{ ...inp(), appearance: "none" }}>
                <option value="">— Select —</option>
                {(attr.options || []).map(o => (
                    <option key={o.id} value={o.id}>{o.admin_name}</option>
                ))}
            </select>
        </div>
    );

    if (attr.type === "multiselect") return (
        <div>
            {label}
            <select multiple value={Array.isArray(value) ? value.map(String) : []}
                onChange={e => onChange(Array.from(e.target.selectedOptions).map(o => o.value))}
                style={{ ...inp(), height: "auto", minHeight: "80px", padding: "4px" }}>
                {(attr.options || []).map(o => (
                    <option key={o.id} value={String(o.id)}>{o.admin_name}</option>
                ))}
            </select>
        </div>
    );

    if (attr.type === "price") return (
        <div>
            {label}
            <input type="number" step="0.01" min="0" value={value ?? ""}
                onChange={e => onChange(e.target.value)} style={inp()} />
        </div>
    );

    if (attr.type === "date") return (
        <div>
            {label}
            <input type="date" value={value ?? ""} onChange={e => onChange(e.target.value)} style={inp()} />
        </div>
    );

    if (attr.type === "datetime") return (
        <div>
            {label}
            <input type="datetime-local" value={value ?? ""} onChange={e => onChange(e.target.value)} style={inp()} />
        </div>
    );

    if (attr.type === "image") return (
        <div>
            {label}
            <input type="file" accept="image/*" onChange={e => onChange(e.target.files[0])}
                style={{ ...inp(), height: "auto", padding: "8px" }} />
        </div>
    );

    /* default: text */
    return (
        <div>
            {label}
            <input type="text" value={value ?? ""} onChange={e => onChange(e.target.value)} style={inp()} />
        </div>
    );
}

/* ═══════════════════ MAIN COMPONENT ════════════════════════════ */
export default function ConfigurableEditProduct({
    product,
    categories,
    attributeFamilies,
    taxCategories,
    allProducts,
    familyGroups = [],
    existingValues = {},
    attributeFamily = null,
    typeSpecificData = {},
}) {
    /* ── parse stored images ─────────────────────────────────── */
    const parseImages = (img) => {
        if (typeof img === "string") { try { return JSON.parse(img); } catch { return []; } }
        return Array.isArray(img) ? img : [];
    };

    /* ── core product form state ─────────────────────────────── */
    const [formData, setFormData] = useState({
        name:               product.name               || "",
        sku:                product.sku                || "",
        product_number:     product.product_number     || "",
        url_key:            product.url_key            || "",
        tax_category_id:    product.tax_category_id    || "",
        short_description:  product.short_description  || "",
        description:        product.description        || "",
        price:              product.price              || "",
        special_price:      product.special_price      || "",
        special_price_from: product.special_price_from || "",
        special_price_to:   product.special_price_to   || "",
        cost_price:         product.cost_price         || "",
        stock:              product.stock              ?? 0,
        weight:             product.weight             || "",
        width:              product.width              || "",
        height:             product.height             || "",
        length:             product.length             || "",
        meta_title:         product.meta_title         || "",
        meta_keywords:      product.meta_keywords      || "",
        meta_description:   product.meta_description   || "",
        new:                !!product.new,
        featured:           !!product.featured,
        visible_individually: product.visible_individually !== undefined ? product.visible_individually : true,
        status:             product.status !== undefined ? product.status : true,
        guest_checkout:     product.guest_checkout !== undefined ? product.guest_checkout : true,
        allow_rma:          !!product.allow_rma,
        rma_rules:          product.rma_rules          || "",
        category_ids:       product.categories?.map(c => c.id)           || [],
        images:             parseImages(product.images),
        videos:             product.videos                                || [],
        related_product_ids:   product.relatedProducts?.map(p => p.id)   || [],
        up_sell_product_ids:   product.upSellProducts?.map(p => p.id)    || [],
        cross_sell_product_ids:product.crossSellProducts?.map(p => p.id) || [],
        group_product_ids:     product.groupProducts?.map(p => p.id)     || [],
        new_images: [],
        sub_category_id: product.sub_category_id || "",
    });



    /* ── dynamic attribute values state ─────────────────────── */
    /* attrValues: { [attribute_id]: value } */
    const [attrValues, setAttrValues] = useState(() => {
        const init = {};
        Object.entries(existingValues || {}).forEach(([k, v]) => { init[k] = v; });
        return init;
    });

    /* ── expanded groups ─────────────────────────────────────── */
    const [expandedGroups, setExpandedGroups] = useState(() =>
        Object.fromEntries((familyGroups || []).map(g => [g.id, true]))
    );

    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);
    const [showProductModal, setShowProductModal]  = useState(false);
    const [modalRelationType, setModalRelationType] = useState(null);
    const [searchQuery, setSearchQuery]     = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching]         = useState(false);
    const fileInputRef = useRef(null);

    /* ── configurable product state ─────────────────────────── */
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [selectedConfigAttrs, setSelectedConfigAttrs] = useState(
        typeSpecificData?.configurable_attributes || []
    );
    const [selectedOptions, setSelectedOptions] = useState({});
    const [showEditVariantModal, setShowEditVariantModal] = useState(false);
    const [editingVariant, setEditingVariant] = useState(null);
    
    // Bulk selection state
    const [selectedVariants, setSelectedVariants] = useState([]);
    const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);
    
    // Search and filter state
    const [variantSearchQuery, setVariantSearchQuery] = useState('');
    const [variantFilterStatus, setVariantFilterStatus] = useState('all');
    const [variantSortBy, setVariantSortBy] = useState('name');
    const [variantSortOrder, setVariantSortOrder] = useState('asc');

    // Ambil semua attribute select/multiselect dari attributeFamily
    const configurableAttributeOptions = (() => {
        if (!attributeFamily?.attributeGroups) return [];
        const seen = new Set();
        const result = [];
        attributeFamily.attributeGroups.forEach(group => {
            (group.attributes || []).forEach(attr => {
                // Only show select/multiselect attributes that are configurable (used for variants)
                if ((attr.type === 'select' || attr.type === 'multiselect') && attr.is_configurable && !seen.has(attr.id)) {
                    seen.add(attr.id);
                    result.push(attr);
                }
            });
        });
        return result;
    })();

    const handleGenerateVariants = async () => {
        if (selectedConfigAttrs.length === 0) return;
        const csrf = document.querySelector('meta[name=csrf-token]')?.content ?? '';
        const res = await fetch(`/admin/products/${product.id}/configure-attributes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf, 'Accept': 'application/json' },
            body: JSON.stringify({ configurable_attributes: selectedConfigAttrs }),
        });
        if (res.ok) {
            setShowConfigModal(false);
            window.location.reload();
        }
    };

    // Bulk selection handlers
    const handleSelectVariant = (variantId) => {
        setSelectedVariants(prev =>
            prev.includes(variantId)
                ? prev.filter(id => id !== variantId)
                : [...prev, variantId]
        );
    };

    const handleSelectAll = () => {
        if (selectedVariants.length === filteredVariants.length) {
            setSelectedVariants([]);
        } else {
            setSelectedVariants(filteredVariants.map(v => v.id));
        }
    };

    const handleSelectFilled = () => {
        // Select only variants that are EMPTY (no images AND stock = 0)
        // So we can bulk delete unused variants
        const emptyVariants = (typeSpecificData?.variants || [])
            .filter(v => (!v.images || v.images.length === 0) && (!v.stock || v.stock === 0))
            .map(v => v.id);
        setSelectedVariants(emptyVariants);
    };

    // Filter and sort variants
    const getFilteredAndSortedVariants = () => {
        let variants = [...(typeSpecificData?.variants || [])];
        
        // Filter by search query
        if (variantSearchQuery) {
            const query = variantSearchQuery.toLowerCase();
            variants = variants.filter(v => 
                v.name?.toLowerCase().includes(query) ||
                v.sku?.toLowerCase().includes(query)
            );
        }
        
        // Filter by status
        if (variantFilterStatus === 'active') {
            variants = variants.filter(v => v.is_active);
        } else if (variantFilterStatus === 'inactive') {
            variants = variants.filter(v => !v.is_active);
        } else if (variantFilterStatus === 'out_of_stock') {
            variants = variants.filter(v => !v.stock || v.stock === 0);
        }
        
        // Sort
        variants.sort((a, b) => {
            let valA, valB;
            if (variantSortBy === 'name') {
                valA = a.name?.toLowerCase() || '';
                valB = b.name?.toLowerCase() || '';
            } else if (variantSortBy === 'sku') {
                valA = a.sku?.toLowerCase() || '';
                valB = b.sku?.toLowerCase() || '';
            } else if (variantSortBy === 'price') {
                valA = parseFloat(a.price) || 0;
                valB = parseFloat(b.price) || 0;
            } else if (variantSortBy === 'stock') {
                valA = parseInt(a.stock) || 0;
                valB = parseInt(b.stock) || 0;
            } else if (variantSortBy === 'position') {
                valA = parseInt(a.position) || 0;
                valB = parseInt(b.position) || 0;
            }
            
            if (valA < valB) return variantSortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return variantSortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        
        return variants;
    };

    const filteredVariants = getFilteredAndSortedVariants();

    const handleBulkDelete = async () => {
        if (selectedVariants.length === 0) return;
        if (!confirm(`Delete ${selectedVariants.length} variant(s)?`)) return;

        setBulkDeleteLoading(true);
        const csrf = document.querySelector('meta[name=csrf-token]')?.content ?? '';

        try {
            // Delete variants one by one
            for (const variantId of selectedVariants) {
                await fetch(`/admin/product-variants/${variantId}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': csrf,
                        'Accept': 'application/json',
                    },
                });
            }
            // Reload page after all deletes
            window.location.reload();
        } catch (err) {
            alert('Error deleting variants: ' + err.message);
            setBulkDeleteLoading(false);
        }
    };

    /* ── helpers ─────────────────────────────────────────────── */
    const setField = (k, v) => setFormData(p => ({ ...p, [k]: v }));

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === "checkbox" ? checked : value;
        setFormData(p => ({ ...p, [name]: val }));
        if (name === "name" && value) {
            setFormData(p => ({
                ...p,
                name: value,
                url_key: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
            }));
        }
    };

    const setAttrValue = (attrId, value) =>
        setAttrValues(p => ({ ...p, [String(attrId)]: value }));

    /* ── image helpers ───────────────────────────────────────── */
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFormData(p => ({ ...p, new_images: [...(p.new_images || []), file] }));
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeImage = (type, index) => {
        if (type === "old")
            setFormData(p => ({ ...p, images: p.images.filter((_, i) => i !== index) }));
        else
            setFormData(p => ({ ...p, new_images: p.new_images.filter((_, i) => i !== index) }));
    };

    /* ── product relation search ─────────────────────────────── */
    const handleProductSearch = async (query) => {
        setSearchQuery(query);
        if (query.length < 2) { setSearchResults([]); return; }
        setSearching(true);
        try {
            const res  = await fetch(`/admin/products/search?q=${query}&exclude_id=${product.id}`);
            const data = await res.json();
            setSearchResults(data);
        } catch { /* silent */ } finally { setSearching(false); }
    };

    const addProductRelation = (productId) => {
        const field = `${modalRelationType}_product_ids`;
        setFormData(p => ({ ...p, [field]: [...p[field], productId] }));
        setSearchResults([]); setSearchQuery("");
    };

    const removeProductRelation = (productId, relType) => {
        const field = `${relType}_product_ids`;
        setFormData(p => ({ ...p, [field]: p[field].filter(id => id !== productId) }));
    };

    const getSelectedProducts = (relType) =>
        (allProducts || []).filter(p => formData[`${relType}_product_ids`].includes(p.id));

    /* ── submit ──────────────────────────────────────────────── */
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const BOOLEANS = ['new', 'featured', 'visible_individually', 'status', 'guest_checkout', 'allow_rma'];
        const SKIP = ['images', 'videos', 'category_ids', 'related_product_ids',
                      'up_sell_product_ids', 'cross_sell_product_ids', 'group_product_ids', 'new_images'];

        const fd = new FormData();
        fd.append('_method', 'PUT');

        Object.keys(formData).forEach(key => {
            if (SKIP.includes(key)) return;
            if (formData[key] === null || formData[key] === undefined) return;
            // Send booleans as '1'/'0' so Laravel boolean validation accepts them
            if (BOOLEANS.includes(key)) {
                fd.append(key, formData[key] ? '1' : '0');
            } else {
                fd.append(key, formData[key]);
            }
        });

        formData.images.forEach(v => fd.append('images[]', v));
        formData.videos.forEach(v => fd.append('videos[]', v));
        formData.category_ids.forEach(v => fd.append('category_ids[]', v));
        formData.related_product_ids.forEach(v => fd.append('related_product_ids[]', v));
        formData.up_sell_product_ids.forEach(v => fd.append('up_sell_product_ids[]', v));
        formData.cross_sell_product_ids.forEach(v => fd.append('cross_sell_product_ids[]', v));
        formData.group_product_ids.forEach(v => fd.append('group_product_ids[]', v));
        (formData.new_images || []).forEach(f => fd.append('new_images[]', f));

        Object.entries(attrValues).forEach(([attrId, val]) => {
            if (val === null || val === undefined || val === '') return;
            if (Array.isArray(val)) {
                val.forEach(v => fd.append(`attribute_values[${attrId}][]`, v));
            } else {
                fd.append(`attribute_values[${attrId}]`, val);
            }
        });

        router.post(`/admin/products/${product.id}`, fd, {
            forceFormData: true,
            onSuccess: () => router.visit('/admin/products'),
            onFinish: () => setLoading(false),
            onError:  (errs) => { setErrors(errs); setLoading(false); },
        });
    };

    /* ── shared input style ──────────────────────────────────── */
    const fld = (err = false) => ({
        width: "100%", padding: "9px 12px", backgroundColor: "#0C1524",
        border: `1px solid ${err ? "#EF4444" : "#1E293B"}`, borderRadius: "8px",
        color: "#F8FAFC", fontSize: "14px", outline: "none",
        height: "44px", boxSizing: "border-box",
    });

    const card = {
        backgroundColor: "#101827", border: "1px solid #1E293B",
        borderRadius: "12px", padding: "24px", marginBottom: "24px",
    };

    const cardTitle = { fontSize: "16px", fontWeight: "700", color: "#FFFFFF", marginBottom: "20px" };

    /* ── toggle helper ───────────────────────────────────────── */
    const ToggleSwitch = ({ name, checked }) => (
        <div onClick={() => setField(name, !checked)} style={{
            width: 44, height: 24, borderRadius: 12, cursor: "pointer",
            backgroundColor: checked ? "#3B82F6" : "#4B5563", position: "relative", transition: "background .2s",
        }}>
            <div style={{
                position: "absolute", top: 4, width: 16, height: 16,
                backgroundColor: "#fff", borderRadius: "50%", transition: "transform .2s",
                transform: checked ? "translateX(24px)" : "translateX(4px)",
            }} />
        </div>
    );

    /* ── product relation card helper ────────────────────────── */
    const RelationCard = ({ title, desc, relType }) => {
        const selected = getSelectedProducts(relType);
        return (
            <div style={{ ...card }}>
                <div className="flex items-center justify-between mb-4">
                    <h2 style={cardTitle}>{title}</h2>
                    <button type="button" onClick={() => { setShowProductModal(true); setModalRelationType(relType); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
                        style={{ backgroundColor: "#3B82F6" }}>
                        <Plus size={14} /> Add Product
                    </button>
                </div>
                <p style={{ fontSize: 13, color: "#64748B", marginBottom: 16 }}>{desc}</p>
                {selected.length === 0 ? (
                    <div className="flex flex-col items-center py-8">
                        <PlusCircle size={32} style={{ color: "#64748B", marginBottom: 8 }} />
                        <p style={{ fontSize: 13, color: "#64748B" }}>No products added.</p>
                    </div>
                ) : (
                    <div style={{ backgroundColor: "#0C1524", border: "1px solid #1E293B", borderRadius: 8 }}>
                        {selected.map(p => (
                            <div key={p.id} className="flex items-center justify-between px-4 py-3 border-b last:border-b-0" style={{ borderColor: "#1E293B" }}>
                                <div>
                                    <div style={{ fontSize: 13, color: "#F8FAFC", fontWeight: 500 }}>{p.name}</div>
                                    <div style={{ fontSize: 11, color: "#64748B" }}>SKU: {p.sku}</div>
                                </div>
                                <button type="button" onClick={() => removeProductRelation(p.id, relType)}
                                    className="p-2 rounded-lg hover:bg-red-500/10" style={{ color: "#EF4444" }}>
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    /* ═══════════════ RENDER ═════════════════════════════════ */
    return (
        <AdminLayout>
            <div style={{ backgroundColor: "#111827", minHeight: "100vh", padding: "28px" }}>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#F8FAFC" }}>Edit Product</h1>
                    <div className="flex items-center gap-3">
                        <a href="/admin/products" className="px-4 py-2 rounded-lg text-sm border"
                            style={{ borderColor: "#1E293B", color: "#94A3B8", backgroundColor: "transparent" }}>
                            Cancel
                        </a>
                        <button onClick={handleSubmit} disabled={loading}
                            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                            style={{ backgroundColor: "#3B82F6" }}>
                            {loading
                                ? <><div style={{ width: 14, height: 14, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .6s linear infinite" }} />Saving…</>
                                : <><Save size={14} />Save Changes</>}
                        </button>
                    </div>
                </div>

                {/* 2-col layout */}
                <div className="flex gap-6" style={{ alignItems: "flex-start" }}>

                    {/* ══ LEFT (main) ══ */}
                    <div style={{ flex: 1, minWidth: 0 }}>

                        {/* General */}
                        <div style={card}>
                            <h2 style={cardTitle}>General</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>SKU *</label>
                                    <input name="sku" value={formData.sku} onChange={handleChange} style={fld(!!errors.sku)} />
                                    {errors.sku && <p style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>{errors.sku}</p>}
                                </div>
                                <div>
                                    <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Product Number</label>
                                    <input name="product_number" value={formData.product_number} onChange={handleChange} style={fld()} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Name *</label>
                                    <input name="name" value={formData.name} onChange={handleChange} style={fld(!!errors.name)} />
                                    {errors.name && <p style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>{errors.name}</p>}
                                </div>
                                <div>
                                    <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>URL Key</label>
                                    <input name="url_key" value={formData.url_key} onChange={handleChange} style={fld(!!errors.url_key)} />
                                </div>
                                <div className="col-span-2">
                                    <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Tax Category</label>
                                    <select name="tax_category_id" value={formData.tax_category_id} onChange={handleChange}
                                        style={{ ...fld(), appearance: "none" }}>
                                        <option value="">Select Tax Category</option>
                                        {(taxCategories || []).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>



                        {/* Pricing & Inventory - Hide for Configurable Parent */}
                        {product.type !== 'configurable' && (
                            <div style={card}>
                                <h2 style={cardTitle}>Pricing & Inventory</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        ["Price *",         "price",         "number"],
                                        ["Stock *",         "stock",         "number"],
                                        ["Cost Price",      "cost_price",    "number"],
                                        ["Special Price",   "special_price", "number"],
                                    ].map(([lbl, name, type]) => (
                                        <div key={name}>
                                            <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>{lbl}</label>
                                            <input type={type} step={type === "number" ? "0.01" : undefined}
                                                name={name} value={formData[name]} onChange={handleChange}
                                                style={fld(!!errors[name])} />
                                            {errors[name] && <p style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>{errors[name]}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div style={card}>
                            <h2 style={cardTitle}>Description</h2>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Short Description</label>
                                <RichTextEditor value={formData.short_description}
                                    onChange={v => setField("short_description", v)} placeholder="Short description…" rows={5} />
                            </div>
                            <div>
                                <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Description</label>
                                <RichTextEditor value={formData.description}
                                    onChange={v => setField("description", v)} placeholder="Full description…" rows={8} />
                            </div>
                        </div>

                        {/* SEO */}
                        <div style={card}>
                            <h2 style={cardTitle}>Meta Description</h2>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Meta Title</label>
                                <input name="meta_title" value={formData.meta_title} onChange={handleChange} style={fld()} />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Meta Keywords</label>
                                <textarea name="meta_keywords" value={formData.meta_keywords} onChange={handleChange} rows={3}
                                    style={{ ...fld(), height: "auto", padding: "9px 12px", resize: "vertical" }} />
                            </div>
                            <div>
                                <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Meta Description</label>
                                <textarea name="meta_description" value={formData.meta_description} onChange={handleChange} rows={4}
                                    style={{ ...fld(), height: "auto", padding: "9px 12px", resize: "vertical" }} />
                            </div>
                        </div>

                        {/* Images */}
                        <div style={card}>
                            <h2 style={cardTitle}>Images</h2>
                            <p style={{ fontSize: 12, color: "#64748B", marginBottom: 16 }}>Recommended: 560px × 609px</p>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                            <div className="flex gap-4 flex-wrap">
                                <div className="flex flex-col items-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <div style={{ width: 80, height: 80, borderRadius: 8, border: "2px dashed #2C3A4D", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Upload size={20} style={{ color: "#64748B" }} />
                                    </div>
                                    <span style={{ fontSize: 11, color: "#94A3B8", marginTop: 6 }}>Add Image</span>
                                </div>
                                {formData.images.map((img, i) => (
                                    <div key={`old-${i}`} className="flex flex-col items-center relative group">
                                        <button type="button" onClick={() => removeImage("old", i)}
                                            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X size={10} style={{ color: "#fff" }} />
                                        </button>
                                        <div style={{ width: 80, height: 80, borderRadius: 8, overflow: "hidden", border: "1px solid #2C3A4D" }}>
                                            <img src={`/storage/${img}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        </div>
                                        <span style={{ fontSize: 11, color: "#94A3B8", marginTop: 6 }}>Image {i + 1}</span>
                                    </div>
                                ))}
                                {(formData.new_images || []).map((file, i) => (
                                    <div key={`new-${i}`} className="flex flex-col items-center relative group">
                                        <button type="button" onClick={() => removeImage("new", i)}
                                            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X size={10} style={{ color: "#fff" }} />
                                        </button>
                                        <div style={{ width: 80, height: 80, borderRadius: 8, overflow: "hidden", border: "1px solid #2C3A4D" }}>
                                            <img src={URL.createObjectURL(file)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        </div>
                                        <span style={{ fontSize: 11, color: "#94A3B8", marginTop: 6 }}>New {i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping - Hide for Configurable Parent */}
                        {product.type !== 'configurable' && (
                            <div style={card}>
                                <h2 style={cardTitle}>Shipping</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {[["Weight (kg)", "weight"], ["Width (cm)", "width"], ["Height (cm)", "height"], ["Length (cm)", "length"]].map(([lbl, name]) => (
                                        <div key={name}>
                                            <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>{lbl}</label>
                                            <input type="number" step="0.01" name={name} value={formData[name]} onChange={handleChange} style={fld()} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Variants - Only for Configurable Products */}
                        {product.type === 'configurable' && (
                            <div style={card}>
                                <h2 style={cardTitle}>Variants</h2>
                                
                                {/* Top Toolbar */}
                                <div style={{ marginBottom: '16px' }}>
                                    {/* Search and Filters Row */}
                                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                        {/* Search */}
                                        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                                            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                                            <input
                                                type="text"
                                                placeholder="Search variants..."
                                                value={variantSearchQuery}
                                                onChange={(e) => setVariantSearchQuery(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 12px 8px 36px',
                                                    backgroundColor: '#0C1524',
                                                    border: '1px solid #1E293B',
                                                    borderRadius: '6px',
                                                    color: '#F8FAFC',
                                                    fontSize: '13px',
                                                    outline: 'none',
                                                }}
                                            />
                                        </div>
                                        
                                        {/* Filter by Status */}
                                        <select
                                            value={variantFilterStatus}
                                            onChange={(e) => setVariantFilterStatus(e.target.value)}
                                            style={{
                                                padding: '8px 12px',
                                                backgroundColor: '#0C1524',
                                                border: '1px solid #1E293B',
                                                borderRadius: '6px',
                                                color: '#F8FAFC',
                                                fontSize: '13px',
                                                outline: 'none',
                                                minWidth: '120px',
                                            }}
                                        >
                                            <option value="all">All Status</option>
                                            <option value="active">Published</option>
                                            <option value="inactive">Unpublished</option>
                                            <option value="out_of_stock">Out of Stock</option>
                                        </select>
                                        
                                        {/* Sort */}
                                        <select
                                            value={variantSortBy}
                                            onChange={(e) => setVariantSortBy(e.target.value)}
                                            style={{
                                                padding: '8px 12px',
                                                backgroundColor: '#0C1524',
                                                border: '1px solid #1E293B',
                                                borderRadius: '6px',
                                                color: '#F8FAFC',
                                                fontSize: '13px',
                                                outline: 'none',
                                                minWidth: '120px',
                                            }}
                                        >
                                            <option value="name">Sort by Name</option>
                                            <option value="sku">Sort by SKU</option>
                                            <option value="price">Sort by Price</option>
                                            <option value="stock">Sort by Stock</option>
                                            <option value="position">Sort by Position</option>
                                        </select>
                                        
                                        <button
                                            type="button"
                                            onClick={() => setVariantSortOrder(variantSortOrder === 'asc' ? 'desc' : 'asc')}
                                            style={{
                                                padding: '8px 12px',
                                                backgroundColor: '#0C1524',
                                                border: '1px solid #1E293B',
                                                borderRadius: '6px',
                                                color: '#94A3B8',
                                                fontSize: '13px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {variantSortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
                                        </button>
                                    </div>
                                    
                                    {/* Bulk Actions Row */}
                                    {filteredVariants.length > 0 && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '10px 12px',
                                            backgroundColor: '#0C1524',
                                            border: '1px solid #1E293B',
                                            borderRadius: '6px',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <button
                                                    type="button"
                                                    onClick={handleSelectAll}
                                                    style={{
                                                        padding: '6px 12px',
                                                        fontSize: '12px',
                                                        backgroundColor: selectedVariants.length === filteredVariants.length ? '#3B82F6' : '#1E293B',
                                                        color: selectedVariants.length === filteredVariants.length ? '#fff' : '#94A3B8',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {selectedVariants.length === filteredVariants.length ? 'Deselect All' : 'Select All'}
                                                </button>
                                                
                                                <button
                                                    type="button"
                                                    onClick={handleSelectFilled}
                                                    style={{
                                                        padding: '6px 12px',
                                                        fontSize: '12px',
                                                        backgroundColor: '#1E293B',
                                                        color: '#94A3B8',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    Select Empty
                                                </button>

                                                {selectedVariants.length > 0 && (
                                                    <span style={{ fontSize: '12px', color: '#64748B' }}>
                                                        {selectedVariants.length} selected
                                                    </span>
                                                )}
                                            </div>

                                            {selectedVariants.length > 0 && (
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        type="button"
                                                        onClick={handleBulkDelete}
                                                        disabled={bulkDeleteLoading}
                                                        style={{
                                                            padding: '6px 12px',
                                                            fontSize: '12px',
                                                            backgroundColor: '#EF4444',
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: bulkDeleteLoading ? 'not-allowed' : 'pointer',
                                                            fontWeight: 500,
                                                            opacity: bulkDeleteLoading ? 0.5 : 1,
                                                        }}
                                                    >
                                                        {bulkDeleteLoading ? 'Deleting...' : `Delete (${selectedVariants.length})`}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Variant Count */}
                                <div style={{ marginBottom: '12px', fontSize: '12px', color: '#64748B' }}>
                                    Showing {filteredVariants.length} of {typeSpecificData?.variants?.length || 0} variants
                                </div>

                                {/* Compact List Layout */}
                                {filteredVariants.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {filteredVariants.map((variant) => {
                                            // Parse variant name to extract attributes
                                            const variantName = variant.name || '';
                                            const parts = variantName.split(' - ');
                                            const mainAttr = parts[1] || variantName;
                                            const attributes = mainAttr.split(' / ').map(a => a.trim());

                                            return (
                                                <div
                                                    key={variant.id}
                                                    style={{
                                                        backgroundColor: '#0C1524',
                                                        border: selectedVariants.includes(variant.id) ? '2px solid #3B82F6' : '1px solid #1E293B',
                                                        borderRadius: '8px',
                                                        padding: '12px',
                                                        display: 'grid',
                                                        gridTemplateColumns: '40px 60px 1fr 120px 140px 80px 100px 140px',
                                                        gap: '12px',
                                                        alignItems: 'center',
                                                        transition: 'all 0.2s',
                                                        cursor: 'pointer',
                                                        boxShadow: selectedVariants.includes(variant.id) ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!selectedVariants.includes(variant.id)) {
                                                            e.currentTarget.style.borderColor = '#3B82F6';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (!selectedVariants.includes(variant.id)) {
                                                            e.currentTarget.style.borderColor = '#1E293B';
                                                        }
                                                    }}
                                                >
                                                    {/* Checkbox */}
                                                    <div>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedVariants.includes(variant.id)}
                                                            onChange={() => handleSelectVariant(variant.id)}
                                                            style={{
                                                                width: '16px',
                                                                height: '16px',
                                                                cursor: 'pointer',
                                                                accentColor: '#3B82F6',
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Thumbnail */}
                                                    <div>
                                                        {variant.images && variant.images.length > 0 ? (
                                                            <img
                                                                src={`/storage/${variant.images[0]}`}
                                                                alt={variant.name}
                                                                style={{
                                                                    width: '48px',
                                                                    height: '48px',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '6px',
                                                                    backgroundColor: '#1E293B',
                                                                }}
                                                            />
                                                        ) : (
                                                            <div
                                                                style={{
                                                                    width: '48px',
                                                                    height: '48px',
                                                                    borderRadius: '6px',
                                                                    backgroundColor: '#1E293B',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    color: '#64748B',
                                                                    fontSize: '10px',
                                                                }}
                                                            >
                                                                No Img
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Variant Name */}
                                                    <div>
                                                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#F8FAFC', marginBottom: '2px' }}>
                                                            {attributes.join(' • ')}
                                                        </div>
                                                        {variant.is_default && (
                                                            <span style={{ fontSize: '10px', backgroundColor: '#3B82F6', color: '#fff', padding: '2px 6px', borderRadius: 3 }}>
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* SKU */}
                                                    <div>
                                                        <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>
                                                            {variant.sku}
                                                        </div>
                                                    </div>

                                                    {/* Attributes */}
                                                    <div>
                                                        <div style={{ fontSize: '11px', color: '#64748B', lineHeight: '1.4' }}>
                                                            {attributes.map((attr, idx) => (
                                                                <div key={idx}>{attr}</div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Price */}
                                                    <div>
                                                        <div style={{ fontSize: '13px', color: '#F8FAFC', fontWeight: 600 }}>
                                                            ${parseFloat(variant.price).toFixed(2)}
                                                        </div>
                                                    </div>

                                                    {/* Stock */}
                                                    <div>
                                                        <div style={{ 
                                                            fontSize: '12px', 
                                                            color: variant.stock > 0 ? '#10B981' : '#EF4444', 
                                                            fontWeight: 600 
                                                        }}>
                                                            {variant.stock || 0} pcs
                                                        </div>
                                                    </div>

                                                    {/* Status & Actions */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        {/* Status Badge */}
                                                        <span style={{
                                                            fontSize: '10px',
                                                            backgroundColor: variant.is_active ? '#10B981' : '#64748B',
                                                            color: '#fff',
                                                            padding: '2px 8px',
                                                            borderRadius: 4,
                                                            fontWeight: 500,
                                                        }}>
                                                            {variant.is_active ? 'Published' : 'Unpublished'}
                                                        </span>
                                                        
                                                        {/* Actions */}
                                                        <div style={{ display: 'flex', gap: '4px' }}>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setEditingVariant(variant);
                                                                    setShowEditVariantModal(true);
                                                                }}
                                                                style={{
                                                                    padding: '4px 8px',
                                                                    backgroundColor: '#3B82F6',
                                                                    color: '#fff',
                                                                    border: 'none',
                                                                    borderRadius: '4px',
                                                                    fontSize: '11px',
                                                                    fontWeight: 500,
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (confirm('Are you sure you want to delete this variant?')) {
                                                                        fetch(`/admin/product-variants/${variant.id}`, {
                                                                            method: 'DELETE',
                                                                            headers: {
                                                                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                                                                                'Accept': 'application/json',
                                                                            },
                                                                        }).then(() => {
                                                                            window.location.reload();
                                                                        });
                                                                    }
                                                                }}
                                                                style={{
                                                                    padding: '4px 8px',
                                                                    backgroundColor: '#EF4444',
                                                                    color: '#fff',
                                                                    border: 'none',
                                                                    borderRadius: '4px',
                                                                    fontSize: '11px',
                                                                    fontWeight: 500,
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '32px 0', color: '#64748B' }}>
                                        <p style={{ fontSize: '14px', marginBottom: '8px' }}>
                                            {typeSpecificData?.variants?.length === 0 
                                                ? 'No variants created yet.' 
                                                : 'No variants match your filters.'}
                                        </p>
                                        <p style={{ fontSize: '12px' }}>
                                            {typeSpecificData?.variants?.length === 0 
                                                ? 'Click "Configure Attributes" above to create variants.' 
                                                : 'Try adjusting your search or filters.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Product Relations */}
                        <RelationCard title="Group Products" relType="group"
                            desc="Products presented as a set. Each can be bought individually or as a group." />
                        <RelationCard title="Related Products" relType="related"
                            desc="Products shown alongside the one the customer is viewing." />
                        <RelationCard title="Up-Sell Products" relType="up_sell"
                            desc="Premium alternatives shown to encourage an upgrade." />
                        <RelationCard title="Cross-Sell Products" relType="cross_sell"
                            desc="Impulse-buy products shown near the shopping cart." />

                    </div>

                    {/* ══ RIGHT sidebar ══ */}
                    <div style={{ width: 280, flexShrink: 0, position: "sticky", top: 28, height: "fit-content" }}>

                        {/* Settings */}
                        <div style={card}>
                            <h2 style={cardTitle}>Settings</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                {[
                                    ["new",                  "New"],
                                    ["featured",             "Featured"],
                                    ["visible_individually", "Visible Individually"],
                                    ["status",               "Status"],
                                    ["guest_checkout",       "Guest Checkout"],
                                ].map(([name, label]) => (
                                    <div key={name} className="flex items-center justify-between">
                                        <span style={{ fontSize: 13, color: "#F8FAFC" }}>{label}</span>
                                        <ToggleSwitch name={name} checked={!!formData[name]} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RMA */}
                        <div style={card}>
                            <h2 style={cardTitle}>RMA</h2>
                            <div className="flex items-center justify-between mb-4">
                                <span style={{ fontSize: 13, color: "#F8FAFC" }}>Allow RMA</span>
                                <ToggleSwitch name="allow_rma" checked={!!formData.allow_rma} />
                            </div>
                            <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>RMA Rules</label>
                            <textarea name="rma_rules" value={formData.rma_rules} onChange={handleChange} rows={4}
                                style={{ ...fld(), height: "auto", padding: "9px 12px", resize: "vertical" }} />
                        </div>

                        {/* Categories */}
                        <div style={card}>
                            <h2 style={cardTitle}>Categories</h2>
                            <CategoryMultiSelectTree 
                                categories={categories} 
                                selectedIds={formData.category_ids} 
                                onSelectionChange={(ids) => setFormData(p => ({ ...p, category_ids: ids }))} 
                            />
                        </div>

                    </div>
                </div>

                {/* Configure Attributes Modal */}
                {showConfigModal && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 50, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ backgroundColor: '#101827', border: '1px solid #1E293B', borderRadius: 12, width: '100%', maxWidth: 600, maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                            {/* Header */}
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC' }}>Configure Attributes</h3>
                                    <p style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Pilih attribute untuk membuat kombinasi variant</p>
                                </div>
                                <button type="button" onClick={() => setShowConfigModal(false)} style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Body */}
                            <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
                                {configurableAttributeOptions.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '32px 0', color: '#64748B' }}>
                                        <p style={{ fontSize: 14, marginBottom: 8 }}>Tidak ada attribute yang tersedia.</p>
                                        <p style={{ fontSize: 12 }}>Pastikan Attribute Family memiliki attribute bertipe <strong>select</strong> atau <strong>multiselect</strong>.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {configurableAttributeOptions.map(attr => (
                                            <label key={attr.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', border: `1px solid ${selectedConfigAttrs.includes(attr.id) ? '#3B82F6' : '#1E293B'}`, borderRadius: 8, cursor: 'pointer', backgroundColor: selectedConfigAttrs.includes(attr.id) ? '#0F1E35' : 'transparent' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedConfigAttrs.includes(attr.id)}
                                                    onChange={() => setSelectedConfigAttrs(prev =>
                                                        prev.includes(attr.id) ? prev.filter(id => id !== attr.id) : [...prev, attr.id]
                                                    )}
                                                    style={{ marginTop: 2, accentColor: '#3B82F6', width: 16, height: 16, flexShrink: 0 }}
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontSize: 14, fontWeight: 600, color: '#F8FAFC', marginBottom: 4 }}>{attr.admin_name}</p>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                        {(attr.options || []).map(opt => (
                                                            <span key={opt.id} style={{ fontSize: 11, backgroundColor: '#1E293B', color: '#94A3B8', padding: '2px 8px', borderRadius: 4 }}>
                                                                {opt.admin_name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div style={{ padding: '16px 24px', borderTop: '1px solid #1E293B', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                                <button type="button" onClick={() => setShowConfigModal(false)}
                                    style={{ padding: '8px 16px', border: '1px solid #1E293B', borderRadius: 8, color: '#94A3B8', backgroundColor: 'transparent', cursor: 'pointer', fontSize: 13 }}>
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleGenerateVariants}
                                    disabled={selectedConfigAttrs.length === 0}
                                    className="flex items-center gap-2"
                                    style={{ padding: '8px 16px', backgroundColor: selectedConfigAttrs.length === 0 ? '#374151' : '#3B82F6', color: '#fff', border: 'none', borderRadius: 8, cursor: selectedConfigAttrs.length === 0 ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 }}>
                                    <Save size={14} /> Save & Generate Variants
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Product Search Modal */}
                {showProductModal && (
                    <div style={{ position: "fixed", inset: 0, zIndex: 50, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ backgroundColor: "#101827", border: "1px solid #1E293B", borderRadius: 12, padding: 24, width: "100%", maxWidth: 560 }}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>
                                    Add {modalRelationType === "group" ? "Group" : modalRelationType === "related" ? "Related" : modalRelationType === "up_sell" ? "Up-Sell" : "Cross-Sell"} Product
                                </h3>
                                <button type="button" onClick={() => { setShowProductModal(false); setSearchQuery(""); setSearchResults([]); }}
                                    className="p-2 rounded-lg hover:bg-white/10" style={{ color: "#94A3B8" }}>
                                    <X size={16} />
                                </button>
                            </div>
                            <div style={{ position: "relative", marginBottom: 12 }}>
                                <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                                <input autoFocus value={searchQuery}
                                    onChange={e => handleProductSearch(e.target.value)}
                                    placeholder="Search products…"
                                    style={{ width: "100%", padding: "9px 12px 9px 36px", backgroundColor: "#1A2235", border: "1px solid #2C3A4D", borderRadius: 8, color: "#F8FAFC", fontSize: 13, outline: "none" }} />
                            </div>
                            {searching && <div style={{ textAlign: "center", padding: "16px 0" }}><div style={{ width: 20, height: 20, border: "2px solid #3B82F6", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .6s linear infinite", margin: "0 auto" }} /></div>}
                            {searchResults.length > 0 && (
                                <div style={{ backgroundColor: "#0C1524", border: "1px solid #1E293B", borderRadius: 8, maxHeight: 320, overflowY: "auto" }}>
                                    {searchResults.map(p => (
                                        <div key={p.id} onClick={() => addProductRelation(p.id)}
                                            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/5 border-b last:border-b-0"
                                            style={{ borderColor: "#1E293B" }}>
                                            <div>
                                                <div style={{ fontSize: 13, color: "#F8FAFC", fontWeight: 500 }}>{p.name}</div>
                                                <div style={{ fontSize: 11, color: "#64748B" }}>SKU: {p.sku}</div>
                                            </div>
                                            <Plus size={14} style={{ color: "#3B82F6" }} />
                                        </div>
                                    ))}
                                </div>
                            )}
                            {!searching && searchQuery.length >= 2 && searchResults.length === 0 && (
                                <p style={{ textAlign: "center", fontSize: 13, color: "#64748B", padding: "16px 0" }}>No products found.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Edit Variant Modal */}
                {showEditVariantModal && editingVariant && (
                    <EditVariantModal
                        variant={editingVariant}
                        onClose={() => {
                            setShowEditVariantModal(false);
                            setEditingVariant(null);
                        }}
                        onSaved={(updatedVariant) => {
                            setShowEditVariantModal(false);
                            setEditingVariant(null);
                            // Full page reload to ensure all data is updated
                            window.location.reload();
                        }}
                    />
                )}

            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </AdminLayout>
    );
}

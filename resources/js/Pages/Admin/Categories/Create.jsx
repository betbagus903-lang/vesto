import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import CategoryTree from '../../../Components/Admin/CategoryTree';
import { Save, Upload, X } from 'lucide-react';
import RichTextEditor from '../../../Components/Admin/RichTextEditor';

const S = {
  card: { backgroundColor: '#101827', border: '1px solid #1E293B', borderRadius: '12px', marginBottom: '16px' },
  cardHeader: { padding: '16px 24px', borderBottom: '1px solid #1E293B', fontSize: '15px', fontWeight: '700', color: '#FFFFFF' },
  cardBody: { padding: '24px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#94A3B8', marginBottom: '6px' },
  input: (err = false) => ({
    width: '100%', padding: '9px 12px', backgroundColor: '#0C1524',
    border: `1px solid ${err ? '#EF4444' : '#1E293B'}`, borderRadius: '8px',
    color: '#F8FAFC', fontSize: '14px', outline: 'none', boxSizing: 'border-box', height: '44px',
  }),
  textarea: (err = false) => ({
    width: '100%', padding: '9px 12px', backgroundColor: '#0C1524',
    border: `1px solid ${err ? '#EF4444' : '#1E293B'}`, borderRadius: '8px',
    color: '#F8FAFC', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical',
  }),
  select: (err = false) => ({
    width: '100%', padding: '9px 12px', backgroundColor: '#0C1524',
    border: `1px solid ${err ? '#EF4444' : '#1E293B'}`, borderRadius: '8px',
    color: '#F8FAFC', fontSize: '14px', outline: 'none', appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '32px',
    boxSizing: 'border-box', height: '44px',
  }),
  err: { fontSize: '12px', color: '#EF4444', marginTop: '4px' },
  hint: { fontSize: '12px', color: '#475569', marginTop: '4px' },
  divider: { borderTop: '1px solid #1E293B', margin: '4px -24px 20px' },
  sectionDivider: { borderTop: '1px solid #1E293B', margin: '0 -24px 20px', paddingTop: '20px', paddingLeft: '24px', paddingRight: '24px' },
  btnBlue: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '9px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
    backgroundColor: '#3B82F6', color: '#fff', border: 'none', cursor: 'pointer',
  },
  btnGhost: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '9px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '500',
    backgroundColor: 'transparent', color: '#94A3B8', border: '1px solid #1E293B',
    cursor: 'pointer', textDecoration: 'none',
  },
};

function Field({ label, required, error, hint, children, noMargin }) {
  return (
    <div style={{ marginBottom: noMargin ? 0 : '16px' }}>
      <label style={S.label}>{label}{required && <span style={{ color: '#EF4444' }}> *</span>}</label>
      {children}
      {hint && <p style={S.hint}>{hint}</p>}
      {error && <p style={S.err}>{error}</p>}
    </div>
  );
}

function ImageUpload({ label, hint, preview, onFile, onRemove }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={S.label}>{label}</label>
      {hint && <p style={{ ...S.hint, marginBottom: '8px', marginTop: 0 }}>{hint}</p>}
      {preview ? (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img src={preview} alt={label} style={{ height: '80px', borderRadius: '8px', border: '1px solid #1E293B' }} />
          <button type="button" onClick={onRemove}
            style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#EF4444', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={12} color="#fff" />
          </button>
        </div>
      ) : (
        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '20px 14px', border: '1px dashed #1E293B', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '13px' }}>
          <Upload size={16} />
          <span style={{ color: '#94A3B8' }}>Add Image</span>
          <span style={{ fontSize: '11px' }}>png, jpeg, jpg</span>
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files[0] && onFile(e.target.files[0])} />
        </label>
      )}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <div onClick={onChange} style={{
      width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer',
      backgroundColor: checked ? '#3B82F6' : '#1E293B', position: 'relative', transition: 'background .2s', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: '4px', width: '16px', height: '16px',
        backgroundColor: '#fff', borderRadius: '50%', transition: 'transform .2s',
        transform: checked ? 'translateX(24px)' : 'translateX(4px)',
      }} />
    </div>
  );
}

export default function CreateCategory({ allCategories = [], allAttributes = [] }) {
  const defaultParentId = allCategories.length > 0 ? allCategories[0].id : null;

  const { data, setData, post, processing, errors } = useForm({
    name: '', slug: '', description: '', parent_id: defaultParentId,
    position: 0, display_mode: 'products_and_description', visible_in_menu: true,
    logo_path: null, banner_path: null,
    meta_title: '', meta_keywords: '', meta_description: '',
    filterable_attributes: [],
  });

  const [logoPrev, setLogoPrev] = useState(null);
  const [bannerPrev, setBannerPrev] = useState(null);

  const handleName = (v) => {
    setData(d => ({ ...d, name: v, slug: v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') }));
  };

  const toggleAttr = (id) => {
    setData('filterable_attributes', data.filterable_attributes.includes(id)
      ? data.filterable_attributes.filter(a => a !== id)
      : [...data.filterable_attributes, id]);
  };

  const submit = (e) => {
    e.preventDefault();
    post('/admin/categories', { forceFormData: true });
  };

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <nav style={{ fontSize: '12px', color: '#475569', marginBottom: '4px', display: 'flex', gap: '6px', alignItems: 'center' }}>
              <a href="/admin/dashboard" style={{ color: '#475569', textDecoration: 'none' }}>Dashboard</a>
              <span>/</span>
              <a href="/admin/categories" style={{ color: '#475569', textDecoration: 'none' }}>Categories</a>
              <span>/</span>
              <span style={{ color: '#94A3B8' }}>Create</span>
            </nav>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>Create Category</h1>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <a href="/admin/categories" style={S.btnGhost}>Back</a>
            <button onClick={submit} disabled={processing} style={{ ...S.btnBlue, opacity: processing ? 0.6 : 1 }}>
              <Save size={14} />{processing ? 'Saving…' : 'Save Category'}
            </button>
          </div>
        </div>

        <form onSubmit={submit}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>

            {/* LEFT 75% */}
            <div style={{ flex: '0 0 calc(74% - 8px)' }}>

              {/* General Information */}
              <div style={S.card}>
                <div style={S.cardHeader}>General Information</div>
                <div style={S.cardBody}>

                  <Field label="Name" required error={errors.name}>
                    <input style={S.input(!!errors.name)} value={data.name} onChange={e => handleName(e.target.value)} placeholder="Category name" />
                  </Field>

                  <div style={S.divider} />

                  <div style={{ marginBottom: '20px' }}>
                    <label style={S.label}>Parent Category</label>
                    <CategoryTree
                      categories={allCategories}
                      selectedId={data.parent_id}
                      onSelect={id => setData('parent_id', id)}
                    />
                    {errors.parent_id && <p style={S.err}>{errors.parent_id}</p>}
                  </div>

                  <div style={S.divider} />

                  <Field label="Description" error={errors.description} noMargin>
                    <RichTextEditor
                      value={data.description}
                      onChange={v => setData('description', v)}
                      placeholder="Category description..."
                      rows={6}
                    />
                  </Field>

                </div>
              </div>

              {/* Description and Images */}
              <div style={S.card}>
                <div style={S.cardHeader}>Description and Images</div>
                <div style={S.cardBody}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <ImageUpload
                      label="Logo"
                      hint="Logo resolution should be (110px × 110px)"
                      preview={logoPrev}
                      onFile={f => { setData('logo_path', f); setLogoPrev(URL.createObjectURL(f)); }}
                      onRemove={() => { setData('logo_path', null); setLogoPrev(null); }}
                    />
                    <ImageUpload
                      label="Banner"
                      hint="Banner aspect ratio (1320px × 300px)"
                      preview={bannerPrev}
                      onFile={f => { setData('banner_path', f); setBannerPrev(URL.createObjectURL(f)); }}
                      onRemove={() => { setData('banner_path', null); setBannerPrev(null); }}
                    />
                  </div>
                </div>
              </div>

              {/* SEO Details */}
              <div style={S.card}>
                <div style={S.cardHeader}>SEO Details</div>
                <div style={S.cardBody}>
                  <Field label="Meta Title" error={errors.meta_title}>
                    <input style={S.input(!!errors.meta_title)} value={data.meta_title} onChange={e => setData('meta_title', e.target.value)} placeholder="Meta Title" />
                  </Field>
                  <Field label="Slug" required error={errors.slug} hint="Auto-generated from name. Lowercase letters, numbers & hyphens only.">
                    <input style={S.input(!!errors.slug)} value={data.slug} onChange={e => setData('slug', e.target.value)} placeholder="category-slug" />
                  </Field>
                  <Field label="Meta Keywords" error={errors.meta_keywords}>
                    <input style={S.input(!!errors.meta_keywords)} value={data.meta_keywords} onChange={e => setData('meta_keywords', e.target.value)} placeholder="Meta Keywords" />
                  </Field>
                  <Field label="Meta Description" error={errors.meta_description} noMargin>
                    <textarea style={{ ...S.textarea(), height: '80px' }} value={data.meta_description} onChange={e => setData('meta_description', e.target.value)} placeholder="Meta Description" />
                  </Field>
                </div>
              </div>

            </div>

            {/* RIGHT 25% */}
            <div style={{ flex: '0 0 calc(26% - 8px)' }}>
              <div style={S.card}>
                <div style={S.cardHeader}>Settings</div>
                <div style={S.cardBody}>

                  <Field label="Position" error={errors.position}>
                    <input type="number" min={0} style={S.input(!!errors.position)} value={data.position} onChange={e => setData('position', +e.target.value)} placeholder="Enter Position" />
                  </Field>

                  <div style={{ borderTop: '1px solid #1E293B', margin: '0 -24px 20px', paddingTop: '20px', paddingLeft: '24px', paddingRight: '24px' }}>
                    <Field label="Display Mode" error={errors.display_mode} noMargin>
                      <select style={S.select(!!errors.display_mode)} value={data.display_mode} onChange={e => setData('display_mode', e.target.value)}>
                        <option value="products_and_description">Products and Description</option>
                        <option value="products_only">Products Only</option>
                        <option value="description_only">Description Only</option>
                      </select>
                    </Field>
                  </div>

                  <div style={{ borderTop: '1px solid #1E293B', margin: '0 -24px', paddingTop: '20px', paddingLeft: '24px', paddingRight: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '13px', color: '#94A3B8' }}>Visible in Menu</label>
                    <Toggle checked={data.visible_in_menu} onChange={() => setData('visible_in_menu', !data.visible_in_menu)} />
                  </div>

                </div>
              </div>

              {/* Filterable Attributes */}
              <div style={S.card}>
                <div style={S.cardHeader}>Filterable Attributes</div>
                <div style={S.cardBody}>
                  {allAttributes.length === 0 ? (
                    <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>No filterable attributes available.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {allAttributes.map(attr => (
                        <label key={attr.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={data.filterable_attributes.includes(attr.id)}
                            onChange={() => toggleAttr(attr.id)}
                            style={{ width: '15px', height: '15px', accentColor: '#3B82F6', cursor: 'pointer', flexShrink: 0 }}
                          />
                          <span style={{ fontSize: '13px', color: '#F8FAFC' }}>{attr.admin_name}</span>
                          <span style={{ fontSize: '11px', color: '#475569' }}>({attr.type})</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

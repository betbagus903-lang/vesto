import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import InfoTooltip from '../../../Components/Admin/InfoTooltip';
import { Save, Plus, Trash2, GripVertical } from 'lucide-react';

const ATTRIBUTE_TYPES = [
  { value: 'text',        label: 'Text' },
  { value: 'textarea',    label: 'Textarea' },
  { value: 'boolean',     label: 'Boolean' },
  { value: 'select',      label: 'Select' },
  { value: 'multiselect', label: 'Multiselect' },
  { value: 'price',       label: 'Price' },
  { value: 'date',        label: 'Date' },
  { value: 'datetime',    label: 'Datetime' },
  { value: 'image',       label: 'Image' },
];

/* ─────────────────── shared styles ─────────────────── */
const S = {
  page:  { backgroundColor: '#0F172A', minHeight: '100vh', padding: '24px 28px' },
  card:  { backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', marginBottom: '12px' },
  cardHeader: {
    padding: '14px 20px',
    borderBottom: '1px solid #334155',
    fontSize: '14px',
    fontWeight: '600',
    color: '#F1F5F9',
    letterSpacing: '0.01em',
  },
  cardBody: { padding: '20px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#94A3B8', marginBottom: '6px' },
  input: (err = false) => ({
    width: '100%',
    padding: '9px 12px',
    backgroundColor: '#0F172A',
    border: `1px solid ${err ? '#EF4444' : '#334155'}`,
    borderRadius: '6px',
    color: '#F1F5F9',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.15s',
  }),
  select: (err = false) => ({
    width: '100%',
    padding: '9px 12px',
    backgroundColor: '#0F172A',
    border: `1px solid ${err ? '#EF4444' : '#334155'}`,
    borderRadius: '6px',
    color: '#F1F5F9',
    fontSize: '14px',
    outline: 'none',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: '32px',
  }),
  hint: { fontSize: '12px', color: '#64748B', marginTop: '4px' },
  err:  { fontSize: '12px', color: '#EF4444', marginTop: '4px' },
  divider: { border: 'none', borderTop: '1px solid #334155', margin: '0' },
  checkRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '13px 20px',
  },
  checkLabel: { fontSize: '13px', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' },
  btnBlue: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '500',
    backgroundColor: '#3B82F6', color: '#fff', border: 'none', cursor: 'pointer',
  },
  btnGhost: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '500',
    backgroundColor: 'transparent', color: '#94A3B8',
    border: '1px solid #334155', cursor: 'pointer',
  },
};

/* ─────────────────── Tooltip data ──────────────────── */
const TOOLTIP_DATA = {
  is_required: {
    title: 'Required Attribute',
    content: `Jika diaktifkan, attribute ini wajib diisi saat membuat atau mengedit produk.\n\nProduk tidak dapat disimpan apabila attribute ini kosong.\n\nContoh:\n• Color\n• Brand\n• Size`,
  },
  is_unique: {
    title: 'Unique Value',
    content: `Setiap produk harus memiliki nilai yang berbeda untuk attribute ini.\n\nGunakan hanya untuk data yang memang tidak boleh sama.\n\nContoh:\n• SKU\n• Barcode\n• Serial Number\n\nJangan aktifkan untuk Color atau Size karena nilainya bisa digunakan oleh banyak produk.`,
  },
  value_per_locale: {
    title: 'Value Per Locale',
    content: `Memungkinkan attribute memiliki nilai berbeda untuk setiap bahasa (locale).\n\nContoh:\n\nIndonesia:\n• Nama: Sepatu Lari\n\nEnglish:\n• Name: Running Shoes\n\nTips:\nAktifkan jika toko menggunakan lebih dari satu bahasa.`,
  },
  value_per_channel: {
    title: 'Value Per Channel',
    content: `Memungkinkan attribute memiliki nilai berbeda pada setiap sales channel.\n\nContoh:\n\nWebsite:\n• Harga: Rp 120.000\n\nMobile App:\n• Harga: Rp 115.000\n\nMarketplace:\n• Harga: Rp 125.000\n\nTips:\nGunakan jika setiap channel memiliki data yang berbeda.`,
  },
  is_configurable: {
    title: 'Configurable Product',
    content: `Attribute ini akan digunakan untuk membuat variasi produk.\n\nContoh:\n\nT-Shirt memiliki variasi:\n• Color: Black, White, Navy\n• Size: S, M, L, XL\n\nKombinasi tersebut menghasilkan:\n✔ Black - S\n✔ Black - M\n✔ White - S\n✔ White - M\n\nTips:\nAktifkan hanya untuk attribute seperti Color atau Size.`,
  },
  is_visible_on_front: {
    title: 'Visible On Product Page',
    content: `Jika diaktifkan, attribute akan ditampilkan pada halaman detail produk yang dilihat customer.\n\nContoh tampilan di halaman produk:\n• Brand: Nike\n• Color: Black\n• Material: Cotton\n• Weight: 0.5 kg\n\nTips:\nNonaktifkan jika attribute hanya digunakan untuk kebutuhan internal admin.`,
  },
  is_comparable: {
    title: 'Comparable Attribute',
    content: `Mengizinkan attribute ini tampil pada fitur Compare Product.\n\nContoh:\n\nCustomer membandingkan dua produk:\n• Brand\n• Material\n• Weight\n• Processor\n\nAttribute tersebut akan ditampilkan berdampingan agar mudah dibandingkan.\n\nTips:\nAktifkan untuk spesifikasi teknis yang relevan untuk perbandingan.`,
  },
  is_filterable: {
    title: 'Layered Navigation Filter',
    content: `Attribute akan digunakan sebagai filter pada halaman kategori produk.\n\nContoh filter di kategori Fashion:\n\nBrand:\n• Nike\n• Adidas\n\nColor:\n• Black\n• White\n\nSize:\n• M\n• L\n• XL\n\nTips:\nAktifkan hanya untuk attribute yang ingin dijadikan filter pencarian produk.`,
  },
};

/* ─────────────────── Checkbox row ──────────────────── */
function CheckRow({ fieldKey, label, checked, onChange }) {
  const tip = TOOLTIP_DATA[fieldKey];
  return (
    <div style={S.checkRow}>
      <span style={S.checkLabel}>
        {label}
        {tip && (
          <InfoTooltip
            title={tip.title}
            content={tip.content}
            iconSize={13}
            iconColor="#64748B"
            maxWidth={300}
          />
        )}
      </span>
      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          style={{ width: '16px', height: '16px', accentColor: '#3B82F6', cursor: 'pointer' }}
        />
      </label>
    </div>
  );
}

/* ─────────────────── Field wrapper ─────────────────── */
function Field({ label, required, error, hint, children }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={S.label}>
        {label}{required && <span style={{ color: '#EF4444' }}> *</span>}
      </label>
      {children}
      {hint  && <p style={S.hint}>{hint}</p>}
      {error && <p style={S.err}>{error}</p>}
    </div>
  );
}

/* ═══════════════════ COMPONENT ══════════════════════ */
export default function CreateAttribute() {
  const [form, setForm] = useState({
    code: '', admin_name: '', type: 'text',
    is_required: false, is_unique: false,
    value_per_locale: false, value_per_channel: false,
    is_configurable: false, is_visible_on_front: false,
    is_comparable: false, is_filterable: false,
  });
  const [options, setOptions] = useState([]);
  const [errors, setErrors]   = useState({});
  const [saving, setSaving]   = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const needsOptions = ['select', 'multiselect'].includes(form.type);

  const handleCode = (v) =>
    set('code', v.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/^_+/, ''));

  const addOption = () =>
    setOptions(p => [...p, { admin_name: '', sort_order: p.length }]);
  const updOpt = (i, k, v) =>
    setOptions(p => p.map((o, idx) => idx === i ? { ...o, [k]: v } : o));
  const delOpt = (i) =>
    setOptions(p => p.filter((_, idx) => idx !== i));

  const submit = (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    router.post('/admin/attributes', { ...form, options: needsOptions ? options : [] }, {
      onSuccess: () => router.visit('/admin/attributes'),
      onFinish: () => setSaving(false),
      onError:  (e) => { setErrors(e); setSaving(false); },
    });
  };

  const CHECKS_VALIDATION = [
    { key: 'is_required', label: 'Is Required' },
    { key: 'is_unique',   label: 'Is Unique' },
  ];

  const CHECKS_CONFIG = [
    { key: 'value_per_locale',    label: 'Value Per Locale' },
    { key: 'value_per_channel',   label: 'Value Per Channel' },
    { key: 'is_configurable',     label: 'Use To Create Configurable Product' },
    { key: 'is_visible_on_front', label: 'Visible on Product View Page on Front-end' },
    { key: 'is_comparable',       label: 'Attribute is Comparable' },
    { key: 'is_filterable',       label: 'Use in Layered Navigation' },
  ];

  return (
    <AdminLayout>
      <div style={S.page}>
        {/* ── Top bar ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <nav style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px', display: 'flex', gap: '6px', alignItems: 'center' }}>
              <a href="/admin/dashboard" style={{ color: '#64748B', textDecoration: 'none' }}>Dashboard</a>
              <span>/</span>
              <a href="/admin/attributes" style={{ color: '#64748B', textDecoration: 'none' }}>Attributes</a>
              <span>/</span>
              <span style={{ color: '#94A3B8' }}>Create</span>
            </nav>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#F1F5F9', margin: 0 }}>Create Attribute</h1>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <a href="/admin/attributes" style={S.btnGhost}>Back</a>
            <button onClick={submit} disabled={saving} style={{ ...S.btnBlue, opacity: saving ? 0.6 : 1 }}>
              {saving
                ? <><span style={{ width: 14, height: 14, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />Saving…</>
                : <><Save size={14} />Save Attribute</>}
            </button>
          </div>
        </div>

        <form onSubmit={submit}>
          {/* ── 2-col layout: Label (75%) | Settings (25%) ── */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>

            {/* ══ LEFT — Label card ══ */}
            <div style={{ flex: '0 0 calc(74% - 8px)' }}>
              <div style={S.card}>
                <div style={S.cardHeader}>Label</div>
                <div style={S.cardBody}>
                  <Field label="Admin" required error={errors.admin_name}>
                    <input
                      style={S.input(!!errors.admin_name)}
                      value={form.admin_name}
                      onChange={e => set('admin_name', e.target.value)}
                      placeholder="e.g. Color"
                      onFocus={e => e.target.style.borderColor = '#3B82F6'}
                      onBlur={e => e.target.style.borderColor = errors.admin_name ? '#EF4444' : '#334155'}
                    />
                  </Field>
                  <Field label="English (EN)">
                    <input
                      style={S.input()}
                      placeholder="e.g. Color"
                      onFocus={e => e.target.style.borderColor = '#3B82F6'}
                      onBlur={e => e.target.style.borderColor = '#334155'}
                    />
                  </Field>
                </div>
              </div>

              {/* Options card — only for select/multiselect */}
              {needsOptions && (
                <div style={S.card}>
                  <div style={{ ...S.cardHeader, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Options</span>
                    <button type="button" onClick={addOption} style={{ ...S.btnBlue, padding: '5px 12px', fontSize: '12px' }}>
                      <Plus size={13} /> Add Row
                    </button>
                  </div>
                  <div style={S.cardBody}>
                    {options.length === 0 ? (
                      <p style={{ textAlign: 'center', color: '#64748B', fontSize: '13px', padding: '20px 0' }}>
                        No options added yet.
                      </p>
                    ) : (
                      <>
                        {/* header */}
                        <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 80px 36px', gap: '8px', paddingBottom: '8px', borderBottom: '1px solid #334155', marginBottom: '8px' }}>
                          <div />
                          <span style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Name</span>
                          <span style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sort</span>
                          <div />
                        </div>
                        {options.map((opt, i) => (
                          <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 80px 36px', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                            <GripVertical size={14} style={{ color: '#475569', justifySelf: 'center', cursor: 'grab' }} />
                            <input
                              style={S.input()}
                              value={opt.admin_name}
                              onChange={e => updOpt(i, 'admin_name', e.target.value)}
                              placeholder="Option label"
                            />
                            <input
                              type="number" min={0}
                              style={S.input()}
                              value={opt.sort_order}
                              onChange={e => updOpt(i, 'sort_order', +e.target.value)}
                            />
                            <button type="button" onClick={() => delOpt(i)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ══ RIGHT — 3 cards ══ */}
            <div style={{ flex: '0 0 calc(26% - 8px)' }}>

              {/* General */}
              <div style={S.card}>
                <div style={S.cardHeader}>General</div>
                <div style={S.cardBody}>
                  <Field label="Attribute Code" required error={errors.code}
                    hint="Lowercase letters, numbers & underscores only.">
                    <input
                      style={S.input(!!errors.code)}
                      value={form.code}
                      onChange={e => handleCode(e.target.value)}
                      placeholder="e.g. color"
                      onFocus={e => e.target.style.borderColor = '#3B82F6'}
                      onBlur={e => e.target.style.borderColor = errors.code ? '#EF4444' : '#334155'}
                    />
                  </Field>
                  <Field label="Attribute Type" required error={errors.type}>
                    <select
                      style={S.select(!!errors.type)}
                      value={form.type}
                      onChange={e => set('type', e.target.value)}
                    >
                      {ATTRIBUTE_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>

              {/* Validations */}
              <div style={S.card}>
                <div style={S.cardHeader}>Validations</div>
                <div>
                  {CHECKS_VALIDATION.map((c, i) => (
                    <React.Fragment key={c.key}>
                      {i > 0 && <hr style={S.divider} />}
                      <CheckRow
                        fieldKey={c.key}
                        label={c.label}
                        checked={form[c.key]}
                        onChange={() => set(c.key, !form[c.key])}
                      />
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Configuration */}
              <div style={S.card}>
                <div style={S.cardHeader}>Configuration</div>
                <div>
                  {CHECKS_CONFIG.map((c, i) => (
                    <React.Fragment key={c.key}>
                      {i > 0 && <hr style={S.divider} />}
                      <CheckRow
                        fieldKey={c.key}
                        label={c.label}
                        checked={form[c.key]}
                        onChange={() => set(c.key, !form[c.key])}
                      />
                    </React.Fragment>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AdminLayout>
  );
}

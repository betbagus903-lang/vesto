import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useRef, useCallback, useEffect } from 'react';
import {
    ChevronLeft, Save, Eye, Upload, Crop, Monitor, Smartphone,
    AlignLeft, AlignCenter, AlignRight, Home, Tag, ShoppingBag,
    Layers, ExternalLink, Calendar, Clock, Globe, Check,
    Image as ImageIcon, Zap, RefreshCw, Trash2, Edit2,
    Info, ChevronDown, LayoutTemplate, MapPin,
} from 'lucide-react';

/* ─── Tokens ─────────────────────────────────────────────────────── */
const T = {
    bg:     '#090C14',
    card:   '#111827',
    card2:  '#0F1623',
    input:  '#0d1421',
    border: 'rgba(255,255,255,0.07)',
    borderHover: 'rgba(255,255,255,0.15)',
    blue:   '#4F6BFF',
    purple: '#6C63FF',
    white:  '#FFFFFF',
    sub:    '#A8B3CF',
    muted:  '#55657D',
    danger: '#EF4444',
    green:  '#10B981',
    amber:  '#F59E0B',
};

/* ─── Shared primitives ───────────────────────────────────────────── */
function Card({ children, className = '', style = {} }) {
    return (
        <div className={`rounded-2xl ${className}`}
            style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, ...style }}>
            {children}
        </div>
    );
}

function CardHeader({ badge, title, subtitle }) {
    return (
        <div className="flex items-start gap-3 px-6 pt-6 pb-5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                style={{ background: `linear-gradient(135deg, ${T.blue}, ${T.purple})` }}>
                {badge}
            </div>
            <div>
                <h2 className="text-sm font-semibold text-white">{title}</h2>
                {subtitle && <p className="text-xs mt-0.5" style={{ color: T.muted }}>{subtitle}</p>}
            </div>
        </div>
    );
}

function SectionDivider() {
    return <div style={{ height: 1, backgroundColor: T.border }} />;
}

function FLabel({ children, required }) {
    return (
        <label className="block text-xs font-medium mb-1.5" style={{ color: T.sub }}>
            {children}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
    );
}

function FInput({ value, onChange, placeholder, type = 'text' }) {
    return (
        <input type={type} value={value} onChange={e => { console.log('Input changed:', e.target.value); onChange(e); }} placeholder={placeholder}
            className="w-full h-[38px] px-3 rounded-xl text-sm text-white placeholder-[#3d4f68] focus:outline-none transition-all"
            style={{ backgroundColor: T.input, border: `1px solid ${T.border}` }}
            onFocus={e => e.target.style.borderColor = T.blue}
            onBlur={e => e.target.style.borderColor = T.border}
        />
    );
}

function Toggle({ checked, onChange }) {
    return (
        <button type="button" onClick={() => onChange(!checked)}
            className="relative w-10 h-5 rounded-full flex-shrink-0 transition-all duration-200"
            style={{ backgroundColor: checked ? T.blue : '#1e2a3a', border: `1px solid ${checked ? T.blue : T.border}` }}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${checked ? 'left-[18px]' : 'left-0.5'}`} />
        </button>
    );
}

function DropSelect({ value, onChange, options }) {
    return (
        <div className="relative">
            <select value={value} onChange={e => onChange(e.target.value)}
                className="w-full h-[38px] pl-3 pr-8 rounded-xl text-sm text-white appearance-none focus:outline-none transition-all"
                style={{ backgroundColor: T.input, border: `1px solid ${T.border}` }}
                onFocus={e => e.target.style.borderColor = T.blue}
                onBlur={e => e.target.style.borderColor = T.border}>
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: T.muted }} />
        </div>
    );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function BannerCreate({ type = 'hero_slider', categories = [], products = [], collections = [], bannerId = null, banner = null }) {
    const isEditing = !!bannerId;
    
    const { data, setData, post, put, processing, errors } = useForm({
        type: banner?.type || type,
        title: banner?.title || '',
        subtitle: banner?.subtitle || '',
        image: banner?.image || '',
        image_path: banner?.image || '',
        button_text: banner?.button_text || '',
        button_link: banner?.button_link || '',
        open_in_new_tab: banner?.open_in_new_tab || false,
        link_type: banner?.link_type || 'home',
        link_id: banner?.link_id || null,
        collection_id: banner?.collection_id || null,
        cta_style: banner?.cta_style || 'filled_dark',
        text_alignment: banner?.text_alignment || 'left',
        text_color: banner?.text_color || '#FFFFFF',
        is_active: banner?.is_active ?? true,
        featured: banner?.featured || false,
        sort_order: banner?.sort_order || 1,
        display_devices: banner?.display_devices || ['desktop', 'tablet', 'mobile'],
        publish_type: 'immediate',
        start_date: banner?.start_date || '',
        start_time: '10:00',
        end_date: banner?.end_date || '',
        end_time: '10:00',
        timezone: 'Asia/Jakarta',
    });

    /* ── Banner canvas sizes per destination ── */
    const BANNER_SIZES = {
        home:         { width: 1920, height: 800,  label: '1920 × 800 (Hero Slider)' },
        category:     { width: 1920, height: 500,  label: '1920 × 500 (Category)' },
        product:      { width: 1200, height: 400,  label: '1200 × 400 (Product)' },
        collection:   { width: 1920, height: 600,  label: '1920 × 600 (Collection)' },
        external_url: { width: 1920, height: 800,  label: '1920 × 800 (Custom URL)' },
    };

    const currentSize = BANNER_SIZES[data.link_type] ?? BANNER_SIZES.home;

    const [previewTab, setPreviewTab]       = useState('desktop');
    const [uploading, setUploading]         = useState(false);
    const [imageError, setImageError]       = useState('');
    const [imageReady, setImageReady]       = useState(false);
    const fileRef    = useRef(null);
    const replaceRef = useRef(null);

    /* ── Pick up image returned from Designer ── */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const designImage = params.get('designImage');
        const designPath  = params.get('designPath');
        
        // If coming from designer with image, apply it
        if (designImage && designPath) {
            setData(d => ({ ...d, image: designImage, image_path: designPath }));
            setImageReady(true);
            // Clean URL so refresh doesn't re-apply
            const clean = new URL(window.location.href);
            clean.searchParams.delete('designImage');
            clean.searchParams.delete('designPath');
            window.history.replaceState({}, '', clean.toString());
        } else if (!isEditing) {
            // Only redirect to designer if creating new banner (not editing)
            const hasRedirected = sessionStorage.getItem('banner_create_redirected');
            if (!hasRedirected) {
                sessionStorage.setItem('banner_create_redirected', 'true');
                const designerParams = new URLSearchParams({
                    returnUrl: window.location.href,
                    type: data.type,
                });
                window.location.href = route('admin.cms.banners.designer') + '?' + designerParams.toString();
            }
        } else {
            // If editing and we have an image from banner, mark as ready
            if (data.image) {
                setImageReady(true);
            }
        }
    }, [isEditing, data.image, data.type]);

    /* upload */
    const doUpload = useCallback(async (file) => {
        setImageError('');
        if (file.size > 2 * 1024 * 1024) { setImageError('Max 2MB.'); return; }
        if (!['image/jpeg','image/png','image/webp'].includes(file.type)) { setImageError('PNG, JPG or WEBP only.'); return; }
        setUploading(true);
        setImageReady(false);
        setData('image', URL.createObjectURL(file));
        const fd = new FormData();
        fd.append('image', file);
        try {
            const res = await fetch(route('admin.cms.banners.upload'), { method:'POST', body:fd });
            const json = await res.json();
            if (json.success) {
                setData('image', json.path);
                setImageReady(true);
                // Store animations if returned from designer
                if (json.animations) {
                    setData('animations', json.animations);
                }
            } else {
                setImageError('Upload failed.');
            }
        } catch (e) {
            setImageError('Upload failed.');
        }
        setUploading(false);
    }, []);

    const onDrop   = e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) doUpload(f); };
    const onFile   = e => { const f = e.target.files[0]; if (f) doUpload(f); e.target.value = ''; };
    const clearImg = () => { setData(d => ({...d, image:'', image_path:''})); setImageReady(false); };

    const toggleDevice = dev => {
        const cur = data.display_devices ?? [];
        setData('display_devices', cur.includes(dev) ? cur.filter(d => d !== dev) : [...cur, dev]);
    };

    /* submit */
    const submit = (e, draft = false) => {
        e?.preventDefault();
        if (draft) setData('is_active', false);
        // Clear redirect flag on submit
        sessionStorage.removeItem('banner_create_redirected');
        
        // Debug: log the data being submitted
        console.log('Submitting banner data:', {
            title: data.title,
            subtitle: data.subtitle,
            button_text: data.button_text,
            button_link: data.button_link,
            cta_style: data.cta_style,
        });
        
        if (isEditing) {
            put(route('admin.cms.banners.update', bannerId));
        } else {
            post(route('admin.cms.banners.store'));
        }
    };

    /* preview helpers */
    const ctaCls = () => ({
        filled_blue: 'bg-gradient-to-r from-[#4F6BFF] to-[#6C63FF] text-white',
        filled_dark: 'bg-black/60 text-white border border-white/20',
        outline:     'border-2 border-white text-white',
        ghost:       'text-white underline',
    }[data.cta_style] ?? '');

    const alignCls = data.text_alignment === 'center' ? 'items-center text-center'
                   : data.text_alignment === 'right'  ? 'items-end   text-right'
                   : 'items-start text-left';

    const colorPresets = ['#FFFFFF','#F8FAFC','#4F6BFF','#10B981','#F59E0B','#EF4444','#0A0D14'];

    /* destination labels */
    const destOptions = [
        { value:'home',         label:'Home Page',       Icon:Home,           desc:'Show on homepage slider' },
        { value:'category',     label:'Category Page',   Icon:Tag,            desc:'Show on category pages' },
        { value:'product',      label:'Product Page',    Icon:ShoppingBag,    desc:'Show on product details' },
        { value:'collection',   label:'Collection Page', Icon:Layers,         desc:'Show on collection pages' },
        { value:'external_url', label:'Custom URL',      Icon:ExternalLink,   desc:'Open on custom URL link' },
    ];

    return (
        <AdminLayout>
            <Head title="Create Banner" />
            <div className="min-h-screen" style={{ backgroundColor: T.bg }}>

                {/* ── Sticky top bar ── */}
                <div className="sticky top-0 z-50"
                    style={{ backgroundColor: `${T.bg}cc`, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${T.border}` }}>
                    <div className="px-6 h-14 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs" style={{ color: T.muted }}>
                            <Link href={route('admin.cms.banners.index', { type })}
                                className="hover:text-white transition-colors flex items-center gap-1">
                                <ChevronLeft className="w-3.5 h-3.5" /> Banners
                            </Link>
                            <span>›</span>
                            <span className="text-white font-medium">Create Banner</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={e => submit(e, true)} disabled={processing}
                                className="flex items-center gap-1.5 px-4 h-8 rounded-xl text-xs font-semibold transition-all hover:-translate-y-px disabled:opacity-40"
                                style={{ backgroundColor: T.card2, color: T.sub, border: `1px solid ${T.border}` }}>
                                <Save className="w-3.5 h-3.5" /> Save as Draft
                            </button>
                            <button type="button" onClick={e => submit(e, false)} disabled={processing}
                                className="flex items-center gap-1.5 px-4 h-8 rounded-xl text-xs font-semibold text-white transition-all hover:-translate-y-px disabled:opacity-40"
                                style={{ background: `linear-gradient(135deg,${T.blue},${T.purple})`, boxShadow: `0 2px 16px ${T.blue}50` }}>
                                <Save className="w-3.5 h-3.5" /> Save Banner
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Page title ── */}
                <div className="px-6 pt-7 pb-5">
                    <h1 className="text-xl font-bold text-white tracking-tight">{isEditing ? 'Edit Banner' : 'Create Banner'}</h1>
                    <p className="text-xs mt-0.5" style={{ color: T.muted }}>{isEditing ? 'Edit your banner settings and content.' : 'Create a new banner for your store and publish it to chosen locations.'}</p>
                </div>

                {/* ── Main layout ── */}
                <form onSubmit={submit} className="px-6 pb-16">
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">

                        {/* ════════ LEFT COLUMN ════════ */}
                        <div className="space-y-5">

                            {/* ── Card 1: Where to Display ── */}
                            <Card>
                                <CardHeader badge="1" title="Where to Display"
                                    subtitle={`Choose where this banner will appear. Canvas size: ${currentSize.label}`} />
                                <SectionDivider />
                                <div className="px-6 py-5">
                                    <div className="grid grid-cols-5 gap-3">
                                        {destOptions.map(({ value, label, Icon, desc }) => {
                                            const active = data.link_type === value;
                                            return (
                                                <button key={value} type="button" onClick={() => setData('link_type', value)}
                                                    className="flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all duration-200 hover:-translate-y-0.5 group"
                                                    style={{
                                                        backgroundColor: active ? `${T.blue}15` : T.card2,
                                                        border: `1.5px solid ${active ? T.blue : T.border}`,
                                                    }}>
                                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                                                        style={{ backgroundColor: active ? `${T.blue}25` : 'rgba(255,255,255,0.04)' }}>
                                                        <Icon className="w-4 h-4" style={{ color: active ? T.blue : T.muted }} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-semibold leading-tight" style={{ color: active ? T.white : T.sub }}>{label}</p>
                                                        <p className="text-[9px] mt-0.5 leading-tight" style={{ color: T.muted }}>{desc}</p>
                                                    </div>
                                                    {active && (
                                                        <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: T.blue }}>
                                                            <Check className="w-2.5 h-2.5 text-white" />
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Dynamic destination field */}
                                    {data.link_type === 'category' && (
                                        <div className="mt-4">
                                            <FLabel>Select Category</FLabel>
                                            <DropSelect value={data.link_id || ''} onChange={v => setData('link_id', parseInt(v))}
                                                options={[{value:'',label:'Choose category...'}, ...categories.map(c => ({value:c.id,label:c.name}))]} />
                                        </div>
                                    )}
                                    {data.link_type === 'product' && (
                                        <div className="mt-4">
                                            <FLabel>Select Product</FLabel>
                                            <DropSelect value={data.link_id || ''} onChange={v => setData('link_id', parseInt(v))}
                                                options={[{value:'',label:'Choose product...'}, ...products.map(p => ({value:p.id,label:p.name}))]} />
                                        </div>
                                    )}
                                    {data.link_type === 'collection' && (
                                        <div className="mt-4">
                                            <FLabel>Select Collection</FLabel>
                                            <DropSelect value={data.collection_id || ''} onChange={v => setData('collection_id', parseInt(v))}
                                                options={[{value:'',label:'Choose collection...'}, ...collections.map(c => ({value:c.id,label:c.name}))]} />
                                        </div>
                                    )}
                                    {data.link_type === 'external_url' && (
                                        <div className="mt-4">
                                            <FLabel>Custom URL</FLabel>
                                            <FInput value={data.button_link} onChange={e => setData('button_link', e.target.value)} placeholder="https://example.com" />
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* ── Card 2: Banner Image ── */}
                            <Card>
                                <CardHeader badge="2" title="Banner Image" subtitle="Upload your banner image or edit it using our built-in editor." />
                                <SectionDivider />
                                <div className="px-6 py-5">
                                    <div className="grid grid-cols-[1fr_160px] gap-5">
                                        {/* Left: image area */}
                                        <div>
                                            {!data.image ? (
                                                <div onDrop={onDrop} onDragOver={e => e.preventDefault()} onClick={() => fileRef.current?.click()}
                                                    className="relative flex flex-col items-center justify-center gap-3 cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200"
                                                    style={{ height: 200, borderColor: T.border, backgroundColor: T.card2 }}
                                                    onMouseEnter={e => { e.currentTarget.style.borderColor = T.blue; e.currentTarget.style.backgroundColor = `${T.blue}08`; }}
                                                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.backgroundColor = T.card2; }}>
                                                    {uploading ? (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: T.blue }} />
                                                            <p className="text-xs" style={{ color: T.muted }}>Uploading…</p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                                                style={{ backgroundColor: `${T.blue}18`, border: `1px solid ${T.blue}30` }}>
                                                                <Upload className="w-5 h-5" style={{ color: T.blue }} />
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-sm font-medium text-white">Drop image here</p>
                                                                <p className="text-xs mt-0.5" style={{ color: T.muted }}>or click to browse</p>
                                                            </div>
                                                            <p className="text-xs px-3 py-1 rounded-lg" style={{ color: T.muted, backgroundColor: T.card, border:`1px solid ${T.border}` }}>
                                                                {currentSize.width} × {currentSize.height} · JPG, PNG, WEBP · Max 2MB
                                                            </p>
                                                        </>
                                                    )}
                                                    <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onFile} />
                                                </div>
                                            ) : (
                                                <div className="relative rounded-xl overflow-hidden group" style={{ height: 200 }}>
                                                    <img src={data.image.startsWith('http') ? data.image : `/storage/${data.image}`} className="w-full h-full object-cover" alt="Banner" />
                                                    {/* hover overlay */}
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <button type="button" onClick={() => replaceRef.current?.click()}
                                                            className="flex items-center gap-1 text-xs font-medium text-white px-3 py-1.5 rounded-lg backdrop-blur-sm"
                                                            style={{ backgroundColor:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)' }}>
                                                            <RefreshCw className="w-3 h-3" /> Replace
                                                        </button>
                                                        <button type="button" onClick={clearImg}
                                                            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg backdrop-blur-sm"
                                                            style={{ backgroundColor:`${T.danger}20`, border:`1px solid ${T.danger}40`, color: T.danger }}>
                                                            <Trash2 className="w-3 h-3" /> Remove
                                                        </button>
                                                    </div>
                                                    {/* Image Ready badge */}
                                                    {imageReady && (
                                                        <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                                            style={{ backgroundColor:`${T.green}20`, border:`1px solid ${T.green}40`, color: T.green }}>
                                                            <Check className="w-2.5 h-2.5" />
                                                            {data.image_path?.includes('design_') ? 'Design Applied' : 'Image Ready'}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {imageError && <p className="text-xs mt-2" style={{ color: T.danger }}>{imageError}</p>}

                                            {/* Spec bar */}
                                            {data.image && (
                                                <p className="text-[10px] mt-2" style={{ color: T.muted }}>
                                                    {currentSize.label} &nbsp;·&nbsp; JPG, PNG, WEBP up to 2MB
                                                </p>
                                            )}
                                        </div>

                                        {/* Right: Quick Actions */}
                                        <div className="flex flex-col gap-2.5">
                                            <p className="text-xs font-semibold text-white mb-1">Quick Actions</p>
                                            <p className="text-[10px] leading-snug" style={{ color: T.muted }}>Upload image and edit if needed.</p>

                                            <button type="button"
                                                onClick={() => {
                                                    const params = new URLSearchParams({
                                                        returnUrl: window.location.href,
                                                        canvasWidth:  currentSize.width,
                                                        canvasHeight: currentSize.height,
                                                        bannerType:   data.link_type,
                                                        ...(data.image ? { initialImage: data.image } : {}),
                                                    });
                                                    window.location.href = route('admin.cms.banners.designer') + '?' + params.toString();
                                                }}
                                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:-translate-y-px"
                                                style={{ background: `linear-gradient(135deg,${T.blue},${T.purple})` }}>
                                                <Edit2 className="w-3.5 h-3.5" />
                                                Edit Image
                                                <span className="ml-auto text-[9px] opacity-60">Open in editor</span>
                                            </button>

                                            <button type="button" onClick={() => (data.image ? replaceRef.current?.click() : fileRef.current?.click())}
                                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all hover:-translate-y-px"
                                                style={{ backgroundColor: T.card2, color: T.sub, border:`1px solid ${T.border}` }}>
                                                <Upload className="w-3.5 h-3.5" />
                                                Replace Image
                                                <span className="ml-auto text-[9px] opacity-60">Upload new image</span>
                                            </button>

                                            <button type="button" onClick={clearImg}
                                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all hover:-translate-y-px"
                                                style={{ backgroundColor: `${T.danger}10`, color: T.danger, border:`1px solid ${T.danger}25` }}>
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Remove Image
                                                <span className="ml-auto text-[9px] opacity-60">Delete this image</span>
                                            </button>

                                            <input ref={replaceRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onFile} />
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* ── Card 3: Banner Preview ── */}
                            <Card>
                                <div className="px-6 pt-6 pb-4 flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                                            style={{ background: `linear-gradient(135deg,${T.blue},${T.purple})` }}>3</div>
                                        <div>
                                            <h2 className="text-sm font-semibold text-white">Banner Preview</h2>
                                            <p className="text-xs mt-0.5" style={{ color: T.muted }}>Preview how your banner will look on different devices.</p>
                                        </div>
                                    </div>
                                    {/* Device tabs */}
                                    <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: T.card2 }}>
                                        {[{k:'desktop',label:'Desktop',I:Monitor},{k:'mobile',label:'Mobile',I:Smartphone}].map(({k,label,I}) => (
                                            <button key={k} type="button" onClick={() => setPreviewTab(k)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                                style={{ backgroundColor: previewTab===k ? T.card : 'transparent', color: previewTab===k ? T.white : T.muted, border: previewTab===k ? `1px solid ${T.border}` : '1px solid transparent' }}>
                                                <I className="w-3.5 h-3.5" />{label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <SectionDivider />

                                {/* Desktop preview */}
                                {previewTab === 'desktop' && (
                                    <div className="p-5">
                                        <div className="rounded-xl overflow-hidden" style={{ border:`1px solid ${T.border}` }}>
                                            {/* Realistic VESTO navbar */}
                                            <div className="flex items-center justify-between px-5 h-10 border-b" style={{ backgroundColor:'#080b12', borderColor: T.border }}>
                                                <div className="flex items-center gap-5">
                                                    <span className="text-sm font-black text-white tracking-[0.2em]">VESTO</span>
                                                    <div className="flex items-center gap-4">
                                                        {['Men','Women','Shoes','Accessories','Collections','Sale'].map(m => (
                                                            <span key={m} className="text-[10px] font-medium" style={{ color: T.muted }}>{m}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1.5 h-6 px-3 rounded-lg" style={{ backgroundColor: T.card2, border:`1px solid ${T.border}` }}>
                                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: T.muted }} />
                                                        <span className="text-[9px]" style={{ color: T.muted }}>Search products...</span>
                                                    </div>
                                                    {[0,1,2].map(i => <div key={i} className="w-6 h-6 rounded-lg" style={{ backgroundColor: T.card2 }} />)}
                                                </div>
                                            </div>
                                            {/* Banner */}
                                            <div className="relative overflow-hidden" style={{ aspectRatio:'2.4/1' }}>
                                                {data.image ? (
                                                    <>
                                                        <img src={data.image.startsWith('http') ? data.image : `/storage/${data.image}`} className="w-full h-full object-cover" alt="" />
                                                        <div className={`absolute inset-0 flex flex-col justify-end pb-8 px-10 ${alignCls}`}
                                                            style={{ background:'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }}>
                                                            {data.subtitle && <p className="text-[11px] mb-1 font-medium tracking-wide uppercase opacity-80" style={{ color: data.text_color }}>{data.subtitle}</p>}
                                                            {data.title    && <p className="text-xl font-black leading-tight mb-3" style={{ color: data.text_color }}>{data.title}</p>}
                                                            {data.button_text && (
                                                                <div className={`inline-block px-4 py-1.5 rounded-lg text-xs font-semibold ${ctaCls()}`}>
                                                                    {data.button_text} {data.button_text && '→'}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center gap-2"
                                                        style={{ background:`linear-gradient(135deg, #0d1421 0%, #111827 100%)` }}>
                                                        <ImageIcon className="w-10 h-10" style={{ color: T.muted }} />
                                                        <p className="text-xs" style={{ color: T.muted }}>Upload a banner image to see preview</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* Live indicator */}
                                        <div className="flex items-center gap-1.5 mt-3">
                                            <div className={`w-1.5 h-1.5 rounded-full ${data.image ? 'animate-pulse' : ''}`}
                                                style={{ backgroundColor: data.image ? T.green : T.muted }} />
                                            <span className="text-[10px]" style={{ color: T.muted }}>
                                                {data.image ? 'Live preview — updates as you type' : 'No image uploaded yet'}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Mobile preview */}
                                {previewTab === 'mobile' && (
                                    <div className="py-6 flex justify-center">
                                        <div className="relative w-[220px]" style={{ aspectRatio:'9/20' }}>
                                            <div className="absolute inset-0 rounded-[30px] border-[6px]"
                                                style={{ backgroundColor:'#080b12', borderColor:'#1a2235', boxShadow:`0 24px 64px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.04)` }}>
                                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-4 rounded-full" style={{ backgroundColor:'#1a2235' }} />
                                                <div className="absolute top-8 inset-x-0 bottom-4 overflow-hidden rounded-b-[26px]">
                                                    <div className="flex items-center justify-between px-3 h-8 border-b" style={{ backgroundColor:'#080b12', borderColor: T.border }}>
                                                        <span className="text-[8px] font-black text-white tracking-[0.15em]">VESTO</span>
                                                        <div className="w-5 h-5 rounded" style={{ backgroundColor: T.card2 }} />
                                                    </div>
                                                    <div className="relative overflow-hidden" style={{ aspectRatio:'1/1' }}>
                                                        {data.image ? (
                                                            <>
                                                                <img src={data.image.startsWith('http') ? data.image : `/storage/${data.image}`} className="w-full h-full object-cover" alt="" />
                                                                <div className={`absolute inset-0 flex flex-col justify-end p-3 ${alignCls}`}
                                                                    style={{ background:'linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 55%)' }}>
                                                                    {data.subtitle && <p className="text-[7px] opacity-80 mb-0.5 uppercase tracking-wide" style={{ color: data.text_color }}>{data.subtitle}</p>}
                                                                    {data.title    && <p className="text-[11px] font-black leading-tight" style={{ color: data.text_color }}>{data.title}</p>}
                                                                    {data.button_text && <div className={`mt-1 inline-block px-2 py-0.5 rounded text-[7px] font-semibold ${ctaCls()}`}>{data.button_text}</div>}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: T.card2 }}>
                                                                <ImageIcon className="w-6 h-6" style={{ color: T.muted }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-3 space-y-2">
                                                        {[3,2,1.5].map((w,i) => <div key={i} className={`h-2 rounded-full w-${w === 3 ? '3/4' : w === 2 ? '1/2' : '1/3'}`} style={{ backgroundColor: T.card2 }} />)}
                                                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                                                            {[0,1,2,3].map(i => <div key={i} className="rounded-lg" style={{ height:44, backgroundColor: T.card2 }} />)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full" style={{ backgroundColor:'rgba(255,255,255,0.2)' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>

                            {/* ── Card 7: Upload Guide ── */}
                            <Card>
                                <CardHeader badge="7" title="Upload Guide" subtitle="Guidelines for the best banner results." />
                                <SectionDivider />
                                <div className="px-6 py-5">
                                    <div className="grid grid-cols-2 gap-5">
                                        {/* Spec list */}
                                        <div className="space-y-3">
                                            {[
                                                { label:'Recommended Size', value: currentSize.label },
                                                { label:'Max File Size',     value:'2 MB' },
                                                { label:'Supported Format',  value:'JPG, PNG, WEBP' },
                                                { label:'Safe Area',         value: `${Math.floor(currentSize.width*0.73)} × ${Math.floor(currentSize.height*0.75)} px` },
                                            ].map(({label,value}) => (
                                                <div key={label} className="flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: T.blue }} />
                                                    <div>
                                                        <p className="text-[10px] font-medium text-white">{label}</p>
                                                        <p className="text-[10px]" style={{ color: T.muted }}>{value}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Safe area diagram — aspect ratio from currentSize */}
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-1 text-[9px] mb-1" style={{ color: T.muted }}>
                                                <span>{currentSize.width} px</span>
                                            </div>
                                            <div className="relative w-full rounded-lg overflow-hidden"
                                                style={{ aspectRatio:`${currentSize.width}/${currentSize.height}`, backgroundColor:'#0d1421', border:`1px solid ${T.border}` }}>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="flex items-center justify-center rounded"
                                                        style={{ width:'73%', height:'75%', backgroundColor:`${T.blue}12`, border:`1.5px dashed ${T.blue}60` }}>
                                                        <div className="text-center">
                                                            <p className="text-[9px] font-semibold" style={{ color: T.blue }}>
                                                                {Math.floor(currentSize.width*0.73)} × {Math.floor(currentSize.height*0.75)} px
                                                            </p>
                                                            <p className="text-[8px]" style={{ color: T.muted }}>Safe Area</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="absolute bottom-1 right-1.5 text-[8px]" style={{ color: T.muted }}>{currentSize.height} px</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>{/* end LEFT */}

                        {/* ════════ RIGHT SIDEBAR ════════ */}
                        <div className="space-y-5">

                            {/* ── Card 4: Banner Details ── */}
                            <Card>
                                <CardHeader badge="4" title="Banner Details" subtitle="Add information about your banner." />
                                <SectionDivider />
                                <div className="px-5 py-5 space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <FLabel>Banner Title</FLabel>
                                            <FInput value={data.title} onChange={e => setData('title', e.target.value)} placeholder="Men's Style" />
                                            {errors.title && <p className="text-[10px] mt-1" style={{ color: T.danger }}>{errors.title}</p>}
                                        </div>
                                        <div>
                                            <FLabel>Subtitle</FLabel>
                                            <FInput value={data.subtitle} onChange={e => setData('subtitle', e.target.value)} placeholder="Modern look. Premium quality." />
                                            {errors.subtitle && <p className="text-[10px] mt-1" style={{ color: T.danger }}>{errors.subtitle}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <FLabel>Button Text</FLabel>
                                        <FInput value={data.button_text} onChange={e => setData('button_text', e.target.value)} placeholder="Shop Now" />
                                        {errors.button_text && <p className="text-[10px] mt-1" style={{ color: T.danger }}>{errors.button_text}</p>}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <FLabel>Button Link (URL)</FLabel>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px]" style={{ color: T.muted }}>Open in New Tab</span>
                                                <Toggle checked={data.open_in_new_tab} onChange={v => setData('open_in_new_tab', v)} />
                                            </div>
                                        </div>
                                        <FInput value={data.button_link} onChange={e => setData('button_link', e.target.value)} placeholder="/collections/mens-style" />
                                        {errors.button_link && <p className="text-[10px] mt-1" style={{ color: T.danger }}>{errors.button_link}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <FLabel>CTA Style</FLabel>
                                            <DropSelect value={data.cta_style} onChange={v => setData('cta_style', v)}
                                                options={[
                                                    {value:'filled_blue', label:'Filled Blue'},
                                                    {value:'filled_dark', label:'Filed Dark'},
                                                    {value:'outline',     label:'Outline'},
                                                    {value:'ghost',       label:'Ghost'},
                                                ]} />
                                        </div>
                                        <div>
                                            <FLabel>Text Alignment</FLabel>
                                            <div className="flex gap-1.5">
                                                {[
                                                    {value:'left',   I:AlignLeft},
                                                    {value:'center', I:AlignCenter},
                                                    {value:'right',  I:AlignRight},
                                                ].map(({value,I}) => (
                                                    <button key={value} type="button" onClick={() => setData('text_alignment', value)}
                                                        className="flex-1 h-[38px] rounded-xl flex items-center justify-center transition-all"
                                                        style={{ backgroundColor: data.text_alignment===value ? `${T.blue}20` : T.input, border:`1.5px solid ${data.text_alignment===value ? T.blue : T.border}` }}>
                                                        <I className="w-3.5 h-3.5" style={{ color: data.text_alignment===value ? T.blue : T.muted }} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text color */}
                                    <div>
                                        <FLabel>Text Color</FLabel>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {colorPresets.map(c => (
                                                <button key={c} type="button" onClick={() => setData('text_color', c)}
                                                    className="w-7 h-7 rounded-full transition-all hover:scale-110 flex-shrink-0"
                                                    style={{ backgroundColor:c, border: data.text_color===c ? `2.5px solid ${T.blue}` : '1.5px solid rgba(255,255,255,0.15)', boxShadow: data.text_color===c ? `0 0 0 1.5px ${T.bg}` : 'none' }} />
                                            ))}
                                            <div className="flex items-center gap-1.5 ml-1">
                                                <input type="color" value={data.text_color} onChange={e => setData('text_color', e.target.value)}
                                                    className="w-7 h-7 rounded-full cursor-pointer border-0 bg-transparent" title="Custom color" />
                                                <span className="text-[10px] font-mono" style={{ color: T.muted }}>{data.text_color}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* ── Card 5: Schedule ── */}
                            <Card>
                                <CardHeader badge="5" title="Schedule" subtitle="Choose when this banner should be published." />
                                <SectionDivider />
                                <div className="px-5 py-5 space-y-4">
                                    {/* Publish Now */}
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-all ${data.publish_type==='immediate' ? '' : ''}`}
                                            style={{ borderColor: data.publish_type==='immediate' ? T.blue : T.border, backgroundColor: data.publish_type==='immediate' ? T.blue : 'transparent' }}
                                            onClick={() => setData('publish_type','immediate')}>
                                            {data.publish_type==='immediate' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                        <div onClick={() => setData('publish_type','immediate')}>
                                            <p className="text-xs font-semibold" style={{ color: data.publish_type==='immediate' ? T.white : T.sub }}>Publish Now</p>
                                            <p className="text-[10px]" style={{ color: T.muted }}>Banner will be published immediately</p>
                                        </div>
                                    </label>

                                    {/* Schedule for Later */}
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-all`}
                                            style={{ borderColor: data.publish_type==='scheduled' ? T.blue : T.border, backgroundColor: data.publish_type==='scheduled' ? T.blue : 'transparent' }}
                                            onClick={() => setData('publish_type','scheduled')}>
                                            {data.publish_type==='scheduled' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                        <div onClick={() => setData('publish_type','scheduled')}>
                                            <p className="text-xs font-semibold" style={{ color: data.publish_type==='scheduled' ? T.white : T.sub }}>Schedule for Later</p>
                                            <p className="text-[10px]" style={{ color: T.muted }}>Choose date and time to publish</p>
                                        </div>
                                    </label>

                                    {data.publish_type === 'scheduled' && (
                                        <div className="space-y-3 pt-1">
                                            <div>
                                                <FLabel>Start Date</FLabel>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)}
                                                        className="w-full h-[38px] px-3 rounded-xl text-xs text-white focus:outline-none transition-all"
                                                        style={{ backgroundColor: T.input, border:`1px solid ${T.border}` }}
                                                        onFocus={e => e.target.style.borderColor = T.blue}
                                                        onBlur={e => e.target.style.borderColor = T.border} />
                                                    <input type="time" value={data.start_time} onChange={e => setData('start_time', e.target.value)}
                                                        className="w-full h-[38px] px-3 rounded-xl text-xs text-white focus:outline-none transition-all"
                                                        style={{ backgroundColor: T.input, border:`1px solid ${T.border}` }}
                                                        onFocus={e => e.target.style.borderColor = T.blue}
                                                        onBlur={e => e.target.style.borderColor = T.border} />
                                                </div>
                                            </div>
                                            <div>
                                                <FLabel>End Date (Optional)</FLabel>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)}
                                                        className="w-full h-[38px] px-3 rounded-xl text-xs text-white focus:outline-none transition-all"
                                                        style={{ backgroundColor: T.input, border:`1px solid ${T.border}` }}
                                                        onFocus={e => e.target.style.borderColor = T.blue}
                                                        onBlur={e => e.target.style.borderColor = T.border} />
                                                    <input type="time" value={data.end_time} onChange={e => setData('end_time', e.target.value)}
                                                        className="w-full h-[38px] px-3 rounded-xl text-xs text-white focus:outline-none transition-all"
                                                        style={{ backgroundColor: T.input, border:`1px solid ${T.border}` }}
                                                        onFocus={e => e.target.style.borderColor = T.blue}
                                                        onBlur={e => e.target.style.borderColor = T.border} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* ── Card 6: Settings ── */}
                            <Card>
                                <CardHeader badge="6" title="Settings" subtitle="Configure additional settings for this banner." />
                                <SectionDivider />
                                <div className="px-5 py-5 space-y-5">
                                    {/* Toggles */}
                                    {[
                                        {key:'is_active',       label:'Active Status',    desc:'Banner will be displayed'},
                                        {key:'featured',        label:'Featured Banner',  desc:'Show this banner as featured'},
                                        {key:'open_in_new_tab', label:'Open in New Tab',  desc:'Open link in a new tab'},
                                    ].map(({key,label,desc}) => (
                                        <div key={key} className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-medium text-white">{label}</p>
                                                <p className="text-[10px]" style={{ color: T.muted }}>{desc}</p>
                                            </div>
                                            <Toggle checked={!!data[key]} onChange={v => setData(key, v)} />
                                        </div>
                                    ))}

                                    <SectionDivider />

                                    {/* Display On */}
                                    <div>
                                        <p className="text-xs font-medium text-white mb-2">Display On</p>
                                        <p className="text-[10px] mb-3" style={{ color: T.muted }}>Choose where to display this banner</p>
                                        <div className="space-y-2">
                                            {[
                                                {value:'desktop', label:'Desktop'},
                                                {value:'tablet',  label:'Tablet'},
                                                {value:'mobile',  label:'Mobile'},
                                            ].map(({value,label}) => {
                                                const on = data.display_devices?.includes(value);
                                                return (
                                                    <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
                                                        <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                                                            style={{ backgroundColor: on ? T.blue : 'transparent', border:`1.5px solid ${on ? T.blue : T.border}` }}
                                                            onClick={() => toggleDevice(value)}>
                                                            {on && <Check className="w-2.5 h-2.5 text-white" />}
                                                        </div>
                                                        <span className="text-xs" style={{ color: on ? T.white : T.sub }} onClick={() => toggleDevice(value)}>{label}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <SectionDivider />

                                    {/* Sort order */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div>
                                                <p className="text-xs font-medium text-white">Sort Order</p>
                                                <p className="text-[10px]" style={{ color: T.muted }}>Lower numbers appear first</p>
                                            </div>
                                            <input type="number" min="0" value={data.sort_order}
                                                onChange={e => setData('sort_order', parseInt(e.target.value) || 0)}
                                                className="w-16 h-8 text-center rounded-xl text-xs text-white focus:outline-none transition-all"
                                                style={{ backgroundColor: T.input, border:`1px solid ${T.border}` }}
                                                onFocus={e => e.target.style.borderColor = T.blue}
                                                onBlur={e => e.target.style.borderColor = T.border} />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>{/* end RIGHT */}
                    </div>{/* end grid */}
                </form>
            </div>
        </AdminLayout>
    );
}

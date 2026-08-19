import React, { useState, useRef, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { 
    Save, X, Plus, Trash2, Layers, Square, Type, Grid3X3, 
    Palette, Upload, Eye, Copy, Undo2, Redo2, ZoomIn, ZoomOut, 
    Maximize2, Minimize2, Star, Wand2, RefreshCw, ChevronLeft,
    Circle, Triangle, Lock, Unlock, EyeOff, Minus
} from 'lucide-react';

/* ── Theme ───────────────────────────────────────────────────── */
const T = {
    bg: '#090C14',
    panel: '#111827',
    card: '#0d1421',
    card2: '#1a2332',
    border: 'rgba(255,255,255,0.07)',
    blue: '#4F6BFF',
    green: '#10B981',
    red: '#EF4444',
    white: '#F8FAFC',
    sub: '#A8B3CF',
    muted: '#55657D',
    purple: '#6C63FF',
};

/* ── Canvas Dimensions ───────────────────────────────────────── */
const CW = 560;
const CH = 609;

/* ── Fonts ───────────────────────────────────────────────────── */
const FONTS = [
    'Inter', 'Poppins', 'Roboto', 'Open Sans', 'Lato', 
    'Montserrat', 'Oswald', 'Playfair Display', 'Raleway', 'Arial'
];

/* ── Base Colors ─────────────────────────────────────────────── */
const BASE_COLORS = [
    '#000000','#FFFFFF','#F44336','#E91E63','#9C27B0','#673AB7',
    '#3F51B5','#2196F3','#03A9F4','#00BCD4','#009688','#4CAF50',
    '#8BC34A','#CDDC39','#FFEB3B','#FFC107','#FF9800','#FF5722',
    '#795548','#9E9E9E','#607D8B','#FF6B6B','#FFE66D','#4ECDC4',
];

/* ── Fabric lazy loader ─────────────────────────────────────── */
let _fab = null;
async function getFabric() {
    if (_fab) return _fab;
    const m = await import('fabric');
    _fab = m.fabric ?? m.default ?? m;
    return _fab;
}

/* ── Color Picker Component ──────────────────────────────────── */
function ColorPicker({ color, onChange, onClose }) {
    const wheelRef = useRef(null);
    const [hex, setHex] = useState(color || '#FFFFFF');
    const drag = useRef(false);

    useEffect(() => {
        const c = wheelRef.current;
        if (!c) return;
        const ctx = c.getContext('2d');
        const cx = 80, cy = 80, r = 75;
        for (let a = 0; a < 360; a++) {
            const s = a * Math.PI / 180, e = (a + 1) * Math.PI / 180;
            const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            g.addColorStop(0, `hsl(${a},0%,100%)`);
            g.addColorStop(0.5, `hsl(${a},100%,50%)`);
            g.addColorStop(1, `hsl(${a},100%,0%)`);
            ctx.beginPath(); ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, s, e); ctx.closePath();
            ctx.fillStyle = g; ctx.fill();
        }
    }, []);

    const pick = (e) => {
        const c = wheelRef.current;
        const rect = c.getBoundingClientRect();
        const [r, g, b] = c.getContext('2d').getImageData(e.clientX - rect.left, e.clientY - rect.top, 1, 1).data;
        const h = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
        setHex(h); onChange(h);
    };

    return (
        <div className="absolute z-50 rounded-2xl p-4 shadow-2xl"
            style={{ backgroundColor: T.panel, border: `1px solid ${T.border}`, width: 220, top: 34, left: 0 }}>
            <canvas ref={wheelRef} width={160} height={160}
                className="rounded-full cursor-crosshair block mx-auto mb-3"
                onClick={pick}
                onMouseMove={e => drag.current && pick(e)}
                onMouseDown={() => drag.current = true}
                onMouseUp={() => drag.current = false} />
            <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg" style={{ backgroundColor: hex, border: `1px solid ${T.border}` }} />
                <input value={hex} onChange={e => { setHex(e.target.value); if (/^#[0-9a-f]{6}$/i.test(e.target.value)) onChange(e.target.value); }}
                    className="flex-1 h-7 px-2 rounded-lg text-xs text-white font-mono focus:outline-none"
                    style={{ backgroundColor: T.card2, border: `1px solid ${T.border}` }} />
            </div>
            <div className="grid grid-cols-6 gap-1">
                {BASE_COLORS.slice(0, 24).map(c => (
                    <button key={c} onClick={() => { setHex(c); onChange(c); }}
                        className="w-6 h-6 rounded transition-transform hover:scale-110"
                        style={{ backgroundColor: c, border: hex === c ? `2px solid ${T.blue}` : '1px solid rgba(255,255,255,0.1)' }} />
                ))}
            </div>
            <button onClick={onClose} className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded"
                style={{ color: T.muted }}><X className="w-3 h-3" /></button>
        </div>
    );
}

export default function ProductDesigner({ product, canvasSize, errors }) {
    const canvasEl = useRef(null);
    const canvasWrapRef = useRef(null);
    const fabricRef = useRef(null);
    const fileInputRef = useRef(null);
    
    const [canvasWidth, setCanvasWidth] = useState(canvasSize.width);
    const [canvasHeight, setCanvasHeight] = useState(canvasSize.height);
    const [zoom, setZoom] = useState(null);
    const [showGrid, setShowGrid] = useState(false);
    const [gridSize, setGridSize] = useState(100);
    
    const [leftPanel, setLeftPanel] = useState('layers');
    const [rightTab, setRightTab] = useState('props');
    
    const [layers, setLayers] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedObj, setSelectedObj] = useState(null);
    const [selectedProp, setSelectedProp] = useState(null);
    
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    
    const [canvasCtxMenu, setCanvasCtxMenu] = useState(null);
    const [showFgPicker, setShowFgPicker] = useState(false);
    const [fgColor, setFgColor] = useState('#FFFFFF');
    const fgColorRef = useRef('#FFFFFF');
    
    const historyRef = useRef([]);
    const histIdxRef = useRef(-1);
    const [history, setHistory] = useState([]);
    const [histIdx, setHistIdx] = useState(-1);
    
    /* ── Initialize Canvas ───────────────────────────────────── */
    useEffect(() => {
        let canvas;
        (async () => {
            const fabric = await getFabric();
            canvas = new fabric.Canvas(canvasEl.current, {
                width: canvasWidth,
                height: canvasHeight,
                backgroundColor: '#ffffff',
                preserveObjectStacking: true,
                selection: false,
                selectionColor: 'rgba(79, 107, 255, 0.1)',
                selectionBorderColor: '#4F6BFF',
                selectionLineWidth: 1,
            });
            
            fabricRef.current = canvas;
            
            // Set default object controls with edge handles for easier resizing
            fabric.Object.prototype.set({
                transparentCorners: false,
                cornerColor: '#4F6BFF',
                cornerStrokeColor: '#ffffff',
                borderColor: '#4F6BFF',
                cornerSize: 8,
                padding: 5,
                borderScaleFactor: 1,
                noScaleCache: true,
                borderDashArray: [2, 2],
                objectCaching: false,
                strokeWidth: 0,
                hasBorders: true,
                hasControls: true,
            });
            
            // Enable all control handles for easier resizing
            fabric.Object.prototype.set({
                tl: true, tr: true, bl: true, br: true,
                mt: true, mb: true, ml: true, mr: true,
                mtr: true,
            });
            
            // Customize circle/ellipse with edge handles
            fabric.Circle.prototype.set({ 
                padding: 5, strokeWidth: 0, objectCaching: false, 
                hasBorders: true, hasControls: true, cornerSize: 8,
                transparentCorners: false, cornerColor: '#4F6BFF',
                cornerStrokeColor: '#ffffff', borderColor: '#4F6BFF',
                tl: true, tr: true, bl: true, br: true,
                mt: true, mb: true, ml: true, mr: true, mtr: true,
            });
            fabric.Ellipse.prototype.set({ 
                padding: 5, strokeWidth: 0, objectCaching: false, 
                hasBorders: true, hasControls: true, cornerSize: 8,
                transparentCorners: false, cornerColor: '#4F6BFF',
                cornerStrokeColor: '#ffffff', borderColor: '#4F6BFF',
                tl: true, tr: true, bl: true, br: true,
                mt: true, mb: true, ml: true, mr: true, mtr: true,
            });
            fabric.Triangle.prototype.set({ 
                padding: 5, strokeWidth: 0, objectCaching: false, 
                hasBorders: true, hasControls: true, cornerSize: 8,
                transparentCorners: false, cornerColor: '#4F6BFF',
                cornerStrokeColor: '#ffffff', borderColor: '#4F6BFF',
                tl: true, tr: true, bl: true, br: true,
                mt: true, mb: true, ml: true, mr: true, mtr: true,
            });
            
            // Load product image as background
            if (product.image_url) {
                fabric.Image.fromURL(product.image_url, (img) => {
                    img.set({
                        scaleX: canvasWidth / img.width,
                        scaleY: canvasHeight / img.height,
                        selectable: false,
                        evented: false,
                        id: 'bg-image',
                        name: 'Background Image'
                    });
                    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
                    canvas.renderAll();
                    syncLayers(canvas);
                    pushHistory(canvas);
                }, { crossOrigin: 'anonymous' });
            }
            
            // Event handlers
            canvas.on('selection:created', e => onSelect(e));
            canvas.on('selection:updated', e => onSelect(e));
            canvas.on('selection:cleared', () => { 
                setSelectedId(null); 
                setSelectedObj(null); 
                setSelectedProp(null); 
            });
            canvas.on('object:modified', () => { 
                syncLayers(canvas); 
                pushHistory(canvas); 
            });
            canvas.on('object:added', () => { 
                syncLayers(canvas); 
                pushHistory(canvas); 
            });
            canvas.on('object:removed', () => { 
                syncLayers(canvas); 
                pushHistory(canvas); 
            });
            
            // Right-click context menu
            canvas.on('mouse:down', (opt) => {
                if (opt.e.button === 2) {
                    opt.e.preventDefault();
                    const obj = opt.target;
                    if (obj) {
                        canvas.setActiveObject(obj);
                        canvas.renderAll();
                        setCanvasCtxMenu({ x: opt.e.clientX, y: opt.e.clientY, objId: obj.id });
                    }
                    return;
                }
            });
            
            // Keyboard shortcuts
            document.addEventListener('keydown', handleKeyDown);
            
            // Initial sync
            syncLayers(canvas);
            pushHistory(canvas);
            
            // Auto-fit zoom
            const calcZoom = () => {
                const w = canvasWrapRef.current;
                if (!w) return;
                setZoom(Math.min((w.clientWidth - 80) / canvasWidth, (w.clientHeight - 80) / canvasHeight, 1));
            };
            setTimeout(calcZoom, 150);
            window.addEventListener('resize', calcZoom);
            
            return () => {
                window.removeEventListener('resize', calcZoom);
            };
        })();
        
        return () => {
            if (canvas) {
                canvas.dispose();
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [canvasWidth, canvasHeight, product.image_url]);
    
    /* ── refs sync ── */
    useEffect(() => { fgColorRef.current = fgColor; }, [fgColor]);
    
    /* ── Event Handlers ──────────────────────────────────────── */
    const onSelect = (e) => {
        const obj = e.selected[0];
        if (obj) {
            setSelectedId(obj.id);
            setSelectedObj(obj);
            readProps(obj);
        }
    };
    
    const syncLayers = useCallback((c) => {
        const canvas = c || fabricRef.current;
        if (!canvas) return;
        setLayers(canvas.getObjects().filter(o => o.id !== 'bg-image').reverse().map((o, i) => ({ 
            id: o.id || `obj-${i}`, 
            name: o.name || o.type || 'Layer', 
            type: o.type, 
            visible: o.visible !== false,
            locked: !!o.lockMovementX,
            obj: o 
        })));
    }, []);

    const readProps = (obj) => {
        if (!obj) return;
        setSelectedProp({ 
            type: obj.type, 
            left: Math.round(obj.left ?? 0), 
            top: Math.round(obj.top ?? 0), 
            width: Math.round(obj.getScaledWidth?.() ?? obj.width ?? 0), 
            height: Math.round(obj.getScaledHeight?.() ?? obj.height ?? 0), 
            opacity: Math.round((obj.opacity ?? 1) * 100), 
            fill: typeof obj.fill === 'string' ? obj.fill : '#000000', 
            fontSize: obj.fontSize ?? 24, 
            fontFamily: obj.fontFamily ?? 'Inter', 
            fontWeight: obj.fontWeight ?? 'normal', 
            textAlign: obj.textAlign ?? 'left', 
            angle: Math.round(obj.angle ?? 0), 
            shadow: !!obj.shadow 
        });
    };

    const updateProp = (key, val) => {
        const canvas = fabricRef.current; 
        const obj = canvas?.getActiveObject();
        if (!obj) return;
        if (key === 'opacity') obj.set({ opacity: val / 100 });
        else if (key === 'width') obj.set({ scaleX: val / (obj.width ?? 1) });
        else if (key === 'height') obj.set({ scaleY: val / (obj.height ?? 1) });
        else if (key === 'shadow') obj.set({ shadow: val ? { color: 'rgba(0,0,0,0.4)', blur: 8, offsetX: 2, offsetY: 2 } : null });
        else obj.set({ [key]: val });
        canvas.renderAll(); 
        readProps(obj);
    };

    const pushHistory = (c) => {
        const canvas = c || fabricRef.current; 
        if (!canvas) return;
        const json = JSON.stringify(canvas.toJSON(['id', 'name']));
        const trimmed = historyRef.current.slice(0, histIdxRef.current + 1);
        const next = [...trimmed, json].slice(-60);
        historyRef.current = next; 
        histIdxRef.current = next.length - 1;
        setHistory([...next]); 
        setHistIdx(next.length - 1);
    };

    const undoAction = useCallback(() => {
        const canvas = fabricRef.current; 
        if (!canvas || histIdxRef.current <= 0) return;
        const ni = histIdxRef.current - 1;
        canvas.loadFromJSON(historyRef.current[ni], () => { 
            canvas.renderAll(); 
            syncLayers(canvas); 
        });
        histIdxRef.current = ni; 
        setHistIdx(ni);
    }, [syncLayers]);

    const redoAction = useCallback(() => {
        const canvas = fabricRef.current; 
        if (!canvas || histIdxRef.current >= historyRef.current.length - 1) return;
        const ni = histIdxRef.current + 1;
        canvas.loadFromJSON(historyRef.current[ni], () => { 
            canvas.renderAll(); 
            syncLayers(canvas); 
        });
        histIdxRef.current = ni; 
        setHistIdx(ni);
    }, [syncLayers]);
    
    const handleKeyDown = (e) => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            deleteSelected();
        } else if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            undoAction();
        } else if (e.ctrlKey && e.key === 'y') {
            e.preventDefault();
            redoAction();
        }
    };
    
    const deleteSelected = () => {
        const canvas = fabricRef.current;
        const obj = canvas?.getActiveObject();
        if (obj) {
            canvas.remove(obj);
            canvas.discardActiveObject();
            canvas.renderAll();
        }
    };
    
    const copyObject = () => {
        const canvas = fabricRef.current;
        const obj = canvas?.getActiveObject();
        if (obj) {
            obj.clone((cloned) => {
                cloned.set({
                    left: cloned.left + 20,
                    top: cloned.top + 20,
                    id: `obj-${Date.now()}`,
                });
                canvas.add(cloned);
                canvas.setActiveObject(cloned);
                canvas.renderAll();
            });
        }
    };
    
    const addText = async () => {
        const canvas = fabricRef.current;
        const fabric = await getFabric();
        const text = new fabric.IText('Double click to edit', {
            left: canvasWidth / 2 - 100,
            top: canvasHeight / 2,
            originX: 'center',
            originY: 'center',
            fontFamily: 'Inter',
            fontSize: 24,
            fill: fgColorRef.current,
            id: `obj-${Date.now()}`,
            name: 'Text',
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
    };
    
    const addShape = async (type) => {
        const canvas = fabricRef.current;
        const fabric = await getFabric();
        let shape;
        
        const commonProps = {
            left: canvasWidth / 2,
            top: canvasHeight / 2,
            originX: 'center',
            originY: 'center',
            fill: fgColorRef.current,
            id: `obj-${Date.now()}`,
            name: type,
        };
        
        switch (type) {
            case 'rect':
                shape = new fabric.Rect({ ...commonProps, width: 100, height: 100 });
                break;
            case 'circle':
                shape = new fabric.Circle({ ...commonProps, radius: 50 });
                break;
            case 'triangle':
                shape = new fabric.Triangle({ ...commonProps, width: 100, height: 100 });
                break;
            case 'ellipse':
                shape = new fabric.Ellipse({ ...commonProps, rx: 60, ry: 40 });
                break;
        }
        
        canvas.add(shape);
        canvas.setActiveObject(shape);
        canvas.renderAll();
    };
    
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (f) => {
            const canvas = fabricRef.current;
            canvas.constructor.Image.fromURL(f.target.result, (img) => {
                const scale = Math.min(200 / img.width, 200 / img.height);
                img.set({
                    scaleX: scale,
                    scaleY: scale,
                    left: canvasWidth / 2,
                    top: canvasHeight / 2,
                    originX: 'center',
                    originY: 'center',
                    id: `obj-${Date.now()}`,
                    name: 'Image',
                });
                canvas.add(img);
                canvas.setActiveObject(img);
                canvas.renderAll();
            });
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };
    
    const toggleVisibility = (obj) => {
        obj.set('visible', !obj.visible);
        fabricRef.current?.renderAll();
        syncLayers();
    };
    
    const toggleLock = (obj) => {
        const locked = !!obj.lockMovementX;
        obj.set({
            lockMovementX: !locked,
            lockMovementY: !locked,
            lockScalingX: !locked,
            lockScalingY: !locked,
            lockRotation: !locked,
        });
        fabricRef.current?.renderAll();
        syncLayers();
    };
    
    const saveDesign = async () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        
        setSaving(true);
        try {
            const dataUrl = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 1 });
            const layoutJson = canvas.toJSON(['id', 'name']);
            
            const cookie = decodeURIComponent(document.cookie.split('XSRF-TOKEN=')[1]?.split(';')[0] ?? '');
            const res = await fetch(route('admin.products.save-design'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': cookie,
                },
                body: JSON.stringify({
                    image: dataUrl,
                    layout_json: layoutJson,
                    product_id: product.id,
                    type: product.type,
                    image_index: product.image_index,
                    variant_id: product.variant_id,
                }),
            });
            
            const json = await res.json();
            if (json.success) {
                setSaved(true);
                setTimeout(() => {
                    window.location.href = product.return_url;
                }, 600);
            } else {
                alert('Failed to save.');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to save.');
        } finally {
            setSaving(false);
        }
    };
    
    return (
        <div style={{ backgroundColor: T.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <div style={{ 
                height: 64, 
                padding: '0 24px', 
                borderBottom: `1px solid ${T.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: T.panel
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button
                        onClick={() => window.location.href = product.return_url}
                        style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: T.sub, 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: 16, fontWeight: 600, color: T.white, margin: 0 }}>
                            Product Designer
                        </h1>
                        <p style={{ fontSize: 12, color: T.muted, margin: 0 }}>
                            {product.name} - {product.type === 'variant_image' ? product.variant_name : 'Gallery Image'}
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            onClick={undoAction}
                            disabled={histIdx <= 0}
                            style={{
                                padding: '8px 12px',
                                backgroundColor: T.card,
                                border: `1px solid ${T.border}`,
                                borderRadius: 8,
                                color: T.sub,
                                cursor: histIdx <= 0 ? 'not-allowed' : 'pointer',
                                opacity: histIdx <= 0 ? 0.5 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6
                            }}
                        >
                            <Undo2 size={16} />
                        </button>
                        <button
                            onClick={redoAction}
                            disabled={histIdx >= history.length - 1}
                            style={{
                                padding: '8px 12px',
                                backgroundColor: T.card,
                                border: `1px solid ${T.border}`,
                                borderRadius: 8,
                                color: T.sub,
                                cursor: histIdx >= history.length - 1 ? 'not-allowed' : 'pointer',
                                opacity: histIdx >= history.length - 1 ? 0.5 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6
                            }}
                        >
                            <Redo2 size={16} />
                        </button>
                    </div>
                    <div style={{ width: 1, height: 16, backgroundColor: T.border }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 1, padding: '4px 8px', borderRadius: 8, backgroundColor: T.card, border: `1px solid ${T.border}` }}>
                        <button onClick={() => setZoom(z => Math.max(0.1, (z ?? 0.45) - 0.1))} style={{ background: 'none', border: 'none', color: T.sub, cursor: 'pointer', padding: 4 }}><Minus size={14} /></button>
                        <span style={{ fontSize: 11, color: T.white, fontWeight: 500, minWidth: 40, textAlign: 'center' }}>{Math.round((zoom ?? 1) * 100)}%</span>
                        <button onClick={() => setZoom(z => Math.min(2, (z ?? 0.45) + 0.1))} style={{ background: 'none', border: 'none', color: T.sub, cursor: 'pointer', padding: 4 }}><Plus size={14} /></button>
                    </div>
                    <button 
                        onClick={() => setShowGrid(g => !g)}
                        style={{
                            padding: '8px 12px',
                            backgroundColor: showGrid ? `${T.blue}25` : T.card,
                            border: `1px solid ${showGrid ? T.blue + '50' : T.border}`,
                            borderRadius: 8,
                            color: showGrid ? T.blue : T.sub,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                        }}
                    >
                        <Grid3X3 size={16} />
                    </button>
                    <button
                        onClick={saveDesign}
                        disabled={saving}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: saving ? T.card : T.blue,
                            color: T.white,
                            border: 'none',
                            borderRadius: 8,
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: saving ? 'not-allowed' : 'pointer',
                            opacity: saving ? 0.6 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}
                    >
                        {saving ? (
                            <>
                                <RefreshCw size={16} className="animate-spin" />
                                Saving...
                            </>
                        ) : saved ? (
                            <>
                                <Star size={16} />
                                Saved!
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Save Design
                            </>
                        )}
                    </button>
                </div>
            </div>
            
            {/* Body */}
            <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
                {/* Left icon rail */}
                <div style={{ 
                    width: 52, 
                    backgroundColor: T.panel, 
                    borderRight: `1px solid ${T.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '12px 0',
                    gap: 8
                }}>
                    {[
                        { id: 'layers', Icon: Layers, label: 'Layers' },
                        { id: 'shapes', Icon: Square, label: 'Shapes' },
                        { id: 'text-panel', Icon: Type, label: 'Text' },
                        { id: 'upload', Icon: Upload, label: 'Upload' },
                    ].map(({ id, Icon, label }) => (
                        <button
                            key={id}
                            onClick={() => setLeftPanel(id)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 4,
                                padding: 8,
                                borderRadius: 12,
                                backgroundColor: leftPanel === id ? `${T.blue}20` : 'transparent',
                                border: `1px solid ${leftPanel === id ? T.blue + '50' : 'transparent'}`,
                                cursor: 'pointer'
                            }}
                        >
                            <Icon size={16} style={{ color: leftPanel === id ? T.blue : T.sub }} />
                            <span style={{ fontSize: 8, color: leftPanel === id ? T.white : T.muted }}>{label}</span>
                        </button>
                    ))}
                </div>

                {/* Left panel */}
                <div style={{ 
                    width: 196, 
                    backgroundColor: T.panel, 
                    borderRight: `1px solid ${T.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    {leftPanel === 'layers' && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
                                <span style={{ fontSize: 12, fontWeight: 600, color: T.white }}>Layers</span>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    <button onClick={() => fileInputRef.current?.click()} title="Upload image" style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, backgroundColor: 'transparent', border: 'none', color: T.muted, cursor: 'pointer' }}><Upload size={14} /></button>
                                </div>
                            </div>
                            <div style={{ height: 1, backgroundColor: T.border }} />
                            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
                                {layers.length === 0 && <p style={{ fontSize: 10, textAlign: 'center', padding: '32px 0', color: T.muted }}>No layers yet.<br/>Upload an image to start.</p>}
                                {layers.map(layer => (
                                    <div
                                        key={layer.id}
                                        onClick={() => {
                                            fabricRef.current?.setActiveObject(layer.obj);
                                            fabricRef.current?.renderAll();
                                            readProps(layer.obj);
                                            setSelectedId(layer.id);
                                            setSelectedObj(layer.obj);
                                            setRightTab('props');
                                        }}
                                        style={{
                                            padding: '8px 10px',
                                            borderRadius: 8,
                                            cursor: 'pointer',
                                            backgroundColor: selectedId === layer.id ? `${T.blue}18` : 'transparent',
                                            border: `1px solid ${selectedId === layer.id ? T.blue + '40' : 'transparent'}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            marginBottom: 2
                                        }}
                                    >
                                        <div style={{ 
                                            width: 20, 
                                            height: 20, 
                                            borderRadius: 4, 
                                            backgroundColor: T.card2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {layer.type.includes('text') ? (
                                                <Type size={10} style={{ color: T.blue }} />
                                            ) : layer.type === 'image' ? (
                                                <Upload size={10} style={{ color: T.green }} />
                                            ) : (
                                                <Square size={10} style={{ color: T.sub }} />
                                            )}
                                        </div>
                                        <span style={{ fontSize: 10, color: selectedId === layer.id ? T.white : T.sub, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {layer.name}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <button onClick={e => { e.stopPropagation(); toggleVisibility(layer.obj); }} style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: 'transparent', border: 'none', color: T.muted, cursor: 'pointer' }}>{layer.visible ? <Eye size={10} /> : <EyeOff size={10} />}</button>
                                            <button onClick={e => { e.stopPropagation(); toggleLock(layer.obj); }} style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: 'transparent', border: 'none', color: T.muted, cursor: 'pointer' }}>{layer.locked ? <Lock size={10} /> : <Unlock size={10} />}</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ height: 1, backgroundColor: T.border }} />
                            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                {selectedId && <button onClick={deleteSelected} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, backgroundColor: 'transparent', border: 'none', color: T.red, cursor: 'pointer' }}><Trash2 size={12} /></button>}
                            </div>
                        </>
                    )}

                    {leftPanel === 'shapes' && (
                        <div style={{ padding: 16 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 600, color: T.white, marginBottom: 16 }}>Shapes</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                                {[
                                    { type: 'rect', label: 'Rectangle' },
                                    { type: 'circle', label: 'Circle' },
                                    { type: 'triangle', label: 'Triangle' },
                                    { type: 'ellipse', label: 'Ellipse' },
                                ].map(({ type, label }) => (
                                    <button
                                        key={type}
                                        onClick={() => addShape(type)}
                                        style={{
                                            padding: 12,
                                            backgroundColor: T.card,
                                            border: `1px solid ${T.border}`,
                                            borderRadius: 8,
                                            color: T.sub,
                                            fontSize: 11,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 8
                                        }}
                                    >
                                        <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, backgroundColor: T.card2 }}>
                                            {type === 'rect' && <Square size={16} style={{ color: fgColor }} />}
                                            {type === 'circle' && <Circle size={16} style={{ color: fgColor }} />}
                                            {type === 'triangle' && <Triangle size={16} style={{ color: fgColor }} />}
                                            {type === 'ellipse' && <Circle size={16} style={{ color: fgColor }} />}
                                        </div>
                                        <span style={{ fontSize: 9 }}>{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {leftPanel === 'text-panel' && (
                        <div style={{ padding: 16 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 600, color: T.white, marginBottom: 16 }}>Text</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {[
                                    { label: 'Heading', size: 36, weight: 'bold' },
                                    { label: 'Subheading', size: 24, weight: '600' },
                                    { label: 'Body', size: 16, weight: 'normal' },
                                    { label: 'Caption', size: 12, weight: 'normal' },
                                ].map(({ label, size, weight }) => (
                                    <button
                                        key={label}
                                        onClick={addText}
                                        style={{
                                            padding: 12,
                                            backgroundColor: T.card,
                                            border: `1px solid ${T.border}`,
                                            borderRadius: 8,
                                            color: T.white,
                                            fontSize: Math.max(9, size / 3),
                                            fontWeight: weight,
                                            cursor: 'pointer',
                                            textAlign: 'left'
                                        }}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {leftPanel === 'upload' && (
                        <div style={{ padding: 16 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 600, color: T.white, marginBottom: 16 }}>Upload Image</h3>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    width: '100%',
                                    padding: 24,
                                    backgroundColor: T.card,
                                    border: `2px dashed ${T.border}`,
                                    borderRadius: 12,
                                    color: T.sub,
                                    fontSize: 12,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 8
                                }}
                            >
                                <Upload size={24} />
                                <span>Click to upload</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Canvas area */}
                <div 
                    ref={canvasWrapRef}
                    style={{ 
                        flex: 1, 
                        overflow: 'hidden', 
                        backgroundColor: '#1a1a2e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {zoom !== null && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', width: '100%', height: '100%' }}>
                            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
                                <canvas 
                                    ref={canvasEl} 
                                    style={{ 
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                                        maxWidth: '100%',
                                        height: 'auto'
                                    }} 
                                />
                                {showGrid && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        pointerEvents: 'none',
                                        backgroundImage: `linear-gradient(${T.border}20 1px, transparent 1px), linear-gradient(90deg, ${T.border}20 1px, transparent 1px)`,
                                        backgroundSize: `${gridSize}px ${gridSize}px`
                                    }} />
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right panel */}
                <div style={{ 
                    width: 240, 
                    backgroundColor: T.panel, 
                    borderLeft: `1px solid ${T.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        borderBottom: `1px solid ${T.border}`,
                        padding: '12px'
                    }}>
                        {['props', 'layers'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setRightTab(tab)}
                                style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    backgroundColor: rightTab === tab ? `${T.blue}25` : 'transparent',
                                    color: rightTab === tab ? T.blue : T.sub,
                                    border: 'none',
                                    borderRadius: 8,
                                    fontSize: 12,
                                    fontWeight: 500,
                                    cursor: 'pointer'
                                }}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {rightTab === 'props' && selectedProp && (
                        <div style={{ padding: 16, overflowY: 'auto' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div>
                                    <label style={{ fontSize: 10, fontWeight: 600, color: T.muted, display: 'block', marginBottom: 4 }}>POSITION</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                                        <div>
                                            <input
                                                type="number"
                                                value={selectedProp.left}
                                                onChange={e => updateProp('left', parseInt(e.target.value))}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 10px',
                                                    backgroundColor: T.card2,
                                                    border: `1px solid ${T.border}`,
                                                    borderRadius: 6,
                                                    color: T.white,
                                                    fontSize: 11
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="number"
                                                value={selectedProp.top}
                                                onChange={e => updateProp('top', parseInt(e.target.value))}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 10px',
                                                    backgroundColor: T.card2,
                                                    border: `1px solid ${T.border}`,
                                                    borderRadius: 6,
                                                    color: T.white,
                                                    fontSize: 11
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: 10, fontWeight: 600, color: T.muted, display: 'block', marginBottom: 4 }}>SIZE</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                                        <div>
                                            <input
                                                type="number"
                                                value={selectedProp.width}
                                                onChange={e => updateProp('width', parseInt(e.target.value))}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 10px',
                                                    backgroundColor: T.card2,
                                                    border: `1px solid ${T.border}`,
                                                    borderRadius: 6,
                                                    color: T.white,
                                                    fontSize: 11
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="number"
                                                value={selectedProp.height}
                                                onChange={e => updateProp('height', parseInt(e.target.value))}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 10px',
                                                    backgroundColor: T.card2,
                                                    border: `1px solid ${T.border}`,
                                                    borderRadius: 6,
                                                    color: T.white,
                                                    fontSize: 11
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: 10, fontWeight: 600, color: T.muted, display: 'block', marginBottom: 4 }}>APPEARANCE</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={selectedProp.opacity}
                                                onChange={e => updateProp('opacity', parseInt(e.target.value))}
                                                style={{ flex: 1 }}
                                            />
                                            <span style={{ fontSize: 10, color: T.sub, minWidth: 30 }}>{selectedProp.opacity}%</span>
                                        </div>
                                        <div>
                                            <input
                                                type="number"
                                                value={selectedProp.angle}
                                                onChange={e => updateProp('angle', parseInt(e.target.value))}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 10px',
                                                    backgroundColor: T.card2,
                                                    border: `1px solid ${T.border}`,
                                                    borderRadius: 6,
                                                    color: T.white,
                                                    fontSize: 11
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <input type="checkbox" checked={selectedProp.shadow} onChange={e => updateProp('shadow', e.target.checked)} style={{ borderRadius: 4 }} />
                                            <label style={{ fontSize: 11, color: T.sub }}>Shadow</label>
                                        </div>
                                    </div>
                                </div>
                                
                                {(selectedProp.type === 'i-text' || selectedProp.type === 'text') && (
                                    <div>
                                        <label style={{ fontSize: 10, fontWeight: 600, color: T.muted, display: 'block', marginBottom: 4 }}>TEXT</label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <div>
                                                <select
                                                    value={selectedProp.fontFamily}
                                                    onChange={e => updateProp('fontFamily', e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '8px 10px',
                                                        backgroundColor: T.card2,
                                                        border: `1px solid ${T.border}`,
                                                        borderRadius: 6,
                                                        color: T.white,
                                                        fontSize: 11
                                                    }}
                                                >
                                                    {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <input
                                                    type="number"
                                                    value={selectedProp.fontSize}
                                                    onChange={e => updateProp('fontSize', parseInt(e.target.value))}
                                                    style={{
                                                        width: '100%',
                                                        padding: '8px 10px',
                                                        backgroundColor: T.card2,
                                                        border: `1px solid ${T.border}`,
                                                        borderRadius: 6,
                                                        color: T.white,
                                                        fontSize: 11
                                                    }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                {['left', 'center', 'right'].map(align => (
                                                    <button
                                                        key={align}
                                                        onClick={() => updateProp('textAlign', align)}
                                                        style={{
                                                            flex: 1,
                                                            padding: '8px',
                                                            backgroundColor: selectedProp.textAlign === align ? `${T.blue}30` : T.card2,
                                                            border: `1px solid ${T.border}`,
                                                            borderRadius: 6,
                                                            color: T.sub,
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        {align === 'left' && <span style={{ fontSize: 10 }}>L</span>}
                                                        {align === 'center' && <span style={{ fontSize: 10 }}>C</span>}
                                                        {align === 'right' && <span style={{ fontSize: 10 }}>R</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {selectedProp.fill && (
                                    <div>
                                        <label style={{ fontSize: 10, fontWeight: 600, color: T.muted, display: 'block', marginBottom: 4 }}>FILL COLOR</label>
                                        <div style={{ position: 'relative' }}>
                                            <button
                                                onClick={() => setShowFgPicker(!showFgPicker)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 10px',
                                                    backgroundColor: T.card2,
                                                    border: `1px solid ${T.border}`,
                                                    borderRadius: 6,
                                                    color: T.white,
                                                    fontSize: 11,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8
                                                }}
                                            >
                                                <div style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: selectedProp.fill, border: `1px solid ${T.border}` }} />
                                                <span>{selectedProp.fill}</span>
                                            </button>
                                            {showFgPicker && (
                                                <ColorPicker 
                                                    color={selectedProp.fill} 
                                                    onChange={v => { updateProp('fill', v); setFgColor(v); }}
                                                    onClose={() => setShowFgPicker(false)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {rightTab === 'props' && !selectedProp && (
                        <div style={{ 
                            padding: 32, 
                            textAlign: 'center',
                            color: T.muted,
                            fontSize: 12
                        }}>
                            Select an object to edit its properties
                        </div>
                    )}
                    
                    {rightTab === 'layers' && (
                        <div style={{ padding: 12, overflowY: 'auto' }}>
                            {layers.map(layer => (
                                <div
                                    key={layer.id}
                                    onClick={() => {
                                        fabricRef.current?.setActiveObject(layer.obj);
                                        fabricRef.current?.renderAll();
                                        readProps(layer.obj);
                                        setSelectedId(layer.id);
                                        setSelectedObj(layer.obj);
                                        setRightTab('props');
                                    }}
                                    style={{
                                        padding: '8px 10px',
                                        borderRadius: 6,
                                        cursor: 'pointer',
                                        backgroundColor: selectedId === layer.id ? `${T.blue}18` : 'transparent',
                                        border: `1px solid ${selectedId === layer.id ? T.blue + '40' : 'transparent'}`,
                                        marginBottom: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8
                                    }}
                                >
                                    <span style={{ fontSize: 10, color: selectedId === layer.id ? T.white : T.sub, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {layer.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Context menu */}
            {canvasCtxMenu && (
                <div style={{
                    position: 'fixed',
                    left: canvasCtxMenu.x,
                    top: canvasCtxMenu.y,
                    backgroundColor: T.panel,
                    border: `1px solid ${T.border}`,
                    borderRadius: 12,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    padding: 8,
                    zIndex: 50
                }}>
                    <button
                        onClick={() => { copyObject(); setCanvasCtxMenu(null); }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 16px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: 8,
                            color: T.sub,
                            fontSize: 12,
                            cursor: 'pointer',
                            width: '100%'
                        }}
                    >
                        <Copy size={14} />
                        Copy
                    </button>
                    <button
                        onClick={() => { deleteSelected(); setCanvasCtxMenu(null); }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 16px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: 8,
                            color: T.red,
                            fontSize: 12,
                            cursor: 'pointer',
                            width: '100%'
                        }}
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

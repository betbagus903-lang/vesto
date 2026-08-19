import { useEffect, useRef, useState, useCallback } from 'react';
import {
    ChevronLeft, Save, X, Undo2, Redo2, Upload, Type, Square,
    Circle, Image as ImageIcon, Eye, EyeOff, Lock, Unlock,
    Trash2, Plus, ChevronDown, AlignLeft, AlignCenter, AlignRight,
    Move, Crop, Minus, MousePointer, Star, RefreshCw, Copy,
    Palette, Layers, ArrowLeftRight, PaintBucket, Wand2, Grid3X3,
    ChevronRight, Check, Scissors,
} from 'lucide-react';

/* ── Tokens ─────────────────────────────────────────────────── */
const T = {
    bg:     '#090C14',
    panel:  '#111827',
    card2:  '#0d1421',
    border: 'rgba(255,255,255,0.07)',
    blue:   '#4F6BFF',
    purple: '#6C63FF',
    white:  '#FFFFFF',
    sub:    '#A8B3CF',
    muted:  '#55657D',
    danger: '#EF4444',
    green:  '#10B981',
};

/* ── Animation Presets ──────────────────────────────────────── */
const ANIMATION_PRESETS = {
    fade: {
        name: 'Fade In',
        keyframes: [
            { opacity: 0, offset: 0 },
            { opacity: 1, offset: 1 }
        ],
        duration: 1000,
        easing: 'ease-in-out'
    },
    slideLeft: {
        name: 'Slide from Left',
        keyframes: [
            { transform: 'translateX(-100%)', offset: 0 },
            { transform: 'translateX(0)', offset: 1 }
        ],
        duration: 800,
        easing: 'ease-out'
    },
    slideRight: {
        name: 'Slide from Right',
        keyframes: [
            { transform: 'translateX(100%)', offset: 0 },
            { transform: 'translateX(0)', offset: 1 }
        ],
        duration: 800,
        easing: 'ease-out'
    },
    slideUp: {
        name: 'Slide from Bottom',
        keyframes: [
            { transform: 'translateY(100%)', offset: 0 },
            { transform: 'translateY(0)', offset: 1 }
        ],
        duration: 800,
        easing: 'ease-out'
    },
    slideDown: {
        name: 'Slide from Top',
        keyframes: [
            { transform: 'translateY(-100%)', offset: 0 },
            { transform: 'translateY(0)', offset: 1 }
        ],
        duration: 800,
        easing: 'ease-out'
    },
    bounce: {
        name: 'Bounce In',
        keyframes: [
            { transform: 'scale(0)', offset: 0 },
            { transform: 'scale(1.1)', offset: 0.5 },
            { transform: 'scale(1)', offset: 1 }
        ],
        duration: 600,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },
    rotate: {
        name: 'Rotate In',
        keyframes: [
            { transform: 'rotate(-180deg) scale(0)', offset: 0 },
            { transform: 'rotate(0) scale(1)', offset: 1 }
        ],
        duration: 800,
        easing: 'ease-out'
    },
    scale: {
        name: 'Scale In',
        keyframes: [
            { transform: 'scale(0)', offset: 0 },
            { transform: 'scale(1)', offset: 1 }
        ],
        duration: 600,
        easing: 'ease-out'
    },
    positionSwap: {
        name: 'Position Swap',
        keyframes: [
            { transform: 'translateX(0)', offset: 0 },
            { transform: 'translateX(200px)', offset: 0.5 },
            { transform: 'translateX(0)', offset: 1 }
        ],
        duration: 2000,
        easing: 'ease-in-out'
    },
    parallax: {
        name: 'Parallax',
        keyframes: [
            { transform: 'translateY(0)', offset: 0 },
            { transform: 'translateY(-50px)', offset: 0.5 },
            { transform: 'translateY(0)', offset: 1 }
        ],
        duration: 3000,
        easing: 'ease-in-out'
    }
};

const EASING_OPTIONS = [
    { value: 'linear', label: 'Linear' },
    { value: 'ease', label: 'Ease' },
    { value: 'ease-in', label: 'Ease In' },
    { value: 'ease-out', label: 'Ease Out' },
    { value: 'ease-in-out', label: 'Ease In Out' },
    { value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', label: 'Bounce' },
    { value: 'cubic-bezier(0.4, 0, 0.2, 1)', label: 'Smooth' },
];

const CW = 1920; // default fallback only
const CH = 800;  // default fallback only
const SW   = 1400; // Will be calculated dynamically
const SH   = 600; // Will be calculated dynamically
const FONTS    = ['Arial','Poppins','Georgia','Times New Roman','Courier New',
                  'Montserrat','Raleway','Oswald','Roboto','Playfair Display'];
const BASE_COLORS = [
    '#000000','#FFFFFF','#F44336','#E91E63','#9C27B0','#673AB7',
    '#3F51B5','#2196F3','#03A9F4','#00BCD4','#009688','#4CAF50',
    '#8BC34A','#CDDC39','#FFEB3B','#FFC107','#FF9800','#FF5722',
    '#795548','#9E9E9E','#607D8B','#FF6B6B','#FFE66D','#4ECDC4',
    '#A8E6CF','#DCEDC1','#FFD3B6','#FFAAA5','#D4A5A5','#392F5A',
];

/* ── Fabric lazy loader ─────────────────────────────────────── */
let _fab = null;
async function getFabric() {
    if (_fab) return _fab;
    const m = await import('fabric');
    _fab = m.fabric ?? m.default ?? m;
    return _fab;
}

/* ── Color Picker ───────────────────────────────────────────── */
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

/* ── Main Designer Component ────────────────────────────────── */
export default function BannerDesigner({ returnUrl, initialImage, layoutJson, canvasWidth = 1920, canvasHeight = 800, bannerType = 'hero_slider', context = null }) {
    const canvasEl      = useRef(null);
    const canvasWrapRef = useRef(null);
    const fabricRef     = useRef(null);

    /* ── Use CW/CH throughout so canvas size comes from props ── */
    const CW = canvasWidth;
    const CH = canvasHeight;
    const SW = Math.floor(CW * 0.73);  // safe area width  (~1400 for 1920)
    const SH = Math.floor(CH * 0.75);  // safe area height (~600 for 800)
    const fileRef       = useRef(null);
    const activeToolRef = useRef('select');
    const fgColorRef    = useRef('#FFFFFF');
    const bgColorRef    = useRef('#000000');
    const drawOptsRef   = useRef({});
    const historyRef    = useRef([]);
    const histIdxRef    = useRef(-1);

    const [zoom,         setZoom]         = useState(null);
    const [activeTool,   setActiveTool]   = useState('select');
    const [layers,       setLayers]       = useState([]);
    const [selectedId,   setSelectedId]   = useState(null);
    const [selectedObj,  setSelectedObj]  = useState(null);
    const [selectedProp, setSelectedProp] = useState(null);
    const [saving,       setSaving]       = useState(false);
    const [saved,        setSaved]        = useState(false);
    const [history,      setHistory]      = useState([]);
    const [histIdx,      setHistIdx]      = useState(-1);
    const [rightTab,     setRightTab]     = useState('props');
    const [leftPanel,    setLeftPanel]    = useState('layers');
    const [showSafeArea, setShowSafeArea] = useState(true);
    const [showGrid,     setShowGrid]     = useState(false);
    const [gridSize,     setGridSize]     = useState(100);
    const [showShapeMenu,setShowShapeMenu]= useState(false);
    const [polygonSides, setPolygonSides] = useState(6);
    const [roundedRadius,setRoundedRadius]= useState(24);
    const shapeMenuRef  = useRef(null);
    const [fgColor,      setFgColor]      = useState('#FFFFFF');
    const [bgColor,      setBgColor]      = useState('#000000');
    const [showFgPicker, setShowFgPicker] = useState(false);
    const [showBgPicker, setShowBgPicker] = useState(false);
    const [canvasCtxMenu,setCanvasCtxMenu]= useState(null);
    const copiedObjectRef = useRef(null);
    const [cropMode, setCropMode] = useState(false);
    const [cropRect, setCropRect] = useState(null);
    const replaceImageInputRef = useRef(null);
    
    /* ── Animation State ────────────────────────────────────── */
    const [showAnimationPanel, setShowAnimationPanel] = useState(false);
    const [animations, setAnimations] = useState([]);
    const [selectedAnimation, setSelectedAnimation] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(5000);
    const animationRef = useRef(null);

    /* ── init fabric ── */
    useEffect(() => {
        let canvas;
        (async () => {
            const fabric = await getFabric();
            canvas = new fabric.Canvas(canvasEl.current, {
                width: canvasWidth, height: canvasHeight,
                backgroundColor: '#f5f0ea',
                preserveObjectStacking: true,
                perPixelTargetFind: true,
                targetFindTolerance: 0,
                selection: false,
                selectionColor: 'rgba(79, 107, 255, 0.1)',
                selectionBorderColor: '#4F6BFF',
                selectionLineWidth: 1,
            });
            
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
                // Enable all control handles: corners + edges
                setControlVisible: function(control, visible) {
                    this.set(control + 'Visible', visible);
                    return this;
                },
            });
            
            // Enable all control handles for easier resizing
            fabric.Object.prototype.set({
                tl: true, // top-left
                tr: true, // top-right
                bl: true, // bottom-left
                br: true, // bottom-right
                mt: true, // middle-top
                mb: true, // middle-bottom
                ml: true, // middle-left
                mr: true, // middle-right
                mtr: true, // rotation handle
            });
            
            // Customize circle/ellipse with edge handles for easier resizing
            fabric.Circle.prototype.set({ 
                padding: 5, 
                strokeWidth: 0, 
                objectCaching: false, 
                hasBorders: true,
                hasControls: true,
                cornerSize: 8,
                transparentCorners: false,
                cornerColor: '#4F6BFF',
                cornerStrokeColor: '#ffffff',
                borderColor: '#4F6BFF',
                tl: true, tr: true, bl: true, br: true,
                mt: true, mb: true, ml: true, mr: true,
                mtr: true,
            });
            fabric.Ellipse.prototype.set({ 
                padding: 5, 
                strokeWidth: 0, 
                objectCaching: false, 
                hasBorders: true,
                hasControls: true,
                cornerSize: 8,
                transparentCorners: false,
                cornerColor: '#4F6BFF',
                cornerStrokeColor: '#ffffff',
                borderColor: '#4F6BFF',
                tl: true, tr: true, bl: true, br: true,
                mt: true, mb: true, ml: true, mr: true,
                mtr: true,
            });
            
            // Also customize triangle and polygon with edge handles
            fabric.Triangle.prototype.set({ 
                padding: 5, 
                strokeWidth: 0, 
                objectCaching: false, 
                hasBorders: true,
                hasControls: true,
                cornerSize: 8,
                transparentCorners: false,
                cornerColor: '#4F6BFF',
                cornerStrokeColor: '#ffffff',
                borderColor: '#4F6BFF',
                tl: true, tr: true, bl: true, br: true,
                mt: true, mb: true, ml: true, mr: true,
                mtr: true,
            });
            fabric.Polygon.prototype.set({ 
                padding: 5, 
                strokeWidth: 0, 
                objectCaching: false, 
                hasBorders: true,
                hasControls: true,
                cornerSize: 8,
                transparentCorners: false,
                cornerColor: '#4F6BFF',
                cornerStrokeColor: '#ffffff',
                borderColor: '#4F6BFF',
                tl: true, tr: true, bl: true, br: true,
                mt: true, mb: true, ml: true, mr: true,
                mtr: true,
            });
            fabricRef.current = canvas;

            console.log('Designer initialImage:', initialImage);
            console.log('Designer layoutJson:', layoutJson);
            
            // Normalize image path - handle relative paths from database
            const normalizedImage = initialImage ? (initialImage.startsWith('http') ? initialImage : `/storage/${initialImage}`) : null;
            
            if (normalizedImage) {
                console.log('Loading initial image:', normalizedImage);
                fabric.Image.fromURL(normalizedImage, img => {
                    console.log('Image loaded successfully');
                    img.set({ left:0, top:0, id:'bg-image', name:'Background Image' });
                    img.scaleToWidth(CW);
                    canvas.add(img); canvas.sendToBack(img);
                    syncLayers(canvas); pushHistory(canvas);
                }, { crossOrigin: 'anonymous' });
            }
            if (layoutJson) {
                console.log('Loading layout JSON');
                canvas.loadFromJSON(layoutJson, () => { canvas.renderAll(); syncLayers(canvas); });
            }

            drawSafeArea(canvas, fabric);

            canvas.on('selection:created', e => onSelect(e));
            canvas.on('selection:updated', e => onSelect(e));
            canvas.on('selection:cleared', () => { setSelectedId(null); setSelectedObj(null); setSelectedProp(null); });
            canvas.on('object:modified',   () => { syncLayers(canvas); pushHistory(canvas); });
            canvas.on('object:added',      () => { syncLayers(canvas); pushHistory(canvas); });
            canvas.on('object:removed',    () => { syncLayers(canvas); pushHistory(canvas); });

            /* right-click */
            canvas.on('mouse:down', (opt) => {
                if (opt.e.button === 2) {
                    opt.e.preventDefault();
                    const obj = opt.target;
                    if (obj && obj.id !== '__safe__') {
                        canvas.setActiveObject(obj); canvas.renderAll();
                        setCanvasCtxMenu({ x: opt.e.clientX, y: opt.e.clientY, objId: obj.id });
                    }
                    return;
                }
                handleMouseDown(opt, canvas, fabric);
            });
            canvas.on('mouse:move', (opt) => handleMouseMove(opt, canvas));
            canvas.on('mouse:up',   (opt) => handleMouseUp(opt, canvas, fabric));
            canvas.on('path:created', (e) => {
                if (activeToolRef.current === 'custom') {
                    canvas.isDrawingMode = false;
                    e.path?.set({ id: `path-${Date.now()}`, name: 'Custom Shape' });
                    setActiveTool('select'); activeToolRef.current = 'select';
                    canvas.renderAll();
                }
            });
        })();
        return () => canvas?.dispose();
    }, []);

    /* ── draw state for interactive shapes ── */
    const drawState = useRef({ active:false, startX:0, startY:0, obj:null, type:null });

    const handleMouseDown = (opt, canvas, fabric) => {
        const tool = activeToolRef.current;
        if (tool === 'bucket') {
            const t = opt.target;
            if (!t || t.id === '__safe__') canvas.setBackgroundColor(fgColorRef.current, canvas.renderAll.bind(canvas));
            else if (t.type !== 'image') { t.set({ fill: fgColorRef.current }); canvas.renderAll(); }
            return;
        }
        if (tool === 'wand') {
            const t = opt.target;
            if (!t || t.id === '__safe__') return;
            
            console.log('Magic wand clicked on:', t.type, t.fill, t.stroke);
            
            // Get the clicked object's properties for matching
            const targetFill = t.fill;
            const targetStroke = t.stroke;
            const targetStrokeWidth = t.strokeWidth;
            
            // Find all objects with similar properties
            const matching = canvas.getObjects().filter(o => {
                if (o.id === '__safe__') return false;
                if (o.type === 'image') return false;
                
                console.log('Checking object:', o.type, o.fill, o.stroke);
                
                // Match by fill color (handle both string and pattern)
                const fillMatch = targetFill && o.fill === targetFill;
                // Match by stroke color and width
                const strokeMatch = targetStroke && o.stroke === targetStroke && o.strokeWidth === targetStrokeWidth;
                
                return fillMatch || strokeMatch;
            });
            
            console.log('Found matching objects:', matching.length);
            
            if (matching.length === 0) {
                canvas.setActiveObject(t);
            } else if (matching.length === 1) {
                canvas.setActiveObject(matching[0]);
            } else {
                canvas.setActiveObject(new fabric.ActiveSelection(matching, { canvas }));
            }
            canvas.renderAll();
            return;
        }
        if (tool === 'crop') {
            console.log('Crop tool activated');
            if (!cropMode) {
                setCropMode(true);
                const p = canvas.getPointer(opt.e);
                setCropRect({ x: p.x, y: p.y, width: 0, height: 0 });
                console.log('Crop mode started at:', p.x, p.y);
            }
            return;
        }
        const drawShapes = ['rect','rounded-rect','ellipse','circle','triangle','polygon','star','line','arrow'];
        if (drawShapes.includes(tool)) {
            canvas.selection = false;
            const p = canvas.getPointer(opt.e);
            drawState.current = { active:true, startX:p.x, startY:p.y, obj:null, type:tool };
            const common = { left:p.x, top:p.y, fill:fgColorRef.current, stroke:'transparent', strokeWidth:0, selectable:false, evented:false, id:'__drawing__', name:tool+' Shape', padding: 0 };
            let obj = null;
            if (tool==='rect')         obj = new fabric.Rect({...common, width:1, height:1});
            if (tool==='rounded-rect') obj = new fabric.Rect({...common, width:1, height:1, rx:drawOptsRef.current.radius??24, ry:drawOptsRef.current.radius??24});
            if (tool==='ellipse')      obj = new fabric.Ellipse({...common, rx:1, ry:1});
            if (tool==='circle')       obj = new fabric.Ellipse({...common, rx:1, ry:1});
            if (tool==='triangle')     obj = new fabric.Triangle({...common, width:1, height:1});
            if (tool==='line')         obj = new fabric.Line([p.x,p.y,p.x,p.y],{stroke:fgColorRef.current, strokeWidth:4, fill:'', selectable:false, evented:false, id:'__drawing__', name:'Line Shape', padding: 0});
            if (tool==='polygon'||tool==='star') obj = new fabric.Circle({...common, fill:'transparent', stroke:fgColorRef.current, strokeWidth:2, radius:1, padding: 0});
            if (tool==='arrow') obj = new fabric.Rect({...common, width:1, height:20, padding: 0});
            if (obj) { canvas.add(obj); drawState.current.obj = obj; canvas.renderAll(); }
        }
    };

    const handleMouseMove = (opt, canvas) => {
        const ds = drawState.current;
        if (cropMode && cropRect) {
            const p = canvas.getPointer(opt.e);
            setCropRect(prev => ({
                ...prev,
                width: p.x - prev.x,
                height: p.y - prev.y
            }));
            console.log('Crop rect updating:', cropRect);
            return;
        }
        if (!ds.active || !ds.obj) return;
        const p = canvas.getPointer(opt.e);
        const w = p.x - ds.startX, h = p.y - ds.startY;
        const tool = ds.type;
        if (tool==='line') { ds.obj.set({ x2:p.x, y2:p.y }); }
        else if (tool==='ellipse') { ds.obj.set({ left:Math.min(ds.startX,p.x), top:Math.min(ds.startY,p.y), rx:Math.abs(w)/2, ry:Math.abs(h)/2 }); }
        else if (tool==='circle') { const r=Math.max(Math.abs(w),Math.abs(h))/2; ds.obj.set({ left:Math.min(ds.startX,p.x), top:Math.min(ds.startY,p.y), rx:r, ry:r }); }
        else if (tool==='polygon'||tool==='star') { ds.obj.set({ radius:Math.sqrt(w*w+h*h) }); }
        else { ds.obj.set({ left:w<0?p.x:ds.startX, top:h<0?p.y:ds.startY, width:Math.abs(w), height:Math.abs(h) }); }
        canvas.renderAll();
    };

    const handleMouseUp = async (opt, canvas, fabric) => {
        if (cropMode && cropRect) {
            console.log('Crop mouse up, applying crop');
            setCropMode(false);
            // Apply crop to selected image or canvas
            const active = canvas.getActiveObject();
            console.log('Active object for crop:', active?.type);
            
            if (active && active.type === 'image') {
                const { x, y, width, height } = cropRect;
                const absX = Math.min(x, x + width);
                const absY = Math.min(y, y + height);
                const absW = Math.abs(width);
                const absH = Math.abs(height);
                
                console.log('Crop dimensions:', absX, absY, absW, absH);
                
                if (absW > 10 && absH > 10) {
                    // Crop the image
                    const img = active;
                    const scaleX = img.scaleX;
                    const scaleY = img.scaleY;
                    
                    // Calculate crop coordinates relative to the image
                    const cropX = (absX - img.left) / scaleX;
                    const cropY = (absY - img.top) / scaleY;
                    const cropW = absW / scaleX;
                    const cropH = absH / scaleY;
                    
                    console.log('Relative crop coords:', cropX, cropY, cropW, cropH);
                    
                    // Create a new cropped image
                    const croppedImg = await new Promise(resolve => {
                        fabric.Image.fromURL(img.toDataURL(), cropped => {
                            cropped.set({
                                left: absX,
                                top: absY,
                                scaleX: scaleX,
                                scaleY: scaleY,
                                id: img.id,
                                name: img.name
                            });
                            resolve(cropped);
                        }, { crossOrigin: 'anonymous' });
                    });
                    
                    canvas.remove(img);
                    canvas.add(croppedImg);
                    canvas.setActiveObject(croppedImg);
                    canvas.renderAll();
                    syncLayers(canvas);
                    pushHistory(canvas);
                    console.log('Crop applied successfully');
                } else {
                    console.log('Crop area too small');
                }
            } else {
                console.log('No image selected for crop');
            }
            setCropRect(null);
            setActiveTool('select');
            activeToolRef.current = 'select';
            return;
        }
        const ds = drawState.current;
        if (!ds.active) return;
        ds.active = false;
        canvas.selection = true;
        const p = canvas.getPointer(opt.e);
        const w = Math.abs(p.x-ds.startX), h = Math.abs(p.y-ds.startY);
        if (ds.obj) { canvas.remove(ds.obj); ds.obj = null; }
        if (w < 5 && h < 5) return;

        const tool = ds.type;
        const id   = `shape-${Date.now()}`;
        const l    = p.x<ds.startX?p.x:ds.startX, t=p.y<ds.startY?p.y:ds.startY;
        const opts = drawOptsRef.current;
        const common = { left:l, top:t, fill:fgColorRef.current, stroke:'transparent', strokeWidth:0, id, name:tool+' Shape', padding: 0 };
        let final = null;
        if (tool==='rect')         final = new fabric.Rect({...common, width:w, height:h});
        if (tool==='rounded-rect') final = new fabric.Rect({...common, width:w, height:h, rx:opts.radius??24, ry:opts.radius??24});
        if (tool==='ellipse')      final = new fabric.Ellipse({...common, rx:w/2, ry:h/2});
        if (tool==='circle')       { const r=Math.max(w,h)/2; final=new fabric.Circle({...common, radius:r}); }
        if (tool==='triangle')     final = new fabric.Triangle({...common, width:w, height:h});
        if (tool==='arrow')        final = new fabric.Rect({...common, width:w, height:Math.max(h,20)});
        if (tool==='line')         final = new fabric.Line([ds.startX,ds.startY,p.x,p.y],{stroke:fgColorRef.current, strokeWidth:4, fill:'', id, name:'Line Shape', padding: 0});
        if (tool==='polygon') {
            const sides=opts.sides??6, r=Math.sqrt(w*w+h*h);
            const pts = Array.from({length:sides},(_,i)=>({x:r*Math.cos(i*2*Math.PI/sides-Math.PI/2),y:r*Math.sin(i*2*Math.PI/sides-Math.PI/2)}));
            final = new fabric.Polygon(pts,{...common, left:ds.startX, top:ds.startY, padding: 0});
        }
        if (tool==='star') {
            const r=Math.sqrt(w*w+h*h), inner=r*0.45, pts=5;
            const points=Array.from({length:pts*2},(_,i)=>{const a=i*Math.PI/pts-Math.PI/2, rad=i%2===0?r:inner; return {x:rad*Math.cos(a),y:rad*Math.sin(a)};});
            final = new fabric.Polygon(points,{...common, left:ds.startX, top:ds.startY, padding: 0});
        }
        if (final) { canvas.add(final); canvas.setActiveObject(final); canvas.renderAll(); setActiveTool('select'); activeToolRef.current='select'; }
    };

    /* ── helpers ── */
    const drawSafeArea = (canvas, fabric) => {
        canvas.getObjects().filter(o=>o.id==='__safe__').forEach(o=>canvas.remove(o));
        const r = new fabric.Rect({ left:(CW-SW)/2, top:(CH-SH)/2, width:SW, height:SH, fill:'transparent', stroke:'#4F6BFF', strokeWidth:2, strokeDashArray:[10,6], selectable:false, evented:false, id:'__safe__', name:'__safe__' });
        canvas.add(r); canvas.bringToFront(r);
    };

    const syncLayers = useCallback((c) => {
        const canvas = c || fabricRef.current;
        if (!canvas) return;
        setLayers(canvas.getObjects().filter(o=>o.id!=='__safe__').reverse().map((o,i)=>({ id:o.id||`obj-${i}`, name:o.name||o.type||'Layer', type:o.type, visible:o.visible!==false, locked:!!o.lockMovementX, obj:o })));
    }, []);

    const onSelect = (e) => {
        const obj = e.selected?.[0];
        if (!obj || obj.id==='__safe__') return;
        setSelectedId(obj.id); setSelectedObj(obj); readProps(obj);
    };

    const readProps = (obj) => {
        if (!obj) return;
        setSelectedProp({ type:obj.type, left:Math.round(obj.left??0), top:Math.round(obj.top??0), width:Math.round(obj.getScaledWidth?.()??obj.width??0), height:Math.round(obj.getScaledHeight?.()??obj.height??0), opacity:Math.round((obj.opacity??1)*100), fill:typeof obj.fill==='string'?obj.fill:'#000000', fontSize:obj.fontSize??48, fontFamily:obj.fontFamily??'Arial', fontWeight:obj.fontWeight??'normal', textAlign:obj.textAlign??'left', charSpacing:obj.charSpacing??0, lineHeight:obj.lineHeight??1.2, angle:Math.round(obj.angle??0), shadow:!!obj.shadow });
    };

    const updateProp = (key, val) => {
        const canvas = fabricRef.current; const obj = canvas?.getActiveObject();
        if (!obj) return;
        if (key==='opacity') obj.set({ opacity:val/100 });
        else if (key==='width')  obj.set({ scaleX:val/(obj.width??1) });
        else if (key==='height') obj.set({ scaleY:val/(obj.height??1) });
        else if (key==='shadow') obj.set({ shadow:val?{color:'rgba(0,0,0,0.4)',blur:8,offsetX:2,offsetY:2}:null });
        else obj.set({ [key]:val });
        canvas.renderAll(); readProps(obj);
    };

    const pushHistory = (c) => {
        const canvas = c || fabricRef.current; if (!canvas) return;
        const json = JSON.stringify(canvas.toJSON(['id','name']));
        const trimmed = historyRef.current.slice(0, histIdxRef.current+1);
        const next = [...trimmed, json].slice(-60);
        historyRef.current = next; histIdxRef.current = next.length-1;
        setHistory([...next]); setHistIdx(next.length-1);
    };

    const undoAction = useCallback(() => {
        const canvas = fabricRef.current; if (!canvas||histIdxRef.current<=0) return;
        const ni = histIdxRef.current-1;
        canvas.loadFromJSON(historyRef.current[ni], ()=>{ canvas.renderAll(); syncLayers(canvas); });
        histIdxRef.current=ni; setHistIdx(ni);
    }, []);

    const redoAction = useCallback(() => {
        const canvas = fabricRef.current; if (!canvas||histIdxRef.current>=historyRef.current.length-1) return;
        const ni = histIdxRef.current+1;
        canvas.loadFromJSON(historyRef.current[ni], ()=>{ canvas.renderAll(); syncLayers(canvas); });
        histIdxRef.current=ni; setHistIdx(ni);
    }, []);

    /* ── auto-fit zoom ── */
    useEffect(() => {
        const calc = () => { const w=canvasWrapRef.current; if(!w)return; setZoom(p=>p===null?Math.min((w.clientWidth-80)/CW,(w.clientHeight-80)/CH,1):p); };
        const t = setTimeout(calc,150); window.addEventListener('resize',calc);
        return ()=>{ clearTimeout(t); window.removeEventListener('resize',calc); };
    }, []);

    useEffect(() => { if(zoom!==null)return; const w=canvasWrapRef.current; if(!w)return; setZoom(Math.min((w.clientWidth-80)/CW,(w.clientHeight-80)/CH,1)); }, [zoom]);

    /* ── refs sync ── */
    useEffect(()=>{ fgColorRef.current=fgColor; },[fgColor]);
    useEffect(()=>{ bgColorRef.current=bgColor; },[bgColor]);
    useEffect(()=>{ drawOptsRef.current={sides:polygonSides,radius:roundedRadius}; },[polygonSides,roundedRadius]);

    /* ── canvas cursor ── */
    useEffect(()=>{
        const canvas=fabricRef.current; if(!canvas)return;
        activeToolRef.current=activeTool;
        const drawShapes=['rect','rounded-rect','ellipse','circle','triangle','polygon','star','line','arrow'];
        if(drawShapes.includes(activeTool)){ canvas.defaultCursor='crosshair'; canvas.hoverCursor='crosshair'; canvas.isDrawingMode=false; canvas.selection=false; }
        else if(activeTool==='bucket'){ canvas.defaultCursor='cell'; canvas.hoverCursor='cell'; canvas.isDrawingMode=false; canvas.selection=false; }
        else if(activeTool==='wand'){ canvas.defaultCursor='crosshair'; canvas.hoverCursor='crosshair'; canvas.isDrawingMode=false; canvas.selection=false; }
        else if(activeTool==='crop'){ canvas.defaultCursor='crosshair'; canvas.hoverCursor='crosshair'; canvas.isDrawingMode=false; canvas.selection=false; }
        else if(activeTool==='custom'){ canvas.isDrawingMode=true; if(canvas.freeDrawingBrush){canvas.freeDrawingBrush.color=fgColorRef.current; canvas.freeDrawingBrush.width=4;} }
        else{ canvas.defaultCursor='default'; canvas.hoverCursor='move'; canvas.isDrawingMode=false; canvas.selection=true; }
    },[activeTool]);

    /* ── keyboard ── */
    useEffect(()=>{
        document.title='Edit Banner Design — VESTO';
        const wrap=canvasWrapRef.current;
        const onWheel=e=>{ if(!e.ctrlKey&&!e.metaKey)return; e.preventDefault(); setZoom(z=>Math.min(2,Math.max(0.1,(z??0.45)+(e.deltaY>0?-0.05:0.05)))); };
        const onKey=e=>{
            const ctrl=e.ctrlKey||e.metaKey;
            const tag=document.activeElement?.tagName;
            const inInput=tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT';
            if(ctrl){
                if(e.key==='='||e.key==='+'){ e.preventDefault(); setZoom(z=>Math.min(2,(z??0.45)+0.1)); return; }
                if(e.key==='-'){ e.preventDefault(); setZoom(z=>Math.max(0.1,(z??0.45)-0.1)); return; }
                if(e.key==='0'){ e.preventDefault(); setZoom(null); return; }
                if(e.key==='g'&&!inInput){ e.preventDefault(); setShowGrid(g=>!g); return; }
                if(e.key==='z'&&!e.shiftKey&&!inInput){ e.preventDefault(); const c=fabricRef.current; if(c&&histIdxRef.current>0){const ni=histIdxRef.current-1; c.loadFromJSON(historyRef.current[ni],()=>{c.renderAll();}); histIdxRef.current=ni; setHistIdx(ni);} return; }
                if((e.key==='z'&&e.shiftKey)||e.key==='y'){ e.preventDefault(); const c=fabricRef.current; if(c&&histIdxRef.current<historyRef.current.length-1){const ni=histIdxRef.current+1; c.loadFromJSON(historyRef.current[ni],()=>{c.renderAll();}); histIdxRef.current=ni; setHistIdx(ni);} return; }
                if(e.key==='d'&&!inInput){ e.preventDefault(); duplicateSelected(); return; }
                if(e.key==='c'&&!inInput){ e.preventDefault(); copyObject(); return; }
                if(e.key==='v'&&!inInput){ e.preventDefault(); pasteObject(); return; }
                if(e.key==='x'&&!inInput){ e.preventDefault(); swapColors(); return; }
            }
            if((e.key==='Delete'||e.key==='Backspace')&&!inInput) deleteSelected();
            if(e.key==='Escape'){ setActiveTool('select'); activeToolRef.current='select'; setCanvasCtxMenu(null); }
        };
        wrap?.addEventListener('wheel',onWheel,{passive:false});
        window.addEventListener('keydown',onKey);
        return ()=>{ wrap?.removeEventListener('wheel',onWheel); window.removeEventListener('keydown',onKey); };
    },[]);

    /* ── close menus ── */
    useEffect(()=>{
        const h=(e)=>{ if(e.button!==2) setCanvasCtxMenu(null); if(shapeMenuRef.current&&!shapeMenuRef.current.contains(e.target)) setShowShapeMenu(false); };
        window.addEventListener('mousedown',h); return ()=>window.removeEventListener('mousedown',h);
    },[]);

    const swapColors = useCallback(() => {
        const fg=fgColorRef.current, bg=bgColorRef.current;
        setFgColor(bg); setBgColor(fg); fgColorRef.current=bg; bgColorRef.current=fg;
    }, []);

    const addText = async () => {
        const fabric = await getFabric(); const canvas = fabricRef.current;
        const id=`text-${Date.now()}`;
        const txt = new fabric.IText('Edit this text', { left:CW/2, top:CH/2, originX:'center', originY:'center', fontSize:60, fontFamily:'Arial', fill:fgColorRef.current, fontWeight:'bold', id, name:`Text ${layers.filter(l=>l.type==='i-text').length+1}`, shadow:new fabric.Shadow({color:'rgba(0,0,0,0.3)',blur:6,offsetX:2,offsetY:2}), padding: 0 });
        canvas.add(txt); canvas.setActiveObject(txt); canvas.renderAll(); setActiveTool('select');
    };

    const addShape = (shape, options={}) => {
        drawOptsRef.current = {...drawOptsRef.current, ...options};
        setActiveTool(shape); activeToolRef.current = shape;
    };

    const addGradientOverlay = async () => {
        const fabric = await getFabric(); const canvas = fabricRef.current;
        const id=`overlay-${Date.now()}`;
        const rect = new fabric.Rect({ left:0, top:0, width:CW, height:CH, fill:new fabric.Gradient({type:'linear',coords:{x1:0,y1:0,x2:CW,y2:0},colorStops:[{offset:0,color:'rgba(0,0,0,0.75)'},{offset:1,color:'rgba(0,0,0,0)'}]}), id, name:'Gradient Overlay', opacity:0.9, padding: 0 });
        canvas.add(rect); canvas.setActiveObject(rect); canvas.renderAll(); setActiveTool('select');
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]; if (!file) return;
        const fabric = await getFabric(); const canvas = fabricRef.current;
        const url = URL.createObjectURL(file);
        const active = canvas?.getActiveObject();
        fabric.Image.fromURL(url, img => {
            if (active && active.id !== '__safe__') {
                const {id,name,left,top} = active;
                canvas.remove(active);
                img.set({left,top,originX:'center',originY:'center',id,name});
                img.scaleToWidth(active.getScaledWidth?.()??active.width??400);
            } else {
                img.set({left:CW/2,top:CH/2,originX:'center',originY:'center',id:`img-${Date.now()}`,name:`Image ${layers.filter(l=>l.type==='image').length+1}`});
                img.scaleToWidth(CW*0.5);
            }
            canvas.add(img); canvas.setActiveObject(img); canvas.renderAll();
        }, { crossOrigin:'anonymous' });
        e.target.value=''; setActiveTool('select');
    };

    const bucketFill = () => {
        const canvas=fabricRef.current; const obj=canvas?.getActiveObject();
        if (!obj||obj.id==='__safe__'||obj.type==='image') return;
        obj.set({fill:fgColorRef.current}); canvas.renderAll();
        setSelectedProp(p=>p?{...p,fill:fgColorRef.current}:p);
    };

    const deleteSelected = () => {
        const canvas=fabricRef.current; const obj=canvas?.getActiveObject();
        if (!obj||obj.id==='__safe__') return;
        canvas.remove(obj); canvas.renderAll();
        setSelectedId(null); setSelectedObj(null); setSelectedProp(null);
    };

    const duplicateSelected = () => {
        const canvas=fabricRef.current; const obj=canvas?.getActiveObject();
        if (!obj) return;
        obj.clone(cloned=>{ cloned.set({left:(obj.left??0)+24,top:(obj.top??0)+24,id:`clone-${Date.now()}`,name:`${obj.name??'Layer'} copy`}); canvas.add(cloned); canvas.setActiveObject(cloned); canvas.renderAll(); });
    };

    const copyObject = useCallback(() => {
        const canvas=fabricRef.current; const obj=canvas?.getActiveObject();
        if (!obj||obj.id==='__safe__') return;
        obj.clone(cloned=>{ copiedObjectRef.current={fabricJSON:cloned.toJSON(['id','name']),left:obj.left,top:obj.top}; });
    }, []);

    const pasteObject = useCallback(async () => {
        if (!copiedObjectRef.current) return;
        const fabric=await getFabric(); const canvas=fabricRef.current;
        const {fabricJSON,left,top} = copiedObjectRef.current;
        fabric.util.enlivenObjects([fabricJSON], objs=>{
            const obj=objs[0]; if(!obj) return;
            obj.set({left,top,id:`paste-${Date.now()}`,name:fabricJSON.name||'Pasted Object'});
            canvas.add(obj); canvas.setActiveObject(obj); canvas.renderAll(); syncLayers(canvas);
        });
    }, []);

    const setCanvasBg = (color) => { const c=fabricRef.current; c?.setBackgroundColor(color, c.renderAll.bind(c)); };

    const toggleVisibility = obj => { obj.set('visible',!obj.visible); fabricRef.current?.renderAll(); syncLayers(); };
    const toggleLock = obj => { const l=obj.lockMovementX; obj.set({lockMovementX:!l,lockMovementY:!l,lockScalingX:!l,lockScalingY:!l,lockRotation:!l}); fabricRef.current?.renderAll(); syncLayers(); };

    const addEmptyLayer = async () => {
        const fabric=await getFabric(); const canvas=fabricRef.current;
        const id=`layer-${Date.now()}`;
        const rect=new fabric.Rect({left:CW/2,top:CH/2,originX:'center',originY:'center',width:400,height:300,fill:'rgba(255,255,255,0)',stroke:'rgba(255,255,255,0.3)',strokeWidth:1,strokeDashArray:[6,4],id,name:`Layer ${layers.length+1}`,padding: 0});
        canvas.add(rect); canvas.setActiveObject(rect); canvas.renderAll(); setSelectedId(id);
    };

    const saveDesign = async () => {
        const canvas=fabricRef.current; if(!canvas) return;
        setSaving(true);
        try {
            const safe=canvas.getObjects().find(o=>o.id==='__safe__');
            if(safe) safe.set('visible',false);
            canvas.renderAll();
            const dataUrl=canvas.toDataURL({format:'png',quality:1,multiplier:1,width:CW,height:CH});
            const layoutJ=canvas.toJSON(['id','name']);
            if(layoutJ.objects) layoutJ.objects=layoutJ.objects.filter(o=>o.id!=='__safe__'&&o.name!=='__safe__');
            if(safe) safe.set('visible',true);
            canvas.renderAll();
            
            const cookie=decodeURIComponent(document.cookie.split('XSRF-TOKEN=')[1]?.split(';')[0]??'');
            
            // Determine save endpoint and payload based on context
            let saveRoute, payload;
            if (context?.type === 'product_image' || context?.type === 'product_variant') {
                // Product designer
                saveRoute = route('admin.products.save-design');
                payload = {
                    image: dataUrl,
                    layout_json: layoutJ,
                    product_id: context.productId,
                    type: context.type,
                    image_index: context.imageIndex,
                    variant_id: context.variantId, // for variant images
                };
            } else {
                // Banner designer (default)
                saveRoute = route('admin.cms.banners.save-design');
                payload = { image: dataUrl, layout_json: layoutJ };
            }
            
            const res=await fetch(saveRoute,{method:'POST',headers:{'Content-Type':'application/json','X-XSRF-TOKEN':cookie},body:JSON.stringify(payload)});
            const json=await res.json();
            if(json.success){
                setSaved(true);
                console.log('Designer save success, context:', context);
                // For variant images, notify parent window with image data
                if (context?.type === 'variant_image') {
                    const messageData = { 
                        type: 'VARIANT_IMAGE_DESIGNED', 
                        variantId: context.variantId,
                        imageUrl: json.url,
                        imagePath: json.path,
                    };
                    console.log('Sending postMessage to opener:', messageData);
                    setTimeout(() => {
                        if (window.opener) {
                            window.opener.postMessage(messageData, '*');
                            console.log('postMessage sent successfully');
                        } else {
                            console.error('window.opener is null!');
                        }
                        window.close();
                    }, 600);
                } else {
                    // For product images, redirect as before
                    setTimeout(()=>{ const back=returnUrl||route('admin.cms.banners.create'); const url=new URL(back,window.location.origin); url.searchParams.set('designImage',json.url); url.searchParams.set('designPath',json.path); window.location.href=url.toString(); },600);
                }
            } else { alert('Failed to save.'); }
        } catch(err){ console.error(err); alert('Failed to save.'); }
        finally { setSaving(false); }
    };

    /* ── Animation Helpers ───────────────────────────────────── */
    const addAnimation = (objectId, preset) => {
        const canvas = fabricRef.current;
        const obj = canvas?.getObjects().find(o => o.id === objectId);
        if (!obj) return;

        const presetData = ANIMATION_PRESETS[preset];
        const newAnimation = {
            id: `anim-${Date.now()}`,
            objectId: objectId,
            objectName: obj.name || obj.type,
            preset: preset,
            duration: presetData.duration,
            delay: 0,
            easing: presetData.easing,
            loop: false,
            customKeyframes: null
        };

        setAnimations([...animations, newAnimation]);
        setSelectedAnimation(newAnimation);
    };

    const updateAnimation = (animId, updates) => {
        setAnimations(animations.map(anim => 
            anim.id === animId ? { ...anim, ...updates } : anim
        ));
        if (selectedAnimation?.id === animId) {
            setSelectedAnimation({ ...selectedAnimation, ...updates });
        }
    };

    const removeAnimation = (animId) => {
        setAnimations(animations.filter(anim => anim.id !== animId));
        if (selectedAnimation?.id === animId) {
            setSelectedAnimation(null);
        }
    };

    const playAnimation = () => {
        if (isPlaying) return;
        setIsPlaying(true);
        setCurrentTime(0);

        const canvas = fabricRef.current;
        if (!canvas) return;

        // Reset all objects to initial state
        canvas.getObjects().forEach(obj => {
            if (obj.id !== '__safe__') {
                obj.set({ opacity: 1, scaleX: 1, scaleY: 1, angle: 0, left: obj.originalLeft || obj.left, top: obj.originalTop || obj.top });
            }
        });
        canvas.renderAll();

        // Store original positions
        canvas.getObjects().forEach(obj => {
            if (obj.id !== '__safe__') {
                obj.originalLeft = obj.left;
                obj.originalTop = obj.top;
            }
        });

        // Play animations in sequence
        let startTime = Date.now();
        const maxDuration = Math.max(...animations.map(a => a.duration + a.delay), totalDuration);

        const animate = () => {
            const elapsed = Date.now() - startTime;
            setCurrentTime(elapsed);

            animations.forEach(anim => {
                if (elapsed < anim.delay) return;
                
                const animElapsed = elapsed - anim.delay;
                const progress = Math.min(animElapsed / anim.duration, 1);
                
                const obj = canvas.getObjects().find(o => o.id === anim.objectId);
                if (!obj) return;

                const preset = ANIMATION_PRESETS[anim.preset];
                if (!preset) return;

                // Apply animation based on preset
                switch (anim.preset) {
                    case 'fade':
                        obj.set({ opacity: progress });
                        break;
                    case 'slideLeft':
                        obj.set({ left: obj.originalLeft - (obj.originalLeft * (1 - progress)) });
                        break;
                    case 'slideRight':
                        obj.set({ left: obj.originalLeft + (obj.originalLeft * (1 - progress)) });
                        break;
                    case 'slideUp':
                        obj.set({ top: obj.originalTop + (obj.originalTop * (1 - progress)) });
                        break;
                    case 'slideDown':
                        obj.set({ top: obj.originalTop - (obj.originalTop * (1 - progress)) });
                        break;
                    case 'bounce':
                        const bounceProgress = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
                        obj.set({ scaleX: bounceProgress, scaleY: bounceProgress });
                        break;
                    case 'rotate':
                        obj.set({ angle: -180 * (1 - progress) });
                        break;
                    case 'scale':
                        obj.set({ scaleX: progress, scaleY: progress });
                        break;
                    case 'positionSwap':
                        if (progress < 0.5) {
                            obj.set({ left: obj.originalLeft + (200 * (progress / 0.5)) });
                        } else {
                            obj.set({ left: obj.originalLeft + 200 - (200 * ((progress - 0.5) / 0.5)) });
                        }
                        break;
                    case 'parallax':
                        obj.set({ top: obj.originalTop - (50 * Math.sin(progress * Math.PI)) });
                        break;
                }
            });

            canvas.renderAll();

            if (elapsed < maxDuration) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                setIsPlaying(false);
                // Reset to final state
                canvas.getObjects().forEach(obj => {
                    if (obj.id !== '__safe__') {
                        obj.set({ opacity: 1, scaleX: 1, scaleY: 1, angle: 0, left: obj.originalLeft, top: obj.originalTop });
                    }
                });
                canvas.renderAll();
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        setIsPlaying(false);
        setCurrentTime(0);

        const canvas = fabricRef.current;
        if (!canvas) return;

        // Reset all objects
        canvas.getObjects().forEach(obj => {
            if (obj.id !== '__safe__') {
                obj.set({ opacity: 1, scaleX: 1, scaleY: 1, angle: 0, left: obj.originalLeft || obj.left, top: obj.originalTop || obj.top });
            }
        });
        canvas.renderAll();
    };

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    const zoomVal = zoom ?? 0.45;

    const SHAPE_TOOLS = [
        {id:'rect',label:'Rectangle',shortcut:'R'},{id:'rounded-rect',label:'Rounded Rect',shortcut:'U'},
        {id:'ellipse',label:'Ellipse',shortcut:'E'},{id:'circle',label:'Circle',shortcut:''},
        {id:'triangle',label:'Triangle',shortcut:''},{id:'polygon',label:'Polygon',shortcut:'G'},
        {id:'star',label:'Star',shortcut:''},{id:'line',label:'Line',shortcut:'L'},
        {id:'arrow',label:'Arrow',shortcut:''},{id:'custom',label:'Custom Draw',shortcut:'P'},
    ];

    const isDrawingShape = ['rect','rounded-rect','ellipse','circle','triangle','polygon','star','line','arrow'].includes(activeTool);
    const isCropMode = activeTool === 'crop';

    return (
        <div className="flex flex-col overflow-hidden select-none" style={{height:'100vh',backgroundColor:T.bg,fontFamily:"'Inter',sans-serif"}}>

            {/* ── TOP BAR ── */}
            <div className="flex items-center justify-between px-4 flex-shrink-0" style={{height:48,backgroundColor:T.panel,borderBottom:`1px solid ${T.border}`,zIndex:50}}>
                {/* Left */}
                <div className="flex items-center gap-3 min-w-0">
                    <button onClick={()=>window.location.href=returnUrl||route('admin.cms.banners.create')} className="flex items-center gap-1.5 text-xs font-medium hover:text-white transition-colors flex-shrink-0" style={{color:T.sub}}>
                        <ChevronLeft className="w-4 h-4"/>Back
                    </button>
                    <div style={{width:1,height:16,backgroundColor:T.border}}/>
                    <span className="text-sm font-semibold text-white truncate">Edit Banner Design</span>
                    {/* Color swatches */}
                    <div className="flex items-center gap-1 ml-2 relative">
                        <div className="relative">
                            <button onClick={()=>{setShowFgPicker(p=>!p);setShowBgPicker(false);}} className="w-7 h-7 rounded-lg border-2 transition-all hover:scale-110" style={{backgroundColor:fgColor,borderColor:`rgba(255,255,255,0.3)`,zIndex:2,position:'relative'}}/>
                            {showFgPicker&&<ColorPicker color={fgColor} onChange={c=>{setFgColor(c);fgColorRef.current=c;if(selectedObj){updateProp('fill',c);}}} onClose={()=>setShowFgPicker(false)}/>}
                        </div>
                        <div className="relative" style={{marginLeft:-8,marginTop:6}}>
                            <button onClick={()=>{setShowBgPicker(p=>!p);setShowFgPicker(false);}} className="w-7 h-7 rounded-lg border-2 transition-all hover:scale-110" style={{backgroundColor:bgColor,borderColor:`rgba(255,255,255,0.3)`}}/>
                            {showBgPicker&&<ColorPicker color={bgColor} onChange={c=>{setBgColor(c);bgColorRef.current=c;}} onClose={()=>setShowBgPicker(false)}/>}
                        </div>
                        <button onClick={swapColors} title="Swap (Ctrl+X)" className="w-5 h-5 flex items-center justify-center rounded ml-1 hover:bg-white/10 transition-colors" style={{color:T.muted}}>
                            <ArrowLeftRight className="w-3 h-3"/>
                        </button>
                    </div>
                </div>

                {/* Center: tools */}
                <div className="flex items-center gap-0.5 px-2 py-1 rounded-xl" style={{backgroundColor:T.bg}}>
                    {[
                        {id:'select',Icon:MousePointer,label:'Select',action:null},
                        {id:'move',  Icon:Move,        label:'Move',  action:null},
                        {id:'text',  Icon:Type,        label:'Text',  action:addText},
                        {id:'gradient',Icon:Palette,   label:'Gradient',action:addGradientOverlay},
                        {id:'upload',Icon:Upload,      label:'Upload',action:()=>fileRef.current?.click()},
                        {id:'bucket',Icon:PaintBucket, label:'Fill',  action:null},
                        {id:'wand',  Icon:Wand2,       label:'Magic', action:null},
                        {id:'crop',  Icon:Scissors,    label:'Crop',  action:null},
                        {id:'custom',Icon:RefreshCw,   label:'Draw',  action:null},
                    ].map(({id,Icon,label,action})=>(
                        <button key={id} title={label} onClick={()=>{setActiveTool(id);activeToolRef.current=id;action?.();}}
                            className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg transition-all"
                            style={{backgroundColor:activeTool===id?`${T.blue}25`:'transparent',color:activeTool===id?T.white:T.sub}}>
                            <Icon className="w-3.5 h-3.5"/><span className="text-[8px]">{label}</span>
                        </button>
                    ))}
                    {/* Shape dropdown */}
                    <div className="relative" ref={shapeMenuRef}>
                        <button title="Shape (S)" onClick={()=>setShowShapeMenu(p=>!p)}
                            className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg transition-all"
                            style={{backgroundColor:isDrawingShape?`${T.blue}25`:'transparent',color:isDrawingShape?T.white:T.sub}}>
                            <div className="flex items-center gap-0.5"><Square className="w-3.5 h-3.5"/><ChevronDown className="w-2 h-2 opacity-60"/></div>
                            <span className="text-[8px]">Shape</span>
                        </button>
                        {showShapeMenu&&(
                            <div className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden z-50" style={{backgroundColor:T.panel,border:`1px solid ${T.border}`,minWidth:200,boxShadow:'0 8px 32px rgba(0,0,0,0.5)'}}>
                                {SHAPE_TOOLS.map(s=>(
                                    <div key={s.id}>
                                        {s.id==='polygon'&&(
                                            <div>
                                                <button onClick={()=>{addShape('polygon',{sides:polygonSides});setShowShapeMenu(false);}} className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-white/5" style={{color:T.sub}}>
                                                    <span className="text-xs font-medium text-white flex-1">{s.label}</span>
                                                </button>
                                                <div className="flex items-center gap-2 px-4 pb-2">
                                                    <span className="text-[9px]" style={{color:T.muted}}>Sides:</span>
                                                    <input type="number" min="3" max="20" value={polygonSides} onChange={e=>setPolygonSides(parseInt(e.target.value)||6)} onClick={e=>e.stopPropagation()} className="w-12 h-5 px-1 rounded text-[10px] text-white text-center focus:outline-none" style={{backgroundColor:T.card2,border:`1px solid ${T.border}`}}/>
                                                </div>
                                            </div>
                                        )}
                                        {s.id==='rounded-rect'&&(
                                            <div>
                                                <button onClick={()=>{addShape('rounded-rect',{radius:roundedRadius});setShowShapeMenu(false);}} className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-white/5" style={{color:T.sub}}>
                                                    <span className="text-xs font-medium text-white flex-1">{s.label}</span>
                                                </button>
                                                <div className="flex items-center gap-2 px-4 pb-2">
                                                    <span className="text-[9px]" style={{color:T.muted}}>Radius:</span>
                                                    <input type="number" min="0" max="100" value={roundedRadius} onChange={e=>setRoundedRadius(parseInt(e.target.value)||0)} onClick={e=>e.stopPropagation()} className="w-12 h-5 px-1 rounded text-[10px] text-white text-center focus:outline-none" style={{backgroundColor:T.card2,border:`1px solid ${T.border}`}}/>
                                                </div>
                                            </div>
                                        )}
                                        {s.id!=='polygon'&&s.id!=='rounded-rect'&&(
                                            <button onClick={()=>{addShape(s.id);setShowShapeMenu(false);}} className="flex items-center justify-between w-full px-4 py-2.5 text-left hover:bg-white/5" style={{color:T.sub}}>
                                                <span className="text-xs font-medium text-white">{s.label}</span>
                                                {s.shortcut&&<span className="text-[9px]" style={{color:T.muted}}>{s.shortcut}</span>}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={undoAction} disabled={histIdx<=0} title="Undo (Ctrl+Z)" className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 disabled:opacity-30 transition-all" style={{color:T.sub}}><Undo2 className="w-3.5 h-3.5"/></button>
                    <button onClick={redoAction} disabled={histIdx>=history.length-1} title="Redo (Ctrl+Y)" className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 disabled:opacity-30 transition-all" style={{color:T.sub}}><Redo2 className="w-3.5 h-3.5"/></button>
                    <div style={{width:1,height:16,backgroundColor:T.border}}/>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{backgroundColor:T.bg,border:`1px solid ${T.border}`}}>
                        <button onClick={()=>setZoom(z=>Math.max(0.1,(z??0.45)-0.1))} style={{color:T.sub}}><Minus className="w-3 h-3"/></button>
                        <button onClick={()=>setZoom(null)} className="w-10 text-center" title="Ctrl+0 to fit"><span className="text-xs font-medium text-white">{Math.round(zoomVal*100)}%</span></button>
                        <button onClick={()=>setZoom(z=>Math.min(2,(z??0.45)+0.1))} style={{color:T.sub}}><Plus className="w-3 h-3"/></button>
                    </div>
                    <button onClick={()=>setShowGrid(g=>!g)} title="Grid (Ctrl+G)" className="flex items-center gap-1 h-8 px-2 rounded-xl text-[10px] font-medium transition-all" style={{backgroundColor:showGrid?`${T.blue}25`:T.card2,color:showGrid?T.blue:T.sub,border:`1px solid ${showGrid?T.blue+'50':T.border}`}}>
                        <Grid3X3 className="w-3.5 h-3.5"/>
                    </button>
                    {/* Canvas size badge */}
                    <div className="hidden xl:flex items-center gap-1.5 px-3 h-8 rounded-xl"
                        style={{ backgroundColor:`${T.blue}15`, border:`1px solid ${T.blue}30` }}>
                        <span className="text-[10px] font-semibold" style={{ color:T.blue }}>
                            {CW} × {CH} px
                        </span>
                        <span className="text-[9px]" style={{ color:T.muted }}>
                            {bannerType === 'home'          ? '· Hero'
                           : bannerType === 'category'      ? '· Category'
                           : bannerType === 'product'        ? '· Product Banner'
                           : bannerType === 'collection'     ? '· Collection'
                           : bannerType === 'product_image'  ? '· Product Image'
                           : bannerType === 'product_variant'? '· Variant Image'
                           : '· Custom'}
                        </span>
                    </div>
                    <button onClick={saveDesign} disabled={saving} className="flex items-center gap-1.5 px-4 h-8 rounded-xl text-xs font-semibold text-white transition-all hover:-translate-y-px disabled:opacity-50" style={{background:`linear-gradient(135deg,${T.blue},${T.purple})`,boxShadow:`0 2px 12px ${T.blue}50`}}>
                        {saving?<><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving…</>:saved?<>✓ Saved!</>:<><Save className="w-3.5 h-3.5"/>Save Design</>}
                    </button>
                    <button onClick={()=>window.location.href=returnUrl||route('admin.cms.banners.create')} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/5 transition-all" style={{color:T.sub,border:`1px solid ${T.border}`}}><X className="w-4 h-4"/></button>
                </div>
            </div>

            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload}/>

            {/* ── Tool hint bar ── */}
            {(activeTool==='bucket'||activeTool==='wand'||activeTool==='crop'||activeTool==='custom'||isDrawingShape)&&(
                <div className="flex items-center justify-center gap-3 py-1.5 text-xs font-medium flex-shrink-0" style={{backgroundColor:`${T.blue}18`,borderBottom:`1px solid ${T.blue}30`,color:T.blue}}>
                    {activeTool==='bucket'&&<><PaintBucket className="w-3.5 h-3.5"/>Click any shape to fill with foreground color</>}
                    {activeTool==='wand'&&<><Wand2 className="w-3.5 h-3.5"/>Click object to select similar colors · Delete to remove</>}
                    {activeTool==='crop'&&<><Scissors className="w-3.5 h-3.5"/>Select an image first, then drag to crop</>}
                    {activeTool==='custom'&&<><RefreshCw className="w-3.5 h-3.5"/>Draw freely on canvas</>}
                    {isDrawingShape&&<><Square className="w-3.5 h-3.5"/>Click and drag to draw {activeTool}</>}
                    <span style={{color:T.muted}}>·</span>
                    <span style={{color:T.muted}}>Press Esc to exit</span>
                    <button onClick={()=>{setActiveTool('select');activeToolRef.current='select';setCropMode(false);setCropRect(null);}} className="ml-2 px-2 py-0.5 rounded text-[10px]" style={{backgroundColor:`${T.blue}30`,color:T.white}}>Exit</button>
                </div>
            )}

            {/* ── BODY ── */}
            <div className="flex flex-1 overflow-hidden">

                {/* Left icon rail */}
                <div className="flex flex-col items-center py-3 gap-1 flex-shrink-0" style={{width:52,backgroundColor:T.panel,borderRight:`1px solid ${T.border}`}}>
                    {[{id:'layers',Icon:Layers,label:'Layers'},{id:'shapes',Icon:Square,label:'Shapes'},{id:'text-panel',Icon:Type,label:'Text'},{id:'animation',Icon:Star,label:'Animation'},{id:'bg',Icon:Grid3X3,label:'BG'},{id:'overlay',Icon:Palette,label:'Overlay'},{id:'upload',Icon:Upload,label:'Upload'}].map(({id,Icon,label})=>(
                        <button key={id} title={label} onClick={()=>setLeftPanel(id)} className="flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all w-full hover:bg-white/5" style={{backgroundColor:leftPanel===id?`${T.blue}20`:'transparent',border:`1px solid ${leftPanel===id?T.blue+'50':'transparent'}`}}>
                            <Icon className="w-4 h-4" style={{color:leftPanel===id?T.blue:T.sub}}/><span className="text-[8px]" style={{color:leftPanel===id?T.white:T.muted}}>{label}</span>
                        </button>
                    ))}
                </div>

                {/* Left panel */}
                <div className="flex flex-col flex-shrink-0 overflow-hidden" style={{width:196,backgroundColor:T.panel,borderRight:`1px solid ${T.border}`}}>
                    {leftPanel==='layers'&&(
                        <>
                            <div className="flex items-center justify-between px-3 py-2.5">
                                <span className="text-xs font-semibold text-white">Layers</span>
                                <div className="flex gap-1">
                                    <button onClick={addEmptyLayer} title="Add layer" className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10" style={{color:T.blue}}><Plus className="w-3.5 h-3.5"/></button>
                                    <button onClick={()=>fileRef.current?.click()} title="Upload image" className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10" style={{color:T.muted}}><Upload className="w-3 h-3"/></button>
                                </div>
                            </div>
                            <div style={{height:1,backgroundColor:T.border}}/>
                            <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
                                {layers.length===0&&<p className="text-[10px] text-center py-8" style={{color:T.muted}}>No layers yet.<br/>Click + to add.</p>}
                                {layers.map(layer=>(
                                    <div key={layer.id} onClick={()=>{fabricRef.current?.setActiveObject(layer.obj);fabricRef.current?.renderAll();readProps(layer.obj);setSelectedId(layer.id);setSelectedObj(layer.obj);}}
                                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all group"
                                        style={{backgroundColor:selectedId===layer.id?`${T.blue}18`:'transparent',border:`1px solid ${selectedId===layer.id?T.blue+'40':'transparent'}`}}>
                                        <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{backgroundColor:T.card2}}>
                                            {layer.type==='i-text'||layer.type==='text'?<Type className="w-2.5 h-2.5" style={{color:T.blue}}/>:layer.type==='image'?<ImageIcon className="w-2.5 h-2.5" style={{color:T.green}}/>:<Square className="w-2.5 h-2.5" style={{color:T.sub}}/>}
                                        </div>
                                        <span className="text-[10px] flex-1 truncate" style={{color:selectedId===layer.id?T.white:T.sub}}>{layer.name}</span>
                                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={e=>{e.stopPropagation();toggleVisibility(layer.obj);}} className="w-4 h-4 flex items-center justify-center" style={{color:T.muted}}>{layer.visible?<Eye className="w-2.5 h-2.5"/>:<EyeOff className="w-2.5 h-2.5"/>}</button>
                                            <button onClick={e=>{e.stopPropagation();toggleLock(layer.obj);}} className="w-4 h-4 flex items-center justify-center" style={{color:T.muted}}>{layer.locked?<Lock className="w-2.5 h-2.5"/>:<Unlock className="w-2.5 h-2.5"/>}</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{height:1,backgroundColor:T.border}}/>
                            <div className="px-3 py-2 flex items-center justify-between">
                                <button onClick={addEmptyLayer} className="flex items-center gap-1 text-xs font-medium hover:text-white transition-colors" style={{color:T.blue}}><Plus className="w-3.5 h-3.5"/>Add Layer</button>
                                {selectedId&&<button onClick={deleteSelected} className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-500/10 transition-colors" style={{color:T.danger}}><Trash2 className="w-3 h-3"/></button>}
                            </div>
                        </>
                    )}
                    {leftPanel==='shapes'&&(
                        <div className="p-3">
                            <p className="text-xs font-semibold text-white mb-3">Shapes</p>
                            <div className="grid grid-cols-2 gap-2">
                                {[{s:'rect',label:'Rectangle'},{s:'circle',label:'Circle'},{s:'triangle',label:'Triangle'},{s:'line',label:'Line'}].map(({s,label})=>(
                                    <button key={s} onClick={()=>addShape(s)} className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all hover:-translate-y-0.5" style={{backgroundColor:T.card2,border:`1px solid ${T.border}`}}>
                                        <div className="w-8 h-8 flex items-center justify-center">
                                            {s==='rect'&&<div className="w-7 h-4 rounded" style={{backgroundColor:fgColor}}/>}
                                            {s==='circle'&&<div className="w-6 h-6 rounded-full" style={{backgroundColor:fgColor}}/>}
                                            {s==='triangle'&&<div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[18px] border-l-transparent border-r-transparent" style={{borderBottomColor:fgColor}}/>}
                                            {s==='line'&&<div className="w-8 h-0.5" style={{backgroundColor:fgColor}}/>}
                                        </div>
                                        <span className="text-[9px]" style={{color:T.muted}}>{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {leftPanel==='text-panel'&&(
                        <div className="p-3">
                            <p className="text-xs font-semibold text-white mb-3">Add Text</p>
                            <div className="space-y-2">
                                {[{label:'Add Heading',size:72,weight:'bold'},{label:'Add Subheading',size:48,weight:'600'},{label:'Add Body',size:28,weight:'normal'},{label:'Add Caption',size:20,weight:'normal'}].map(({label,size,weight})=>(
                                    <button key={label} onClick={async()=>{const fabric=await getFabric();const canvas=fabricRef.current;const id=`text-${Date.now()}`;const t=new fabric.IText(label,{left:CW/2,top:CH/2,originX:'center',originY:'center',fontSize:size,fontFamily:'Arial',fill:fgColorRef.current,fontWeight:weight,id,name:label,padding:0});canvas.add(t);canvas.setActiveObject(t);canvas.renderAll();}}
                                        className="w-full text-left px-3 py-2 rounded-xl transition-all hover:-translate-y-0.5 text-white" style={{backgroundColor:T.card2,border:`1px solid ${T.border}`,fontSize:Math.max(9,size/8)}}>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {leftPanel==='bg'&&(
                        <div className="p-3">
                            <p className="text-xs font-semibold text-white mb-3">Background</p>
                            <div className="grid grid-cols-5 gap-1 mb-3">
                                {BASE_COLORS.slice(0,20).map(c=><button key={c} onClick={()=>setCanvasBg(c)} className="w-7 h-7 rounded-lg transition-transform hover:scale-110" style={{backgroundColor:c,border:'1px solid rgba(255,255,255,0.1)'}}/>)}
                            </div>
                        </div>
                    )}
                    {leftPanel==='overlay'&&(
                        <div className="p-3">
                            <p className="text-xs font-semibold text-white mb-3">Overlay</p>
                            <div className="space-y-2">
                                {[{label:'Dark Left',g:'linear-gradient(to right,rgba(0,0,0,0.85),transparent)'},{label:'Dark Right',g:'linear-gradient(to left,rgba(0,0,0,0.85),transparent)'},{label:'Dark Bottom',g:'linear-gradient(to top,rgba(0,0,0,0.9),transparent)'},{label:'Dark Full',g:'rgba(0,0,0,0.5)'},{label:'Light Wash',g:'rgba(255,255,255,0.15)'}].map(({label,g})=>(
                                    <button key={label} onClick={addGradientOverlay} className="w-full h-10 rounded-xl text-[10px] font-medium text-white transition-all hover:-translate-y-0.5" style={{background:g,border:`1px solid ${T.border}`}}>{label}</button>
                                ))}
                            </div>
                        </div>
                    )}
                    {leftPanel==='upload'&&(
                        <div className="p-3">
                            <p className="text-xs font-semibold text-white mb-3">Upload Image</p>
                            <button onClick={()=>fileRef.current?.click()} className="w-full flex flex-col items-center gap-2 py-6 rounded-xl border-2 border-dashed transition-all hover:border-blue-500 hover:bg-blue-500/5" style={{borderColor:T.border}}>
                                <Upload className="w-6 h-6" style={{color:T.muted}}/><p className="text-[10px]" style={{color:T.muted}}>Click to upload</p>
                            </button>
                            <p className="text-[9px] mt-2 text-center" style={{color:T.muted}}>Uploads to selected layer or creates new</p>
                        </div>
                    )}
                    {leftPanel==='animation'&&(
                        <div className="p-3">
                            <p className="text-xs font-semibold text-white mb-3">Animations</p>
                            
                            {/* Play/Stop Controls */}
                            <div className="flex gap-2 mb-4">
                                <button onClick={playAnimation} disabled={isPlaying || animations.length === 0} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-30" style={{backgroundColor:isPlaying?`${T.green}30`:T.card2,color:isPlaying?T.green:T.white,border:`1px solid ${isPlaying?T.green:T.border}`}}>
                                    <RefreshCw className={`w-3.5 h-3.5 ${isPlaying?'animate-spin':''}`}/> {isPlaying?'Playing':'Play'}
                                </button>
                                <button onClick={stopAnimation} disabled={!isPlaying} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-30" style={{backgroundColor:T.card2,color:T.white,border:`1px solid ${T.border}`}}>
                                    <X className="w-3.5 h-3.5"/> Stop
                                </button>
                            </div>

                            {/* Timeline */}
                            <div className="mb-4 p-2 rounded-lg" style={{backgroundColor:T.card2,border:`1px solid ${T.border}`}}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[9px]" style={{color:T.muted}}>Timeline</span>
                                    <span className="text-[9px]" style={{color:T.sub}}>{Math.round(currentTime/1000)}s / {Math.round(totalDuration/1000)}s</span>
                                </div>
                                <div className="h-1 rounded-full overflow-hidden" style={{backgroundColor:T.border}}>
                                    <div className="h-full transition-all" style={{width:`${Math.min((currentTime/totalDuration)*100,100)}%`,backgroundColor:T.blue}}/>
                                </div>
                            </div>

                            {/* Add Animation */}
                            <div className="mb-4">
                                <p className="text-[10px] font-medium mb-2" style={{color:T.sub}}>Add Animation</p>
                                <select 
                                    value={selectedId || ''} 
                                    onChange={e => {
                                        const objId = e.target.value;
                                        if (objId) {
                                            fabricRef.current?.setActiveObject(layers.find(l => l.id === objId)?.obj);
                                            fabricRef.current?.renderAll();
                                        }
                                    }}
                                    className="w-full h-7 px-2 rounded text-xs text-white mb-2" 
                                    style={{backgroundColor:T.card2,border:`1px solid ${T.border}`}}
                                >
                                    <option value="">Select Object</option>
                                    {layers.filter(l => l.id !== '__safe__').map(l => (
                                        <option key={l.id} value={l.id}>{l.name}</option>
                                    ))}
                                </select>
                                
                                <div className="grid grid-cols-2 gap-1.5">
                                    {Object.entries(ANIMATION_PRESETS).map(([key, preset]) => (
                                        <button 
                                            key={key}
                                            onClick={() => selectedId && addAnimation(selectedId, key)}
                                            disabled={!selectedId}
                                            className="px-2 py-1.5 rounded text-[9px] transition-all disabled:opacity-30 hover:bg-white/10"
                                            style={{backgroundColor:T.card2,color:T.sub,border:`1px solid ${T.border}`}}
                                        >
                                            {preset.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Animation List */}
                            <div>
                                <p className="text-[10px] font-medium mb-2" style={{color:T.sub}}>Active Animations ({animations.length})</p>
                                {animations.length === 0 ? (
                                    <p className="text-[9px] text-center py-4" style={{color:T.muted}}>No animations yet</p>
                                ) : (
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {animations.map(anim => (
                                            <div 
                                                key={anim.id}
                                                onClick={() => setSelectedAnimation(anim)}
                                                className="p-2 rounded-lg cursor-pointer transition-all"
                                                style={{backgroundColor:selectedAnimation?.id === anim.id?`${T.blue}18`:T.card2,border:`1px solid ${selectedAnimation?.id === anim.id?T.blue+'40':T.border}`}}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-medium" style={{color:T.white}}>{anim.objectName}</span>
                                                    <button 
                                                        onClick={e => {e.stopPropagation(); removeAnimation(anim.id);}}
                                                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-500/10"
                                                        style={{color:T.danger}}
                                                    >
                                                        <Trash2 className="w-2.5 h-2.5"/>
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2 text-[9px]" style={{color:T.muted}}>
                                                    <span>{ANIMATION_PRESETS[anim.preset]?.name}</span>
                                                    <span>·</span>
                                                    <span>{anim.duration}ms</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Animation Settings */}
                            {selectedAnimation && (
                                <div className="mt-4 pt-4" style={{borderTop:`1px solid ${T.border}`}}>
                                    <p className="text-[10px] font-medium mb-2" style={{color:T.sub}}>Settings</p>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-[9px] block mb-1" style={{color:T.sub}}>Duration (ms)</label>
                                            <input 
                                                type="number" 
                                                value={selectedAnimation.duration} 
                                                onChange={e => updateAnimation(selectedAnimation.id, { duration: parseInt(e.target.value) || 500 })}
                                                className="w-full h-7 px-2 rounded text-xs text-white" 
                                                style={{backgroundColor:T.card2,border:`1px solid ${T.border}`}}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] block mb-1" style={{color:T.sub}}>Delay (ms)</label>
                                            <input 
                                                type="number" 
                                                value={selectedAnimation.delay} 
                                                onChange={e => updateAnimation(selectedAnimation.id, { delay: parseInt(e.target.value) || 0 })}
                                                className="w-full h-7 px-2 rounded text-xs text-white" 
                                                style={{backgroundColor:T.card2,border:`1px solid ${T.border}`}}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] block mb-1" style={{color:T.sub}}>Easing</label>
                                            <select 
                                                value={selectedAnimation.easing} 
                                                onChange={e => updateAnimation(selectedAnimation.id, { easing: e.target.value })}
                                                className="w-full h-7 px-2 rounded text-xs text-white" 
                                                style={{backgroundColor:T.card2,border:`1px solid ${T.border}`}}
                                            >
                                                {EASING_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedAnimation.loop} 
                                                onChange={e => updateAnimation(selectedAnimation.id, { loop: e.target.checked })}
                                                className="rounded"
                                            />
                                            <label className="text-[9px]" style={{color:T.sub}}>Loop</label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Canvas area */}
                <div ref={canvasWrapRef} className="flex-1 overflow-hidden relative" style={{backgroundColor:'#1a1a2e'}}>
                    {zoom!==null&&(
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                            <div style={{transform:`scale(${zoom})`,transformOrigin:'center center'}}>
                                <canvas ref={canvasEl} style={{boxShadow:'0 20px 60px rgba(0,0,0,0.5)'}}/>
                                {showGrid&&(
                                    <div className="absolute inset-0 pointer-events-none" style={{
                                        backgroundImage:`linear-gradient(${T.border}20 1px,transparent 1px),linear-gradient(90deg,${T.border}20 1px,transparent 1px)`,
                                        backgroundSize:`${gridSize}px ${gridSize}px`
                                    }}/>
                                )}
                                {cropRect&&(
                                    <div className="absolute pointer-events-none" style={{
                                        left: cropRect.x,
                                        top: cropRect.y,
                                        width: Math.abs(cropRect.width),
                                        height: Math.abs(cropRect.height),
                                        border: '2px dashed #4F6BFF',
                                        backgroundColor: 'rgba(79, 107, 255, 0.1)'
                                    }}/>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right panel */}
                <div className="flex flex-col flex-shrink-0 overflow-hidden" style={{width:240,backgroundColor:T.panel,borderLeft:`1px solid ${T.border}`}}>
                    <div className="flex items-center gap-2 px-3 py-2.5 border-b" style={{borderColor:T.border}}>
                        {['props','layers'].map(tab=>(
                            <button key={tab} onClick={()=>setRightTab(tab)} className="px-3 py-1 rounded-lg text-xs font-medium transition-all" style={{backgroundColor:rightTab===tab?`${T.blue}25`:'transparent',color:rightTab===tab?T.blue:T.sub}}>
                                {tab==='props'?'Properties':'All Layers'}
                            </button>
                        ))}
                    </div>
                    {rightTab==='props'&&selectedProp&&(
                        <div className="flex-1 overflow-y-auto p-3 space-y-4">
                            <div>
                                <p className="text-[10px] font-semibold mb-2" style={{color:T.muted}}>POSITION</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div><label className="text-[9px] block mb-1" style={{color:T.sub}}>X</label><input type="number" value={selectedProp.left} onChange={e=>updateProp('left',parseInt(e.target.value)||0)} className="w-full h-7 px-2 rounded text-xs text-white" style={{backgroundColor:T.card2,border:`1px solid ${T.border}`}}/></div>
                                    <div><label className="text-[9px] block mb-1" style={{color:T.sub}}>Y</label><input type="number" value={selectedProp.top} onChange={e=>updateProp('top',parseInt(e.target.value)||0)} className="w-full h-7 px-2 rounded text-xs text-white" style={{backgroundColor:T.card2,border:`1px solid ${T.border}`}}/></div>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold mb-2" style={{color:T.muted}}>SIZE</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div><label className="text-[9px] block mb-1" style={{color:T.sub}}>W</label><input type="number" value={selectedProp.width} onChange={e=>updateProp('width',parseInt(e.target.value)||0)} className="w-full h-7 px-2 rounded text-xs text-white" style={{backgroundColor:T.card2,border:`1px solid ${T.border}`}}/></div>
                                    <div><label className="text-[9px] block mb-1" style={{color:T.sub}}>H</label><input type="number" value={selectedProp.height} onChange={e=>updateProp('height',parseInt(e.target.value)||0)} className="w-full h-7 px-2 rounded text-xs text-white" style={{backgroundColor:T.card2,border:`1px solid ${T.border}`}}/></div>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold mb-2" style={{color:T.muted}}>APPEARANCE</p>
                                <div className="space-y-2">
                                    <div><label className="text-[9px] block mb-1" style={{color:T.sub}}>Opacity</label><input type="range" min="0" max="100" value={selectedProp.opacity} onChange={e=>updateProp('opacity',parseInt(e.target.value))} className="w-full"/></div>
                                    <div><label className="text-[9px] block mb-1" style={{color:T.sub}}>Rotation</label><input type="number" value={selectedProp.angle} onChange={e=>updateProp('angle',parseInt(e.target.value)||0)} className="w-full h-7 px-2 rounded text-xs text-white" style={{backgroundColor:T.card2,border:`1px solid ${T.border}`}}/></div>
                                    <div className="flex items-center gap-2"><input type="checkbox" checked={selectedProp.shadow} onChange={e=>updateProp('shadow',e.target.checked)} className="rounded"/><label className="text-[9px]" style={{color:T.sub}}>Shadow</label></div>
                                </div>
                            </div>
                            {(selectedProp.type==='i-text'||selectedProp.type==='text')&&(
                                <div>
                                    <p className="text-[10px] font-semibold mb-2" style={{color:T.muted}}>TEXT</p>
                                    <div className="space-y-2">
                                        <div><label className="text-[9px] block mb-1" style={{color:T.sub}}>Font</label><select value={selectedProp.fontFamily} onChange={e=>updateProp('fontFamily',e.target.value)} className="w-full h-7 px-2 rounded text-xs text-white" style={{backgroundColor:T.card2,border:`1px solid ${T.border}`}}>{FONTS.map(f=><option key={f} value={f}>{f}</option>)}</select></div>
                                        <div><label className="text-[9px] block mb-1" style={{color:T.sub}}>Size</label><input type="number" value={selectedProp.fontSize} onChange={e=>updateProp('fontSize',parseInt(e.target.value)||48)} className="w-full h-7 px-2 rounded text-xs text-white" style={{backgroundColor:T.card2,border:`1px solid ${T.border}`}}/></div>
                                        <div><label className="text-[9px] block mb-1" style={{color:T.sub}}>Align</label><div className="flex gap-1"><button onClick={()=>updateProp('textAlign','left')} className="flex-1 h-7 rounded" style={{backgroundColor:selectedProp.textAlign==='left'?`${T.blue}30`:T.card2}}><AlignLeft className="w-3 h-3 mx-auto" style={{color:T.sub}}/></button><button onClick={()=>updateProp('textAlign','center')} className="flex-1 h-7 rounded" style={{backgroundColor:selectedProp.textAlign==='center'?`${T.blue}30`:T.card2}}><AlignCenter className="w-3 h-3 mx-auto" style={{color:T.sub}}/></button><button onClick={()=>updateProp('textAlign','right')} className="flex-1 h-7 rounded" style={{backgroundColor:selectedProp.textAlign==='right'?`${T.blue}30`:T.card2}}><AlignRight className="w-3 h-3 mx-auto" style={{color:T.sub}}/></button></div></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {rightTab==='props'&&!selectedProp&&(
                        <div className="flex-1 flex items-center justify-center"><p className="text-xs" style={{color:T.muted}}>Select an object to edit</p></div>
                    )}
                    {rightTab==='layers'&&(
                        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                            {layers.map(layer=>(
                                <div key={layer.id} onClick={()=>{fabricRef.current?.setActiveObject(layer.obj);fabricRef.current?.renderAll();readProps(layer.obj);setSelectedId(layer.id);setSelectedObj(layer.obj);setRightTab('props');}}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all"
                                    style={{backgroundColor:selectedId===layer.id?`${T.blue}18`:'transparent',border:`1px solid ${selectedId===layer.id?T.blue+'40':'transparent'}`}}>
                                    <span className="text-[10px] flex-1 truncate" style={{color:selectedId===layer.id?T.white:T.sub}}>{layer.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Context menu */}
                {canvasCtxMenu&&(
                    <div className="fixed z-50 rounded-xl overflow-hidden py-1" style={{backgroundColor:T.panel,border:`1px solid ${T.border}`,left:canvasCtxMenu.x,top:canvasCtxMenu.y,boxShadow:'0 8px 32px rgba(0,0,0,0.5)'}}>
                        {(() => {
                            const obj = fabricRef.current?.getObjects().find(o => o.id === canvasCtxMenu.objId);
                            const isImage = obj && obj.type === 'image';
                            return (
                                <>
                                    {isImage && (
                                        <button 
                                            onClick={() => {
                                                replaceImageInputRef.current?.click();
                                                setCanvasCtxMenu(null);
                                            }} 
                                            className="flex items-center gap-2 px-4 py-2 text-xs hover:bg-white/5 w-full" 
                                            style={{color:T.sub}}
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Replace Image
                                        </button>
                                    )}
                                    <button onClick={()=>{copyObject();setCanvasCtxMenu(null);}} className="flex items-center gap-2 px-4 py-2 text-xs hover:bg-white/5 w-full" style={{color:T.sub}}><Copy className="w-3 h-3"/>Copy</button>
                                    <button onClick={()=>{deleteSelected();setCanvasCtxMenu(null);}} className="flex items-center gap-2 px-4 py-2 text-xs hover:bg-white/5 w-full" style={{color:T.danger}}><Trash2 className="w-3 h-3"/>Delete</button>
                                </>
                            );
                        })()}
                    </div>
                )}

                {/* Hidden file input for replace image */}
                <input
                    ref={replaceImageInputRef}
                    type="file"
                    accept="image/*"
                    style={{display:'none'}}
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file || !canvasCtxMenu?.objId) return;
                        
                        const canvas = fabricRef.current;
                        if (!canvas) return;
                        
                        const targetObj = canvas.getObjects().find(o => o.id === canvasCtxMenu.objId);
                        if (!targetObj || targetObj.type !== 'image') return;
                        
                        // Store position, size, and other properties
                        const props = {
                            left: targetObj.left,
                            top: targetObj.top,
                            scaleX: targetObj.scaleX,
                            scaleY: targetObj.scaleY,
                            angle: targetObj.angle,
                            opacity: targetObj.opacity,
                            flipX: targetObj.flipX,
                            flipY: targetObj.flipY,
                            id: targetObj.id,
                            name: targetObj.name || 'Replaced Image',
                        };
                        
                        // Load new image
                        const reader = new FileReader();
                        reader.onload = async (event) => {
                            const fabric = await getFabric();
                            fabric.Image.fromURL(event.target.result, (img) => {
                                // Remove old image
                                canvas.remove(targetObj);
                                
                                // Apply stored properties to new image
                                img.set(props);
                                
                                // Add to canvas
                                canvas.add(img);
                                canvas.setActiveObject(img);
                                canvas.renderAll();
                                
                                syncLayers(canvas);
                                pushHistory(canvas);
                            }, { crossOrigin: 'anonymous' });
                        };
                        reader.readAsDataURL(file);
                        
                        // Reset input
                        e.target.value = '';
                    }}
                />
            </div>
        </div>
    );
}

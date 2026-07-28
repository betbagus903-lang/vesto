import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Heart, Minus, Plus, Share2, ShoppingCart, X, ZoomIn, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Star, Truck, ShieldCheck, RotateCcw, CreditCard, Package } from 'lucide-react';
import Navbar from '../Components/Shared/Navbar';
import VariantSelector from '../Components/Shop/VariantSelector';

function fmt(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
    }).format(value ?? 0);
}

function StarRating({ rating, size = 'sm' }) {
    const cls = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';
    return (
        <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => (
                <svg key={s} className={`${cls} ${s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
                    fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
            ))}
        </div>
    );
}

function ImgWithFallback({ src, alt, className = '' }) {
    const [err, setErr] = useState(false);
    if (!src || err) {
        return (
            <div className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 ${className}`}>
                <svg className="w-16 h-16 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
            </div>
        );
    }
    return <img src={src} alt={alt} className={`object-cover ${className}`} onError={() => setErr(true)} />;
}

export default function Product({ product, variants = [], related = [], categories = [], configurableAttributes = [], reviews = [], canReview = false }) {
    const { auth, flash } = usePage().props;
    const [activeImg, setActiveImg] = useState(0);
    const [qty, setQty] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [availableOptions, setAvailableOptions] = useState({});
    const [activeTab, setActiveTab] = useState('description');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewHover, setReviewHover] = useState(0);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [localReviews, setLocalReviews] = useState(reviews);
    const [reviewImages, setReviewImages] = useState([]);
    const [reviewFilter, setReviewFilter] = useState('all');
    const [reviewComment, setReviewComment] = useState('');
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [reviewImageModal, setReviewImageModal] = useState({ open: false, review: null, imageIndex: 0 });
    const [menuOpen, setMenuOpen] = useState(null);
    const [replyMenuOpen, setReplyMenuOpen] = useState(null);
    const [replyInputOpen, setReplyInputOpen] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [helpfulLikes, setHelpfulLikes] = useState({});
    const photoInputRef = useRef(null);
    const thumbStripRef = useRef(null);

    const isConfigurable = product.type === 'configurable' && variants.length > 0;

    const attributeOptions = isConfigurable && configurableAttributes.length > 0
        ? (() => {
            const options = {};
            variants.forEach(v => {
                configurableAttributes.forEach(attr => {
                    const val = v[attr.code];
                    if (val) {
                        if (!options[attr.code]) options[attr.code] = new Set();
                        options[attr.code].add(val);
                    }
                });
            });
            Object.keys(options).forEach(k => { options[k] = Array.from(options[k]).sort(); });
            return options;
        })()
        : {};

    useEffect(() => {
        if (!isConfigurable) return;
        const available = {};
        const selectedKeys = Object.keys(selectedAttributes).filter(k => selectedAttributes[k]);
        configurableAttributes.forEach(attr => {
            const attrCode = attr.code;
            available[attrCode] = new Set();
            if (attrCode === 'color') {
                variants.forEach(v => { if (v[attrCode]) available[attrCode].add(v[attrCode]); });
            } else {
                const matchingVariants = variants.filter(v => {
                    if (selectedAttributes.color) {
                        return v.color?.toLowerCase() === selectedAttributes.color?.toLowerCase();
                    }
                    return true;
                });
                matchingVariants.forEach(v => { if (v[attrCode]) available[attrCode].add(v[attrCode]); });
            }
        });
        Object.keys(available).forEach(k => { available[k] = Array.from(available[k]); });
        setAvailableOptions(available);
    }, [selectedAttributes, isConfigurable, variants, configurableAttributes]);

    useEffect(() => {
        if (!isConfigurable) return;
        // Detect attributes from variants instead of relying on configurableAttributes
        const detectedAttributes = ['color', 'size', 'neck', 'sleeve'].filter(attr => {
            return variants.some(v => v[attr] && v[attr].toString().trim() !== '');
        });
        const allSelected = detectedAttributes.every(a => selectedAttributes[a]);
        if (allSelected && detectedAttributes.length > 0) {
            const match = variants.find(v =>
                detectedAttributes.every(a => v[a]?.toLowerCase().trim() === selectedAttributes[a]?.toLowerCase().trim())
            );
            setSelectedVariant(match || null);
            setActiveImg(0);
        } else {
            setSelectedVariant(null);
        }
    }, [selectedAttributes, isConfigurable, variants]);

    useEffect(() => {
        if (!isConfigurable) return;
        const params = new URLSearchParams(window.location.search);
        const initial = {};
        Object.keys(attributeOptions).forEach(attr => {
            const val = params.get(attr);
            if (val && attributeOptions[attr]?.includes(val)) initial[attr] = val;
        });
        if (Object.keys(initial).length > 0) setSelectedAttributes(initial);
    }, [isConfigurable]);

    let displayImages = [];
    let thumbnailsToShow = [];

    if (isConfigurable && variants.length > 0) {
        if (selectedVariant) {
            displayImages = selectedVariant.images?.length > 0 ? selectedVariant.images
                : (product.images?.length > 0 ? product.images : (product.image ? [product.image] : ['/placeholder.jpg']));
        } else {
            // Show gallery images only when no variant selected
            displayImages = product.images?.length > 0 ? product.images
                : (product.image ? [product.image] : ['/placeholder.jpg']);
        }
    } else {
        displayImages = product.images?.length > 0 ? product.images
            : (product.image ? [product.image] : ['/placeholder.jpg']);
    }
    thumbnailsToShow = displayImages;

    let displayPrice, hasDiscount, originalPrice, discountPct, currentStock;
    if (isConfigurable && !selectedVariant) {
        const prices = variants.map(v => v.price).filter(p => p > 0);
        if (prices.length > 0) {
            displayPrice = Math.min(...prices);
            hasDiscount = false; originalPrice = null; discountPct = 0; currentStock = null;
        } else {
            displayPrice = product.price;
            hasDiscount = !!product.special_price;
            originalPrice = hasDiscount ? product.price : null;
            discountPct = hasDiscount && product.price > 0 ? Math.round((1 - product.special_price / product.price) * 100) : 0;
            currentStock = product.stock;
        }
    } else {
        displayPrice = selectedVariant?.price || product.price;
        hasDiscount = !!(selectedVariant?.compare_at_price || product.special_price);
        originalPrice = selectedVariant?.compare_at_price || (hasDiscount ? product.price : null);
        discountPct = hasDiscount && originalPrice > 0
            ? Math.round((1 - (selectedVariant?.price || product.special_price) / originalPrice) * 100) : 0;
        currentStock = selectedVariant?.stock ?? product.stock;
    }

    const totalReviews = localReviews.length;
    const avgRating = totalReviews > 0 ? (localReviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1) : 0;
    const ratingCounts = [5,4,3,2,1].map(star => ({
        star,
        count: localReviews.filter(r => r.rating === star).length,
        pct: totalReviews > 0 ? Math.round((localReviews.filter(r => r.rating === star).length / totalReviews) * 100) : 0,
    }));
    const filteredReviews = reviewFilter === 'all' ? localReviews
        : reviewFilter === 'photos' ? localReviews.filter(r => r.images?.length > 0)
        : reviewFilter === 'verified' ? localReviews
        : localReviews.filter(r => r.rating === Number(reviewFilter));
    const reviewPhotos = localReviews.flatMap(r => r.images || []).filter(Boolean);
    const recommendedPct = totalReviews > 0 ? Math.round((localReviews.filter(r => r.rating >= 4).length / totalReviews) * 100) : 0;

    const handleAddToCart = () => {
        if (isConfigurable && !selectedVariant) { alert('Please select all product options'); return; }
        setIsAdding(true);
        const cartItem = {
            id: Date.now(), productId: product.id, variantId: selectedVariant?.id || null,
            name: product.name, image: displayImages[0] || product.image, price: displayPrice, quantity: qty,
            variantName: selectedVariant ? `${selectedVariant.color||''} ${selectedVariant.size||''} ${selectedVariant.neck||''} ${selectedVariant.sleeve||''}`.trim() : null,
            sku: selectedVariant?.sku || product.sku,
        };
        const existing = JSON.parse(localStorage.getItem('vesto_cart') || '[]');
        const idx = existing.findIndex(i => i.productId === cartItem.productId && i.variantId === cartItem.variantId);
        if (idx >= 0) existing[idx].quantity += cartItem.quantity; else existing.push(cartItem);
        localStorage.setItem('vesto_cart', JSON.stringify(existing));
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: existing.length } }));
        window.dispatchEvent(new CustomEvent('open-mini-cart'));
        setIsAdding(false);
    };

    const handleAttributeChange = (attrCode, value) => {
        const newSelections = { ...selectedAttributes, [attrCode]: value };
        
        // Auto-selection logic when color is selected
        if (attrCode === 'color') {
            const matchingVariants = variants.filter(v => 
                v.color?.toLowerCase() === value?.toLowerCase()
            );
            
            if (matchingVariants.length > 0) {
                // If only 1 variant exists for this color, select all its attributes
                if (matchingVariants.length === 1) {
                    const variant = matchingVariants[0];
                    ['color', 'size', 'neck', 'sleeve'].forEach(attr => {
                        if (variant[attr] && variant[attr].toString().trim() !== '') {
                            newSelections[attr] = variant[attr];
                        }
                    });
                } else {
                    // If multiple variants exist, select the first one's attributes
                    const firstVariant = matchingVariants[0];
                    ['color', 'size', 'neck', 'sleeve'].forEach(attr => {
                        if (firstVariant[attr] && firstVariant[attr].toString().trim() !== '') {
                            newSelections[attr] = firstVariant[attr];
                        }
                    });
                }
            }
        }
        
        setSelectedAttributes(newSelections);
        setActiveImg(0);
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (reviewRating === 0) { alert('Please select a rating'); return; }
        if (!reviewComment.trim()) { alert('Please write a comment'); return; }
        setIsSubmittingReview(true);
        router.post('/buyer/reviews', { product_id: product.id, variant_id: selectedVariant?.id || null, rating: reviewRating, comment: reviewComment, images: reviewImages.map(i => i.file) }, {
            forceFormData: true, preserveScroll: true,
            onSuccess: (page) => {
                setReviewRating(0); setReviewComment('');
                reviewImages.forEach(i => URL.revokeObjectURL(i.preview)); setReviewImages([]);
                setIsSubmittingReview(false);
                if (page.props.reviews) { setLocalReviews(page.props.reviews); }
                if (page.props.flash?.success) { alert(page.props.flash.success); }
            },
            onError: (errors) => {
                const e = Object.values(errors)[0];
                alert(Array.isArray(e) ? e[0] : e || 'Failed'); setIsSubmittingReview(false);
            },
        });
    };

    const handlePhotoAdd = (e) => {
        const files = Array.from(e.target.files);
        setReviewImages(prev => [...prev, ...files.map(f => ({ file: f, preview: URL.createObjectURL(f), id: Date.now() + Math.random() }))].slice(0, 5));
        e.target.value = '';
    };

    const handlePhotoRemove = (id) => {
        setReviewImages(prev => { const img = prev.find(i => i.id === id); if (img) URL.revokeObjectURL(img.preview); return prev.filter(i => i.id !== id); });
    };

    const openReviewImageModal = (review, imageIndex) => {
        setReviewImageModal({ open: true, review, imageIndex });
    };

    const closeReviewImageModal = () => {
        setReviewImageModal({ open: false, review: null, imageIndex: 0 });
    };

    const nextImage = () => {
        if (reviewImageModal.review && reviewImageModal.imageIndex < reviewImageModal.review.images.length - 1) {
            setReviewImageModal(prev => ({ ...prev, imageIndex: prev.imageIndex + 1 }));
        }
    };

    const prevImage = () => {
        if (reviewImageModal.imageIndex > 0) {
            setReviewImageModal(prev => ({ ...prev, imageIndex: prev.imageIndex - 1 }));
        }
    };

    const goToNextCustomer = () => {
        const currentReviewIndex = localReviews.findIndex(r => r.id === reviewImageModal.review.id);
        if (currentReviewIndex < localReviews.length - 1) {
            const nextReview = localReviews[currentReviewIndex + 1];
            if (nextReview.images && nextReview.images.length > 0) {
                setReviewImageModal({ open: true, review: nextReview, imageIndex: 0 });
            }
        }
    };

    const goToPrevCustomer = () => {
        const currentReviewIndex = localReviews.findIndex(r => r.id === reviewImageModal.review.id);
        if (currentReviewIndex > 0) {
            const prevReview = localReviews[currentReviewIndex - 1];
            if (prevReview.images && prevReview.images.length > 0) {
                setReviewImageModal({ open: true, review: prevReview, imageIndex: 0 });
            }
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!reviewImageModal.open) return;
            switch (e.key) {
                case 'ArrowRight': nextImage(); break;
                case 'ArrowLeft': prevImage(); break;
                case 'ArrowDown': e.preventDefault(); goToNextCustomer(); break;
                case 'ArrowUp': e.preventDefault(); goToPrevCustomer(); break;
                case 'Escape': closeReviewImageModal(); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [reviewImageModal]);

    const handleDeleteReview = (reviewId) => {
        if (confirm('Are you sure you want to delete this review?')) {
            router.delete(`/buyer/reviews/${reviewId}`, {
                onSuccess: () => { setMenuOpen(null); setLocalReviews(prev => prev.filter(r => r.id !== reviewId)); },
            });
        }
    };

    const handleReplySubmit = (reviewId) => {
        if (!replyText.trim()) return;
        router.post(`/buyer/reviews/${reviewId}/replies`, { comment: replyText }, {
            onSuccess: () => { setReplyText(''); setReplyInputOpen(null); },
        });
    };

    const handleToggleHelpful = (reviewId) => {
        router.post(`/buyer/reviews/${reviewId}/helpful`, {}, {
            onSuccess: () => { setHelpfulLikes(prev => ({ ...prev, [reviewId]: !prev[reviewId] })); },
        });
    };

    useEffect(() => {
        const initialLikes = {};
        reviews.forEach(review => { initialLikes[review.id] = review.is_liked || false; });
        setHelpfulLikes(initialLikes);
    }, [reviews]);

    useEffect(() => { if (flash?.error) alert(flash.error); }, [flash]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuOpen && !e.target.closest('.review-menu')) setMenuOpen(null);
            if (replyMenuOpen && !e.target.closest('.reply-menu')) setReplyMenuOpen(null);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen, replyMenuOpen]);

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Announcement Bar */}
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-center py-2.5 text-[11px] tracking-[0.2em] font-medium">
                <span className="inline-flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5" />
                    FREE SHIPPING ON ORDERS ABOVE Rp200.000
                </span>
            </div>

            {/* Navbar */}
            <Navbar categories={categories} />

            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
                <nav className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
                    <span className="text-gray-300">/</span>
                    {product.categories?.[0] && (
                        <>
                            <Link href={`/shop?category=${product.categories[0].slug}`} className="hover:text-gray-600 transition-colors capitalize">
                                {product.categories[0].name}
                            </Link>
                            <span className="text-gray-300">/</span>
                        </>
                    )}
                    <span className="text-gray-600 font-medium truncate max-w-xs">{product.name}</span>
                </nav>
            </div>

            {/* ───────────────── PRODUCT MAIN ───────────────── */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_1fr] gap-6 lg:gap-10">

                    {/* ── Thumbnails (vertical strip) ── */}
                    <div className="hidden lg:flex flex-col gap-2 w-[72px]" ref={thumbStripRef}>
                        {thumbnailsToShow.map((img, idx) => (
                            <button key={idx} onClick={() => setActiveImg(idx)}
                                className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                                    activeImg === idx
                                        ? 'border-gray-900 shadow-md scale-105'
                                        : 'border-gray-100 hover:border-gray-400 opacity-70 hover:opacity-100'
                                }`}>
                                <ImgWithFallback src={img} alt={`View ${idx + 1}`} className="w-full h-full" />
                            </button>
                        ))}
                        {thumbnailsToShow.length > 5 && (
                            <button onClick={() => {
                                const next = Math.min(thumbnailsToShow.length - 1, activeImg + 1);
                                setActiveImg(next);
                                if (thumbStripRef.current) {
                                    const btn = thumbStripRef.current.children[next];
                                    if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                }
                            }}
                                className="w-full flex items-center justify-center py-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100">
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* ── Main Image ── */}
                    <div className="relative group">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden aspect-[3/4] border border-gray-100 relative">
                            <ImgWithFallback
                                src={displayImages[activeImg] || displayImages[0]}
                                alt={product.name}
                                className="w-full h-full transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                            {/* Discount badge */}
                            {hasDiscount && discountPct > 0 && (
                                <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-red-200">
                                    -{discountPct}% OFF
                                </div>
                            )}
                            {/* New badge */}
                            {product.new && !hasDiscount && (
                                <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-emerald-200 uppercase tracking-wider">
                                    New
                                </div>
                            )}
                            {/* Zoom button */}
                            <button onClick={() => setLightboxOpen(true)}
                                className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white">
                                <ZoomIn className="w-4.5 h-4.5 text-gray-700" />
                            </button>
                            {/* Image counter */}
                            {displayImages.length > 1 && (
                                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                                    {activeImg + 1} / {displayImages.length}
                                </div>
                            )}
                        </div>
                        {/* Mobile thumbnails row */}
                        {thumbnailsToShow.length > 1 && (
                            <div className="flex lg:hidden gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                                {thumbnailsToShow.map((img, idx) => (
                                    <button key={idx} onClick={() => setActiveImg(idx)}
                                        className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                                            activeImg === idx
                                                ? 'border-gray-900 shadow-md'
                                                : 'border-gray-100 opacity-60 hover:opacity-100'
                                        }`}>
                                        <ImgWithFallback src={img} alt={`View ${idx + 1}`} className="w-full h-full" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Product Info ── */}
                    <div className="flex flex-col gap-5">
                        {/* Category badge */}
                        {product.categories?.[0] && (
                            <Link href={`/shop?category=${product.categories[0].slug}`}
                                className="inline-flex w-fit items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors">
                                {product.categories[0].name}
                            </Link>
                        )}

                        {/* Name */}
                        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight tracking-tight">{product.name}</h1>

                        {/* Rating + Sold */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-1.5">
                                <StarRating rating={Number(avgRating)} size="md" />
                                <span className="text-sm font-bold text-gray-700">{avgRating}</span>
                            </div>
                            <button onClick={() => setActiveTab('reviews')}
                                className="text-sm text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2">
                                {totalReviews.toLocaleString()} reviews
                            </button>
                            <span className="text-gray-200">|</span>
                            <span className="text-sm text-gray-500 font-medium">{(product.sold_count ?? 0).toLocaleString()} sold</span>
                        </div>

                        {/* Price row */}
                        <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-2xl p-4">
                            <div className="flex items-end gap-3 flex-wrap">
                                <span className="text-4xl font-extrabold text-gray-900 leading-none">{fmt(displayPrice)}</span>
                                {hasDiscount && originalPrice && (
                                    <div className="flex items-center gap-2 pb-0.5">
                                        <span className="text-base text-gray-400 line-through font-medium">{fmt(originalPrice)}</span>
                                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
                                            Save {discountPct}%
                                        </span>
                                    </div>
                                )}
                            </div>
                            {hasDiscount && (
                                <p className="text-xs text-red-400 mt-1.5 font-medium">Limited time offer — don't miss out!</p>
                            )}
                        </div>


                        {/* Divider */}
                        <div className="border-t border-gray-100" />

                        {/* Variant Selector */}
                        {isConfigurable && (
                            <div>
                                <div className="flex items-center justify-end mb-3">
                                    <button className="text-xs text-gray-400 flex items-center gap-1.5 hover:text-gray-700 transition-colors group/guide">
                                        <svg className="w-3.5 h-3.5 group-hover/guide:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                                        </svg>
                                        Size Guide
                                    </button>
                                </div>
                                <VariantSelector
                                    variants={variants}
                                    selectedAttributes={selectedAttributes}
                                    onAttributeChange={handleAttributeChange}
                                />
                                {!selectedVariant && Object.keys(selectedAttributes).length > 0 && (
                                    <p className="text-xs text-amber-500 mt-3 flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                                        </svg>
                                        Please complete all selections to continue
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Feature Badges */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { icon: <Truck className="w-5 h-5" />, title: 'Free Shipping', sub: 'Orders > Rp200K' },
                                { icon: <RotateCcw className="w-5 h-5" />, title: 'Easy Return', sub: '30 Days Return' },
                                { icon: <CreditCard className="w-5 h-5" />, title: 'COD Available', sub: 'Pay on Delivery' },
                                { icon: <Package className="w-5 h-5" />, title: 'Fast Delivery', sub: '2-4 Business Days' },
                            ].map((b, i) => (
                                <div key={i} className="flex flex-col items-center text-center bg-gray-50 rounded-2xl p-3.5 gap-2 border border-gray-100">
                                    <div className="text-gray-600">{b.icon}</div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-700 leading-tight">{b.title}</p>
                                        <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{b.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quantity + Stock */}
                        <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Quantity</p>
                                <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="w-12 text-center text-sm font-bold text-gray-900">{qty}</span>
                                    <button onClick={() => setQty(q => q + 1)}
                                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="text-right">
                                {isConfigurable && !selectedVariant ? (
                                    <div className="flex items-center gap-1.5 text-amber-500">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                                        </svg>
                                        <p className="text-xs font-semibold">Select variant first</p>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex items-center gap-1.5 justify-end">
                                            <span className="relative flex h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                            </span>
                                            <p className="text-sm font-bold text-emerald-600">In Stock</p>
                                        </div>
                                        <p className="text-[11px] text-gray-400 mt-0.5">Ready to ship</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button onClick={handleAddToCart}
                                disabled={(isConfigurable && !selectedVariant) || isAdding}
                                className={`flex-1 font-bold text-sm py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg ${
                                    (isConfigurable && !selectedVariant) || isAdding
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                                        : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700 hover:shadow-xl hover:shadow-gray-900/30 hover:-translate-y-0.5 active:translate-y-0 shadow-gray-900/20'
                                }`}>
                                {isAdding
                                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/><span>Adding...</span></>
                                    : <><ShoppingCart className="w-4.5 h-4.5"/><span>Add to Cart</span></>}
                            </button>
                            <button disabled={(isConfigurable && !selectedVariant)}
                                className={`flex-1 font-bold text-sm py-4 rounded-2xl transition-all duration-300 ${
                                    isConfigurable && !selectedVariant
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60 border-2 border-gray-300'
                                        : 'border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                                }`}>
                                Buy Now
                            </button>
                        </div>

                        {/* Wishlist + Share */}
                        <div className="flex gap-3">
                            <button onClick={() => setIsWishlisted(!isWishlisted)}
                                className={`flex-1 border font-medium text-sm py-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${
                                    isWishlisted
                                        ? 'border-red-200 bg-red-50 text-red-500'
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                                }`}>
                                <Heart className={`w-4 h-4 transition-all duration-300 ${isWishlisted ? 'fill-red-500 scale-110' : ''}`} />
                                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                            </button>
                            <button className="flex-1 border border-gray-200 text-gray-600 font-medium text-sm py-3 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-2">
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ───────────────── TABS SECTION ───────────────── */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-16">
                {/* Tab Nav */}
                <div className="border-b border-gray-200 mb-10">
                    <div className="flex gap-0 overflow-x-auto scrollbar-hide">
                        {[
                            { key: 'description', label: 'Description', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7"/></svg> },
                            { key: 'additional', label: 'Details', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> },
                            { key: 'reviews', label: `Reviews (${totalReviews})`, icon: <Star className="w-4 h-4" /> },
                            { key: 'qna', label: 'Q&A', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
                        ].map(tab => (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                className={`relative px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                                    activeTab === tab.key
                                        ? 'text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-gradient-to-r after:from-gray-900 after:to-gray-700 after:rounded-full'
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}>
                                <span className={activeTab === tab.key ? 'text-gray-900' : 'text-gray-300'}>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Description Tab */}
                {activeTab === 'description' && (
                    <div className="max-w-3xl">
                        {product.description
                            ? <div className="prose prose-gray prose-sm max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
                            : <div className="text-center py-16">
                                <svg className="w-16 h-16 mx-auto text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h7"/>
                                </svg>
                                <p className="text-gray-400 text-sm">No description available for this product.</p>
                              </div>}
                    </div>
                )}

                {/* Details Tab */}
                {activeTab === 'additional' && (
                    <div className="max-w-2xl">
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <table className="w-full">
                                <tbody className="divide-y divide-gray-200/60">
                                    {[
                                        ['SKU', selectedVariant?.sku || product.sku || 'N/A'],
                                        ['Category', product.categories?.[0]?.name || 'N/A'],
                                        selectedVariant?.color ? ['Color', <span className="capitalize font-medium">{selectedVariant.color}</span>] : null,
                                        selectedVariant?.size  ? ['Size', <span className="uppercase font-medium">{selectedVariant.size}</span>] : null,
                                        ['Stock', currentStock > 0 ? <span className="text-emerald-600 font-semibold">{currentStock} units available</span> : <span className="text-red-500 font-semibold">Out of Stock</span>],
                                    ].filter(Boolean).map(([label, value], i) => (
                                        <tr key={i}>
                                            <td className="py-4 text-sm font-bold text-gray-500 w-40 uppercase tracking-wider text-[11px]">{label}</td>
                                            <td className="py-4 text-sm text-gray-800">{value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                    <div>
                        {/* ── Top stats + customer photos ── */}
                        <div className="flex flex-col lg:flex-row gap-8 mb-10 pb-10 border-b border-gray-100">
                            {/* Left: rating + bar chart + recommended */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-4 mb-6">
                                    <div>
                                        <StarRating rating={Number(avgRating)} size="lg" />
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{avgRating}</p>
                                        <p className="text-sm text-gray-400 mt-0.5">{totalReviews.toLocaleString()} reviews</p>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-5">
                                    {ratingCounts.map(({ star, count, pct }) => (
                                        <button key={star} onClick={() => setReviewFilter(String(star))}
                                            className="flex items-center gap-3 w-full group/bar hover:opacity-80 transition-opacity">
                                            <span className="text-xs font-bold text-gray-500 w-3 text-right flex-shrink-0">{star}</span>
                                            <svg className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                            </svg>
                                            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className="text-xs font-medium text-gray-400 w-8 text-right flex-shrink-0">{count}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                                    <p className="text-3xl font-black text-emerald-600">{recommendedPct}%</p>
                                    <p className="text-xs text-emerald-700 font-medium">Customers recommended this product</p>
                                    <p className="text-[11px] text-emerald-500 flex items-center gap-1 mt-1">
                                        <ShieldCheck className="w-3 h-3" />
                                        Based on verified purchases
                                    </p>
                                </div>
                            </div>

                            {/* Right: Customer Photos */}
                            {reviewPhotos.length > 0 && (
                                <div className="flex-1 min-w-0 lg:ml-12">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-sm font-bold text-gray-900">Customer Photos</p>
                                        <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors font-medium">
                                            See all {reviewPhotos.length} photos
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        {reviewPhotos.slice(0, 4).map((photo, i) => (
                                            <div key={i} className="w-[90px] h-[90px] rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 hover:scale-105 transition-transform duration-200 cursor-pointer">
                                                <img src={photo} alt="" className="w-full h-full object-cover"/>
                                            </div>
                                        ))}
                                        {reviewPhotos.length > 4 && (
                                            <div className="w-[90px] h-[90px] rounded-2xl overflow-hidden bg-gray-100 relative flex-shrink-0">
                                                <img src={reviewPhotos[4]} alt="" className="w-full h-full object-cover"/>
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
                                                    <span className="text-white text-sm font-bold">+{reviewPhotos.length - 4}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {reviewPhotos.length === 0 && (
                                <div className="flex-1 min-w-0 lg:ml-12">
                                    <p className="text-sm font-bold text-gray-900 mb-4">Customer Photos</p>
                                    <div className="bg-gray-50 rounded-2xl p-8 text-center">
                                        <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                        </svg>
                                        <p className="text-xs text-gray-400">No customer photos yet.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Filter bar */}
                        <div className="flex flex-wrap items-center gap-2 mb-8">
                            {[
                                { key: 'all',      label: `All (${totalReviews})` },
                                { key: '5',        label: '5 ★' },
                                { key: '4',        label: '4 ★' },
                                { key: '3',        label: '3 ★' },
                                { key: '2',        label: '2 ★' },
                                { key: '1',        label: '1 ★' },
                                { key: 'with_photos', label: '📷 With photos' },
                            ].map(f => (
                                <button key={f.key} onClick={() => setReviewFilter(f.key)}
                                    className={`text-xs px-4 py-2 rounded-xl transition-all duration-200 font-medium ${
                                        reviewFilter === f.key
                                            ? 'bg-gray-900 text-white shadow-md shadow-gray-900/20'
                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}>
                                    {f.label}
                                </button>
                            ))}
                            <div className="ml-auto flex gap-2">
                                <select className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-600 focus:outline-none focus:border-gray-400 font-medium">
                                    <option>All Variants</option>
                                </select>
                                <select className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-600 focus:outline-none focus:border-gray-400 font-medium">
                                    <option>Latest</option>
                                    <option>Highest Rating</option>
                                    <option>Lowest Rating</option>
                                </select>
                            </div>
                        </div>

                        {/* Reviews list + Write review */}
                        <div className="grid grid-cols-1 lg:grid-cols-[560px_700px] gap-10">
                            {/* Review list */}
                            <div className="space-y-6">
                            {filteredReviews.length === 0
                                ? <div className="text-center py-16">
                                    <svg className="w-16 h-16 mx-auto text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                    </svg>
                                    <p className="text-gray-400 text-sm">No reviews yet. Be the first to review!</p>
                                  </div>
                                : filteredReviews.map(review => (
                                    <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow duration-300">
                                        {/* Header row */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-sm">
                                                    {review.user?.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{review.user?.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <StarRating rating={review.rating} size="sm" />
                                                        <p className="text-[11px] text-gray-400">{review.created_at}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative review-menu">
                                                <button
                                                    onClick={() => setMenuOpen(menuOpen === review.id ? null : review.id)}
                                                    className="text-gray-300 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                                                    </svg>
                                                </button>
                                                {menuOpen === review.id && (
                                                    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-10 min-w-[110px]">
                                                        {auth?.user?.id === review.user?.id && (
                                                            <>
                                                                <button onClick={() => setMenuOpen(null)}
                                                                    className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                                                                    Edit
                                                                </button>
                                                                <button onClick={() => handleDeleteReview(review.id)}
                                                                    className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors font-medium">
                                                                    Delete
                                                                </button>
                                                            </>
                                                        )}
                                                        <button onClick={() => { setMenuOpen(null); setReplyInputOpen(replyInputOpen === review.id ? null : review.id); }}
                                                            className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                                                            Reply
                                                        </button>
                                                        {auth?.user?.id !== review.user?.id && (
                                                            <button onClick={() => setMenuOpen(null)}
                                                                className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors font-medium">
                                                                Report
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* Comment */}
                                        <p className="text-sm text-gray-600 leading-relaxed mb-3">{review.comment}</p>
                                        {/* Review photos */}
                                        {review.images?.length > 0 && (
                                            <div className="flex gap-2 mb-3">
                                                {review.images.slice(0, 3).map((img, i) => (
                                                    <div key={i} className="relative w-[72px] h-[72px] rounded-xl overflow-hidden cursor-pointer group/img" onClick={() => openReviewImageModal(review, i)}>
                                                        <img src={img} className="w-full h-full object-cover border border-gray-100 group-hover/img:scale-105 transition-transform duration-200" alt=""/>
                                                        {i === 2 && review.images.length > 3 && (
                                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
                                                                <span className="text-white text-xs font-bold">+{review.images.length - 3}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {/* Reply + Helpful buttons */}
                                        <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                                            <button onClick={() => setReplyInputOpen(replyInputOpen === review.id ? null : review.id)}
                                                className="text-xs text-gray-400 hover:text-gray-700 transition-colors font-medium flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                                                </svg>
                                                Reply
                                            </button>
                                            <button onClick={() => handleToggleHelpful(review.id)}
                                                className={`flex items-center gap-1.5 text-xs transition-all duration-200 font-medium ${
                                                    helpfulLikes[review.id] ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                                                }`}>
                                                <svg className="w-3.5 h-3.5" fill={helpfulLikes[review.id] ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.096l-.723 7.25A2 2 0 0118.04 21H5.96a2 2 0 01-1.79-2.654l.814-2.47A2 2 0 016.772 15H11V5a2 2 0 012-2h.09a1 1 0 01.995 1.031L14 10z"/>
                                                </svg>
                                                Helpful {review.helpful_count ? `(${review.helpful_count})` : ''}
                                            </button>
                                        </div>

                                        {/* Reply Input */}
                                        {replyInputOpen === review.id && (
                                            <div className="mt-3 flex gap-2">
                                                <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder="Write a reply..."
                                                    className="flex-1 text-xs border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all"/>
                                                <button onClick={() => handleReplySubmit(review.id)}
                                                    className="text-xs bg-gray-900 text-white px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-colors font-semibold shadow-sm">
                                                    Send
                                                </button>
                                            </div>
                                        )}

                                        {/* Replies Section */}
                                        {review.replies && review.replies.length > 0 && (
                                            <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-100">
                                                {review.replies.map(reply => (
                                                    <div key={reply.id} className="text-sm">
                                                        <div className="flex items-center justify-between mb-1.5">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 text-white font-bold text-[9px] flex items-center justify-center">
                                                                    {reply.user?.name?.charAt(0).toUpperCase()}
                                                                </div>
                                                                <p className="font-bold text-gray-900 text-xs">{reply.user?.name}</p>
                                                                {reply.is_admin && (
                                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded-full uppercase tracking-wider">Admin</span>
                                                                )}
                                                            </div>
                                                            <div className="relative reply-menu">
                                                                <button onClick={() => setReplyMenuOpen(replyMenuOpen === reply.id ? null : reply.id)}
                                                                    className="text-gray-300 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
                                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                                                                    </svg>
                                                                </button>
                                                                {replyMenuOpen === reply.id && (
                                                                    <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-10 min-w-[90px]">
                                                                        {auth?.user?.id === reply.user?.id && (
                                                                            <>
                                                                                <button onClick={() => setReplyMenuOpen(null)}
                                                                                    className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 font-medium">Edit</button>
                                                                                <button onClick={() => setReplyMenuOpen(null)}
                                                                                    className="w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 font-medium">Delete</button>
                                                                            </>
                                                                        )}
                                                                        {auth?.user?.id !== reply.user?.id && (
                                                                            <button onClick={() => setReplyMenuOpen(null)}
                                                                                className="w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 font-medium">Report</button>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-600 text-xs leading-relaxed">{reply.comment}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            }
                            </div>

                            {/* Write Review */}
                            <div className="sticky top-24 h-fit lg:ml-8">
                                <div className="border border-gray-100 rounded-3xl p-6 shadow-sm">
                                    <h3 className="font-bold text-gray-900 text-lg">Write a Review</h3>
                                    <p className="text-xs text-gray-400 mt-1 mb-6">Share your experience to help other shoppers</p>
                                    {auth?.user ? (
                                        canReview ? (
                                            <form onSubmit={handleReviewSubmit}>
                                            {/* Star rating */}
                                            <div className="mb-5">
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Your rating</p>
                                                <div className="flex gap-1.5">
                                                    {[1,2,3,4,5].map(star => (
                                                        <button key={star} type="button"
                                                            onMouseEnter={() => setReviewHover(star)}
                                                            onMouseLeave={() => setReviewHover(0)}
                                                            onClick={() => setReviewRating(star)}
                                                            className="transition-transform hover:scale-125 active:scale-95">
                                                            <svg className={`w-9 h-9 transition-colors duration-200 ${star <= (reviewHover || reviewRating) ? 'text-amber-400 drop-shadow-sm' : 'text-gray-200'}`}
                                                                fill={star <= (reviewHover || reviewRating) ? 'currentColor' : 'none'}
                                                                stroke="currentColor" strokeWidth="1.5"
                                                                viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
                                                            </svg>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Textarea */}
                                            <div className="mb-4 relative">
                                                <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                                                    rows={5} required maxLength={1000}
                                                    placeholder="Share your thoughts about this product..."
                                                    className="w-full px-4 py-3 pb-10 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 text-sm text-gray-700 placeholder-gray-300 transition-all"/>
                                                <span className="absolute bottom-3 right-3 text-[11px] text-gray-300 font-medium">{reviewComment.length}/1000</span>
                                                <button type="button" onClick={() => photoInputRef.current?.click()}
                                                    className="absolute bottom-3 left-3 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-base font-bold leading-none transition-colors">
                                                    +
                                                </button>
                                                <input ref={photoInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoAdd}/>
                                            </div>
                                            {/* Photo preview */}
                                            {reviewImages.length > 0 && (
                                                <div className="flex gap-2 mb-3 flex-wrap">
                                                    {reviewImages.map(img => (
                                                        <div key={img.id} className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                                                            <img src={img.preview} className="w-full h-full object-cover"/>
                                                            <button type="button" onClick={() => handlePhotoRemove(img.id)}
                                                                className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 text-white rounded-full flex items-center justify-center text-xs hover:bg-black/80 transition-colors">
                                                                <X className="w-2.5 h-2.5"/>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <p className="text-[11px] text-gray-300 mb-5">Max 5 photos, each max 5MB</p>
                                            <button type="submit" disabled={isSubmittingReview || reviewRating === 0}
                                                className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold py-3.5 rounded-2xl hover:from-gray-800 hover:to-gray-700 disabled:opacity-40 flex items-center justify-center gap-2 text-sm transition-all duration-300 shadow-lg shadow-gray-900/20 hover:shadow-xl">
                                                {isSubmittingReview
                                                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/><span>Submitting...</span></>
                                                    : 'Submit Review'}
                                            </button>
                                        </form>
                                        ) : (
                                            <div className="text-center py-8">
                                                <svg className="w-14 h-14 mx-auto text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>
                                                <p className="text-sm text-gray-500 mb-4">You can only review products after delivery</p>
                                                <p className="text-xs text-gray-400">Please wait until your order is delivered to write a review.</p>
                                            </div>
                                        )
                                    ) : (
                                        <div className="text-center py-8">
                                            <svg className="w-14 h-14 mx-auto text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                            </svg>
                                            <p className="text-sm text-gray-500 mb-4">Login to write a review</p>
                                            <Link href="/login" className="inline-block bg-gray-900 text-white text-sm font-bold px-8 py-3 rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-lg shadow-gray-900/20">
                                                Login
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Q&A Tab */}
                {activeTab === 'qna' && (
                    <div className="max-w-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-gray-900">Questions & Answers</h3>
                            <button className="text-sm font-bold bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-2.5 rounded-2xl hover:from-gray-800 hover:to-gray-700 transition-all duration-300 shadow-md shadow-gray-900/20">
                                Ask a Question
                            </button>
                        </div>
                        <div className="text-center py-16 bg-gray-50 rounded-3xl">
                            <svg className="w-16 h-16 mx-auto text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <p className="text-sm text-gray-400 mb-1">No questions yet.</p>
                            <p className="text-xs text-gray-300">Be the first to ask a question!</p>
                        </div>
                    </div>
                )}
            </div>

            {/* ───────────────── FOOTER ───────────────── */}
            <footer className="bg-gray-950 text-gray-400 py-10">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <span className="text-2xl font-black text-white tracking-[0.3em]">VESTO</span>
                    <p className="text-xs">© 2026 Vesto. All rights reserved.</p>
                </div>
            </footer>

            {/* ───────────────── STICKY BOTTOM BAR ───────────────── */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-50 px-4 lg:px-8 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-sm">
                            <ImgWithFallback src={displayImages[0]} alt={product.name} className="w-full h-full" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{product.name}</p>
                            <p className="text-xs text-gray-400">
                                {selectedVariant
                                    ? `${selectedVariant.color || ''} ${selectedVariant.size || ''}`.trim() || 'Selected'
                                    : isConfigurable ? 'Select variant' : 'In stock'}
                            </p>
                        </div>
                        <p className="text-sm font-extrabold text-gray-900 flex-shrink-0 ml-1">{fmt(displayPrice)}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <button onClick={handleAddToCart}
                            disabled={(isConfigurable && !selectedVariant)}
                            className="flex items-center gap-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:from-gray-800 hover:to-gray-700 disabled:opacity-40 transition-all duration-200 shadow-md">
                            <ShoppingCart className="w-4 h-4" />
                            <span className="hidden sm:inline">Add to Cart</span>
                        </button>
                        <button disabled={(isConfigurable && !selectedVariant)}
                            className="border-2 border-gray-900 text-gray-900 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-gray-900 hover:text-white disabled:opacity-40 transition-all duration-200">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            {/* ───────────────── LIGHTBOX ───────────────── */}
            {lightboxOpen && (
                <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
                    <button onClick={() => setLightboxOpen(false)}
                        className="absolute top-4 right-4 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm">
                        <X className="w-5 h-5" />
                    </button>
                    <img src={displayImages[activeImg] || displayImages[0]} alt={product.name}
                        className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
                        onClick={e => e.stopPropagation()} />
                    {displayImages.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
                            {displayImages.map((_, idx) => (
                                <button key={idx} onClick={e => { e.stopPropagation(); setActiveImg(idx); }}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeImg ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'}`} />
                            ))}
                        </div>
                    )}
                    {/* Lightbox nav arrows */}
                    {displayImages.length > 1 && (
                        <>
                            <button onClick={e => { e.stopPropagation(); setActiveImg(prev => Math.max(0, prev - 1)); }}
                                disabled={activeImg === 0}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button onClick={e => { e.stopPropagation(); setActiveImg(prev => Math.min(displayImages.length - 1, prev + 1)); }}
                                disabled={activeImg === displayImages.length - 1}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* ───────────────── REVIEW IMAGE MODAL ───────────────── */}
            {reviewImageModal.open && reviewImageModal.review && (
                <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col">
                    <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                                {reviewImageModal.review.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-white text-sm font-bold">{reviewImageModal.review.user?.name}</p>
                                <p className="text-gray-400 text-xs">
                                    {reviewImageModal.imageIndex + 1} / {reviewImageModal.review.images.length}
                                </p>
                            </div>
                        </div>
                        <button onClick={closeReviewImageModal}
                            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 flex items-center justify-center p-4 relative">
                        <img src={reviewImageModal.review.images[reviewImageModal.imageIndex]}
                            alt="Review image"
                            className="max-h-[70vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl" />
                        {reviewImageModal.review.images.length > 1 && (
                            <>
                                <button onClick={prevImage} disabled={reviewImageModal.imageIndex === 0}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm">
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button onClick={nextImage} disabled={reviewImageModal.imageIndex === reviewImageModal.review.images.length - 1}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm">
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                        <button onClick={goToPrevCustomer}
                            disabled={localReviews.findIndex(r => r.id === reviewImageModal.review.id) === 0}
                            className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm">
                            <ChevronUp className="w-6 h-6" />
                        </button>
                        <button onClick={goToNextCustomer}
                            disabled={localReviews.findIndex(r => r.id === reviewImageModal.review.id) === localReviews.length - 1}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm">
                            <ChevronDown className="w-6 h-6" />
                        </button>
                        <div className="absolute bottom-6 right-6 text-white/50 text-[10px] flex flex-col gap-1 bg-black/30 backdrop-blur-sm px-3 py-2 rounded-xl">
                            <div className="flex items-center gap-1.5">
                                <ChevronLeft className="w-3 h-3" />
                                <span>Same customer</span>
                                <ChevronRight className="w-3 h-3" />
                            </div>
                            <div className="flex items-center gap-1.5">
                                <ChevronUp className="w-3 h-3" />
                                <span>Different customer</span>
                                <ChevronDown className="w-3 h-3" />
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-black/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <StarRating rating={reviewImageModal.review.rating} size="sm" />
                            <p className="text-gray-400 text-xs">{reviewImageModal.review.created_at}</p>
                        </div>
                        <p className="text-white text-sm">{reviewImageModal.review.comment}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

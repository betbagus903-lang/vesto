import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

// Local ImgWithFallback component
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

export default function StackGallery({ images = [], onImageChange, className = '' }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);
    const onImageChangeRef = useRef(onImageChange);

    // Update ref when onImageChange changes
    useEffect(() => {
        onImageChangeRef.current = onImageChange;
    }, [onImageChange]);

    // Reset activeIndex when images array actually changes (variant switch)
    const prevImagesRef = useRef(images);
    useEffect(() => {
        // Only reset if images array reference changed AND length is different
        if (prevImagesRef.current !== images && prevImagesRef.current?.length !== images?.length) {
            setActiveIndex(0);
            if (onImageChangeRef.current) {
                onImageChangeRef.current(0);
            }
            prevImagesRef.current = images;
        }
    }, [images]);

    // Notify parent of image changes (without causing loop)
    // Disabled to prevent circular dependency issues
    // useEffect(() => {
    //     if (onImageChangeRef.current) {
    //         onImageChangeRef.current(activeIndex);
    //     }
    // }, [activeIndex]);

    const handleNext = () => {
        console.log('handleNext clicked', { activeIndex, imagesLength: images.length });
        if (images.length <= 1) return;
        setActiveIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        console.log('handlePrev clicked', { activeIndex, imagesLength: images.length });
        if (images.length <= 1) return;
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [images.length]);

    // Fallback: single image - simple display without stack
    if (images.length <= 1) {
        return (
            <div className={`relative group ${className}`}>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden aspect-[3/4] border border-gray-100 relative">
                    <ImgWithFallback
                        src={images[0] || '/placeholder.jpg'}
                        alt="Product image"
                        className="w-full h-full transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                </div>
            </div>
        );
    }

    // Stack gallery for multiple images
    const visibleCount = Math.min(5, images.length); // Show max 5 stacked cards
    
    return (
        <div className={`relative group ${className}`} ref={containerRef}>
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden aspect-[3/4] border border-gray-100">
                {/* Stacked cards */}
                <div className="relative w-full h-full">
                    {[...Array(visibleCount)].map((_, i) => {
                        // Calculate offset from active index (circular)
                        const offsetIndex = (activeIndex + i) % images.length;
                        const isActive = i === 0;
                        
                        // Stack effect: translate + scale + opacity
                        const translateX = i * 20; // Horizontal offset
                        const translateY = i * 15; // Vertical offset
                        const scale = 1 - (i * 0.08); // Scale down
                        const opacity = 1 - (i * 0.2); // Fade out
                        const zIndex = visibleCount - i;
                        
                        return (
                            <div
                                key={`${offsetIndex}-${i}`}
                                className="absolute inset-0 transition-all duration-300 ease-out"
                                style={{
                                    transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                                    opacity: Math.max(0, opacity),
                                    zIndex: zIndex,
                                }}
                            >
                                <ImgWithFallback
                                    src={images[offsetIndex]}
                                    alt={`View ${offsetIndex + 1}`}
                                    className="w-full h-full object-cover rounded-3xl shadow-lg"
                                />
                                
                                {/* Only active card gets interactive elements */}
                                {isActive && (
                                    <>
                                        {/* Zoom button */}
                                        <button
                                            className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white z-20"
                                            onClick={() => {/* Lightbox handler can be added */}}
                                        >
                                            <ZoomIn className="w-4.5 h-4.5 text-gray-700" />
                                        </button>
                                        
                                        {/* Image counter */}
                                        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full z-20">
                                            {activeIndex + 1} / {images.length}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Navigation buttons */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePrev();
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white z-50"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNext();
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white z-50"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

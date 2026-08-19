import { Link } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/* ── Animation Presets ───────────────────────────────────── */
const ANIMATION_PRESETS = {
    none: null,
    'fade-in': {
        from: { opacity: 0 },
        to: { opacity: 1, duration: 0.6, ease: 'power2.out' }
    },
    'fade-up': {
        from: { opacity: 0, y: 30 },
        to: { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    },
    'zoom-in': {
        from: { opacity: 0, scale: 0.9 },
        to: { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.7)' }
    },
    'slide-left': {
        from: { opacity: 0, x: -50 },
        to: { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }
    }
};

/* ── Block Components ─────────────────────────────────────── */
function ImageBlock({ src, alt = '', objectFit = 'cover', animation = 'none', className = '' }) {
    const ref = useRef(null);
    
    useEffect(() => {
        if (ref.current && ANIMATION_PRESETS[animation]) {
            gsap.fromTo(ref.current, ANIMATION_PRESETS[animation].from, ANIMATION_PRESETS[animation].to);
        }
    }, [animation]);

    return (
        <img
            ref={ref}
            src={src}
            alt={alt}
            style={{ objectFit }}
            className={className}
        />
    );
}

function HeadingBlock({ text, size = '2xl', color = '#FFFFFF', animation = 'none', className = '' }) {
    const ref = useRef(null);
    
    const sizeClasses = {
        sm: 'text-lg',
        base: 'text-xl',
        lg: 'text-2xl',
        xl: 'text-3xl',
        '2xl': 'text-4xl',
        '3xl': 'text-5xl',
        '4xl': 'text-6xl',
    };

    useEffect(() => {
        if (ref.current && ANIMATION_PRESETS[animation]) {
            gsap.fromTo(ref.current, ANIMATION_PRESETS[animation].from, ANIMATION_PRESETS[animation].to);
        }
    }, [animation]);

    return (
        <h2
            ref={ref}
            style={{ color }}
            className={`${sizeClasses[size] || sizeClasses['2xl']} font-bold ${className}`}
        >
            {text}
        </h2>
    );
}

function TextBlock({ text, color = '#A8B3CF', animation = 'none', className = '' }) {
    const ref = useRef(null);
    
    useEffect(() => {
        if (ref.current && ANIMATION_PRESETS[animation]) {
            gsap.fromTo(ref.current, ANIMATION_PRESETS[animation].from, ANIMATION_PRESETS[animation].to);
        }
    }, [animation]);

    return (
        <p
            ref={ref}
            style={{ color }}
            className={`text-sm leading-relaxed ${className}`}
        >
            {text}
        </p>
    );
}

function ButtonBlock({ label, href, variant = 'primary', animation = 'none', className = '' }) {
    const ref = useRef(null);
    
    const variantStyles = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-white hover:bg-gray-100 text-gray-900',
        outline: 'border-2 border-white text-white hover:bg-white/10',
    };

    useEffect(() => {
        if (ref.current && ANIMATION_PRESETS[animation]) {
            gsap.fromTo(ref.current, ANIMATION_PRESETS[animation].from, ANIMATION_PRESETS[animation].to);
        }
    }, [animation]);

    const Component = href?.startsWith('http') ? 'a' : Link;

    return (
        <Component
            ref={ref}
            href={href}
            className={`${variantStyles[variant] || variantStyles.primary} px-6 py-3 rounded-lg font-medium transition-colors ${className}`}
        >
            {label}
        </Component>
    );
}

function SpacerBlock({ height = 20, className = '' }) {
    return <div style={{ height }} className={className} />;
}

/* ── Block Registry ───────────────────────────────────────── */
const BLOCK_COMPONENTS = {
    image: ImageBlock,
    heading: HeadingBlock,
    text: TextBlock,
    button: ButtonBlock,
    spacer: SpacerBlock,
};

/* ── Main BannerRenderer ─────────────────────────────────── */
export default function BannerRenderer({ layoutJson = [], className = '' }) {
    if (!layoutJson || layoutJson.length === 0) {
        return null;
    }

    return (
        <div className={className}>
            {layoutJson.map((block, index) => {
                const Component = BLOCK_COMPONENTS[block.type];
                if (!Component) return null;
                
                return (
                    <Component
                        key={block.id || index}
                        {...block.props}
                        animation={block.animation || 'none'}
                    />
                );
            })}
        </div>
    );
}

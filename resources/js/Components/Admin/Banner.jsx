import React from 'react';
import { Link } from '@inertiajs/react';

const Banner = ({
    title = 'NEW ARRIVAL',
    subtitle = 'Discover our latest collection',
    description = 'Explore the newest trends and styles in our curated selection. Fresh arrivals just for you.',
    backgroundColor = 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
    imageUrl = '',
    buttonText = 'Shop Now',
    buttonLink = '#',
    showDiscount = true,
    discountText = 'UP TO 50% OFF',
    height = '400px',
    borderRadius = '16px',
    onClick = () => {}
}) => {
    const bannerStyle = {
        background: backgroundColor,
        height: height,
        borderRadius: borderRadius
    };

    const handleClick = () => {
        onClick();
    };

    return (
        <div 
            className="relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-black/20"
            style={bannerStyle}
            onClick={handleClick}
        >
            {/* Background Image with Overlay */}
            {imageUrl && (
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1E293B]/95 via-[#1E293B]/70 to-transparent"></div>
                </div>
            )}

            {/* Content Container */}
            <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="max-w-2xl">
                        {/* Discount Badge */}
                        {showDiscount && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white rounded-full text-sm font-semibold mb-6 animate-pulse">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                                {discountText}
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            {title}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl md:text-2xl text-[#94A3B8] mb-4 font-medium">
                            {subtitle}
                        </p>

                        {/* Description */}
                        <p className="text-base md:text-lg text-[#64748B] mb-8 max-w-lg">
                            {description}
                        </p>

                        {/* CTA Button */}
                        <Link
                            href={buttonLink}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#3B82F6]/30"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {buttonText}
                            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#8B5CF6]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            {/* Animated Border Gradient */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/20 via-[#8B5CF6]/20 to-[#3B82F6]/20"></div>
            </div>
        </div>
    );
};

export default Banner;
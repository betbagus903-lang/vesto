import { useState } from 'react';
import { Share2, Facebook, Twitter, Link as LinkIcon, X, Check } from 'lucide-react';

export default function ShareProduct({ product, onClose }) {
    const [copied, setCopied] = useState(false);

    if (!product) return null;

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = product.name;
    const shareDescription = product.description || `Check out ${product.name} on Vesto!`;

    const handleShare = (platform) => {
        let url = '';
        
        switch (platform) {
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
                break;
            case 'whatsapp':
                url = `https://wa.me/?text=${encodeURIComponent(`${shareTitle} - ${shareUrl}`)}`;
                break;
            case 'pinterest':
                url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareDescription)}`;
                break;
            default:
                return;
        }

        window.open(url, '_blank', 'width=600,height=400');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareOptions = [
        { platform: 'facebook', icon: Facebook, label: 'Facebook', color: 'bg-blue-600' },
        { platform: 'twitter', icon: Twitter, label: 'Twitter', color: 'bg-sky-500' },
        { platform: 'whatsapp', icon: null, label: 'WhatsApp', color: 'bg-green-500', customIcon: '📱' },
        { platform: 'pinterest', icon: null, label: 'Pinterest', color: 'bg-red-600', customIcon: '📌' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Share2 className="w-5 h-5 text-gray-700" />
                        <h2 className="text-lg font-bold text-gray-900">Share Product</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-700" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Product Preview */}
                    <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {product.image || product.images?.[0] ? (
                                <img
                                    src={product.image || product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">No image</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                            <p className="text-sm text-gray-500 truncate">{shareUrl}</p>
                        </div>
                    </div>

                    {/* Share Options */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {shareOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                                <button
                                    key={option.platform}
                                    onClick={() => handleShare(option.platform)}
                                    className={`flex items-center justify-center gap-2 p-4 rounded-xl ${option.color} text-white hover:opacity-90 transition-opacity`}
                                >
                                    {option.customIcon ? (
                                        <span className="text-xl">{option.customIcon}</span>
                                    ) : Icon ? (
                                        <Icon size={20} />
                                    ) : null}
                                    <span className="font-medium">{option.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Copy Link */}
                    <div className="border border-gray-200 rounded-xl p-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Share Link</p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={shareUrl}
                                readOnly
                                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none"
                            />
                            <button
                                onClick={handleCopyLink}
                                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                            >
                                {copied ? (
                                    <>
                                        <Check size={16} />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <LinkIcon size={16} />
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items = [], className = '' }) {
    if (!items || items.length === 0) return null;

    return (
        <nav className={`flex items-center gap-2 text-sm ${className}`} aria-label="Breadcrumb">
            <Link
                href="/"
                className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors"
            >
                <Home size={16} />
                <span className="sr-only">Home</span>
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <ChevronRight size={14} className="text-gray-400" />
                    {index === items.length - 1 ? (
                        <span className="text-gray-900 font-medium">{item.label}</span>
                    ) : item.href ? (
                        <Link
                            href={item.href}
                            className="text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-500">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}

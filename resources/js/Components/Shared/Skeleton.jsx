export function Skeleton({ className = '', variant = 'default' }) {
    const baseClasses = 'animate-pulse bg-gray-200 rounded';
    
    const variantClasses = {
        default: 'h-4 w-full',
        text: 'h-4 w-3/4',
        title: 'h-6 w-1/2',
        avatar: 'h-10 w-10 rounded-full',
        button: 'h-10 w-24 rounded-lg',
        card: 'h-48 w-full rounded-xl',
        image: 'h-64 w-full rounded-xl',
        thumbnail: 'h-20 w-20 rounded-lg',
    };

    return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton variant="image" />
            <div className="space-y-2">
                <Skeleton variant="text" />
                <Skeleton variant="title" />
                <Skeleton variant="button" />
            </div>
        </div>
    );
}

export function ProductGridSkeleton({ count = 8 }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function ProductDetailSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <Skeleton variant="image" className="h-96" />
            </div>
            <div className="space-y-6">
                <Skeleton variant="title" className="h-8" />
                <Skeleton variant="text" className="h-6" />
                <Skeleton variant="card" className="h-32" />
                <div className="space-y-3">
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                </div>
                <Skeleton variant="button" className="h-12 w-full" />
            </div>
        </div>
    );
}

export function CartItemSkeleton() {
    return (
        <div className="flex gap-4 p-4 border border-gray-200 rounded-lg">
            <Skeleton variant="thumbnail" />
            <div className="flex-1 space-y-2">
                <Skeleton variant="text" />
                <Skeleton variant="text" className="w-1/2" />
                <Skeleton variant="button" />
            </div>
        </div>
    );
}

export function OrderCardSkeleton() {
    return (
        <div className="bg-[#1e293b] rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton variant="text" className="w-24" />
                    <Skeleton variant="text" className="w-32" />
                </div>
                <Skeleton variant="button" />
            </div>
            <div className="space-y-2">
                <Skeleton variant="thumbnail" />
                <Skeleton variant="text" />
            </div>
        </div>
    );
}

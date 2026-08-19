import { useEffect, useState } from 'react';

const STORAGE_KEY = 'vesto_recently_viewed';
const MAX_ITEMS = 10;

export function useRecentlyViewed() {
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    useEffect(() => {
        // Load from localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setRecentlyViewed(JSON.parse(stored));
            } catch (e) {
                console.error('Error parsing recently viewed:', e);
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    const addToRecentlyViewed = (product) => {
        if (!product || !product.id) return;

        setRecentlyViewed(prev => {
            // Remove if already exists
            const filtered = prev.filter(p => p.id !== product.id);
            // Add to beginning
            const updated = [product, ...filtered].slice(0, MAX_ITEMS);
            // Save to localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const clearRecentlyViewed = () => {
        setRecentlyViewed([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        recentlyViewed,
        addToRecentlyViewed,
        clearRecentlyViewed,
    };
}

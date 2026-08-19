import { useState, useEffect } from 'react';

const STORAGE_KEY = 'vesto_recently_viewed';
const CART_KEY = 'vesto_cart';

export function useProductRecommendations(allProducts = []) {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        if (allProducts.length === 0) return;

        // Get recently viewed products
        const recentlyViewed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        
        // Get cart items
        const cartItems = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

        // Extract categories from recently viewed and cart
        const viewedCategories = recentlyViewed.map(p => p.category).filter(Boolean);
        const cartCategories = cartItems.map(item => item.category).filter(Boolean);
        const allCategories = [...new Set([...viewedCategories, ...cartCategories])];

        // Extract viewed product IDs to exclude them
        const viewedIds = new Set(recentlyViewed.map(p => p.id));

        // Get products from same categories
        const categoryMatches = allProducts.filter(product => 
            !viewedIds.has(product.id) && 
            allCategories.includes(product.category)
        );

        // Get products with similar price range (±20% of viewed products)
        const viewedPrices = recentlyViewed.map(p => p.price).filter(Boolean);
        const avgViewedPrice = viewedPrices.length > 0 
            ? viewedPrices.reduce((sum, p) => sum + p, 0) / viewedPrices.length 
            : 0;

        const priceMatches = allProducts.filter(product => 
            !viewedIds.has(product.id) &&
            product.price >= avgViewedPrice * 0.8 &&
            product.price <= avgViewedPrice * 1.2
        );

        // Combine and deduplicate recommendations
        const allRecommendations = [...categoryMatches, ...priceMatches];
        const uniqueRecommendations = Array.from(
            new Map(allRecommendations.map(p => [p.id, p])).values()
        );

        // Sort by relevance (category matches first, then price matches)
        const sortedRecommendations = uniqueRecommendations.sort((a, b) => {
            const aCategoryMatch = categoryMatches.includes(a);
            const bCategoryMatch = categoryMatches.includes(b);
            
            if (aCategoryMatch && !bCategoryMatch) return -1;
            if (!aCategoryMatch && bCategoryMatch) return 1;
            
            return 0;
        });

        // Return top 8 recommendations
        setRecommendations(sortedRecommendations.slice(0, 8));
    }, [allProducts]);

    return { recommendations };
}

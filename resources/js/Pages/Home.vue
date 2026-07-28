<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <nav class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <a href="/" class="text-2xl font-bold text-gray-800">Vesto</a>
                    </div>
                    <div class="flex items-center space-x-4">
                        <a href="/" class="text-gray-700 hover:text-gray-900">Home</a>
                        <a href="/shop" class="text-gray-700 hover:text-gray-900 font-semibold">Shop</a>
                        <a v-if="auth.user" href="/dashboard" class="text-gray-700 hover:text-gray-900">Dashboard</a>
                        <a v-else href="/login" class="text-gray-700 hover:text-gray-900">Login</a>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Shop Header -->
        <div class="bg-white border-b">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 class="text-3xl font-bold text-gray-900">Shop</h1>
                <p class="text-gray-600 mt-2">Browse our collection of products</p>
            </div>
        </div>

        <!-- Products Grid -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div v-for="i in 8" :key="i" class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                    <div class="aspect-w-1 aspect-h-1 bg-gray-200">
                        <div class="w-full h-48 bg-gray-200 flex items-center justify-center">
                            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <div class="p-4">
                        <h3 class="text-lg font-semibold text-gray-900 mb-1">Product {{ i }}</h3>
                        <p class="text-gray-600 text-sm mb-2">Description for product {{ i }}</p>
                        <div class="flex items-center justify-between">
                            <span class="text-lg font-bold text-gray-900">Rp {{ (i * 100000).toLocaleString('id-ID') }}</span>
                            <button class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    auth: {
        type: Object,
        default: () => ({ user: null })
    }
})
</script>

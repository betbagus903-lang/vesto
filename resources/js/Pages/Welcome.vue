<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <nav class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <h1 class="text-2xl font-bold text-gray-800">Vesto</h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <a v-if="!canLogin" href="/login" class="text-gray-700 hover:text-gray-900">Login</a>
                        <a v-if="canLogin" href="/dashboard" class="text-gray-700 hover:text-gray-900">Dashboard</a>
                        <a href="/shop" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Shop</a>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="text-center">
                <h2 class="text-4xl font-bold text-gray-900 mb-4">Welcome to Vesto</h2>
                <p class="text-xl text-gray-600 mb-8">Your one-stop shop for quality products</p>
                <div class="flex justify-center space-x-4">
                    <a href="/shop" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-lg">
                        Start Shopping
                    </a>
                    <a v-if="!canLogin" href="/login" class="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition text-lg">
                        Login
                    </a>
                </div>
            </div>
        </div>

        <!-- Features -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-white p-6 rounded-lg shadow-sm">
                    <div class="text-blue-600 mb-4">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">Quality Products</h3>
                    <p class="text-gray-600">Browse through our carefully curated selection of products</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-sm">
                    <div class="text-blue-600 mb-4">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">Fast Delivery</h3>
                    <p class="text-gray-600">Get your orders delivered quickly to your doorstep</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-sm">
                    <div class="text-blue-600 mb-4">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">Secure Payments</h3>
                    <p class="text-gray-600">Shop with confidence using our secure payment system</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    canLogin: {
        type: Boolean,
        default: false
    },
    canRegister: {
        type: Boolean,
        default: false
    },
    auth: {
        type: Object,
        default: () => ({ user: null })
    }
})
</script>

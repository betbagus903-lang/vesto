<script setup>
import { ref } from 'vue';
import { useTheme } from '../../hooks/useTheme';

const emit = defineEmits(['toggle-sidebar']);

const { theme, toggleTheme } = useTheme();

const showUserDropdown = ref(false);
const showNotifications = ref(false);
const showMessages = ref(false);
const showLanguageDropdown = ref(false);

const currentLanguage = ref('en');

const languages = [
    { code: 'en', name: 'English' },
    { code: 'id', name: 'Indonesia' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
];

const setLanguage = (code) => {
    currentLanguage.value = code;
    showLanguageDropdown.value = false;
};

const notifications = ref([
    { id: 1, title: 'New order received', message: 'Order #1234 has been placed', time: '2 min ago', unread: true },
    { id: 2, title: 'Low stock alert', message: 'Product XYZ is running low', time: '15 min ago', unread: true },
    { id: 3, title: 'New customer', message: 'John Doe just registered', time: '1 hour ago', unread: false },
]);

const messages = ref([
    { id: 1, sender: 'Alice', message: 'Hey, can you check the inventory?', time: '5 min ago', unread: true },
    { id: 2, sender: 'Bob', message: 'The report is ready', time: '1 hour ago', unread: false },
]);
</script>

<template>
    <header class="h-16 bg-gray-100 dark:bg-[#1E293B] border-b border-gray-200 dark:border-white/8 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
        <!-- Left Section -->
        <div class="flex items-center gap-4">
            <!-- Mobile Menu Toggle -->
            <button 
                @click="emit('toggle-sidebar')"
                class="lg:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/5 transition text-gray-500 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white"
            >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <!-- Breadcrumb -->
            <nav class="hidden md:flex items-center gap-2 text-sm">
                <a href="/admin/dashboard" class="text-gray-500 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white transition">Dashboard</a>
                <span class="text-gray-400 dark:text-[#94A3B8]">/</span>
                <span class="text-gray-900 dark:text-white font-medium">Overview</span>
            </nav>
        </div>

        <!-- Center Section - Search -->
        <div class="flex-1 max-w-xl mx-4 hidden md:block">
            <div class="relative">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                    type="text" 
                    placeholder="Search anything..." 
                    class="w-full bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-white/8 rounded-xl pl-10 pr-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#94A3B8] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                >
                <kbd class="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-100 dark:bg-white/5 rounded text-xs text-gray-400 dark:text-[#94A3B8] hidden sm:block">
                    ⌘K
                </kbd>
            </div>
        </div>

        <!-- Right Section -->
        <div class="flex items-center gap-2">
            <!-- Quick Action Button -->
            <button class="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 text-sm font-medium">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Quick Action</span>
            </button>

            <!-- Notifications -->
            <div class="relative">
                <button 
                    @click="showNotifications = !showNotifications"
                    class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/5 transition text-gray-500 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white relative"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span v-if="notifications.filter(n => n.unread).length > 0" class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <!-- Notifications Dropdown -->
                <div 
                    v-if="showNotifications"
                    class="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#1E293B] rounded-xl shadow-2xl border border-gray-200 dark:border-white/8 overflow-hidden z-50"
                >
                    <div class="p-4 border-b border-gray-200 dark:border-white/8 flex items-center justify-between">
                        <h3 class="text-gray-900 dark:text-white font-semibold">Notifications</h3>
                        <span class="text-xs text-gray-500 dark:text-[#94A3B8]">{{ notifications.filter(n => n.unread).length }} unread</span>
                    </div>
                    <div class="max-h-64 overflow-y-auto">
                        <div 
                            v-for="notification in notifications"
                            :key="notification.id"
                            class="p-4 hover:bg-gray-100 dark:hover:bg-white/5 transition cursor-pointer border-b border-gray-200 dark:border-white/8 last:border-0"
                            :class="{ 'bg-gray-100 dark:bg-white/5': notification.unread }"
                        >
                            <p class="text-gray-900 dark:text-white text-sm font-medium">{{ notification.title }}</p>
                            <p class="text-gray-500 dark:text-[#94A3B8] text-xs mt-1">{{ notification.message }}</p>
                            <p class="text-gray-400 dark:text-[#94A3B8] text-xs mt-2">{{ notification.time }}</p>
                        </div>
                    </div>
                    <div class="p-3 border-t border-gray-200 dark:border-white/8">
                        <button class="w-full text-center text-sm text-blue-500 hover:text-blue-600 transition">
                            View All Notifications
                        </button>
                    </div>
                </div>
            </div>

            <!-- Messages -->
            <div class="relative">
                <button 
                    @click="showMessages = !showMessages"
                    class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/5 transition text-gray-500 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white relative"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span v-if="messages.filter(m => m.unread).length > 0" class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <!-- Messages Dropdown -->
                <div 
                    v-if="showMessages"
                    class="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#1E293B] rounded-xl shadow-2xl border border-gray-200 dark:border-white/8 overflow-hidden z-50"
                >
                    <div class="p-4 border-b border-gray-200 dark:border-white/8">
                        <h3 class="text-gray-900 dark:text-white font-semibold">Messages</h3>
                    </div>
                    <div class="max-h-64 overflow-y-auto">
                        <div 
                            v-for="message in messages"
                            :key="message.id"
                            class="p-4 hover:bg-gray-100 dark:hover:bg-white/5 transition cursor-pointer border-b border-gray-200 dark:border-white/8 last:border-0"
                        >
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                    {{ message.sender[0] }}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-gray-900 dark:text-white text-sm font-medium">{{ message.sender }}</p>
                                    <p class="text-gray-500 dark:text-[#94A3B8] text-xs truncate">{{ message.message }}</p>
                                </div>
                            </div>
                            <p class="text-gray-400 dark:text-[#94A3B8] text-xs mt-2">{{ message.time }}</p>
                        </div>
                    </div>
                    <div class="p-3 border-t border-gray-200 dark:border-white/8">
                        <button class="w-full text-center text-sm text-blue-500 hover:text-blue-600 transition">
                            View All Messages
                        </button>
                    </div>
                </div>
            </div>

            <!-- Theme Switch -->
            <button 
                @click="toggleTheme"
                class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/5 transition text-gray-500 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white"
            >
                <svg v-if="theme === 'dark'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            </button>

            <!-- Language Selector -->
            <div class="relative">
                <button 
                    @click="showLanguageDropdown = !showLanguageDropdown"
                    class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/5 transition text-gray-500 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white flex items-center gap-1"
                >
                    <span class="text-sm font-medium uppercase">{{ currentLanguage }}</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <!-- Language Dropdown -->
                <div 
                    v-if="showLanguageDropdown"
                    class="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-[#1E293B] rounded-xl shadow-2xl border border-gray-200 dark:border-white/8 overflow-hidden z-50"
                >
                    <button 
                        v-for="lang in languages"
                        :key="lang.code"
                        @click="setLanguage(lang.code)"
                        class="w-full px-4 py-2 text-left text-sm text-gray-500 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition"
                        :class="{ 'text-gray-900 dark:text-white bg-gray-100 dark:bg-white/5': currentLanguage === lang.code }"
                    >
                        {{ lang.name }}
                    </button>
                </div>
            </div>

            <!-- User Dropdown -->
            <div class="relative">
                <button 
                    @click="showUserDropdown = !showUserDropdown"
                    class="flex items-center gap-3 p-1 pr-3 rounded-lg hover:bg-gray-200 dark:hover:bg-white/5 transition"
                >
                    <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        A
                    </div>
                    <div class="hidden md:block text-left">
                        <p class="text-gray-900 dark:text-white text-sm font-medium">Admin User</p>
                        <p class="text-gray-500 dark:text-[#94A3B8] text-xs">Super Admin</p>
                    </div>
                    <svg class="w-4 h-4 text-gray-400 dark:text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <!-- User Dropdown -->
                <div 
                    v-if="showUserDropdown"
                    class="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#1E293B] rounded-xl shadow-2xl border border-gray-200 dark:border-white/8 overflow-hidden z-50"
                >
                    <div class="p-4 border-b border-gray-200 dark:border-white/8">
                        <p class="text-gray-900 dark:text-white font-medium">Admin User</p>
                        <p class="text-gray-500 dark:text-[#94A3B8] text-sm">admin@vesto.com</p>
                    </div>
                    <div class="py-2">
                        <a href="/admin/profile" class="block px-4 py-2 text-sm text-gray-500 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition">
                            Profile
                        </a>
                        <a href="/admin/settings" class="block px-4 py-2 text-sm text-gray-500 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition">
                            Settings
                        </a>
                        <a href="/admin/billing" class="block px-4 py-2 text-sm text-gray-500 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition">
                            Billing
                        </a>
                    </div>
                    <div class="border-t border-gray-200 dark:border-white/8 py-2">
                        <a href="/logout" class="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-white/5 transition">
                            Sign Out
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

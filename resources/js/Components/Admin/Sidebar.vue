<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    isCollapsed: {
        type: Boolean,
        default: false
    },
    isMobileOpen: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['toggle-collapse', 'close-mobile']);

const expandedMenus = ref({});

const toggleMenu = (menuName) => {
    expandedMenus.value[menuName] = !expandedMenus.value[menuName];
};

const menuItems = [
    {
        name: 'Dashboard',
        icon: '🏠',
        route: '/admin/dashboard'
    },
    {
        name: 'Products',
        icon: '📦',
        route: '/admin/products'
    },
    {
        name: 'Categories',
        icon: '🏷️',
        route: '/admin/categories'
    },
    {
        name: 'Inventory',
        icon: '📋',
        route: '/admin/inventory'
    },
    {
        name: 'Orders',
        icon: '🛒',
        route: '/admin/orders'
    },
    {
        name: 'Customers',
        icon: '👥',
        route: '/admin/customers'
    },
    {
        name: 'Reports',
        icon: '📊',
        hasSubmenu: true,
        submenu: [
            { name: 'Sales Report', route: '/admin/reports/sales' },
            { name: 'Inventory Report', route: '/admin/reports/inventory' },
            { name: 'Customer Report', route: '/admin/reports/customers' }
        ]
    },
    {
        name: 'Marketing',
        icon: '📢',
        hasSubmenu: true,
        submenu: [
            { name: 'Campaigns', route: '/admin/marketing/campaigns' },
            { name: 'Coupons', route: '/admin/marketing/coupons' },
            { name: 'SEO', route: '/admin/marketing/seo' }
        ]
    },
    {
        name: 'Notifications',
        icon: '🔔',
        route: '/admin/notifications'
    },
    {
        name: 'Messages',
        icon: '💬',
        route: '/admin/messages'
    },
    {
        name: 'CMS',
        icon: '📝',
        hasSubmenu: true,
        submenu: [
            { name: 'Pages', route: '/admin/cms/pages' },
            { name: 'Blogs', route: '/admin/cms/blogs' },
            { name: 'Media', route: '/admin/cms/media' }
        ]
    },
    {
        name: 'Settings',
        icon: '⚙️',
        hasSubmenu: true,
        submenu: [
            { name: 'General', route: '/admin/settings/general' },
            { name: 'Security', route: '/admin/settings/security' },
            { name: 'Email', route: '/admin/settings/email' }
        ]
    },
    {
        name: 'User Management',
        icon: '👤',
        route: '/admin/users'
    },
    {
        name: 'Roles & Permissions',
        icon: '🔐',
        route: '/admin/roles'
    },
    {
        name: 'Activity Logs',
        icon: '📜',
        route: '/admin/activity-logs'
    },
    {
        name: 'Help Center',
        icon: '❓',
        route: '/admin/help'
    }
];

const sidebarWidth = computed(() => {
    if (props.isCollapsed) return 'w-20';
    return 'w-64';
});
</script>

<template>
    <aside 
        :class="[
            'fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out',
            sidebarWidth,
            'bg-gray-50 dark:bg-[#111827] border-r border-gray-200 dark:border-white/8'
        ]"
    >
        <!-- Logo Section -->
        <div class="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-white/8">
            <div v-if="!isCollapsed" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold">
                    V
                </div>
                <span class="text-gray-900 dark:text-white font-semibold text-lg">Vesto</span>
            </div>
            <div v-else class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold mx-auto">
                V
            </div>
            <button 
                @click="emit('toggle-collapse')"
                class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/5 transition text-gray-500 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white"
            >
                <svg v-if="!isCollapsed" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
            </button>
        </div>

        <!-- Menu Items -->
        <nav class="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
            <ul class="space-y-1">
                <li v-for="item in menuItems" :key="item.name">
                    <!-- Menu Item without Submenu -->
                    <a 
                        v-if="!item.hasSubmenu"
                        :href="item.route"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5 transition-all duration-200 group"
                    >
                        <span class="text-xl flex-shrink-0">{{ item.icon }}</span>
                        <span v-if="!isCollapsed" class="font-medium text-sm">{{ item.name }}</span>
                    </a>

                    <!-- Menu Item with Submenu -->
                    <div v-else>
                        <button 
                            @click="toggleMenu(item.name)"
                            class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-500 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5 transition-all duration-200 group"
                        >
                            <div class="flex items-center gap-3">
                                <span class="text-xl flex-shrink-0">{{ item.icon }}</span>
                                <span v-if="!isCollapsed" class="font-medium text-sm">{{ item.name }}</span>
                            </div>
                            <svg 
                                v-if="!isCollapsed"
                                class="w-4 h-4 transition-transform duration-200"
                                :class="{ 'rotate-180': expandedMenus[item.name] }"
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <!-- Submenu -->
                        <ul 
                            v-if="expandedMenus[item.name] && !isCollapsed"
                            class="mt-1 ml-4 space-y-1 overflow-hidden transition-all duration-200"
                        >
                            <li v-for="subItem in item.submenu" :key="subItem.name">
                                <a 
                                    :href="subItem.route"
                                    class="block px-3 py-2 rounded-lg text-gray-500 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5 transition-all duration-200 text-sm"
                                >
                                    {{ subItem.name }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </nav>

        <!-- User Profile Section -->
        <div class="p-4 border-t border-gray-200 dark:border-white/8">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    A
                </div>
                <div v-if="!isCollapsed" class="flex-1 min-w-0">
                    <p class="text-gray-900 dark:text-white text-sm font-medium truncate">Admin User</p>
                    <p class="text-gray-500 dark:text-[#94A3B8] text-xs truncate">admin@vesto.com</p>
                </div>
            </div>
        </div>
    </aside>

    <!-- Mobile Overlay -->
    <div 
        v-if="isMobileOpen"
        @click="emit('close-mobile')"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
    ></div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
}
</style>

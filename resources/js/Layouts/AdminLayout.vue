<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Sidebar from '../Components/Admin/Sidebar.vue';
import Header from '../Components/Admin/Header.vue';

const isSidebarCollapsed = ref(false);
const isMobileSidebarOpen = ref(false);
const isMobile = ref(false);

const toggleSidebar = () => {
    if (isMobile.value) {
        isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
    } else {
        isSidebarCollapsed.value = !isSidebarCollapsed.value;
    }
};

const closeMobileSidebar = () => {
    isMobileSidebarOpen.value = false;
};

const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024;
    if (!isMobile.value) {
        isMobileSidebarOpen.value = false;
    }
};

onMounted(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile);
});

const contentMarginLeft = ref('16rem');
const contentMarginLeftCollapsed = ref('5rem');

const updateContentMargin = () => {
    if (isMobile.value) {
        contentMarginLeft.value = '0';
    } else if (isSidebarCollapsed.value) {
        contentMarginLeft.value = contentMarginLeftCollapsed.value;
    } else {
        contentMarginLeft.value = '16rem';
    }
};

// Watch for changes
import { watch } from 'vue';
watch([isSidebarCollapsed, isMobile], updateContentMargin);
</script>

<template>
    <div class="min-h-screen bg-gray-100 dark:bg-[#0F172A]">
        <!-- Sidebar -->
        <Sidebar 
            :is-collapsed="isSidebarCollapsed"
            :is-mobile-open="isMobileSidebarOpen"
            @toggle-collapse="toggleSidebar"
            @close-mobile="closeMobileSidebar"
        />

        <!-- Main Content -->
        <div 
            class="transition-all duration-300 ease-in-out min-h-screen"
            :style="{ 
                marginLeft: isMobile ? '0' : (isSidebarCollapsed ? '5rem' : '16rem'),
                paddingLeft: isMobile ? '0' : '0'
            }"
        >
            <!-- Header -->
            <Header @toggle-sidebar="toggleSidebar" />

            <!-- Page Content -->
            <main class="p-6 lg:p-8">
                <slot></slot>
            </main>
        </div>

        <!-- Toast Notification Area -->
        <div class="fixed bottom-4 right-4 z-50 space-y-2">
            <!-- Toast notifications will be rendered here -->
        </div>
    </div>
</template>

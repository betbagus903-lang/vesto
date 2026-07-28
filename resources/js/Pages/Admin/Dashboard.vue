<script setup>
import AdminLayout from '../../Layouts/AdminLayout.vue';
</script>

<template>
    <AdminLayout>
        <!-- Empty Dashboard Container - Ready for Future Content -->
        <div class="space-y-6">
            <!-- Page Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p class="text-gray-500 dark:text-[#94A3B8] text-sm mt-1">Welcome back! Here's what's happening today.</p>
                </div>
            </div>

            <!-- Grid Layout Ready for Widgets -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <!-- Widget containers will be added here -->
                <!-- Example: <div class="bg-[#1E293B] rounded-xl p-6 border border-white/8">Widget Content</div> -->
            </div>

            <!-- Full Width Section Container -->
            <div class="bg-white dark:bg-[#1E293B] rounded-xl p-6 border border-gray-200 dark:border-white/8">
                <!-- Full width content will be added here -->
            </div>

            <!-- Two Column Layout -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-[#1E293B] rounded-xl p-6 border border-gray-200 dark:border-white/8">
                    <!-- Left column content -->
                </div>
                <div class="bg-white dark:bg-[#1E293B] rounded-xl p-6 border border-gray-200 dark:border-white/8">
                    <!-- Right column content -->
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

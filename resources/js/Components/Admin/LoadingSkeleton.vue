<script setup>
const props = defineProps({
    type: {
        type: String,
        default: 'card',
        validator: (value) => ['card', 'list', 'avatar', 'text'].includes(value)
    },
    count: {
        type: Number,
        default: 1
    }
});
</script>

<template>
    <div class="space-y-4">
        <template v-for="i in count" :key="i">
            <!-- Card Skeleton -->
            <div v-if="type === 'card'" class="bg-white dark:bg-[#1E293B] rounded-xl p-6 border border-gray-200 dark:border-white/8">
                <div class="h-4 bg-white/10 rounded w-1/3 mb-4 animate-pulse"></div>
                <div class="h-8 bg-white/5 rounded w-1/2 mb-2 animate-pulse"></div>
                <div class="h-4 bg-white/5 rounded w-3/4 animate-pulse"></div>
            </div>

            <!-- List Skeleton -->
            <div v-else-if="type === 'list'" class="flex items-center gap-4 p-4 bg-white dark:bg-[#1E293B] rounded-lg border border-gray-200 dark:border-white/8">
                <div class="w-12 h-12 bg-white/10 rounded-lg animate-pulse"></div>
                <div class="flex-1 space-y-2">
                    <div class="h-4 bg-white/10 rounded w-1/2 animate-pulse"></div>
                    <div class="h-3 bg-white/5 rounded w-3/4 animate-pulse"></div>
                </div>
            </div>

            <!-- Avatar Skeleton -->
            <div v-else-if="type === 'avatar'" class="flex items-center gap-4">
                <div class="w-10 h-10 bg-white/10 rounded-full animate-pulse"></div>
                <div class="space-y-2">
                    <div class="h-4 bg-white/10 rounded w-32 animate-pulse"></div>
                    <div class="h-3 bg-white/5 rounded w-24 animate-pulse"></div>
                </div>
            </div>

            <!-- Text Skeleton -->
            <div v-else-if="type === 'text'" class="space-y-2">
                <div class="h-4 bg-white/10 rounded w-full animate-pulse"></div>
                <div class="h-4 bg-white/10 rounded w-5/6 animate-pulse"></div>
                <div class="h-4 bg-white/10 rounded w-4/6 animate-pulse"></div>
            </div>
        </template>
    </div>
</template>

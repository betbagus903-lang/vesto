<script setup>
const props = defineProps({
    items: {
        type: Array,
        default: () => []
    }
});
</script>

<template>
    <nav class="flex items-center gap-2 text-sm">
        <template v-for="(item, index) in items" :key="index">
            <a 
                v-if="item.href && index !== items.length - 1"
                :href="item.href"
                class="text-gray-500 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white transition"
            >
                {{ item.label }}
            </a>
            <span 
                v-else-if="!item.href && index !== items.length - 1"
                class="text-gray-400 dark:text-[#94A3B8]"
            >
                {{ item.label }}
            </span>
            <span 
                v-else
                class="text-gray-900 dark:text-white font-medium"
            >
                {{ item.label }}
            </span>
            <span 
                v-if="index !== items.length - 1"
                class="text-gray-400 dark:text-[#94A3B8]"
            >
                /
            </span>
        </template>
    </nav>
</template>

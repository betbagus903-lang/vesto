<script setup>
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ''
    },
    size: {
        type: String,
        default: 'md',
        validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
    }
});

const emit = defineEmits(['close']);

const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl'
};

const close = () => {
    emit('close');
};
</script>

<template>
    <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <!-- Backdrop -->
            <div 
                @click="close"
                class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></div>

            <!-- Modal Content -->
            <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
            >
                <div 
                    :class="['relative bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/8 w-full', sizeClasses[size]]"
                >
                    <!-- Header -->
                    <div v-if="title" class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/8">
                        <h3 class="text-gray-900 dark:text-white text-lg font-semibold">{{ title }}</h3>
                        <button 
                            @click="close"
                            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition text-gray-500 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="p-6">
                        <slot></slot>
                    </div>

                    <!-- Footer -->
                    <div v-if="$slots.footer" class="p-6 border-t border-gray-200 dark:border-white/8">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </Transition>
        </div>
    </Transition>
</template>

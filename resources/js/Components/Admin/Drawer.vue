<script setup>
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    position: {
        type: String,
        default: 'right',
        validator: (value) => ['left', 'right'].includes(value)
    }
});

const emit = defineEmits(['close']);

const close = () => {
    emit('close');
};
</script>

<template>
    <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div v-if="show" class="fixed inset-0 z-50 flex">
            <!-- Backdrop -->
            <div 
                @click="close"
                class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></div>

            <!-- Drawer Content -->
            <Transition
                enter-active-class="transition duration-300 ease-out"
                :enter-from="position === 'right' ? 'translate-x-full' : '-translate-x-full'"
                enter-to="translate-x-0"
                leave-active-class="transition duration-300 ease-in"
                leave-from="translate-x-0"
                :leave-to="position === 'right' ? 'translate-x-full' : '-translate-x-full'"
            >
                    <div 
                    :class="[
                        'relative h-full bg-white dark:bg-[#1E293B] shadow-2xl border-l border-gray-200 dark:border-white/8 w-80',
                        position === 'right' ? 'ml-auto' : 'mr-auto'
                    ]"
                >
                    <!-- Header -->
                    <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/8">
                        <h3 class="text-gray-900 dark:text-white text-lg font-semibold">
                            <slot name="title">Drawer</slot>
                        </h3>
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
                    <div class="flex-1 overflow-y-auto p-6">
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

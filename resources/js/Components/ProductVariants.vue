<script setup>
defineProps({
  product: { type: Object, required: true },
})
</script>

<template>
  <div class="lg:col-span-3">
    <div class="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-800/50">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Product Variants</h3>
      <p class="text-sm text-gray-500 dark:text-slate-400 mb-4">
        Variant management is available for configurable products.
      </p>
      <div
        v-if="product.type === 'configurable'"
        class="rounded-xl border border-dashed border-gray-300 dark:border-slate-700 p-8 text-center"
      >
        <p class="text-gray-500 dark:text-slate-400 text-sm">No variants created yet.</p>
        <button
          type="button"
          class="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors"
        >
          Add Variant
        </button>
      </div>
      <p v-else class="text-sm text-gray-400 dark:text-slate-500">
        This product type ({{ product.type }}) does not support variants.
      </p>
    </div>
  </div>
</template>

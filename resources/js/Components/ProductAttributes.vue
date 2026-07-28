<script setup>
const props = defineProps({
  attributeFamilies: { type: Array, default: () => [] },
  product: { type: Object, required: true },
})

const attributes = props.product.attribute_family?.attributes
  ?? props.product.attributeFamily?.attributes
  ?? []
</script>

<template>
  <div class="lg:col-span-3 space-y-6">
    <div class="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-800/50">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Product Attributes</h3>
      <p class="text-sm text-gray-500 dark:text-slate-400 mb-6">
        Attributes from
        <span class="text-gray-900 dark:text-white">{{ product.attribute_family?.name ?? product.attributeFamily?.name ?? 'Default' }}</span>
        family.
      </p>

      <div v-if="attributes.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="attr in attributes" :key="attr">
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 capitalize">{{ attr }}</label>
          <input
            type="text"
            class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :placeholder="`Enter ${attr}`"
          />
        </div>
      </div>
      <p v-else class="text-sm text-gray-400 dark:text-slate-500">No attributes configured for this product family.</p>
    </div>
  </div>
</template>

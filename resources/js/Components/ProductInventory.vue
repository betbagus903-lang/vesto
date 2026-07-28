<script setup>
defineProps({
  form: { type: Object, required: true },
})
</script>

<template>
  <div class="lg:col-span-2 space-y-6">
    <div class="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-800/50">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Inventory</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Stock Quantity</label>
          <input
            v-model.number="form.stock"
            type="number"
            min="0"
            class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Weight (kg)</label>
          <input
            v-model="form.weight"
            type="number"
            step="0.01"
            min="0"
            class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>

    <div class="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-800/50">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Dimensions</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Width (cm)</label>
          <input
            v-model="form.width"
            type="number"
            step="0.01"
            min="0"
            class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Height (cm)</label>
          <input
            v-model="form.height"
            type="number"
            step="0.01"
            min="0"
            class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Length (cm)</label>
          <input
            v-model="form.length"
            type="number"
            step="0.01"
            min="0"
            class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>

    <div class="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-800/50">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">RMA Settings</h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <label class="text-sm text-gray-700 dark:text-slate-300">Allow RMA</label>
          <button
            type="button"
            class="w-11 h-6 rounded-full transition-colors relative"
            :class="form.allow_rma ? 'bg-blue-500' : 'bg-gray-300 dark:bg-slate-700'"
            @click="form.allow_rma = !form.allow_rma"
          >
            <div
              class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
              :class="form.allow_rma ? 'left-6' : 'left-1'"
            />
          </button>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">RMA Rules</label>
          <textarea
            v-model="form.rma_rules"
            rows="3"
            class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Return policy details..."
          />
        </div>
      </div>
    </div>
  </div>
</template>

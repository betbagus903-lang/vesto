<script setup>
import { ref } from 'vue'

const props = defineProps({
  form: { type: Object, required: true },
  allProducts: { type: Array, default: () => [] },
  productId: { type: Number, default: null },
})

const searchQuery = ref('')
const searchResults = ref([])
const searching = ref(false)
const activeRelation = ref(null)

const relationTypes = [
  { key: 'related', label: 'Related Products', field: 'related_product_ids' },
  { key: 'up_sell', label: 'Up-Sell Products', field: 'up_sell_product_ids' },
  { key: 'cross_sell', label: 'Cross-Sell Products', field: 'cross_sell_product_ids' },
  { key: 'group', label: 'Group Products', field: 'group_product_ids' },
]

const getSelectedProducts = (field) => {
  const ids = props.form[field] ?? []
  return props.allProducts.filter((product) => ids.includes(product.id))
}

const searchProducts = async (query) => {
  searchQuery.value = query
  if (query.length < 2) {
    searchResults.value = []
    return
  }

  searching.value = true
  try {
    const params = new URLSearchParams({ q: query })
    if (props.productId) {
      params.set('exclude_id', props.productId)
    }
    const response = await fetch(`/admin/products/search?${params.toString()}`)
    searchResults.value = await response.json()
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = []
  } finally {
    searching.value = false
  }
}

const addProduct = (productId, field) => {
  if (!props.form[field].includes(productId)) {
    props.form[field].push(productId)
  }
  searchQuery.value = ''
  searchResults.value = []
  activeRelation.value = null
}

const removeProduct = (productId, field) => {
  props.form[field] = props.form[field].filter((id) => id !== productId)
}
</script>

<template>
  <div class="lg:col-span-3 space-y-6">
    <div class="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-800/50">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Visibility</h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <label class="text-sm text-gray-700 dark:text-slate-300">Visible Individually</label>
          <button
            type="button"
            class="w-11 h-6 rounded-full transition-colors relative"
            :class="form.visible_individually ? 'bg-blue-500' : 'bg-gray-300 dark:bg-slate-700'"
            @click="form.visible_individually = !form.visible_individually"
          >
            <div
              class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
              :class="form.visible_individually ? 'left-6' : 'left-1'"
            />
          </button>
        </div>
        <div class="flex items-center justify-between">
          <label class="text-sm text-gray-700 dark:text-slate-300">Guest Checkout</label>
          <button
            type="button"
            class="w-11 h-6 rounded-full transition-colors relative"
            :class="form.guest_checkout ? 'bg-blue-500' : 'bg-gray-300 dark:bg-slate-700'"
            @click="form.guest_checkout = !form.guest_checkout"
          >
            <div
              class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
              :class="form.guest_checkout ? 'left-6' : 'left-1'"
            />
          </button>
        </div>
      </div>
    </div>

    <div
      v-for="relation in relationTypes"
      :key="relation.key"
      class="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-800/50"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ relation.label }}</h3>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg text-sm text-blue-500 dark:text-blue-400 border border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
          @click="activeRelation = activeRelation === relation.field ? null : relation.field"
        >
          Add Product
        </button>
      </div>

      <div v-if="activeRelation === relation.field" class="mb-4 relative">
        <input
          v-model="searchQuery"
          type="text"
          class="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search products by name or SKU..."
          @input="searchProducts($event.target.value)"
        />
        <div
          v-if="searchResults.length"
          class="absolute z-10 mt-1 w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden"
        >
          <button
            v-for="product in searchResults"
            :key="product.id"
            type="button"
            class="w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            @click="addProduct(product.id, relation.field)"
          >
            <span class="text-sm text-gray-900 dark:text-white">{{ product.name }}</span>
            <span class="text-xs text-gray-500 dark:text-slate-400 ml-2">SKU: {{ product.sku }}</span>
          </button>
        </div>
        <p v-if="searching" class="text-xs text-gray-400 dark:text-slate-500 mt-2">Searching...</p>
      </div>

      <div v-if="getSelectedProducts(relation.field).length" class="space-y-2">
        <div
          v-for="product in getSelectedProducts(relation.field)"
          :key="product.id"
          class="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800/50"
        >
          <div>
            <p class="text-sm text-gray-900 dark:text-white">{{ product.name }}</p>
            <p class="text-xs text-gray-500 dark:text-slate-400">SKU: {{ product.sku }}</p>
          </div>
          <button
            type="button"
            class="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-sm"
            @click="removeProduct(product.id, relation.field)"
          >
            Remove
          </button>
        </div>
      </div>
      <p v-else class="text-sm text-gray-400 dark:text-slate-500">No products linked yet.</p>
    </div>
  </div>
</template>

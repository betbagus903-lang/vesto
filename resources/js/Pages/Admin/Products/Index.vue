<script setup>
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'
import AdminLayout from '../../../Layouts/AdminLayout.vue'

const props = defineProps({
  products: { type: Array, default: () => [] },
  pagination: { type: Object, default: () => ({}) },
  filters: { type: Object, default: () => ({}) },
})

const search = ref(props.filters.search ?? '')

const applySearch = () => {
  router.get('/admin/products', { ...props.filters, search: search.value, page: 1 }, { preserveState: true })
}

const goToPage = (page) => {
  router.get('/admin/products', { ...props.filters, page }, { preserveState: true })
}
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p class="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage your product catalog</p>
        </div>
        <a
          href="/admin/products/create"
          class="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors"
        >
          + Create Product
        </a>
      </div>

      <div class="flex gap-3">
        <input
          v-model="search"
          type="text"
          class="flex-1 px-4 py-2.5 rounded-lg bg-white dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by name or SKU..."
          @keyup.enter="applySearch"
        />
        <button
          type="button"
          class="px-4 py-2.5 rounded-lg text-sm text-gray-700 dark:text-white bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 transition-colors"
          @click="applySearch"
        >
          Search
        </button>
      </div>

      <div class="rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-100 dark:bg-slate-900/80 text-gray-500 dark:text-slate-400">
            <tr>
              <th class="text-left px-4 py-3 font-medium">Product</th>
              <th class="text-left px-4 py-3 font-medium">SKU</th>
              <th class="text-left px-4 py-3 font-medium">Type</th>
              <th class="text-left px-4 py-3 font-medium">Price</th>
              <th class="text-left px-4 py-3 font-medium">Stock</th>
              <th class="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in products"
              :key="product.id"
              class="border-t border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-900/40 transition-colors"
            >
              <td class="px-4 py-3 text-gray-900 dark:text-white">{{ product.name }}</td>
              <td class="px-4 py-3 text-gray-600 dark:text-slate-300">{{ product.sku }}</td>
              <td class="px-4 py-3 text-gray-600 dark:text-slate-300 capitalize">{{ product.type ?? 'simple' }}</td>
              <td class="px-4 py-3 text-gray-600 dark:text-slate-300">${{ product.price ?? '0.00' }}</td>
              <td class="px-4 py-3 text-gray-600 dark:text-slate-300">{{ product.stock ?? 0 }}</td>
              <td class="px-4 py-3 text-right">
                <a
                  :href="`/admin/products/${product.id}/edit`"
                  class="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                >
                  Edit
                </a>
              </td>
            </tr>
            <tr v-if="!products.length">
              <td colspan="6" class="px-4 py-8 text-center text-gray-400 dark:text-slate-500">No products found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="pagination.last_page > 1" class="flex items-center justify-between text-sm text-gray-500 dark:text-slate-400">
        <span>Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
        <div class="flex gap-2">
          <button
            type="button"
            class="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 disabled:opacity-40"
            :disabled="pagination.current_page <= 1"
            @click="goToPage(pagination.current_page - 1)"
          >
            Previous
          </button>
          <button
            type="button"
            class="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 disabled:opacity-40"
            :disabled="pagination.current_page >= pagination.last_page"
            @click="goToPage(pagination.current_page + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

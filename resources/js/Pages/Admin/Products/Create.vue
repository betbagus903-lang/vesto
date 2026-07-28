<script setup>
import { ref } from 'vue'
import { router, usePage } from '@inertiajs/vue3'
import AdminLayout from '../../../Layouts/AdminLayout.vue'

const props = defineProps({
  attributeFamilies: { type: Array, default: () => [] },
})

const page = usePage()
const errors = ref({})
const loading = ref(false)

const form = ref({
  name: '',
  attribute_family_id: '',
  type: 'simple',
  sku: '',
})

const submit = () => {
  loading.value = true
  errors.value = {}

  router.post('/admin/products', form.value, {
    onFinish: () => {
      loading.value = false
    },
    onError: (validationErrors) => {
      errors.value = validationErrors
      loading.value = false
    },
  })
}

const cancel = () => {
  router.visit('/admin/products')
}
</script>

<template>
  <AdminLayout>
    <div class="max-w-lg mx-auto">
      <div class="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-xl overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-800">
          <div>
            <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Create Product</h1>
            <p class="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Add basic product information</p>
          </div>
          <button
            type="button"
            class="text-gray-400 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            @click="cancel"
          >
            ✕
          </button>
        </div>

        <form class="p-6 space-y-5" @submit.prevent="submit">
          <div v-if="page.props.flash?.success" class="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400">
            {{ page.props.flash.success }}
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Product Name <span class="text-red-400">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              class="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-950/50 border text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="errors.name ? 'border-red-500' : 'border-gray-300 dark:border-slate-800'"
              placeholder="Enter product name"
            />
            <p v-if="errors.name" class="text-xs text-red-400 mt-1">{{ errors.name }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Product Type <span class="text-red-400">*</span>
            </label>
            <select
              v-model="form.type"
              class="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="simple">Simple</option>
              <option value="configurable">Configurable</option>
              <option value="virtual">Virtual</option>
              <option value="bundle">Bundle</option>
            </select>
            <p v-if="errors.type" class="text-xs text-red-400 mt-1">{{ errors.type }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Attribute Family <span class="text-red-400">*</span>
            </label>
            <select
              v-model="form.attribute_family_id"
              class="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-950/50 border text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="errors.attribute_family_id ? 'border-red-500' : 'border-gray-300 dark:border-slate-800'"
            >
              <option value="">Select Attribute Family</option>
              <option v-for="family in attributeFamilies" :key="family.id" :value="family.id">
                {{ family.name }}
              </option>
            </select>
            <p v-if="errors.attribute_family_id" class="text-xs text-red-400 mt-1">{{ errors.attribute_family_id }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              SKU <span class="text-red-400">*</span>
            </label>
            <input
              v-model="form.sku"
              type="text"
              class="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-950/50 border text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              :class="errors.sku ? 'border-red-500' : 'border-gray-300 dark:border-slate-800'"
              placeholder="Enter SKU"
            />
            <p v-if="errors.sku" class="text-xs text-red-400 mt-1">{{ errors.sku }}</p>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-800">
            <button
              type="button"
              class="px-4 py-2 rounded-lg text-sm text-gray-500 dark:text-slate-400 border border-gray-300 dark:border-slate-700 hover:text-gray-900 dark:hover:text-white transition-colors"
              @click="cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors"
            >
              {{ loading ? 'Saving...' : 'Save Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

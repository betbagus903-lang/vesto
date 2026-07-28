<script setup>
import { ref, computed } from 'vue'
import { router, usePage } from '@inertiajs/vue3'
import AdminLayout from '../../../Layouts/AdminLayout.vue'
import ProductAttributes from '../../../Components/ProductAttributes.vue'
import ProductInventory from '../../../Components/ProductInventory.vue'
import ProductVariants from '../../../Components/ProductVariants.vue'
import ProductChannels from '../../../Components/ProductChannels.vue'

const props = defineProps({
  product: { type: Object, required: true },
  categories: { type: Array, default: () => [] },
  attributeFamilies: { type: Array, default: () => [] },
  taxCategories: { type: Array, default: () => [] },
  allProducts: { type: Array, default: () => [] },
})

const page = usePage()
const errors = ref({})
const loading = ref(false)
const activeTab = ref('general')
const fileInput = ref(null)

const formatDateTimeLocal = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const parseImages = (images) => {
  if (Array.isArray(images)) return images
  if (typeof images === 'string') {
    try {
      return JSON.parse(images)
    } catch {
      return []
    }
  }
  return []
}

const form = ref({
  name: props.product.name || '',
  sku: props.product.sku || '',
  product_number: props.product.product_number || '',
  url_key: props.product.url_key || '',
  tax_category_id: props.product.tax_category_id || '',
  short_description: props.product.short_description || '',
  description: props.product.description || '',
  price: props.product.price ?? '',
  special_price: props.product.special_price ?? '',
  special_price_from: formatDateTimeLocal(props.product.special_price_from),
  special_price_to: formatDateTimeLocal(props.product.special_price_to),
  cost_price: props.product.cost_price ?? '',
  stock: props.product.stock ?? 0,
  weight: props.product.weight ?? '',
  width: props.product.width ?? '',
  height: props.product.height ?? '',
  length: props.product.length ?? '',
  meta_title: props.product.meta_title || '',
  meta_keywords: props.product.meta_keywords || '',
  meta_description: props.product.meta_description || '',
  new: props.product.new ?? false,
  featured: props.product.featured ?? false,
  visible_individually: props.product.visible_individually ?? true,
  status: props.product.status ?? true,
  guest_checkout: props.product.guest_checkout ?? true,
  allow_rma: props.product.allow_rma ?? false,
  rma_rules: props.product.rma_rules || '',
  category_ids: props.product.categories?.map((c) => c.id) || [],
  images: parseImages(props.product.images),
  videos: Array.isArray(props.product.videos) ? props.product.videos : [],
  related_product_ids: props.product.related_products?.map((p) => p.id) || props.product.relatedProducts?.map((p) => p.id) || [],
  up_sell_product_ids: props.product.up_sell_products?.map((p) => p.id) || props.product.upSellProducts?.map((p) => p.id) || [],
  cross_sell_product_ids: props.product.cross_sell_products?.map((p) => p.id) || props.product.crossSellProducts?.map((p) => p.id) || [],
  group_product_ids: props.product.group_products?.map((p) => p.id) || props.product.groupProducts?.map((p) => p.id) || [],
})

const videoUrl = computed({
  get: () => (Array.isArray(form.value.videos) ? form.value.videos[0] : '') || '',
  set: (value) => {
    form.value.videos = value ? [value] : []
  },
})

const setActiveTab = (tab) => {
  activeTab.value = tab
}

const buildPayload = () => ({
  ...form.value,
  tax_category_id: form.value.tax_category_id || null,
  price: form.value.price === '' ? null : form.value.price,
  special_price: form.value.special_price === '' ? null : form.value.special_price,
  cost_price: form.value.cost_price === '' ? null : form.value.cost_price,
  weight: form.value.weight === '' ? null : form.value.weight,
  width: form.value.width === '' ? null : form.value.width,
  height: form.value.height === '' ? null : form.value.height,
  length: form.value.length === '' ? null : form.value.length,
  special_price_from: form.value.special_price_from || null,
  special_price_to: form.value.special_price_to || null,
})

const handleImageUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('image', file)

  try {
    const response = await window.axios.post(`/admin/products/${props.product.id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    if (response.data && response.data.path) {
      form.value.images.push(response.data.path)
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }
  } catch (error) {
    console.error('Upload error:', error)
    alert('Failed to upload image')
  }
}

const removeImage = (index) => {
  form.value.images = form.value.images.filter((_, i) => i !== index)
}

const submit = () => {
  loading.value = true
  errors.value = {}

  router.put(`/admin/products/${props.product.id}`, buildPayload(), {
    onFinish: () => {
      loading.value = false
    },
    onError: (validationErrors) => {
      errors.value = validationErrors
      loading.value = false
    },
  })
}

// const deleteProduct = () => {
//   if (confirm('Are you sure you want to delete this product?')) {
//     router.delete(`/admin/products/${props.product.id}`)
//   }
// }
const handleImageError = (event) => {
  console.error('❌ Gambar gagal load:', event.target.src)
  // Optional: bisa hapus dari array jika diperlukan
}
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
          <p class="text-sm text-gray-500 dark:text-slate-400 mt-1">Update product information</p>
        </div>
        <div class="flex items-center gap-3">
          <button
            type="button"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
            @click="submit"
          >
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>

      <div v-if="page.props.flash?.success" class="rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
        {{ page.props.flash.success }}
      </div>
      <!-- Form -->
      <form @submit.prevent="submit" class="space-y-6">
        <!-- Tabs -->
        <div class="flex items-center gap-2 bg-gray-50 dark:bg-slate-900/50 p-1 rounded-xl border border-gray-200 dark:border-slate-800/50">
          <button
            type="button"
            v-for="tab in [
              { id: 'general', label: 'General' },
              { id: 'attributes', label: 'Attributes' },
              { id: 'inventory', label: 'Inventory' },
              { id: 'variants', label: 'Variants' },
              { id: 'images', label: 'Images & Media' },
              { id: 'seo', label: 'SEO' },
              { id: 'channels', label: 'Channels' },
            ]"
            :key="tab.id"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-blue-500/20 text-blue-500 dark:text-blue-400 border border-blue-500/50'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800',
            ]"
            @click="setActiveTab(tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- General Tab -->
        <div v-show="activeTab === 'general'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-800/50">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h3>
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Product Name</label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :class="errors.name ? 'border-red-500' : 'border-gray-300 dark:border-slate-800'"
                    placeholder="Enter product name"
                  />
                  <p v-if="errors.name" class="text-xs text-red-500 dark:text-red-400 mt-1">{{ errors.name }}</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">SKU</label>
                    <input
                      v-model="form.sku"
                      type="text"
                      class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="SKU"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Product Number</label>
                    <input
                      v-model="form.product_number"
                      type="text"
                      class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Product Number"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">URL Key</label>
                    <input
                      v-model="form.url_key"
                      type="text"
                      class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="url-key"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Tax Category</label>
                  <select
                    v-model="form.tax_category_id"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Tax Category</option>
                    <option v-for="cat in taxCategories" :key="cat.id" :value="cat.id">
                      {{ cat.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Short Description</label>
                  <textarea
                    v-model="form.short_description"
                    rows="3"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Brief description of the product"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Description</label>
                  <textarea
                    v-model="form.description"
                    rows="6"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Detailed product description"
                  />
                </div>
              </div>
            </div>

            <div class="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-800/50">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Categories</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div v-for="cat in categories" :key="cat.id" class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-950/50 rounded-lg border border-gray-200 dark:border-slate-800/50">
                  <input
                    type="checkbox"
                    :id="`cat-${cat.id}`"
                    :value="cat.id"
                    v-model="form.category_ids"
                    class="w-4 h-4 text-blue-500 bg-gray-100 dark:bg-slate-950 border-gray-300 dark:border-slate-700 rounded focus:ring-blue-500"
                  />
                  <label :for="`cat-${cat.id}`" class="text-sm text-gray-700 dark:text-slate-300">{{ cat.name }}</label>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-800/50">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Pricing</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Price</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500">$</span>
                    <input
                      v-model="form.price"
                      type="number"
                      step="0.01"
                      class="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Special Price</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500">$</span>
                    <input
                      v-model="form.special_price"
                      type="number"
                      step="0.01"
                      class="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">From</label>
                    <input
                      v-model="form.special_price_from"
                      type="datetime-local"
                      class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">To</label>
                    <input
                      v-model="form.special_price_to"
                      type="datetime-local"
                      class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Cost Price</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500">$</span>
                    <input
                      v-model="form.cost_price"
                      type="number"
                      step="0.01"
                      class="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-800/50">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Status</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <label class="text-sm text-gray-700 dark:text-slate-300">Enabled</label>
                  <button
                    type="button"
                    @click="form.status = !form.status"
                    :class="[
                      'w-11 h-6 rounded-full transition-colors relative',
                      form.status ? 'bg-blue-500' : 'bg-gray-200 dark:bg-slate-700',
                    ]"
                  >
                    <div
                      :class="[
                        'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                        form.status ? 'left-6' : 'left-1',
                      ]"
                    />
                  </button>
                </div>
                <div class="flex items-center justify-between">
                  <label class="text-sm text-gray-700 dark:text-slate-300">New Product</label>
                  <button
                    type="button"
                    @click="form.new = !form.new"
                    :class="[
                      'w-11 h-6 rounded-full transition-colors relative',
                      form.new ? 'bg-blue-500' : 'bg-gray-200 dark:bg-slate-700',
                    ]"
                  >
                    <div
                      :class="[
                        'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                        form.new ? 'left-6' : 'left-1',
                      ]"
                    />
                  </button>
                </div>
                <div class="flex items-center justify-between">
                  <label class="text-sm text-gray-700 dark:text-slate-300">Featured</label>
                  <button
                    type="button"
                    @click="form.featured = !form.featured"
                    :class="[
                      'w-11 h-6 rounded-full transition-colors relative',
                      form.featured ? 'bg-blue-500' : 'bg-gray-200 dark:bg-slate-700',
                    ]"
                  >
                    <div
                      :class="[
                        'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                        form.featured ? 'left-6' : 'left-1',
                      ]"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Attributes Tab -->
        <div v-show="activeTab === 'attributes'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProductAttributes
            :attributeFamilies="attributeFamilies"
            :product="product"
          />
        </div>

        <!-- Inventory Tab -->
        <div v-show="activeTab === 'inventory'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProductInventory
            :form="form"
          />
        </div>

        <!-- Variants Tab -->
        <div v-show="activeTab === 'variants'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProductVariants
            :product="product"
          />
        </div>

        <!-- Images Tab -->
        <div v-show="activeTab === 'images'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-800/50">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Product Images</h3>
              <p class="text-sm text-gray-500 dark:text-slate-400 mb-6">Upload product images. First image will be the main thumbnail.</p>

              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div
                  class="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all"
                  @click="fileInput.click()"
                >
                  <div class="w-12 h-12 rounded-full bg-gray-200 dark:bg-slate-800 flex items-center justify-center mb-2">
                    <svg class="w-6 h-6 text-gray-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span class="text-sm text-gray-500 dark:text-slate-400">Add Image</span>
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleImageUpload"
                  />
                </div>

                <div
                  v-for="(image, index) in form.images"
                  :key="index"
                  class="aspect-square rounded-xl overflow-hidden relative group border border-gray-200 dark:border-slate-800/50"
                >
                 <img 
  :src="`/storage/${image}`" 
  class="w-full h-full object-cover" 
  :alt="`Product ${index + 1}`"
  @error="handleImageError"
/>
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      v-if="index !== 0"
                      class="p-2 bg-gray-200 dark:bg-slate-800 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                      title="Set as main"
                    >
                      <svg class="w-4 h-4 text-gray-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      class="p-2 bg-red-500 rounded-lg hover:bg-red-600"
                      title="Delete"
                      @click="removeImage(index)"
                    >
                      <svg class="w-4 h-4 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div v-if="index === 0" class="absolute top-2 left-2 px-2 py-1 bg-blue-500 rounded text-xs font-medium text-gray-900 dark:text-white">Main</div>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-800/50">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Video</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Video URL</label>
                  <input
                    v-model="videoUrl"
                    type="url"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <p class="text-xs text-gray-400 dark:text-slate-500">
                  Supports YouTube and Vimeo URLs. Video will be embedded on product page.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- SEO Tab -->
        <div v-show="activeTab === 'seo'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-800/50">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Meta Information</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Meta Title</label>
                  <input
                    v-model="form.meta_title"
                    type="text"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Product meta title"
                  />
                  <p class="text-xs text-gray-400 dark:text-slate-500 mt-2">{{ form.meta_title?.length || 0 }}/60 characters</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Meta Keywords</label>
                  <input
                    v-model="form.meta_keywords"
                    type="text"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Meta Description</label>
                  <textarea
                    v-model="form.meta_description"
                    rows="4"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Product meta description"
                  />
                  <p class="text-xs text-gray-400 dark:text-slate-500 mt-2">{{ form.meta_description?.length || 0 }}/160 characters</p>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-800/50">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Preview</h3>
              <div class="space-y-4">
                <div class="p-4 bg-white rounded-lg">
                  <h4 class="text-blue-600 text-lg font-medium mb-1">{{ form.meta_title || form.name }}</h4>
                  <p class="text-green-700 text-sm mb-2">yourstore.com/product/{{ form.url_key || 'product-slug' }}</p>
                  <p class="text-gray-600 dark:text-slate-600 text-sm">{{ form.meta_description || form.short_description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Channels Tab -->
        <div v-show="activeTab === 'channels'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProductChannels
            :form="form"
            :all-products="allProducts"
            :product-id="product.id"
          />
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

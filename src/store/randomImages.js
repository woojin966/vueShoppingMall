import { ref, onMounted, getCurrentInstance } from 'vue'

export function randomImages() {
  const { proxy } = getCurrentInstance()
  const imgUrl = ref('')
  const filters = [
    'filter-clarendon',
    'filter-gingham',
    'filter-juno',
    'filter-lark',
    'filter-reyes',
    'filter-valencia',
    'filter-willow',
  ]
  const randomFilter = ref('')

  onMounted(() => {
    const randomIndex = Math.floor(Math.random() * filters.length)
    randomFilter.value = filters[randomIndex]
  })

  onMounted(async () => {
    const res = await proxy.$unsplash.get('/photos/random')
    imgUrl.value = res.data.urls.regular
  })

  return { imgUrl, randomFilter }
}

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

  const fallbackImages = ['/fallback/banner1.jpg', '/fallback/banner2.jpg', '/fallback/banner3.jpg']

  onMounted(() => {
    const randomIndex = Math.floor(Math.random() * filters.length)
    randomFilter.value = filters[randomIndex]
  })

  // onMounted(async () => {
  //   const res = await proxy.$unsplash.get('/photos/random')
  //   imgUrl.value = res.data.urls.regular
  // })
  onMounted(async () => {
    // 필터 랜덤
    randomFilter.value = filters[Math.floor(Math.random() * filters.length)]

    try {
      const res = await proxy.$unsplash.get('/photos/random')
      imgUrl.value = res.data.urls.regular
    } catch (err) {
      console.warn('🔥 Unsplash 403 → fallback image 사용')

      const pick = Math.floor(Math.random() * fallbackImages.length)
      imgUrl.value = fallbackImages[pick]
    }
  })

  return { imgUrl, randomFilter }
}

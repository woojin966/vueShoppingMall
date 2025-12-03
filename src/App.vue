<template>
  <div class="body-wrap">
    <header></header>
  </div>

  <RouterView />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { loadAuth } = useAuth()

onMounted(() => {
  loadAuth()
})
</script>

<style></style>

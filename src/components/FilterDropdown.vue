<template>
  <div class="filter_box">
    <p class="selected_filter text sb" @click="toggle">
      {{ $t(modelValue) }}
      <span class="arrow small n" :class="{ open: open }">▼</span>
    </p>

    <ul v-show="open" class="filter_options">
      <li
        v-for="key in options"
        :key="key"
        @click="select(key)"
        :class="{ active: modelValue === key }"
      >
        {{ $t(key) }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: String, // v-model
  options: Array, // 필터 옵션 목록
})

const emit = defineEmits(['update:modelValue', 'change'])

const open = ref(false)

const toggle = () => (open.value = !open.value)

const select = (option) => {
  emit('update:modelValue', option)
  emit('change', option) // 선택 이벤트 전달 (정렬 실행용)
  open.value = false
}
</script>

<style scoped lang="scss">
@import '../assets/style/Product.scss';
</style>

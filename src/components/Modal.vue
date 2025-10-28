<template>
  <div v-if="visible" class="modal_backdrop">
    <div class="modal_box">
      <p class="modal_message text sb">{{ message }}</p>
      <div class="modal_buttons">
        <button class="btn cancel text n" @click="$emit('cancel')">{{ cancelText }}</button>
        <button class="btn confirm text n" @click="$emit('confirm')">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '알림' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: '확인' },
  cancelText: { type: String, default: '취소' },
})
</script>

<style scoped lang="scss">
.modal_backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  .modal_box {
    background: #fff;
    width: 360px;
    .modal_message {
      padding: 60px 0;
      text-align: center;
    }
    .modal_buttons {
      display: flex;
      .btn {
        border: none;
        width: 50%;
        padding: 12px;
        cursor: pointer;
        &.cancel {
          background-color: #efefef;
        }
        &.confirm {
          background-color: $pointRed;
          color: #fff;
        }
      }
    }
  }
  @media all and (max-width: 480px) {
    .modal_box {
      width: calc(100% - 32px);
    }
  }
}
</style>

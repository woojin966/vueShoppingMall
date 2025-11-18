<template>
  <div v-if="visible" class="modal_backdrop">
    <div class="modal_box">
      <!-- slot이 존재하면 slot 사용, 아니면 message 출력 -->
      <div v-if="$slots.default">
        <slot />
      </div>
      <p v-else class="modal_message text sb">{{ message }}</p>

      <div class="modal_buttons" :class="{ btn_one: confirmText }">
        <!-- cancelText가 있을 때만 취소 버튼 표시 -->
        <button v-if="cancelText" class="btn cancel text n" @click="$emit('cancel')">
          {{ cancelText }}
        </button>

        <!-- confirmText가 있을 때만 확인 버튼 표시 -->
        <button v-if="confirmText" class="btn confirm text n" @click="$emit('confirm')">
          {{ confirmText }}
        </button>
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
  showConfirm: { type: Boolean, default: true },
  showCancel: { type: Boolean, default: true },
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
    padding: 24px;
    .modal_message {
      padding: 60px 0;
      text-align: center;
    }
    .modal_buttons {
      display: flex;
      margin-top: 16px;
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
      &.btn_one {
        button {
          width: 100%;
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

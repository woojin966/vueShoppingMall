<template>
  <section class="order_complete">
    <!-- Progress -->
    <div class="progress_bar">
      <span class="step active">장바구니</span>
      <span class="arrow">→</span>
      <span class="step active">주문서</span>
      <span class="arrow">→</span>
      <span class="step active">완료</span>
    </div>

    <div class="complete_box">
      <div class="check_animation">
        <svg viewBox="0 0 52 52" class="checkmark">
          <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
          <path class="checkmark__check" fill="none" d="M14 27l7 7 16-16" />
        </svg>
      </div>

      <h2 class="title">결제가 완료되었습니다 🎉</h2>
      <p class="desc">
        주문번호 <strong>{{ orderNumber }}</strong
        ><br />
        감사합니다, <strong>{{ shipping.name }}</strong
        >님!
      </p>

      <div class="btns">
        <router-link to="/" class="btn home">홈으로</router-link>
        <router-link to="/mypage/orders" class="btn">주문 내역 보기</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const orderNumber = computed(() => store.state.order.orderNumber)
const shipping = computed(() => store.state.order.shipping)
</script>

<style scoped lang="scss">
.order_complete {
  max-width: 600px;
  margin: 80px auto;
  text-align: center;

  .progress_bar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-bottom: 40px;
    .step {
      color: #bbb;
      &.active {
        color: #222;
        font-weight: 600;
      }
    }
    .arrow {
      color: #888;
    }
  }

  .complete_box {
    background: #fff;
    border-radius: 12px;
    padding: 40px 20px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

    .check_animation {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;

      .checkmark {
        width: 80px;
        height: 80px;
        stroke-width: 2;
        stroke: #4caf50;
        stroke-miterlimit: 10;
        box-shadow: inset 0px 0px 0px #4caf50;
        animation:
          fill 0.4s ease-in-out 0.4s forwards,
          scale 0.3s ease-in-out 0.9s both;

        &__circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke-miterlimit: 10;
          stroke: #4caf50;
          fill: none;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }

        &__check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
      }

      @keyframes stroke {
        100% {
          stroke-dashoffset: 0;
        }
      }
      @keyframes scale {
        0%,
        100% {
          transform: none;
        }
        50% {
          transform: scale3d(1.1, 1.1, 1);
        }
      }
      @keyframes fill {
        100% {
          box-shadow: inset 0px 0px 0px 30px #4caf50;
        }
      }
    }

    .title {
      font-size: 1.6rem;
      margin-bottom: 10px;
    }

    .desc {
      font-size: 1rem;
      line-height: 1.6;
      color: #555;
      margin-bottom: 30px;
      strong {
        color: #222;
      }
    }

    .btns {
      display: flex;
      justify-content: center;
      gap: 16px;
      .btn {
        display: inline-block;
        background: #444;
        color: #fff;
        padding: 12px 24px;
        border-radius: 6px;
        text-decoration: none;
        &.home {
          background: #4caf50;
        }
      }
    }
  }
}
</style>

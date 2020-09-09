<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div
        class="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header class="modal-header" id="modalTitle">
          <slot name="header"></slot>
          <button
            type="button"
            class="modal-close"
            @click="close"
            aria-label="Close modal"
          >
            x
          </button>
        </header>
        <section class="modal-body" id="modalDescription">
          <slot name="body"></slot>
        </section>
        <footer class="modal-footer">
          <div class="modal-footer__top"><slot name="footer"></slot></div>
          <div class="modal-footer__bottom">
            <slot name="footer-info" class="modal-footer__bottom"></slot>
          </div>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ModalDialog extends Vue {
  close() {
    this.$emit("close");
  }
}
</script>

<style scoped lang="scss">
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  border-radius: $border-radius;
  min-width: 30rem;
  max-width: 35rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.modal-footer {
  display: flex;
  flex-direction: column;
  background: #f8f8fa;
  &__top {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 1rem;
  }
  &__bottom {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}

.modal-body {
  position: relative;
  // padding: 0.8rem 1rem;
  background: #f8f8fa;
}

.modal-close {
  border: none;
  width: 2rem;
  height: 2rem;
  font-size: 1.2rem;
  cursor: pointer;
  color: $color-gray;
  background: transparent;
}
</style>

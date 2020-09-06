<template>
  <footer class="footer">
    <slot></slot>
  </footer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class FooterBar extends Vue {
}
</script>

<style scoped lang="scss">
.footer {
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  &__img {
    height: 1.5rem;
  }
  &__title {
    font-size: 1.21rem;
    margin-left: 0.4rem;
  }
}

.logged {
  margin-left: auto;
}
</style>

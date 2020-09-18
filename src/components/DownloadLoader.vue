<template>
  <div class="loader">
    <div class="loader__arrow"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class DownloadLoader extends Vue {}
</script>

<style scoped lang="scss">
$loader-size: 4em;
$arrow-size: $loader-size/3;
$arrow-color: white;
.loader {
  height: $loader-size;
  width: $loader-size;
  background: $color-primary;
  transform: all;
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid $color-primary;
  &__arrow {
    height: $arrow-size;
    width: $arrow-size;
    background: $arrow-color;
    position: relative;
    animation: download 1.2s linear infinite;
    &::after {
      position: absolute;
      top: $arrow-size;
      left: -$arrow-size/2;
      // right: 0;
      content: "";
      display: block;
      height: 0;
      width: 0;
      border-color: $arrow-color transparent transparent transparent;
      border-width: $arrow-size $arrow-size 0 $arrow-size;
      border-style: solid;
    }
  }
}
@keyframes download {
  0% {
    transform: translateY(-200%);
  }
  100% {
    transform: translateY(200%);
  }
}
</style>

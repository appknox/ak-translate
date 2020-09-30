<template>
  <div class="popover">
    <div
      class="popover__icon"
      v-on:mouseenter="show = true"
      v-on:mouseleave="show = false"
    >
      i
    </div>
    <div class="popover__msg" v-bind:class="{ active: show }">
      {{ msg }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class PopoverInfo extends Vue {
  @Prop() private msg!: string;

  private show = false;
}
</script>

<style scoped lang="scss">
.popover {
  position: relative;
  &__icon {
    border: 1px solid currentColor;
    height: 1.2rem;
    width: 1.2rem;
    border-radius: 50%;
    background: $color-gray;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.7rem;
    cursor: default;
    &:hover {
      background: $color-primary;
    }
  }
  &__msg {
    display: none;
    position: absolute;
    left: 0;
    bottom: 1.8rem;
    width: 20rem;
    background: lighten($color-primary, 35%);
    color: $color-primary;
    padding: 0.5rem 0.8rem;
    font-size: 0.83rem;
    line-height: 1.5;
    border: 1px solid lighten($color-primary, 28%);
    border-radius: $border-radius;
    &.active {
      display: block;
    }
  }
}
</style>

<template>
  <div class="popover">
    <div
      class="popover__icon"
      v-on:mouseenter="show = true"
      v-on:mouseleave="show = false"
    >
      <InfoIcon />
    </div>
    <div class="popover__msg" v-bind:class="{ active: show }">
      {{ msg }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import InfoIcon from "vue-material-design-icons/InformationOutline.vue";

@Component({
  components: {
    InfoIcon
  }
})
export default class PopoverInfo extends Vue {
  @Prop() private msg!: string;

  private show = false;
}
</script>

<style scoped lang="scss">
.popover {
  position: relative;
  &__icon {
    color: $color-gray;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    cursor: default;
    &:hover {
      color: $color-primary;
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

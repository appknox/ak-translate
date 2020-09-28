<template>
  <div v-if="language" class="lang">
    <div class="lang__icon">
      <img
        v-bind:src="require(`../assets/icon_${language}.png`)"
        v-bind:alt="language"
      />
    </div>
    <div class="lang__text">{{ language }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import languageIcon from "@/shared/languageIcon";

@Component
export default class LanguageDisplay extends Vue {
  @Prop() private language!: string;
  private languageIcon = languageIcon;
}
</script>

<style scoped lang="scss">
.lang {
  display: flex;
  align-items: center;
  justify-content: center;
  &__icon {
    margin-right: 0.6rem;
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  &__text {
    font-size: 1.2rem;
    line-height: 1.4;
    font-weight: 600;
    color: #a6aab7;
  }
}
</style>

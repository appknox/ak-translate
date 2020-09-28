<template>
  <div class="dropdown" v-bind:class="{ show: show }">
    <button
      class="dropdown-toggle"
      v-on:click="openDropdown()"
      v-bind:disabled="disabled"
    >
      <span class="dropdown-toggle__icon">
        <LangIcon />
      </span>
      <span class="dropdown-toggle__text">{{ selected }}</span>
    </button>
    <div class="dropdown-items">
      <div
        v-for="l in languages"
        v-bind:key="l.key"
        class="dropdown-item"
        v-on:click="selectDropdown(l.key)"
      >
        <span class="dropdown-item__icon">
          <img
            v-bind:src="require(`../assets/icon_${l.key}.png`)"
            v-bind:alt="l.key"
          />
        </span>
        <span class="dropdown-item__text">{{ l.text }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import LangIcon from "vue-material-design-icons/Web.vue";
import { TRANSLATION_LANGUAGES } from "@/shared/languages";

@Component({
  components: {
    LangIcon
  }
})
export default class LanguageDropdown extends Vue {
  @Prop() private disabled!: boolean;

  private selected = "ja";
  private show = false;
  private languages = TRANSLATION_LANGUAGES;

  openDropdown() {
    this.show = !this.show;
  }
  selectDropdown(lang) {
    this.selected = lang;
    this.show = false;
    this.$store.commit("switchLanguage", lang);
  }

  mounted() {
    this.$store.commit("initLanguage");
    this.selected = this.$store.getters.getLanguage;
  }
}
</script>

<style scoped lang="scss">
.dropdown {
  position: relative;
  height: 100%;
  &-toggle {
    position: relative;
    display: flex;
    align-items: center;
    background: transparent;
    border: none;
    padding-left: 0.3rem;
    padding-top: 0;
    padding-bottom: 0;
    padding-right: 0.8rem;
    height: 100%;
    &__icon {
      display: block;
      margin-right: 0.2rem;
      width: 1.6rem;
      height: 1.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 100%;
        height: 100%;
      }
    }
    &__text {
      display: block;
    }
  }
  &-items {
    display: none;
    z-index: 1;
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    border: 1px solid $sidebar-bg;
    border-radius: $border-radius;
    box-shadow: 0 1px 12px rgba(202, 202, 202, 0.5);
  }
  &.show {
    .dropdown-toggle {
      background: $sidebar-bg;
    }
    .dropdown-items {
      display: block;
    }
  }
  &-item {
    padding: 0.5rem 1rem;
    display: flex;
    cursor: pointer;
    &:not(:last-child) {
      border-bottom: 1px solid $sidebar-bg;
    }
    &:hover,
    &:active,
    &:focus {
      background: rgba($sidebar-bg, 0.3);
    }
    &__icon {
      display: block;
      margin-right: 0.8rem;
      width: 1.2rem;
      height: 1.2rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    &__text {
      display: block;
    }
  }
  &--right {
    .dropdown-items {
      left: auto;
      right: 0;
    }
  }
}
</style>

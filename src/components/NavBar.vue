<template>
  <header class="navbar">
    <div class="logo" title="Appknox Translate">
      <img class="logo__img" src="../assets/logo.svg" alt="appknox" />
      <span class="logo__title">Translate</span>
    </div>
    <slot></slot>
    <div class="navbar__right">
      <slot name="right"></slot>
      <div class="logged">{{ editor }}</div>
    </div>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class NavBar extends Vue {
  private editor = "";

  fetchUser() {
    const editor = localStorage.getItem("editor") || "";
    this.editor = editor;
  }

  mounted() {
    this.fetchUser();
  }
}
</script>

<style scoped lang="scss">
.navbar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  height: $navbar-height;
  padding: 0 1rem;
  background: $color-bg;
  box-shadow: 1px 0 12px rgba(lighten($color-text, 45%), 0.5);
  &__right {
    margin-left: auto;
    display: flex;
    align-items: center;
    & > * {
      margin-left: 0.8rem;
    }
  }
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
</style>

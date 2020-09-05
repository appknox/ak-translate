<template>
  <header class="navbar">
    <div class="logo" title="Appknox Translate">
      <img class="logo__img" src="../assets/logo.svg" alt="appknox" />
      <span class="logo__title">Translate</span>
    </div>
    <slot></slot>
    <div class="logged">{{ username }}</div>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GithubUserService from "../services/GithubUserService";

@Component
export default class NavBar extends Vue {
  // @Prop() private breadcrumb!: BreadcrumbLinkType[];

  private username = "";

  fetchUser() {
    const username = localStorage.getItem("username");
    if (username) {
      this.username = username;
      return;
    }
    return GithubUserService.get().then(response => {
      this.username = response.data.login;
      localStorage.setItem("username", this.username);
    });
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

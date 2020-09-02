<template>
  <header class="navbar">
    <div class="logo" title="Appknox Translate">
      <img class="logo__img" src="../assets/logo.svg" alt="appknox" />
      <span class="logo__title">Translate</span>
    </div>
    <BreadCrumb v-bind:breadcrumb="breadcrumb" />
    <div class="logged">{{ username }}</div>
  </header>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import BreadCrumb from "@/components/BreadCrumb.vue";
import BreadcrumbLink from "../types/BreadcrumbLink";
import GithubUserService from "../services/GithubUserService";

@Options({
  props: {
    breadcrumb: Array
  },
  components: {
    BreadCrumb
  }
})
export default class NavBar extends Vue {
  breadcrumb!: BreadcrumbLink[];

  private username = "";

  fetchUser() {
    GithubUserService.get().then(response => {
      this.username = response.data.login;
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
  padding: 0 1em;
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

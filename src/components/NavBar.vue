<template>
  <header class="navbar">
    <div class="logo" title="Appknox Translate">
      <img class="logo__img" src="../assets/logo.svg" alt="appknox" />
      <span class="logo__title">Translate</span>
    </div>
    <slot></slot>
    <div class="navbar__right">
      <slot name="right"></slot>
      <LanguageDropdown
        v-if="showLanguageSwitch"
        v-bind:disabled="languageSwitchDisabled"
      />
      <div class="logged">{{ editor }}</div>
      <div
        class="logged dropdown dropdown--right"
        v-bind:class="{ show: show }"
      >
        <button class="dropdown-toggle" v-on:click="openDropdown()">
          <span class="dropdown-toggle__icon"><AccountIcon /></span>
          <span class="dropdown-toggle__text">{{ editor }}</span>
        </button>
        <div class="dropdown-items">
          <div
            class="dropdown-item dropdown-item--danger"
            v-on:click="resetSession()"
          >
            <span class="dropdown-item__icon"><ResetSessionIcon /></span>
            <span class="dropdown-item__text">Reset&nbsp;Session</span>
          </div>
          <!-- <div class="dropdown-item" v-on:click="logout()">
            <span class="dropdown-item__icon"><LogoutIcon /></span>
            <span class="dropdown-item__text">Logout</span>
          </div> -->
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AccountIcon from "vue-material-design-icons/Account.vue";
import LogoutIcon from "vue-material-design-icons/LocationExit.vue";
import ResetSessionIcon from "vue-material-design-icons/DeleteForever.vue";
import LanguageDropdown from "@/components/LanguageDropdown.vue";

@Component({
  components: {
    LanguageDropdown,
    AccountIcon,
    LogoutIcon,
    ResetSessionIcon
  }
})
export default class NavBar extends Vue {
  @Prop() languageSwitchDisabled!: boolean;
  @Prop({ default: false }) showLanguageSwitch!: boolean;

  private editor = "";
  private show = false;

  openDropdown() {
    this.show = !this.show;
  }

  logout() {
    // localStorage.clear();
    this.$router.push({ name: "login" });
    this.$toast.success("Logged out");
  }

  resetSession() {
    localStorage.clear();
    this.$router.go(0);
  }

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
    justify-content: flex-end;
    height: 100%;
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
      margin-right: 0.1rem;
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
      margin-right: 0.4rem;
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
    &--danger {
      color: $color-secondary;
    }
  }
  &--right {
    .dropdown-items {
      left: auto;
      right: 0;
      min-width: 12rem;
    }
  }
}
</style>

<template>
  <div class="contain-height">
    <div class="full-panel-layout">
      <main class="main">
        <div class="login">
          <div class="logo" title="Appknox Translate">
            <img class="logo__img" src="../assets/logo.svg" alt="appknox" />
            <div class="logo__title">Translate</div>
          </div>
          <div class="login__form">
            <h1 class="login__title">Login</h1>
            <div class="login__field">
              <label
                ><span class="login__label">Username</span>
                <input
                  class="login__input"
                  type="text"
                  v-model="name"
                  placeholder="Your username"
                />
              </label>
              <div class="login__error">{{ nameInvalidMsg }}</div>
            </div>
            <div class="login__field">
              <label
                ><span class="login__label">Access Token</span>
                <input
                  class="login__input"
                  type="text"
                  v-model="token"
                  placeholder="Access Token"
                />
              </label>
              <div class="login__error">{{ tokenInvalidMsg }}</div>
            </div>
            <div class="login__field">
              <button
                class="login__btn akt-btn akt-btn--primary"
                v-on:click="login()"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NavBar from "@/components/NavBar.vue";
import GithubUserService from "../services/GithubUserService";

@Component({
  components: {
    NavBar
  }
})
export default class Login extends Vue {
  private token = "";
  private name = "";
  private username = "";

  private tokenInvalidMsg = "";
  private nameInvalidMsg = "";

  validateToken() {
    if (this.token.length == 0) {
      this.tokenInvalidMsg = "This field is required";
      return false;
    }
    if (
      this.token.length < 20 ||
      !new RegExp("^[a-zA-Z0-9]*$").test(this.token)
    ) {
      this.tokenInvalidMsg = "Invalid token";
      return false;
    }
    this.tokenInvalidMsg = "";
    return true;
  }

  validateName() {
    if (this.name.length == 0) {
      this.nameInvalidMsg = "This field is required";
      return false;
    }
    if (this.name.length < 3) {
      this.nameInvalidMsg = "Atleast 3 characters required";
      return false;
    }
    if (!new RegExp("^[a-zA-Z0-9-]{3,15}$").test(this.name)) {
      this.nameInvalidMsg = "Supported characters are [a-z], [0-9], -";
      return false;
    }
    if (this.name.length > 15) {
      this.nameInvalidMsg = "Maximum 15 characters allowed";
      return false;
    }
    this.nameInvalidMsg = "";
    return true;
  }

  login() {
    if (!this.validateName() || !this.validateToken()) {
      return;
    }
    this.setUser();
  }

  async setUser() {
    return GithubUserService.get(this.token)
      .then(async response => {
        this.username = response.data.login;
        await localStorage.setItem("username", this.username);
        await localStorage.setItem("token", this.token);
        await localStorage.setItem("editor", this.name);
        this.$router.push({ name: "projects" });
        return;
      })
      .catch(() => {
        this.$toast.error("Login failed. Invalid token");
        this.tokenInvalidMsg = "Invalid token";
        return;
      });
  }

  mounted() {
    this.token = localStorage.getItem("token") || "";
    this.name = localStorage.getItem("editor") || "";
  }
}
</script>

<style scoped lang="scss">
.full-panel-layout {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main {
  height: 100%;
  width: 100%;
  overflow-x: scroll;
  background: $main-bg;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 2rem;
  &__img {
    width: 9rem;
  }
  &__title {
    font-size: 1.6rem;
    margin-left: 0.4rem;
  }
}

.login {
  display: block;
  padding-top: 10rem;
  padding-bottom: 10rem;
  font-size: 0.9rem;
  line-height: 1.5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  &__title {
    padding: 1.2rem 0 1rem;
    text-align: center;
    font-size: 1.5rem;
    font-weight: 400;
  }
  &__form {
    background: white;
    padding: 3rem;
    width: 29rem;
    border: 1px solid darken($color-bg, 10%);
    border-radius: $border-radius;
  }
  &__field {
    padding-bottom: 0.8rem;
  }
  &__input {
    width: 100%;
    border: 2px solid darken($color-bg, 10%);
    font-size: 1.02rem;
    border-radius: $border-radius;
    padding: 0.5rem;
  }
  &__btn {
    width: 100%;
    font-size: 1.05rem;
    justify-content: center;
    margin-top: 0.5rem;
    padding: 0.5rem;
  }
  &__error {
    color: $color-error;
    font-size: 0.8rem;
  }
}
</style>

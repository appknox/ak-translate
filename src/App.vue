<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import router from "@/router";

import "vue-material-design-icons/styles.css";

import VueMarkdownEditor from "@kangc/v-md-editor";
import enUS from "@kangc/v-md-editor/lib/lang/en-US";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import GithubUserService from "@/services/GithubUserService";

VueMarkdownEditor.use(vuepressTheme);
VueMarkdownEditor.lang.use("en-US", enUS);
Vue.use(VueMarkdownEditor);

Vue.use(Toast, {
  timeout: 3000,
  transition: "Vue-Toastification__fade",
  pauseOnFocusLoss: false
});

function checkTokenValidity() {
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }
  return GithubUserService.get(token).catch(err => {
    if (err.response.status == 401) {
      localStorage.removeItem("token");
      Vue.$toast.error("Could not authenticate");
    }
    router.push({ name: "login" });
    return;
  });
}
checkTokenValidity();

export default {};
</script>

<style lang="scss">
#app {
  height: 100%;
  overflow: hidden;
  font-family: "Noto Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 14px;
  color: $color-text;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
</style>

<style lang="scss">
.v-md-editor {
  box-shadow: none;
  z-index: 1;
  background-color: transparent;
}
.v-md-editor--preview .v-md-editor-preview {
  padding: 0;
}
.vuepress-markdown-body {
  font-family: inherit;
  font-size: inherit;
  color: inherit;
}
.v-md-textarea-editor pre,
.v-md-textarea-editor textarea {
  padding: 0.3rem 0.6rem;
  font-size: 0.85rem;
}
.v-md-editor--fullscreen {
  top: $navbar-height;
  bottom: $navbar-height;
  background: white;
}
</style>

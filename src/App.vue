<template>
  <div id="app">
    <header class="header">
      <div class="logo">
        <img class="logo__img" src="./assets/logo.svg" alt="appknox" />
        <span class="logo__separator"> | </span>
        <span class="logo__title">Translate</span>
      </div>
      <nav></nav>
    </header>

    <div class="side-panel-layout">
      <aside class="sidebar">
        <img alt="Vue logo" src="./assets/logo.png" />
        <div id="nav">
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link>
        </div>
      </aside>
      <main class="main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style lang="scss">
html,
body {
  height: 100%;
}

body {
  margin: 0;
}

#app {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $color-text;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

// header
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  height: 3.2em;
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
  &__separator {
    padding: 0 0.3rem;
    font-size: 1.8rem;
    color: lighten($color-text, 65%);
  }
  &__title {
    font-size: 1.2rem;
  }
}

// layout
.side-panel-layout {
  height: 100%;
  display: flex;
  overflow: hidden;
}

.sidebar {
  overflow-y: scroll;
  background: lighten($color-text, 70%);
  width: 100%;

  @media (min-width: 768px) {
    width: 20rem;
  }
}

.main {
  overflow-y: scroll;
  width: 100%;
  flex: 1;
}
</style>

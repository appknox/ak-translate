<template>
  <div class="contain-height">
    <NavBar class="sitenav">
      <BreadCrumb v-bind:breadcrumb="[{ label: 'Projects', route: null }]" />
    </NavBar>
    <div class="full-panel-layout">
      <main class="projects">
        <h1 class="projects__title">Projects</h1>
        <div class="project__cards">
          <router-link to="/vulnerabilities" class="project__card"
            >Vulnerabilities</router-link
          >
          <div class="project__card disabled">Compliances</div>
          <div class="project__card disabled">Report</div>
          <div class="project__card disabled">Dashboard</div>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NavBar from "@/components/NavBar.vue";
import BreadCrumb from "@/components/BreadCrumb.vue";

@Component({
  components: {
    NavBar,
    BreadCrumb
  }
})
export default class Projects extends Vue {}
</script>

<style scoped lang="scss">
.sitenav {
  margin-bottom: -$navbar-height;
}
.full-panel-layout {
  height: 100%;
  width: 100%;
  padding-top: $navbar-height;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.projects {
  height: 100%;
  width: 100%;
  overflow-x: scroll;
  background: $main-bg;
  &__title {
    text-align: center;
    font-size: 1.5rem;
    padding: 3rem 3rem 2rem;
  }
}
.project {
  &__cards {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 0 2rem;
    @media (min-width: 768px) {
      flex-direction: row;
    }
  }
  &__card {
    display: flex;
    height: 6rem;
    width: 100%;
    background: $project-card-bg;
    border-radius: $border-radius;
    border: 1px solid $project-card-border-color;
    justify-content: center;
    align-items: center;
    margin: 1rem;
    &:not(.disabled):hover {
      border-color: $color-primary;
    }
    &.disabled {
      color: lighten($color-gray, 25%);
      background: lighten($color-gray, 50%);
    }
  }
}
</style>

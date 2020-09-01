<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li
        v-for="b in breadcrumb"
        :key="b.route"
        class="breadcrumb-item"
        v-bind:class="{ active: b.route }"
      >
        <router-link v-if="b.route" v-bind:to="b.route">{{
          b.label
        }}</router-link>
        <span v-else>{{ b.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import BreadcrumbLink from "../types/BreadcrumbLink";

@Component
export default class BreadCrumb extends Vue {
  @Prop() private breadcrumb!: BreadcrumbLink[];
}
</script>

<style scoped lang="scss">
.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding-left: 3rem;
  li {
    span {
      color: $color-breadcrumb-active;
    }
    &:not(:last-child)::after {
      content: "/";
      display: inline-block;
      margin-left: 0.5em;
      margin-right: 0.5rem;
      color: $color-breadcrumb-separator;
    }
  }
}
</style>

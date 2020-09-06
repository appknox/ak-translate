import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    redirect: '/projects',
  },
  {
    path: "/projects",
    name: "Projects",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "projects" */ "../views/Projects.vue")
  },
  {
    path: "/vulnerabilities",
    name: "Vulnerabilities",
    redirect: '/vulnerabilities/1',
  },
  {
    path: "/vulnerabilities/:id",
    name: "Vulnerability",
    component: () =>
      import(/* webpackChunkName: "projects" */ "../views/VulnerabilityView.vue"),
  },
  {
    path: "/vulnerabilities/:id/translate",
    name: "Translate",
    component: () =>
      import(
        /* webpackChunkName: "vulnerability_translate" */ "../views/VulnerabilityTranslateView.vue"
      ),
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import store from '../store';

Vue.use(VueRouter);

function guard(to, from, next){
  if (localStorage.getItem("token") && localStorage.getItem("username") && localStorage.getItem("editor")) {
    next();
  } else {
    next('/login');
  }
}

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "home",
    beforeEnter: guard,
    redirect: { name: "projects"}
  },
  {
    path: "/login",
    name: "login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/LoginView.vue")
  },
  {
    path: "/projects",
    name: "projects",
    beforeEnter: guard,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "projects" */ "../views/ProjectsView.vue")
  },
  {
    path: "/vulnerabilities",
    name: "vulnerabilities",
    beforeEnter: guard,
    redirect: '/vulnerabilities/1',
  },
  {
    path: "/vulnerabilities/:id",
    name: "vulnerability",
    beforeEnter: guard,
    component: () =>
      import(/* webpackChunkName: "projects" */ "../views/VulnerabilityView.vue"),
  },
  {
    path: "/vulnerabilities/:id/translate",
    name: "translate",
    beforeEnter: guard,
    component: () =>
      import(
        /* webpackChunkName: "vulnerability_translate" */ "../views/VulnerabilityTranslateView.vue"
      )
  },
  {
    path: "*",
    redirect: { name: "home"}
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

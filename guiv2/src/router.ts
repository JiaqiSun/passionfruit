import Vue from "vue";
import Router from "vue-router";

import Welcome from "@/views/Welcome.vue";
import AppSelector from "@/views/AppSelector.vue";

Vue.use(Router);


export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  linkActiveClass: "is-active",
  routes: [
    {
      path: "/",
      name: "welcome",
      component: Welcome,
    },

    {
      path: "/apps/:device",
      name: "apps",
      component: AppSelector,
    },

    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    // },
  ],
});

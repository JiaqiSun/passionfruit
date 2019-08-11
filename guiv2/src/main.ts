import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "expose-loader?$!jquery";

import Buefy from "buefy";
import "bulmaswatch/darkly/bulmaswatch.min.css";
import "@mdi/font/css/materialdesignicons.css";

Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");

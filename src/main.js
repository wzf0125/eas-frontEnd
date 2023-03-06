import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";

Vue.config.productionTip = false;

import { showError } from "./utils/utils";

//登录拦截
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    //requireAuth若为true则该路由需要判断是否登录
    if (sessionStorage.getItem("Authorization")) {
      //判断当前的userName数据是否存在
      next();
    } else {
      showError("登录失效");
      next({
        //返回登录页面
        path: "/login",
        query: { redirect: to.fullPath },
      });
    }
  } else {
    next();
  }
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

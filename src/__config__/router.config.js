import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './router.prototype';
import navigationGuard from './router.navigation.guard';

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: 'history'
});

navigationGuard(router);

export default router;

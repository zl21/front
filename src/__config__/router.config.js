import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './router.prototype';
import navigationGuard from './router.navigation.guard';
import { mock } from '../constants/global';

Vue.use(VueRouter);
const mode = mock() ? 'hash' : 'history';
const router = new VueRouter({
  routes,
  mode
});

navigationGuard(router);

export default router;

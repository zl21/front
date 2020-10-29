import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './router.prototype';
import navigationGuard from './router.navigation.guard';
import { mock } from '../constants/global';

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err);
};

Vue.use(VueRouter);
const mode = mock() ? 'hash' : 'history';
const router = new VueRouter({
  routes,
  mode
});

navigationGuard(router);

export default router;

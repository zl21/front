import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import { getGuid } from './src/__utils__/random';
import router from './src/__config__/router/router.config';
import App from './src/App';

Vue.use(VueRouter);
Vue.use(Vuex);

const createDOM = () => {
  const div = document.createElement('div');
  div.setAttribute('id', getGuid());
  document.body.appendChild(div);
  return div;
};

const init = () => {
  const rootDom = createDOM();
  new Vue({
    router,
    render: createElement => createElement(App)
  }).$mount(rootDom);
};

init();

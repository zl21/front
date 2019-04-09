import Vue from 'vue';
import BurgeonUi from 'burgeon-ui';
import 'burgeon-ui/dist/styles/burgeon-ui.css';
import './src/assets/iconfont-r3/iconfont.css';
import { getGuid } from './src/__utils__/random';
import router from './src/__config__/router.config';
import store from './src/__config__/store.config';
import App from './src/App';
import 'burgeon-ui/src/styles/common/iconfont/bjIconfonts/iconfont';
import './src/assets/theme/custom.less';
import './src/constants/dateApi';

import network from './src/__utils__/network';
import { enableGateWay } from './src/__config__/global';

Vue.use(BurgeonUi);

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
    store,
    render: createElement => createElement(App)
  }).$mount(rootDom);
};

const getGateWayServiceId = () => {
  network.get('/p/c/get_service_id').then((res) => {
    window.sessionStorage.setItem('serviceId', res.data.data.serviceId);
    setTimeout(() => {
      init();
    }, 0);
  });
};

if (enableGateWay) {
  getGateWayServiceId();
} else {
  init();
}

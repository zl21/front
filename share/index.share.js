import Vue from 'vue';
import store from '../src/__config__/store.config';
import network from '../src/__utils__/network';
import {
  enableGateWay,
  enableInitializationRequest,
  HAS_BEEN_DESTROYED_MODULE,
  specifiedGlobalGateWay
} from '../src/constants/global';

import customizedModalConfig from '../src/__config__/customizeDialog.config';
import Loading from '../src/__utils__/loading';
import projectConfig from '../projectConfig/project.config.js';
import '../src/assets/js/entry.common'
import {
  packageMessage,
  hookAJAX,
  getGateWayServiceId,
  init
} from '../share/entry.constant.js'

import applayout from './layout.config.js';
// css import
// 组件css汇总

// import '../src/index.less';
// import '../src/assets/theme/custom.less';

let R3_share_Init = ($el) => {
  projectConfig.packageMessage = packageMessage;
  if(window.ProjectConfig){
    window.ProjectConfig = Object.assign(projectConfig,window.ProjectConfig);
  }else{
    window.ProjectConfig = projectConfig;
  }
  if (!projectConfig.appLayout) {
    projectConfig.appLayout = applayout
  }

  // 初始化图片配置
  if (projectConfig.image) {
    store.commit('global/updateImage', projectConfig.image);
  }

  // 注册自定义模态框组件
  const registerCustomizedModal = () => {
    Object.keys(customizedModalConfig).forEach((modalName) => {
      Vue.component(modalName, ((customizedModalConfig[modalName] || {}).component) || {});
    });
  };
  registerCustomizedModal();

  Vue.use(Loading);



  const getSubSystems = () => {
    if (enableInitializationRequest()) {
      network.post('/p/cs/getSubSystems').then((res) => {
        if (res.data.data) {
          store.commit('global/updateMenuLists', res.data.data);
        }
      });
    }
  };




  if (enableGateWay()) {
    getGateWayServiceId($el);
  } else {
    getSubSystems();
    init($el);
  }


}

export default {
  init:R3_share_Init,
  hookAJAX
}
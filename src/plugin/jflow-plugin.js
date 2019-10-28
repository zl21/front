/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-constant-condition */
/* eslint-disable no-return-await */
import Vue from 'vue';
import CreateButton from './button';
import todoList from './todoList';
import '../__plugin__/InstanceManagementList/utils/dateApi';
import network from '../__utils__/network';
import mainComponent from '../__plugin__/InstanceManagementList/mainComponent';
import InstanceManagementList from '../__plugin__/InstanceManagementList/InstanceManagementList';


let axios = {}; // axios请求
let router = {}; // 路由
let store = {};
let userInfo = {}; // 用户信息
let configurationFlag = false; // 是否是直接访问但对象界面  为true时按照配置了流程图的逻辑处理
let jflowIp = ''; // jflow项目的ip
let modifiableFieldName = []; // jflow可修改字段名
let instanceId = null; // 流程id
let showTab = false; // 是否是tab展示
let businessStatus = 0; // 流程状态  -2时正在发起流程


function getConfigMap(tabcmd) { // 获取所有配置流程图的表集合
  if (tabcmd) {
    let businessTypes = JSON.parse(window.localStorage.getItem('businessTypes'));
    let arr = [];
    businessTypes.map((item) => {
      if (item.businessType === router.currentRoute.params.tableId) {
        arr = item.action;
      }
      return item;
    });
    tabcmd.cmds.map((item, index) => {
      if (item === 'actionSUBMIT' && tabcmd.paths[index] && arr.indexOf(tabcmd.paths[index]) < 0) {
        arr.push(tabcmd.paths[index]);
      }
      return item;
    });
    if (businessTypes.length > 0) {
      businessTypes.map((item) => {
        if (item.businessType === router.currentRoute.params.tableId) {
          item.action = arr;
        }
        return item;
      });
    } else {
      businessTypes = [{
        action: arr,
        businessType: router.currentRoute.params.tableId,
        moduleId: null
      }];
    }
    

    window.localStorage.setItem('businessTypes', JSON.stringify(businessTypes));
    // window.localStorage.setItem('businessTypes', JSON.stringify(arr));
  } else {
    axios.post('/jflow/p/cs/task/businessType/list', {}).then((res) => {
      if (res.data.resultCode === 0) {
        const businessTypes = JSON.parse(window.localStorage.getItem('businessTypes')) ? JSON.parse(window.localStorage.getItem('businessTypes')) : [];
        res.data.data.businessTypes.map((item) => {
          businessTypes.map((temp) => {
            if (temp.businessType === item.businessType) {
              item.action.concat(temp.action);
            }
            return temp;
          });

          return item;
        });
        window.localStorage.setItem('businessTypes', JSON.stringify(res.data.data.businessTypes));
      }
    });
  }
}

function thirdlogin() { // 三方登录  获取accessToken
  axios.post('/jflow/p/c/thirdlogin', {
    username: 'guest'
  }).then(() => {
    window.jflowPlugin.jflowIp = jflowIp;
    getConfigMap();
  });
}

async function jflowButtons(id, pid, flag) { // jflow按钮逻辑处理
  return await new Promise((resolve) => {
    axios.post('/jflow/p/cs/task/buttons', {
      businessCode: id,
      userId: JSON.parse(window.localStorage.getItem('userInfo')).id,
      businessType: pid || router.currentRoute.params.tableId
    })
      .then((res) => {
        if (res.data.resultCode === 0) {
          if (res.data.data.submitErrorMsg) {
            window.vm.$Modal.fcError({
              title: '错误',
              content: res.data.data.submitErrorMsg,
              mask: true
            });
          }
          if (res.data.data.businessStatus === -2) {
            window.vm.$Modal.fcError({
              title: '错误',
              content: res.data.resultMsg,
              mask: true
            });
          }
          modifiableFieldName = res.data.data && res.data.data.modifiableField ? res.data.data.modifiableField.split(',') : [];
          instanceId = res.data.data && res.data.data.instanceId ? res.data.data.instanceId : null;
          businessStatus = res.data.data.businessStatus;
          if (!flag) {
            CreateButton(res.data.data, jflowButtons, id);
          }
        }
        resolve(res);
      });
  });
}
function RoutingGuard(router) { // 路由守卫
  router.beforeEach((to, from, next) => {
    const type = to.path.split('/')[3];// 获取组件类型
    instanceId = null;

    if ((type === 'H' || type === 'V') && to.path.indexOf('New') < 0) {
      configurationFlag = false;
      if (((type === 'H' || type === 'Y') && from.path === '/') || true) { // 直接访问单对象界面 或者配置了流程图
        jflowButtons(to.params.itemId, to.params.tableId, true).then((res) => {
          next();
          setTimeout(() => {
            if (res.data.resultCode === 0) {
              CreateButton(res.data.data, jflowButtons, to.query.id);
            }
          }, 300);
        });
        configurationFlag = true;
      }
    } else if (to.path.split('/')[2] === 'TABLE' && true) {
      next();
      configurationFlag = true;
    } else {
      next();
    }
  });
}

async function jflowsave(flag, request) {
  await new Promise((resolve, reject) => {
    if (flag) {
      const params = new URLSearchParams(request.data);
      const changeDetail = {};
      for (const pair of params.entries()) {
        changeDetail[pair[0]] = pair[1];
      }
      const response = changeDetail;
      axios.post('/jflow/p/cs/process/launch',
        {
          businessCodes: response.ids ? response.ids : response.objId,
          businessType: router.currentRoute.params.tableId,
          businessTypeName: router.currentRoute.params.tableName,
          initiator: userInfo.id,
          userName: userInfo.name,
          instanceId,
          initiatorName: userInfo.name,
          changeUser: userInfo.id,
          businessUrl: request.url,
          ruleField: 'V'
        }).then((res) => {
        if (res.data.data.records && res.data.data.records[0].notice) {
          window.vm.$Modal.fcError({
            title: '错误',
            content: res.data.data.records[0].notice
          });
          reject(response);
          return;
        }
        if (res.data.resultCode === 0) {
          if (response.objids) {
            window.vm.$Modal.fcWarning({
              title: '提示',
              content: '请稍等,正在审批······'
            });
          }
          instanceId = res.data.data.instanceId;

          
          if (document.getElementsByClassName('R3-button-group')[0]) {
            jflowButtons(router.currentRoute.params.itemId);
            const children = document.getElementsByClassName('R3-button-group')[0].children;
            for (const child of children) {
              if (child.innerText === '刷新') {
                const style = document.createElement('style');
                const styleStr = `
                    .burgeon-message {
                      display: none!important;
                    }`;
                style.type = 'text/css';
                style.innerHTML = styleStr;
                document.getElementsByTagName('head').item(0).appendChild(style);
                const myEvent = new Event('click');
                child.dispatchEvent(myEvent);

                setTimeout(() => {
                  const parent = document.getElementsByTagName('head').item(0);
                  const thisNode = parent.children[parent.children.length - 1];
                  parent.removeChild(thisNode);
                }, 5000);
              }
            }
          }
          reject(response);
        } else {
          resolve();
        }
      });
    } else {
      const params = new URLSearchParams(request.config.data);
      const changeDetail = {};
      for (const pair of params.entries()) {
        changeDetail[pair[0]] = pair[1];
      }
      delete changeDetail.table;
      delete changeDetail.objId;
      axios.post('/jflow/p/cs/process/business/save',
        {
          businessCodes: request.data.data.objId,
          businessType: router.currentRoute.params.tableId,
          businessTypeName: router.currentRoute.params.tableName,
          changeDetail,
          instanceId,
          changeUser: userInfo.id,
          userName: userInfo.name
        }).then((res) => {
        if (res.data.resultCode === -1) {
          window.vm.$Modal.fcWarning({
            title: '警告',
            content: res.data.resultMsg,
            mask: true
          });
        }
        resolve();
      });
    }
  });
}

function AxiosGuard(axios) { // axios拦截
  axios.interceptors.request.use(async (config) => {
    if (config.url.indexOf('jflow') >= 0) { // 所有jflow接口都添加accessToken
      config.headers.accountName = 'guest';
    }
    const type = router.currentRoute.path.split('/')[3];// 获取组件类型

    if (configurationFlag) { // 配置了流程图并判断是否触发了配置的动作，满足则走jflow的流程，否则不处理
      let launchConfig = [];
      JSON.parse(window.localStorage.getItem('businessTypes')).map((item) => {
        if (item.businessType === router.currentRoute.params.tableId) {
          launchConfig = item.action;
        }
        return item;
      });
      // jflow流程发起
      const serviceId = store.state.global.serviceIdMap[router.currentRoute.params.tableName];
      for (let i = 0; i < launchConfig.length; i++) {
        if (`/${serviceId}${launchConfig[i]}`.indexOf(config.url) >= 0) {
          await jflowsave(true, config);
        }
      }
    }

    return config;
  });
  axios.interceptors.response.use(async (response) => {
    // let config=AxiosGuard(axios);
    if (response.data.code === 0) { // 请求成功
      if (response.config.url.endsWith('/p/cs/getObject') && ((configurationFlag && instanceId) || businessStatus === -2)) { // 获取单对象的字段集合时根据jflow返回值修改对应字段
        response.data.data = modifyFieldConfiguration(response.data.data);
      }
      if (response.config.url.endsWith('/p/cs/objectTab')) {
        if (configurationFlag && instanceId) {
          response.data.data.objreadonly = false;
        }
        // 主表的按钮获取
        if (response.config.data.indexOf('ismaintable=y') >= 0) {
          const tabcmd = response.data.data.tabcmd;
          getConfigMap(tabcmd);
        }
      }

      if (response.config.url.endsWith('/p/cs/hello')) { // 获取用户信息
        window.localStorage.setItem('userInfo', JSON.stringify(response.data));
        userInfo = response.data;
        window.jflowPlugin.userInfo = userInfo;
      }

      if (response.config.url.endsWith('/p/cs/getSubSystems')) { // 获取完菜单，添加待办列表菜单
        !showTab ? todoList(store, router) : null;
      }
    }

    return response;
  });
}


function modifyFieldConfiguration(data) { // 根据jflow修改相应的字段配置
  if (instanceId || businessStatus === -2) {
    data.addcolums.map((item) => {
      if (item.childs) {
        item.childs.map((temp) => {
          if (modifiableFieldName.indexOf(String(temp.colid)) >= 0 && !temp.readonly) {
            temp.readonly = false;
          } else {
            temp.readonly = true;
          }
          return temp;
        });
      } else if (modifiableFieldName.indexOf(String(item.child.colid)) >= 0 && !item.child.readonly) {
        item.child.readonly = false;
      } else {
        item.child.readonly = true;
      }
      
      return item;
    });
  }
  return data;
}


function createComponent() { // 创建跟节点实例
  const jflowPlugin = document.createElement('div');
  jflowPlugin.id = 'jflowPlugin';
  document.body.appendChild(jflowPlugin);
  const vm = new Vue({
    el: '#jflowPlugin',
    template: '<mainComponent />',
    components: {
      mainComponent
    }
  });
  window.jflowPlugin = vm.$children[0];
  window.jflowPlugin.axios = axios;
  window.jflowPlugin.router = router;
  window.jflowPlugin.store = store;
  window.jflowPlugin.showTab = showTab;
}


const install = function install(Vue, options = {}) {
  showTab = options.showTab;
  if (options.axios && options.router && options.store && options.jflowIp) {
    axios = options.axios;
    router = options.router;
    store = options.store;
    jflowIp = options.jflowIp;
    thirdlogin();
    RoutingGuard(options.router);
    AxiosGuard(options.axios);
    createComponent();

    Vue.prototype.$network = network;
  }
};


export default install;

export function components() {
  return InstanceManagementList;
}

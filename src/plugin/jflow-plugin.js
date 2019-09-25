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
const configMap = []; // 所有配置流程图的表集合
let configurationFlag = false; // 是否是直接访问但对象界面  为true时按照配置了流程图的逻辑处理
let accessToken = ''; // jflow请求头携带的token
let jflowIp = ''; // jflow项目的ip
let modifiableFieldName = []; // jflow可修改字段名
let moduleId = null; // 模版id
let instanceId = null; // 流程id
let showTab = false; // 是否是tab展示


function getConfigMap() { // 获取所有配置流程图的表集合
  axios.post('/jflow/p/cs/task/businessType/list', {}).then((res) => {
    if (res.data.resultCode === 0) {
      window.localStorage.setItem('businessTypes', JSON.stringify(res.data.data.businessTypes));
    } else {
      window.localStorage.setItem('businessTypes', JSON.stringify([]));
    }
  });
}

function thirdlogin() { // 三方登录  获取accessToken
  network.post('/jflow/p/c/thirdlogin', { username: 'guest' }).then((res) => {
    accessToken = res.data.data ? res.data.data.accessToken : '';
    window.jflowPlugin.jflowIp = jflowIp;
    getConfigMap();
  });
}

function checkFlowChart(tableId) { // 判断当前表配置的流程图个数,返回个数
  let sum = 0;
  configMap.map((item) => {
    if (item.businessType === tableId) {
      sum++;
      moduleId = item.moduleId;
    }
  });
  return sum;
}

function RoutingGuard(router) { // 路由守卫
  router.beforeEach((to, from, next) => {
    const type = to.path.split('/')[3];// 获取组件类型
    instanceId = null;

    if ((type === 'H' || type === 'V') && to.path.indexOf('New') < 0) {
      configurationFlag = false;
      moduleId = null;
      if (((type === 'H' || type === 'Y') && from.path === '/') || true) { // 直接访问单对象界面 或者配置了流程图
        next();
        setTimeout(() => {
          jflowButtons(to.params.itemId, to.params.tableId);
          configurationFlag = true;
        }, 500);
      }
    } else if (to.path.split('/')[2] === 'TABLE' && true) {
      moduleId = null;
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
      console.log(response);
      axios.post('/jflow/p/cs/process/launch',
        {
          businessCodes: response.ids ? response.ids : response.objId,
          businessType: router.currentRoute.params.tableId,
          initiator: userInfo.id,
          initiatorName: userInfo.name,
          businessUrl: request.url,
          ruleField: 'V'
        }).then((res) => {
        if (res.data.notice) {
          window.vm.$Modal.fcError({
            title: '错误',
            content: res.data.notice
          });
          resolve();
          return;
        }
        if (res.data.resultCode === 0) {
          window.vm.$Modal.fcSuccess({
            title: '提示',
            content: res.data.resultMsg
          });
          instanceId = res.data.data.instanceId;
          if (document.getElementsByClassName('button-group')[0]) {
            const children = document.getElementsByClassName('button-group')[0].children;
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

            jflowButtons(response.objId);
          }
          reject(response);
        } else {
          resolve();
        }

        for (const i of document.getElementsByClassName('el-loading-mask')) {
          i.style.display = 'none';
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
          businessCodes: router.current.params.itemId,
          businessType: router.current.params.tableId,
          businessTypeName: router.current.params.tableName,
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


    // const needbody = {};
    // const Temparam = new FormData();
    // if (flag) {
    //   const params = new URLSearchParams(request.data);
    //   const changeDetail = {};
    //   for (const pair of params.entries()) {
    //     changeDetail[pair[0]] = pair[1];
    //   }
    //   Temparam.append('table', changeDetail.table);
    //   Temparam.append('objid', changeDetail.objId);
    // } else {
    //   Temparam.append('table', router.currentRoute.params.tableName);
    //   Temparam.append('objid', router.currentRoute.params.itemId);
    // }
    // const serviceId = store.state.global.serviceIdMap[router.currentRoute.params.tableName];
    // network.post('/p/cs/getObject', Temparam).then(async (res) => {
    //   if (res.data.code === 0) {
    //     res.data.data.addcolums.forEach((element) => {
    //       if (element.childs) {
    //         element.childs.map((tem) => {
    //           if (tem.isfk && tem.isfk === true) {
    //             needbody[tem.colname] = tem.refobjid;
    //           } else {
    //             needbody[tem.colname] = tem.valuedata;
    //           }
    //         });
    //       }
    //     });
    //     if (flag === true) {
    //       const params = new URLSearchParams(response.data);
    //       const changeDetail = {};
    //       for (const pair of params.entries()) {
    //         changeDetail[pair[0]] = pair[1];
    //       }
    //       response = changeDetail;
    //       let allPath = window.location.pathname;
    //       const temSearch = new URLSearchParams(window.location.search);
    //       temSearch.set('id', response.objId);
    //       allPath += `?${temSearch.toString()}`;

    //       network.post('/jflow/p/cs/process/launch', {
    //         businessBody: needbody, businessCode: parseInt(response.objId), businessType: router.currentRoute.params.tableId, initiator: userInfo.id, initiatorName: userInfo.name, moduleId, businessUrl: '/p/cs/objectSubmit', formUrl: allPath 
    //       }).then((res) => {
    //         if (res.data.notice) {
    //           window.vm.$Modal.fcError({
    //             title: '错误',
    //             content: res.data.notice
    //           });
    //           reject(response);
    //         }
    //         if (res.data.resultCode === 0 && res.data.data.instanceId && !res.data.notice) {
    //           window.vm.$Modal.fcSuccess({
    //             title: '提示',
    //             content: res.data.resultMsg
    //           });
    //           instanceId = res.data.data.instanceId;
    //           const children = document.getElementsByClassName('button-group')[0].children;
    //           for (const child of children) {
    //             if (child.innerText === '刷新') {
    //               const myEvent = new Event('click');
    //               child.dispatchEvent(myEvent);
    //             }
    //           }

    //           jflowButtons(response.objId);

    //           for (const i of document.getElementsByClassName('el-loading-mask')) {
    //             i.style.display = 'none';
    //           }
    //           reject(response);
    //         } else {
    //           resolve();
    //         }
    //       });
    //     } else { // 修改保存
    //       const params = new URLSearchParams(response.config.data);
    //       const changeDetail = {};
    //       for (const pair of params.entries()) {
    //         changeDetail[pair[0]] = pair[1];
    //       }
    //       const id = changeDetail.objId;
    //       delete changeDetail.table;
    //       delete changeDetail.objId;
    //       network.post('/jflow/p/cs/process/business/save', {
    //         businessBody: needbody, businessCode: parseInt(id), changeDetail, instanceId, changeUser: userInfo.id, userName: userInfo.name 
    //       }).then((res) => {
    //         if (res.data.resultCode === -1) {
    //           window.vm.$Modal.fcWarning({
    //             title: '警告',
    //             content: res.data.resultMsg,
    //             mask: true
    //           });
    //         }
    //       });
    //     }
    //   }
    // });
  });
}

function AxiosGuard(axios) { // axios拦截
  axios.interceptors.request.use(async (config) => {
    if (config.url.indexOf('jflow') >= 0) { // 所有jflow接口都添加accessToken
      config.headers.accessToken = accessToken;
    }
    const type = router.currentRoute.path.split('/')[3];// 获取组件类型

    if (!instanceId && configurationFlag) { // 配置了流程图并判断是否触发了配置的动作，满足则走jflow的流程，否则不处理
      let launchConfig = [];
      JSON.parse(window.localStorage.getItem('businessTypes')).map((item) => {
        if (item.businessType === router.currentRoute.params.tableId && (type === 'V' || type === 'H')) {
          launchConfig = item.action;
        } else if (item.businessType === router.currentRoute.params.tableId && (router.currentRoute.path.split('/')[2] === 'TABLE')) {
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
      if (response.config.url.indexOf('/customer_ctrl/save') >= 0) { // 修改保存
        await jflowsave(false, response);
      }
      if (response.config.url.indexOf('/p/cs/getObject') >= 0 && configurationFlag && instanceId) { // 获取单对象的字段集合时根据jflow返回值修改对应字段
        response.data.data = modifyFieldConfiguration(response.data.data);
      }
      if (response.config.url.indexOf('/p/cs/objectTab') >= 0 && configurationFlag && instanceId) {
        response.data.data.objreadonly = false;
      }

      if (response.config.url.indexOf('/p/cs/hello') >= 0) { // 获取用户信息
        window.localStorage.setItem('userInfo', JSON.stringify(response.data));
        userInfo = response.data;
        window.jflowPlugin.userInfo = userInfo;
      }

      if (response.config.url.indexOf('/p/cs/getSubSystems') >= 0) { // 获取完菜单，添加待办列表菜单
        !showTab ? todoList(store, router) : null;
      }
    }

    return response;
  });
}


function jflowButtons(id, pid) { // jflow按钮逻辑处理
  axios.post('/jflow/p/cs/task/buttons', {
    businessCode: id,
    userId: JSON.parse(window.localStorage.getItem('userInfo')).id,
    businessType: pid || router.current.params.tableId
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
        modifiableFieldName = res.data.data && res.data.data.modifiableField ? res.data.data.modifiableField.split(',') : [];
        instanceId = res.data.data && res.data.data.instanceId ? res.data.data.instanceId : null;

        CreateButton(res.data.data, jflowButtons, id, store);
      }
    });
}

function modifyFieldConfiguration(data) { // 根据jflow修改相应的字段配置
  if (instanceId) {
    data.addcolums.map((item) => {
      if (item.childs) {
        item.childs.map((temp) => {
          temp.readonly = true;
          if (modifiableFieldName.indexOf(String(temp.colid)) >= 0) {
            temp.readonly = false;
          }
          return temp;
        });
      } else {
        item.child.readonly = true;
        if (modifiableFieldName.indexOf(String(item.child.colid)) >= 0) {
          item.child.readonly = false;
        }
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

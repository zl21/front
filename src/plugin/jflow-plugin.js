/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-constant-condition */
/* eslint-disable no-return-await */
import Vue from 'vue';
import { DispatchEvent } from '../__utils__/dispatchEvent';
import { Version } from '../constants/global';
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
let closeJflowIcon = false; // 是否是tab展示
let businessStatus = 0; // 流程状态  -2时正在发起流程
let encryptionJflow = false; // 传参是否加密

function getQueryButtons(data) {
  const tabcmd = data.tabcmd;
  const waListButtons = data.waListButtons;
  const defaultUrls = ['/p/cs/batchVoid', '/p/cs/batchUnSubmit', '/p/cs/batchDelete', '/p/cs/exeAction', '/p/cs/batchSave'];
  if (Version() === '1.3') {
    let businessTypes = JSON.parse(window.localStorage.getItem('checkUrls')) ? JSON.parse(window.localStorage.getItem('checkUrls')) : [];
    
    businessTypes = businessTypes.map((temp) => {
      if (temp.businessType === router.currentRoute.params.tableId) {
        const arr = temp.checkUrls;
        // 处理静默程序的动作定义按钮
        if (waListButtons) {
          waListButtons.map((item) => {
            if (item.vuedisplay === 'slient' && arr.indexOf(item.action) < 0) {
              arr.push(item.action);
            }
            return item;
          });
        }
        temp.checkUrls = arr;
      }
      return temp;
    });
    if (businessTypes.length === 0) {
      businessTypes = [{
        checkUrls: defaultUrls,
        businessType: router.currentRoute.params.tableId,
      }];
    }
    window.localStorage.setItem('checkUrls', JSON.stringify(businessTypes));
  } else {
    let businessTypes = JSON.parse(window.localStorage.getItem('checkUrls')) ? JSON.parse(window.localStorage.getItem('checkUrls')) : [];
    let arr = [];
    businessTypes.map((item) => {
      if (item.businessType === router.currentRoute.params.tableId) {
        arr = item.checkUrls ? item.checkUrls : [];
      }
      return item;
    });

    // 处理静默程序的动作定义按钮
    if (waListButtons) {
      waListButtons.map((item) => {
        if (item.vuedisplay === 'slient' && arr.indexOf(item.action) < 0) {
          arr.push(item.action);
        }
        return item;
      });
    }

    const defaultCmd = ['actionDELETE', 'actionUNSUBMIT', 'actionVOID', 'actionBATCHMODIFY'];
    tabcmd.cmds.map((item, index) => {
      if (defaultCmd.indexOf(item) >= 0 && tabcmd.paths[index] && arr.indexOf(tabcmd.paths[index]) < 0) {
        arr.push(tabcmd.paths[index]);
      }
      return item;
    });

    if (businessTypes.length > 0) {
      businessTypes.map((item) => {
        if (item.businessType === router.currentRoute.params.tableId) {
          item.checkUrls = arr;
        }
        return item;
      });
    } else {
      businessTypes = [{
        checkUrls: arr,
        businessType: router.currentRoute.params.tableId,
      }];
    }
    

    window.localStorage.setItem('checkUrls', JSON.stringify(businessTypes));
  }
}

function getConfigMap(tabcmd) { // 获取所有配置流程图的表集合
  if (tabcmd && Version() === '1.4') {
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
        checkUrls: [],
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

        const checkUrls = JSON.parse(window.localStorage.getItem('checkUrls')) ? JSON.parse(window.localStorage.getItem('checkUrls')) : [];
        const arr = [].concat(res.data.data.businessTypes);
        const defaultUrls = ['/p/cs/batchVoid', '/p/cs/batchUnSubmit', '/p/cs/batchDelete', '/p/cs/exeAction', '/p/cs/batchSave'];
        arr.map((item) => {
          if (checkUrls.length > 0) {
            checkUrls.map((temp) => {
              if (temp.businessType === item.businessType) {
                if (!temp.checkUrls) {
                  item.checkUrls = defaultUrls;
                } else {
                  item.checkUrls = temp.checkUrls;
                }
              }
              return temp;
            });
          } else {
            item.checkUrls = defaultUrls; 
          }
          return item;
        });
        window.localStorage.setItem('checkUrls', JSON.stringify(arr));
      }
    });
  }
}

function thirdlogin() { // 三方登录  获取accessToken
  let data = {
    username: 'guest'
  };
  if (encryptionJflow) {
    // 加密处理
    const randomKey = btoa(`${Math.random() * 10000000000}`).substring(0, 5);
    data = `${randomKey}${window.btoa(encodeURIComponent(JSON.stringify({
      username: 'guest'
    })))}`;
  }
  
  axios.post('/jflow/p/c/thirdlogin', data).then(() => {
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
              content: res.data.data.submitErrorMsg,
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
              CreateButton(res.data.data, jflowButtons, to.params.itemId);
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
    const params = new URLSearchParams(request.data);
    const changeDetail = {};
    for (const pair of params.entries()) {
      changeDetail[pair[0]] = pair[1];
    }
    const response = changeDetail;
    axios.post('/jflow/p/cs/process/launch',
      {
        // eslint-disable-next-line no-nested-ternary
        businessCodes: (response.ids || response.objids) ? (response.ids || response.objids) : router.currentRoute.params.itemId,
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
      DispatchEvent('jflowClick', {
        detail: {
          type: 'clearSubmit'
        }
      });
      if (window.jflowPlugin.router.currentRoute.path.split('/')[2] === 'TABLE' && res.data.resultCode === 0 && res.data.notice) {
        window.vm.$Modal.fcError({
          title: '错误',
          content: res.data.notice,
          mask: true
        });
        reject(response);
        return; 
      }
      if (res.data.data.records && res.data.data.records[0].notice) {
        window.vm.$Modal.fcError({
          title: '错误',
          content: res.data.data.records[0].notice,
          mask: true
        });
        reject(response);
        return;
      }
      if (res.data.resultCode === 0) {
        if (res.objids) {
          window.vm.$Modal.fcWarning({
            title: '提示',
            content: '请稍等,正在审批······',
            mask: true
          });
        }
        instanceId = res.data.data.instanceId;

        const type = router.currentRoute.path.split('/')[3];// 获取组件类型
        if (type === 'H' || type === 'V') {
          jflowButtons(router.currentRoute.params.itemId).then((res) => {
            // 流程发起成功刷新界面
            DispatchEvent('jflowClick', {
              detail: {
                type: 'refresh'
              }
            });
          });
        }

        DispatchEvent('jflowEvent', {
          detail: {
            type: 'search'
          }
        });
        reject(response);
      } else {
        resolve();
      }
    });
  });
}

async function checkProcess(request) { // check校验
  await new Promise((resolve, reject) => {
    console.log(request);
    const params = new URLSearchParams(request.data);
    const changeDetail = {};
    for (const pair of params.entries()) {
      changeDetail[pair[0]] = pair[1];
    }
    const response = changeDetail;
    let bodyObj = {};
    if (Version() === '1.4') {
      // 判断是否为动作定义
      if (response.actionid) {
        bodyObj = {
          businessType: router.currentRoute.params.tableId,
          businessCheckData: JSON.parse(response.param).ids
        };
      } else if (response.searchdata) { // 批量修改
        bodyObj = {
          businessType: router.currentRoute.params.tableId,
          businessCheckData: request.data.searchdata.objids
        };
      } else {
        bodyObj = {
          businessType: router.currentRoute.params.tableId,
          businessCheckData: response.ids.split(',')
        };
      }
    } 
    
    if (Version() === '1.3') { // 1.3版本
      // 判断是否为动作定义
      if (response.actionid) {
        bodyObj = {
          businessType: router.currentRoute.params.tableId,
          businessCheckData: JSON.parse(response.param).ids
        };
      } else if (response.searchdata) { // 批量修改
        bodyObj = {
          businessType: router.currentRoute.params.tableId,
          businessCheckData: JSON.parse(response.searchdata).objids
        };
      } else {
        bodyObj = {
          businessType: router.currentRoute.params.tableId,
          businessCheckData: response.objids ? response.objids.split(',') : response.ids.split(',')
        };
      }
    }
    axios.post('/jflow/p/cs/process/check',
      bodyObj)
      .then((res) => {
        if (res.data.resultCode === 0) {
          if (res.data.data.businessCheckData.length === 0) {
            window.vm.$Modal.fcError({
              title: '错误',
              content: '当前选中单据都在流程中,不允许操作!',
              mask: true
            });
            reject();
            return;
          }
          if (Version() === '1.3') {
            if (response.actionid) { // 动作定义
              const responseCopy = JSON.parse(response.param);
              responseCopy.ids = res.data.data.businessCheckData;
              const obj = {
                actionid: response.actionid,
                webaction: response.webaction,
                param: responseCopy
              };
              const requestBody = new URLSearchParams();
              Object.keys(obj).forEach((key) => {
                const dataType = Object.prototype.toString.call(obj[key]);
                if (dataType === '[object Object]' || dataType === '[object Array]') {
                  obj[key] = JSON.stringify(obj[key]);
                }
                requestBody.append(key, obj[key]);
              });
              request.data = requestBody;
            } else if (response.searchdata) { // 批量修改
              const obj = JSON.parse(response.searchdata);
              obj.objids = res.data.data.businessCheckData;
              response.searchdata = JSON.stringify(obj);
              const requestBody = new URLSearchParams();
              Object.keys(response).forEach((key) => {
                const dataType = Object.prototype.toString.call(response[key]);
                if (dataType === '[object Object]' || dataType === '[object Array]') {
                  response[key] = JSON.stringify(response[key]);
                }
                requestBody.append(key, response[key]);
              });
              request.data = requestBody;
            } else if (response.objids) {
              response.objids = res.data.data.businessCheckData.join(',');
              const requestBody = new URLSearchParams();
              Object.keys(response).forEach((key) => {
                const dataType = Object.prototype.toString.call(response[key]);
                if (dataType === '[object Object]' || dataType === '[object Array]') {
                  response[key] = JSON.stringify(response[key]);
                }
                requestBody.append(key, response[key]);
              });
              request.data = requestBody;
            } else {
              response.ids = res.data.data.businessCheckData;
              request.data = response;
            }
          }

          if (Version() === '1.4') {
            if (response.actionid) {
              const responseCopy = JSON.parse(response.param);
              responseCopy.ids = res.data.data.businessCheckData;
              const obj = {
                actionid: response.actionid,
                webaction: response.webaction,
                param: responseCopy
              };
              const requestBody = new URLSearchParams();
              Object.keys(obj).forEach((key) => {
                const dataType = Object.prototype.toString.call(obj[key]);
                if (dataType === '[object Object]' || dataType === '[object Array]') {
                  obj[key] = JSON.stringify(obj[key]);
                }
                requestBody.append(key, obj[key]);
              });
              request.data = requestBody;
            } else if (response.searchdata) {
              request.data.searchdata.objids = res.data.data.businessCheckData;
            } else {
              response.ids = res.data.data.businessCheckData;
              request.data = response;
            }
          }

          resolve();
        }
      });
  });
}

function AxiosGuard(axios) { // axios拦截
  axios.interceptors.request.use(async (config) => {
    if (config.url.indexOf('jflow') >= 0) { // 所有jflow接口都添加accessToken
      config.headers.accountName = 'guest';
      if (encryptionJflow) {
        config.headers['Content-Type'] = 'application/json';
        // 加密处理
        // const encrypt = new JSEncrypt();
        // encrypt.setPublicKey(`
        // -----BEGIN PRIVATE KEY-----
        // MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCEnS3uyErA1crP/WcmIviSjmRWR+8oY/C9mjA/YbobHw/F28I+U10VHSf5gyQMNSH9WJRPStCBVhlyKzZySc8tV30IsuMF8mp1fxqMJQojFYk0mL8s/DabCHFsGNV364RPiJP2e7ZPR2fyD2r6FgG+QbZPW0JkDAgNiuobc2zUcLpSwD4Q5VSFCnOnv+3JzZqYTNBYvDpCG1I6lVAlTjOjWjNsaTnVyj++vh+IAZuMYGeYFkTX8CXxtBm8RpFjLQyqpjm167FxLM0a06mQvSB9e/ytnBvMGsVWLx4o7EoPIlt4ruJ+GCASmZHjYmUWkJ78W0PAQbfjm1eFw+CL9TwbAgMBAAECggEAVWTFRCJziHLis0Xwmu0f9Xd9gtW1WePpDJ5x/Q5YAcjhpj3ZebrCkKsCp7fbiYTZS0Mz1U9Orkob/pl26OdAYmkY2XYfnB+6j8h19tKPEYJ3pIfLaxNJslEggEQJibv9qh0/chO9lJVdiNCGyV1MaA/2bmlMehIJSXcvQtfzt2OlFT95WyCHR00not7iZAymr1ZdAwQ6Gunb7JFHgk7sMlHlaPkr3+Nl39DQPDN0BiYyG7GWvCGoGfoA98QJ3nGCnoexFazX1EVyubP3BS2tYpGfbXZBQAlwlAaPaPaO5/i0/whYWOA1u/0T+hspe/LsIyHFv1E0tUOYyG5wIHNQeQKBgQDLUWMq7wCs+GJXHK+RpWlxcsHvfZs0P+ULsCXrvRmJmq6siUbXMl0+RmX1kjnN9ApIfQrfPRAecFd+7vBRdBGbdEbfMK9Em+F4qORcjL4SsVSitjhXNIA8egJfY+X86AO5h5PmyGpPUXJGeyKwC58t7vHZWMfOUepQ5znPaBcYZQKBgQCm+dBXVMPdOvdtcrR2HKsxCfJwQkDJD4PywHD7KS5oKNIDNwbETEJCNRWM8seTyVmbps/P396puuScAS296HNEteBOJ8GX8F9DcMi4sJ49aN45LAQX7ZBNogLa+vpHaTUPPotmXtZ8VHRLCsk00haShPJqZDsoRcubkZrWLWB6fwKBgQDIf3X/vLk52aeAqDUqt6gHzFcbSQ5otCm3IPoEQvKQFA3071sAlBYHd3zMcmq2gtYxLb4u7xSaL8bY0eADMya52iyZpHTyf5YVWtf3vIMkA+OmoXNl68wZ12fHkcgXYuVpbB2aFEFh/rtmbb+DQ7KxpVSyNS60c2tSZPNJaSh9UQKBgBP0/cLCXdqeRp5tPEZ1rLxivPhP4uBlG1czSw2p4WMPpfI+bG+f0beKErZS+imewjgJWwM0da+Bp/tBZM8y7jwDJPkSZWAcmbY8z7DLY05hr1XT/fVCLqIowACeSLWqTG4zAoRMx4P6sB+b/WpzxcDjZPn0WuG4XdqNL51ztPlPAoGAWX7W3Uz7eJ5jZJD9p3/0WoEDAYXrzQqPFt1lo0gU79v8dIiUrTbAYmi4p09i+wuI5XB02BTHdv1Nfkb/Wr2nB/SclFtkZxwofAzZVL1DvBdyvZ/e+QhxUEaYJzqdVNHr/c3uW4F5oHzxZomGDuTQ7WeZVTMDJ59YRQBoiAg8EHY=
        // -----END PRIVATE KEY-----`);
        // const randomKey = btoa(`${Math.random() * 10000000000}`).substring(0, 5);
        // config.data = encrypt.encrypt(`${randomKey}${btoa(config.data)}`);
        const randomKey = btoa(`${Math.random() * 10000000000}`).substring(0, 5);
        config.data = `${randomKey}${window.btoa(encodeURIComponent(JSON.stringify(config.data)))}`;
      }
    }
    if (configurationFlag) { // 配置了流程图并
      // 判断是否触发了配置的动作，满足则走jflow的流程，否则不处理
      let launchConfig = [];
      if (window.localStorage.getItem('businessTypes')) {
        JSON.parse(window.localStorage.getItem('businessTypes')).map((item) => {
          if (item.businessType === router.currentRoute.params.tableId) {
            launchConfig = item.action;
          }
          return item;
        });
        // jflow流程发起
        const serviceId = store.state.global.serviceIdMap[router.currentRoute.params.tableName];
        for (let i = 0; i < launchConfig.length; i++) {
          if (serviceId ? `/${serviceId}${launchConfig[i]}`.indexOf(config.url) >= 0 : launchConfig[i].indexOf(config.url) >= 0) {
            await jflowsave(true, config);
          }
        }
      }


      // 判断是否点击了列表配置按钮，是的话在执行前先调用check接口
      if (window.localStorage.getItem('checkUrls')) {
        let checkUrls = [];
        JSON.parse(window.localStorage.getItem('checkUrls')).map((item) => {
          if (item.businessType === router.currentRoute.params.tableId) {
            checkUrls = item.checkUrls;
          }
          return item;
        });
        const serviceId = store.state.global.serviceIdMap[router.currentRoute.params.tableName];
        for (let i = 0; i < checkUrls.length; i++) {
          if (serviceId ? `/${serviceId}${checkUrls[i]}`.indexOf(config.url) >= 0 : checkUrls[i].indexOf(config.url) >= 0) {
            await checkProcess(config);
          }
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

      // 列表界面获取按钮接口
      if (response.config.url.endsWith('/p/cs/getTableQuery') && window.jflowPlugin.router.currentRoute.path.split('/')[2] === 'TABLE') {
        if (Version() === '1.4') {
          getQueryButtons(response.data.data);
        } else {
          getQueryButtons(response.data);
        }
      }

      if (response.config.url.endsWith('/p/cs/hello')) { // 获取用户信息
        window.localStorage.setItem('userInfo', JSON.stringify(response.data));
        userInfo = response.data;
        window.jflowPlugin.userInfo = userInfo;

        !closeJflowIcon ? todoList(store, router) : null; // 添加待办列表菜单
      }

      // if (response.config.url.endsWith('/p/cs/getSubSystems')) { // 获取完菜单，添加待办列表菜单
      //   !closeJflowIcon ? todoList(store, router) : null;
      // }
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
  window.jflowPlugin.closeJflowIcon = closeJflowIcon;
  window.jflowPlugin.jflowIp = jflowIp;
}


const install = function install(Vue, options = {}) {
  closeJflowIcon = options.closeJflowIcon;
  encryptionJflow = options.encryptionJflow;
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

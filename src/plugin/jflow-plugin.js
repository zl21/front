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
import decryptionJflow from './decryptionJflow';


let axios = {}; // axios请求
let router = {}; // 路由
let store = {};
let userInfo = {}; // 用户信息
let jflowIp = ''; // jflow项目的ip
let modifiableFieldName = []; // jflow可显示字段名
let editFeild = []; // 可编辑字段
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
  const headers = {};
  if (encryptionJflow) {
    const aesKey = uuidGenerator();// 秘钥
    // 对传参进行aes加密
    const key = CryptoJS.enc.Utf8.parse(aesKey);// 将秘钥转换成Utf8字节数组
    const encrypt = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    data = encrypt.toString();// 加密后的数据
        
        
    // uuid加密 设置请求头
    const uuidEncrypt = new JSEncrypt();
    const PUBLIC_KEY = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDACe1nZlA5AXo1D1PnHNVbeBThNfN6zM+ydWyOUHwQFahHiifeR91mCjrbkMWiqDqB5N+xz6UXCXGRlTRUYJchhGxhUlOhCA53T/F5ZlXrOoyKTdVgB7+HWmQOITwKcgThRFO2GCPCQB/bPYn5FVR7hqmxHBo7L6MONC9aXnL6PQIDAQAB';
    uuidEncrypt.setPublicKey(`
        -----BEGIN PUBLIC KEY-----
        ${PUBLIC_KEY}
        -----END PUBLIC KEY-----`);
    headers['encrypt-key'] = uuidEncrypt.encrypt(aesKey);
    headers['encrypt-type'] = 'RSA';
    headers['Content-Type'] = 'application/json';
  }
  
  axios.post('/jflow/p/c/thirdlogin', data, {
    headers
  }).then(() => {
    getConfigMap();
  });
}

/* 
  id:明细id
  pid:主表id
  flag: 是否刷新按钮
  active: 当前表表名(现在不需要，通过jflowButtons)
  isApprover: 消息中心参数
*/
async function jflowButtons(id, pid, flag, active, isApprover) { // jflow按钮逻辑处理
  return await new Promise((resolve) => {
    axios.post('/jflow/p/cs/task/buttons', {
      businessCode: id,
      userId: JSON.parse(window.localStorage.getItem('userInfo')).id,
      businessType: pid || router.currentRoute.params.tableId,
      isApprover: isApprover || router.currentRoute.query.isApprover
    })
      .then((res) => {
        if (res.data.resultCode === 0) {
          if (res.data.data.submitErrorMsg) {
            window.R3message({
              title: '错误',
              content: res.data.data.submitErrorMsg,
              mask: true
            });
          }
          if (res.data.data.businessStatus === -2) {
            window.R3message({
              title: '错误',
              content: res.data.data.submitErrorMsg,
              mask: true
            });
          }

          // 更新子表的数据字段以及按钮控制  在流程中的时候
          if (res.data.data.businessStatus === -2 || res.data.data.instanceId) {
            let JflowControlField = JSON.parse(JSON.stringify(window.jflowPlugin.store.state.global.JflowControlField));
            const modifiField = res.data.data && res.data.data.modifiableField ? JSON.parse(res.data.data.modifiableField).map(item => item.ID) : [];
            const edit = res.data.data && res.data.data.editFeild ? JSON.parse(res.data.data.editFeild).map(item => item.ID) : [];
            const exeActionButton = res.data.data && res.data.data.visibleBt ? res.data.data.visibleBt : [];
            const jflowButton = res.data.data && res.data.data.buttons ? res.data.data.buttons.map((item) => {
              item.isJflow = true;
              return item;
            }) : [];
            jflowButton.push({
              button: 'fresh',
              name: '刷新',
              url: '',
              isJflow: true
            });
            const obj = {
              tableId: pid || window.jflowPlugin.router.currentRoute.params.tableId,
              itemTableId: (String(res.data.data.businessType)) || pid || window.jflowPlugin.router.currentRoute.params.tableId,
              isShow: modifiField,
              readonly: edit,
              exeActionButton,
              jflowButton
            };
            
            // 判重处理
            JflowControlField = JflowControlField.filter((item) => {
              if (item.tableId !== obj.tableId) {
                return item;
              }
            });

            JflowControlField.push(obj);
            window.jflowPlugin.store.commit('global/updateJflowControlField', JflowControlField);
            console.log(JflowControlField);
          } else { // 不在流程中去除相对应的配置
            let JflowControlField = JSON.parse(JSON.stringify(window.jflowPlugin.store.state.global.JflowControlField));
            const obj = {
              tableId: pid || router.currentRoute.params.tableId,
              itemTableId: (active || router.currentRoute.query.ACTIVE) || pid || router.currentRoute.params.tableId,
            };
            // 判断相对应的配置然后去除掉
            JflowControlField = JflowControlField.filter((item) => {
              if (item.tableId !== obj.tableId) {
                return item;
              }
            });
            window.jflowPlugin.store.commit('global/updateJflowControlField', JflowControlField);
          }

          
          modifiableFieldName = res.data.data && res.data.data.modifiableField ? JSON.parse(res.data.data.modifiableField) : [];
          editFeild = res.data.data && res.data.data.editFeild ? JSON.parse(res.data.data.editFeild) : [];
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
      if (((type === 'H' || type === 'Y') && from.path === '/') || true) { // 直接访问单对象界面 或者配置了流程图
        jflowButtons(to.params.itemId, to.params.tableId, true, to.query.ACTIVE, to.query.isApprover).then((res) => {
          //  todo
          // 设置global里面的可编辑字段和可见字段的控制
          next();
          setTimeout(() => {
            if (res.data.resultCode === 0) {
              CreateButton(res.data.data, jflowButtons, to.params.itemId);
            }
          }, 300);
        });
      }
    } else if (to.path.split('/')[2] === 'TABLE' && true) {
      next();
    } else {
      next();
    }
  });
}
async function jflowsave(flag, request) {
  await new Promise((resolve, reject) => {
    // console.log(request.data.ids);
    // const params = new URLSearchParams(request.data);
    // const changeDetail = {};
    // if (window.navigator.userAgent.indexOf('MSIE') >= 1) {
    //   for (const pair in params.entries()) {
    //     changeDetail[pair[0]] = pair[1];
    //   }
    // } else {
    //   for (const pair of params.entries()) {
    //     changeDetail[pair[0]] = pair[1];
    //   }
    // }
    const response = request.data;

    axios.post('/jflow/p/cs/process/launch',
      {
        // eslint-disable-next-line no-nested-ternary
        businessCodes: (response.ids || response.objids) ? (response.ids.join(',') || response.objids) : router.currentRoute.params.itemId,
        businessType: router.currentRoute.params.tableId,
        businessTypeName: router.currentRoute.params.tableName,
        initiator: userInfo.id,
        userName: userInfo.name,
        instanceId,
        initiatorName: userInfo.name,
        changeUser: userInfo.id,
        businessUrl: request.url,
        ruleField: 'V',
        webActionId: 0
      }).then((res) => {
      if (res.data.resultCode !== 0) {
        window.R3message({
          title: '错误',
          content: res.data.resultCode,
          mask: true
        });
        return; 
      }
      DispatchEvent('jflowClick', {
        detail: {
          type: 'clearSubmit'
        }
      });
      
      if (window.jflowPlugin.router.currentRoute.path.split('/')[2] === 'TABLE' && res.data.resultCode === 0 && res.data.notice) {
        window.R3message({
          title: '错误',
          content: res.data.notice,
          mask: true
        });
        reject(res);
        return; 
      }
      if (res.data.data.records && res.data.data.records[0].notice) {
        window.R3message({
          title: '错误',
          content: res.data.data.records[0].notice,
          mask: true
        });
        reject(res);
        return;
      }
      if (res.data.resultCode === 0) {
        if (res.objids) {
          window.R3message({
            title: '提示',
            content: '请稍等,正在审批······',
            mask: true
          });
        }
        instanceId = res.data.data.instanceId;

        const type = router.currentRoute.path.split('/')[3];// 获取组件类型
        if (type === 'H' || type === 'V') {
          jflowButtons(router.currentRoute.params.itemId).then((res) => {
            // 设置提交时不能刷新的标志
            window.localStorage.setItem('submitReject', true);
            // 流程发起成功刷新界面
            DispatchEvent('jflowClick', {
              detail: {
                type: 'refresh'
              }
            });
          });
        } else {
          DispatchEvent('jflowEvent', {
            detail: {
              type: 'search'
            }
          });
        }

        
        reject(response);
      } else {
        resolve();
      }
    });
  });
}

async function checkProcess(request) { // check校验
  await new Promise((resolve, reject) => {
    // const params = new URLSearchParams(request.data);
    // const changeDetail = {};
    // if (window.navigator.userAgent.indexOf('MSIE') >= 1) {
    //   for (const pair in params.entries()) {
    //     changeDetail[pair[0]] = pair[1];
    //   }
    // } else {
    //   for (const pair of params.entries()) {
    //     changeDetail[pair[0]] = pair[1];
    //   }
    // }
    
    const response = request.data;
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
          businessCheckData: response.ids
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
            window.R3message({
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
        } else {
          resolve();
          window.R3message({
            title: '错误',
            content: res.data.resultMsg,
            mask: true
          });
          reject();
        }
      });
  });
}

function uuidGenerator() {
  const originStr = 'xxxxxxxxxxxxxxxx';
  const originChar = '0123456789abcdef';
  const len = originChar.length;
  return originStr.replace(/x/g, match => originChar.charAt(Math.floor(Math.random() * len)));
}

function AxiosGuard(axios) { // axios拦截
  axios.interceptors.request.use(async (config) => {
    if (config.url.indexOf('jflow') >= 0) { // 所有jflow接口都添加accessToken
      config.headers.accountName = 'guest';
      
      if (encryptionJflow) {
        config.headers['Content-Type'] = 'application/json';
        const aesKey = uuidGenerator();// 秘钥
        // 对传参进行aes加密
        const key = CryptoJS.enc.Utf8.parse(aesKey);// 将秘钥转换成Utf8字节数组
        const encrypt = CryptoJS.AES.encrypt(JSON.stringify(config.data), key, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        });
        config.data = encrypt.toString();// 加密后的数据
        
        
        // uuid加密 设置请求头
        const uuidEncrypt = new JSEncrypt();
        const PUBLIC_KEY = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDACe1nZlA5AXo1D1PnHNVbeBThNfN6zM+ydWyOUHwQFahHiifeR91mCjrbkMWiqDqB5N+xz6UXCXGRlTRUYJchhGxhUlOhCA53T/F5ZlXrOoyKTdVgB7+HWmQOITwKcgThRFO2GCPCQB/bPYn5FVR7hqmxHBo7L6MONC9aXnL6PQIDAQAB';
        uuidEncrypt.setPublicKey(`
        -----BEGIN PUBLIC KEY-----
        ${PUBLIC_KEY}
        -----END PUBLIC KEY-----`);
        config.headers['encrypt-key'] = uuidEncrypt.encrypt(aesKey);
        config.headers['encrypt-type'] = 'RSA';
      }
    }
    if (['V', 'H'].indexOf(window.jflowPlugin.router.currentRoute.path.split('/')[3]) >= 0 || window.jflowPlugin.router.currentRoute.path.split('/')[2] === 'TABLE') { // 配置了流程图并
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
      if (window.localStorage.getItem('checkUrls') && window.jflowPlugin.router.currentRoute.path.split('/')[2] === 'TABLE') {
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
      // 控制主表字段可见以及可编辑
      // if (response.config.url.endsWith('/p/cs/getObject') && ((configurationFlag && instanceId) || businessStatus === -2)) { // 获取单对象的字段集合时根据jflow返回值修改对应字段
      //   response.data.data = modifyFieldConfiguration(response.data.data);
      // }
      if (response.config.url.endsWith('/p/cs/objectTab')) {
        // 控制子表为不可编辑
        // if (configurationFlag && instanceId) {
        //   response.data.data.objreadonly = false;
        // }
        // 主表的按钮获取
        if (response.config.data.indexOf('ismaintable=y') >= 0) {
          const tabcmd = JSON.parse(JSON.stringify(response.data.data.tabcmd));
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
    data.addcolums = data.addcolums.filter((item) => {
      if (item.childs) {
        item.childs = item.childs.filter((temp) => {
          if (fieldCheck(temp.colid).length > 0 || modifiableFieldName.length === 0) {
            temp.readonly = true;
            if (editFeild.length === 0) {
              temp.readonly = true;
            } else if (editFeildCheck(temp.colid).length > 0) {
              temp.readonly = false;
            }
            return temp;
          }
        });
        return item;
      } if (fieldCheck(item.child.colid).length > 0 || modifiableFieldName.length === 0) {
        item.child.readonly = true;
        if (editFeild.length === 0) {
          item.child.readonly = true;
        } else if (editFeildCheck(item.child.colid).length > 0) {
          item.child.readonly = false;
        }
        return item;
      }
    });
  }
  return data;
}

function fieldCheck(colid) { // 可见字段判断
  return modifiableFieldName.filter((item) => {
    if (String(colid) === String(item.ID)) {
      return item;
    }
  });
}

function editFeildCheck(colid) { // 可编辑字段判断
  return editFeild.filter((item) => {
    if (String(colid) === String(item.ID)) {
      return item;
    }
  });
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

function jflowRefresh() { // 刷新业务系统
  DispatchEvent('jflowClick', {
    detail: {
      type: 'refresh'
    }
  });
}

/* data为对象,为了动作定义类型数据处理
{
  webActionId:动作定义id,
  moduleId:'',
  startNodeId: '',
  customizeBody: '',
  assignedNodes: '',
  assignOpinion: ''
}


*/

function initiateLaunch(data) { // 业务系统流程发起
  return new Promise((resolve, reject) => {
    let obj = {
      // eslint-disable-next-line no-nested-ternary
      businessCodes: router.currentRoute.params.itemId,
      businessType: router.currentRoute.params.tableId,
      businessTypeName: router.currentRoute.params.tableName,
      initiator: userInfo.id,
      userName: userInfo.name,
      instanceId,
      initiatorName: userInfo.name,
      changeUser: userInfo.id,
      // webActionId: data.webid,
      businessTypeText: window.jflowPlugin.router.currentRoute.path.split('/')[2] === 'TABLE' ? window.jflowPlugin.store.state.global.activeTab.label : window.jflowPlugin.store.state.global.activeTab.label.substr(0, window.jflowPlugin.store.state.global.activeTab.label.length - 2),
      moduleId: data.moduleId,
      // startNodeId: data.startNodeId,
      // customizeBody: data.customizeBody,
      // assignedNodes: data.assignedNodes
    };

    obj = Object.assign(obj, data);
    axios.post('/jflow/p/cs/process/launch', obj).then((res) => {
      if (window.jflowPlugin.router.currentRoute.path.split('/')[2] === 'TABLE' && res.data.resultCode === 0 && res.data.notice) {
        window.R3message({
          title: '错误',
          content: res.data.notice,
          mask: true
        });
        resolve(res);
        return; 
      }
      if (res.data.data.records && res.data.data.records[0].notice) {
        window.R3message({
          title: '错误',
          content: res.data.data.records[0].notice,
          mask: true
        });
        resolve(res);
        return;
      }
      if (res.data.resultCode === 0) {
        if (res.objids) {
          window.R3message({
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
        resolve(res);
      } else {
        resolve();
      }
    });
  });
}

function initLists(e) { // 小图标的展示
  thirdlogin();
  createComponent();
  RoutingGuard(router);
  AxiosGuard(axios);

  // window.localStorage.setItem('userInfo', JSON.stringify(e.detail.userInfo));
  // userInfo = e.detail.userInfo;
  // window.jflowPlugin.userInfo = e.detail.userInfo;

  Vue.prototype.$network = network;
      
      
  window.initiateLaunch = initiateLaunch;
  window.jflowRefresh = jflowRefresh;
  // !closeJflowIcon ? todoList(store, router) : null; // 添加待办列表菜单

  // axios.post('/jflow/p/sys/properties', {})
  //   .then((res) => {
  //     encryptionJflow = res.data.data.ciphertextVO.apiEncryptable;
  //     thirdlogin();
  //     createComponent();
  //     RoutingGuard(router);
  //     AxiosGuard(axios);

  //     window.localStorage.setItem('userInfo', JSON.stringify(e.detail.userInfo));
  //     userInfo = e.detail.userInfo;
  //     window.jflowPlugin.userInfo = e.detail.userInfo;

  //     Vue.prototype.$network = network;
      
      
  //     window.initiateLaunch = initiateLaunch;
  //     window.jflowRefresh = jflowRefresh;
  //     !closeJflowIcon ? todoList(store, router) : null; // 添加待办列表菜单
  //   });
}


const install = function install(Vue, options = {}) {
  window.removeEventListener('userReady', initLists, true);
  
  closeJflowIcon = options.closeJflowIcon;
  encryptionJflow = options.encryptionJflow ? options.encryptionJflow : false;
  if (options.axios && options.router && options.store && options.jflowIp) {
    window.conversionJflow = decryptionJflow;
    axios = options.axios;
    router = options.router;
    store = options.store;
    jflowIp = options.jflowIp;
    initLists();
    // window.addEventListener('userReady', initLists, this);
  }
};


export default install;

export function components() {
  return InstanceManagementList;
}

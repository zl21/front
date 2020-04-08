/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-constant-condition */
/* eslint-disable no-return-await */
import Vue from 'vue';
import { DispatchEvent } from '../utils/dispatchEvent';
import CreateButton from './button';
import todoList from './todoList';
import '../utils/dateApi';
import network from '../utils/network';
import mainComponent from '../view/mainComponent';
import InstanceManagementList from '../view/InstanceManagementList';
import decryptionJflow from './decryptionJflow';
import { global, globalChange } from '../utils/global.config';


const axios = {}; // axios请求
const router = {}; // 路由
const userInfo = {}; // 用户信息
let instanceId = null; // 流程id

function thirdlogin() { // 三方登录  获取accessToken
  let data = {
    username: 'guest'
  };
  const headers = {};
  if (global.apiEncryptable) {
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
    const PUBLIC_KEY = global.PUBLIC_KEY;
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
  });
}

/* 
  id:明细id
  pid:主表id
  flag: 是否刷新按钮
  active: 当前表表名
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
              itemTableId: (active || window.jflowPlugin.router.currentRoute.query.ACTIVE) || pid || window.jflowPlugin.router.currentRoute.params.tableId,
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


function uuidGenerator() {
  const originStr = 'xxxxxxxxxxxxxxxx';
  const originChar = '0123456789abcdef';
  const len = originChar.length;
  return originStr.replace(/x/g, match => originChar.charAt(Math.floor(Math.random() * len)));
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

function initLists() { // 小图标的展示
  // 定义network
  Vue.prototype.$network = network;
  network.post('/jflow/p/sys/properties', {})
    .then((res) => {
      globalChange(res.data.data.ciphertextVO);
      thirdlogin();
      // createComponent();
      window.conversionJflow = decryptionJflow; // 解密方法
      window.initiateLaunch = initiateLaunch; // 发起流程
      window.jflowRefresh = jflowRefresh; // 刷新
    });
}


const install = function install(Vue, options = {}) {
  initLists();
};


export default install;

export function components() {
  return InstanceManagementList;
}

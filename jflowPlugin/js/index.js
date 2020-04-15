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
  
  network.post('/jflow/p/c/thirdlogin', data, {
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
async function jflowButtons() { // 获取jflow单据信息
  return await new Promise((resolve) => {
    network.post('/jflow/p/cs/task/buttons', {
      businessCode: global.routeInfo.itemId,
      userId: global.userInfo.id,
      businessType: global.routeInfo.tableId,
      isApprover: window.vm.$router.currentRoute.query.isApprover
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
          
          globalChange({
            jflowInfo: res.data.data
          });
        }
        resolve(res);
      });
  });
}

async function jflowsave(flag, request) {
  await new Promise((resolve, reject) => {
    const response = request.data;

    network.post('/jflow/p/cs/process/launch',
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
          DispatchEvent('jflowClick', {
            detail: {
              type: 'refresh'
            }
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
  window.jflowPlugin = vm.$children[0];
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
      businessCodes: global.routeInfo.itemId,
      businessType: global.routeInfo.tableId,
      businessTypeName: global.routeInfo.tableName,
      initiator: global.userInfo.id,
      userName: global.userInfo.name,
      instanceId,
      initiatorName: global.userInfo.name,
      changeUser: global.userInfo.id,
      // webActionId: data.webid,
      // businessTypeText: global.activeTabInfo.label.split('编辑')[0],
      // moduleId: data.moduleId,
      // startNodeId: data.startNodeId,
      // customizeBody: data.customizeBody,
      // assignedNodes: data.assignedNodes
    };

    obj = Object.assign(obj, data);
    network.post('/jflow/p/cs/process/launch', obj).then((res) => {
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
        jflowButtons(); // 重新获取单据信息
        DispatchEvent('jflowClick', {
          detail: {
            type: 'refresh'
          }
        });
        resolve(res);
      } else {
        resolve();
      }
    });
  });
}

function initLists() { // init
  network.post('/jflow/p/sys/properties', {})
    .then((res) => {
      globalChange(res.data.data.ciphertextVO);
      globalChange({
        localIp: res.data.data.localIp
      });
      thirdlogin();
      createComponent();

      // 准备业务系统的监听
      window.conversionJflow = decryptionJflow; // 解密方法
      window.initiateLaunch = initiateLaunch; // 发起流程
      window.jflowRefresh = jflowRefresh; // 刷新
    });
}


const install = function install(Vue, options = {}) {
  initLists();

  // 业务系统登录成功后创建右上角的小图标
  window.addEventListener('userReady', (event) => {
    globalChange({
      userInfo: event.detail.userInfo
    });
    todoList();
  });
  // 获取业务系统数据
  window.addEventListener('updataCurrentTableDetailInfo', (event) => {  
    globalChange(event.detail);
  });
};


export default install;

export function components() {
  return InstanceManagementList;
}

export const getJflowInfo = jflowButtons;

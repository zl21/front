/* eslint-disable no-unused-expressions */
import { DispatchEvent } from '../utils/dispatchEvent';
import network from '../utils/network';
import { global, globalChange } from '../utils/global.config';
import { freshJflowButton, refreshSystem } from './index';
// 撤销/结束/作废
function mutipleOperate(url) {
  const param = {};
  param.instanceId = global.jflowInfo.instanceId;
  param.userId = global.userInfo.id;
  param.nodeId = global.jflowInfo.nodeId;
  param.businessCode = global.routeInfo.itemId;
  param.businessType = global.routeInfo.tableId;
  param.businessName = global.routeInfo.tableName;
  console.log(url, param);
  network.post(url, param).then((res) => {
    if (res.data.resultCode === 0) {
      window.vm.$Message.success(res.data.resultMsg);
      refreshSystem();
    } else {
      window.R3message({
        title: '错误',
        content: res.data.resultMsg,
        mask: true
      });
    }
  });
}

// 重启流程/提交按钮
function restartProcess() {
  window.initiateLaunch({ webActionId: 0 });
}

// 业务系统的保存需要通知jflow
async function businessChange() {
  await network.post('/jflow/p/cs/business/change', {
    instanceId: global.jflowInfo.instanceId,
    businessCode: global.routeInfo.currentItemId,
    businessType: global.routeInfo.currentTableId,
    businessTypeName: global.routeInfo.currentTableName,
    async: true
  });
}

// 按钮响应事件
async function buttonsResponse(e) {
  if (e.detail.obj.button === 'fresh') {
    DispatchEvent('jflowClick', {
      detail: {
        type: 'refresh'
      }
    });
    return; 
  }
  const item = e.detail.obj;
  switch (item.button) {
    case '-1': // 撤销
    case '7': // 作废
    case '2': // 结束流程
      mutipleOperate(item.url); 
      break;  
    case '1': // 驳回
    case '0': // 同意
    case '8': // 确认
    case '3': // 转派
    case '9': // 人工干预
      window.jflowPlugin.open({// 同意和转派
        control: true, type: item.button, url: item.url, instanceId: global.jflowInfo.instanceId, returnOption: global.jflowInfo.backNodeIds, item, nodeId: global.jflowInfo.nodeId
      });
      break;
    case '5': // 流程进度
      if (global.components && global.components.Process) {
        window.jflowPlugin.open({// 同意和转派
          control: true, type: item.button, url: item.url, instanceId: global.jflowInfo.instanceId, returnOption: global.jflowInfo.backNodeIds, item 
        });
      } else {
        window.open(`${global.localIp}/#/FlowChart?instanceId=${global.jflowInfo.instanceId ? global.jflowInfo.instanceId : global.jflowInfo.lastInstanceId}`, '_blank', 'width=861,height=612');
      } 
      
      break;
    case '6': // 重启流程
    case 'submit': // 提交
      restartProcess();
      break;
    case '4': // 保存
      DispatchEvent('jflowClick', {
        detail: {
          type: 'refresh'
        }
      });
      break;
    default: break;
  }
}


// 按钮点击逻辑处理
async function clickFunction(e) {
  globalChange({ routeInfo: e.detail.currentItemInfo });
  if (e.detail.obj.isSave) { // 按钮存在保存前置事件时
    window.vm.$Spin.show();
    window.ProjectConfig.enableRestrictSave = false;
    setTimeout(async () => {
      window.vm.$Spin.hide();
      if (window.updataVerifyRequiredInformation()) {
        if (window.testUpdataValue()) {
          window.updataClickSave(async () => {
            window.ProjectConfig.enableRestrictSave = true;
            await freshJflowButton();
            await global.jflowInfo ? businessChange() : null;
            buttonsResponse(e);
          });
        } else {
          await freshJflowButton();
          buttonsResponse(e);
        }
      }
    }, 1000);
  } else {
    await freshJflowButton();
    buttonsResponse(e);
  }
}

async function getTemplate() { // 获取模版信息
  await network.post('/jflow/p/cs/task/businessType/list', {}).then((res) => {
    if (res.data.resultCode === 0) {
      globalChange({
        template: res.data.data.businessTypes ? res.data.data.businessTypes : []
      });
    }
  });
}


// 触发事件
async function initiateLaunch(event) {
  globalChange({ routeInfo: event.detail.currentItemInfo });
  window.ProjectConfig.enableRestrictSave = false;
  window.updataClickSave(async () => {
    window.ProjectConfig.enableRestrictSave = true;
    await freshJflowButton();
    if (global.jflowInfo && global.jflowInfo.instanceId) {
      mutipleOperate(global.jflowInfo.affirmUrl);
    } else {
      // 触发按钮之前获取最新的模版信息
      await getTemplate();
      // 判断是否存在模版，存在的时候才能发起流程
      let triggerBt = [];
      if (global.template.length > 0) {
        global.template.map((item) => {
          if (item.businessType === global.routeInfo.tableId) {
            triggerBt = triggerBt.concat(item.triggerBt);
          }
          return item;
        });
  
        triggerBt = triggerBt.filter((item, index, self) => self.indexOf(item) === index);

        if (triggerBt.includes(String(event.detail.obj.webid))) {
          window.initiateLaunch({ webActionId: event.detail.obj.webid });
        } else {
          window.R3message({
            title: '错误',
            content: '当前按钮为工作流触发按钮，请先配置模板！',
            mask: true
          });
        }
      } else {
        window.R3message({
          title: '错误',
          content: '当前按钮为工作流触发按钮，请先配置模板！',
          mask: true
        });
      }
    }
  });
}

// 按钮监听控制
function buttonAddEventListener() {
  window.addEventListener('jflowPlugin', clickFunction, this);

  // 监听jflow触发按钮响应
  window.addEventListener('jflowLaunch', initiateLaunch, this);
}


// 这里主要是按钮的逻辑
// 创建按钮
function CreateButton() {
  // 移除事件监听
  window.removeEventListener('jflowPlugin', clickFunction, true);
  window.removeEventListener('jflowLaunch', initiateLaunch, true);
  buttonAddEventListener();
}


export default CreateButton;

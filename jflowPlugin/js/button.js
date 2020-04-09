import { DispatchEvent } from '../utils/dispatchEvent';
import network from '../utils/network';

// 撤销/结束/作废
function mutipleOperate(url, instanceId, buttons, id) {
  const param = {};
  param.instanceId = instanceId;
  param.userId = window.jflowPlugin.userInfo.id;
  param.nodeId = window.jflowPlugin.nodeId;
  param.businessCode = window.jflowPlugin.router.currentRoute.params.itemId;
  param.businessType = window.jflowPlugin.router.currentRoute.params.tableId;
  param.businessName = window.jflowPlugin.router.currentRoute.params.tableName;
  network.post(url, param).then((res) => {
    if (res.data.resultCode === 0) {
      window.vm.$Message.success(res.data.resultMsg);
      buttons(id).then(() => {
        DispatchEvent('jflowClick', {
          detail: {
            type: 'refresh'
          }
        });
        const type = window.jflowPlugin.router.currentRoute.fullPath.split('/')[3];
        const MODULE_COMPONENT_NAME = `${type}.${window.jflowPlugin.router.currentRoute.params.tableName}.${window.jflowPlugin.router.currentRoute.params.tableId}.${window.jflowPlugin.router.currentRoute.params.itemId}`;
        window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/updateChildTableReadonly`, false);
      });
    } else {
      window.R3message({
        title: '错误',
        content: res.data.resultMsg,
        mask: true
      });
    }
  });
}

// 重启流程
function restartProcess() {
  // 通过模拟点击一下actionSUBMIT按钮重新发起流程
  DispatchEvent('jflowClick', {
    detail: {
      type: 'submit'
    }
  });
}

let jflowbuttons = [];
let jflowobj = {};
let jflowid = null;
let beforeClickFunction = {}; // 记录需要前置保存的按钮

// 按钮响应事件
function buttonsResponse(e) {
  const buttons = jflowbuttons;
  const obj = jflowobj;
  const id = jflowid;
  if (e.detail.obj.button === 'save' && window.jflowPlugin.objInstanceId) { // 监听保存按钮并且在存在InstanceId时调用接口
    if (e.detail.obj.type === 'reject') {
      beforeClickFunction = {};
      return;
    }
    
    network.post('/jflow/p/cs/business/change', {
      instance_id: window.jflowPlugin.objInstanceId,
      business_code: window.jflowPlugin.router.currentRoute.params.itemId,
      business_type: window.jflowPlugin.router.currentRoute.params.tableId,
      businessTypeName: window.jflowPlugin.router.currentRoute.params.tableName,
      sync: true
    })
      .then(() => {
        // 处理前置事件保存之后再处理当前事件
        console.log(beforeClickFunction);
        if (Object.keys(beforeClickFunction).length > 0) {
          buttonsResponse(beforeClickFunction);
          beforeClickFunction = {};
        }
      });

    return;
  }

  if (e.detail.obj.button === 'fresh') {
    buttons(id).then(() => {
      DispatchEvent('jflowClick', {
        detail: {
          type: 'refresh'
        }
      });
    });
    return; 
  }
  const item = e.detail.obj;
  if (item.button !== '4') {
    switch (item.button) {
      case '-1': // 撤销
      case '7': // 作废
      case '2': // 结束流程
        mutipleOperate(item.url, obj.instanceId, buttons, id); 
        break;  
      case '1': // 驳回
        window.jflowPlugin.open({
          control: true, type: item.button, url: item.url, instanceId: obj.instanceId, returnOption: obj.backNodeIds, buttons, id 
        });
        break;
      case '0': // 同意
      case '8': // 确认
      case '3': // 转派
      case '9': // 人工干预
        window.jflowPlugin.open({// 同意和转派
          control: true, type: item.button, url: item.url, instanceId: obj.instanceId, buttons, id, item 
        });
        break;
      case '5': // 流程进度
        window.open(`${window.jflowPlugin.jflowIp}/#/FlowChart?instanceId=${window.jflowPlugin.objInstanceId}`, '_blank', 'width=861,height=612');
        break;
      case '6': // 重启流程
        restartProcess();
        break;
      default: break;
    }
  }
}


// 按钮点击逻辑处理
function clickFunction(e) {
  const type = window.jflowPlugin.router.currentRoute.fullPath.split('/')[3];
  const MODULE_COMPONENT_NAME = `${type}.${window.jflowPlugin.router.currentRoute.params.tableName}.${window.jflowPlugin.router.currentRoute.params.tableId}.${window.jflowPlugin.router.currentRoute.params.itemId}`;
  if (e.detail.obj.isSave && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].testUpdata()) { // 按钮存在保存前置事件时
    beforeClickFunction = e;
    DispatchEvent('jflowClick', {
      detail: {
        type: 'save'
      }
    });
    // buttonsResponse(e);
  } else {
    buttonsResponse(e);
  }
}


// 触发事件
function initiateLaunch(event) {
  if (window.jflowPlugin.objInstanceId) {
    mutipleOperate(jflowobj.affirmUrl, jflowobj.instanceId, jflowbuttons, jflowid);
  } else {
    // 判断是否存在模版，存在的时候才能发起流程
    let triggerBt = [];
    if (window.localStorage.getItem('businessTypes')) {
      JSON.parse(window.localStorage.getItem('businessTypes')).map((item) => {
        if (item.businessType === window.jflowPlugin.router.currentRoute.params.tableId) {
          triggerBt = triggerBt.concat(item.triggerBt);
        }
        return item;
      });

      triggerBt = triggerBt.filter((item, index, self) => self.indexOf(item) === index);
      
      if (triggerBt.includes(String(event.detail.data.webid))) {
        window.initiateLaunch({ webActionId: event.detail.data.webid });
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
}

// 按钮监听控制
function buttonAddEventListener(buttons, obj, id) {
  jflowbuttons = buttons;
  jflowobj = obj;
  jflowid = id;
  window.addEventListener('jflowPlugin', clickFunction, this);

  // 监听jflow触发按钮响应
  window.addEventListener('jflowLaunch', initiateLaunch, this);
}


// 这里主要是按钮的逻辑
// 创建按钮
// obj 获取的按钮相关数据 buttons 生成按钮的方法（jflowButtons） 生成按钮需要的id
function CreateButton(obj, buttons, id) {
  // 移除事件监听
  window.removeEventListener('jflowPlugin', clickFunction, true);
  window.removeEventListener('jflowLaunch', initiateLaunch, true);

  buttonAddEventListener(buttons, obj, id);

  window.jflowPlugin.objInstanceId = obj.instanceId;
  window.jflowPlugin.itemId = id;
  window.jflowPlugin.nodeId = obj.nodeId;
  window.jflowPlugin.moduleId = obj.moduleId;
  window.jflowPlugin.pid = obj.pid;
}


export default CreateButton;

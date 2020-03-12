import { DispatchEvent } from '../__utils__/dispatchEvent';

// 撤销/结束/作废
function mutipleOperate(url, instanceId, buttons, id) {
  const param = {};
  param.instanceId = instanceId;
  param.userId = window.jflowPlugin.userInfo.id;
  param.nodeId = window.jflowPlugin.nodeId;
  param.businessCode = window.jflowPlugin.router.currentRoute.params.itemId;
  param.businessType = window.jflowPlugin.router.currentRoute.params.tableId;
  param.businessName = window.jflowPlugin.router.currentRoute.params.tableName;
  window.jflowPlugin.axios.post(url, param).then((res) => {
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
function clickFunction(e) {
  console.log(e);
  const buttons = jflowbuttons;
  const obj = jflowobj;
  const id = jflowid;

  if (e.detail.obj.button === 'save' && window.jflowPlugin.objInstanceId) { // 监听保存按钮并且在存在InstanceId时调用接口
    window.jflowPlugin.axios.post('/jflow/p/cs/business/change', {
      instance_id: window.jflowPlugin.objInstanceId,
      business_code: window.jflowPlugin.router.currentRoute.params.itemId,
      business_type: window.jflowPlugin.router.currentRoute.params.tableId,
      businessTypeName: window.jflowPlugin.router.currentRoute.params.tableName,
      sync: true
    });
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
        window.jflowPlugin.open({// 同意和转派
          control: true, type: item.button, url: item.url, instanceId: obj.instanceId, buttons, id 
        });
        break;
      case '5': // 流程进度
        window.open(`${window.jflowPlugin.jflowIp}/#/FlowChart?instanceId=${window.jflowPlugin.objInstanceId}`, '_blank', 'width=800,height=800');
        break;
      case '6': // 重启流程
        restartProcess();
        break;
      default: break;
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
  window.addEventListener('jflowLaunch', (event) => {
    if (window.jflowPlugin.objInstanceId) {
      // 获取同意按钮
      // const button = {
      //   button: 0,
      //   name: '同意',
      //   url: obj.affirmUrl
      // };
      // clickFunction({
      //   detail: {
      //     obj: button
      //   }
      // });

      mutipleOperate(obj.affirmUrl, obj.instanceId, buttons, id);
    } else {
      window.initiateLaunch({ webActionId: event.detail.data.webid });
    }
  });
}


// 这里主要是按钮的逻辑
// 创建按钮
// obj 获取的按钮相关数据 buttons 生成按钮的方法（jflowButtons） 生成按钮需要的id
function CreateButton(obj, buttons, id) {
  // 移除事件监听
  window.removeEventListener('jflowPlugin', clickFunction, true);

  window.jflowPlugin.objInstanceId = obj.instanceId;
  window.jflowPlugin.itemId = id;
  window.jflowPlugin.nodeId = obj.nodeId;
  window.jflowPlugin.moduleId = obj.moduleId;
  window.jflowPlugin.pid = obj.pid;

  const type = window.jflowPlugin.router.currentRoute.fullPath.split('/')[3];
  const MODULE_COMPONENT_NAME = `${type}.${window.jflowPlugin.router.currentRoute.params.tableName}.${window.jflowPlugin.router.currentRoute.params.tableId}.${window.jflowPlugin.router.currentRoute.params.itemId}`;

  // 流程进度正在发起中 obj.businessStatus === -2
  if (obj.businessStatus === -2) {
    const stateTimeout = setInterval(() => {
      // 定时器的处理，排除列表界面
      if (window.jflowPlugin.router.currentRoute.fullPath.split('/')[2] === 'TABLE') {
        clearInterval(stateTimeout);
        return; 
      }
      // 判断state状态是否已经生成
      const store = window.jflowPlugin.store;
      let stateFlag = null;
      try {
        stateFlag = (window.jflowPlugin.store.state[MODULE_COMPONENT_NAME] && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data.tabcmd) || (store.state[MODULE_COMPONENT_NAME].tabPanels && store.state[MODULE_COMPONENT_NAME].tabPanels.length > 0 && store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute && store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute.buttonsData.data.tabcmd.prem);
      } catch {
        clearInterval(stateTimeout);
      }
      if (stateFlag) {
        clearInterval(stateTimeout);
        const buttonsData = store.state[MODULE_COMPONENT_NAME].mainFormInfo ? JSON.parse(JSON.stringify(store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData)) : JSON.parse(JSON.stringify(store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute.buttonsData));
        buttonsData.data.tabcmd.prem = buttonsData.data.tabcmd.prem.map(() => false);
        const newButtons = [];
        // 修改水印
        window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/updateWatermarkimg`, obj.waterMark);
        
        // 刷新按钮
        window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/updateRefreshButton`, false);
        // 更新按钮
        let tabwebact = [];
        tabwebact = store.state[MODULE_COMPONENT_NAME].defaultButtonData.tabwebact.objbutton.filter((item) => {
          if ((obj.visibleBt ? obj.visibleBt : []).includes(String(item.webid))) {
            return item;
          }
        });
        window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/jflowPlugin`, {
          buttonsData: buttonsData.data.tabcmd.prem, newButtons, instanceId: 1, tabwebact
        });
        // 控制字表为只读
        window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/updateChildTableReadonly`, true);
      }
    });
  }

  // 存在jflow流程时
  if (obj.instanceId !== null && obj.buttons && obj.buttons !== null && obj.buttons.length > 0) {
    const stateTimeout = setInterval(() => {
      // 定时器的处理，排除列表界面
      if (window.jflowPlugin.router.currentRoute.fullPath.split('/')[2] === 'TABLE') {
        clearInterval(stateTimeout);
        return; 
      }
      // 判断state状态是否已经生成
      const store = window.jflowPlugin.store;
      let stateFlag = null;
      try {
        stateFlag = (window.jflowPlugin.store.state[MODULE_COMPONENT_NAME] && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data.tabcmd) || (store.state[MODULE_COMPONENT_NAME].tabPanels && store.state[MODULE_COMPONENT_NAME].tabPanels.length > 0 && store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute && store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute.buttonsData.data.tabcmd.prem);
      } catch {
        clearInterval(stateTimeout);
      }
      if (stateFlag) {
        clearInterval(stateTimeout);
        const buttonsData = store.state[MODULE_COMPONENT_NAME].mainFormInfo ? JSON.parse(JSON.stringify(store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData)) : JSON.parse(JSON.stringify(store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute.buttonsData));
        buttonsData.data.tabcmd.prem = buttonsData.data.tabcmd.prem.map(() => false);
        if (obj.editFeild !== null && obj.editFeild !== '[]') { // 判断是否存在可编辑字段
          buttonsData.data.tabcmd.prem[1] = true;
        } else {
          buttonsData.data.tabcmd.prem[1] = false;
        }

        // 添加刷新按钮
        obj.buttons.push({
          button: 'fresh',
          name: '刷新',
          url: ''
        });
        const newButtons = obj.buttons;
        let tabwebact = [];
        tabwebact = store.state[MODULE_COMPONENT_NAME].defaultButtonData.tabwebact.objbutton.filter((item) => {
          if ((obj.visibleBt ? obj.visibleBt : []).includes(String(item.webid))) {
            return item;
          }
        });
        window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/updateRefreshButton`, false);
        window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/jflowPlugin`, {
          buttonsData: buttonsData.data.tabcmd.prem, newButtons, instanceId: obj.instanceId, tabwebact
        });
        buttonAddEventListener(buttons, obj, id);
        // 修改水印
        window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/updateWatermarkimg`, obj.waterMark);
        // 控制字表为只读
        window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/updateChildTableReadonly`, true);
      }
    }, 100);
  } else {
    const stateTimeout = setInterval(() => {
      // 定时器的处理，排除列表界面
      if (window.jflowPlugin.router.currentRoute.fullPath.split('/')[2] === 'TABLE') {
        clearInterval(stateTimeout);
        return; 
      }
      // 判断state状态是否已经生成
      const store = window.jflowPlugin.store;
      let stateFlag = null;
      try {
        stateFlag = (window.jflowPlugin.store.state[MODULE_COMPONENT_NAME] && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data.tabcmd) || (store.state[MODULE_COMPONENT_NAME].tabPanels && store.state[MODULE_COMPONENT_NAME].tabPanels.length > 0 && store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute && store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute.buttonsData.data.tabcmd.prem);
      } catch {
        clearInterval(stateTimeout);
      }
      if (stateFlag) {
        clearInterval(stateTimeout);
        const newButtons = [];
        const defaultButtonData = store.state[MODULE_COMPONENT_NAME].defaultButtonData.tabcmd.prem;
        const tabwebact = store.state[MODULE_COMPONENT_NAME].defaultButtonData.tabwebact.objbutton;
        window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/jflowPlugin`, {
          buttonsData: defaultButtonData, newButtons, instanceId: null, tabwebact
        });

        window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/updateRefreshButton`, true);
        // 修改水印
        window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/updateWatermarkimg`, obj.waterMark);
        // 控制字表为只读
        window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/updateChildTableReadonly`, false);
      }
    });
  }
}


export default CreateButton;

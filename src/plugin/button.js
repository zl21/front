import { DispatchEvent } from '../__utils__/dispatchEvent';

// 撤销/结束/详情
function mutipleOperate(url, instanceId, buttons, id) {
  const param = {};
  param.instanceId = instanceId;
  param.userId = window.jflowPlugin.userInfo.id;
  param.nodeId = window.jflowPlugin.nodeId;
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
      window.vm.$Message.warning(res.data.resultMsg);
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
      case '-1':
      case '2': mutipleOperate(item.url, obj.instanceId, buttons, id); break;
      case '1': window.jflowPlugin.open({
        control: true, type: item.button, url: item.url, instanceId: obj.instanceId, returnOption: obj.backNodeIds, buttons, id 
      });
        break;
      case '0':
      case '3': window.jflowPlugin.open({// 同意和转派
        control: true, type: item.button, url: item.url, instanceId: obj.instanceId, buttons, id 
      });
        break;
      case '5': window.open(`${window.jflowPlugin.jflowIp}/#/FlowChart?instanceId=${window.jflowPlugin.objInstanceId}`, '_blank', 'width=800,height=800');
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
      const stateFlag = (window.jflowPlugin.store.state[MODULE_COMPONENT_NAME] && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data.tabcmd) || (store.state[MODULE_COMPONENT_NAME].tabPanels && store.state[MODULE_COMPONENT_NAME].tabPanels.length > 0 && store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute && store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute.buttonsData.data.tabcmd.prem);
      if (stateFlag) {
        clearInterval(stateTimeout);
        const buttonsData = store.state[MODULE_COMPONENT_NAME].mainFormInfo ? JSON.parse(JSON.stringify(store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData)) : JSON.parse(JSON.stringify(store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute.buttonsData));
        buttonsData.data.tabcmd.prem = buttonsData.data.tabcmd.prem.map(() => false);
        const newButtons = [];
        // 修改水印
        if (obj.waterMark) {
          window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/updateWatermarkimg`, obj.waterMark);
        }
        
        // 刷新按钮
        window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/updateRefreshButton`, false);
        // 更新按钮
        window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/jflowPlugin`, {
          buttonsData: buttonsData.data.tabcmd.prem, newButtons, instanceId: 1
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
      const stateFlag = (window.jflowPlugin.store.state[MODULE_COMPONENT_NAME] && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data.tabcmd) || (store.state[MODULE_COMPONENT_NAME].tabPanels && store.state[MODULE_COMPONENT_NAME].tabPanels.length > 0 && store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute && store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute.buttonsData.data.tabcmd.prem);
      if (stateFlag) {
        clearInterval(stateTimeout);
        const buttonsData = store.state[MODULE_COMPONENT_NAME].mainFormInfo ? JSON.parse(JSON.stringify(store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData)) : JSON.parse(JSON.stringify(store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute.buttonsData));
        buttonsData.data.tabcmd.prem = buttonsData.data.tabcmd.prem.map(() => false);
        if (obj.modifiableFieldName !== null && obj.modifiableFieldName.length > 0) {
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
        window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/updateRefreshButton`, false);
        window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/jflowPlugin`, {
          buttonsData: buttonsData.data.tabcmd.prem, newButtons, instanceId: obj.instanceId 
        });
        buttonAddEventListener(buttons, obj, id);
        // 修改水印
        if (obj.waterMark) {
          window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/updateWatermarkimg`, obj.waterMark);
        }
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
      const stateFlag = (window.jflowPlugin.store.state[MODULE_COMPONENT_NAME] && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data.tabcmd) || (window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].tabPanels && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].tabPanels.length > 0 && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute.buttonsData.data.tabcmd.prem);
      if (stateFlag) {
        clearInterval(stateTimeout);
        const newButtons = [];
        const defaultButtonData = store.state[MODULE_COMPONENT_NAME].defaultButtonData.tabcmd.prem;
        window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/jflowPlugin`, {
          buttonsData: defaultButtonData, newButtons, instanceId: null
        });

        window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/updateRefreshButton`, true);
        // 修改水印
        if (obj.waterMark) {
          window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/updateWatermarkimg`, obj.waterMark);
        }
        // 控制字表为只读
        window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/updateChildTableReadonly`, false);
      }
    });
  }
}


export default CreateButton;

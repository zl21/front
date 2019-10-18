// import { clearInterval } from 'timers';

// 这里主要是按钮的逻辑
// 创建按钮
// obj 获取的按钮相关数据 buttons 生成按钮的方法（jflowButtons） 生成按钮需要的id
function CreateButton(obj, buttons, id, store) {
  if (!obj.instanceId && obj.businessStatus !== -2) {
    return;
  }
  const type = window.jflowPlugin.router.currentRoute.fullPath.split('/')[3];
  const MODULE_COMPONENT_NAME = `${type}.${window.jflowPlugin.router.currentRoute.params.tableName}.${window.jflowPlugin.router.currentRoute.params.tableId}.${window.jflowPlugin.router.currentRoute.params.itemId}`;
  const stateTimeout = setInterval(() => {
    if (window.jflowPlugin.store.state[MODULE_COMPONENT_NAME] && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data && window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data.tabcmd) {
      clearInterval(stateTimeout);
      const buttonsData = Object.assign(window.jflowPlugin.store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData);
      buttonsData.data.tabcmd.prem.map(item => false);
      const newButtons = [];
      const buttonAnother = [];
      window.jflowPlugin.store.commit(`${MODULE_COMPONENT_NAME}/jflowPlugin`, { buttonsData, newButtons, buttonAnother });
    }
  }, 100);

  window.addEventListener('jflowPlugin', (e) => {
    if (e.detail.type === 'fresh') {
      buttons(id);
    }
  }, false);
  // const MODULE_COMPONENT_NAME = window.location.pathname.split('/').slice(3).join('.');
  // // -1, "撤销"
  // // 0, "同意"
  // // 1, "驳回"
  // // 2, "结束流程"
  // // 3, "转派"
  // // 4, "保存单据修改" 这个按钮不展示
  // // 5,"详情页面"
  // if (obj.instanceId !== null && obj.buttons && obj.buttons !== null && obj.buttons.length > 0) {
  //   let buttonAnother = [];
  //   let operateData = {};
  //   let buttonsData = [];
  //   const hasDataTime = setInterval(() => {
  //     if (window.location.pathname.split('/')[3] === 'V') {
  //       if (store.state[MODULE_COMPONENT_NAME].mainFormInfo && store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData && store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data && store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data.tabcmd && store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data.tabcmd.prem) {
  //         clearInterval(hasDataTime);
  //         buttonAnother = store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data.tabcmd.prem;
  //         operateData = Object.assign({}, store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData);
  //         buttonsData = operateData.data.tabcmd.prem.map(item => false);
  //         if (obj.modifiableFieldName !== null && obj.modifiableFieldName.length > 0) {
  //           buttonsData[1] = true;
  //         } else {
  //           buttonsData[1] = false;
  //         }
  //         const newButtons = obj.buttons;
  //         store.commit(`${MODULE_COMPONENT_NAME}/jflowPlugin`, { buttonsData, newButtons, buttonAnother });
  //       }
  //     } else if (store.state[MODULE_COMPONENT_NAME].tabPanels && store.state[MODULE_COMPONENT_NAME].tabPanels.length > 0 && store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute && store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute.buttonsData.data.tabcmd.prem) {
  //       clearInterval(hasDataTime);
  //       buttonAnother = store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute.buttonsData.data.tabcmd.prem;
  //       operateData = Object.assign({}, store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute.buttonsData);
  //       buttonsData = operateData.data.tabcmd.prem.map(item => false);
  //       if (obj.modifiableFieldName !== null && obj.modifiableFieldName.length > 0) {
  //         buttonsData[1] = true;
  //       } else {
  //         buttonsData[1] = false;
  //       }
  //       const newButtons = obj.buttons;
  //       store.commit(`${MODULE_COMPONENT_NAME}/jflowPlugin`, { buttonsData, newButtons, buttonAnother });
  //     }
  //   }, 300);

  //   window.addEventListener('jflowPlugin', (e) => {
  //     if (e.detail.type === 'fresh') {
  //       buttons(id);
  //       return; 
  //     }
  //     const item = e.detail.obj;
  //     if (item.button !== '4') {
  //       switch (item.button) {
  //         case '-1':
  //         case '2': mutipleOperate(item.url, obj.instanceId, buttons, id); break;
  //         case '1': window.jflowPlugin.open({
  //           control: true, type: item.button, url: item.url, instanceId: obj.instanceId, returnOption: obj.backNodeIds, buttons, id 
  //         });
  //           break;
  //         case '0':
  //         case '3': window.jflowPlugin.open({// 同意和转派
  //           control: true, type: item.button, url: item.url, instanceId: obj.instanceId, buttons, id 
  //         });
  //           break;
  //         case '5': window.open(`http://${window.jflowPlugin.jflowIp}/#/FlowChart?instanceId=${obj.instanceId}`, '_blank', 'width=800,height=800');
  //           break;
  //       }
  //     }
  //   }, false);
  // } else {
  //   let buttonsData = [];
  //   const hasDataTime = setInterval(() => {
  //     if (window.location.pathname.split('/')[3] === 'V') {
  //       if (store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data.tabcmd.prem) {
  //         clearInterval(hasDataTime);
  //         buttonsData = store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data.tabcmd.prem;
  //         const newButtons = [];
  //         store.commit(`${MODULE_COMPONENT_NAME}/jflowPlugin`, { buttonsData, newButtons });
  //       }
  //     } else if (store.state[MODULE_COMPONENT_NAME].tabPanels && store.state[MODULE_COMPONENT_NAME].tabPanels.length > 0 && store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute && store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute.buttonsData.data.tabcmd.prem) {
  //       clearInterval(hasDataTime);
  //       buttonsData = store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute.buttonsData.data.tabcmd.prem;
  //       const newButtons = [];
  //       store.commit(`${MODULE_COMPONENT_NAME}/jflowPlugin`, { buttonsData, newButtons });
  //     }
  //   }, 300);
  // }
}

// 撤销/结束/详情
function mutipleOperate(url, instanceId, buttons, id) {
  const param = {};
  param.instanceId = instanceId;
  param.userId = window.jflowPlugin.userInfo.id;
  window.jflowPlugin.axios.post(url, param).then((res) => {
    if (res.data.resultCode === 0) {
      window.vm.$Message.success(res.data.resultMsg);
      buttons(id);
    } else {
      window.vm.$Message.warning(res.data.resultMsg);
    }
  });
}
export default CreateButton;

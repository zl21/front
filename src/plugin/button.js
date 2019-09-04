// 这里主要是按钮的逻辑
// 创建按钮
// obj 获取的按钮相关数据 buttons 生成按钮的方法（jflowButtons） 生成按钮需要的id
function CreateButton(obj, buttons, id, store) {
  const MODULE_COMPONENT_NAME = window.location.pathname.split('/').slice(3).join('.');
  // -1, "撤销"
  // 0, "同意"
  // 1, "驳回"
  // 2, "结束流程"
  // 3, "转派"
  // 4, "保存单据修改" 这个按钮不展示
  // 5,"详情页面"
  if (obj.instanceId !== null && obj.buttons && obj.buttons !== null && obj.buttons.length > 0) {
    let buttonAnother = [];
    let operateData = {};
    let buttonsData = [];
    const hasDataTime = setInterval(() => {
      if (window.location.pathname.split('/')[3] === 'V') {
        if (store.state[MODULE_COMPONENT_NAME].mainFormInfo && store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData && store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data && store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data.tabcmd && store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data.tabcmd.prem) {
          clearInterval(hasDataTime);
          buttonAnother = store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data.tabcmd.prem;
          operateData = Object.assign({}, store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData);
          buttonsData = operateData.data.tabcmd.prem.map(item => false);
          if (obj.modifiableFieldName !== null && obj.modifiableFieldName.length > 0) {
            buttonsData[1] = true;
          } else {
            buttonsData[1] = false;
          }
          const newButtons = obj.buttons;
          store.commit(`${MODULE_COMPONENT_NAME}/jflowPlugin`, { buttonsData, newButtons, buttonAnother });
        }
      } else if (store.state[MODULE_COMPONENT_NAME].tabPanels && store.state[MODULE_COMPONENT_NAME].tabPanels.length > 0 && store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute && store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute.buttonsData.data.tabcmd.prem) {
        clearInterval(hasDataTime);
        buttonAnother = store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute.buttonsData.data.tabcmd.prem;
        operateData = Object.assign({}, store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute.buttonsData);
        buttonsData = operateData.data.tabcmd.prem.map(item => false);
        if (obj.modifiableFieldName !== null && obj.modifiableFieldName.length > 0) {
          buttonsData[1] = true;
        } else {
          buttonsData[1] = false;
        }
        const newButtons = obj.buttons;
        store.commit(`${MODULE_COMPONENT_NAME}/jflowPlugin`, { buttonsData, newButtons, buttonAnother });
      }
    }, 300);

    window.addEventListener('jflowPlugin', (e) => {
      if (e.detail.type === 'fresh') {
        buttons(id);
        return; 
      }
      const item = e.detail.obj;
      if (!(item.button === '4')) {
        if (item.button === '-1' || item.button === '2') {
          mutipleOperate(item.url, obj.instanceId, buttons, id);
        } else if (item.button === '1') {
          window.jflowPlugin.open({
            control: true, type: item.button, url: item.url, instanceId: obj.instanceId, returnOption: obj.backNodeIds, buttons, id 
          });
        } else if (item.button === '5') {
          window.open(`http://${window.jflowPlugin.jflowIp}/#/FlowChart?instanceId=${obj.instanceId}`, '_blank', 'width=800,height=800');
        } else {
          window.jflowPlugin.open({
            control: true, type: item.button, url: item.url, instanceId: obj.instanceId, buttons, id 
          });
        }
      }
    }, false);
  } else {
    let buttonsData = [];
    const hasDataTime = setInterval(() => {
      if (window.location.pathname.split('/')[3] === 'V') {
        if (store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data.tabcmd.prem) {
          clearInterval(hasDataTime);
          buttonsData = store.state[MODULE_COMPONENT_NAME].mainFormInfo.buttonsData.data.tabcmd.prem;
          const newButtons = [];
          store.commit(`${MODULE_COMPONENT_NAME}/jflowPlugin`, { buttonsData, newButtons });
        }
      } else if (store.state[MODULE_COMPONENT_NAME].tabPanels && store.state[MODULE_COMPONENT_NAME].tabPanels.length > 0 && store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute && store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute.buttonsData.data.tabcmd.prem) {
        clearInterval(hasDataTime);
        buttonsData = store.state[MODULE_COMPONENT_NAME].tabPanels[0].componentAttribute.buttonsData.data.tabcmd.prem;
        const newButtons = [];
        store.commit(`${MODULE_COMPONENT_NAME}/jflowPlugin`, { buttonsData, newButtons });
      }
    }, 300);
  }
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

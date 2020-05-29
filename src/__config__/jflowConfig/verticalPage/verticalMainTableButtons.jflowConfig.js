
// import store from '../store.config';
// import router from '../router.config';
// import { getKeepAliveModuleName } from '../router.navigation.guard';


export const verticalTableDetailJflowConfigData = (data) => {
  // const { tableId } = router.currentRoute.params;
  const { JflowConfigData, resData, type } = data;
  const buttonsJflowRes = [];

  if (type === 'mainTable') { // 配置为主表
  // 处理tabwebact（自定义按钮逻辑）
    if (JflowConfigData.exeActionButton.length > 0) {
    // 处理自定义类型按钮

      JflowConfigData.exeActionButton.map((buttonId) => {
        resData.tabwebact.objbutton.map((objbutton) => {
          if (String(buttonId) === String(objbutton.webid)) {
            buttonsJflowRes.push(objbutton);
          }
          return objbutton;
        });
        return buttonId;
      });
      if (buttonsJflowRes.length > 0) { // jflow exeActionButton配置中包含子表自定义按钮ID
        resData.tabwebact.objbutton = buttonsJflowRes;
      }
    // 处理自定义类型按钮
    } else {
      resData.tabwebact.objbutton = buttonsJflowRes;
    }
    // 处理tabwebact（自定义按钮逻辑）

    // 处理tabcmd类型按钮
    // jflowButtons有返回值时，将元数据标准以及刷新按钮去除
    if (JflowConfigData.jflowButton && JflowConfigData.jflowButton.length > 0) {
    // 如果jflowButton配置了按钮，则将元数据返回按钮删除，显示jflow按钮
      if (resData.tabcmd && resData.tabcmd.prem && resData.tabcmd.prem.length > 0) {
        resData.tabcmd.prem = resData.tabcmd.prem.map((item, index) => {
          if (JflowConfigData.readonly.length > 0 && resData.tabcmd.cmds[index] === 'actionMODIFY') { // 如果配置了可编辑字段，则显示保存按钮
            item = true;
            return item;
          }
          item = false;
          return item;
        });
      }
      resData.reftabs.map((tabData) => {
        tabData.JflowReadonly = true;// 将所有子表置为不可编辑
      });
      resData.JflowReadonly = false;// 将主表置为可编辑
      resData.jflowButton = JflowConfigData.jflowButton;
      resData.jflowConfigrefreshButton = true;// 显示刷新按钮
    // store.commit(`${getKeepAliveModuleName}/updataJflowConfigrefreshButton`, true);// 显示刷新按钮
    }
  } else { // 配置为子表
    resData.jflowButton = JflowConfigData.jflowButton.filter(jflowButton => jflowButton.button === 'fresh');
    resData.tabcmd.prem = resData.tabcmd.prem.map((item, index) => { // 筛选复制按钮
      if (resData.tabcmd.cmds[index] === 'actionCANCOPY') { // 如果配置了可编辑字段，则显示复制按钮
        item = true;
        return item;
      }
      if (JflowConfigData.readonly.length > 0 && resData.tabcmd.cmds[index] === 'actionMODIFY') { // 如果配置了可编辑字段，则显示保存按钮
        item = true;
        return item;
      }
      item = false;
      return item;
    });
    resData.tabwebact.objbutton = [];
  }
  resData.isHideTempStorage = true;// 不显示暂存按钮
  resData.reftabs.map((tabData) => {
    if (Number(tabData.tableid) !== Number(JflowConfigData.itemTableId)) {
      tabData.JflowReadonly = true;// 将除jflow配置的子表外的所有子表置为不可编辑
    } else {
      tabData.JflowReadonly = false;
    }
  });
 
  // 处理tabcmd类型按钮
  return resData;
};

export default verticalTableDetailJflowConfigData;


// import store from '../store.config';
// import router from '../router.config';
// import { getKeepAliveModuleName } from '../router.navigation.guard';


export const verticalTableDetailJflowConfigData = (data) => {
  // const { tableId } = router.currentRoute.params;
  const { JflowConfigData, resData, type } = data;
  const buttonsJflowRes = [];
  if (data.type === 'itemTable') { // 配置为子表时
    // 配置为子表
    // 处理主表保存按钮逻辑，
    // 规则1:jflow配置了子表有可编辑字段时，主表显示保存按钮
    // 规则2：jflow配置的为子表时，主表刷新隐藏，将jflow配置的刷新按钮显示在主表上
    // 规则3:将主表元数据配置的标准按钮除了保存按钮之后全部删除，自定义按钮全部删除
    // return;
    // resData.isItemTableVertical = true;// 此字段用于单对象按钮组件控制样式
    resData.isShow = true;// 1:1form组件上显示单对象按钮组件
    if (resData.tabwebact && resData.tabwebact.objtabbutton.length > 0) {
      const objtabbuttons = resData.tabwebact.objtabbutton;
  
      if (JflowConfigData.exeActionButton.length > 0) {
        const buttonsJflowRes = [];
        JflowConfigData.exeActionButton.map((buttonId) => {
          objtabbuttons.map((objtabbutton) => {
            if (String(buttonId) === String(objtabbutton.webid)) {
              buttonsJflowRes.push(objtabbutton);
            }
          });
        });
        if (buttonsJflowRes.length > 0) { // jflow exeActionButton配置中包含子表自定义按钮ID，则显示
          resData.tabwebact.objtabbutton = buttonsJflowRes;// 上下结构，1:1面板+单对象按钮组件，自定义类型按钮需放在objbutton可显示
        } 
      }
    }
    if (JflowConfigData.jflowButton && JflowConfigData.jflowButton.length > 0) {
    // 如果jflowButton配置了按钮，则将元数据返回按钮删除，显示jflow按钮
      if (resData.tabcmd && resData.tabcmd.prem && resData.tabcmd.prem.length > 0) {
        resData.tabcmd.prem = resData.tabcmd.prem.map((item) => {
          item = false;
          return item;
        });
      }
      resData.jflowButton = JflowConfigData.jflowButton;
      // .filter(jflowButton => jflowButton.button !== 'fresh');
    }
    // resData.backButton = false;// 控制子表按钮返回按钮显示
    resData.jflowConfigrefreshButton = true;// 将主表刷新按钮删除
  
    // 以上逻辑为当前jflow配置的为子表时，当前单据其余表按钮展示逻辑
    // 上下结构只有当前配置表展示按钮，其余子表不展示按钮，主表展示刷新/复制/返回
    // 刷新按钮显示jflow返回的刷新
  } else {
    resData.tabwebact.objtabbutton = [];
    resData.tabcmd.prem = resData.tabcmd.prem.map((item) => {
      item = false;
      return item;
    });
  }

  return resData;
};
export default verticalTableDetailJflowConfigData;

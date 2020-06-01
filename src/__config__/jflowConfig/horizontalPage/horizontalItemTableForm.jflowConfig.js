
// import store from '../store.config';
// import router from '../router.config';
// import { getKeepAliveModuleName } from '../router.navigation.guard';


export const horizontalItemTableForm = (data) => {
  // const { tableId } = router.currentRoute.params;
  const { JflowConfigData, resData } = data;
  if (data.type === 'itemTable') {
    const addcolumsData = resData.addcolums.reduce((a, c) => {
      const u = [];
      if (c.childs) {
        c.childs.map((d) => {
          if (JflowConfigData.isShow.length > 0) { // display有数据，则只展示数据里的字段
            if (JflowConfigData.isShow.includes(String(d.colid))) {
              if (JflowConfigData.readonly.length > 0) {
                if (JflowConfigData.readonly.includes(String(d.colid))) {
                  d.readonly = false;
                  u.push(d);
                } else {
                  d.readonly = true;
                  u.push(d);
                }
              } else {
                d.readonly = true;
                u.push(d);
              }
            }
          } else if (JflowConfigData.readonly.length > 0) {
            // 未配置jflowisShow字段，则显示全部元数据字段，由readonly控制字段是否可编辑
            if (JflowConfigData.readonly.includes(String(d.colid))) {
              // 未配置可见字段，只配置了可编辑字段时，所有元数据返回的字段可见，readonly内配置的可编辑
              d.readonly = false;
              u.push(d);
            } else { // 不可编辑
              d.readonly = true;
              u.push(d);
            }
          } else { // 未配置可编辑字段，则所有元数据字段不可编辑
            d.readonly = true;
            u.push(d);
          }
        });
        c.childs = u;
        a.push(c);
      } else if (JflowConfigData.isShow.length > 0) { // display有数据，则只展示数据里的字段
        if (JflowConfigData.isShow.includes(String(c.child.colid))) {
          if (JflowConfigData.readonly.length > 0 && JflowConfigData.readonly.includes(String(c.child.colid))) {
            c.child.readonly = false;
            a.push(c);
          } else {
            c.child.readonly = true;
            a.push(c);
          } 
        } 
      } else if (JflowConfigData.readonly.length > 0) {
        // isShow无数据，则显示元数据接口返回所有字段，但当前表为不可编辑状态
        // jflow配置了可编辑字段时，配置的字段可编辑，其余全部为不可编辑状态
        if (JflowConfigData.readonly.includes(String(c.child.colid))) {
          c.child.readonly = false;
          a.push(c);
        } else {
          // jflow未配置可编辑字段时，则元数据所有字段全部不可编辑
          c.child.readonly = true;
          a.push(c);
        }
      } else {
        // jflow未配置显示字段以及未配置可编辑字段时，则所有元数据字段为不可编辑状态
        c.child.readonly = true;
        a.push(c);
      }
      return a;
    }, []);
    resData.addcolums = addcolumsData;
  } else if (data.type === 'mainTable') {
    // 解决触发jflow按钮时，jflow配置更改表，此时，需要切换到更改后的tab，需从新触发更改后的表的刷新按钮，jflow配置才可生效
    // 配置从子表更改为主表，需切换到主表
    // const oUl = document.querySelector('.burgeon-tabs-panels-nav');
    // if (oUl) {
    //   oUl.children[1].click();
    // }
    // // 需触发主表刷新按钮
    // setTimeout(() => {
    //   const dom = document.getElementById('refresh');
    //   const myEvent = document.createEvent('HTMLEvents');
    //   myEvent.initEvent('click', false, true);
    //   dom.dispatchEvent(myEvent);
    // }, 1000);
  }
 
  return resData;
};
export default horizontalItemTableForm;

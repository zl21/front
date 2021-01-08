import {
  VERTICAL_TABLE_DETAIL_PREFIX,
  HORIZONTAL_TABLE_DETAIL_PREFIX,
  STANDARD_TABLE_LIST_PREFIX,
  STANDARD_TABLE_COMPONENT_PREFIX,
  STANDARD_COMMONTABLE_COMPONENT_PREFIX,
  CUSTOMIZED_MODULE_PREFIX,
  LINK_MODULE_COMPONENT_PREFIX,
  LINK_MODULE_PREFIX,
  enableKeepAlive,
  enableHistoryAndFavoriteUI,
  enableActivateSameCustomizePage,
  enableOpenNewTab
} from '../../../constants/global';
import router from '../../router.config';
import setCustomeLabel from '../../../__utils__/setCustomeLabel';
import {
  getSeesionObject, updateSessionObject, deleteFromSessionObject, removeSessionObject 
} from '../../../__utils__/sessionStorage';
import { getLabel } from '../../../__utils__/url';
import { DispatchEvent } from '../../../__utils__/dispatchEvent';
import getUserenv from '../../../__utils__/getUserenv';
import store from '../../store.config';


export default {
 
  updataNewTagForNewTab(state, data) {
    state.sameNewPage = data;
  },
  updataSwitchTag(state, data) {
    state.switchTag = data;
  },
  // updataTreeId(state, data) {
  //   // data.tableId:主表ID
  //   // data.treeId:勾选的树结构列表ID
  //   state.treeIds.push(data);
  // },
  changeCurrentTabName(state, data) { // 修改当前表对应Tab名称
    if (data.keepAliveModuleName && data.label) {
      const obj = {
        name: data.keepAliveModuleName,
        label: data.label
      };
      this.commit('global/addKeepAliveLabelMaps', obj);
      state.activeTab.label = data.label;
      state.keepAliveLabelMaps[data.keepAliveModuleName] = data.label;
      state.openedMenuLists.filter((TabData) => {
        if (TabData.keepAliveModuleName === data.keepAliveModuleName) {
          TabData.label = data.label;
        } else if (enableActivateSameCustomizePage() && TabData.keepAliveModuleName.includes(data.customizedModuleName) && TabData.keepAliveModuleName !== data.keepAliveModuleName) {
          TabData.label = data.label;
          TabData.keepAliveModuleName = data.keepAliveModuleName;
          // 如果开启自定义界面标识相同激活同一个定制界面，则该逻辑为检测打开的tab与目标界面的自定义界面标识相同，🆔不同时，已打开的自定义界面重新被激活时，可替换为来源界面设置的labelName
        }
      });
    }
  },
  updataSTDefaultQuery(state, data) {
    // tableId:跳转目标表ID
    // colid：目标表字段ID
    // defaultValue：目标表设置的默认值
   
    
    window.sessionStorage.setItem(data.tableId, JSON.stringify(data.values));
    // updateSessionObject(data.tableId, param);
  },
  updataOpenedMenuLists(state, data) {
    state.openedMenuLists = data;
  },
  updateTreeTableListData(state) {
    state.treeTableListData = [];
  },
  updataLoading(state, tableName) {
    if (!state.currentLoading.includes(tableName)) { // 没有则添加
      state.currentLoading.push(tableName); 
    }
  },
  deleteLoading(state, tableName) {
    const index = state.currentLoading.indexOf(tableName);
    if (index > -1) {
      state.currentLoading.splice(index, 1);
    }

    // state.currentLoading.splice(tableName, 1);
  },
  directionalRouter(state, param) {
    // id:勾选ID，
    // url:配置url,
    // isMenu,
    // lablel:名称,
    // type:link外链类型需要传类型，
    // lingName:外链表名，
    // linkId:外链表ID，
    // query:路由参数
    // 注：url前不能加/ ，格式应为'CUSTOMIZED/FUNCTIONPERMISSION/2299'
    if (param && param.url && param.url.includes('?')) {
      param.url = getUserenv({ url: param.url });
    }
    const actionType = param.url.substring(0, param.url.indexOf('/'));
    const singleEditType = param.url.substring(param.url.lastIndexOf('/') + 1, param.url.length);
    if (actionType === 'SYSTEM') {
      if (singleEditType === ':itemId') {
        const path = `/${param.url.replace(/:itemId/, param.id)}`;
        router.push(
          path
        );
      } else {
        const path = `/${param.url}`;
        router.push(
          path
        );
      }
    } else if (actionType === 'https:' || actionType === 'http:') {
      const name = `${LINK_MODULE_COMPONENT_PREFIX}.${param.lingName.toUpperCase()}.${param.linkId}`;     
      // this.addKeepAliveLabelMaps({ name, label: param.lablel });
      state.keepAliveLabelMaps[name] = `${param.lablel}`;
      if (param.query) {
        const query = `?objId=${param.query}`;
        param.url = param.url.concat(query);
      }
      const linkUrl = param.url;
      // const linkId = param.linkId;
      const linkModuleName = param.lingName.toUpperCase();
      if (!store.state.global.LinkUrl[linkModuleName]) {      
        store.commit('global/increaseLinkUrl', { linkModuleName, linkUrl });
      }
      const obj = {
        linkName: param.lingName.toUpperCase(),
        linkId: param.linkId,
        linkUrl,
        linkLabel: param.lablel
      };
      window.sessionStorage.setItem('tableDetailUrlMessage', JSON.stringify(obj));
      const path = `${LINK_MODULE_PREFIX}/${param.lingName.toUpperCase()}/${param.linkId}`;
      router.push({
        path
      });
    } else if (actionType.toUpperCase() === 'CUSTOMIZED') {
      const customizedModuleName = param.url.substring(param.url.indexOf('/') + 1, param.url.lastIndexOf('/'));
      if (param.isMenu) {
        const data = {
          customizedModuleName,
          customizedModuleId: param.id,
          label: param.label
        };
        setCustomeLabel(data);
      }
      const treeQuery = router.currentRoute.query;
      let path = '';
      if (treeQuery.isTreeTable) {
        // 如果当前列表为树形结构列表界面，则配置的动态路由以及tableurl（配置为跳转定制界面，则路由上定制界面ID为treeTableListSelectId）
        path = `${CUSTOMIZED_MODULE_PREFIX}/${customizedModuleName.toUpperCase()}/${param.treeTableListSelectId ? param.treeTableListSelectId : param.id}`;
      } else {
        path = `${CUSTOMIZED_MODULE_PREFIX}/${customizedModuleName.toUpperCase()}/${param.id}`;
      }
      router.push({
        path
      });
    }
  },
  changeNavigatorSetting(state, data) {
    state.navigatorSetting.unshift(data[0]);
    // 去重覆盖
    state.navigatorSetting = state.navigatorSetting.filter((x, index, self) => {
      const arrids = [];
      state.navigatorSetting.forEach((item, i) => {
        arrids.push(item.id);
      });
      return arrids.indexOf(x.id) === index;
    });
  },
  changeSelectedPrimaryMenu(state, index) {
    state.primaryMenuIndex = index;
  },
  hideMenu(state) {
    state.primaryMenuIndex = -1;
  },
  saveLastIndexForMenu(state, lastIndex) {
    if (state.lastIndex === lastIndex) {
      state.lastIndex = -1;
    } else {
      state.lastIndex = lastIndex;
    }
  },
  doCollapseHistoryAndFavorite(state, { showFavorites }) {
    state.showFavoritesList = showFavorites;
    if (showFavorites) {
      state.collapseHistoryAndFavorite = showFavorites;
    }
    // 增加兼容IE逻辑
    // if ('ActiveXObject' in window && enableHistoryAndFavoriteUI && state.collapseHistoryAndFavorite) {
    //   document.getElementById('ContentDisplayArea').style.marginLeft = '60px';
    // } else if ('ActiveXObject' in window  && enableHistoryAndFavoriteUI && !state.collapseHistoryAndFavorite) {
    //   document.getElementById('ContentDisplayArea').style.marginLeft = '190px';
    // }
    state.collapseHistoryAndFavorite = !state.collapseHistoryAndFavorite;
    DispatchEvent('doCollapseHistoryAndFavorite');
  },
  updateHistoryAndFavorite(state, {
    history,
    favorite
  }) {
    if (history) {
      state.history = history;
    }
    if (favorite) {
      state.favorite = favorite;
    }
  },

  updateMenuLists(state, menuLists) {
    state.menuLists = menuLists;
    if (menuLists.length > 0) {
      state.keepAliveLabelMaps = menuLists
        .map(d => d.children)
        .reduce((a, c) => a.concat(c))
        .map(d => d.children)
        .reduce((a, c) => a.concat(c))
        .reduce((a, c) => {
          let customizedModuleName;
          const customizedModuleId = c.id;
          if (c.type === 'action') {
          // 外部跳转链接URL的处理
            if (c.url) {
              // c.url = `${c.url}?AD_CLIENT_NAME={AD_CLIENT_NAME}&AD_ORG_ID={AD_ORG_ID}`;
              if (c.url.includes('?')) {
                c.url = getUserenv({ url: c.url });
              }
              const actionType = c.url.substring(0, c.url.indexOf('/'));
              if (actionType === 'https:' || actionType === 'http:') {
                const linkUrl = {};
                linkUrl[c.value.toUpperCase()] = c.url;
                state.LinkUrl.push(linkUrl); // 方便记录外部链接的跳转URL
                a[`${LINK_MODULE_COMPONENT_PREFIX}.${c.value.toUpperCase()}.${c.id}`] = c.label;
                customizedModuleName = `${LINK_MODULE_COMPONENT_PREFIX}.${c.value.toUpperCase()}.${c.id}`;
              } else if (actionType.toUpperCase() === 'CUSTOMIZED') {
                // 自定义界面的处理
                // CUSTOMIZED/customizeReport：润钱报表,c.id
                // 报表类自定义界面根据id选择iframe加载的路径
                // 后端润乾报表配置已统一，在前端重置配置
                // if (c.url === 'customizeReport') {
                //   c.url = 'CUSTOMIZED/customizeReport';
                //   c.type = 'action';
                // }
                a[`${getLabel({ url: c.url, id: c.id, type: 'customized' })}`] = c.label;
                customizedModuleName = `${getLabel({ url: c.url, id: c.id, type: 'customized' })}`;
              } else if (actionType === 'SYSTEM') {
                const i = c.url.substring(c.url.indexOf('/') + 1, c.url.lastIndexOf('/'));
                const id = i.substring(i.lastIndexOf('/') + 1, i.length);
                const n = i.substring(i.indexOf('/') + 1, i.lastIndexOf('/'));
                const name = n.substring(n.lastIndexOf('/') + 1, n.length);
                a[`${STANDARD_TABLE_COMPONENT_PREFIX}.${name}.${id}`] = c.label;
                customizedModuleName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${name}.${id}`;
              }
            }
          } else if (c.type === 'table') {
            // 标准列表的处理
            a[`${STANDARD_TABLE_COMPONENT_PREFIX}.${c.value}.${c.id}`] = c.label;
            customizedModuleName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${c.value}.${c.id}`;
          } else if (c.type === 'tree') {
            // 树形结构列表的处理
            a[`${STANDARD_TABLE_COMPONENT_PREFIX}.${c.value}.${c.id}`] = c.label;
            customizedModuleName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${c.value}.${c.id}`;
            state.treeTableListData.push(c);
          } else if (c.type === 'commonTable') {
            // 标准列表的处理(普通表格)
            a[`${STANDARD_COMMONTABLE_COMPONENT_PREFIX}.${c.value}.${c.id}`] = c.label;
            customizedModuleName = `${STANDARD_COMMONTABLE_COMPONENT_PREFIX}.${c.value}.${c.id}`;
          } else if (c.type === 'rpt' && c.url) {
            c.url = `CUSTOMIZED/${c.url.toUpperCase()}?type=rpt`;
            c.type = 'action';
            a[`${getLabel({ url: c.url, id: c.id, type: 'customized' })}`] = c.label;
            customizedModuleName = `${getLabel({ url: c.url, id: c.id, type: 'customized' })}`;
          }

          const data = {
            customizedModuleName,
            customizedModuleId,
          };
          if (customizedModuleName) {
            setCustomeLabel(data);
          }
          
          return a;
        }, {});

      state.serviceIdMap = menuLists.map(d => d.children)
        .reduce((a, c) => a.concat(c))
        .map(d => d.children)
        .reduce((a, c) => a.concat(c))
        .filter(d => d.type === 'table' || d.type === 'action' || d.type === 'tree')
        .reduce((a, c) => {
          let menuType = '';
          if (c.url) {
            menuType = c.url.substring(c.url.lastIndexOf('/') + 1, c.url.length);
          }
          if (menuType === 'New') {
            const i = c.url.substring(c.url.indexOf('/') + 1, c.url.lastIndexOf('/'));
            const n = i.substring(i.indexOf('/') + 1, i.lastIndexOf('/'));
            const name = n.substring(n.lastIndexOf('/') + 1, n.length);
            a[name.toUpperCase()] = c.serviceId;
          } else {
            a[c.value.toUpperCase()] = c.serviceId;
          }
          if (!c.isHidden) {
            state.allMenu[c.value.toUpperCase()] = c.serviceId;
          }
          return a;
        }, {});
      const arr = Object.keys(state.keepAliveLabelMaps);
    }
    // 以下逻辑是为了解决菜单外路由跳转提供信息
    const tableDetailUrlMessage = getSeesionObject('tableDetailUrlMessage');
    if (JSON.stringify(tableDetailUrlMessage) !== '{}') { // 取按钮跳转外链label
      const labelName = tableDetailUrlMessage.linkName;
      const name = `L.${tableDetailUrlMessage.linkName.toUpperCase()}.${tableDetailUrlMessage.linkId}`;
      state.keepAliveLabelMaps[name] = `${labelName}`;
      const linkUrl = {};
      linkUrl[tableDetailUrlMessage.linkName.toUpperCase()] = tableDetailUrlMessage.linkUrl;
      state.LinkUrl.push(linkUrl); // 方便记录外部链接的跳转URL
      state.keepAliveLabelMaps[name] = `${tableDetailUrlMessage.linkLabel}`;
    }
    state.keepAliveLabelMaps = Object.assign({}, state.keepAliveLabelMaps, getSeesionObject('keepAliveLabelMaps'));
    state.serviceIdMap = Object.assign({}, state.serviceIdMap, getSeesionObject('serviceIdMap'));
    const path = getSeesionObject('savePath').path;
    if (path && path !== router.currentRoute.path) {
      router.push(path);
      // window.location.replace(window.location.href);
      // window.location.reload();
      removeSessionObject('savePath');
    }
  },
  
  increaseLinkUrl(state, { linkModuleName, linkUrl }) {
    const linkType = {};
    linkType[linkModuleName] = linkUrl;
    state.LinkUrl.push(linkType);
  },
  increaseKeepAliveLists(state, data) {
    let keepAliveModuleNameRes = '';
    if ((enableActivateSameCustomizePage()) && data.dynamicModuleTag === 'C') { // 只处理自定义界面情况，
      const index = data.name.lastIndexOf('.');
      keepAliveModuleNameRes = data.name.substring(0, index + 1);
    } else {
      keepAliveModuleNameRes = data.name;
    }
    if (enableKeepAlive()) {
      if (state.openedMenuLists.length > 6 && state.openedMenuLists.length === 7 && enableOpenNewTab()) { // 新开tab限制为6个，超过6个后，替换最后一个
        const spliceFlag = state.openedMenuLists.filter((d, i) => {
          if (d.keepAliveModuleName === data.name) {
            if (state.keepAliveLists[data.name]) {
              state.keepAliveLists.splice(i, 1, data.name);
              state.keepAliveLists = state.keepAliveLists.concat([data.name]);
              console.log(1, data.name, state.keepAliveLists);

              return true;
            } 
            state.keepAliveLists = state.keepAliveLists.concat([data.name]);
          } if ((enableActivateSameCustomizePage()) && data.dynamicModuleTag === 'C' && d.keepAliveModuleName.includes(keepAliveModuleNameRes)) {
            // enableActivateSameCustomizePage:true,定制界面ID不同，只激活同一个tab时
            state.keepAliveLists.map((kp, i) => {
              if (kp === d.keepAliveModuleName) {
                state.keepAliveLists.splice(i, 1);
              }
            });
            state.keepAliveLists = state.keepAliveLists.concat([data.name]);
            console.log(2, data.name, state.keepAliveLists);

            return true;
          }
        });
        console.log(444, spliceFlag);
        if (spliceFlag.length === 0) {
          console.log('🍓', data.name);
          state.keepAliveLists.splice(state.keepAliveLists.length - 1, 1, data.name);
        } 
      } else if (enableOpenNewTab() && state.keepAliveLists.filter(k => (k.includes('?isBack=true') && k.includes(keepAliveModuleNameRes)) || k === keepAliveModuleNameRes).length > 0) {
        // 处理同表tab新开逻辑，新增与复制内容进行重新激活时，对应的缓存模块问题，k.includes('?isBack=true') && k.includes(keepAliveModuleNameRes)) 
        // 处理模块名是包含关系时报错k === keepAliveModuleNameRes；如：a.11与a.1
        state.keepAliveLists.filter((a, i) => {
          if (a.includes(keepAliveModuleNameRes)) {
            state.keepAliveLists.splice(i, 1);
          }
        });
        // state.keepAliveLists = state.keepAliveLists.concat([data.name]);
      } else if (data.dynamicModuleTag === 'C' && enableActivateSameCustomizePage() && state.keepAliveLists.filter(k => k.includes(keepAliveModuleNameRes)).length > 0) {
        // 该判断enableActivateSameCustomizePage：false使用，只针对定制界面根据id不同可开启多个
        state.keepAliveLists.filter((a, i) => {
          if (a.includes(keepAliveModuleNameRes)) {
            state.keepAliveLists.splice(i, 1);
          }
        });
        state.keepAliveLists = state.keepAliveLists.concat([data.name]);
      } else {
        state.keepAliveLists = state.keepAliveLists.concat([data.name]);
      }
    } 
  },
  spliceMenuLists(state, menu) {
    state.activeTab = menu;
    state.openedMenuLists.forEach((d, i) => { // 将所有tab置为失活状态
      d.isActive = false;
      if (d.keepAliveModuleName === menu.keepAliveModuleName) {
        state.openedMenuLists.splice(i, 1, menu);// 替换当前一个tab
      }
    });
  },
  decreasekeepAliveLists(state, name) {
    if (enableKeepAlive() && state.keepAliveLists.includes(name)) {
      state.keepAliveLists.splice(state.keepAliveLists.indexOf(name), 1);
    }
  },
  toggleActiveMenu(state, index) {
    state.openedMenuLists.forEach((d) => { d.isActive = false; });
    state.openedMenuLists[index].isActive = true;
  },
  forceUpdateOpenedMenuLists(state, { openedMenuInfo, index }) {
    state.openedMenuLists.forEach((d) => { d.isActive = false; });
    state.openedMenuLists[index] = openedMenuInfo;
    state.openedMenuLists = state.openedMenuLists.concat([]);
    state.activeTab = openedMenuInfo;
    // state.activeTab = {
    //   isActive: openedMenuInfo.isActive,
    //   keepAliveModuleName: openedMenuInfo.keepAliveModuleName,
    //   label: openedMenuInfo.label,
    //   routeFullPath: openedMenuInfo.routeFullPath,
    //   routePrefix: openedMenuInfo.routePrefix,openedMenuLists
    //   tableName: openedMenuInfo.tableName,
    // };
  },
  
  increaseOpenedMenuLists(state, {
    label, keepAliveModuleName, tableName, routeFullPath, routePrefix, itemId, sameNewPage
  }) {
    const notExist = state.openedMenuLists.filter(d => d.label === label && d.keepAliveModuleName === keepAliveModuleName).length === 0;
    const currentTabInfo = {
      label,
      keepAliveModuleName,
      tableName,
      routeFullPath,
      routePrefix,      
      itemId,
      sameNewPage
    };
    if (notExist) {
      if (state.openedMenuLists.length > 6 && enableOpenNewTab()) { // 新开tab限制为6个，超过6个后，替换最后一个
        state.activeTab = currentTabInfo;
        currentTabInfo.isActive = true;
        state.openedMenuLists.forEach((d, i) => { // 将所有tab置为失活状态
          d.isActive = false;
        });
        state.openedMenuLists.splice(state.openedMenuLists.length - 1, 1, currentTabInfo);// 替换最后一个tab
      } else if (state.sameNewPage || sameNewPage) {
        // state.keepAliveLists.push(currentTabInfo.keepAliveModuleName);
        state.openedMenuLists = state.openedMenuLists
          .map(d => Object.assign({}, d, { isActive: false }))
          .concat([Object.assign({}, currentTabInfo, { isActive: true })]);
        state.activeTab = currentTabInfo;
      } else {
        state.openedMenuLists = state.openedMenuLists
          .map(d => Object.assign({}, d, { isActive: false }))
          .concat([Object.assign({}, currentTabInfo, { isActive: true })]);
        state.activeTab = currentTabInfo;
      }
    }
  },
  updateActiveMenu({
    openedMenuLists
  }, keepAliveModuleName) {
    let activeMenuIndex = -1;
    openedMenuLists.some((d, i) => {
      if (d.keepAliveModuleName === keepAliveModuleName) {
        activeMenuIndex = i;
        return true;
      }
      return false;
    });
    openedMenuLists.forEach((d, i) => {
      if (i === activeMenuIndex) {
        d.isActive = true;
      } else {
        d.isActive = false;
      }
    });
  },
  emptyTabs(state) {
    // 清除当前关闭的表单设置的跳转到标准列表表单默认值;
    // state.openedMenuLists.map((openedMenuList) => {
    //   const openedMenuListId = openedMenuList.keepAliveModuleName.split('.')[2];
    //   removeSessionObject(openedMenuListId);
    // });
    
    state.openedMenuLists = [];
    state.keepAliveLists = [];
    state.activeTab = {};
    router.push('/');
    window.sessionStorage.removeItem('customizeMessage');
    window.sessionStorage.removeItem('routeMapRecordForHideBackButton');
    window.sessionStorage.removeItem('addRouteToEditor');
    window.sessionStorage.removeItem('routeMapRecord');
    window.sessionStorage.removeItem('routeMapRecordForSingleObject');
    window.sessionStorage.removeItem('routeMapRecordForCustomizePage');
    // 清空updataTreeId
    removeSessionObject('TreeId');
  },
  againClickOpenedMenuLists(state, {
    label,
    keepAliveModuleName,
    type,
    itemId,
    fullPath
  }) {
    state.openedMenuLists.forEach((d) => {
      d.isActive = false;
      let keepAliveModuleNameRes = '';

      if (type === 'C') {
        // const index = keepAliveModuleName.lastIndexOf('.');  
        keepAliveModuleNameRes = keepAliveModuleName.split('.')[1];
      } 
      // d.label === label &&
      // 去除对label的限制，自定义配置，自定义标识相同，label不同，也可认为是同一个自定义界面
      if (enableActivateSameCustomizePage() && type === 'C') {
        if (d.keepAliveModuleName === keepAliveModuleName || (keepAliveModuleNameRes !== '' && d.keepAliveModuleName.includes(keepAliveModuleNameRes))) {
          d.isActive = true;
          d.keepAliveModuleName = keepAliveModuleName;
          d.itemId = itemId;
          d.routeFullPath = fullPath;
          this.commit('global/changeCurrentTabName', { keepAliveModuleName, label: label || state.keepAliveLabelMaps[keepAliveModuleName], customizedModuleName: keepAliveModuleNameRes });
        }
      } else if (d.keepAliveModuleName === keepAliveModuleName) {
        // d.label === label &&
        d.isActive = true;
      }
    });
  },
  tabCloseAppoint(state, tab) {
    if (tab.event && typeof (tab.event) === 'function') {
      tab.event();
    }
    // forbidden:禁止关闭当前tab时自动激活最后一个tab
    // tableName:'主表表明',
    // 关闭当前tab时,如果当前列表界面时树形结构列表界面，需清楚对应的treeID
    // const index = state.treeIds.indexOf(tab.tableName);
    // if (index > -1) {
    //   state.treeIds.splice(index, 1);
    // }
    // const data = {
    //   k: tab.tableName,
    //   v: item.ID
    // };


    // 清除配置界面提供给定制界面的参数信息
    // if (enableActivateSameCustomizePage()) {
    //   if (tab.keepAliveModuleName) {
    //     const customizedModuleName = tab.keepAliveModuleName.split('.')[1];
    //     deleteFromSessionObject('customizeMessage', customizedModuleName);// 定制界面
    //   }
    // } else {
    //   const customizedModuleId = tab.keepAliveModuleName.split('.')[2];
    //   deleteFromSessionObject('customizeMessage', customizedModuleId);// 定制界面
    // }


    // if (tab.keepAliveModuleName) {
    //   // const customizedModuleId = tab.keepAliveModuleName.split('.')[2];
    //   const customizedModuleName = tab.keepAliveModuleName.split('.')[1];
    //   deleteFromSessionObject('customizeMessage', customizedModuleName);// 定制界面
    //   // deleteFromSessionObject('customizeMessage', customizedModuleId);// 定制界面
    // }
    
    deleteFromSessionObject('customizeMessage', tab.tableName);// 外链界面


    // 清除当前关闭的表单设置的跳转到标准列表表单默认值;
    const { tableId } = router.currentRoute.params;
    removeSessionObject(tableId);


    deleteFromSessionObject('TreeId', tab.tableName);
    
    // window.sessionStorage.removeItem('dynamicRoutingIsBack');// 清除动态路由返回标记

    const tabRouteFullPath = tab.routeFullPath;
    // 删除规则一：关闭页签时，菜单跳转到单对象后新增保存跳转到编辑界面，清除session中存储的对应关系。
    const clickMenuAddSingleObjectData = getSeesionObject('clickMenuAddSingleObject');
    Object.values(clickMenuAddSingleObjectData).map((item) => {
      const routeFullPath = state.activeTab.routeFullPath;
      const resRouteFullPath = ` ${routeFullPath.substring(routeFullPath.indexOf('/') + 1, routeFullPath.lastIndexOf('/'))}/New`;
      if (routeFullPath.indexOf(item) !== -1) {
        const path = `/${resRouteFullPath}`.replace(/\s/g, '');
        deleteFromSessionObject('clickMenuAddSingleObject', path);
      }
    });
    // 删除规则二：关闭页签时，清除外键类型跳转的session中存储的对应关系。
    const routeMapRecordForHideBackButtonData = getSeesionObject('routeMapRecordForHideBackButton');
    Object.keys(routeMapRecordForHideBackButtonData).map((item) => {
      if (enableOpenNewTab()) { // 打补丁处理同表tab新开，外键跳转到单对象，再由单对象列表重新打开此单对象时，动态路由维护的关系未清除，导致关闭当前界面，再重新打开此明细时，不显示返回按钮
        if (item === tab.routeFullPath) {
          deleteFromSessionObject('routeMapRecordForHideBackButton', item);
        }
      }
      const routeFullPath = state.activeTab.routeFullPath;
      const index = routeFullPath.lastIndexOf('/');
      const routeFullPathRes = routeFullPath.substring(0, index + 1);
      if (item.includes(routeFullPathRes)) { //
        // 外键跳转与单对象跳转同一个单对象界面时，外键逻辑为不显示返回按钮，自定义跳转为返回到来源自定义界面，点击返回时，应清除对应的外键关系
        deleteFromSessionObject('routeMapRecordForHideBackButton', item);
        // window.sessionStorage.setItem('ignore', true);
      }
    });
    // 删除规则三：关闭页签时，清除动态路由跳转类型跳转的session中存储的对应关系。
    const isDynamicRouting = Boolean(window.sessionStorage.getItem('dynamicRoutingIsBack'));// 动态路由跳转的单对象界面返回列表界面标记
    const routeMapRecord = getSeesionObject('routeMapRecord');
    if (!isDynamicRouting) { // 非动态路由返回之前的关闭tab需清除routeMapRecord对应关系，动态路由返回的routeMapRecord对应关系在返回监听时刷新接口之后清除
      Object.keys(routeMapRecord).map((item) => {
        const dynamicRoutingIsBackForDeleteValue = getSeesionObject('dynamicRoutingIsBackForDelete');
        if (dynamicRoutingIsBackForDeleteValue.keepAliveModuleName === item) {
          deleteFromSessionObject('routeMapRecord', dynamicRoutingIsBackForDeleteValue.keepAliveModuleName);
        }
      });
    }
    if (enableOpenNewTab()) { // 打补丁处理同表tab新开，外键跳转到单对象，再由单对象列表重新打开此单对象时，动态路由维护的关系未清除，导致关闭当前界面，再重新打开此明细时，不显示返回按钮
      if (!isDynamicRouting) { // 非动态路由返回之前的关闭tab需清除routeMapRecord对应关系，动态路由返回的routeMapRecord对应关系在返回监听时刷新接口之后清除
        Object.keys(routeMapRecord).map((item) => {
          if (item === tab.keepAliveModuleName) {
            deleteFromSessionObject('routeMapRecord', item);
          }
        });
      }
    }
    // 删除规则五： 如果来源为插件界面，关闭当前tab时，应清除dynamicRoutingIsBack标记，以及dynamicRoutingIsBackForDelete内存储的当前表的关系
    // Object.keys(routeMapRecord).map((item) => {
    //   const fromPath = routeMapRecord[item].substring(1, 7) === 'PLUGIN';
    //   if (fromPath) {
    //     debugger;

    //     deleteFromSessionObject('routeMapRecord', item);
    //   }
    // });

    // 删除规则四：关闭页签时，清除单对象动态路由跳转类型跳转的session中存储的对应关系。
    const routeMapRecordForSingleObject = getSeesionObject('routeMapRecordForSingleObject');
    Object.keys(routeMapRecordForSingleObject).map((item) => {
      if (tabRouteFullPath === item) {
        deleteFromSessionObject('routeMapRecordForSingleObject', tabRouteFullPath);
      }
    });

    // 删除规则六： 关闭页签时，清除定制界面跳转单对象界面session中存储的对应关系
    const routeMapRecordForCustomizePage = getSeesionObject('routeMapRecordForCustomizePage');
    Object.keys(routeMapRecordForCustomizePage).map((item) => {
      const index = tab.routeFullPath.lastIndexOf('\/');  
      const tabPath = tab.routeFullPath.substring(0, index + 1);
      if (item.includes(tabPath)) {
        deleteFromSessionObject('routeMapRecordForCustomizePage', item);
      }
    });
    // state.isRequest = [];// 清空修改数据验证
    const { openedMenuLists } = state;
    // 如果关闭某个Tab，则清空所有该模块可能的对应的keepAlive信息。
    // state.keepAliveLists = state.keepAliveLists.filter((d) => {
    //   debugger;
    //   if ((d.indexOf(tab.tableName) !== -1 && d.indexOf(tab.itemId) !== -1) && enableOpenNewTab()) {
    //     if (tab.routePrefix !== '/LINK') { // 除外链界面，外链界面keepAliveName不包含linkId,无法匹配出id进行判断
    //     // 返回当前keepAliveLists不包含要关闭的tab对应的keepAliveName,
    //       return d;
    //     } 
    //   } if (d.indexOf(tab.tableName) === -1) {//不满足删除条件
    //     return d;
    //   }
    // });
    // const index = state.keepAliveLists.indexOf(tab.tableName);
    // if()
  
    state.keepAliveLists.map((k, i) => {
      const typeKeepAlive = k.split('.')[0];
      let itemId = null;
      let tableName = null;
      let currentType = null;
      if (tab.routePrefix && tab.routePrefix.indexOf('/CUSTOMIZED') !== -1) {
        itemId = k.split('.')[2];
      } else {
        itemId = k.split('.')[3];
        tableName = k.split('.')[1];
        if (tab.keepAliveModuleName) {
          currentType = tab.keepAliveModuleName[0];
        }
      } 
      const filtrate = () => {
        if ((tab.routePrefix === '/SYSTEM/TABLE' || tab.routePrefix === '/LINK') && (typeKeepAlive === 'S' || typeKeepAlive === 'L') && k.indexOf(tab.tableName) !== -1) { // 当前删除的是列表界面,外链界面因为路由无携带linId，和列表界面保持一致
          state.keepAliveLists.splice(i, 1);
        } else if (tab.routePrefix.indexOf('/SYSTEM/TABLE_DETAIL/V') !== -1 && typeKeepAlive === currentType && tab.itemId === itemId && tab.tableName === tableName) { // 单对象,判断要关闭的keepAlive的类型，在数组中找到这个类型的数据，找到相同明细ID进行删除
          state.keepAliveLists.splice(i, 1);
        } else if (tab.routePrefix.indexOf('/SYSTEM/TABLE_DETAIL/H') !== -1 && typeKeepAlive === currentType && tab.itemId === itemId && tab.tableName === tableName) { // 单对象,判断要关闭的keepAlive的类型，在数组中找到这个类型的数据，找到相同明细ID进行删除
          state.keepAliveLists.splice(i, 1);
        } else if (tab.routePrefix.indexOf('/CUSTOMIZED') !== -1 && (typeKeepAlive === tab.keepAliveModuleName.split('.')[0]) && tab.itemId === itemId) {
          state.keepAliveLists.splice(i, 1);
        }
      };

      if (!enableActivateSameCustomizePage() && tab.routePrefix && enableOpenNewTab()) { // 自定义界面根据itemId不同，开启多个tab页签
        filtrate();
      } else if (enableOpenNewTab()) {
        filtrate();
      } else if (k.indexOf(tab.tableName) !== -1) { // 列表打开本表单对象界面，关闭时，根据表明清除列表以及列表对应的单对象keepAlive
        state.keepAliveLists.splice(i, 1);
      }
    });
    // if (index > -1) {
    //   state.keepAliveLists.splice(index, 1);
    // }
    openedMenuLists.forEach((item, index) => {
      let samePath = false;
      if (enableOpenNewTab()) {
        if (`${item.routeFullPath}?isBack=true` === tabRouteFullPath || `${tabRouteFullPath}?isBack=true` === item.routeFullPath || item.routeFullPath === tabRouteFullPath) {
          samePath = true;
        }
      } else if (item.routeFullPath === tabRouteFullPath) {
        samePath = true;
      }
      
      if (tab.stopRouterPush) { // 关闭当前tab时不进行路由跳转
        const { tableName } = router.currentRoute.params;
        if (item.tableName === tableName) {
          state.activeTab = openedMenuLists[index];
        }
        if (item.routeFullPath === tabRouteFullPath) {
          openedMenuLists.splice(index, 1);
        }
      } else if (samePath) {
        openedMenuLists.splice(index, 1);
        if (tabRouteFullPath && !tab.forbidden) {
          if (openedMenuLists.length > 0) {
            if (index === 0) {
              state.activeTab = openedMenuLists[index]; // 关闭当前tab时始终打开的是最后一个tab
            } else {
              state.activeTab = openedMenuLists[index - 1]; // 关闭当前tab时始终打开的是最后一个tab
            }
            router.push({
              path: state.activeTab.routeFullPath,
            });
          } else {
            router.push('/');
          }
        }
      }
    });
  }, // 关闭当前tab
  tabHref(state, {// 当前tab更换路由
    back, type, tableName, tableId, id, label, serviceId
  }) {
    // back:返回标志, 
    // type:跳转类型,
    // tableName:主表表名,
    // tableId:主表ID,
    // id:明细ID,
    // label:显示名称, 
    // gateWay:网关
    const keepAliveModuleName = `S.${tableName}.${tableId}`;
    if (state.keepAliveLabelMaps[keepAliveModuleName] === undefined) {
      state.keepAliveLabelMaps[keepAliveModuleName] = `${label}`;
      state.serviceIdMap[tableName] = `${serviceId}`;
      const keepAliveLabelMapsObj = {
        k: keepAliveModuleName,
        v: label
      };
      updateSessionObject('keepAliveLabelMaps', keepAliveLabelMapsObj);// keepAliveLabel因刷新后来源信息消失，存入session
    }
    // if (state.serviceIdMap[tableName] === undefined) {
    //   const serviceIdMapObj = {
    //     k: tableName,
    //     v: serviceId
    //   };
    //   updateSessionObject('serviceIdMap', serviceIdMapObj);// serviceId因刷新后来源信息消失，存入session
    // }
    let path = '';
    if (type === 'tableDetailHorizontal') {
      path = `${HORIZONTAL_TABLE_DETAIL_PREFIX}/${tableName}/${tableId}/${id}`;
     
      router.push({ path });
    }
    if (type === 'tableDetailVertical') {
      path = `${VERTICAL_TABLE_DETAIL_PREFIX}/${tableName}/${tableId}/${id}`;
      router.push({ path });
    }
    if (back) {
      path = `${STANDARD_TABLE_LIST_PREFIX}/${tableName}/${tableId}`;
      const query = {
        isBack: true
      };
      state.treeTableListData.map((item) => { // 支持树结构列表界面单对象返回列表
        if (item.value === tableName && item.id === Number(tableId)) {
          query.isTreeTable = true;
        }
      });
      const routeInfo = {
        path,
        query
      };
  
      router.push(routeInfo);
    }
  },
  tabOpen(state, {// 打开一个新tab添加路由
    back, type, tableName, tableId, id, customizedModuleName, customizedModuleId, linkName,
    linkId, url, label, serviceId, dynamicRoutingForCustomizePage, isSetQuery, queryData, NToUpperCase,
  }) {
    // back:返回标志, 
    // type:跳转类型,
    // tableName:主表表名,
    // tableId:主表ID,
    // id:明细ID,
    // serviceId:网关,
    // customizedModuleName:自定义界面组件名称
    // customizedModuleId:自定义界面ID，
    // linkName:外链界面名称，
    // linkId:外链界面ID,
    // label：中文tab名称，
    // url:固定格式url（按照框架路由规则拼接好的）,
    // serviceId
    // dynamicRoutingForCustomizePage:自定义界面跳转至单对象界面，为true时可返回来源的单对象界面
    // isSetQuery:可设置目标界面为标准列表界面的表单默认值
    // queryData：设置目标界面表单默认值数据,
    // NToUpperCase:url不转大写,
    if ((type === 'S' || type === 'STANDARD_TABLE_LIST_PREFIX') && isSetQuery && queryData) {
      if (queryData.values && queryData.values.length > 0) {
        let flag = true;
        queryData.values.some((item) => {
          if (item.display === 'OBJ_FK' && !item.refobjid) {
            const message = `设置默认值为外键类型，请配置默认值为${item.defaultValue}字段的refobjid值`;
            window.R3message({
              title: '错误',
              content: message,
              mask: true
            });
            flag = false;
          }
        });
        if (!flag) {
          return;
        }
        window.sessionStorage.setItem(tableId, JSON.stringify(queryData.values));// 将设置的默认参数存入sessionStorage
      }
    }
    const keepAliveModuleName = `S.${tableName}.${tableId}`;
    if (state.keepAliveLabelMaps[keepAliveModuleName] === undefined) {
      if (label) {
        state.keepAliveLabelMaps[keepAliveModuleName] = `${label}`;
      }
      if (serviceId) {
        state.serviceIdMap[tableName] = `${serviceId}`;
      }
      const keepAliveLabelMapsObj = {
        k: keepAliveModuleName,
        v: label
      };
     
      updateSessionObject('keepAliveLabelMaps', keepAliveLabelMapsObj);// keepAliveLabel因刷新后来源信息消失，存入session
    }
    // if (state.serviceIdMap[tableName] === undefined) {
    //   const serviceIdMapObj = {
    //     k: tableName,
    //     v: serviceId
    //   };
    //   updateSessionObject('serviceIdMap', serviceIdMapObj);// serviceId因刷新后来源信息消失，存入session
    // }
    let path = '';
    if (type === STANDARD_TABLE_LIST_PREFIX || type === 'S') {
      if (url) {
        path = `${url.toUpperCase()}`;
      } else {
        path = `${STANDARD_TABLE_LIST_PREFIX}/${tableName}/${tableId}`;
      }
    } 
    if (type === 'tableDetailHorizontal' || type === 'H') {
      if (dynamicRoutingForCustomizePage) {
        window.sessionStorage.setItem('dynamicRoutingForCustomizePage', true);
      }

      if (url) {
        path = `${url.toUpperCase()}`;
      } else {
        path = `${HORIZONTAL_TABLE_DETAIL_PREFIX}/${tableName}/${tableId}/${id}`;
      }
    } 
    if (type === 'tableDetailVertical' || type === 'V') {
      if (dynamicRoutingForCustomizePage) {
        window.sessionStorage.setItem('dynamicRoutingForCustomizePage', true);
      }
      if (url) {
        path = `${url.toUpperCase()}`;
      } else {
        path = `${VERTICAL_TABLE_DETAIL_PREFIX}/${tableName}/${tableId}/${id}`;
      }
    }
    if (type === 'tableDetailAction' || type === 'C') {
      if (url) {
        if (url.includes('?')) {
          // 以下逻辑为处理，传入的url中包含路由参数时，不改变参数部分，将基础路由信息转为大写
          const urlRes = url.substring(url.indexOf('?'), 0);// 获取？之前路由信息，
          const urlToUpperCase = urlRes.toUpperCase();// 将基础路由信息转大写
          const urlNew = url.replace(urlRes, urlToUpperCase);// 替换原路由基础路由部分为转大写之后的字符
          path = urlNew;
          if (label) {
            customizedModuleName = urlToUpperCase.split('/')[2];
            customizedModuleId = urlToUpperCase.split('/')[3];
          }
        } else {
          path = `${url.toUpperCase()}`;
          if (label) {
            customizedModuleName = path.split('/')[2];
            customizedModuleId = path.split('/')[3];
          }
        }
      } else {
        path = `${CUSTOMIZED_MODULE_PREFIX}/${customizedModuleName.toUpperCase()}/${customizedModuleId}`;
      }
      if (label) {
        const data = {
          customizedModuleName,
          customizedModuleId,
          label
        };
        setCustomeLabel(data);
      }
    } 
    if (type === 'P') {
      if (url) {
        path = `${url.toUpperCase()}`;
      }
    } 
    if (type === 'tableDetailUrl' || type === 'URL') {
      if (url) {
        path = `${url.toUpperCase()}`;
      } else {
        path = `${LINK_MODULE_PREFIX}/${linkName.toUpperCase()}/${linkId}`;
      }
    }
    if (back) {
      const routeMapRecordForCustomizePage = getSeesionObject('routeMapRecordForCustomizePage');
     
      if (routeMapRecordForCustomizePage[router.currentRoute.fullPath]) {
        const CustomizePagePath = routeMapRecordForCustomizePage[router.currentRoute.fullPath];
        Object.keys(routeMapRecordForCustomizePage).map((item) => {
          if (router.currentRoute.fullPath === item) {
            deleteFromSessionObject('routeMapRecordForCustomizePage', router.currentRoute.fullPath);
          }
        });
      
        // const flag = state.openedMenuLists.filter((d, i) => { // 判断单对象界面要返回来源定制界面是否在前一个
        //   if (d.tableName === router.currentRoute.params.tableName) {
        //     d.index = i;
        //     if (i !== 0 && state.openedMenuLists[i - 1].routeFullPath === CustomizePagePath) { // 当自定义及界面要跳转的单对象界面位置不是第一个时
        //       return true;
        //     }
        //   }
        //   return false;
        // })[0];
        const dom = document.querySelector(`#${router.currentRoute.params.tableName}_TAB`);
        dom.click();
        // if (state.openedMenuLists.length > 1) { // 框架路由tab逻辑为刷新浏览器保留最后一个打开的tab页签，则关闭当前会自动激活前一个
        router.push(CustomizePagePath);
        // }
        
        // state.openedMenuLists.map((menu) => {
        //   if (menu.routeFullPath === CustomizePagePath) {
        //     menu.isActive = true;
        //     state.activeTab = menu;
        //     // setTimeout(() => {
        //     //   state.openedMenuLists.splice(index, 1);
        //     //   console.log(3, state.openedMenuLists);
        //     // }, 500);
        //   }
        // });
      } else {
        if (url) {
          if (!NToUpperCase) {
            path = `${url.toUpperCase()}`;
          } else {
            path = url;
          }
        } else {
          path = `${STANDARD_TABLE_LIST_PREFIX}/${tableName}/${tableId}`;
        }
        const query = {
          isBack: true
        };
        state.treeTableListData.map((item) => { // 支持树结构列表界面单对象返回列表
          if (item.value === tableName && item.id === Number(tableId)) {
            query.isTreeTable = true;
          }
        });
        const routeInfo = {
          path,
          query
        };
        router.push(routeInfo);
      }
      return;
    }
    if (path) {
      router.push({
        path
      });
    }
  },
  updataUserInfoMessage(state, { userInfo }) {
    state.userInfo = userInfo;
  },
  switchTabForActiveTab(state, tab) {
    state.activeTab = {
      isActive: tab.isActive,
      keepAliveModuleName: tab.keepAliveModuleName,
      label: tab.label,
      routeFullPath: tab.routeFullPath,
      routePrefix: tab.routePrefix,
      tableName: tab.tableName,
    };
  },
  copyDataForSingleObject(state, { copyData }) {
    state.copyDatas = copyData;
  },
  copyModifyDataForSingleObject(state, modifyData) {
    state.modifyData = modifyData;
  },
  setLayout(state, data) {
    state.showModule = {
      HistoryAndFavorite: data, // 隐藏收藏夹
      TabLists: data, // 隐藏tab栏
      Navigator: data, // 隐藏菜单栏
    };
    if (data === false) {
      // const dom = document.getElementById('content');
      // const doc = dom.style.padding = '0px';
      // const domForMargin = dom.parentNode.parentNode.style.margin = '0px';
    }
  },
  addKeepAliveLabelMaps(state, { name, label }) {
    // name：C.AAO_SR_TEST.2326模块名称
    // label：中文名
    state.keepAliveLabelMaps[name] = `${label}`;
    const keepAliveLabelMapsObj = {
      k: name,
      v: label
    };
    updateSessionObject('keepAliveLabelMaps', keepAliveLabelMapsObj);// keepAliveLabel因刷新后来源信息消失，存入session
    state.keepAliveLabelMaps = Object.assign({}, state.keepAliveLabelMaps, getSeesionObject('keepAliveLabelMaps'));
  },
  addServiceIdMap(state, { tableName, gateWay }) {
    // state.serviceIdMap[tableName] = `${gateWay}`;
  },

  // isRequestUpdata(state, { tabPanel, index }) {
  //   let arr = [];
  //   arr = tabPanel.map(item => item.isRequest);
  //   if (index === 0) {
  //     arr[0] = true;
  //   }
  //   arr[index] = true;
  //   const oldRequestData = state.isRequest;
  //   if (oldRequestData.length > 0) {
  //     arr.forEach((a, i) => {
  //       if (arr[i] !== true) {
  //         arr[i] = oldRequestData[i];
  //       }
  //     }); 
  //   }
  //   state.isRequest = arr;
  // },
  // emptyTestData(state) { // 清空TestData
  //   state.isRequest = [];
  // },
  updateModifySearchFoldnum(state, data) {
    state.changeSearchFoldnum = data;
  },
  updateFavoriteData(state, data) { // 收藏
    state.favorite = data.data;
  },
  updateCustomizeMessage(state, data) { 
    // type:类型
    // value:更新的值
    // type='customerurl', // 列表界面链接型字段配置objdistype === 'customized'，配置在customerurl.refobjid的字段，解析的值
    // 不同的跳转方式应存到不同的类型中
    // state.customizeMessage[data.customizedModuleId] = {
    //   [data.type]: data.value
    // };
    // state.customizeMessage.push({
    //   [data.customizedModuleId]: {
    //     [data.type]: data.value
    //   }
    // });

    const obj = {
      k: data.customizedModuleId ? data.customizedModuleId : data.customizedModuleName,
      v: { [data.type]: data.value }
    };
    updateSessionObject('customizeMessage', obj);
  },

  updateImage(state, data) { // 修改框架的配置图片
    if (data) {
      const images = {
        logoImg: data.enterpriseLogo ? data.enterpriseLogo : state.imgSrc.logoImg,
        bannerImg: data.enterpriseBanner ? data.enterpriseBanner : state.imgSrc.bannerImg,
        closedImg: data.collapseImg ? data.collapseImg : state.imgSrc.closedImg,
        openedImg: data.expandImg ? data.expandImg : state.imgSrc.openedImg,
        bigDataImg: data.bigDataImg ? data.bigDataImg : state.imgSrc.bigDataImg
      };
      state.imgSrc = Object.assign(state.imgSrc, images);
    }
  },
  updatePreviewPicture(state, data) {
    state.previewPictureInstance = data;
  }
};

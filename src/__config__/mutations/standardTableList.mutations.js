import { STANDARD_TABLE_COMPONENT_PREFIX } from '../../constants/global';

export default {
  updateTableData({
    ag
  }, data) {
    ag.datas = data;
  },
  updateTableStatus4css({
    ag
  }, data) {
    ag.status4css = data;
  },

  // 表单
  updateDefaultFormItemsLists({ formItems }, data) {
    formItems.defaultFormItemsLists = data;
  },
  updateFormData({
    formItems
  }, data) {
    formItems.data = data;
  },

  // 按钮组
  updateButtonsTabcmd({
    buttons
  }, data) {
    buttons.tabcmd = data;
  },
  updateButtonWaListButtons({
    buttons
  }, data) {
    buttons.dataArray.waListButtonsConfig.waListButtons = data;
    const currentModuleName = this.state.global.activeTab.keepAliveModuleName;
    let favorite = this.state.global.favorite;
    favorite = favorite.map(item => `${STANDARD_TABLE_COMPONENT_PREFIX}.${item.value}.${item.id}`);
    if (favorite.filter(d => d === currentModuleName).length > 0) {
      buttons.dataArray.collectiImg = true;
    }
  },
  updateDefaultButtonsdatas({
    buttons
  }, data) {
    buttons.isBig = data.isbig; // 是否为海量表
    buttons.isSolr = data.isolr; // 是否获取合计
    buttons.showBigDefaultIcon = data.isbig;
    buttons.tabledesc = buttons.tabcmd.desc;
    buttons.tableId = data.tableid;
    buttons.tableName = data.table;
    // 双击条状判断
    buttons.objTableUrl = data.tableurl;
  },
  setActiveTabActionValue({
    buttons
  }, obj) {
    buttons.activeTabAction = obj;
  },
  updateButtonExeActionData({ buttons }, data) {
    buttons.ExeActionData = data;
  },
  updateButtonGetActionData({ buttons }, data) {
    buttons.ExeActionData = data;
  },
  collectTablelist({ buttons }) {
    // buttons.dataArray.collectiImg = !buttons.dataArray.collectiImg;
  },
  updateButtonSetFavoriteData({ buttons }, data) {
    if (data.code === 0) {
      // if(type==="addRemoveFavorite"){

      // }
      buttons.dataArray.collectiImg = !buttons.dataArray.collectiImg;

      this.state.favorite = data.data;
    }
  },
  // updateButtonRemoveFavoriteData({ buttons }, data) {
  //   if (data.code === 0) {
  //     this.state.favorite = data.data;
  //   }
  // },
  // setQueryForButtons({
  //   buttons
  // }, { tableName, tableId }) {
  //   buttons.tableId = tableId;
  //   buttons.tableName = tableName;
  // },
  updateDefaultButtonGroupData({ buttons }, data) {
    buttons.dataArray.buttonGroupShowConfig.buttonGroupShow = data;
  },
  onSelectionChangedAssignment({ buttons }, { rowIdArray, rowArray }) {
    buttons.selectIdArr = rowIdArray;
    buttons.selectArr = rowArray;
  },
  deleteTableData({ ag, buttons }) {
    // ag.selectIdArr.forEach((item, index) => {
    //   if (_self.sysmentArr.indexOf(item) >= 0) {
    //     _self.selectSysment.push(item);
    //   }
   
  },
  /**
   * 当前页跳转
   * @param state //
   * @param tab
   * {
   *    back: 是否为返回
   *    id
   *    type: '' 类型: table, singleView, singleObject, action, rpt...
   *    name: '' 文件名称: tablename(表名), 配置文件名
   *    label: '' tab 名称
   *    query:{} url search
   * }
   * @constructor
   */
  TabHref(state, tab) {
    // 清除keep-alive
    const excludedComponents = this.state.global.excludedComponents;

    if (!tab.back) {
      const component = `${tab.type}.${tab.name}.${tab.id}`;
      if (excludedComponents.indexOf(component) < 0) {
        excludedComponents.push(component);
      }
    }
    // 判断是否是新增
    if ((tab.type === 'singleView' || tab.type === 'singleObject') && tab.id === -1) {
      const component = `${tab.type}.${tab.name}.${tab.query.pid}`;

      if (excludedComponents.indexOf(component) < 0) {
        excludedComponents.push(component);
      }
    }

    if (!tab.url) {
      tab.url = '';
      // 特殊处理单对象路由
      if (tab.type === 'singleView' || tab.type === 'singleObject') {
        tab.url = `${tab.type}/${tab.type}`;
      } else {
        tab.url = `${tab.type}/${tab.name}`;
      }
    }
    if (tab.url.indexOf('?') < 0) {
      tab.url += '?';
    }
    // 将query拼接url
    const param = [];
    if (tab.query) {
      for (const q in tab.query) {
        if (tab.query.hasOwnProperty(q)) {
          param.push(`${q}=${tab.query[q]}`);
        }
      }
    } else if (tab.url.indexOf('id=') < 0) {
      // 如果没有query,只需要拼接id
      param.push(`id=${tab.id}`);
    }
    // 判断url是否已经有条件值
    if (tab.url.indexOf('=') > 0 && param.length > 0) {
      tab.url += '&';
    }
    tab.url += param.join('&');

    // 判断前缀 /m 或 /iframe


    // const front = window.appInstance.$route.path.split('/')[1];
    // tab.path = `/${front}/${tab.url}`;

    // 移除当前tab
    const activeTab = state.activeTab;
    const selectTabs = this.state.global.openedMenuLists;

    // 判断原始链接来源,没有就赋值
    console.log('🌹', tab);
    if (!tab.orgTab) tab.orgTab = activeTab.orgTab;

    let has = false;


    let localHas = false;
    let localIndex; let
      activeIndex; // 已存在的序号
    // 循环,判断
    // 判断菜单是否已存在
    for (const index in selectTabs) {
      if (selectTabs[index].type === tab.type && selectTabs[index].name === tab.name && selectTabs[index].id == tab.id) {
        localIndex = index;
        localHas = true;
      }
    }
    for (const index in selectTabs) {
      if (selectTabs[index].type === activeTab.type && selectTabs[index].name === activeTab.name && selectTabs[index].id === activeTab.id) {
        activeIndex = index;
        if (localHas) {
        } else {
          state.selectedTabs[index] = tab; // 菜单替换
          has = true;
        }
        break;
      }
    }
    if (localHas) {
      state.activeTab = state.selectedTabs[localIndex];
      state.selectedTabs.splice(activeIndex, 1);
      route.push({
        path: tab.path,
      });
    } else {
      if (!has) state.selectedTabs.push(tab);
      state.activeTab = tab;
      route.push({
        path: tab.path,
      });
    }
    // 不管是否存在,都重新刷新列表
    vm.$nextTick(() => {
      // 如果是返回,且是列表,刷新
      if (tab.back && (tab.type === 'table' || tab.type === 'action')) {
        const components = vm.$children[0].$children[0].$children[3].$children[0].$children;
        components.forEach((item) => {
          if ((tab.type === 'table' && item.$vnode.data.ref === (`${tab.type}.${tab.name}.${tab.id}`))) {
            item.searchData('backfresh'); // 返回,列表界面刷新
          }
          if (tab.type === 'action' && item.$vnode.data.ref === (`${tab.type}.${tab.name}.${tab.id}`) && item.$refs.mytable) {
            item.searchData();
          }
        });
      }
    });
  },

};

import {
  STANDARD_TABLE_COMPONENT_PREFIX
} from '../../constants/global';
import router from '../router.config';

export default {
  changeSelectedPrimaryMenu(state, index) {
    state.primaryMenuIndex = index;
  },
  hideMenu(state) {
    state.primaryMenuIndex = -1;
  },
  doCollapseHistoryAndFavorite(state) {
    state.collapseHistoryAndFavorite = !state.collapseHistoryAndFavorite;
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
    state.keepAliveLabelMaps = JSON.parse(JSON.stringify(menuLists))
      .map(d => d.children)
      .reduce((a, c) => a.concat(c))
      .map(d => d.children)
      .reduce((a, c) => a.concat(c))
      .reduce((a, c) => {
        if (c.type === 'table') {
          a[`${STANDARD_TABLE_COMPONENT_PREFIX}.${c.value}.${c.id}`] = c.label;
        }
        return a;
      }, {});
  },
  increaseKeepAliveLists(state, name) {
    if (!state.keepAliveLists.includes(name)) {
      state.keepAliveLists = state.keepAliveLists.concat([name]);
    }
  },
  increaseOpenedMenuLists(state, {
    label,
    keepAliveModuleName,
    type,
    id,
    tableName,
    routeFullPath
  }) {
    if (state.openedMenuLists.filter(d => d.label === label && d.keepAliveModuleName === keepAliveModuleName).length === 0) {
      state.openedMenuLists.forEach((d) => {
        d.isActive = false;
      });
      state.openedMenuLists = state.openedMenuLists.concat([{
        label,
        keepAliveModuleName,
        routeFullPath,
        isActive: true,
      }]);
      state.activeTab = {
        id,
        isActive: true,
        keepAliveModuleName,
        label,
        routeFullPath,
        tableName,
        type,
      };
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
    state.openedMenuLists = [];
    state.keepAliveLists = [];
  },
  againClickOpenedMenuLists(state, {
    label,
    keepAliveModuleName
  }) {
    state.openedMenuLists.forEach((d) => {
      d.isActive = false;
      if (d.label === label && d.keepAliveModuleName === keepAliveModuleName) {
        d.isActive = true;
      }
    });
  }, // 清除当前tab的keepAlive
  TabCloseAppoint(state, tab) {
    const selectTabs = state.openedMenuLists;
    const tabRouteFullPath = tab.routeFullPath;
    selectTabs.forEach((item, index) => {
      if (tabRouteFullPath) {
        if (selectTabs) {
          const lastLength = selectTabs.length - 1;
          state.activeTab = selectTabs[lastLength]; // 关闭当前tab时始终打开的是最后一个tab
          Object.assign(state.activeTab, {
            isActive: true
          });
          router.push({
            path: state.activeTab.routeFullPath,
          });
        }
      }
      if (item.routeFullPath === tab.routeFullPath) {
        selectTabs.splice(index, 1);
      }
    });
    if (selectTabs < 1) { // 判断当关闭全部tab页时清空路由
      state.activeTab = {
        isActive: false,
        keepAliveModuleName: '',
        label: '',
      };
      state.openedMenuLists = [];
      router.push('/');
    }
  }, // 关闭当前tab
  switchActiveTab(state, tab) {
    const openedMenuLists = state.openedMenuLists;
    openedMenuLists.forEach((element, index) => {
      element.isActive = false;
      if (openedMenuLists[index].keepAliveModuleName === tab.keepAliveModuleName) {
        state.activeTab = state.openedMenuLists[index];
      }
    });
    state.activeTab.isActive = true;
    if (tab.type === 'singleView' || tab.type === 'singleObject') {
      const component = tab.routeFullPath;
      const index = state.excludedComponents.indexOf(component);
      if (index > -1) {
        state.excludedComponents.splice(index, 1);
      }
    }
  },
  TabHref(state, tab) {
    // debugger;
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
      Object.keys(tab.query).reduce((obj, item) => {
        if (tab.query[item]) {
          obj[item] = tab.query[item];
          param.push(`${item}=${obj[item]}`);
        }
        return obj;
      }, []);
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
    const front = this.state.global.activeTab.routeFullPath.split('/')[1];
    tab.routeFullPath = `/${front}/${tab.url}`;

    // 移除当前tab
    const activeTab = state.activeTab;
    const selectTabs = state.openedMenuLists;

    // 判断原始链接来源,没有就赋值
    if (!tab.orgTab) tab.orgTab = activeTab.orgTab;
    let has = false;
    let localHas = false;
    let localIndex;
    let activeIndex; // 已存在的序号
    // 循环,判断
    // 判断菜单是否已存在
    selectTabs.forEach((item, index) => {
      const type = item.routeFullPath.split('/')[2];
      const name = item.routeFullPath.split('/')[3];
      const id = item.routeFullPath.split('/')[4];
      if (type === tab.type && name === tab.name && id === tab.id) { // 判断是否存在当前tab
        localIndex = index;
        localHas = true;
      }
      if (type === activeTab.type && name === activeTab.tableName && id === activeTab.id) { // 判断是否是当前tab
        activeIndex = index;
        if (!localHas) {
          state.openedMenuLists[activeIndex] = tab; // 菜单替换
          has = true;
        }
      }
    });
  
    if (localHas) {
      state.activeTab = state.openedMenuLists[localIndex];
      state.openedMenuLists.splice(activeIndex, 1);
      router.push({
        path: tab.routeFullPath,
      });
    } else {
      if (!has) state.openedMenuLists.push(tab);
      state.activeTab = tab;
      router.push({
        path: tab.routeFullPath,
      });
    }
    // 不管是否存在,都重新刷新列表
    this._vm.$nextTick(() => {
      // 如果是返回,且是列表,刷新
      if (tab.back && (tab.type === 'table' || tab.type === 'action')) {
        const components = this._vm.$children[0].$children[0].$children[3].$children[0].$children;
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

// 此loading专为表单而设计，不可用于除单对象和标准列表界面的其它地方
import store from '../__config__/store.config';
import router from '../__config__/router.config';

const Loading = {};

// 避免重复install，设立flag

Loading.installed = false;

Loading.install = (Vue) => {
  if (Loading.installed) return;
  Vue.prototype.$R3loading = {};

  Vue.prototype.$R3loading.show = (moduleName) => {
    // 如果页面有loading则不继续执行
    // const currentTableName = tableName || router.currentRoute.params.tableName;

    const doms = document.querySelector(`#${moduleName}-loading`);
    if (doms) return;

    // 1、创建构造器，定义loading模板
    const LoadingTip = Vue.extend({
      template: `
                  <div  class="vue-loading">
                     <div class="R3-Loading loader "></div>
                  </div>`,
    });

    // // 2、创建实例
    const tpl = new LoadingTip().$mount().$el;
    if (tpl) {
      tpl.setAttribute('id', `${moduleName}-loading`);
    }

    // 3、如何传入模块和当前页面模块相同，则把创建的实例添加到容器中
    const dom = document.querySelector(
      `#${router.currentRoute.params.tableName || router.currentRoute.params.customizedModuleName}`
    );
    const currentModuleName = router.currentRoute.meta.moduleName.replace(
      /\./g,
      '-'
    );
    if (dom && currentModuleName === moduleName) {
      dom.appendChild(tpl);
    }

    // 阻止遮罩滑动
    // document.querySelector(`#${currentTableName}-loading`).addEventListener('touchmove', (e) => {
    //   e.stopPropagation();

    //   e.preventDefault();
    // });
    Loading.installed = true;
  };

  Vue.prototype.$R3loading.hide = (moduleName) => {
    const currentLoading = store.state.global.currentLoading;

    if (moduleName) {
      store.commit('global/updataLoading', moduleName);
      const tpl = document.querySelector(`#${moduleName}-loading`);

      if (tpl) {
        // 需要有dom节点才能删除，否则无法确认激活的是正在loading的表，此时会在actived周期内关闭当前loading,清除标记
        if (currentLoading.includes(moduleName)) {
          tpl.remove();
          store.commit('global/deleteLoading', moduleName);
        }
      }
    }

    // 防止接口还没请求完界面就关闭了。此时没有dom也需要清除标记
    const openedMenuLists = store.state.global.openedMenuLists.map(menu => menu.keepAliveModuleName.replace(/\./g, '-'));
    const unclosedModules = currentLoading.filter(
      flag => !openedMenuLists.includes(flag)
    );
    if (unclosedModules.length > 0) {
      unclosedModules.forEach((module) => {
        store.commit('global/deleteLoading', module);
      });
    }
  };
};

export default Loading;

import store from '../__config__/store.config';

const Loading = {};

// 避免重复install，设立flag

Loading.installed = false;

Loading.install = ((Vue) => { 
  if (Loading.installed) return;
  Vue.prototype.$loading = {};

  Vue.prototype.$loading.show = () => {
    // 如果页面有loading则不继续执行
    const currentTableName = store.state.global.activeTab.tableName;

    if (document.querySelector(currentTableName)) return;

    // 1、创建构造器，定义loading模板

    const LoadingTip = Vue.extend({

      template: `
                  <div  class="vue-loading">
                     <div class="R3-Loading loader "></div>
                  </div>`

    });

    // 2、创建实例，挂载到文档以后的地方
    const tpl = new LoadingTip().$mount().$el;
    tpl.setAttribute('id', `${currentTableName}-loading`);

    // 3、把创建的实例添加到容器中
    const dom = document.querySelector(`#${currentTableName}`);

    // dom.style = 'height: 100%; padding: 0px 15px; overflow: none; position: relative;';
    dom.appendChild(tpl);

    // 阻止遮罩滑动
    document.querySelector(`#${currentTableName}-loading`).addEventListener('touchmove', (e) => {
      e.stopPropagation();

      e.preventDefault();
    });
    Loading.installed = true;
  };

  Vue.prototype.$loading.hide = (tableName) => {
    const currentTableName = store.state.global.activeTab.tableName;
    store.commit('global/updataLoading', tableName);
    const tpl = document.querySelector(`#${currentTableName}-loading`);
    // dom.style = 'height: 100%; padding: 0px 15px; overflow: auto; position: relative;';
    if (tpl) {
      tpl.remove();
      store.commit('global/deleteLoading', currentTableName);
    }
  };
});
 

export default Loading;

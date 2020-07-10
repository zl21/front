// 此loading专为表单而设计，不可用于除单对象和标准列表界面的其它地方
import store from '../__config__/store.config';
import router from '../__config__/router.config';

const Loading = {};

// 避免重复install，设立flag

Loading.installed = false;

Loading.install = ((Vue) => { 
  if (Loading.installed) return;
  Vue.prototype.$loading = {};

  Vue.prototype.$loading.show = (tableName) => {
    // 如果页面有loading则不继续执行{
    const currentTableName = tableName || router.currentRoute.params.tableName;
    //   currentTableName = store.state.global.activeTab.tableName;
    const doms = document.querySelector(`#${currentTableName}-loading`);
    if (doms) return;

    // 1、创建构造器，定义loading模板

    const LoadingTip = Vue.extend({

      template: `
                  <div  class="vue-loading">
                     <div class="R3-Loading loader "></div>
                  </div>`

    });

    // // 2、创建实例
    const tpl = new LoadingTip().$mount().$el;
    // const tpl = document.createElement('div');
    // tpl.innerHTML = `
    // <div  class="vue-loading">
    //    <div class="R3-Loading loader "></div>
    // </div>`;
    tpl.setAttribute('id', `${currentTableName}-loading`);
    // tpl.setAttribute('class', 'vue-loading');


    // 3、把创建的实例添加到容器中
    const dom = document.querySelector(`#${currentTableName}`);

    // dom.style = 'height: 100%; padding: 0px 15px; overflow: none; position: relative;';
    dom.appendChild(tpl);

    // 阻止遮罩滑动
    // document.querySelector(`#${currentTableName}-loading`).addEventListener('touchmove', (e) => {
    //   e.stopPropagation();

    //   e.preventDefault();
    // });
    Loading.installed = true;
  };

  Vue.prototype.$loading.hide = (tableName) => {
    const currentLoading = store.state.global.currentLoading;
    const currentTableName = tableName || router.currentRoute.params.tableName;

    if (!currentLoading.includes(currentTableName)) { // 没有则添加
      store.commit('global/updataLoading', tableName);
    }
    const tpl = document.querySelector(`#${currentTableName}-loading`);
    if (tpl) { // 需要有dom节点才能删除，否则无法确认激活的是正在loading的表，此时会在actived周期内关闭当前loading,清除标记
      if (currentLoading.includes(currentTableName)) {
        tpl.remove();
        store.commit('global/deleteLoading', currentTableName);
      }
    }
  };
});
 

export default Loading;

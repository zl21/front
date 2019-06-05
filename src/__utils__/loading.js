import '../assets/css/loading.css';
 

const Loading = {};

// 避免重复install，设立flag

Loading.installed = false;

Loading.install = ((Vue) => { 
  if (Loading.installed) return;

  Vue.prototype.$loading = {};

  Vue.prototype.$loading.show = () => {
    // 如果页面有loading则不继续执行

    if (document.querySelector('#vue-loading')) return;

    // 1、创建构造器，定义loading模板

    const LoadingTip = Vue.extend({

      template: `
                  <div id="vue-loading">
                     <div class="loader"></div>
                  </div>`

    });

    // 2、创建实例，挂载到文档以后的地方

    const tpl = new LoadingTip().$mount().$el;
    // 3、把创建的实例添加到容器中
    const dom = document.getElementById('content');
    dom.appendChild(tpl);
    // 阻止遮罩滑动
    document.querySelector('#vue-loading').addEventListener('touchmove', (e) => {
      e.stopPropagation();

      e.preventDefault();
    });

    Loading.installed = true;
  };

  Vue.prototype.$loading.hide = () => {
    const tpl = document.querySelector('#vue-loading');
    const dom = document.getElementById('content');
    dom.removeChild(tpl);
  };
});
 

export default Loading;

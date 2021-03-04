import DialogComponent from '../__component__/Dialog.vue';

const Dialog = {
  install(Vue) {
    Vue.prototype.$R3Dialog = function init(options, okFn, cancelFn) {
      const domId = `r3-dialog-${options.dialogComponentName}`;
      const contentDom = document.querySelector(`#${domId}`);
      if (contentDom) {
        contentDom.remove();
      }

      const DialogConstructor = Vue.extend(DialogComponent);
      const instance = new DialogConstructor().$mount();
      const containerDom = document.createElement('div');
      containerDom.setAttribute('id', domId);
      containerDom.appendChild(instance.$el);
      document.body.appendChild(containerDom);

      if (options && typeof options === 'object') {
        Object.keys(options).forEach((key) => {
          instance[key] = options[key];
        });
      }
      if (typeof okFn === 'function') {
        instance.confirm = okFn;
      }
      if (typeof cancelFn === 'function') {
        instance.cancelFun = cancelFn;
      }
      instance.showModal = true;
    };
  }
};

export default Dialog;

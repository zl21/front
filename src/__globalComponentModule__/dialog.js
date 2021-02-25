import DialogComponent from '../__component__/Dialog.vue';

const Dialog = {
  install(Vue) {
    const DialogConstructor = Vue.extend(DialogComponent);
    const instance = new DialogConstructor();
    instance.$mount(document.createElement('div'));
    document.body.appendChild(instance.$el);

    Vue.prototype.$R3Dialog = function init(options, okFn, cancelFn) {
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

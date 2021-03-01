import Vue from 'vue';

Vue.mixin({
  created() {
    const Type = (function () {
      const Type = {};
      for (let i = 0, type; type = ['Undefined', 'Null', 'Boolean', 'Number', 'String', 'Function', 'Array', 'Object'][i++];) {
        (function (type) {
          Type[`is${type}`] = function (obj) {
            return Object.prototype.toString.call(obj) === `[object ${type}]`;
          };
        }(type));
      }
      return Type;
    }());
      
    this.$_live_type = Type;
      
    // use: this.$getChildComponent(vm, 'xx-xx')
    this.$_live_getChildComponent = function (vueInstance, componentTag) {
      let component = null;
      const allComp = getAllChildComp(vueInstance);
      
      const i = allComp.findIndex(vm => vm.$options._componentTag === componentTag);
      if (i !== -1) {
        component = allComp[i];
      }
      return component;
      
      function getAllChildComp(instance) {
        let allComp = []; let 
          child;
        if (Type.isObject(instance)) {
          child = instance.$children;
        } else if (Type.isArray(instance)) {
          child = instance;
        }
      
        for (let i = 0; i < child.length; i++) {
          allComp.push(child[i]);
          if (child[i].$children.length > 0) { // 还有孩子
            allComp = allComp.concat(getAllChildComp(child[i].$children));
          }
        }
        return allComp;
      }
    };
  }
});

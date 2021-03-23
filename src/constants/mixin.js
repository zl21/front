

// 注册
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
    // $_live_getChildComponent方法，用于根据组件tag查询组件
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

    // use this.$_live_completeRender('xx-xx')
    this.$_live_completeRender = function ( target ) {
      return new Promise((resolve,reject) => {
        // 获取当前tab组件实例
        let activeTab = this.activeTab
        let currentTab = this.$_live_getChildComponent(window.vm,activeTab.keepAliveModuleName)
        let source = this.$_live_getChildComponent(currentTab,`${activeTab.tableName}${target}`)
        let timer = setInterval(() => {
          if(source){
            clearInterval(timer)
            resolve(source)
          }
        })
        
      })
    }


  }
});
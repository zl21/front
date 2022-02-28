/**
 * name  类型 (是否是名称)
 * type  类型
 * $parent 继承的父级
 * $vm 当前的实例
 * Component 
 */
import Vue from 'vue';
class SetLayoutDirectionSlot {
    constructor($parent,$vm, name, type,Component) {
        this.$parent = $parent;
        this.$current = $vm;
        this.name = name;
        this.type = type;
        if(Component){
            // 传入的组件
            this.vm = Component;
        }
        let {
            layoutDirectionSlot
        } = window.ProjectConfig;
        if (layoutDirectionSlot && layoutDirectionSlot[name]) {
            // 针对当前表明
            if (layoutDirectionSlot[name].tableName) {
                let {
                    tableName
                } = $vm.$route.params;
                // 当前表明    
                let tableNameList = layoutDirectionSlot[name].tableName[tableName];
                if (tableNameList && tableNameList[type]) {
                    this.vm = tableNameList[type];
                }
            } else {
                // 针对全表
                if (layoutDirectionSlot[name] && layoutDirectionSlot[name][type]) {
                    this.vm = layoutDirectionSlot[name][type];
                }
            }
        }

    }
    async mounted(){
        // 重写实例的mounted
        let data  = {};
        if(typeof this.vm === 'object'){
            data = this.vm
        }else {
            data =  (await this.vm()).default;
        }
        let mounted =  data.mounted;
        if(this.name !=='panelForm'){
            data.created = function(){
                new GetParentVm(this.$parent,this).init();
            }


        }
        return data;



    }
    async init() {
        return this.mounted();
    }


}

/**
 * $parent  父级的vue 实例
 * $vm  当前返回的实例
 *  */
class GetParentVm{
  constructor($parent,$vm){
    this.$vm = $vm;  
    for (let key in $parent) {
        if (/^[a-zA-Z]/.test(key) && !(key in $vm)) {
            // 挂载父级别的数据及方法
            this.$vm[key] = $parent[key]
        }
      }
  }  
  init(){
      return this.$vm;
    
  }  

}
export {
    SetLayoutDirectionSlot,GetParentVm
}
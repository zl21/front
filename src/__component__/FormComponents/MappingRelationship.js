/** 处理表单字段联动的映射关系转换
 * @returns
 * @memberof MappingRelationship
 * 
 * @target 当前字段配置
 * @instance 当前组件实例
 */

export default class MappingRelationship{
  constructor(instance, target) {
    this.instance = instance;
    this.target = target;
  }

  /** 判断目标组件是否加载完成
   *
   *
   * @memberof componentLoaded
   */
  componentLoaded(){
    return new Promise((resolve,reject) => {
      // 获取当前tab组件实例
      let activeTab = this.instance.activeTab.keepAliveModuleName
      let currentTab = this.instance.$_live_getChildComponent(window.vm,activeTab)

      if(this.target.hidecolumn){
        console.log(currentTab)
        console.log(this.target)
      }
      resolve()
    })
  }
}


/** 处理单对象字段间的联动关系映射
 *  LinkageRelationships
 *  @param 表单数据  type： Array
 *  @return 重构后的数据 type: Array
 */

export default class LinkageRelationships{
  constructor(formItems) {
    // 初始化对象的语句
    this.formItems = formItems

    /** 定义linkage数据模型 */
    this.linkage = {
      hidecolumn: []
    }
  }

  // 根据colname找到对应的配置属性
  /**根据colname找到对应的配置属性
   * @param colname  目标字段的colname
   * @return item 整个配置对象
   */
  findItem(colname){
    let target = null
    this.formItems.every(item => {
      let childs = item.childs || [item.child];
      childs.every(temp => {
        if(temp.colname === colname){
          target = temp
          return false
        }
        return true
      })
      return !target
    })

    return target
  }

  initializeData(){
    this.formItems.every(item => {
      let childs = item.childs || [item.child];
      childs.every(temp => {
        if(temp.hidecolumn){
          this.hideColumn(temp)
        }

        return true
      })
      return true
    })
    // this.formItems.
    return JSON.parse(JSON.stringify(this.formItems))
  }


  // 处理字段隐藏
  hideColumn(target){
    let source = this.findItem(target.hidecolumn.refcolumn)
    source.linkage = source.linkage || JSON.parse(JSON.stringify(this.linkage))
    let obj = Object.assign(target.hidecolumn,{
      target: target.colname,
      clear: target.clearWhenHidden
    })
    source.linkage.hidecolumn.push(obj)
    delete target.hidecolumn
  }
}
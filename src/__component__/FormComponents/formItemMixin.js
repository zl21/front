
  // 字段联动隐藏
  import hideColumn from '../ExtendedAttributes/hideColumn';

export default {
  watch:{
    value:{
      handler(val,old){  //监听数据，处理数据联动
        if(this.items.linkage && this.items.linkage.hidecolumn){
          hideColumn(this,this.items.linkage.hidecolumn)
        }
      }
    }
  },
  mounted () {
    // 处理初始化的联动逻辑以及映射关系
    // 处理字段隐藏功能
    if(this.items.hidecolumn){
      this.$_live_completeRender(this.items.hidecolumn.refcolumn).then(res => {
        res.items.linkage?res.items.linkage:res.items.linkage = {}
        let linkage = res.items.linkage
        if(linkage.hidecolumn){
          res.items.linkage.hidecolumn.push({
            target: this.items.colname,
            refval: this.items.hidecolumn.refval,
            ishide: this.items.hidecolumn.ishide
          })
        }else{
          res.items.linkage.hidecolumn = []
          res.items.linkage.hidecolumn.push({
            target: this.items.colname,
            refval: this.items.hidecolumn.refval,
            ishide: this.items.hidecolumn.ishide
          })
        }

        hideColumn(res,res.items.linkage.hidecolumn)
      })
    }
    
  }
}
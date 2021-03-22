
  // 字段联动隐藏
  import hideColumn from '../ExtendedAttributes/hideColumn';
  // 设置字段静态规则
  import setAttributes from '../ExtendedAttributes/setAttributes';

export default {
  watch:{
    value:{
      handler(val,old){  //单对象字段 监听数据，处理数据联动
        if(this.items.detailType){
          if(this.items.linkage && this.items.linkage.hidecolumn){
            hideColumn(this,this.items.linkage.hidecolumn)  
          }

          if(this.items.linkage && this.items.linkage.setAttributes){
            setAttributes(this,this.items.linkage.setAttributes)  
          }
        }
      
      }
    }
  },
  mounted () {
    
  }
}
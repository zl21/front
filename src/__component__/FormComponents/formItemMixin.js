
  // 字段联动隐藏
  import hideColumn from '../ExtendedAttributes/hideColumn';

export default {
  watch:{
    value:{
      handler(val,old){  //监听数据，处理数据联动
        if(this.items.detailType && this.items.linkage && this.items.linkage.hidecolumn){
          hideColumn(this,this.items.linkage.hidecolumn)  
        }
      }
    }
  },
  mounted () {
    
  }
}
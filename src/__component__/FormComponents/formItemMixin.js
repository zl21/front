
  // 字段联动隐藏
  import hideColumn from '../ExtendedAttributes/hideColumn';
  // 设置字段静态规则
  import setAttributes from '../ExtendedAttributes/setAttributes';
  // 清除字段
  import {ClearRefcolValue} from '../ExtendedAttributes/common.js';

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
          // refcolval  清空字段

          if(this.items._linkFormMap){
            // refcolval
            let _linkFormMap = this.items._linkFormMap;
            if(_linkFormMap.refcolval){
              // 清除目标字段的值
              ClearRefcolValue(this,_linkFormMap.refcolval);
            }
            if(_linkFormMap.refcolvalArray){
              // 清除目标字段的值
              ClearRefcolValue(this,_linkFormMap.refcolvalArray);
            }
            if(_linkFormMap.refcolval_custom){
              // 清除目标字段的值
              ClearRefcolValue(this,_linkFormMap.refcolval_custom);
            }
          }
        }
 
        
       
      }
    }
  },
  mounted () {
    
  }
}
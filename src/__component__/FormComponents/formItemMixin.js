
    // 公共变量及值
  import mixins from './formItemMixinCommon.js'
  // 字段联动隐藏
  import hideColumn from '../ExtendedAttributes/hideColumn';
  // 设置字段静态规则
  import setAttributes from '../ExtendedAttributes/setAttributes';
  // 清除字段
  import {clearFormRefcolval} from '../ExtendedAttributes/common.js';
  //  多字段赋值
  import {formRequestInit} from '../ExtendedAttributes/formRequest';
  // 联动计算
  import {dynamicforcompute} from '../ExtendedAttributes/dynamicforcompute.js';
  // 下拉框过滤值
  import {filtercolval } from '../ExtendedAttributes/filtercolval.js';
  // 处理单对象表单中数据和store中的交互问题
  import storeDataInteractionMixin from './PanelForm/storeDataInteractionMixin';
  // 处理单对象表单webcof 映射
  import mapwebconf from '../ExtendedAttributes/mapwebconf.js';


export default {
  mixins:[mixins,storeDataInteractionMixin,mapwebconf],
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
          if(this.items.webconf && this.items.webconf.formRequest){
            // 多字段赋值、配置在来源字段  字段B、C、D根据A字段查询结果赋值
            // 默认值时候不走
            if(this.actived){
              formRequestInit(this,this.items.webconf.formRequest);
            }else if(this.items.webconf.formRequest.copy){
              formRequestInit(this,this.items.webconf.formRequest);

            }
          }
          if(this.items.webconf && this.items.webconf.dynamicforcompute){
             // 多值计算
            // 默认值时候不走
            if(this.actived){
              dynamicforcompute(this,this.items.webconf.dynamicforcompute)
            }
          }
          if(this.items.webconf && this.items.webconf.filtercolval){

            // 过滤显示字段
           filtercolval(this,this.items.webconf.filtercolval)
         }
          //  清空字段refcolval
          if(this.actived && !this.typesource){
            clearFormRefcolval(this);
            this.typesource = '';
          }
          
        }else if(this.items.Query){
          // 清除标准列表的数据
          clearFormRefcolval(this)
        }
      }
    }
  },
  methods:{
    findParentForm(){
      return this.$parent.$parent.$parent
    }
  },
  mounted () {
    
  }
}
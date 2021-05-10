/* eslint-disable prefer-rest-params */
/* eslint-disable class-methods-use-this */

import Vue from 'vue';
import FormItem from './FormItem.vue';

// 处理列表逻辑
import { SetListProps } from './list/props';

String.prototype.TextFilter = function TextFilter() {
  const pattern = new RegExp("[`~%!@#^=''?~！@#￥……&——‘”“'？*()（），,+。.、]"); // []内输入你要过滤的字符
  let rs = '';
  for (let i = 0; i < this.length; i++) {
    rs += this.substr(i, 1).replace(pattern, '');
  }
  return rs;
};

/**
   *处理单对象display字段，转换成和列表界面的统一
   * @param 单对象的字段类型
   * @returns  列表字段类型
   * @memberof typeConversion
   */
  function typeConversion(item){
    if(item.webconf && item.webconf.display === 'YearMonth'){
      item.display = item.webconf.display;
    }
    switch(item.display){
      case 'select':
        item.display = 'OBJ_SELECT';
        break;
      case 'textarea':
        if(item.webconf && item.webconf.display === 'jsonmaker'){
          item.display = 'ExtensionProperty';
        }else{
          item.display = 'OBJ_TEXTAREA';
        }
        

        break;
      case 'doc':
        item.display = 'OBJ_DOC';
        break;
      case 'text':
      case 'xml':
        if(item.webconf && item.webconf.display === 'YearMonth'){
          item.display = 'YearMonth';
        }else if(item.webconf && item.webconf.display === 'enumerate'){
          item.display = 'Enumerate';
        }else if(!item.isfk){
          item.display = undefined;
        }else{
          item.display = 'OBJ_FK';
          item.fkobj = {
            fkdisplay: item.fkdisplay,
            reftable: item.reftable,
            reftableid: item.reftableid,
            searchmodel: item.fkdisplay,
            serviceId: item.serviceId,
          }
        }
        
        break;
      case 'check':
        item.display = 'OBJ_CHECK';
        break;
      case 'OBJ_DATE':
        item.display = 'OBJ_DATETIME';
      default:
        break;
    }

    return item;
  }



export default class RenderComponent {
  constructor(item, id) {
    // 初始化对象的语句
    this.id = id;
    this.item = item;
    this.initProps();
    
  }
  /***
   * 判断是否是列表数据
   */
   initProps(){
     
     if(this.id ){
        this.item = new SetListProps(this.item).init();
        this.item._id = this.id;
     }

   }
  
  /**
   *处理单对象表单display字段，转换成和列表界面的统一
   *
   * @returns
   * @memberof itemConversion
   */
  itemConversion(){
    // console.log(this.item)
    this.item = typeConversion(JSON.parse(JSON.stringify(this.item)));
    this.item.coldesc = this.item.name
    console.log(this.item.isMainTable);
    this.item.detailType = true  //增加是否是明细字段标记，明细字段传参不同
    return this.item
  }

  ObjectToMerge() {
    const parameter = [...arguments].reverse();
    // 判断两个对象中是否存在相同methods
  }

  Initialize() {
    const mixins = require('./formItemMixin').default;
    
    this.ObjectToMerge(FormItem.methods, mixins.methods);
    Object.assign(FormItem.methods, mixins.methods);
    Vue.component(`${this.id}${this.item.colname.TextFilter()}`, Vue.extend(Object.assign({ mixins: [mixins], isKeepAliveModel: true },FormItem)));
    return `${this.id}${this.item.colname.TextFilter()}`;
  }
}

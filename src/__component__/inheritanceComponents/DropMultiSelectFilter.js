/**
 * 下拉多选外健关联业务组件的自定义逻辑处理
 */

/**
 * 下拉单选外健关联业务组件的自定义逻辑处理
 */
 import { defaultrange } from '../../constants/global';
 import { DropMultiSelectFilter } from '@syman/ark-ui-bcl';
 import network from '../../__utils__/network';
 import { SetPlaceholder } from './setProps';
 import Vue from 'vue';
 import {
  setFixedcolumns,
  setisShowPopTip,
} from '../ExtendedAttributes/refcolval.js'
 
 // const BusDropDownSelectFilter = () => import('arkui_BCL/DropDownSelectFilter');
 // console.log(BusDropDown);
 // 处理传参form格式转换
 const urlSearchParams = (data) => {
   const params = new URLSearchParams();
   Object.keys(data).forEach((key) => {
     const dataType = Object.prototype.toString.call(data[key]);
 
     if (dataType === '[object Object]' || dataType === '[object Array]') {
       data[key] = JSON.stringify(data[key]);
     }
 
     params.append(key, data[key]);
   });
   return params;
 };
 
 // 深拷贝
//  const deepClone = (arr) => {  
//    const obj = arr.constructor == Array ? [] : {};
//    // 第二种方法 var obj=arr instanceof Array?[]:{}
//    // 第三种方法 var obj=Array.isArray(arr)?[]:{}
//    for (const item in arr) {
//      if (typeof arr[item] === 'object') {
//        obj[item] = deepClone(arr[item]);
//      } else {
//        obj[item] = arr[item];
//      }
//    }
//    return obj;
//  };
 
 
 class CustomDropMultiSelectFilter {
   constructor(item) {
    //  接收传值
     this.item = item;
    //  设置commpents
     this.setCompents();
    //  设置模板
     this.setTemple();
    //  修改的Methods
     this.mergeMethods();
    //  自己的methods 
    this.setMethods();
     this.pageSize = defaultrange();
     //  设置组件data
     this.setData()

   }
   setCompents(){
     this.components = { MultiSelectFilter:DropMultiSelectFilter };
   }
   mounted(){
    //  渲染后的挂载
    setTimeout(()=>{
      this.valueData = this.value;
    },10)
     if(this.pageSize){
        this.$refs.MultiSelectFilter.pageSize = this.pageSize;
     }
     this.$refs.MultiSelectFilter.postTableData = this.postTableData;
   }
   setMethods(){
     this.methods =  {
      onChange:function(value){
        this.valueData = value;
        this.$emit('on-Change',value);
      }
     }
   }
 
   setTemple(){
     this.template =  `
     <div>
         <MultiSelectFilter ref="MultiSelectFilter" v-bind="items.props"  @on-valueChange="onChange"></MultiSelectFilter>
        </div>
      `;  
   }
   setData(){
    //  修改传参的props
    this.mergeProps();
    let  items = {...this.item};
    
    this.data = ()=>{
      return {
        items:items,
        valueData:this.value,
        pageSize:this.pageSize,
        postTableData:this.postTableData
      }
    }
   }
   init() {
    // 重新渲染组件
    if (this.item.Components) {
      return this.item.Components;
    }
     let ExtMultiSelectFilter = Vue.extend({
      model: {
        prop: 'value',
        event: 'on-Change',
      },
       props:{
        value: {
          type: [Array, String]
        }
       },
       name:'extMultiSelectFilter',
       data:this.data,
       components:this.components,
       template:this.template,
       methods:this.methods,
       mounted:this.mounted
     });
     this.item.Components = new ExtMultiSelectFilter().$options;
     return this.item.Components;
   }
 
   // 合并props
   mergeProps() {
     const propsData = { ...this.item };
     // 处理Url
     this.propsUrl(propsData);
     // 处理传参
     this.propsParams(propsData);
 
     propsData.PropsData = {
       disabled: this.item.readonly  &&  (this.item.webconf ? !this.item.webconf.ignoreDisableWhenEdit : true),
       hidecolumns:['id', 'value'],
       isShowPopTip: setisShowPopTip(this, this.item.webconf,network),
       placeholder:new SetPlaceholder(this.item).init()
     }
     
     this.item.props = { ...propsData };
   } 
 
   propsUrl(props) { // 处理props中的url属性
     props.Url = {
       autoUrl: `/p/cs/fuzzyquerybyak`,
       tableUrl: `/p/cs/QueryList`
     };
   }
 
   propsParams(props) { // 处理props中的AutoRequest,TableRequest
     props.AutoRequest = {
       colid: this.item.colid,
       fixedcolumns: {}
     };
 
     props.TableRequest = {
       isdroplistsearch: true,
       refcolid: this.item.colid,
     };
     props.http = network
   }
 
   // 合并data
   mergeDatas() {
    //  const data = { ...this.BusDropDown.mixins[0].data() };
    //  // 处理前端配置的默认分页数
    //  data.pageSize = defaultrange() ? defaultrange() : data.pageSize;
    //  this.BusDropDown.mixins[0].data = () => data;
   }
 
   // 合并methods
   mergeMethods() {
     this.postTableData = function postTableData(url) {
      
     };
   }
 }
 
 export default CustomDropMultiSelectFilter;
 
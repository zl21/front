/* eslint-disable func-names */
/* eslint-disable no-prototype-builtins */

/**
 * AttachFilter组件自定义
 */


 import Vue from 'vue';
 import { MopMultiSelect } from '@syman/ark-ui-bcl';
 // import MopMultiSelect from 'arkui_BCL/MopMultiSelect';
 import dataProp from '../../__config__/props.config';
 import regExp from '../../constants/regExp';
 import network from '../../__utils__/network';
 import { SetPlaceholder } from './setProps';
 class CustomAttachFilter {
   constructor(item) {
     this.mergeProps();
     this.mergeMethods();
     this.item = item;
     this.Vm = MopMultiSelect;
   }
 
   init() {
     return {
       Components:this.Vm,
       props:this.props
     };
    
   }
 
   // 合并props
   mergeProps() {
 
     let PropsData = {
       default: () => ({
         disabled: this.item.readonly  &&  (this.item.webconf ? !this.item.webconf.ignoreDisableWhenEdit : true), //控制字段是否可编辑
         blurType: false, // 失去光标是否默认选中第一行
         colid: this.item.colid, // 表id
         colname: this.item.colname, // 表名称
         enterType: false, // 回车是否显示第一行
         fkobj: {
           colid: this.item.colid,
           fkdisplay: this.item.fkobj.searchmodel,
           reftable: this.item.fkobj.reftable,
           serviceId: this.item.fkobj.serviceId,
           saveType:this.item.detailType,
           reftableid: this.item.fkobj.reftableid,
           searchmodel: this.item.fkobj.searchmodel,
           show: this.item.fkobj.searchmodel === 'mop',
           url:
             `${this.item.fkobj.serviceId ? (`/${this.item.fkobj.serviceId}`) : ''
             }/p/cs/menuimport`
         },
         inputname: this.item.inputname,
         placeholder: SetPlaceholder(this.item)
       })
     };
 
     this.props = {
       PropsData,
       http:network
     };
   }
 
   // 合并methods
   mergeMethods() {
    
 
 
     // 回车查询
     
   }
 
  
 }
 
 export default CustomAttachFilter;
 
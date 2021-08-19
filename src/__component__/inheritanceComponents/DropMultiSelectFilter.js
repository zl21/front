/* eslint-disable func-names */
/* eslint-disable no-prototype-builtins */

/**
 * AttachFilter组件自定义
 */


 import { defaultrange } from '../../constants/global';
//  import { DropMultiSelectFilter } from '@syman/ark-ui-bcl';
 import DropMethods from '../ExtendedMethods/DropMethods';
 import network from '../../__utils__/network';
 import { SetPlaceholder } from './setProps';
 let  DropMultiSelectFilter = $Bcl.default.arkDropMultiSelectFilter;

 import {
  setisShowPopTip,
  postData,
  postTableData
} from '../ExtendedAttributes/refcolval.js'
 
 class CustomDropMultiSelectFilter {
   constructor(item) {
     this.item = item;
     this.Vm = Object.create(DropMultiSelectFilter);
     this.mergeProps();   
     this.mergeMethods(); 
   }
 
   init() {
      return {
        Components:this.Vm,
        props:this.props
      };
   }
 
   // 合并props
   mergeProps() {
     
    if (this.item.fkobj && this.item.fkobj.serviceId) {
      // 字段的网关
      this.item.serviceId = this.item.fkobj.serviceId;
    }
    if(this.item.detailType){
     // 走关联字段查询
      this.item.Query = true;
    }else{
      this.item.Query = false;
    }
    this.propstype = {
          ...this.item,
          item:this.item,
          singleTurn:true,
          disabled: this.item.readonly  &&  (this.item.webconf ? !this.item.webconf.ignoreDisableWhenEdit : true),
          hidecolumns:['id', 'value'],
          placeholder:new SetPlaceholder(this.item).init()
     };
     
     this.props = {
        PropsData:{...this.propstype},
        Url:{
          autoUrl: `/p/cs/fuzzyquerybyak`,
          tableUrl: `/p/cs/QueryList`,
          tableSearchUrl:'/p/cs/newQueryList'
        },
        AutoRequest: {
          colid: this.item.colid,
          fixedcolumns: {}
        },
        filterMode:false,
        TableRequest : {
          isdroplistsearch: true,
          refcolid: this.item.colid,
        },
        http: network
      }
     return 
   }
 
   // 合并methods
   mergeMethods() {
    let self = this;  
    new DropMethods(this.item,this.Vm).blur();
    

    this.Vm.created = function(){  
      this.item = this.PropsData.item;
      this.item.Query = this.PropsData.Query;
      this.activeTab = this.$parent.$parent.activeTab;
      if(this.item.refcolval){
        if(!this.item.webconf){
          this.item.webconf = {}
        }
        this.item.webconf.refcolval = this.item.refcolval
      }
      this.PropsData.isShowPopTip=()=>{
        if(this.item.refcolval){
          if(!this.item.webconf){
            this.item.webconf = {}
          }
          this.item.webconf.refcolval = this.item.refcolval
        }
        return setisShowPopTip(this, this.item.webconf,network)
      }  
      if(defaultrange()){
        this.pageSize = defaultrange();
      }
      this.postTableData = function (url) {
        // 字段联动 表格数据查询
        return new Promise((resolve) => {
         postTableData.call(this,this,url).then((res)=>{
            resolve(res)
         });
        })
        
      };
      this.postData = function (url) {
        // 字段联动 模糊查询数据
         return new Promise((resolve) => {
          postData.call(this,this,url).then((res)=>{
             resolve(res)
          });
         })   
      };
       // 默认数据
       setTimeout(()=>{
        setisShowPopTip(this, this.item.webconf, network,true);
      },200);


    }


  
   }
 
   
 }
 
 export default CustomDropMultiSelectFilter;
 
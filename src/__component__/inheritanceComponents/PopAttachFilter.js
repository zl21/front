/* eslint-disable func-names */
/* eslint-disable no-prototype-builtins */

/**
 * AttachFilter组件自定义
 */


 import ComAttachFilter from '../ComAttachFilternew.vue';
 import { SetPlaceholder ,SetDisable} from './setProps';
 import DropMethods from '../ExtendedMethods/DropMethods';

 class CustomAttachFilter {
  constructor(item) {
    this.item = item;
    this.Vm = Object.create(ComAttachFilter);
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
     
    //  this.item.props = {...item}
    //  let defaultValue = [];
    //  if (this.item.refobjid && this.item.refobjid!== -1) {
    //    defaultValue = [{
    //      Label: this.item.valuedata ||this.item.default || this.item.defval,
    //      ID: this.item.refobjid
    //    }];
    //  }

     
    //  this.item.defaultValue =this.item.valuedata || this.item.default;
    //  this.item.defaultSelected =defaultValue;
     this.props = {
        propstype:{
          disabled: new SetDisable(this.item).init(),
         AutoData: [],
        //  Selected: defaultValue,
         blurType: this.item.detailType || false,
         enterType: this.item.detailType || false,
         coldesc: this.item.coldesc,
         colid: this.item.colid,
         colname: this.item.colname,
         datalist: this.item.fkobj.searchmodel === 'mop' ? [{
           lable: 0,
           value: '更多筛选'
         }, {
           lable: 2,
           sendData: {
             table: this.item.fkobj.reftable
           },
           url: '/p/cs/menuimport',
           value: '导入'
         }] : [],
         dialog: {
           model: {
             closable: true,
             draggable: true,
             'footer-hide': this.item.fkobj.searchmodel === 'pop',
             mask: true,
             maskClosable: false,
             scrollable: true,
             width: 920,
             title:'弹窗单选'
           }
         },
         display: this.item.display,
         filterDate: {},
         filterTip: true,
         fkdisplay: this.item.fkobj.searchmodel,
         fkobj: {
           colid: this.item.colid,
           fkdisplay: this.item.fkobj.searchmodel,
           reftable: this.item.fkobj.reftable,
           serviceId: this.item.fkobj.serviceId,
           reftableid: this.item.fkobj.reftableid,
           searchmodel: this.item.fkobj.searchmodel,
           show: this.item.fkobj.searchmodel === 'mop',
           url:
             `${this.item.fkobj.serviceId ? (`/${this.item.fkobj.serviceId}`) : ''
             }/p/cs/menuimport`
         },
         hideColumnsKey: ['id'],
         inputname: this.item.inputname,
         optionTip: this.item.fkobj.searchmodel === 'mop',
         show: this.item.fkobj.searchmodel === 'mop',
         placeholder: new SetPlaceholder(this.item).init()

        }
         
     };
 
     // this.settingPlaceholder();
     // if (this.item.type === 'NUMBER') {
     //   this.numericTypes();
     // }
     // if (this.item.isuppercase) {
     //   this.uppercase();
     // }
 
 
   
 
    //  this.item.props = defaultProps;
   }
 
   // 合并methods
   mergeMethods() {
     const _self = this;
      // 失去光标
      // new DropMethods(this.item,this.Vm).blur('attachFilterInputBlur');
  
 
 
     // 回车查询

     const attachFilterInputKeydown = this.Vm.methods.attachFilterInputKeydown;
     this.Vm.methods.attachFilterInputKeydown = function () {
       attachFilterInputKeydown.call(this, ...arguments);
       if (arguments[1].code === 'Enter') {
         setTimeout(() => {
           const component = this.$_live_getChildComponent(window.vm, this.$store.state.global.activeTab.keepAliveModuleName)
           component && component.searchClickData && component.searchClickData();
         }, 300);
       }
     };


   }
 
   
 }
 
 export default CustomAttachFilter;
 
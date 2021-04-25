/* eslint-disable func-names */
/* eslint-disable no-prototype-builtins */

/**
 * AttachFilter组件自定义
 */


 import Vue from 'vue';
 import ComAttachFilter from '../ComAttachFilternew.vue';
 import dataProp from '../../__config__/props.config';
 import regExp from '../../constants/regExp';
 import { SetPlaceholder } from './setProps';
 
 class CustomAttachFilter {
   constructor(item) {
     this.item = item;
     this.mergeProps();
     this.Components = this.setComponents();
    
   }
   setComponents() {
    let data = this.item; 
    let self = this;
    return  {
      name: 'ComAttachFilterPop',
      model: {
        prop: 'value',
        event: 'on-change',
     },
      props:{
        value:{
          type: [Array,String],
          default () {
            return '';
          }
        }
      },
      render(h) {
        return h(ComAttachFilter,
          {
            props: {
              propstype:data.propstype,
              value:this.value,
              defaultValue:data.defaultValue
            },
            on:{
              'on-change':(values)=>{
                this.$emit('on-change',values, this);
              }
            }
        })
      },
      mounted() {
      }
     }
   } 
    
 
   init() {
     return this.Components;
   }
 
   // 合并props
   mergeProps() {
     
    //  this.item.props = {...item}
     let defaultValue = [];
     if (this.item.refobjid && this.item.refobjid!== -1) {
       defaultValue = [{
         Label: this.item.valuedata ||this.item.default || this.item.defval,
         ID: this.item.refobjid
       }];
     }

     const placeholder = this.item.webconf && this.item.webconf.placeholder ? this.item.webconf.placeholder : null;
     this.item.defaultValue =this.item.valuedata || this.item.default;
     this.item.defaultSelected =defaultValue;
     this.item.propstype = {
         disabled: this.item.readonly  &&  (this.item.webconf ? !this.item.webconf.ignoreDisableWhenEdit : true),
         AutoData: [],
         Selected: defaultValue,
         blurType: false,
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
         enterType: false,
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
     this.Input.methods.valueChange = function (type,value) { // 重写valueChange事件,给父节点的value复制，实现双向数据绑定效果
       window.clearTimeout(this.clickTimer);
       this.clickTimer = window.setTimeout(() => {
         if (type === 'clear') {
           this.$emit('valuechange', { value: null, selected: [], type }, this);
           let child = this.$_live_getChildComponent(this.$_live_getChildComponent(window.vm, this.$store.state.global.activeTab.keepAliveModuleName), `${_self.item._id}${_self.item.colname}`);
           if (child) child.value = []
         } else {
           // 处理弹窗单选数据123
           // eslint-disable-next-line no-nested-ternary
           console.log(value);
           this.$emit('valuechange', { value: this.propstype.fkdisplay === 'pop' ? ((this.selected && this.selected.length > 0) ? this.selected[0].ID : '') : this.value, selected: this.selected, type }, this);
           let valueData = this.selected;
           if(!valueData[0]){
             valueData = this.value;
           }
           let target = this.$_live_getChildComponent(window.vm, this.$store.state.global.activeTab.keepAliveModuleName);
           let child = this.$_live_getChildComponent(target, `${_self.item._id}${_self.item.colname}`);
           if (child) child.value =valueData;
         }
       }, 200);
     };
 
 
     // 回车查询
     const attachFilterInputKeydown = this.Input.methods.attachFilterInputKeydown;
     this.Input.methods.attachFilterInputKeydown = function () {
       attachFilterInputKeydown.call(this, ...arguments);
       if (arguments[1].code === 'Enter') {
         setTimeout(() => {
           this.$_live_getChildComponent(window.vm, this.$store.state.global.activeTab.keepAliveModuleName).searchClickData();
         }, 300);
       }
     };
   }
 
   settingPlaceholder() { // 设置Placeholder属性
     const placeholder = this.item.webconf && this.item.webconf.placeholder ? this.item.webconf.placeholder : null;
     this.item.props.placeholder = placeholder || `${(dataProp.input && dataProp.input.props) ? dataProp.input.props.placeholder : '请输入'}${this.item.coldesc}`;
   }
 
   numericTypes() { // 数字类型输入控制
     // 只能输入 正整数
     let string = '';
     this.item.length = 100;
 
     if (this.item.webconf && this.item.webconf.ispositive) {
       string = `^\\d{0,${this.item.length}}(\\\.[0-9]{0,${
         this.item.scale
       }})?$`;
     } else {
       string = `^(-|\\+)?\\d{0,${this.item.length - this.item.scale}}(\\\.[0-9]{0,${
         this.item.scale
       }})?$`;
     }
 
     const typeRegExp = new RegExp(string);
     if (this.item.scale > 0) {
       this.item.props.regx = typeRegExp;
     } else if (this.item.webconf && this.item.webconf.ispositive) {
       this.item.props.regx = regExp.Number;
     } else {
       this.item.props.regx = regExp.Digital;
     }
   }
 
   uppercase() { // 大写转换
     if (this.item.isuppercase) {
       this.item.props.regx = /^[A-Z0-9\u4e00-\u9fa5]*$/;
     }
   }
 }
 
 export default CustomAttachFilter;
 
/* eslint-disable func-names */
/* eslint-disable no-prototype-builtins */

/**
 * AttachFilter组件自定义
 */


import Vue from 'vue';
import ComAttachFilter from '../ComAttachFilter.vue';
import dataProp from '../../__config__/props.config';
import regExp from '../../constants/regExp';

// 深拷贝
const deepClone = (arr) => {  
  const obj = arr.constructor == Array ? [] : {};
  // 第二种方法 var obj=arr instanceof Array?[]:{}
  // 第三种方法 var obj=Array.isArray(arr)?[]:{}
  for (const item in arr) {
    if (typeof arr[item] === 'object') {
      obj[item] = deepClone(arr[item]);
    } else {
      obj[item] = arr[item];
    }
  }
  return obj;
};
class CustomAttachFilter {
  constructor(item) {
    this.item = item; 
    // if (this.item.Components) {
    //   this.Input = this.item.Components;
    // } else {
    this.Input = deepClone(ComAttachFilter);
    // }
    // const DefaultInput = Vue.extend(ComAttachFilter);
    
    // this.Input = new DefaultInput().$options;
    // console.log(this.Input);
    delete this.Input._Ctor;
  }

  init() {
    this.mergeProps();
    this.mergeMethods();
    if (this.item.Components) {
      return this.item.Components;
    }
    
    const Con = Vue.extend(this.Input);
    
    const obj = { ...new Con().$options };
    this.item.Components = obj;
    return this.Input;
  }

  // 合并props
  mergeProps() {
    const defaultProps = { ...this.Input.props };

    let defaultValue = [];
    if (this.item.default) {
      defaultValue = [{
        Label: this.item.default,
        ID: this.item.refobjid
      }];
    }
    
    defaultProps.defaultSelected = {
      default: () => defaultValue
    };

    defaultProps.defaultValue = {
      default: () => this.item.default
    };

    const placeholder = this.item.webconf && this.item.webconf.placeholder ? this.item.webconf.placeholder : null;
    defaultProps.propstype = {
      default: () => ({
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
            title: this.item.fkobj.searchmodel === 'mop' ? '弹窗多选' : null
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
        placeholder: placeholder || `${(dataProp.input && dataProp.input.props) ? dataProp.input.props.placeholder : '请输入'}${this.item.coldesc}`
      })
    };

    // this.settingPlaceholder();
    // if (this.item.type === 'NUMBER') {
    //   this.numericTypes();
    // }
    // if (this.item.isuppercase) {
    //   this.uppercase();
    // }
    

    Object.keys(this.item.props).map((item) => {
      // console.log(item, this.item.props.regx, this.item.props[item], this.Input.props[item]);
      if (defaultProps[item]) {
        defaultProps[item].default = () => (function (value) {
          return value;
        }(this.item.props[item]));
      }
      return item;
    });
    
    this.Input.props = defaultProps;
  }

  // 合并methods
  mergeMethods() {
    const _self = this;
    this.Input.methods.valueChange = function (type,value) { // 重写valueChange事件,给父节点的value复制，实现双向数据绑定效果
      window.clearTimeout(this.clickTimer);
      this.clickTimer = window.setTimeout(() => {
        if (type === 'clear') {
          this.$emit('valuechange', { value: null, selected: [], type }, this);
          this.$_live_getChildComponent(this.$_live_getChildComponent(window.vm, this.$store.state.global.activeTab.keepAliveModuleName), `${this.$route.params.tableName}${_self.item.colname}`).value = [];
        } else {
          // 处理弹窗单选数据
          // eslint-disable-next-line no-nested-ternary
          this.$emit('valuechange', { value: this.propstype.fkdisplay === 'pop' ? ((this.selected && this.selected.length > 0) ? this.selected[0].ID : '') : this.value, selected: this.selected, type }, this);
          console.log(this.selected,'121212');
          let valueData = this.selected;
          if(!valueData[0]){
            valueData = this.value;
          }
          this.$_live_getChildComponent(this.$_live_getChildComponent(window.vm, this.$store.state.global.activeTab.keepAliveModuleName), `${this.$route.params.tableName}${_self.item.colname}`).test(valueData)
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

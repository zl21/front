/* eslint-disable import/no-dynamic-require */
<template>
<!-- :show-tip="items.detailType" -->
 <ValidateCom
    :rules="rules"
    :labelWidth="labelWidth"
    :items="propsMessage"
    :colname="items.colname"
   v-on="$listeners"
    :value="value">
  <div :class="_items.props.fkdisplay === 'pop' ? 'ItemComponentRoot AttachFilter-pop':'ItemComponentRoot'">


      <span class="itemLabel"
            :style="labelStyle"
            v-if="showLabel">
        <Poptip v-if="items.comment"
                word-wrap
                trigger="hover"
                transfer
                width="200"
                :content="items.comment">
          <div slot="content"
               class="api">
            <span><span>{{ items.comment }}</span>
              <a v-if="items.webconf && items.webconf.Outside"
                 style=""
                 :href="items.webconf.Outside"
                 target="_blank">...</a>
            </span>
          </div>
          <i class="iconfont iconios-information-circle-outline" />
        </Poptip>
        <span v-if="items.isnotnull"
              class="label-tip">*</span>
        <template v-if="getVersion() === '1.4' && items.fkobj && items.fkobj.fkdisplay === 'pop' && items.detailType">
          <!-- 路由跳转 -->
          <template v-if="value">
            <i class="iconfont iconbj_link"
               data-target-tag="fkIcon"
               style="color: #0f8ee9; cursor: pointer; font-size: 12px"
               @click="routerNext(value)" />
          </template>

        </template>
        <template v-if="getVersion() === '1.4' && items.fkobj && items.fkobj.fkdisplay === 'drp' && items.detailType">
          <!-- 路由跳转 -->
          <template v-if="value">
            <i class="iconfont iconbj_link"
               data-target-tag="fkIcon"
               style="color: #0f8ee9; cursor: pointer; font-size: 12px"
               @click="routerNext(value)" />
          </template>

        </template>

        <span :title="items.coldesc" >{{ items.coldesc }}:</span>
      </span>
      <div :class=" [_items.props.row >1 ? 'itemComponent height100':'itemComponent',items.isuppercase?'isuppercase':'']"
           :style="_items.display==='image' ? 'overflow:visible' :''">
        <!-- <Input
        v-if="_items.type === 'input'"
        :ref="_items.field"
        v-model="_items.value"
        :type="_items.props.type"
        :clearable="_items.props.clearable"
        :disabled="_items.props.disabled || _items.props.readonly"
        :readonly="_items.props.readonly || _items.props.disabled"
        :rows="_items.props.row"
        :autosize="_items.props.autosize"
        :autofocus="_items.props.autofocus"
        :placeholder="!_items.props.disabled? _items.props.placeholder:''"
        :size="_items.props.size"
        :maxlength="_items.props.maxlength"
        :icon="_items.props.icon"
        :regx="_items.props.regx"
        on-click="inputClick"
        @on-blur="inputBlur"
        @on-change="inputChange"
        @on-enert="inputEnter"
        @on-focus="inputFocus"
        @on-keyup="inputKeyUp"
        @on-keydown="inputKeyDown"
        @on-keypress="inputKeyPress"
        @on-regx-check="inputRegxCheck"
      /> -->
        <!-- <ComAttachFilter
        v-if="_items.type === 'AttachFilter'"
        :ref="_items.field"
        :default-value="_items.value"
        :default-selected="_items.props.Selected"
        :propstype="_items.props"
        @keydown="attachFilterInputKeydown"
        @valuechange="attachFilterInput"
      /> -->
        <component :is="componentsName"
                   :ref="items.colname"
                    v-bind="propsMessage"
                    v-on="$listeners"
                    v-model="value">
          <slot v-if="items.display === 'OBJ_SELECT'">
            <Option v-for="item in items.props.options"
                    :key="item.value"
                    :value="item.value"
                    :disabled="item.disabled">
              {{ item.label }}
            </Option>
          </slot>
        </component>

        <!-- 自定义组件 -->
         <component :is="_items.componentName"
                   v-if="_items.type === 'customization'"
                   :ref="items.colname"
                   v-model="value"
                    v-bind="propsMessage"
                   :options="{
          ..._items,
          webConfSingle,
          index,
          formIndex,
        }" />
      </div>


  </div>
  </ValidateCom>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

import dataProp from '../../__config__/props.config';
// 弹窗多选面板
// import Dialog from './ComplexsDialog';
// 弹窗单选
// import myPopDialog from './PopDialog';
// 富文本编辑
import WangeditorVue from '../Wangeditor.vue';
//   弹窗单选 弹窗多选
import ComAttachFilter from '../ComAttachFilter.vue';
//   上传文件
import Docfile from '../docfile/DocFileComponent.vue';

import BusDropDownSelectFilter from '../inheritanceComponents/BusDropDownSelectFilter';
import CustomDropMultiSelectFilter from '../inheritanceComponents/DropMultiSelectFilter';
import CustomInput from '../inheritanceComponents/Input';
import CustomDatePicker from '../inheritanceComponents/DatePicker';
import CustomSelect from '../inheritanceComponents/Select';
import CustomAttachFilter from '../inheritanceComponents/AttachFilter';
import CustomPopAttachFilter from '../inheritanceComponents/PopAttachFilter';
import CustomCheckbox from '../inheritanceComponents/CheckBox';
import CustomImageUpload from '../inheritanceComponents/ImageUpload';
import CustomDocUpload from '../inheritanceComponents/DocUpload';
import CustomWangeditor from '../inheritanceComponents/Wangeditor';
import CustomEnumerableInput from '../inheritanceComponents/EnumerableInput';
import CustomExtensionProperty from '../inheritanceComponents/ExtensionProperty';
import CustomRadioGroup from '../inheritanceComponents/RadioGroup'
import CustomDefined from '../inheritanceComponents/Defined'
import CustomStringRender from '../inheritanceComponents/StringRender'
import CustomCheckboxGroup from '../inheritanceComponents/CheckboxGroup';

import ParameterDataProcessing from './parameterDataProcessing';
import { Validate } from './PanelForm/Validate';

// 验证组件的插件
let ValidateCom = new Validate().init();
import {
  Version, MODULE_COMPONENT_NAME, ossRealtimeSave, defaultrange,setComponentsProps
} from '../../constants/global';
import createModal from '../PreviewPicture/index';
import EnumerableInput from '../EnumerableInput.vue';
import ExtentionInput from '../ExtentionInput.vue';
import getComponentName from '../../__utils__/getModuleName'

// const fkHttpRequest = () => require(`../../__config__/actions/version_${Version()}/formHttpRequest/fkHttpRequest.js`);

export default {
  components: {
    EnumerableInput, ExtentionInput, ComAttachFilter, Docfile, ValidateCom
  },
  // mixins: [mixins],
  // inject: [MODULE_COMPONENT_NAME],
  props: {
    webConfSingle: {// 当前子表webConf
      type: Object,
      default: () => ({})
    },
    labelWidth: {
      type: Number,
      default: 120
    },
    items: {
      type: Object,
      default () {
        return {};
      }
    },
    component: {
      type: Object,
      default () {
        return {};
      }
    },
    index: {
      type: Number,
      default () {
        return 0;
      }
    },
    formIndex: {
      type: Number,
      default () {
        return 0;
      }
    },
    type: {
      type: String,
      default () {
        return '';
      }
    }
  },
  data () {
    return {
      filterDate: {},
      resultData: {}, // 结果传值
      componentsName:'',// 组件名称
      show:false,// 是否展示报错内容
      propsMessage:{

      }, // 各个组件的props
      errorTip: '',
      value: '', //实时数据
    };
  },
  computed: {
    ...mapState('global', {
      activeTab: ({ activeTab }) => activeTab
    }),
    getVersion () {
      return Version;
    },
    labelStyle () {
      let style = '';
      style = `flex: 0 0 ${this.labelWidth}px;`;
      return style;
    },
    _items () {
      if (defaultrange()) {
        dataProp.DropDownSelectFilter.props.pageSize = defaultrange();
        dataProp.DropMultiSelectFilter.props.pageSize = defaultrange();
      }

      // 将设置的props和默认props进行assign
      const item = this.items;
      // const item = this.items;
      item.props = Object.assign(
        {},
        item.type ? dataProp[item.type] && dataProp[item.type].props : {},
        this.items.props
      );


      const placeholder = this.items.props.webconf && this.items.props.webconf.placeholder ? this.items.props.webconf.placeholder : null;
      item.props.placeholder = placeholder || `${(dataProp[item.type] && dataProp[item.type].props) ? dataProp[item.type].props.placeholder : '请输入'}${item.title}`;


      if (item.type === 'docfile') {
        if (!Array.isArray(item.props.itemdata.valuedata)) {
          item.props.itemdata.valuedata = [];
        }
      }

      if (item.type === 'AttachFilter') {
        // 大弹窗卡槽页面
        if (item.props.fkdisplay === 'pop') {
          // item.componentType = myPopDialog;
          if (!item.props.disabled) {
            item.props.fkobj.show = false;
          }
        } else {
          // item.componentType = Dialog;
          if (!item.props.disabled) {
            item.props.fkobj.show = true;
            if (!item.props.datalist[0] || item.props.datalist[0].value !== '更多筛选') {
              item.props.datalist = dataProp[item.type].props.datalist.concat(
                item.props.datalist
              );
            }
          }


          item.props.dialog.model['footer-hide'] = false;
          item.props.datalist.forEach((option, i) => {
            if (option.value === '导入') {
              item.props.datalist[i].url = item.props.fkobj.url;
              item.props.datalist[i].sendData = {
                table: item.props.fkobj.reftable
              };
            }
          });
        }
      }
      // eslint-disable-next-line no-empty
      if (item.type === 'Wangeditor') {
        item.componentType = WangeditorVue;
      }

      if (item.type === 'input' && (item.props.webconf && item.props.webconf.display === 'YearMonth')) {
        item.type = 'DatePicker';
        item.props = Object.assign({}, item.props, {
          type: 'month',
          clearable: true
        });
      }
      item.event = Object.assign({}, this.items.event);

      return item;
    },
    filterList () {
      // 气泡选中过滤条件
      return this.filterDate;
    },

    showLabel() {
      if (this._items.webconf && this._items.webconf.hiddenLabel) {
        return false
      }
      return true
    }
  },
  methods: {
    ...mapMutations('global', ['tabOpen', 'addKeepAliveLabelMaps', 'addServiceIdMap']),
    inheritanceComponents () {
      let component = null;
      // 兼容webcof
      if(this.items.dynamicforcompute){
         if(!this.items.webconf){
           this.items.webconf = {
              dynamicforcompute:{}
           };
         }else{
           this.items.webconf.dynamicforcompute = {}
         }

          this.items.webconf.dynamicforcompute = this.items.dynamicforcompute;
      }
      let item = this.items;

      let componentInstance = null
      switch (item.display) {
        case undefined:
        case 'none':
        case 'OBJ_TEXTAREA':
          componentInstance = new CustomInput(item).init();
          break;
        case 'OBJ_FK':
          if (item.fkobj.searchmodel === 'drp') {
            componentInstance = new BusDropDownSelectFilter(item).init();
          }
          if (item.fkobj.searchmodel === 'mrp') {
            componentInstance = new CustomDropMultiSelectFilter(item).init();
          }
          if (item.fkobj.searchmodel === 'mop') {
            componentInstance = new CustomAttachFilter(item).init();
          }
          if (item.fkobj.searchmodel === 'pop') {
            componentInstance = new CustomPopAttachFilter(item).init();
          }
          break;
        case 'OBJ_DATE':
        case 'OBJ_DATENUMBER':
        case 'YearMonth':
        case 'OBJ_DATETIME':
        case 'OBJ_TIME':
          componentInstance = new CustomDatePicker(item).init();
          break;
        case 'OBJ_SELECT':
        case 'RADIO_GROUP':
        case 'CHECKBOX_GROUP':
          // 列表界面把radio-group渲染成select
          // 列表界面把checkbox-group渲染成select
          const typeList = ['RADIO_GROUP', 'CHECKBOX_GROUP']
          if(!item.detailType && typeList.includes(item.display)) {
            item.display = 'OBJ_SELECT'
          }
          componentInstance = new CustomSelect(item).init();
          break;
        case 'OBJ_CHECK':
          componentInstance = new CustomCheckbox(item).init();
          break;
        case 'image':
          componentInstance = new CustomImageUpload(item).init();
          break;
        case 'OBJ_DOC':
          componentInstance = new CustomDocUpload(item).init();
          break;
        case 'clob':
          componentInstance = new CustomWangeditor(item).init();
          break;
        case 'Enumerate':
          componentInstance = new CustomEnumerableInput(item).init();
          break;
        case 'ExtensionProperty':
          componentInstance = new CustomExtensionProperty(item).init();
          break;
        case 'radioGroup':
          componentInstance = new CustomRadioGroup(item).init();
          break;
        case 'checkboxgroup': 
          componentInstance = new CustomCheckboxGroup(item).init();
          break;
        case 'String': 
          componentInstance = new CustomStringRender(item).init();
          break;
        case 'defined': 
          componentInstance = new CustomDefined(item).init();
          break;
        default:
          break;
      }
      if(componentInstance){
         component = componentInstance.Components || '';
        this.propsMessage = componentInstance.props || {};
        // 是否有外部配置
        this.propsMessage = Object.assign(
          this.propsMessage, (setComponentsProps())(this.items.display, this.propsMessage)
        );

      }

      return component;
    },
    routerNext () {
      // 路由跳转
      const props = this.items;
      const type = props.objdisplay;
      const serviceId = props.serviceId;

      // console.log(this._items.props);
      const tableName = props.reftable;
      const tableId = props.reftableid;
      const label = this._items.props.fkdesc;
      // xhj修改，改为使用tabOpen方法，以下存serviceId逻辑已弃用

      let value = this.value;
      console.log(this.value,props);
      let id = 0;
      if (!props.readonly) {
        id = value[0].ID;
      } else {
        id = props.refobjid;
      }
      // xhj修改，改为根据接口返回的objdisplay类型跳转
      let types = '';
      if (type === 'tabpanle') { // 上下结构
        types = 'tableDetailHorizontal';
      } else if (type === 'object') {
        types = 'tableDetailVertical';
      } else {
        const data = {
          mask: true,
          title: '警告',
          content: '请设置外键关联表的显示配置'
        };
        this.$Modal.fcWarning(data);
        return;
      }
      window.sessionStorage.setItem('dynamicRoutingForHideBackButton', true);
      this.tabOpen({
        type: types,
        tableName,
        tableId,
        id,
        label,
        serviceId
      });
    },
    valueChange () {
      // 值发生改变时触发  只要是item中的value改变就触发该方法，是为了让父组件数据同步
      // console.log(this._items);
      this.value = this._items.value;
      // this.$emit('inputChange', this._items.value, this._items, this.index);
    },
    clearItem () {
      if (this._items.props.defaultSelected) {
        this._items.props.defaultSelected = [{
          ID: '',
          Label: ''
        }];
        this._items.value = this._items.props.defaultSelected;
      } else if (this._items.props.selected) {
        this._items.props.selected = [{
          ID: '',
          Label: ''
        }];
        this._items.value = '';
      } else if (this._items.type === 'select') {
        this._items.value = '';
      }
      this.valueChange();
    },
    setListenerSetProps (e) {
      if (e.value.type === 'equal') {
        // 表单赋值
        if (!Array.isArray(e.value.list)) {
          return false;
        }
        e.value.list.forEach((item) => {
          if (this._items.props.tableGetName !== e.value.tableName) {
            return false;
          }
          if (this._items.field === item.COLUMN_NAME || this._items.inputname === item.COLUMN_NAME) {
            if (e.value.key === this._items.field) {
              return false;
            }
            // 隐藏且配置了this._items.props.webconf
            // if (this._items.props.webconf && this._items.props.webconf.clearWhenHidden) {
            //   return false;
            // }
            if (item.COLUMN_TYPE === 0) {
              // 数组形式
              if (this._items.props.defaultSelected) {
                this._items.props.defaultSelected = [{
                  ID: item.LABLE_VALUES[0].VALUE || '',
                  Label: item.LABLE_VALUES[0].LABLE || ''
                }];
                this._items.props.refobjid = item.LABLE_VALUES[0].VALUE;
                this._items.value = this._items.props.defaultSelected;
              } else if (this._items.props.Selected) {
                this._items.props.Selected = [{
                  ID: item.LABLE_VALUES[0].VALUE || '',
                  Label: item.LABLE_VALUES[0].LABLE || ''
                }];
                this._items.props.refobjid = item.LABLE_VALUES[0].VALUE;
                this._items.value = item.LABLE_VALUES[0].LABLE;
              } else if (this._items.type === 'select') {
                this._items.value = item.LABLE_VALUES[0].VALUE || '';
              }
            } else if (item.COLUMN_TYPE === 1) {
              // INPUT
              if (this._items.type === 'checkbox') {
                this._items.value = item.LABLE_VALUES[0].VALUE || this._items.props.falseValue;
              } else {
                this._items.value = item.LABLE_VALUES[0].VALUE || '';
              }
            } else if (item.COLUMN_TYPE === 2) {
              const labelIput = [];
              this._items.props.defaultSelected = item.LABLE_VALUES.reduce((arr, options) => {
                if (options.VALUE) {
                  arr.push({
                    ID: options.VALUE || '',
                    Label: options.LABLE || ''
                  });
                  labelIput.push(options.LABLE);
                }

                return arr;
              }, []);
              this._items.value = this._items.props.defaultSelected;
            }
            this.valueChange();
          }
        });
      } else if (this._items.field === e.value.field) {
        // 表单修改属性
        if (!e.value.tableGetName) {
          e.value.tableGetName = '';
        }

        if (this._items.props.tableGetName !== e.value.tableGetName) {
          return false;
        }

        this._items.required = e.value.required;
        if (e.value.regx) {
          this._items.props.regx = e.value.regx;
        }
        // this._items.props = Object.assign(this._items.props, e.value.props);
        this._items.props.disabled = e.value.props.disabled;
        this._items.props.readonly = e.value.props.disabled;
        if (e.value.props.display === 'doc' || e.value.props.display === 'image') {
          this._items.props.itemdata.disabled = e.value.props.disabled;
          this._items.props.itemdata.readonly = e.value.props.disabled;
        }
      }
      return true;
    },
    setListenerSetLinkForm (e) {
      // 设置表单联动清空
      if (Object.hasOwnProperty.call(this._items.validate, 'refcolval')) {
        if (this._items.validate.refcolval.srccol === e.value.key) {
          if (e.value.tableName) {
            if (!this._items.validate.refcolval.maintable && this._items.props.tableGetName === e.value.tableName) {
              this.clearItem();
            }
          } else if (this._items.props.tableGetName === '' || this._items.validate.refcolval.maintable) {
            this.clearItem();
          }
        }
      }
    },
    setListenerSetHideForm (e) {
      const index = e.value.list.findIndex(x => x === this._items.field);

      if (index !== -1 && e.value.tableName === this._items.props.tableGetName) {
        setTimeout(() => {
          this.$parent.hidecolumn(this._items, this.index, e.value.data, 'mounted');
        }, 10);
      }
    },
    setListenerDynam (e) {
      if (this._items.props.colname === e.value.dynamicforcompute.computecolumn) {
        setTimeout(() => {
          this.$parent.dynamicforcompute(e.value);
        }, 10);
      }
    },

    uploadFileDblclick (array = [], index) { // 图片预览双击
      const { itemId } = this.$route.params;
      const obj = {
        field: `${this.items.field}_${itemId}`
      };
      createModal(array, obj, index);
    },

    resetItem () {
      this.value = new ParameterDataProcessing(JSON.parse(JSON.stringify(this.items))).defaultDataProcessing();
    },
    getLable(){
      return new ParameterDataProcessing(JSON.parse(JSON.stringify(this.items)),this.value).getLable();
    }

  },
  beforeDestroy () {
    window.removeEventListener(`${this.moduleComponentName}setProps`, this.setListenerSetProps);
    window.removeEventListener(`${this.moduleComponentName}setLinkForm`, this.setListenerSetLinkForm);
    window.removeEventListener(`${this.moduleComponentName}setHideForm`, this.setListenerSetHideForm);
    window.removeEventListener(`${this.moduleComponentName}Dynam`, this.setListenerDynam);
  },
  created () {
    this[MODULE_COMPONENT_NAME] = getComponentName()
    this.componentsName = this.inheritanceComponents();
  },
  mounted () {
    window.addEventListener(`${this.moduleComponentName}setProps`, this.setListenerSetProps);
    window.addEventListener(`${this.moduleComponentName}setLinkForm`, this.setListenerSetLinkForm);
    window.addEventListener(`${this.moduleComponentName}setHideForm`, this.setListenerSetHideForm);
    window.addEventListener(`${this.moduleComponentName}Dynam`, this.setListenerDynam);
    this.resetItem()
  }
};
</script>

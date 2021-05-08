/* eslint-disable import/no-dynamic-require */
<template>
 <ValidateCom 
    :rules="items.rules"
    :labelWidth="labelWidth"
    :show-tip="items.detailType"
    :value="value">
  <div :class="_items.props.fkdisplay === 'pop' ? 'ItemComponentRoot AttachFilter-pop':'ItemComponentRoot'">
   

      <span class="itemLabel"
            :style="labelStyle">
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

        <span :title="items.coldesc">{{ items.coldesc }}:</span>
      </span>
      <div :class=" [_items.props.row >1 ? 'itemComponent height100':'itemComponent',items.isuppercase?'isuppercase':'']"
           :style="_items.props.type==='ImageUpload' ? 'overflow:visible' :''">
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
                   :ref="items.field"
                    v-bind="propsMessage"
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
                   :ref="_items.field"
                   v-model="value"
                    v-on="$listeners"
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

import ParameterDataProcessing from './parameterDataProcessing';
import { Validate } from './PanelForm/Validate';

// 验证组件的插件
let ValidateCom = new Validate().init();
import {
  Version, MODULE_COMPONENT_NAME, ossRealtimeSave, defaultrange
} from '../../constants/global';
import createModal from '../PreviewPicture/index';
import EnumerableInput from '../EnumerableInput.vue';
import ExtentionInput from '../ExtentionInput.vue';


const fkHttpRequest = () => require(`../../__config__/actions/version_${Version()}/formHttpRequest/fkHttpRequest.js`);


export default {
  components: {
    EnumerableInput, ExtentionInput, ComAttachFilter, Docfile, ValidateCom
  },
  // mixins: [mixins],
  inject: [MODULE_COMPONENT_NAME],
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
      style = `width:${this.labelWidth}px`;
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
  },
  methods: {
    ...mapMutations('global', ['tabOpen', 'addKeepAliveLabelMaps', 'addServiceIdMap']),
    inheritanceComponents () {
      let Components = null;
      let item = this.items;
      let props = {}
      switch (item.display) {
        case undefined:
        case 'OBJ_TEXTAREA':
           let ComponentcollectionInput = new CustomInput(item).init();
            Components = ComponentcollectionInput.Components;
            props = ComponentcollectionInput.props;
          break;
        case 'OBJ_FK':
          if (item.fkobj.searchmodel === 'drp') {
          let Componentcollection = new BusDropDownSelectFilter(item).init();
            Components = Componentcollection.Components;
            props = Componentcollection.props;
          }
          if (item.fkobj.searchmodel === 'mrp') {
          let Componentcollectionmrp = new CustomDropMultiSelectFilter(item).init();
            Components = Componentcollectionmrp.Components;
            props = Componentcollectionmrp.props;
          }
          if (item.fkobj.searchmodel === 'mop') {
             let Componentcollectionmop = new CustomAttachFilter(item).init();
              Components = Componentcollectionmop.Components;
              props = Componentcollectionmop.props;
          }
          if (item.fkobj.searchmodel === 'pop') {
            let Componentcollectionpop = new CustomPopAttachFilter(item).init();
              Components = Componentcollectionpop.Components;
              props = Componentcollectionpop.props;
          }
          break;
        case 'OBJ_DATE':
        case 'OBJ_DATENUMBER':
        case 'YearMonth':
        case 'OBJ_DATETIME':
        case 'OBJ_TIME':
          let Componentcollectiontime = new CustomDatePicker(item).init();
            Components = Componentcollectiontime.Components;
            props = Componentcollectiontime.props;
          break;
        case 'OBJ_SELECT':
          let Componentcollectionselect = new CustomSelect(item).init();
          Components = Componentcollectionselect.Components;
          props = Componentcollectionselect.props;
          break;
        case 'OBJ_CHECK':
          let Componentcollectioncheck = new CustomCheckbox(item).init();
          Components = Componentcollectioncheck.Components;
          props = Componentcollectioncheck.props;

          break;
        case 'image':
           let Componentcollectionimage = new CustomImageUpload(item).init();
          Components = Componentcollectionimage.Components;
          props = Componentcollectionimage.props;
          break;
        case 'OBJ_DOC':
          let Componentcollectiondoc = new CustomDocUpload(item).init();
          Components = Componentcollectiondoc.Components;
          props = Componentcollectiondoc.props;
          break;
        case 'clob':
          let Componentcollectionclob = new CustomWangeditor(item).init();
          Components = Componentcollectionclob.Components;
          props = Componentcollectionclob.props;
          break;
        case 'Enumerate':
           let ComponentcollectionEnumerate = new CustomEnumerableInput(item).init();
          Components = ComponentcollectionEnumerate.Components;
          props = ComponentcollectionEnumerate.props;
          break;
        case 'ExtensionProperty':
          const componentObj = new CustomExtensionProperty(item).init();
          Components = componentObj.Components;
          props = componentObj.props;
          break;
        default:
          break;
      }
      this.propsMessage = props;
      return Components;
    },
    routerNext (value) {
      // 路由跳转
      const props = this._items.props;
      const type = props.objdisplay;
      const serviceId = props.serviceId;

      // console.log(this._items.props);
      const tableName = props.reftable;
      const tableId = props.reftableid;
      const label = this._items.props.fkdesc;
      // xhj修改，改为使用tabOpen方法，以下存serviceId逻辑已弃用

      // const serviceIdMap = JSON.parse(window.sessionStorage.getItem('serviceIdMap'));
      // const addname = `S.${tableName}.${props.reftableid}`;
      // this.addKeepAliveLabelMaps({
      //   name: addname,
      //   label
      // });
      // updateSessionObject('keepAliveLabelMaps', { k: addname, v: label });
      // if (props.serviceId) {
      //   if (Version() === '1.4') {
      //     serviceIdMap[tableName] = props.serviceId;
      //     window.sessionStorage.setItem('serviceIdMap', JSON.stringify(serviceIdMap));
      //     this.addServiceIdMap({
      //       tableName,
      //       gateWay: props.serviceId
      //     });
      //   }
      // }

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
    }

  },
  beforeDestroy () {
    window.removeEventListener(`${this.moduleComponentName}setProps`, this.setListenerSetProps);
    window.removeEventListener(`${this.moduleComponentName}setLinkForm`, this.setListenerSetLinkForm);
    window.removeEventListener(`${this.moduleComponentName}setHideForm`, this.setListenerSetHideForm);
    window.removeEventListener(`${this.moduleComponentName}Dynam`, this.setListenerDynam);
  },
  created () {
    this.componentsName = this.inheritanceComponents(this.items);
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

<style lang="less" >
.ItemComponentRoot {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 8px;

  .itemLabel {
    margin-right: 4px;
    text-align: right;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    line-height: 16px;
    // display: flex;
    // align-items: center;
    // justify-content: flex-end;

    i {
      font-size: 12px;
      color: red;
    }
  }

  .itemComponent {
    flex: 1;
    overflow: hidden;
    display: flex;
    align-items: center;

    > div {
      flex: 1;
    }
  }
  .label-tip {
    color: red;
    font-size: 16px;
    vertical-align: middle;
    position: relative;
    top: 3px;
    right: 3px;
  }
  

  // 处理大小写转换
  .isuppercase {
    input {
      text-transform: uppercase;
    }
  }
}
.panelForm{
  .ItemComponentRoot{
      padding-top: 0px;
    }
}
.validate_item {
    // display: inline-block;
    // width: 100%;
    // box-sizing: border-box;
    // vertical-align: middle;
    // font-size: 12px;
    
    .validate_item_tip {
      height: 16px;
      font-size: 12px;
      line-height: 12px;
       .iconios-alert {
          margin: 4px;
          color: red;
          font-size: 12px;
        }
        span {
          color: red;
          line-height: 20px;
          word-break: keep-all;
          display: inline-block;
        }
    }
  }
textarea.ark-input {
  // height: 100%!important;
  resize: auto;
}

.AttachFilter-pop {
  .icon-bj_tcduo:before {
    content: "\e6b1";
  }
  .icon-bj_tcduo {
    padding-top: 2px;
  }
}
.Wangeditor-disabled {
  border: 1px solid #d8d8d8;
  background-color: #f4f4f4;
  overflow: auto;
  padding: 2px 5px;
  height: 100%;
}
.auto-com-table tr td {
  max-width: 500px !important;
}
.attachfiter-pop {
  .ark-select-item {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    .iconbj_delete2 {
      display: none;
      width: 12px;
      height: 12px;
      font-size: 12px;
      line-height: 12px;
    }
    &:hover {
      .iconbj_delete2 {
        border-radius: 100%;
        overflow: hidden;
        display: block;
        background-color: #e6502f;
        color: #fff;
      }
    }
  }
}
</style>

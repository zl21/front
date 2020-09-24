/* eslint-disable import/no-dynamic-require */
<template>
  <div :class="_items.props.fkdisplay === 'pop' ? 'ItemComponentRoot AttachFilter-pop':'ItemComponentRoot'">
    <span
      class="itemLabel"
      :style="labelStyle"
    >
      <Poptip
        v-if="_items.props.comment"
        word-wrap
        trigger="hover"
        transfer
        width="200"
        :content="_items.props.comment"
      >
        <div
          slot="content"
          class="api"
        >
          <span><span>{{ _items.props.comment }}</span>
            <a
              v-if="_items.props.webconf && _items.props.webconf.Outside"
              style=""
              :href="_items.props.webconf.Outside"
              target="_blank"
            >...</a>
          </span>
        </div>  
        <i class="iconfont iconios-information-circle-outline" />
      </Poptip>
      <span
        v-if="_items.required"
        class="label-tip"
      >*</span>
      <template v-if=" _items.props.fkdisplay === 'pop' && type==='PanelForm'">
        <!-- 路由跳转 -->
        <template v-if="!!_items.value &&_items.props.Selected &&_items.props.Selected[0] && !!_items.props.Selected[0].ID && _items.props.Selected[0].ID !=='-1'&& _items.props.Selected[0].ID !==0 && _items.props.Selected[0].ID !=='0'">
          <i
            class="iconfont iconbj_link"
            data-target-tag="fkIcon"
            style="color: #0f8ee9; cursor: pointer; font-size: 12px"
            @click="routerNext(_items.props.Selected)"
          />
        </template>

      </template>
      <template v-if=" _items.props.fkdisplay === 'drp' && type==='PanelForm'">
        <!-- 路由跳转 -->
        <template v-if="!!_items.value && _items.props.defaultSelected && _items.props.defaultSelected[0] && !!_items.props.defaultSelected[0].ID && _items.props.defaultSelected[0].ID !=='-1'&& _items.props.defaultSelected[0].ID !=='0'&& _items.props.defaultSelected[0].ID !==0">
          <i
            class="iconfont iconbj_link"
            data-target-tag="fkIcon"
            style="color: #0f8ee9; cursor: pointer; font-size: 12px"
            @click="routerNext(_items.props.defaultSelected)"
          />
        </template>

      </template>

      <span :title="_items.title">{{ _items.title }}:</span>
    </span>
    <div
      :class=" _items.props.row >1 ? 'itemComponent height100':'itemComponent'"
      :style="_items.props.type==='ImageUpload' ? 'overflow:visible' :''"
    >
      <Input
        v-if="_items.type === 'input'"
        :ref="_items.field"
        v-model="_items.value"
        :type="_items.props.type"
        :clearable="_items.props.clearable"
        :disabled="_items.props.disabled"
        :readonly="_items.props.readonly"
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
      />

      <Checkbox
        v-if="_items.type === 'checkbox'"
        :ref="_items.field"
        v-model="_items.value"
        :disabled="_items.props.disabled"
        :true-value="_items.props.trueValue"
        :false-value="_items.props.falseValue"
        :size="_items.props.size"
        :circle="_items.props.circle"
        @on-change="checkBoxChange"
      />

      <Select
        v-if="_items.type === 'select'"
        :ref="_items.field"
        v-model="_items.value"
        :clearable="_items.props.clearable"
        :multiple="_items.props.multiple"
        :multiple-type="_items.props.multipleType"
        :disabled="_items.props.disabled"
        :placeholder="!_items.props.disabled? _items.props.placeholder:''"
        :not-found-text="_items.props['not-found-text']"
        :label-in-value="_items.props['label-in-value']"
        :choose-all="items.props.chooseAll"
        :placement="_items.props.placement"
        :transfer="_items.props.transfer"
        :options-visible="_items.props.optionsVisible"
        @on-change="selectChange"
        @on-clear="selectClear"
        @on-open-change="selectOpenChange"
      >
        <Option
          v-for="item in _items.options"
          :key="item.value"
          :value="item.value"
          :disabled="item.disabled"
        >
          {{ item.label }}
        </Option>
      </Select>

      <DatePicker
        v-if="_items.type === 'DatePicker'"
        :ref="_items.field"
        :value="_items.value"
        :type="_items.props.type"
        :transfer="_items.props.transfer"
        :format="_items.props.format"
        :placement="_items.props.placement"
        :placeholder="!_items.props.disabled? _items.props.placeholder:''"
        :options="_items.props.options"
        :open="_items.props.open"
        :confirm="_items.props.confirm"
        :size="_items.props.size"
        :disabled="_items.props.disabled"
        :clearable="_items.props.clearable"
        :readonly="_items.props.readonly"
        :editable="_items.props.editable"
        @on-change="($event,event,instance) => datePickerChange(_items.value=$event,event,instance,_items.props.type)"
        @on-clear="datePickerClear"
      />
      <TimePicker
        v-if="_items.type === 'TimePicker'"
        :ref="_items.field"
        v-model="_items.value"
        :type="_items.props.type"
        :transfer="_items.props.transfer"
        :steps="_items.props.steps"
        :format="_items.props.format"
        :placement="_items.props.placement"
        :placeholder="!_items.props.disabled? _items.props.placeholder:''"
        :open="_items.props.open"
        :confirm="_items.props.confirm"
        :size="_items.props.size"
        :disabled="_items.props.disabled"
        :clearable="_items.props.clearable"
        :readonly="_items.props.readonly"
        :editable="_items.props.editable"
        @on-change="timePickerChange"
        @on-clear="timePickerClear"
      />
      <template v-if="_items.type === 'DropDownSelectFilter'">
        <DropDownSelectFilter
          v-if="_items.props.fk_type === 'drp'"
          :ref="_items.field"
          :class-name="'R3-'+_items.field"
          :data="_items.props.data"
          :single="_items.props.single"
          :placeholder="!_items.props.disabled? _items.props.placeholder:''"
          :total-row-count="_items.props.totalRowCount"
          :page-size="_items.props.pageSize"
          :auto-data="_items.props.AutoData"
          :disabled="_items.props.disabled"
          :is-show-pop-tip="_items.props.isShowPopTip"
          :enter-type="_items.props.enterType"
          :hidecolumns="_items.props.hidecolumns"
          :data-empty-message="_items.props.dataEmptyMessage"
          :default-selected="_items.props.defaultSelected"
          :transfer="_items.props.transfer"
          @on-fkrp-selected="fkrpSelected"
          @on-page-change="pageChange"
          @on-input-value-change="inputValueChange"
          @on-focus="fkrpSelectedInputFocus"
          @on-blur="fkrpSelectedInputBlur"
          @on-keyup="fkrpSelectedInputKeyup"
          @on-keydown="fkrpSelectedInputKeydown"
          @on-popper-show="fkrpSelectedPopperShow"
          @on-popper-hide="fkrPopperHide"
          @on-clear="fkrpSelectedClear"
        />
        <DropMultiSelectFilter
          v-if="_items.props.fk_type === 'mrp'"
          :ref="_items.field"
          :data="_items.props.data"
          :class-name="'R3-'+_items.field"
          :single="_items.props.single"
          :placeholder="!_items.props.disabled? _items.props.placeholder:''"
          :total-row-count="_items.props.totalRowCount"
          :page-size="_items.props.pageSize"
          :auto-data="_items.props.AutoData"
          :disabled="_items.props.disabled"
          :is-show-pop-tip="_items.props.isShowPopTip"
          :enter-type="_items.props.enterType"
          :hidecolumns="_items.props.hidecolumns"
          :data-empty-message="_items.props.dataEmptyMessage"
          :default-selected="_items.props.defaultSelected"
          :transfer="_items.props.transfer"
          @on-fkrp-selected="fkrpSelected"
          @on-page-change="pageChange"
          @on-input-value-change="inputValueChange"
          @on-focus="fkrpSelectedInputFocus"
          @on-blur="fkrpSelectedInputBlur"
          @on-keyup="fkrpSelectedInputKeyup"
          @on-popper-show="fkrpSelectedPopperShow"
          @on-popper-hide="fkrPopperHide"
          @on-clear="fkrpSelectedClear"
        />
      </template>
      <ComAttachFilter
        v-if="_items.type === 'AttachFilter'"
        :ref="_items.field"
        :default-value="_items.value"
        :default-selected="_items.props.Selected"
        :propstype="_items.props"
        @keydown="attachFilterInputKeydown"
        @valuechange="attachFilterInput"
      />
      <!-- <AttachFilter
        v-if="_items.type === 'AttachFilter'"
        v-model="_items.value"
        :option-tip="_items.props.optionTip"
        :filter-tip="_items.props.filterTip"
        :enter-type="_items.props.enterType"
        :disabled="_items.props.disabled"
        :placeholder="_items.props.placeholder"
        :auot-data="_items.props.AutoData"
        :columns="_items.props.columns"
        :dialog="_items.props.dialog"
        :show="_items.props.show"
        :default-selected="_items.props.Selected"
        :datalist="_items.props.datalist"
        @on-show="attachFilterPopperShow"
        @input="attachFilterInput"
        @on-change="attachFilterChange"
        @on-select="attachFilterSelected"
        @on-focus="attachFilterInputFocus"
        @on-blur="attachFilterInputBlur"
        @on-keyup="attachFilterInputKeyup"
        @on-keydown="attachFilterInputKeydown"
        @on-ok="attachFilterOk"
        @on-cancel="attachFilterCancel"
        @on-popclick="attachFilterPopclick"
        @on-clear="attachFilterClear"
        @on-uploadFile="attachFile"
      >
        <div
          v-if="_items.componentType"
          slot="daigo"
        >
          <component
            :is="_items.componentType"
            ref="complex"
            :fkobj="_items.props.fkobj"
            :filter="filterList"
          />
        </div>
      </AttachFilter>
 -->
      <ImageUpload
        v-if="_items.type === 'ImageUpload'"
        :ref="_items.field"
        :dataitem="_items.props.itemdata"
        @deleteImg="deleteImg"
        @uploadFileChangeSuccess="uploadFileChangeSuccess"
        @uploadFileChangeOnerror="uploadFileChangeOnerror"
        @dblclick="uploadFileDblclick"
      />
      <!--读写规则  -->
      <EnumerableInput
        v-if="_items.type === 'EnumerableInput'"
        :ref="_items.field"
        :default-value="_items.value"
        :disabled="_items.props.disabled"
        @keydown="enumerKeydown"
        @valueChange="enumerableValueChange"
      />
      <!--扩展属性  -->
      <ExtentionInput
        v-if="_items.type === 'ExtentionInput'"
        :ref="_items.field"
        :default-data="_items.value"
        :web-config="_items.props"
        @keydown="enumerKeydown"
        @valueChange="extentionValueChange"
      />
      <template v-if="_items.type === 'Wangeditor'">
        <component
          :is="_items.componentType"
          v-if="_items.type === 'Wangeditor'"
          :key="index"
          :ref="_items.field"
          :is-actives="_items.props.readonly"
          :valuedata="_items.value"
          :item="_items.props"
          @getChangeItem="getWangeditorChangeItem"
        />
      </template>
      <!-- <template v-if="_items.type === 'Wangeditor' && _items.props.disabled">
        <div
          class="Wangeditor-disabled"
          v-html="_items.value"
        />
      </template> -->
      <!-- 上传文件 -->
      <Docfile
        v-if="_items.type === 'docfile'"
        :ref="_items.field"
        :item-webconf="_items.props.webconf"
        :web-conf-single="webConfSingle"
        :dataitem="_items.props.itemdata"
        @filechange="filechange"
      />
    </div>
  </div>
</template>

<script>
  
  import { mapMutations } from 'vuex';
  
  import dataProp from '../__config__/props.config';
  // 弹窗多选面板
  // import Dialog from './ComplexsDialog';
  // 弹窗单选
  // import myPopDialog from './PopDialog';
  // 富文本编辑
  import WangeditorVue from './Wangeditor';
  //   弹窗单选 弹窗多选
  import ComAttachFilter from './ComAttachFilter';
  //   上传文件
  import Docfile from './docfile/DocFileComponent';


  import { Version, MODULE_COMPONENT_NAME, ossRealtimeSave } from '../constants/global';
  import createModal from './PreviewPicture/index.js';
  import EnumerableInput from './EnumerableInput';
  import ExtentionInput from './ExtentionInput';


  const fkHttpRequest = () => require(`../__config__/actions/version_${Version()}/formHttpRequest/fkHttpRequest.js`);

  export default {
    name: 'ItemComponent',
    components: {
      EnumerableInput, ExtentionInput, ComAttachFilter, Docfile
    },
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
        default() {
          return {};
        }
      },
      component: {
        type: Object,
        default() {
          return {};
        }
      },
      index: {
        type: Number,
        default() {
          return 0;
        }
      },
      formIndex: {
        type: Number,
        default() {
          return 0;
        }
      },
      type: {
        type: String,
        default() {
          return '';
        }
      }
    },
    data() {
      return {
        filterDate: {},
        resultData: {} // 结果传值
      };
    },
    computed: {
      labelStyle() {
        let style = '';
        style = `width:${this.labelWidth}px`;
        return style;
      },
      _items() {
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
            // item.props.datalist.forEach((option, i) => {
            //   if (option.value === '导入') {
            //     item.props.datalist[i].url = item.props.fkobj.url;
            //     item.props.datalist[i].sendData = {
            //       table: item.props.fkobj.reftable
            //     };
            //   }
            // });
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
      filterList() {
        // 气泡选中过滤条件
        return this.filterDate;
      }
    },
    methods: {
      ...mapMutations('global', ['tabOpen', 'addKeepAliveLabelMaps', 'addServiceIdMap']),
      routerNext(value) {
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
      valueChange() {
        // 值发生改变时触发  只要是item中的value改变就触发该方法，是为了让父组件数据同步
        this.$emit('inputChange', this._items.value, this._items, this.index);
      },
      // input event
      inputChange(event, $this) {
        this.valueChange();
        let valLength = this._items.props.length;
        if (valLength) {
          if (this._items.value.split('.').length > 1) {
            valLength = this._items.props.length + 1;
          } else if (this._items.value.split('-').length > 1) {
            valLength = this._items.props.length + 1;
          }
          if (this._items.value.split('.').length > 1 && this._items.value.split('-').length > 1) {
            valLength = this._items.props.length + 2;
          }
          let string = '';
          let regxString = '';
          if (this._items.props.webconf && this._items.props.webconf.ispositive) {
            regxString = '';
          } else {
            regxString = '(-|\\+)?';
          }
          if (this._items.props.scale > 0) {
            string = `^${regxString}\\d{0,${valLength}}(\\\.[0-9]{0,${
              this._items.props.scale
            }})?$`;
          } else {
            string = `^${regxString}\\d{0,${valLength}}(\\\.[0-9])?$`;
          }
          if (this._items.props.number) {
            const typeRegExp = new RegExp(string);
            this._items.props.regx = typeRegExp;
            this._items.props.maxlength = valLength;
          }
        }
      

        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'change')
          && typeof this._items.event.change === 'function'
        ) {
          this._items.event.change(event, $this);
        }
      },
      inputEnter(event, $this) {
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'enter')
          && typeof this._items.event.enter === 'function'
        ) {
          this._items.event.enter(event, $this);
        }
      },
      inputClick(event, $this) {
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'click')
          && typeof this._items.event.click === 'function'
        ) {
          this._items.event.click(event, $this);
        }
      },
      inputFocus(event, $this) {
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'focus')
          && typeof this._items.event.focus === 'function'
        ) {
          this._items.event.focus(event, $this);
        }
      },
      inputBlur(event, $this) {
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'blur')
          && typeof this._items.event.blur === 'function'
        ) {
          this._items.event.blur(event, $this, this._items);
        }
      },
      inputKeyUp(event, $this) {
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'keyup')
          && typeof this._items.event.keyup === 'function'
        ) {
          this._items.event.keyup(event, $this);
        }
      },
      inputKeyDown(event, $this) {
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'keydown')
          && typeof this._items.event.keydown === 'function'
        ) {
          this._items.event.keydown(event, $this);
        }
      },
      inputKeyPress(event, $this) {
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'keypress')
          && typeof this._items.event.keypress === 'function'
        ) {
          this._items.event.keypress(event, $this);
        }
      },
      inputRegxCheck(value, $this, errorValue) {
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'regxCheck')
          && typeof this._items.event.regxCheck === 'function'
        ) {
          this._items.event.regxCheck(value, $this, errorValue);
        }
      },

      // checkbox event
      checkBoxChange(value, $this) {
        this.valueChange();
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'change')
          && typeof this._items.event.change === 'function'
        ) {
          this._items.event.change(value, $this);
        }
      },

      // select input
      selectChange(value, $this) {
        this._items.value = value;
        this.valueChange();
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'change')
          && typeof this._items.event.change === 'function'
        ) {
          this._items.event.change(value, $this);
        }
      },
      selectClear($this) {
        this._items.value = '';
        this.valueChange();
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'clear')
          && typeof this._items.event.clear === 'function'
        ) {
          this._items.event.clear($this);
        }
      },
      selectOpenChange(value, $this) {
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'openChange')
          && typeof this._items.event.openChange === 'function'
        ) {
          this._items.event.openChange(value, $this);
        }
      },

      // datepick event
      datePickerChange(value, type, $this) {
        this._items.value = value;
        this.valueChange();
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'change')
          && typeof this._items.event.change === 'function'
        ) {
          this._items.event.change(value, $this);
        }
      },
      datePickerClear($this) {
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'clear')
          && typeof this._items.event.clear === 'function'
        ) {
          this._items.event.clear($this);
        }
      },

      // TimePicker event
      timePickerChange(value, timeType, $this) {
        this.valueChange();
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'change')
          && typeof this._items.event.change === 'function'
        ) {
          this._items.event.change(value, $this);
        }
      },
      timePickerClear($this) {
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'clear')
          && typeof this._items.event.clear === 'function'
        ) {
          this._items.event.clear($this);
        }
      },

      // fkrpSelected event
      fkrpSelected(value, $this) {
        if (value[0] && (!value[0].ID || value[0].ID === '-1')) {
          value.splice(0, 1);
        }
        this._items.value = value;
        this.valueChange();
        if (
          Object.prototype.hasOwnProperty.call(
            this._items.event,
            'fkrpSelected'
          )
          && typeof this._items.event.fkrpSelected === 'function'
        ) {
          this._items.event.fkrpSelected(value, $this);
        }
      },
      inputValueChange(value, $this) {
        this._items.value = value;
        this.valueChange();
        if (
          Object.prototype.hasOwnProperty.call(
            this._items.event,
            'inputValueChange'
          )
          && typeof this._items.event.inputValueChange === 'function'
        ) {
          this._items.event.inputValueChange(value, $this);
        }
      },
      fkrpSelectedClear($this) {
        this._items.value = undefined;
        this._items.props.defaultSelected = [];
        this.valueChange();
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'clear')
          && typeof this._items.event.clear === 'function'
        ) {
          this._items.event.clear($this, this._items);
        }
        if (
          Object.prototype.hasOwnProperty.call(
            this._items.event,
            'inputValueChange'
          )
          && typeof this._items.event.inputValueChange === 'function'
        ) {
          this._items.event.inputValueChange('', $this);
        }
      },
      pageChange(value, $this) {
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'pageChange')
          && typeof this._items.event.pageChange === 'function'
        ) {
          this._items.event.pageChange(value, $this);
        }
      },
      fkrpSelectedInputFocus(event, $this) {
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'focus')
          && typeof this._items.event.focus === 'function'
        ) {
          this._items.event.focus(event, $this);
        }
      },
      fkrpSelectedInputBlur(event, $this) {
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'blur')
          && typeof this._items.event.blur === 'function'
        ) {
          this._items.event.blur(event, $this, this._items);
        }
      },
      fkrPopperHide(event, $this) {
        if (
          Object.prototype.hasOwnProperty.call(
            this._items.event,
            'on-popper-hide'
          )
          && typeof this._items.event['on-popper-hide'] === 'function'
        ) {
          this._items.event['on-popper-hide'](event, $this, this._items);
        }
      },
      fkrpSelectedInputKeyup(event, $this) {
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'keyup')
          && typeof this._items.event.keyup === 'function'
        ) {
          this._items.event.keyup(event, $this);
        }
      },
      fkrpSelectedInputKeydown(event, $this) {
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'keydown')
          && typeof this._items.event.keydown === 'function'
        ) {
          this._items.event.keydown(event, $this);
        }
      },
      fkrpSelectedPopperShow($this) {
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'on-show')
          && typeof this._items.event['on-show'] === 'function'
        ) {
          this._items.event['on-show']($this);
        }
      },
      ComAttachFilterkeydown() {

      },
      attachFilterInput(item) {
        this._items.value = item.value;
        this._items.props.Selected = item.selected;
        if (item.value === '') {
          if (
            Object.prototype.hasOwnProperty.call(this._items.event, 'clear')
            && typeof this._items.event.clear === 'function'
          ) {
            this._items.event.clear();
          }
        } else if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'valuechange')
          && typeof this._items.event.valuechange === 'function'
        ) {
          this._items.event.valuechange(item);
        }
        this.valueChange();
        // if (
        //   Object.prototype.hasOwnProperty.call(
        //     this._items.event,
        //     'popper-value'
        //   )
        //   && typeof this._items.event['popper-value'] === 'function'
        // ) {
        // console.log(item);
        //   this._items.event['popper-value'](
        //     $this,
        //     item.value,
        //     item.selected
        //   );
        // }
        // if (
        //   Object.prototype.hasOwnProperty.call(this._items.event, 'clear')
        //   && typeof this._items.event.clear === 'function'
        // ) {
        //   if (!item.value && !item.selected[0] && !item.selected[0].ID) {
        //     this._items.event.clear($this);
        //   }
        // }
        // if (
        //   Object.prototype.hasOwnProperty.call(
        //     this._items.event,
        //     'popper-value'
        //   )
        //   && typeof this._items.event['popper-value'] === 'function'
        // ) {
        //   this._items.event['popper-value']($this, value, 'change', this.index);
        // }
        // if (
        //   Object.prototype.hasOwnProperty.call(
        //     this._items.event,
        //     'inputValueChange'
        //   )
        //   && typeof this._items.event.inputValueChange === 'function'
        // ) {
        //   this._items.event.inputValueChange(item.value, $this);
        // }
      },

      // AttachFilter event
      attachFilterChange(value) {
        this._items.value = value;
        this.valueChange();
      },
      attachFilterSelected(row, $this) {
        this._items.value = row.label;
        this._items.props.selected = [
          {
            Label: row.label,
            ID: row.value
          }
        ];
        const selected = [
          {
            Label: row.label,
            ID: row.value
          }
        ];
        this.valueChange();
        if (
          Object.prototype.hasOwnProperty.call(
            this._items.event,
            'popper-value'
          )
          && typeof this._items.event['popper-value'] === 'function'
        ) {
          this._items.event['popper-value'](
            $this,
            row.label,
            selected,
            this.index
          );
        }
      },
      attachFilterInputFocus(event, $this) {
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'focus')
          && typeof this._items.event.focus === 'function'
        ) {
          this._items.event.focus(event, $this);
        }
      },
      attachFilterInputBlur(event, $this) {
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'blur')
          && typeof this._items.event.blur === 'function'
        ) {
          this._items.event.blur(event, $this, this._items);
        }
      },
      attachFilterInputKeyup(event, $this) {
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'keyup')
          && typeof this._items.event.keyup === 'function'
        ) {
          this._items.event.keyup(event, $this);
        }
      },
      attachFilterInputKeydown(event, $this) {
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'keydown')
          && typeof this._items.event.keydown === 'function'
        ) {
          this._items.event.keydown(event, $this);
        }
      },
      attachFilterPopclick(event, row, targName, $this) {
        if (targName !== 'I' && event !== 1) {
          // 打开弹窗
          $this.complexs = false;
          setTimeout(() => {
            $this.showModal = true;
            $this.complexs = true;
          }, 100);
          if (event !== 0) {
            this.filterDate = JSON.parse(row.label);
          }
        } else if (
          targName === 'I'
          && Object.prototype.hasOwnProperty.call(this._items.event, 'on-delete')
          && typeof this._items.event['on-delete'] === 'function'
        ) {
          this._items.event['on-delete']($this, this._items, row.key, this.index);
        }
      },
      attachFilterClear() {
        this._items.value = '';
        this.resultData = {};
        this._items.props.Selected = [
          {
            Label: '',
            ID: ''
          }
        ];
        this.valueChange();
        if (
          Object.prototype.hasOwnProperty.call(
            this._items.event,
            'inputValueChange'
          )
          && typeof this._items.event.inputValueChange === 'function'
        ) {
        // this._items.event.inputValueChange('', $this);
        }
      },
      attachFilterPopperShow($this) {
        if (
          Object.prototype.hasOwnProperty.call(
            this._items.event,
            'popper-show'
          )
          && typeof this._items.event['popper-show'] === 'function'
        ) {
          if (
            this._items.props.fkobj.saveType
            && this._items.props.Selected[0].ID
            && /total/.test(this._items.props.Selected[0].ID)
          ) {
            // this.filter = data;
            const data = JSON.parse(this._items.props.Selected[0].ID);
            setTimeout(() => {
              if (this.$refs.complex && typeof data === 'object') {
                this.$refs.complex.setvalueData(data, 1);
              }
            }, 500);
          }
          this._items.event['popper-show']($this, this._items, this.index);
        }
      },
      attachFile(index, result, $this) {
        // 导入功能
        if (
          Object.prototype.hasOwnProperty.call(
            this._items.event,
            'popper-file'
          )
          && typeof this._items.event['popper-file'] === 'function'
        ) {
          this._items.event['popper-file'](
            $this,
            result,
            this._items,
            this.index
          );
        }
      },
      attachFilterCancel($this) {
        this.filterDate = {};
        if ($this) {
          // console.log(/选中/.test(this._items.value));
          // console.log(this.$refs.complex,this.$refs.complex.data);
          if (/选中/.test(this._items.value)) {
            this.filterDate = this.resultData;
          // this.$refs.complex = Object.assign(this.$refs.complex.$data,this.resultData);
          }
          $this.complexs = false;
        }
      },
      attachFilterOk($this) {
        // this.resultData = Object.assign({},this.$refs.complex);
        if (
          Object.prototype.hasOwnProperty.call(
            this._items.event,
            'popper-value'
          )
          && typeof this._items.event['popper-value'] === 'function'
        ) {
          if ($this._data.params) {
            const value = $this._data.parms[this._items.inputname.split(':')[1]].val;

            const Selected = [
              {
                Label: value,
                ID: $this._data.parms.ID.val
              }
            ];

            this._items.event['popper-value'](
              $this,
              value,
              Selected,
              this.index
            );
            return false;
          }
          if ($this._data.IN.length > 0) {
            const savemessage = JSON.parse(JSON.stringify($this.savemessage()));
            const saveObjectmessage = $this.savObjemessage();
            this.resultData = savemessage;
            const value = `已经选中${$this._data.IN.length}条数据`;
            const Select = [
              {
                Label: value,
                ID: saveObjectmessage
              }
            ];
            this._items.value = value;
            if (this._items.props.fkobj.saveType) {
              this._items.props.Selected = Select;
              this._items.event['popper-value']($this, value, Select, this.index);
            } else {
              const Select = [
                {
                  Label: value,
                  ID: $this._data.IN
                }
              ];
              this._items.props.selected = Select;
              this._items.event['popper-value']($this, value, Select, this.index);
            }
          } else {
            this._items.value = '';
            this._items.Selected = [
              {
                Label: '',
                ID: ''
              }
            ];
            this._items.event['popper-value'](
              $this,
              '',
              $this._data.IN,
              this.index
            );
          }
        }
        return true;
      },
      deleteImg(item, index) {
        // 删除图片
        const that = this;
        this.$Modal.fcWarning({
          mask: true,
          showCancel: true,
          title: '提示',
          content: '此操作将永久删除该图片, 是否继续?',
          onOk: () => {
            let HEADIMG = this._items.props.itemdata.valuedata.concat([]);
            HEADIMG.splice(index - 1, 1);
            HEADIMG = HEADIMG.length < 1 ? '' : HEADIMG;
            // this._items.props.itemdata.valuedata.length > 1
            //   ? [item]
            //   : "";
            //  判断parms 是否 需要保存
            const data = {
              [that._items.field]: HEADIMG,
              ID: that._items.props.itemdata.objId,
              objId: that._items.props.itemdata.objId,
              table: this._items.props.itemdata.masterName
            };

            // const parms = this.pathsCheckout(data, HEADIMG === '' ? '' : [item]);
            // 判断是否有path
            const parms = this.pathsCheckout(data, HEADIMG);

            if (
              this.$route.params
              && this.$route.params.itemId.toLocaleLowerCase() !== 'new'
            ) {
              //  不是新增  和不是主子表中的子表
              const childTableName = this.$parent.isMainTable === false ? this.$parent.childTableName : false;
              if (childTableName !== false && this.$parent.isreftabs) {
                this._items.props.itemdata.valuedata.splice(index - 1, 1);
                if (this._items.props.itemdata.valuedata.length > 0) {
                  this._items.value = JSON.stringify([
                    ...this._items.props.itemdata.valuedata
                  ]);
                } else {
                  this._items.value = '';
                }
                this.valueChange();
                if (childTableName && this.$parent.type === 'PanelForm') {
                  const dom = document.getElementById('actionMODIFY');
                  dom.click();
                }
              } else if (this.$parent.pathcheck === '') {
                // parms.path = '/p/cs/objectSave';
                this.deleteImgData(parms, index);
                that.upSaveImg(parms, '');
              } else {
                const path = this.$parent.pathcheck !== '';
                this._items.props.itemdata.valuedata.splice(index - 1, 1);
                this.valueImgChange();
                that.upSaveImg(parms, '', path, index);
              }
            } else {
              // new
              this._items.props.itemdata.valuedata.splice(index - 1, 1);

              this.valueImgChange();
            }
          }
        });
      },
      valueImgChange() {
        if (this._items.props.itemdata.valuedata.length > 0) {
          this._items.value = JSON.stringify([
            ...this._items.props.itemdata.valuedata
          ]);
        } else {
          this._items.value = '';
        }
        this.valueChange();
      },
      filechange(value) {
        // 上传文件
        const _value = value.length > 0 ? value : '';
        const fixedData = Array.isArray(_value) ? [..._value] : '';
        let parms = {
          objId: this._items.props.itemdata.objId,
          table: this._items.props.itemdata.masterName
        };
        //  判断parms 是否 需要保存
        parms = this.pathsCheckout(parms, fixedData);
        if (
          this.$route.params
          && this.$route.params.itemId.toLocaleLowerCase() !== 'new'
        ) {
          //  判断是否需要调用保存
          const path = this.$parent.pathcheck !== '';
          const childTableName = this.$parent.isMainTable === false ? this.$parent.childTableName : false;

          if (this.$parent.isreftabs && childTableName !== false) {
            //  主子表 子表
            const _fixedData = fixedData || '';
            this._items.props.itemdata.valuedata = [];
            this._items.props.itemdata.valuedata = _fixedData;
            this._items.value = JSON.stringify([
              ...this._items.props.itemdata.valuedata
            ]);
            this.valueChange();

            // 上传后是否保存控制
            if (!ossRealtimeSave()) {
              if (childTableName && this.$parent.type === 'PanelForm') {
                // 主子表的子表修改（1:1）的情况下
                setTimeout(() => {
                  const dom = document.getElementById('actionMODIFY');
                  dom.click();
                }, 500);
              }
            }
          } else {
            this._items.props.itemdata.valuedata = [];
            this._items.props.itemdata.valuedata = fixedData;
            if (this._items.props.itemdata.valuedata.length > 0) {
              this._items.value = JSON.stringify([
                ...this._items.props.itemdata.valuedata
              ]);
            } else {
              this._items.value = '';
            }
            this.valueChange();
            // 去除上传后的保存
            // this.upSavefile(parms, fixedData, path, value);
          }
        } else {
          const _fixedData = fixedData || '';
          this._items.props.itemdata.valuedata = [];
          this._items.props.itemdata.valuedata = _fixedData;
          if (this._items.props.itemdata.valuedata.length > 0) {
            this._items.value = JSON.stringify([
              ...this._items.props.itemdata.valuedata
            ]);
          } else {
            this._items.value = '';
          }
          this.valueChange();
        }
      },
      upSavefile(obj, fixedData, path) {
        // 保存文件
        setTimeout(() => {
          const dom = document.getElementById('actionMODIFY');
          dom.click();
        }, 500);
        

        return false;
        // eslint-disable-next-line no-unreachable
        fkHttpRequest().fkObjectSave({
          searchObject: {
            ...obj
          },
          url: path ? this.$parent.pathcheck : undefined,
          // eslint-disable-next-line consistent-return
          success: (res) => {
            if (res.data.code !== 0) {
              return false;
            }
            // this._items.props.itemdata.valuedata.push(...value);
          // this.valueChange();
            // this.valueChange();
          }
        });
      },
      deleteImgData(obj, index) {
        // 删除图片
        this._items.props.itemdata.valuedata.splice(index - 1, 1);
        this._items.value = this._items.props.itemdata.valuedata;
        this.valueImgChange();
        return false;
        fkHttpRequest().deleteImg({
          params: {
            ...obj
          },
          // eslint-disable-next-line consistent-return
          success: (res) => {
            // eslint-disable-next-line no-empty
            if (res.data.code === 0) {
             
            }
          }
        });
      },
      readonlyImage() {
        // 判断是否能上传图片
        if (!isNaN(this._items.props.itemdata.ImageSize) && this._items.props.itemdata.ImageSize !== null) {
          return !(this._items.props.itemdata.ImageSize > this._items.props.itemdata.valuedata.length);
        }
        return false;
      },
      uploadFileChangeSuccess(result) {
        // 图片进度接口
        const self = this;
        const resultData = result;
        if (this.readonlyImage()) {
          this.$Message.info(`只能上传${this._items.props.itemdata.ImageSize}张图片`);
          return false;
        }
        fkHttpRequest().fkQueuploadProgressry({
          searchObject: {
            uploadId: resultData.data.UploadId
          },
          // eslint-disable-next-line consistent-return
          success: (res) => {
            if (res.data.code !== 0) {
              return false;
            }

            const valuedata = this._items.props.itemdata.valuedata;
            const fixedData = Array.isArray(valuedata) ? [...valuedata] : [];
            fixedData.push({
              NAME: resultData.data.Name,
              URL: resultData.data.Url
            });
            //
            // eslint-disable-next-line no-unused-vars
            const parms = {
              objId: this._items.props.itemdata.objId,
              table: this._items.props.itemdata.masterName
            };
            //  判断parms 是否 需要保存
            // parms = this.pathsCheckout(parms, fixedData);
            if (
              this.$route.params
              && this.$route.params.itemId.toLocaleLowerCase() !== 'new'
            ) {
              //  判断是否需要调用保存

              // eslint-disable-next-line no-unused-vars
              const path = this.$parent.pathcheck !== '';
              const childTableName = this.$parent.isMainTable === false ? this.$parent.childTableName : false;
              if (this.$parent.isreftabs && childTableName !== false) {
                //  主子表 子表
                this._items.props.itemdata.valuedata.push(
                  fixedData[fixedData.length - 1]
                );
                this._items.value = JSON.stringify([
                  ...this._items.props.itemdata.valuedata
                ]);
                this.valueImgChange();

                if (!ossRealtimeSave()) {
                  // 去除图片上传成功后的保存
                  if (childTableName && this.$parent.type === 'PanelForm') {
                    setTimeout(() => {
                      const dom = document.getElementById('actionMODIFY');
                      dom.click();
                    }, 500);
                  }
                }
              } else {
                this._items.props.itemdata.valuedata.push(
                  fixedData[fixedData.length - 1]
                );
                this.valueImgChange();
                // 去除图片上传成功后的保存
                // this.upSaveImg();
              }
            } else {
              this._items.props.itemdata.valuedata.push(
                fixedData[fixedData.length - 1]
              );
              this.valueImgChange();
            }
          }

        });
        return true;
      },
      pathsCheckout(parms, data) {
        //  校验 是否 有 path
        if (Version() !== '1.4') {
          this.pathsCheckoutolder(parms, data);
          return false;
        }
        const pathcheck = this.$parent.pathcheck;
        const isreftabs = this.$parent.isreftabs;
        // 子表表明
        const childTableName = this.$parent.isMainTable === false ? this.$parent.childTableName : false;
        if (isreftabs && pathcheck !== '') {
          // 主子表 有path  主表明+子表明 // parms.table 主表
          if (childTableName) {
            const parmsdata = {
              [parms.table]: {
                ID: parms.objId || parms.ID
              },
              [childTableName]: {
                [this._items.field]: JSON.stringify(data)
              }
            };
            return Object.assign({}, parmsdata);
          }

          const parmsdata = {
            [parms.table]: {
              [this._items.field]: data === '' ? '' : JSON.stringify(data),
              ID: parms.objId || parms.ID
            }
          };
          return Object.assign({}, parmsdata);
        }
        if (isreftabs && pathcheck === '') {
          // 主子表 无path
          if (childTableName) {
            const fixedData = {
              fixedData: {
                [childTableName]: [
                  {
                    [this._items.props.itemdata.colname]:
                      data === '' ? '' : JSON.stringify(data)
                  }
                ]
              },
              objId: this._items.props.itemdata.objId,
              table: this._items.props.itemdata.masterName
            };
            return Object.assign({}, fixedData);
          }
          const fixedData = {
            fixedData: {
              [this._items.props.itemdata.masterName]: {
                [this._items.props.itemdata.colname]:
                  data === '' ? '' : JSON.stringify(data)
              }
            },
            objId: this._items.props.itemdata.objId,
            table: this._items.props.itemdata.masterName
          };
          return Object.assign({}, fixedData);
        }
        if (!isreftabs && pathcheck === '') {
          // 单主表  无path
          const fixedData = {
            fixedData: {
              [this._items.props.itemdata.masterName]: {
                [this._items.props.itemdata.colname]:
                  data === '' ? '' : JSON.stringify(data)
              }
            },
            objId: this._items.props.itemdata.objId,
            table: this._items.props.itemdata.masterName
          };
          return Object.assign({}, fixedData);
        }
        if (!isreftabs && pathcheck !== '') {
          // 单主表  有path

          const parmsdata = {
            [this._items.field]: data === '' ? '' : JSON.stringify(data)
          };
          return Object.assign({ ID: parms.objId }, parmsdata);
        }
        return true;
      },
      pathsCheckoutolder(parms, data) {
        //   1.3 后台拼数据
        const fixedData = {
          objid: this._items.props.itemdata.objId,
          table: this._items.props.itemdata.masterName,
          data: { [this._items.field]: data === '' ? '' : JSON.stringify(data) },
          after: { [this._items.field]: data === '' ? '' : JSON.stringify(data) },
          before: { [this._items.field]: this._items.props.valuedata ? this._items.props.valuedata : '' }
        };

        return Object.assign({}, fixedData);
      },
      upSaveImg(obj, fixedData, path, index) {
        // 图片保存接口
        setTimeout(() => {
          const dom = document.getElementById('actionMODIFY');
          dom.click();
        }, 500);
       
        return false;
        fkHttpRequest().fkObjectSave({
          searchObject: {
            ...obj
          },
          url: path ? this.$parent.pathcheck : undefined,
          // eslint-disable-next-line consistent-return
          success: (res) => {
            if (res.data.code !== 0) {
              return false;
            }
            if (index) {
              // 删除
              this._items.props.itemdata.valuedata.splice(index - 1, 1);
              this._items.value = this._items.props.itemdata.valuedata;
            } else {
              const data = fixedData[fixedData.length - 1];
              if (typeof this._items.props.itemdata.valuedata !== 'object') {
                this._items.props.itemdata.valuedata = [];
              }

              this._items.props.itemdata.valuedata.push({
                NAME: data.NAME,
                URL: data.URL
              });
              this._items.value = this._items.props.itemdata.valuedata;
            }
            this.valueChange();
          }
        });
      },
      uploadFileChangeOnerror(e) {
        this.$Message.info(e);
      },
      getWangeditorChangeItem(value) {
        // 富文本change
        this._items.value = value;
        // 判断是刷新 还是change 事件触发
        this._items.props.trigger = 'inputchange';
        this.valueChange();
      },
      enumerableValueChange(value) {
        // 读写
        this._items.value = value;
        this.valueChange();
      },
      extentionValueChange(value) {
        // 扩展属性
        this._items.value = value;
        this.valueChange();
      },
      enumerKeydown(event) {
        // 扩展属性
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'keydown')
          && typeof this._items.event.keydown === 'function'
        ) {
          this._items.event.keydown(event);
        }
      },
      clearItem() {
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
      setListenerSetProps(e) {
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
      setListenerSetLinkForm(e) {
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
      setListenerSetHideForm(e) {
        const index = e.value.list.findIndex(x => x === this._items.field);

        if (index !== -1 && e.value.tableName === this._items.props.tableGetName) {
          setTimeout(() => {
            this.$parent.hidecolumn(this._items, this.index, e.value.data, 'mounted');
          }, 10);
        }
      },
      setListenerDynam(e) {
        if (this._items.props.colname === e.value.dynamicforcompute.computecolumn) {
          setTimeout(() => {
            this.$parent.dynamicforcompute(e.value);
          }, 10);
        }
      },

      uploadFileDblclick(array = []) { // 图片预览双击
        const { itemId } = this.$route.params;
        const obj = {
          field: `${this.items.field}_${itemId}`
        };
        createModal(array, obj);
      },

      
    },
    beforeDestroy() {
      window.removeEventListener(`${this.moduleComponentName}setProps`, this.setListenerSetProps);
      window.removeEventListener(`${this.moduleComponentName}setLinkForm`, this.setListenerSetLinkForm);
      window.removeEventListener(`${this.moduleComponentName}setHideForm`, this.setListenerSetHideForm);
      window.removeEventListener(`${this.moduleComponentName}Dynam`, this.setListenerDynam);
    },
    created() {
    // console.log(this.type,this.formIndex);
    },
    mounted() {
      window.addEventListener(`${this.moduleComponentName}setProps`, this.setListenerSetProps);
      window.addEventListener(`${this.moduleComponentName}setLinkForm`, this.setListenerSetLinkForm);
      window.addEventListener(`${this.moduleComponentName}setHideForm`, this.setListenerSetHideForm);
      window.addEventListener(`${this.moduleComponentName}Dynam`, this.setListenerDynam);
    }
  };
</script>

<style lang="less">
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
  }
  .label-tip {
    color: red;
    font-size: 16px;
    vertical-align: middle;
    position: relative;
    top: 3px;
    right: 3px;
  }
}
textarea.ark-input{
    // height: 100%!important;
    resize:auto;
}
.height100{
    height: 100%!important;
    .ark-input-wrapper{
    height: 100%!important;
    }
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
.auto-com-table tr td{
  max-width:500px!important;
}
.attachfiter-pop{
    .ark-select-item{
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        .iconbj_delete2{
            display: none;
            width: 12px;
            height: 12px;
            font-size: 12px;
            line-height: 12px;
        }
        &:hover{
          .iconbj_delete2{
           border-radius: 100%;
           overflow: hidden;
           display: block;
           background-color: #e6502f;
           color: #fff
        }

        }


    }
}


</style>

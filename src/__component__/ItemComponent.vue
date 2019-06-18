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
        <i class="iconfont icon-tishi1" />
      </Poptip>
      <span
        v-if="_items.required"
        class="label-tip"
      >*</span>
      <span  :title="_items.title">{{ _items.title }}:</span>
    </span>
    <div class="itemComponent">
      <Input
        v-if="_items.type === 'input'"
        v-model="_items.value"
        :type="_items.props.type"
        :clearable="_items.props.clearable"
        :disabled="_items.props.disabled"
        :readonly="_items.props.readonly"
        :rows="_items.props.row"
        :autosize="_items.props.autosize"
        :autofocus="_items.props.autofocus"
        :placeholder="_items.props.placeholder"
        :size="_items.props.size"
        :maxlength="_items.props.maxlength"
        :icon="_items.props.icon"
        :regx="_items.props.regx"
        on-click="inputClick"
        on-blur="inputBlur"
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
        v-model="_items.value"
        :clearable="_items.props.clearable"
        :multiple="_items.props.multiple"
        :multiple-type="_items.props.multipleType"
        :disabled="_items.props.disabled"
        :placeholder="_items.props.placeholder"
        :not-found-text="_items.props['not-found-text']"
        :label-in-value="_items.props['label-in-value']"
        :chooseAll="items.props.chooseAll"
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
        v-model="_items.value"
        :type="_items.props.type"
        :transfer="_items.props.transfer"
        :format="_items.props.format"
        :placement="_items.props.placement"
        :placeholder="_items.props.placeholder"
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
        v-model="_items.value"
        :type="_items.props.type"
        :transfer="_items.props.transfer"
        :steps="_items.props.steps"
        :format="_items.props.format"
        :placement="_items.props.placement"
        :placeholder="_items.props.placeholder"
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

      <DropDownSelectFilter
        v-if="_items.type === 'DropDownSelectFilter'"
        :data="_items.props.data"
        :single="_items.props.single"
        :total-row-count="_items.props.totalRowCount"
        :page-size="_items.props.pageSize"
        :auto-data="_items.props.AutoData"
        :disabled="_items.props.disabled"
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
        @on-popper-hide ="fkrPopperHide"
        @on-clear="fkrpSelectedClear"
      />
      <AttachFilter
        v-if="_items.type === 'AttachFilter'"
        v-model="_items.value"
        :option-tip="_items.props.optionTip"
        :filter-tip="_items.props.filterTip"
        :disabled="_items.props.disabled"
        :placeholder="_items.props.placeholder"
        :auot-data="_items.props.AutoData"
        :columns="_items.props.columns"
        :dialog="_items.props.dialog"
        :datalist="_items.props.datalist"
        @on-show="attachFilterPopperShow"
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

      <ImageUpload
        v-if="_items.type === 'ImageUpload'"
        :dataitem="_items.props.itemdata"
        @upload-file-change="uploadFileChange"
        @deleteImg="deleteImg"
        @uploadFileChangeSuccess="uploadFileChangeSuccess"
        @uploadFileChangeOnerror="uploadFileChangeOnerror"
      />
      <component
      
        :is="_items.componentType"
        v-if="_items.type === 'Wangeditor'"
        :key="index"
        :valuedata="_items.value"
        :item="_items.props"
        @getChangeItem="getWangeditorChangeItem"
      />
    </div>
  </div>
</template>

<script>
  import dataProp from '../__config__/props.config';
  // 弹窗多选面板
  import Dialog from './ComplexsDialog';
  // 弹窗单选
  import myPopDialog from './PopDialog';
  // 富文本编辑
  import WangeditorVue from './Wangeditor';

  import { Version } from '../constants/global';

  const {
    fkQueuploadProgressry,
    fkObjectSave,
    deleteImg
  // eslint-disable-next-line import/no-dynamic-require
  } = require(`../__config__/actions/version_${Version}/formHttpRequest/fkHttpRequest.js`);

  export default {
    name: 'ItemComponent',
    components: {},
    props: {
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
        const item = JSON.parse(JSON.stringify(this.items));
        // const item = this.items;
        item.props = Object.assign(
          {},
          item.type ? dataProp[item.type].props : {},
          this.items.props
        );
        if (item.type === 'AttachFilter') {
          // 大弹窗卡槽页面
          if (item.props.fkdisplay === 'pop') {
            item.componentType = myPopDialog;
            item.props.fkobj.colid = item.props.colid;
            item.props.fkobj.colname = item.props.colname;
            item.props.fkobj.show = false;
            item.props.dialog.model.title = '表';
            item.props.dialog.model['footer-hide'] = true;
            item.props.dialog.model.closable = true;
          } else {
            item.props.dialog.model.title = '弹窗多选';
            item.componentType = Dialog;
            item.props.fkobj.show = true;
            item.props.datalist = dataProp[item.type].props.datalist.concat(
              item.props.datalist
            );
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
        item.event = Object.assign({}, this.items.event);

        return item;
      },
      filterList() {
        // 气泡选中过滤条件
        console.log(this.filterDate);
        return this.filterDate;
      }
    },
    methods: {
      valueChange() {
        // 值发生改变时触发  只要是item中的value改变就触发该方法，是为了让父组件数据同步
        this.$emit('inputChange', this._items.value, this._items, this.index);
      },
      // input event
      inputChange(event, $this) {
        this.valueChange();
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
        this._items.value = [];
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
        this.valueChange();
        if (
          Object.prototype.hasOwnProperty.call(this._items.event, 'clear')
          && typeof this._items.event.clear === 'function'
        ) {
          this._items.event.clear($this);
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
          Object.prototype.hasOwnProperty.call(this._items.event, 'on-popper-hide')
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

      // AttachFilter event
      attachFilterChange(value, $this) {
        this._items.value = value;
        this.valueChange();
        if (
          Object.prototype.hasOwnProperty.call(
            this._items.event,
            'popper-value'
          )
          && typeof this._items.event['popper-value'] === 'function'
        ) {
          this._items.event['popper-value']($this, value, 'change', this.index);
        }
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
      attachFilterSelected(row, $this) {
        this._items.value = row.label;
        this._items.props.selected = row.value;
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
            row.value,
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
      attachFilterClear(event, $this) {
        this._items.value = '';
        if (
          Object.prototype.hasOwnProperty.call(
            this._items.event,
            'popper-value'
          )
          && typeof this._items.event['popper-value'] === 'function'
        ) {
          this._items.event['popper-value']($this, '', [], this.index);
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
          if (this._items.props.fkobj.saveType && this._items.value && /选中/.test(this._items.value)) {
            // this.filter = data;
            const data = JSON.parse(this._items.value);
            setTimeout(() => {
              if (this.$refs.complex && typeof data === 'object') {
                this.$refs.complex.sendMessage = Object.assign(this.$refs.complex.sendMessage, data.value);
                this.$refs.complex.IN = data.idArray;
                const list = data.lists.result.reduce((arr, item) => {
                  item.exclude = !item.exclude;
                  arr.push(item);
                  return arr;
                },[]);
                this.$refs.complex.text.result = list;
                this.$refs.complex.resultData.list = list;
                this.$refs.complex.resultData.total = data.lists.total;
                this.$refs.complex.multipleScreenResultCheck(this.$refs.complex.sendMessage, 1);
              }
            }, 20);
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
          console.log(this.resultData, 'resultData');
          if (/选中/.test(this._items.value)) {
            this.filterDate = this.resultData;
            // this.$refs.complex = Object.assign(this.$refs.complex.$data,this.resultData);
          } else { 
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
            console.log($this._data.parms);
            const value = $this._data.parms.NAME.val;
            this._items.event['popper-value'](
              $this,
              value,
              $this._data.parms.ID.val,
              this.index
            );
            return false;
          }
          if ($this._data.IN.length > 0) {
            const savemessage = JSON.parse(JSON.stringify($this.savemessage()));
            const saveObjectmessage = $this.savObjemessage();
            console.log(savemessage);
            this.resultData = savemessage;
            const value = `已经选中${$this._data.IN.length}条数据`;
            this._items.value = value;
            if (this._items.props.fkobj.saveType) {
              this._items.props.Selected = saveObjectmessage;
              this._items.event['popper-value'](
                $this,
                value,
                saveObjectmessage,
                this.index
              );
            } else {
              this._items.props.Selected = $this._data.IN;
              this._items.event['popper-value'](
                $this,
                value,
                $this._data.IN,
                this.index
              );
            }
          } else {
            this._items.value = '';
            this._items.Selected = [];
            this._items.event['popper-value'](
              $this,
              '',
              $this._data.IN,
              this.index
            );
          }
        }
      },
      uploadFileChange() {
      // console.log(e);
      },
      deleteImg(item, index) {
        const that = this;
        this.$Modal.info({
          mask: true,
          showCancel: true,
          title: '提示',
          content: '此操作将永久删除该图片, 是否继续?',
          onOk: () => {
            let HEADIMG = this._items.props.itemdata.valuedata.concat([]);
            HEADIMG.splice(index - 1, 1);
            HEADIMG = HEADIMG.length < 1 ? '' : HEADIMG;
            console.log(index, HEADIMG);
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
            const parms = this.pathsCheckout(
              data,
              HEADIMG
            );
            console.log(parms, this.$parent.pathcheck);
            if (this.$parent.pathcheck === '') {
              if (this.$parent.childTableName === '') {
                parms.path = '/p/cs/objectSave';
              }
              this.deleteImgData(
                parms,
                index
              );
            } else {
              const path = this.$parent.pathcheck !== '';
              that.upSaveImg(parms, '', path, index);
            }
          }
        });
      },
      deleteImgData(obj, index) {
        deleteImg({
          params: {
            ...obj
          },
          // eslint-disable-next-line consistent-return
          success: (res) => {
            if (res.data.code === 0) {
              this._items.props.itemdata.valuedata.splice(index - 1, 1);
              this._items.value = this._items.props.itemdata.valuedata;
            }
          }
        });
      },
      uploadFileChangeSuccess(result) {
        const self = this;

        const resultData = result;

        fkQueuploadProgressry({
          searchObject: {
            uploadId: resultData.data.UploadId
          },
          // eslint-disable-next-line consistent-return
          success: (res) => {
            if (res.data.code !== 0) {
              return false;
            }
            const fixedData = [...this._items.props.itemdata.valuedata];
            fixedData.push({ NAME: resultData.data.Name, URL: resultData.data.Url });
            // 
            let parms = {
              objId: this._items.props.itemdata.objId,
              table: this._items.props.itemdata.masterName,
            
            };
            //  判断parms 是否 需要保存
            parms = this.pathsCheckout(parms, fixedData);
            if (
              this.$route.params
              && this.$route.params.itemId.toLocaleLowerCase() !== 'new'
            ) {
              //  判断是否需要调用保存
              const path = this.$parent.pathcheck !== '';
              self.upSaveImg(parms, fixedData, path);
            } else {
              this._items.props.itemdata.valuedata.push(fixedData[fixedData.length - 1]);
            }
          }
        });
      },
      pathsCheckout(parms, data) {
        //  校验 是否 有 path
        const pathcheck = this.$parent.pathcheck;
        const isreftabs = this.$parent.isreftabs;
        // 子表表明
        const childTableName = this.$parent.type === '' ? this.$parent.childTableName : false;
        console.log(isreftabs, childTableName, '子表，主表', this._items.props.itemdata.masterName);
        if (isreftabs && pathcheck !== '') {
          // 主子表 有path  主表明+子表明 // parms.table 主表
          if (childTableName) {
            console.log('主子表 子表 path');
            const parmsdata = {
              [parms.table]: {
                ID: parms.objId || parms.ID,
              },
              [childTableName]: {
                [this._items.field]: JSON.stringify(data),
              },
            };
            return Object.assign({}, parmsdata);
          }  
          console.log('主子表 path');

          const parmsdata = {
            [parms.table]: {
              [this._items.field]: data == '' ? '' : JSON.stringify(data),
              ID: parms.objId || parms.ID,
            },
          };
          return Object.assign({}, parmsdata);
        } if (isreftabs && pathcheck === '') {
          // 主子表 无path
          console.log('主子表 无path');
          if (childTableName) {
            const fixedData = {
              fixedData: {
                [childTableName]:
                  [{
                    [this._items.props.itemdata.colname]:
                      data === '' ? '' : JSON.stringify(data) 
                  }]
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
        } if (!isreftabs && pathcheck === '') {
          // 单主表  无path
          console.log('单主表 有sspath');

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
        } if (!isreftabs && pathcheck !== '') {
          // 单主表  有path
          console.log('单主表 无path');

          const parmsdata = {
            [this._items.field]: JSON.stringify(data),
          };
          return Object.assign({ ID: parms.objId }, parmsdata);
        }
      },
      upSaveImg(obj, fixedData, path, index) {
        fkObjectSave({
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
            }
            this.valueChange();
          }
        });
      },
      uploadFileChangeOnerror() {
      // console.log('err', result);
      },
      getWangeditorChangeItem(value) {
        // 富文本change
        this._items.value = value;
        this.valueChange();
      }
    },
    created() {
    // console.log(this.type,this.formIndex);
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
.AttachFilter-pop {
  .icon-bj_tcduo:before {
    content: "\e6b1";
  }
}
</style>

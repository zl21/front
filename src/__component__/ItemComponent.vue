/* eslint-disable import/no-dynamic-require */
<template>
  <div  :class = "_items.props.fkdisplay === 'pop' ? 'ItemComponentRoot AttachFilter-pop':'ItemComponentRoot'">
    <span
      class="itemLabel"
      :style="labelStyle"
      :title="_items.title"
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
      {{ _items.title }}:
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
        @on-clear="fkrpSelectedClear"
      />
      <AttachFilter
        v-if="_items.type === 'AttachFilter'"
        v-model="_items.value"
        :option-tip="_items.props.optionTip"
        :show="_items.props.show"
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
      
        v-if="_items.type  === 'Wangeditor'"
        :is="_items.componentType"
        :key="index"
        :valuedata="_items.value"
        :item = "_items.props"
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
    fkQueuploadProgressry, fkObjectSave
  // eslint-disable-next-line import/no-dynamic-require
  } = require(`../__config__/actions/version_${Version}/formHttpRequest/fkHttpRequest.js`);

  export default {
    name: 'ItemComponent',
    components: {
    },
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
        filterDate: {

        }
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
        item.props = Object.assign({}, item.type ? dataProp[item.type].props : {}, this.items.props);
        if (item.type === 'AttachFilter') {
          // 大弹窗卡槽页面
          if (item.props.fkdisplay === 'pop') {
            item.componentType = myPopDialog;
            item.props.dialog.model.title = '弹窗单选';
          } else {
            item.props.dialog.model.title = '弹窗多选';
            item.componentType = Dialog;
            item.props.datalist = dataProp[item.type].props.datalist.concat(item.props.datalist);
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
        return this.filterDate;
      }
    },
    methods: {
      valueChange() { // 值发生改变时触发  只要是item中的value改变就触发该方法，是为了让父组件数据同步
        this.$emit('inputChange', this._items.value, this._items, this.index);
      },
      // input event
      inputChange(event, $this) {
        this.valueChange();
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'change') && typeof this._items.event.change === 'function') {
          this._items.event.change(event, $this);
        }
      },
      inputEnter(event, $this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'enter') && typeof this._items.event.enter === 'function') {
          this._items.event.enter(event, $this);
        }
      },
      inputClick(event, $this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'click') && typeof this._items.event.click === 'function') {
          this._items.event.click(event, $this);
        }
      },
      inputFocus(event, $this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'focus') && typeof this._items.event.focus === 'function') {
          this._items.event.focus(event, $this);
        }
      },
      inputBlur(event, $this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'blur') && typeof this._items.event.blur === 'function') {
          this._items.event.blur(event, $this);
        }
      },
      inputKeyUp(event, $this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'keyup') && typeof this._items.event.keyup === 'function') {
          this._items.event.keyup(event, $this);
        }
      },
      inputKeyDown(event, $this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'keydown') && typeof this._items.event.keydown === 'function') {
          this._items.event.keydown(event, $this);
        }
      },
      inputKeyPress(event, $this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'keypress') && typeof this._items.event.keypress === 'function') {
          this._items.event.keypress(event, $this);
        }
      },
      inputRegxCheck(value, $this, errorValue) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'regxCheck') && typeof this._items.event.regxCheck === 'function') {
          this._items.event.regxCheck(value, $this, errorValue);
        }
      },

      // checkbox event
      checkBoxChange(value, $this) {
        this.valueChange();
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'change') && typeof this._items.event.change === 'function') {
          this._items.event.change(value, $this);
        }
      },

      // select input
      selectChange(value, $this) {
        this._items.value = value;
        this.valueChange();
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'change') && typeof this._items.event.change === 'function') {
          this._items.event.change(value, $this);
        }
      },
      selectClear($this) {
        this._items.value = [];
        this.valueChange();
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'clear') && typeof this._items.event.clear === 'function') {
          this._items.event.clear($this);
        }
      },
      selectOpenChange(value, $this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'openChange') && typeof this._items.event.openChange === 'function') {
          this._items.event.openChange(value, $this);
        }
      },


      // datepick event
      datePickerChange(value, type, $this) {
        this.valueChange();
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'change') && typeof this._items.event.change === 'function') {
          this._items.event.change(value, $this);
        }
      },
      datePickerClear($this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'clear') && typeof this._items.event.clear === 'function') {
          this._items.event.clear($this);
        }
      },

      // TimePicker event
      timePickerChange(value, timeType, $this) {
        this.valueChange();
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'change') && typeof this._items.event.change === 'function') {
          this._items.event.change(value, $this);
        }
      },
      timePickerClear($this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'clear') && typeof this._items.event.clear === 'function') {
          this._items.event.clear($this);
        }
      },

      // fkrpSelected event
      fkrpSelected(value, $this) {
        this._items.value = value;
        this.valueChange();
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'fkrpSelected') && typeof this._items.event.fkrpSelected === 'function') {
          this._items.event.fkrpSelected(value, $this);
        }
      },
      inputValueChange(value, $this) {
        this._items.value = value;
        this.valueChange();
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'inputValueChange') && typeof this._items.event.inputValueChange === 'function') {
          this._items.event.inputValueChange(value, $this);
        }
      },
      fkrpSelectedClear($this) {
        this._items.value = undefined;
        this.valueChange();
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'clear') && typeof this._items.event.clear === 'function') {
          this._items.event.clear($this);
        }
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'inputValueChange') && typeof this._items.event.inputValueChange === 'function') {
          this._items.event.inputValueChange('', $this);
        }
      },
      pageChange(value, $this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'pageChange') && typeof this._items.event.pageChange === 'function') {
          this._items.event.pageChange(value, $this);
        }
      },
      fkrpSelectedInputFocus(event, $this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'focus') && typeof this._items.event.focus === 'function') {
          this._items.event.focus(event, $this);
        }
      },
      fkrpSelectedInputBlur(event, $this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'blur') && typeof this._items.event.blur === 'function') {
          this._items.event.blur(event, $this);
        }
      },
      fkrpSelectedInputKeyup(event, $this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'keyup') && typeof this._items.event.keyup === 'function') {
          this._items.event.keyup(event, $this);
        }
      },
      fkrpSelectedInputKeydown(event, $this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'keydown') && typeof this._items.event.keydown === 'function') {
          this._items.event.keydown(event, $this);
        }
      },
      fkrpSelectedPopperShow($this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'on-show') && typeof this._items.event['on-show'] === 'function') {
          this._items.event['on-show']($this);
        }
      },

      // AttachFilter event
      attachFilterChange(value, $this) {
        this._items.value = value;
        this.valueChange();
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'popper-value') && typeof this._items.event['popper-value'] === 'function') {
          this._items.event['popper-value']($this, value, 'change', this.index);
        }
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'inputValueChange') && typeof this._items.event.inputValueChange === 'function') {
          this._items.event.inputValueChange(value, $this);
        }
      },
      attachFilterSelected(row, $this) {
        this._items.value = row.label;
        this._items.props.selected = row.value;
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'popper-value') && typeof this._items.event['popper-value'] === 'function') {
          this._items.event['popper-value']($this, row.label, row.value, this.index);
        }
      },
      attachFilterInputFocus(event, $this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'focus') && typeof this._items.event.focus === 'function') {
          this._items.event.focus(event, $this);
        }
      },
      attachFilterInputBlur(event, $this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'blur') && typeof this._items.event.blur === 'function') {
          this._items.event.blur(event, $this);
        }
      },
      attachFilterInputKeyup(event, $this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'keyup') && typeof this._items.event.keyup === 'function') {
          this._items.event.keyup(event, $this);
        }
      },
      attachFilterInputKeydown(event, $this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'keydown') && typeof this._items.event.keydown === 'function') {
          this._items.event.keydown(event, $this);
        }
      },
      attachFilterPopclick(event, row, targName, $this) {
        if (targName !== 'I' && event !== 1) {
          // 打开弹窗
          $this.showModal = true;
          if (event !== 0) {
            this.filterDate = JSON.parse(row.label);
          }
        } else if (targName === 'I' && Object.prototype.hasOwnProperty.call(this._items.event, 'on-delete') && typeof this._items.event['on-delete'] === 'function') {
          this._items.event['on-delete']($this, this._items, row.key, this.index);
        }
      },
      attachFilterClear(event, $this) {
        this._items.value = '';
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'popper-value') && typeof this._items.event['popper-value'] === 'function') {
          this._items.event['popper-value']($this, '', [], this.index);
        }
      },
      attachFilterPopperShow($this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'popper-show') && typeof this._items.event['popper-show'] === 'function') {
          this._items.event['popper-show']($this, this._items, this.index);
        }
      },
      attachFile(index, result, $this) {
        // 导入功能
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'popper-file') && typeof this._items.event['popper-file'] === 'function') {
          this._items.event['popper-file']($this, result, this._items, this.index);
        }
      },
      attachFilterOk($this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'popper-value') && typeof this._items.event['popper-value'] === 'function') {
          if ($this._data.IN.length > 0) {
            const value = `已经选中${$this._data.IN.length}条数据`;
            this._items.value = value;
            this._items.Selected = $this._data.IN;
            this._items.event['popper-value']($this, value, $this._data.IN, this.index);
          } else {
            this._items.value = '';
            this._items.Selected = [];
            this._items.event['popper-value']($this, '', $this._data.IN, this.index);
          }
        }
      },
      uploadFileChange() {
        // console.log(e);
      },
      deleteImg(item, index) {
        console.log(item, index);
        const that = this;
        this.$Modal.info({
          mask: true,
          showCancel: true,
          title: '提示',
          content: '此操作将永久删除该图片, 是否继续?',
          onOk: () => {
            const HEADIMG = this._items.props.itemdata.valuedata.length > 1 ? JSON.stringify([item]) : '';
            //  判断parms 是否 需要保存
            const data = {
              HEADIMG,
              ID: that._items.props.itemdata.objId
            }; 
            const parms = this.pathsCheckout(data, HEADIMG === '' ? '' : [...item]);
            that.deleteImgData({
              parms
            }, index);
          }
        });
      },
      deleteImgData(obj, index) {
        fkObjectSave({
          searchObject: {
            ...obj
          },
          // eslint-disable-next-line consistent-return
          success: (res) => {
            console.log(res, this._items);
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
            const fixedData = [{ NAME: resultData.data.Name, URL: resultData.data.Url }];
            
            let parms = {
              objId: this._items.props.itemdata.objId,
              table: this._items.props.itemdata.masterName
            };
            //  判断parms 是否 需要保存
            parms = this.pathsCheckout(parms, fixedData);
            if (this.$route.params && this.$route.params.itemId.toLocaleLowerCase() !== 'new') {
              //  判断是否需要调用保存
              self.upSaveImg(parms, fixedData);
            }
          }
        });
      },
      pathsCheckout(parms, data) {
        //  校验 是否 有 path
        if (!this._items.props.path) {
          const fixedData = {
            fixedData: {
              [this._items.props.itemdata.masterName]: {
                [this._items.props.itemdata.colname]: data === '' ? '' : JSON.stringify(data)
              }
            }
          };
          return Object.assign(parms, fixedData);
        }
        const parmsdata = {
          HEADIMG: JSON.stringify(data),
          ID: parms.objId,
          ...parms
        };
        return Object.assign({}, parmsdata);
      },
      upSaveImg(obj, fixedData) {
        fkObjectSave({
          searchObject: {
            ...obj
          },
          // eslint-disable-next-line consistent-return
          success: (res) => {
            if (res.data.code !== 0) {
              return false;
            }
            const data = fixedData[0];
            if (typeof this._items.props.itemdata.valuedata !== 'object') {
              this._items.props.itemdata.valuedata = [];
            }
            
            this._items.props.itemdata.valuedata.push({
              NAME: data.NAME,
              URL: data.URL
            });
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
  .ItemComponentRoot{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top:8px;

    .itemLabel{
      margin-right: 4px;
      text-align: right;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow:hidden;
      line-height: 16px;
      // display: flex;
      // align-items: center;
      // justify-content: flex-end;

      i{
        font-size: 12px;
        color: red;
      }
    }

    .itemComponent{
      flex: 1;
      overflow: hidden;
    }
    .label-tip{
      color: red;
      font-size: 16px;
      vertical-align: middle;
      position: relative;
      top: 3px;
      right: 3px;
    }
  }
  .AttachFilter-pop{
    .icon-bj_tcduo:before{
        content: "\e6b1";
    }
  }
</style>

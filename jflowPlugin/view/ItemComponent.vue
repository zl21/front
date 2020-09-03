<template>
  <div class="ItemComponentRoot">
    <span
      class="itemLabel"
    >
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
        :rows="_items.props.rows"
        :autosize="_items.props.autosize"
        :number="_items.props.number"
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
        :columns-key="_items.props.columnsKey"
        :show-colname-key="_items.props.showColnameKey"
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
    </div>
  </div>
</template>
<script>
  import dataProp from '../utils/props.config';

  export default {
    name: 'ItemComponent',
    props: {
      items: {
        type: Object,
        default() {
          return {};
        }
      },
    },
    computed: {
      _items() {
        // 将设置的props和默认props进行assign
        const item = JSON.parse(JSON.stringify(this.items));
        // const item = this.items;
        item.props.placeholder = `${dataProp[item.type].props.placeholder}${item.title}`;
        item.props = Object.assign({}, dataProp[item.type].props, item);
        item.event = Object.assign({}, this.items.event);
        if (item.type === 'DatePicker') {
          if (
            item.props.type === 'datetimerange'
            || item.props.type === 'daterange'
          ) {
            if (!item.value) {
              item.value = [];
            }
          } else {
            item.value = new Date();
          }
        }
        return item;
      }
    },
    methods: {
      valueChange() { // 值发生改变时触发  只要是item中的value改变就触发该方法，是为了让父组件数据同步
        this.$emit('inputChange', this._items.value, this._items,);
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
        // this.valueChange();
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
            console.log(row.label);
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
      attachFilterOk($this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'popper-value') && typeof this._items.event['popper-value'] === 'function') {
          if ($this._data.IN > 0) {
            const value = `已经选中${$this._data.IN}条数据`;
            this._items.value = value;
            this.valueChange();
            this._items.event['popper-value']($this, value, $this._data.IN, this.index);
          }
        }
      }
    },
  };
</script>
<style lang="less" scoped>
.ItemComponentRoot{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top:8px;

    .itemLabel{
      width: 100px;
      margin-right: 8px;
      text-align: right;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
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
      top: -1px;
      right: 3px;
    }
  }
</style>

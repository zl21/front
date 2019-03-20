<template>
  <div class="ItemComponentRoot">
    <span class="itemLabel">
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
        :columns="_items.props.columns"
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
      />
      <AttachFilter
        v-if="_items.type === 'AttachFilter'"
        v-model="_items.value"
        :option-tip="_items.props.optionTip"
        :show="_items.props.show"
        :filter-tip="_items.props.filterTip"
        :disabled="_items.props.disabled"
        :placeholder="_items.props.placeholder"
        :auot-data="_items.props.AuotData"
        :columns="_items.props.columns"
        :dialog="_items.props.dialog"
        :datalist="_items.props.datalist"
        @on-change="attachFilterChange"
      />
    </div>
  </div>
</template>

<script>
  import dataProp from '../__config__/props.config';

  export default {
    name: 'ItemComponent',
    props: {
      items: {
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
      }
    },
    data() {
      return {
      };
    },
    computed: {
      _items() {
        // 将设置的props和默认props进行assign
        const item = JSON.parse(JSON.stringify(this.items));
        item.props = Object.assign(dataProp[item.type].props, this.items.props);
        item.event = Object.assign({}, this.items.event);
        return item;
      }
    },
    watch: {

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
      pageChange(value, $this) {
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'pageChange') && typeof this._items.event.pageChange === 'function') {
          this._items.event.pageChange(value, $this);
        }
      },
      inputValueChange(value, $this) {
        this._items.value = value;
        this.valueChange();
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'inputValueChange') && typeof this._items.event.inputValueChange === 'function') {
          this._items.event.inputValueChange(value, $this);
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
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'popper-show') && typeof this._items.event['popper-show'] === 'function') {
          this._items.event['popper-show']($this);
        }
      },

      // AttachFilter event
      attachFilterChange(value, $this) {
        this._items.value = value;
        this.valueChange();
        if (Object.prototype.hasOwnProperty.call(this._items.event, 'change') && typeof this._items.event.change === 'function') {
          this._items.event.change(value, $this);
        }
      }
    },
    created() {
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

    .itemLabel{
      width: 90px;
      margin-right: 4px;
      text-align: right;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
    }

    .itemComponent{
      flex: 1;
      overflow: hidden;
    }
  }
</style>

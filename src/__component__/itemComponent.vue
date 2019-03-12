<template>
  <div class="ItemComponentRoot">
    <span class="itemLabel">
      {{ _items.title }}:
    </span>
    <div class="itemComponent">
      <Input
        v-if="_items.type === 'input'"
        v-model="_items.value"
        @on-change="valueChange"
      />

      <Checkbox
        v-if="_items.type === 'checkbox'"
        v-model="_items.value"
        @on-change="valueChange"
      />

      <Select
        v-if="_items.type === 'select'"
        v-model="_items.value"
        @on-change="valueChange"
      >
        <Option
          v-for="item in _items.options"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </Option>
      </Select>

      <DatePicker
        v-if="_items.type === 'DatePicker'"
        :value="_items.value"
        :type="_items.props.type"
        :transfer="true"
        @on-change="valueChange"
      />

      <TimePicker
        v-if="_items.type === 'TimePicker'"
        :value="_items.value"
        :type="_items.props.type"
        @on-change="valueChange"
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
        return this.items;
      }
    },
    watch: {

    },
    methods: {
      valueChange() { // 值发生改变时触发
        this.$emit('inputChange', this._items.value, this.items.value, this.index);
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
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .itemComponent{
      flex: 1;
    }
  }
</style>

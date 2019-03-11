<template>
  <div>
    <Input
      id=""
      v-model="currentValue"
      type="text"
      name=""
      @on-change="inputChange"
    />
  </div>
</template>

<script>
  import dataProp from '../__config__/props.config';

  console.log(dataProp);

  export default {
    name: 'ItemComponent',
    props: {
      items: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    data() {
      return {
        currentValue: '', // 当前展示值
      };
    },
    computed: {
      _value() {
        return this.items.value;
      },
      formDataObject() {
        return this.$parent.newFormItemLists.reduce((array, current) => {
          array.push(current.item);
          return array;
        }, []);
      }
    },
    watch: {
      _value(val) {
        this.currentValue = val;
      },
      formDataObject: {
        handler(val) {
          if (!this.$parent.currentChangeItem) {
            return;
          }
          if (Object.prototype.hasOwnProperty.call(this.items.validate, 'dynamicforcompute') && this.items.validate.dynamicforcompute.refcolumns.indexOf(this.$parent.currentChangeItem.field) >= 0) { // 计算属性的联动
            this.currentValue = this.dynamicforcompute(val);
            this.inputChange();
          }
          if (Object.prototype.hasOwnProperty.call(this.items.validate, 'hidecolumn') && this.items.validate.hidecolumn.refcolumn === this.$parent.currentChangeItem.field) { // 计算属性的联动
            this.hidecolumn(val);
          }
        },
        deep: true
      }
    },
    methods: {
      getValueForFormDataObject(key) { // 从formDataObject中根据某个key获取对应的数据
        let value = '';
        this.formDataObject.every((item) => {
          if (item.field === key) {
            value = item.value;
            return false;
          }

          return true;
        });
        // console.log(this.formDataObject,value)

        return value || 0;
      },
      dynamicforcompute() { // 计算属性方法
        const str = this.items.validate.dynamicforcompute.refcolumns.reduce((temp, current) => {
          temp = temp.replace(new RegExp(current, 'g'), this.getValueForFormDataObject(current));
          return temp;
        }, this.items.validate.dynamicforcompute.express);
        return eval(str);
      },
      hidecolumn(formDataObject) { // 字段控制显示隐藏的联动
        formDataObject.every((item) => {
          if (item.field === this.items.validate.hidecolumn.refcolumn) {
            if (item.value === this.items.validate.hidecolumn.refval) {
              this.$parent.hiddenFormLists(this.items.field, false);
            } else {
              this.$parent.hiddenFormLists(this.items.field, true);
            }

            return false;
          }

          return item;
        });
      },
      inputChange() {
        this.$emit('inputChange', this.currentValue, this.items);
      }
    },
    created() {

    }
  };
</script>

<style lang="less">

</style>

<template>
  <div
    class="FormItemComponent"
    :style="setWidth"
  >
    <div
      v-for="(item,index) in dataColRol"
      v-show="item.show !== false"
      :key="index"
      :style="setDiv(item)"
    >
      <component
        :is="item.component"
        :index="index"
        :items="item.item"
        @inputChange="inputChange"
      />
    </div>
  </div>
</template>

<script>
  import layoutAlgorithm from '../__utils__/layoutAlgorithm';

  export default {
    name: 'FormItemComponent',
    computed: {
      // 计算属性的 getter
      dataColRol() {
        const list = layoutAlgorithm(this.defaultColumn, this.newFormItemLists);
        return Object.keys(list).reduce((temp, current) => {
          temp.push(list[current]);
          return temp;
        }, []);
      },
      // 计算属性的 后台传值
      formDataObject() {
        return this.newFormItemLists.reduce((option, items) => {
          option[items.item.field] = items.item.value;
          return option;
        }, {});
      },
      // 计算属性的 div 的坐标起始点
      setDiv() {
        return item => ` grid-column:${item.x}/${item.col + item.x};grid-row:${item.y}/${item.y + item.row};`;
      },
      // 计算属性的 div的排列格式
      setWidth() {
        // `this` 指向 vm 实例
        const columns = Number(this.defaultColumn) || 4;
        return `grid-template-columns: repeat(${columns},${100 / columns}%`;
      }
    },
    props: {
      defaultColumn: {
        type: Number,
        default: 4
      },
      formItemLists: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    data() {
      return {
        newFormItemLists: [],
        indexItem: -1
      };
    },
    created() {
      const arr = JSON.parse(JSON.stringify(this.formItemLists));
      arr.map((temp, index) => {
        temp.component = this.formItemLists[index].component;
        return temp;
      });
      this.newFormItemLists = arr;
    },
    watch: {
      formDataObject: {
        handler(val, old) {
          if (this.indexItem < 0) {
            return; 
          }

          this.newFormItemLists.map((items, i) => {
            const item = items.item;
            if (Object.hasOwnProperty.call(item.validate, 'dynamicforcompute')) {
              if ((val[item.validate.dynamicforcompute.computecolumn] === old[item.validate.dynamicforcompute.computecolumn])) {
                this.dynamicforcompute(item, val, i);
              } else {
                this.formDataChange();
              }
            } else if (Object.hasOwnProperty.call(item.validate, 'hidecolumn')) {
              const _refcolumn = item.validate.hidecolumn.refcolumn;

              if (val[_refcolumn] !== old[_refcolumn]) {
                this.hidecolumn(item, i);
              }
            }
            return items;
          });
        },
        deep: true
      }
    },
    methods: {
      formDataChange() { // 向父组件抛出整个数据对象以及当前修改的字段
        const formObj = this.newFormItemLists.reduce((obj, current) => {
          obj[current.item.field] = current.item.value;
          return obj;
        }, {});
        this.$emit('formDataChange', formObj, this.newFormItemLists[this.indexItem]);
      },
      resetForm() { // 重置表单
        const arr = JSON.parse(JSON.stringify(this.formItemLists));
        arr.map((temp, index) => {
          temp.component = this.formItemLists[index].component;
          return temp;
        });
        this.newFormItemLists = arr;
        this.indexItem = -1;
      },
      inputChange(value, items, index) {
        this.indexItem = index;
        this.newFormItemLists[index].item.value = value;
      },
      dynamicforcompute(items, json, index) {
        // 被计算 属性 加减乘除
        const str = items.validate.dynamicforcompute.refcolumns.reduce((temp, current) => {
          temp = temp.replace(new RegExp(current, 'g'), Number(json[current]));
          return temp;
        }, items.validate.dynamicforcompute.express);
        this.newFormItemLists[index].item.value = eval(str);
      },
      hidecolumn(items, index) {
        // 隐藏
        const refcolumn = items.validate.hidecolumn.refcolumn;
        const refval = items.validate.hidecolumn.refval;

        this.newFormItemLists = this.newFormItemLists.map((option) => {
          if (option.item.field === refcolumn) {
            if (option.item.value === refval) {
              this.newFormItemLists[index].show = false;
            } else {
              this.newFormItemLists[index].show = true;
            }
          }
          return option;
        });
      }


    }
  };
</script>

<style lang="less">
.FormItemComponent > div {
  border:1px solid #fff;
  box-sizing: border-box;
}
.FormItemComponent {
  display: grid;
  grid-template-columns: repeat(4, 25%);
  grid-auto-rows: minmax(auto);
}
</style>

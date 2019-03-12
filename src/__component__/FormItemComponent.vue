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
        const columns = Number(this.defaultColumn) || 2;
        return `grid-template-columns: repeat(${columns},1fr`;
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
        newFormItemLists: this.formItemLists,
        indexItem: 0,
        currentChangeItem: ''
      };
    },
    created() {
      // this.formDataObject = this.formItemLists.reduce((array, item) => array.concat(item.item), []);
    },
    watch: {
      formDataObject: {
        handler(val, old) {
          this.newFormItemLists.map((items, i) => {
            const item = items.item;
            if (Object.hasOwnProperty.call(item.validate, 'dynamicforcompute')) {
              this.dynamicforcompute(item, val, i);
            } else if (Object.hasOwnProperty.call(item.validate, 'hidecolumn')) {
              const _refcolumn = item.validate.hidecolumn.refcolumn;

              if (val[_refcolumn] !== old[_refcolumn]) {
                this.hidecolumn(item, i);
              }
            }
          });
        },
        deep: true
      }
    },
    methods: {
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
  grid-template-columns: repeat(4, 20%);
  grid-auto-rows: minmax(auto);
}
</style>

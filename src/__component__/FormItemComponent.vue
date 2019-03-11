<template>
  <div
    id="container"
    class="container"
    :style="setWidth"
  >
    <div
      v-for="(item,index) in dataColRol"
      v-show="item.show !== false"
      :key="index"
      :style="setDiv(item)"
    >
      {{ index }} {{ item.item.field }}
      <component
        :is="item.component"
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
      setDiv() {
        return item => ` grid-column:${item.x}/${item.col + item.x};grid-row:${item.y}/${item.y + item.row};`;
      },
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
        currentChangeItem: ''
      };
    },
    created() {
      // this.formDataObject = this.formItemLists.reduce((array, item) => array.concat(item.item), []);
    },
    methods: {
      inputChange(value, items) {
        this.currentChangeItem = items;
        this.newFormItemLists.map((item) => {
          if (item.item.field === items.field) {
            item.item.value = value;
          }

          return item;
        });
      },
      hiddenFormLists(key, show) {
        const array = this.newFormItemLists.reduce((temp, current) => {
          if (current.item.field === key) {
            current.show = show;
          }
          temp.push(current);
          return temp;
        }, []);
        this.newFormItemLists = array;
        this.currentChangeItem = null;
      }

      
    }
  };
</script>

<style lang="less">
#container > div {
  background-color: skyblue;
  min-height: 100px;
  border:1px solid #fff;
  box-sizing: border-box;
}
.container {
  display: grid;
  grid-template-columns: repeat(4, 20%);
  grid-auto-rows: minmax(100px,auto); 
  /* grid-row-gap: 0.5em; */
  /* grid-column-gap: 20px; */

}
</style>

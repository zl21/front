<template>
  <div 
    class="listsForm"
  >
    <div
      class="tag-close"
      @click="toggle"
    >
      <Icon
        :class="className"
      />
    </div>
    <div
      v-for="(item,index) in Object.keys(ItemLists)"
      :key="index"
      :class="['item',ItemLists[item].item.field,(index > (defaultColumn*searchFoldnum - 1) && !dowClass)?'long':'']"
    >
      <component
        :is="initComponent(ItemLists[item].item,index)"
        :items="ItemLists[item].item"
        :label-width="90"
      />
    </div>
  </div>
</template>
<script>
  import RenderComponent from './RenderComponent';

  export default {
    computed: {
      className() {
        return `${this.dowClass === false ? ' iconfont  iconios-arrow-down' : 'iconfont  iconios-arrow-down icon-xiadown'}`;
      }
    },
    props: {
      id: {
        type: [Number, String],
        default: null
      },
      defaultColumn: {
        type: [Number, String],
        default: 4
      },
      formItemLists: {
        type: Array,
        default() {
          return [];
        }
      },
      searchFoldnum: {
        type: [Number, String],
        default() {
          return 0;
        }
      },
      defaultSpread: {
        type: Boolean,
        default() {
          return true;
        }
      }
    },
    data() {
      return {
        dowClass: true, // 默认全部展开  false为折叠状态
        ItemLists: {}, // 储存列表数据
      };
    },
    methods: {
      initComponent(item) { // init组件
        const Render = new RenderComponent(item, this.id);
        return Render.Initialize();
      },
      toggle() { // 折叠切换
        this.dowClass = !this.dowClass;
        setTimeout(() => {
          const detailTable = document.querySelector('.detailTable');
          if (detailTable && detailTable.agTable) {
            detailTable.agTable.fixContainerHeight();
          }
        }, 300);
      },
      dealData(item, value) {
        if (!value) { // 过滤空数据字段
          return {};
        }
        const json = {}; // 当前字段的数据存储
        json[item.field] = value;
        return json;
      },


      // public API
      getFormData() {
        let formData = {};
        this.formItemLists.map((item) => {
          const components = this.$_live_getChildComponent(window.vm, `${this.id}${item.item.field.TextFilter()}`);
          const json = this.dealData(item.item, components.value);
          formData = Object.assign({}, formData, json);
          return item;
        });

        return formData;
      }
    },
    created() {
      // 处理合并字段
      this.formItemLists.map((item, index) => {
        if (item.item.field) {
          this.ItemLists[item.item.field] = item;
        } else {
          item.item.field = `R3_index_${index}`;
          this.ItemLists[item.item.field] = item;
        }
        return item;
      });
      
      // 处理折叠的默认值
      this.dowClass = !this.defaultSpread;
    }
  };

</script>
<style lang="less" scoped>
@defaultCol: 4;  //控制一行展示的列数
.listsForm{
  flex-wrap: wrap;
  display: flex;
  border: 1px solid #d8d8d8;
  padding: 0 28px 8px 0;
  position: relative;
  transition: height 0 ease;
  overflow: hidden;
  >.item{
    width: percentage(1/@defaultCol);
    box-sizing: border-box;

    &.long{
      display: none;
    }
  }
}
</style>


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
      :key="ItemLists[item]._index"
      :class="['item',ItemLists[item].colname,(index > (defaultColumn*searchFoldnum - 1) && !dowClass)?'long':'']"
    >
      <component
        :is="initComponent(ItemLists[item],index)"
        :items="ItemLists[item]"
        :label-width="90"
      />
    </div>
  </div>
</template>
<script>
  import RenderComponent from './RenderComponent';
  import ParameterDataProcessing from './parameterDataProcessing';
  import { listDefaultColumn } from '../../constants/global'; 

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
        formArray: [], // 存储列表数据
      };
    },
    methods: {
      resetForm() {
        // 处理合并字段
        this.ItemLists = {}
        this.formArray = []
        this.formItemLists.map((item, index) => {
          if (item.colname) {
            item._index = Math.random()
            this.ItemLists[item.colname] = JSON.parse(JSON.stringify(item));
          } else {
            item.colname = `R3_index_${index}`;
            item._index = Math.random()
            this.ItemLists[item.colname] = JSON.parse(JSON.stringify(item));
          }
          this.formArray.push(JSON.parse(JSON.stringify(item)));
          return item;
        });
      },
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
        // 通过ParameterDataProcessing类对数据进行处理
        const ParameterData = new ParameterDataProcessing(item, value);
        return ParameterData.dataProcessing();
      },
      isEmpty(object) {
        for (const name in object) {
          return false;
        }
        return true;
      },
      deleteEmptyProperty(object) {
        for (const i in object) {
          const value = object[i];
          if (typeof value === 'object') {
            if (Array.isArray(value)) {
              if (value.length === 0) {
                delete object[i];
                continue;
              }
            }
            this.deleteEmptyProperty(value);
            if (this.isEmpty(value)) {
              delete object[i];
            }
          } else if (value === '' || value === null || value === undefined) {
            delete object[i];
          } 
        }
      },


      // public API
      getFormData() {
        let formData = {};
        console.log(this.formArray)
        this.formArray.map((item) => {
          const components = this.$_live_getChildComponent(this, `${this.id}${item.colname.TextFilter()}`);
          const value = components.value;
          if (item.display === 'OBJ_FK' && (item.fkobj.fkdisplay === 'mop' || item.fkobj.fkdisplay === 'dop')) { // 处理外健弹窗类型组件数据层级获取,通过子组件获取数据
            // value = components.$children[0].selected ? components.$children[0].selected.map(temp => temp.ID).join(',') : '';
          }
          const json = this.dealData(item, value);
          formData = Object.assign({}, formData, json);
          return item;
        });
        this.deleteEmptyProperty(formData);
        return formData;
      }
    },
    created() {
      this.resetForm()
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
  margin-bottom: 6px;
  >.item{
    width: percentage(1/@defaultCol);
    box-sizing: border-box;

    &.long{
      display: none;
    }
  }
}
</style>

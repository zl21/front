<template>
  <div class="panelForm">
    <div
      v-for="(item,index) in Object.keys(formItemLists)"
      :key="formItemLists[item]._index"
    >
      <Collapse
        :value="['other','(TEST.ID+10)']"
      >
        <Panel
          title-type="center"
          :isTitleShow="formItemLists[item].parentdesc?true:false"
          :name="formItemLists[item].parentname"
        >
          {{ formItemLists[item].parentdesc }}
          <div
            slot="content"
            :style="setWidth"
            class="content"
          >
            <div
            v-for="(temp,index) in Object.keys(formItemLists[item].childs)"
            :key="index"
            :style="setDiv(formItemLists[item].childs[temp])"
          >
            <component
              :is="initComponent(formItemLists[item].childs[temp],index)"
              :items="formItemLists[item].childs[temp]"
              :label-width="90"
              
            />
          </div>
          </div>
        </Panel>
        
      </Collapse>
    </div>
  </div>
</template>
<script>
import layoutAlgorithm from '../../../__utils__/layoutAlgorithm';
import DownComponent from '../../DownComponent';
import FormItem from '../FormItem';
import RenderComponent from '../RenderComponent';
import ParameterDataProcessing from '../parameterDataProcessing';

export default {
  components:{ DownComponent, FormItem },
  props:{
    id: {
      type: [Number, String],
      default: null
    },
    defaultData:{
      type: [Array, Object]
    }
  },
  computed:{
    formItemLists(){
      let data = JSON.parse(JSON.stringify(this.defaultData))

      if(!data.addcolums){
        return []
      }

      // 处理单字段分组
      let sumObject = {
        hrdisplay: 'expand',
        parentdesc: null,
        parentname: 'other',
        childs: [],
        size: 0
      }
      data.addcolums = data.addcolums.filter(item =>{
        if(!item.childs){
          sumObject.childs.push(item.child)
        }
        return item.childs
      })

      if(sumObject.childs.length > 0){
        data.addcolums.push(sumObject)
      }
      
      // 数组转对象处理，避免vue渲染时的指针问题
      data.addcolums.map(item => {
        item._index = Math.random()
        item.childs = {...layoutAlgorithm(Number(data.objviewcol), item.childs?item.childs:[item.child])};
        Object.keys(item.childs).map(temp => {
          

          item.childs[temp].tableName = this.$route.params.tableName;
          item.childs[temp].itemId = this.$route.params.itemId;
          item.childs[temp]  = new RenderComponent(JSON.parse(JSON.stringify(item.childs[temp]))).itemConversion();
          return temp
        })
        return item;
      })
      return {...data.addcolums}
    },
    // 计算属性的 div的排列格式
    setWidth() {
      // `this` 指向 vm 实例
      const columns = Number(this.defaultColumn) || 4;
      return `grid-template-columns: repeat(${columns},${100 / columns}%`;
    },
    // 计算属性的 div 的坐标起始点
    setDiv() {
      return item => ` grid-column:${item.x}/${item.col + item.x};grid-row:${item.y}/${item.y + item.row};`;
    },
  },
  methods:{
    initComponent(item) { // init组件
      let defaultItem = JSON.parse(JSON.stringify(item));
      const Render = new RenderComponent(defaultItem, this.id);
      return Render.Initialize();
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
      console.log(this.formItemLists)
      Object.keys(this.formItemLists).map(temp => {
        Object.keys(this.formItemLists[temp].childs).map(j => {
          let item = this.formItemLists[temp].childs[j];
          const components = this.$_live_getChildComponent(this, `${this.id}${item.colname.TextFilter()}`);
          const value = components.value;
          const json = this.dealData(item, value);
          formData = Object.assign({}, formData, json);
          return item;
        })
        return temp
      })
      this.deleteEmptyProperty(formData);
      console.log(formData)
      return formData;
    },
    getFormDataLabel() {
      let formData = {};
      this.formArray.map((item) => {
        const components = this.$_live_getChildComponent(this, `${this.id}${item.colname.TextFilter()}`);
        const value = components.value;
        const json = {
          [item.colname]:value
        };
        formData = Object.assign({}, formData, json);
        return item;
      });
      this.deleteEmptyProperty(formData);
      return formData;
    }
  },
  created(){

  }
}
</script>
<style lang="less" >
.panelForm{
  .content{
    display: grid;
  }
}
</style>
<template>
  <div class="panelForm">
    <div
      v-for="(item,index) in Object.keys(formItemLists)"
      :key="index"
    >
      <Collapse
        :value="collapseValue"
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
            :key="formItemLists[item].childs[temp]._index"
            :style="formItemLists[item].childs[temp].styles"
          >
            <keep-alive>
              <component
                :is="formItemLists[item].childs[temp].component"
                :items="formItemLists[item].childs[temp]"
                :label-width="90"
                
              />
            </keep-alive>
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
import LinkageRelationships from '../../ExtendedAttributes/LinkageRelationships';

export default {
  components:{ DownComponent, FormItem },
  props:{
    tableName: {  // 表名
      type: [Number, String],
      default: null
    },
    defaultData:{  //表单数据
      type: [Array, Object]
    },
    readonly:{  //表单是否整体禁用
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      collapseValue: [],  //控制面板的展开数据
    }
  },
  computed:{
    formItemLists(){
      this.$R3loading.show(this.$route.params.tableName)
      let data = JSON.parse(JSON.stringify(this.defaultData))
      if(!data.addcolums){
        return []
      }

      data.addcolums = new LinkageRelationships(JSON.parse(JSON.stringify(this.defaultData)).addcolums).initializeData()

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
      data.addcolums.map((item,index) => {
        item.childs = {...layoutAlgorithm(Number(data.objviewcol), item.childs?item.childs:[item.child])};

        Object.keys(item.childs).map((temp) => {
          item.childs[temp]._index = `${index}_${temp}_${Math.random()}`
          if(this.readonly){
            item.childs[temp].readonly = this.readonly
          }
          // item.childs[temp].styles = this.setDiv(item.childs[temp])
          this.$set(item.childs[temp],'styles',this.setDiv(item.childs[temp]))
          item.childs[temp].tableName = this.$route.params.tableName;
          item.childs[temp].itemId = this.$route.params.itemId;
          item.childs[temp].component = this.initComponent(item.childs[temp],index);
          item.childs[temp]  = new RenderComponent(JSON.parse(JSON.stringify(item.childs[temp]))).itemConversion();
          return temp
        })
        return item;
      })


      // 处理表单关闭
      this.loading = setInterval(() => {
        let index = Object.keys(data.addcolums.reverse()[0].childs).length - 1
        let lastItem = data.addcolums[0].childs[index]
        let com = this.$_live_getChildComponent(this, `${this.$route.params.tableName}${lastItem.colname}`);
        if(com){
          this.$R3loading.hide(this.$route.params.tableName)
          clearInterval(this.loading)
        }
      },50)
      return {...data.addcolums}
    },
    // 计算属性的 div的排列格式
    setWidth() {
      // `this` 指向 vm 实例
      const columns = Number(this.defaultData.objviewcol) || 4;
      return `grid-template-columns: repeat(${columns},${100 / columns}%`;
    },
    // 计算属性的 div 的坐标起始点
    setDiv() {
      return item => {
        if(item.x === -1 || item.y === -1){
          return 'display: none';
        }
        return `grid-column:${item.x}/${item.col + item.x};grid-row:${item.y}/${item.y + item.row};`
      };
    },
  },
  watch:{
    formItemLists:{
      handler(val){  //处理展开面板的默认值
        if(Object.keys(val).length > 0){
          this.collapseValue = []
          Object.keys(val).map(item => {
            let data = val[item]
            if(data.hrdisplay === 'expand'){
              this.collapseValue.push(data.parentname)
            }
          })
        }

      }
    }
  },
  methods:{
    initComponent(item) { // init组件
      let defaultItem = JSON.parse(JSON.stringify(item));
      const Render = new RenderComponent(defaultItem, this.tableName);
      return Render.Initialize();
    },
    panelRedraw(array){
      const columns = Number(this.defaultData.objviewcol) || 4;
      let childs = layoutAlgorithm(columns, Object.values(array));
      Object.keys(childs).map(temp => {
        let a = this.$_live_getChildComponent(this,`${this.tableName}${childs[temp].colname}`)
        a.$el.parentNode.style = this.setDiv(childs[temp])
        return temp
      })
      return childs
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
    getFormData() { //获取整个表单的传参数据
      let formData = {};
      Object.keys(this.formItemLists).map(temp => {
        Object.keys(this.formItemLists[temp].childs).map(j => {
          let item = this.formItemLists[temp].childs[j];
          const components = this.$_live_getChildComponent(this, `${this.tableName}${item.colname.TextFilter()}`);
          console.log("🚀 ~ 数据", components)
          const value = components.value;
          const json = this.dealData(item, value);
          formData = Object.assign({}, formData, json);
          return item;
        })
        return temp
      })
      this.deleteEmptyProperty(formData);
      return formData;
    },
    getFormDataLabel() {  //获取整个表单的展示数据+传参数据
      return new Promise((resolve,reject) => {
          let formData = {};
          Object.keys(this.formItemLists).map(temp => {
            Object.keys(this.formItemLists[temp].childs).map(j => {
              let item = this.formItemLists[temp].childs[j];
              const components = this.$_live_getChildComponent(this, `${this.id}${item.colname.TextFilter()}`);
              let value = item.isuppercase && components.value && !item.display ?components.value.toUpperCase():components.value;
              if(value && value[0] && item.display === 'OBJ_DATENUMBER'){
                value = [new Date().r3Format(new Date(value[0]), 'yyyy-MM-dd'),new Date().r3Format(new Date(value[1]), 'yyyy-MM-dd')]
              }
              if(value && value[0] && item.display === 'OBJ_DATE'){
                value = [new Date().r3Format(new Date(value[0]), 'yyyy-MM-dd 00:00:00'),new Date().r3Format(new Date(value[1]), 'yyyy-MM-dd 23:59:59')]
              }
              const json = {
                [item.colname]:value
              };
              formData = Object.assign({}, formData, json);
              return item;
            })
            return temp
          })
          
          this.deleteEmptyProperty(formData);

          resolve(formData)
        })
    }
  },
  mounted(){

    // 测试字段显示隐藏功能
    // setTimeout(() => {
    //   delete this.formItemLists[1].childs[1]

    //   let item = this.formItemLists[1]
    //   this.formItemLists[1]._index = Math.random()
      // item.childs = layoutAlgorithm(Number(4), Object.values(item.childs));
      // Object.keys(item.childs).map(temp => {
      //     item.childs[temp]._index = Math.random()
      //     if(this.readonly){
      //       item.childs[temp].readonly = this.readonly
      //     }
      //     item.childs[temp].tableName = this.$route.params.tableName;
      //     item.childs[temp].itemId = this.$route.params.itemId;
      //     return temp
      //   })
      // this.$forceUpdate()
    // },10000)
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
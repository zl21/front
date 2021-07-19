
<template>
  <div
    :class="classes"
  >
    <div
      v-if="Object.keys(ItemLists).length > (defaultColumn*searchFoldnum) "
      :class="tagCloseCls"
      @click="toggle"
    >
      <Icon
        :class="className"
      />
    </div>
    <div
      v-for="(item,index) in Object.keys(ItemLists)"
      :key="ItemLists[item]._index"
      :index="index"
      :class="['item',ItemLists[item].colname,(index > (defaultColumn*searchFoldnum - 1) && !dowClass)?'long':'']"
    >

      <keep-alive>
        <component
          :is="ItemLists[item].component"
          :items="ItemLists[item]"
          @on-change="valueChange"
          :label-width="90"
        />
      </keep-alive>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import RenderComponent from './RenderComponent';
  import ParameterDataProcessing from './parameterDataProcessing';
    import store from '../../__config__/store.config';

  import {
    Version,
    classFix
  } from '../../constants/global';

  export default {
    computed: {
      ...mapState('global', {
        activeTab: ({ activeTab }) => activeTab,
        // isRequest: ({ isRequest }) => isRequest,

      }),
      className() {
        return `${this.dowClass === false ? ' iconfont  iconios-arrow-down' : 'iconfont  iconios-arrow-down icon-xiadown'}`;
      },
      classes() {
        return [
          `${classFix}ListsForm`,
          'downComponent-context'
        ];
      },
      tagCloseCls: () => `${classFix}tag-close`,
    },
    beforeCreate(){
      if(!this.$store){
          this.$store =store 
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
        component:'', // 设置组件名称
        formArray: [], // 存储列表数据
      };
    },
    methods: {
      valueChange(item,val){
        // 表单change
        let arrjson = this.dealData(item, val);
        if(item.fkobj && item.fkobj.searchmodel){
               if(Version()==='1.3'){
                 if(!Array.isArray(arrjson[item.colname])){
                  if(arrjson[item.colname]){
                      let id = arrjson[item.colname].split(',');
                      arrjson[item.colname] = id;
                  }
                 }
               }

            }
        if(this.$parent.updateFormAssignData){
          this.$parent.updateFormAssignData(arrjson);
        }
      },
      resetForm() {
        // 处理合并字段
        this.ItemLists = {}
        this.formArray = []
        this.formItemLists.map((item, index) => {
          item.tableName = this.activeTab.tableName;
          item.show = true;
          if(item.webconf && item.webconf.display === 'YearMonth'){
            item.display = 'YearMonth';
          }
          if(item.webconf && item.webconf.display === 'String'){
            item.display = 'String';
          }
          if (item.colname) {
            item._index = Math.random()
            this.ItemLists[item.colname] = JSON.parse(JSON.stringify(item));
          } else {
            item.colname = `R3_index_${index}`;
            item._index = Math.random()
            this.ItemLists[item.colname] = JSON.parse(JSON.stringify(item));
          }
          this.ItemLists[item.colname].component = this.initComponent(this.ItemLists[item.colname],index)
          this.formArray.push(JSON.parse(JSON.stringify(item)));
          return item;
        });
      },
      valueChange(item,val){
        // 表单change
        let arrjson = this.dealData(item, val);
        
        if(item.fkobj && item.fkobj.searchmodel){
               if(Version()==='1.3'){
                 if(!Array.isArray(arrjson[item.colname])){
                  if(arrjson[item.colname]){
                      let id = arrjson[item.colname].split(',');
                      arrjson[item.colname] = id;
                  }
                 }
               }

        }
        if(this.$parent.updateFormAssignData){
          this.$parent.updateFormAssignData(arrjson);
        }
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
      // 组件回车事件
      handleEnter(){
        this.$emit('onHandleEnter',...arguments)
      },
      r3Format(val,item){
        // 兼容1.3 数据格式传参
        if(Version()==='1.3'){
            if(['OBJ_DATE', 'OBJ_DATENUMBER', 'YearMonth', 'OBJ_DATETIME'].includes(item.display) && val[item.colname]){
               val[item.colname] = val[item.colname].replace(/-/g,'/');
              return val
            }else{
              return val;
            }
        }else{
            return val
        }
      },


      // public API
      getFormData() {
        return new Promise((resolve,reject) => {
          let formData = {};
          this.formArray.every((item) => {
            const components = this.$_live_getChildComponent(this, `${this.id}${item.colname.TextFilter()}`);
            if(!components){
              return;
            }
            const value = item && item.isuppercase && components.value &&  !item.display ?components.value.toUpperCase():components.value;


            const json = this.r3Format(this.dealData(item, value),item);
             if(item.fkobj && item.fkobj.searchmodel){
               if(Version()==='1.3'){
                 if(!Array.isArray(json[item.colname])){
                  if(json[item.colname]){
                      let id = json[item.colname].split(',');
                      json[item.colname] = id;
                  }
                 }
               }

            }
            formData = Object.assign({}, formData, json);
            return item;
          });
          this.deleteEmptyProperty(formData);
          resolve(formData)
        })
      },
      getFormDataLabel() {

        return new Promise((resolve,reject) => {
          let formData = {};
          this.formArray.every((item) => {
            const components = this.$_live_getChildComponent(this,`${this.id}${item.colname.TextFilter()}`);
            if(!components){
              return;
            }
            let value = item.isuppercase && components && components.value && !item.display ?components.value.toUpperCase():components.value;
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
          });

          this.deleteEmptyProperty(formData);

          resolve(formData)
        })

      }

    },
    created() {
      this.resetForm()
      // 处理折叠的默认值
      this.dowClass = !this.defaultSpread;
    },
    watch:{
      formItemLists:{
        handler(){
          this.resetForm()
        },
        deep: true
      }
    }
  };

</script>

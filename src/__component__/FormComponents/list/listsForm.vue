
<template>
  <div :class="classesbox">
    <div :class="classes" id="listForm">
      <div v-if="Object.keys(ItemLists).length > (setdefaultColumn*searchFoldnum - indexButton) && !hiddenIcon"
           :class="tagCloseCls"
           @click="toggle">
        <Icon :class="className" />
      </div>
      <component v-if="ButtonHtml" :class="classButton" :is="ButtonHtml"></component>
      <div :class="classesContent">
        <div v-for="(item,index) in Object.keys(ItemLists)"
             :key="ItemLists[item]._index"
             :index="index"
             :class="['item',ItemLists[item].colname,(index > (setdefaultColumn*searchFoldnum - 1 - indexButton) && !dowClass)?'long':'']">

          <keep-alive>
            <component :is="ItemLists[item].component"
                       :items="ItemLists[item]"
                       @on-change="valueChange"
                       :label-width="90" />
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import RenderComponent from '../RenderComponent';
import ParameterDataProcessing from '../parameterDataProcessing';
import store from '../../../__config__/store.config';

import {
  Version,
  classFix
} from '../../../constants/global';

export default {
  computed: {
    ...mapState('global', {
      activeTab: ({ activeTab }) => activeTab,
      // isRequest: ({ isRequest }) => isRequest,

    }),
    className () {
      return `${this.dowClass === false ? ' iconfont  iconios-arrow-down' : 'iconfont  iconios-arrow-down icon-xiadown'}`;
    },
    classes () {
      return [
        `${classFix}ListsForm`,
        'downComponent-context'
      ];
    },
    // classesContent () {
    //   return [
    //     `${classFix}ListsForm-content ${this.calssValue}`
    //   ];
    // },
    classButton(){
       return [
        `${classFix}ListsForm-button`
      ];

    },
    classesbox(){
      return [
        `${classFix}ListsForm-box`
      ];
    },
    tagCloseCls: () => `${classFix}tag-close`,
  },
  beforeCreate () {
    if (!this.$store) {
      this.$store = store
    }
  },
  beforeDestroy(){
        window.removeEventListener('resize', this.setColumn);
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
    search:{
      type:Boolean,
      default:false
    },
    formItemLists: {
      type: Array,
      default () {
        return [];
      }
    },
    searchFoldnum: {
      type: [Number, String],
      default () {
        return 0;
      }
    },
    defaultSpread: {
      type: Boolean,
      default () {
        return true;
      }
    }
  },
  data () {
    return {
      dowClass: true, // 默认全部展开  false为折叠状态
      ItemLists: {}, // 储存列表数据
      component: '', // 设置组件名称
      setdefaultColumn:4,
      ButtonHtml:'',
      hiddenIcon:false,  // 默认不隐藏icon
      indexButton:0,  // 渲染按钮+1
      classesContent :`${classFix}ListsForm-content`,
      formArray: [], // 存储列表数据
    };
  },
  methods: {
    resetForm () {
      // 处理合并字段
      this.ItemLists = {}
      this.formArray = []
      this.formItemLists.map((item, index) => {
        item.tableName = this.activeTab.tableName;
        item.show = true;
        if (item.webconf && item.webconf.display === 'YearMonth') {
          item.display = 'YearMonth';
        }
        if (item.webconf && item.webconf.display === 'String') {
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
        this.ItemLists[item.colname].component = this.initComponent(this.ItemLists[item.colname], index)
        this.formArray.push(JSON.parse(JSON.stringify(item)));
        return item;
      });
    },
    valueChange (item, val) {
      // 表单change
      let arrjson = this.dealData(item, val);

      if (item.fkobj && item.fkobj.searchmodel) {
        if (Version() === '1.3') {
          if (!Array.isArray(arrjson[item.colname])) {
            if (arrjson[item.colname]) {
              let id = arrjson[item.colname].split(',');
              arrjson[item.colname] = id;
            }
          }
        }

      }
    
      if (this.$parent.updateFormAssignData) {
        this.$parent.updateFormAssignData(arrjson);
      }
    },
    setColumn(){
      // 设置列数
      if(!document.querySelector('.StandardTableListRootDiv')){
        return;
      }
      let width = document.querySelector('.StandardTableListRootDiv').offsetWidth;
      if(width>700){
        this.setdefaultColumn = 4;
        this.classesContent = `${classFix}ListsForm-content`;
      }else if(width<700){
        this.setdefaultColumn = 3;
        this.classesContent = `${classFix}ListsForm-content ListsForm-small`;
      }
     
      this.setButtonType(this.dowClass);
     
    },
    setButtonType(){
      // 渲染查询按钮
       this.$nextTick(()=>{
        // 动态
        let itemArray =  document.querySelectorAll('#listForm .item');
         let index = this.setdefaultColumn*this.searchFoldnum-2;
        if(this.dowClass == true){
            index = itemArray.length -1;

        }
        document.querySelector('.ListsForm-content').style.marginBottom = '0px';
        if(index> itemArray.length ){
            //  大于总常数
            index = itemArray.length;
            document.querySelector('.ListsForm-content').style.marginBottom = '30px';

          }
        if(document.querySelector('.ListsForm') && document.querySelector('.ListsForm').offsetWidth<560){
          if(((index+1)%this.searchFoldnum) !==1 ){
            document.querySelector('.ListsForm-content').style.marginBottom = '30px';
          }
        }
         
      
       itemArray.forEach((item,i)=>{
         if(index === i){
            item.style.marginRight = '150px';
            this.indexButton = 1;
         }else{
            item.style.marginRight = '0px';
         }
       })
          
      })
      if(window.ProjectConfig.layoutDirectionSlot && window.ProjectConfig.layoutDirectionSlot.listFormButton){
        this.ButtonHtml = window.ProjectConfig.layoutDirectionSlot.listFormButton;
        this.hiddenIcon = this.ButtonHtml.data().hiddenIcon || false;
        let hiddenButtons = this.ButtonHtml.data().hiddenButtons || [];
        if(Array.isArray(hiddenButtons)){
          // 隐藏列表查询按钮
          let data = JSON.parse(JSON.stringify(this.$parent.buttons));
          hiddenButtons.forEach((key)=>{
            data.dataArray[key] = false;
          });
          if(this.ButtonHtml.props.ButttonCallBack){
            // 点击回调事件
            this.ButtonHtml.props.ButttonCallBack.default = this.$parent.buttonClick;
          }
          if(this.ButtonHtml.props.IconCallBack){
            // 收拉框回调
            this.ButtonHtml.props.IconCallBack.default = this.toggle;
          }
          this.$parent.filterButtonsForShow(data.dataArray);
        }
        
      }else{
        this.ButtonHtml = window.ProjectConfig.listFormButton;
      }
          console.log(this.$parent.buttons.dataArray, );


    },
    initComponent (item) { // init组件
      const Render = new RenderComponent(item, this.id);
      return Render.Initialize();
    },
    toggle () { // 折叠切换
      this.dowClass = !this.dowClass;
      this.setButtonType(this.dowClass);
      setTimeout(() => {
        const detailTable = document.querySelector('.detailTable');
        if (detailTable && detailTable.agTable) {
          detailTable.agTable.fixContainerHeight();
        }
      }, 300);
    },
    dealData (item, value) {
      // 通过ParameterDataProcessing类对数据进行处理
      const ParameterData = new ParameterDataProcessing(item, value);
      return ParameterData.dataProcessing();
    },
    isEmpty (object) {
      for (const name in object) {
        return false;
      }
      return true;
    },
    deleteEmptyProperty (object) {
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
    handleEnter () {
      this.$emit('onHandleEnter', ...arguments)
    },
    r3Format (val, item) {
      // 兼容1.3 数据格式传参
      if(['OBJ_SELECT','RADIO_GROUP','CHECKBOX_GROUP'].includes(item.display) ){
        console.log( val[item.colname],'323');
        if(val[item.colname] && Array.isArray(val[item.colname])){
          val[item.colname] = val[item.colname].reduce((arr,item)=>{
            arr.push(`=${item}`);
            return arr;
          },[]);
          
        }
        
      }
      if (Version() === '1.3') {
        if (['OBJ_DATE', 'OBJ_DATENUMBER', 'YearMonth', 'OBJ_DATETIME'].includes(item.display) && val[item.colname]) {
          val[item.colname] = val[item.colname].replace(/-/g, '/');
          return val
        } else {
          return val;
        }
      } else {
        return val
      }
    },


    // public API
    getFormData () {
      return new Promise((resolve, reject) => {
        let formData = {};
        this.formArray.every((item) => {
          const components = this.$_live_getChildComponent(this, `${this.id}${item.colname.TextFilter()}`);
          if (!components) {
            return;
          }
          const value = item && item.isuppercase && components.value && !item.display ? components.value.toUpperCase() : components.value;


          const json = this.r3Format(this.dealData(item, value), item);
          if (item.fkobj && item.fkobj.searchmodel) {
            if (Version() === '1.3') {
              if (!Array.isArray(json[item.colname])) {
                if (json[item.colname]) {
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
    getFormDataLabel () {

      return new Promise((resolve, reject) => {
        let formData = {};
        this.formArray.every((item) => {
          const components = this.$_live_getChildComponent(this, `${this.id}${item.colname.TextFilter()}`);
          if (!components) {
            return;
          }
          let value = item.isuppercase && components && components.value && !item.display ? components.value.toUpperCase() : components.value;
          if (value && value[0] && item.display === 'OBJ_DATENUMBER') {
            value = [new Date().r3Format(new Date(value[0]), 'yyyy-MM-dd'), new Date().r3Format(new Date(value[1]), 'yyyy-MM-dd')]
          }
          if (value && value[0] && item.display === 'OBJ_DATE') {
            value = [new Date().r3Format(new Date(value[0]), 'yyyy-MM-dd 00:00:00'), new Date().r3Format(new Date(value[1]), 'yyyy-MM-dd 23:59:59')]
          }
          const json = {
            [item.colname]: value
          };
          formData = Object.assign({}, formData, json);
          return item;
        });

        this.deleteEmptyProperty(formData);

        resolve(formData)
      })

    }

  },
  created () {
    this.resetForm();
    // 处理折叠的默认值
    
    this.setdefaultColumn =  this.defaultColumn;
    this.dowClass = !this.defaultSpread;
    if(this.search){
       this.setColumn();
       window.addEventListener('resize', this.setColumn)
    }
  },
  watch: {
    formItemLists: {
      handler () {
        this.resetForm()
      },
      deep: true
    }
  }
};

</script>

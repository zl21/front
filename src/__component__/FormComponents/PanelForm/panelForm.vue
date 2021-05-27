<template>
  <div class="panelForm compositeAllform">
    <div v-for="(item,index) in Object.keys(formItemLists)"
         :key="index">
      <Collapse :value="collapseValue">
        <Panel title-type="center"
               :isTitleShow="formItemLists[item].parentdesc?true:false"
               :name="formItemLists[item].parentname">
          {{ formItemLists[item].parentdesc }}
          <div slot="content"
               :style="setWidth"
               class="content R3masterForm">
            <div v-for="(temp,index) in Object.keys(formItemLists[item].childs)"
                 :key="formItemLists[item].childs[temp]._index"
                 :index="index"
                 :style="formItemLists[item].childs[temp].styles">
              <keep-alive>
                <component ref="formItem"
                           :id="formItemLists[item].childs[temp].colname"
                           :is="formItemLists[item].childs[temp].component"
                           :items="formItemLists[item].childs[temp]"
                           :label-width="120" />
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
import { validateForm } from './Validate';
import {
     MODULE_COMPONENT_NAME 
  } from '../../../constants/global';
  console.log(MODULE_COMPONENT_NAME,'MODULE_COMPONENT_NAMEMODULE_COMPONENT_NAME')
export default {
  components: { DownComponent, FormItem },
  name:'PanelForm',
  props: {
    tableName: {  // 表名
      type: [Number, String],
      default: null
    },
    defaultData: {  //表单数据
      type: [Array, Object]
    },
    isMainTable: { // 是否是主子表
      type: Boolean,
      default: false
    },
    readonly: {  //表单是否整体禁用
      type: Boolean,
      default: false
    }
  },
  inject: [MODULE_COMPONENT_NAME],
  data () {
    return {
      collapseValue: [],  //控制面板的展开数据
      formData: {}, //整个表单数据
      formDataLabel: {}, //整个表单数据--显示值
      formChangeData: {}, //表单修改过的数据
      formDatadefault: {}, // 表单默认值
      formLabel:{}, // 1.3 LABEL
      defaulDataLabel:{},// 1.3 LABEL
      formItemLists:{}, // 表单数据重绘制
      objviewcol: 4, // 表单默认展示几列
      LinkageForm: [],// 联动状态
      formChangeDataLabel: {},  //表单修改过的数据--显示值
      timer: null,

    }
  },
  computed: {
    // formItemLists () {
      
    // },
    // 计算属性的 div的排列格式
    setWidth () {
      // `this` 指向 vm 实例
      const columns = Number(this.objviewcol) || 4;
      return `grid-template-columns: repeat(${columns},${100 / columns}%`;
    },
    // 计算属性的 div 的坐标起始点
    setDiv () {
      return item => {
        if (item.x === -1 || item.y === -1) {
          return 'display: none';
        }
        return `grid-column:${item.x}/${item.col + item.x};grid-row:${item.y}/${item.y + item.row};`
      };
    },
  },
  watch: {
    formItemLists: {
      handler (val) {  //处理展开面板的默认值
        const { tableName, customizedModuleName } = this.$route.params;
        const checked = this.moduleComponentName.split('.').includes(tableName || customizedModuleName);
        if(!checked){
          return;
        }
        // 清空表单的值

      },
      deep: true
    },
    defaultData:{
      handler (val) {  //处理展开面板的默认值
         const { tableName, customizedModuleName } = this.$route.params;
        const checked = this.moduleComponentName.split('.').includes(tableName || customizedModuleName);
        if(!checked){
          return;

        }
        this.$R3loading.show(this.tableName);
        clearTimeout(this.formTime);
        this.formTime = setTimeout(()=>{
            this.setFormlist();
            this.clearForm();
        },50);

      },
      deep: true
    }
  },
  methods: {
    initializationForm () {
      // 初始化
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (this.$parent.formPanelChange) {
          // v
          this.$parent.initFormPanel(this.defaulData, this.formDataLabel,this.defaulDataLabel)
        } else {
          // H
          this.$parent.InitializationForm(this.defaulData, this.formDataLabel,this.defaulDataLabel)
        }
      },50)

    },
    setFormlist(){

      let data = JSON.parse(JSON.stringify(this.defaultData))
      if (!data.addcolums) {
        this.$R3loading.hide(this.tableName)
        return []
      }
      data.addcolums = new LinkageRelationships(JSON.parse(JSON.stringify(this.defaultData)).addcolums).initializeData()
      this.objviewcol = this.defaultData.objviewcol;
      // 处理单字段分组
      let sumObject = {
        hrdisplay: 'expand',
        parentdesc: null,
        parentname: 'other',
        childs: [],
        size: 0
      }
      data.addcolums = data.addcolums.filter(item => {
        if (!item.childs) {

          if (item.child && item.child.display !== 'hr' && item.child.display !== 'none') {
            sumObject.childs.push(item.child)
          }
        }
        return item.childs
      })

      if (sumObject.childs.length > 0) {
        data.addcolums.push(sumObject)
      }



      // 数组转对象处理，避免vue渲染时的指针问题
      data.addcolums.map((item, index) => {
        let _childs = item.childs ? item.childs : [item.child];
        _childs.map((option) => {

          // 判断是否展示组件
          if (option.display === 'none') {
            option.show = false;
          } else {
            option.show = true;
          }
          if (option.display === 'clob') {
            option.col = 4;
          }
          if (option.display === 'image') {
            // 图片
            if(option.row === 1){
              option.row = 4;
            }
          }
            const srccol = option.validate && option.validate.refcolval && option.validate.refcolval.srccol;
            const prmsrccol = option.validate && option.refcolprem && option.refcolprem.srccol;
            this.LinkageForm.push({
              key: `${this.tableName}${option.colname}`,
              name: option.name,
              show: option.show,
              srccol: `${this.tableName}${srccol || prmsrccol}`,
              maintable: true,
              tableName: this.tableName
            });
          return option;
        })
        // _childs = _childs.filter(child => child.display !== 'none')
        item.childs = { ...layoutAlgorithm(Number(data.objviewcol), _childs) };
        Object.keys(item.childs).map((temp) => {
          item.childs[temp]._index = `${index}_${temp}_${Math.random()}`;
          if (this.readonly) {
            item.childs[temp].readonly = this.readonly || this.defaultData.isdefault
          }
          // item.childs[temp].readonly = this.readonly || this.defaultData.isdefault
          // item.childs[temp].styles = this.setDiv(item.childs[temp])
          this.$set(item.childs[temp], 'styles', this.setDiv(item.childs[temp]))
          item.childs[temp].tableName = this.tableName;
          item.childs[temp].itemId = this.$route.params.itemId;
          item.childs[temp].component = this.initComponent(item.childs[temp], index);
          item.childs[temp].isMainTable = this.isMainTable;
          item.childs[temp] = new RenderComponent(JSON.parse(JSON.stringify(item.childs[temp]))).itemConversion();
          return temp
        })
        return item;
      })
            // 处理表单关闭
      this.loading = setInterval(() => {
        let index = Object.keys(data.addcolums.reverse()[0].childs).length - 1
        let lastItem = data.addcolums[0].childs[index]
        let com = this.$_live_getChildComponent(this, `${this.tableName}${lastItem.colname}`);
        if (com) {
          this.$R3loading.hide(this.tableName)
          clearInterval(this.loading)
        }
      }, 50)
       // 兼容子表
        this.linkFormSet();
       this.formItemLists = { ...data.addcolums }

      // 调整排版
      this.setResize()
    },
    deleteFormData(data){
      //删除状态的key
         let updateLinkageForm = this.$store._mutations[`${this[MODULE_COMPONENT_NAME]}/seleteAddData`]
       if(updateLinkageForm){
        this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/seleteAddData`, data);

       }
    },
    validate () {
      // 获取校验
      let messageTip = validateForm.call(this, 'formItem');

      if (messageTip) {
        this.collapseValue = []
        Object.keys(this.formItemLists).map(item => {
          let data = this.formItemLists[item]
          this.collapseValue.push(data.parentname)
        })
      }
      return messageTip;

    },
    initComponent (item) { // init组件
      let defaultItem = JSON.parse(JSON.stringify(item));
      const Render = new RenderComponent(defaultItem, this.tableName);
      return Render.Initialize();
    },
    panelRedraw (array) {
      const columns = Number(this.objviewcol) || 4;
      let childs = layoutAlgorithm(columns, Object.values(array));
      Object.keys(childs).map(temp => {
        let a = this.$_live_getChildComponent(this, `${this.tableName}${childs[temp].colname}`)
        if (a && a.$el && a.$el.parentNode) {
          a.$el.parentNode.style = this.setDiv(childs[temp])
        }
        return temp
      })
      return childs
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
    // public API
    getFormData () { //获取整个表单的传参数据

      return new Promise((resolve, reject) => {
        let formData = {};
        Object.keys(this.formItemLists).map(temp => {
          Object.keys(this.formItemLists[temp].childs).map(j => {
            let item = this.formItemLists[temp].childs[j];
            const components = this.$_live_getChildComponent(this, `${this.tableName}${item.colname.TextFilter()}`);
            const value = item.isuppercase && components.value && !item.display ? components.value.toUpperCase() : components.value;
            const json = this.dealData(item, value);
            formData = Object.assign({}, formData, json);
            return item;
          })
          return temp
        })
        this.deleteEmptyProperty(formData);
        resolve(formData)
      })
    },
    getFormDataLabel () {  //获取整个表单的展示数据+传参数据
      return new Promise((resolve, reject) => {
        let formData = {};
        Object.keys(this.formItemLists).map(temp => {
          Object.keys(this.formItemLists[temp].childs).map(j => {
            let item = this.formItemLists[temp].childs[j];

            const components = this.$_live_getChildComponent(this, `${this.tableName}${item.colname.TextFilter()}`);
            let value = item.isuppercase && components.value && !item.display ? components.value.toUpperCase() : components.value;
            if (value && value[0] && item.display === 'OBJ_DATENUMBER') {
              value = [new Date().r3Format(new Date(value[0]), 'yyyy-MM-dd'), new Date().r3Format(new Date(value[1]), 'yyyy-MM-dd')]
            }
            if (value && value[0] && item.display === 'OBJ_DATE') {
              value = [new Date().r3Format(new Date(value[0]), 'yyyy-MM-dd 00:00:00'), new Date().r3Format(new Date(value[1]), 'yyyy-MM-dd 23:59:59')]
            }
            if(value &&  value[0] && (item.display === 'image' || item.display === 'doc')){
                value = JSON.stringify(value);
            }
            const json = {
              [item.colname]: value
            };
            formData = Object.assign({}, formData, json);
            return item;
          })
          return temp
        })

        this.deleteEmptyProperty(formData);

        resolve(formData)
      })
    },
    setResize () {
      // 设置表单 展示 的值
      clearTimeout(this.timerResize);
      this.timerResize = setTimeout(() => {
        if (Object.keys(this.formItemLists).length > 0) {
          const width = this.$el.offsetWidth;
          if (width < 400) {
            this.objviewcol = 1;
          } else if (width < 600 && width > 400) {
            this.objviewcol = 2;
          } else if (width < 800 && width > 600) {
            this.objviewcol = 3;
          } else if (width > 800) {
            this.objviewcol = this.defaultData.objviewcol;
          }
          this.collapseValue = []
          Object.keys(this.formItemLists).map(item => {
            let data = this.formItemLists[item]
            if (data.hrdisplay === 'expand') {
              this.collapseValue.push(data.parentname)
            }
            this.panelRedraw(data.childs);
          })
        }

      }, 200)

      // this.formItemLists.forEach(item => {
      // console.log(item,'1212');
      // });
    },
    clearForm(){
      // 清空默认值
        this.formData = {};
        this.formChangeData = {};
        this.defaulData = {}
        this.defaulDataLabel = {};
        this.formDataLabel = {};

    },
    linkFormSet(LinkageForm){
       // 兼容子表传参
       let updateLinkageForm = this.$store._mutations[`${this[MODULE_COMPONENT_NAME]}/updateLinkageForm`]
       if(updateLinkageForm){
         const data = {
          formList: LinkageForm ? LinkageForm : this.LinkageForm,
          formIndex: 7
        };
        this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateLinkageForm`, data);
       }
        
    }
  },
  mounted () {
    this.setFormlist();
    
    // 监听大小
    window.addEventListener('resize', this.setResize);
  },
  activated(){
    // 渲染完毕后调整排版
    this.$nextTick(() => {
      this.setResize()
    })
  }
}
</script>
<style lang="less" >
.panelForm {
  .content {
    display: grid;
  }
}
</style>
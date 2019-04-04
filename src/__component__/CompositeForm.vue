<!--suppress ALL:form-item-lists="FormLists(item.childs)" -->
<template>
  <div>
    <template v-if="type === 'PanelForm'">
      <Collapse
        v-for="(item,index) in computdefaultData"
        :key="index"
        v-model="item.hrdisplay "
        active-key="index"
        @on-change="CollapseClose(index,item.hrdisplay)"
      >
        <Panel
          :key="index"
          title-type="center"
          :name="item.hrdisplay ==='expand' ? 'expand' :'false'"
        >
          {{ item.parentdesc }}
          <div slot="content">
            <FormItemComponent
              :form-item-lists="item.childs"
              :ref="'FormComponent_'+index"
              :mountdataForm = "mountdataForm"
              :key = "index"
              @formDataChange ="formDataChange"
              :type = "type"
              :default-column="defaultData.objviewcol"
            />
          </div>
        </Panel>
      </Collapse>
    </template>
    <template v-if="type === ''">
      <FormItemComponent
      @formDataChange ="formDataChange"
      :mountdataForm = "mountdataForm"
      ref="FormComponent_0"
      :form-item-lists="computdefaultData" />
    </template>
  </div>
</template>

<script>
  import FormItemComponent from './ComFormItemComponent';
  import ItemComponent from './ItemComponent';
  import {
    fkQueryList, fkFuzzyquerybyak, fkGetMultiQuery, fkDelMultiQuery
  } from '../constants/fkHttpRequest';

  export default {
    name: 'CompositeForm',
    components: {
      FormItemComponent
    },
    props: {
      defaultData: {
        type: Object,
        default() {
          return {};
        }
      },
      type: {
        // 判断是否需要 面板 =PanelForm
        type: String,
        default() {
          return '';
        }
      },
      moduleFormType:{
        type: String,
        default() {
          return '';
        }
      },
      updateForm:{
        type:Function,
        default() {
          return '';
        }
      }
    },
    data() {
      return {
        newdefaultData:[],
        formData:{},
        defaultFormData:{},
        expand: 'expand'
      };
    },
    computed: {
      computdefaultData: {
            get:function(){
              console.log('computdefaultData');
              let items = [];
            // 有面板的数据
            if (this.type && Object.prototype.hasOwnProperty.call(this.defaultData, 'addcolums')) {
              items = this.defaultData.addcolums.reduce((array, current,index) => {
                let tem = [];
                if (Object.prototype.hasOwnProperty.call(current, 'childs')) {
                  tem = current.childs.reduce((array2, current2, itemIndex2) => {
                    current2.formIndex = index;
                    const option = this.reduceForm(array2, current2, itemIndex2);
                    array2.push(option);
                    return array2;
                  }, []);
                }
                array.push({
                  childs: tem,
                  hrdisplay: current.hrdisplay,
                  parentdesc: current.parentdesc,
                  parentname: current.parentname
                });
                return array;
              }, []);
            } else if (Object.prototype.hasOwnProperty.call(this.defaultData, 'inpubobj')) {
              // 表单的数据
              items = this.defaultData.inpubobj.reduce((array, current, itemIndex) => {
                current.formIndex = 'inpubobj';
                const option = this.reduceForm(array, current, itemIndex);
                array.push(option);
                return array;
              }, []);
            }
            return items;
          },
          set:function(val){
              return val;
          }

      },

    },
    watch:{
          formData:{
            handler(val, old) {
                if( JSON.stringify(val) !== JSON.stringify(this.defaultFormData)){
                  console.log();

                 if( this.moduleFormType === 'H'){
                    //  if( this.type.length >0 ){
                    //     this.updateTableData(val);
                    //  } else {
                    //    this.updatePanelData(val);
                    //  }
                 }else{
                      //  this.updateFormDataForRefTable(val);
                 }

                }

            },
            deep: true


          }


    },
    methods: {
      CollapseClose(index) {
      },
      Comparison(obj, obj2){
        
      },
      mountdataForm(value){
            // 默认值
        this.defaultFormData = Object.assign(this.defaultFormData,value);
        console.log(' 默认值' );
      },
      reduceForm(array, current, index) {
        const obj = {};
        obj.row = current.row ? current.row : 1;
        obj.col = current.col ? current.col : 1;
        obj.component = ItemComponent;
        obj.item = {
          type: this.checkDisplay(current),
          title: current.name,
          field: current.colname,
          value: this.defaultValue(current),
          inputname: current.inputname,
          props: { ...current },
          event: {
            keydown: (event) => { // 输入框的keydown event, $this
              if (event.keyCode === 13) { // enter回车查询
                this.searchClickData();
              }
            },
            'on-delete': ($this, item, key, index) => {
              fkDelMultiQuery({
                searchObject: {
                  tableid: item.props.fkobj.reftableid,
                  modelname: key
                },
                success: () => {
                  fkGetMultiQuery({
                    searchObject: {
                      tableid: item.props.fkobj.reftableid
                    },
                    success: (res) => {
                      this.freshDropDownPopFilterData(res, index ,current);
                    }
                  });
                }
              });
            },
            'popper-value': ($this, value, Selected, index) => { // 当外键下拉展开时去请求数据
              this.formItemsLists[index].item.value = value;
              if (Selected !== 'change') {
                this.formItemsLists[index].item.props.Selected = Selected;
              }
              // this.formItemsLists = this.formItemsLists.concat([]);
            },
            'popper-show': ($this, item, index) => { // 当气泡拉展开时去请求数据
              fkGetMultiQuery({
                searchObject: {
                  tableid: item.props.fkobj.reftableid
                },
                success: (res) => {
                  this.freshDropDownPopFilterData(res, index ,current);
                }
              });
            },
            'on-show': ($this) => { // 当外键下拉站开始去请求数据
              fkQueryList({
                searchObject: {
                  isdroplistsearch: true,
                  refcolid: current.colid,
                  startindex: 0,
                  range: $this.pageSize
                },
                success: (res) => {
                  this.freshDropDownSelectFilterData(res, index , current);
                }
              });
            },
            inputValueChange: (value) => { // 外键的模糊搜索
              fkFuzzyquerybyak({
                searchObject: {
                  ak: value,
                  colid: current.colid,
                  fixedcolumns: {}
                },
                success: (res) => {
                  this.freshDropDownSelectFilterAutoData(res, index , current);
                }
              });
            },
            pageChange: (currentPage, $this) => { // 外键的分页查询
              fkQueryList({
                searchObject: {
                  isdroplistsearch: true,
                  refcolid: current.colid,
                  startindex: 10 * ($this.currentPage - 1),
                  range: $this.pageSize
                },
                success: (res) => {
                  this.freshDropDownSelectFilterData(res, index , current);
                }
              });
            }
          },
          validate: {
          }
        };
        // 属性赋值
        this.propsType(current, obj.item);

        return obj;
      },
      checkDisplay(item) {
        // 组件显示类型
        let str = '';
        if (!item.display || item.display === 'text' || item.display === 'textarea') {
          str = 'input';
        }
        if (item.display === 'OBJ_SELECT' || item.display === 'select') {
          str = 'select';
        }
        // check
        if (item.display === 'check') {
          str = 'checkbox';
        }
        if (item.display === 'text') {
          switch (item.fkdisplay) {
          case 'drp':
            str = 'DropDownSelectFilter';
            break;
          case 'mrp':
            str = 'DropDownSelectFilter';
            break;
          case 'pop':
            str = 'AttachFilter';
            break;
          case 'mop':
            str = 'AttachFilter';
            break;
          default: break;
          }
        }

        if (item.display === 'OBJ_DATENUMBER' || item.display === 'OBJ_DATE') {
          str = 'DatePicker';
        }

        if (item.display === 'OBJ_TIME') {
          str = 'TimePicker';
        }

        return str;
      },
      defaultValue(item) {
        // 设置表单的默认值
        if (item.valuedata === 'N') {
          return false;
        } if (item.valuedata === 'Y') {
          return true;
        }
        return item.valuedata;
      },
      propsType(current, item) {
        // 表单 props
        if (!item.display || item.display === 'text') {
          item.props.type = 'text';
          if (item.display === 'textarea') {
            item.props.type = 'textarea';
          }
          if (current.isnotnull === true) {
            item.required = true;
          }
          if (item.type === 'NUMBER') {
            item.props.type = 'number';
          }
        }
        // 外键的单选多选判断

        if (current.combobox) {
          const arr = current.combobox.reduce((sum, item) => {
            sum.push({
              label: item.limitdesc,
              value: item.limitval
            });
            return sum;
          }, []);
          item.options = arr;
          return item;
        }
        // 多状态合并的select
        if (current.conds && current.conds.length > 0) {
          let sumArray = [];
          current.conds.map((item) => {
            sumArray = sumArray.concat(item.combobox.reduce((sum, temp) => {
              sum.push({
                label: temp.limitdesc,
                value: `${item.colname}|${temp.limitval}`
              });
              return sum;
            }, []));
            return item;
          });
          obj.item.options = sumArray;
          return item;
        }

        // check
        if (current.display === 'check') {
          item.props.type = 'checkbox';
        }
        // textarea
        if (current.display === 'textarea') {
          item.props.type = 'textarea';
        }
        // 日期控件属性控制
        if (current.display === 'OBJ_DATENUMBER') {
          item.props.type = 'date';
        }
        if (current.display === 'OBJ_DATE') {
          item.props.type = 'date';
        }
        if (current.display === 'OBJ_TIME') {
          item.props.type = 'date';
        }


        if (current.display === 'text') {
          switch (current.fkdisplay) {
          case 'drp':
            item.props.single = true;
            item.props.data = {};
            //item.props.defaultSelected = this.defaultValue(current);
            break;
          case 'mrp':
            item.props.single = false;
            item.props.data = {};
            //item.props.defaultSelected = this.defaultValue(current);
            break;
          case 'pop':
            item.props.fkobj = current.fkobj;
            item.props.Selected = [];
            break;
          case 'mop':
            item.props.fkobj = current.fkobj;
            item.props.datalist = [];
            item.props.Selected = [];
            break;
          default: break;
          }
        }
        return item;
      },
      getTableQuery() { // 获取列表的查询字段
        this.getTableQueryForForm(this.searchData);
      },
      formDataChange(data) { // 表单数据修改
        this.formData = data;
      },
      freshDropDownPopFilterData(res, index ,current) { // 外键下拉时，更新下拉数据
        if (res.length > 0) {
          res.forEach((item) => {
            item.label = item.value;
            item.value = item.key;
            item.delete = true;
          });
          let item = []
          if( current.formIndex !== 'inpubobj'){
            item = this.$refs[`FormComponent_${current.formIndex}`][0].newFormItemLists;
          } else {
            item = this.$refs[`FormComponent_0`].newFormItemLists;
          }

          item[index].item.props.datalist = res;
        }
      },
      freshDropDownSelectFilterData(res, index ,current) { // 外键下拉时，更新下拉数据
            let item = []
            if( current.formIndex !== 'inpubobj'){
              item = this.$refs[`FormComponent_${current.formIndex}`][0].newFormItemLists;
            } else {
              item = this.$refs[`FormComponent_0`].newFormItemLists;
            }
           item[index].item.props.totalRowCount = res.data.data.totalRowCount;
           item[index].item.props.data = res.data.data;
      },
      freshDropDownSelectFilterAutoData(res, index ,current) { // 外键的模糊搜索数据更新
            let item = []
            if( current.formIndex !== 'inpubobj'){
              item = this.$refs[`FormComponent_${current.formIndex}`][0].newFormItemLists;
            } else {
              item = this.$refs[`FormComponent_0`].newFormItemLists;
            }
           item[index].item.props.hidecolumns = ['id', 'value'];
           item[index].item.props.AutoData = res.data.data;

      },
      lowercaseToUppercase(errorValue, index) { // 将字符串转化为大写
            let item = []
            if( current.formIndex !== 'inpubobj'){
              item = this.$refs[`FormComponent_${current.formIndex}`][0].newFormItemLists;
            } else {
              item = this.$refs[`FormComponent_0`].newFormItemLists;
            }
            item.item.value = errorValue.toUpperCase();
      }
    },
    mounted() {

    },
    created() {

    },
  };
</script>

<style scoped>

</style>

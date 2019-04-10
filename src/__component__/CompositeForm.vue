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
              :VerifyMessageForm = "VerifyMessageForm"
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
      :VerifyMessageForm = "VerifyMessageForm"
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
  import regExp  from '../constants/regExp';

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
      },
      masterName:{
        type: String,
        default() {
          return '';
        }
      },
      masterId:{
        type: String,
        default() {
          return '';
        }
      }
    },
    data() {
      return {
        newdefaultData:[],  // 初始化form
        formData:{},  // 监听form变化
        VerificationForm:{},  // 校验form
        defaultFormData:{},    // form 默认值
        childForm:{
          childs:[]
        },
        expand: 'expand'    // 面板是否展开
      };
    },
    computed: {
      computdefaultData: {
            get:function(){
              let items = [];
              // 存放单个form child
              this.childForm.childs = [];
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
                  array.push({
                    childs: tem,
                    hrdisplay: current.hrdisplay,
                    parentdesc: current.parentdesc,
                    parentname: current.parentname
                  });
                }else if(Object.prototype.hasOwnProperty.call(current, 'child')){
                  const option = this.reduceForm([], current.child,index);
                  if( option.item ) {
                    this.childForm.childs.push(option);
                  }
                }
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
            // 数据重组  默认展开
              if( this.childForm.childs[0] ){
                this.childForm.hrdisplay = 'expand';
                items.push(this.childForm);
              }

              return items;
          },
          set:function(val){
              return val;
          }

      },

    },
    methods: {
      CollapseClose(index) {
      },
      Comparison(obj, obj2){

      },
      formDataChange(data) {
        // 表单数据修改  判断vuex 里面是否有input name
        this.formData = Object.assign(this.formData,data);
        let key = Object.keys(data)[0];
        if(key.split(':').length >1){
          delete this.formData[key.split(':')[0]];
        } else {
          delete this.formData[key +':NAME'];
        }
        this.$emit('formChange',this.formData);

      },
      VerifyMessageForm(value){
        // 获取需要校验的表单
        this.VerificationForm = value;
        let arr =Object.keys(this.VerificationForm).reduce((item,current,index) => {
           item.push(`请输入${this.VerificationForm[current]}`)
            return item;
        },[]);
        this.$emit('VerifyMessage', arr);

      },
      mountdataForm(value){
            // 获取表单默认值
        this.defaultFormData = Object.assign(this.defaultFormData,value);
        this.$emit('InitializationForm', this.defaultFormData);
      },
      reduceForm: function (array, current, index) {
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
          props: {...current},
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
                      this.freshDropDownPopFilterData(res, index, current);
                    }
                  });
                }
              });
            },
            'popper-value': ($this, value, Selected) => { // 当外键下拉展开时去请求数据
              let item = []
              if( current.formIndex !== 'inpubobj'){
                item = this.$refs[`FormComponent_${current.formIndex}`][0].newFormItemLists;
              } else {
                item = this.$refs[`FormComponent_0`].newFormItemLists;
              }

              item[index].item.value = value;
              if (Selected !== 'change') {
                item[index].item.props.Selected = Selected;
              }
              // this.formItemsLists = this.formItemsLists.concat([]);
            },
            'popper-show': ($this, item, index) => { // 当气泡拉展开时去请求数据
              fkGetMultiQuery({
                searchObject: {
                  tableid: item.props.fkobj.reftableid
                },
                success: (res) => {
                  this.freshDropDownPopFilterData(res, index, current);
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
                  this.freshDropDownSelectFilterData(res, index, current);
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
                  this.freshDropDownSelectFilterAutoData(res, index, current);
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
                  this.freshDropDownSelectFilterData(res, index, current);
                }
              });
            }
          },
          validate: {}
        };
        // 属性赋值
        // 属性isuppercase控制
        if (current.isuppercase) {
          obj.item.props.regx = regExp.Capital;
          obj.item.event.regxCheck = (value, $this, errorValue) => {
            this.lowercaseToUppercase(errorValue, itemIndex);
          };
        }



        this.propsType(current, obj.item);
        return obj;
      },
      searchClickData() {
        // 按钮查找
        this.$emit('on-formEnter');
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
        // 上传图片
        if( item.display === "image" ){
          str = 'ImageUpload';
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
            str = 'DropDownSelectFilter';
            break;
          case 'mop':
            str = 'AttachFilter';
            break;
          default: break;
          }
        }

        if (item.display === 'OBJ_DATE' || item.display === 'OBJ_DATENUMBER') {
          str = 'DatePicker';
        }

        if (item.display === 'OBJ_TIME' ) {
          str = 'TimePicker';
        }

        return str;
      },
      defaultValue(item) {
        // 设置表单的默认值
        if (item.valuedata === 'N') {
          return false;
        } else if (item.valuedata === 'Y') {
          return true;
        }
        if (item.display === 'OBJ_SELECT' && item.default) { // 处理select的默认值
          const arr = [];
          arr.push(item.valuedata);
          return arr;
        }

        if (item.fkdisplay === 'drp' || item.fkdisplay === 'pop') { // 外键默认值
          const arr = [];
          arr.push({
            ID: item.refobjid,
            Label: item.valuedata
          });
          return arr;
        } else {
          return item.valuedata;
        }
        //
      },
      propsType(current, item) {
        // 表单 props
        item.props.disabled = item.props.readonly;
        item.props.maxlength = item.props.length;
        if(current.type === 'NUMBER'){
          item.props.regx = regExp.Digital;
        }

        if (!item.display || item.display === 'text') {
          item.props.type = 'text';
          item.props.empty = '';
          if (item.display === 'textarea') {
            item.props.type = 'textarea';
          }
          if (item.type === 'NUMBER') {
            item.props.type = 'number';
            item.props.empty = 0;
          }
          if (current.isnotnull === true) {
            item.required = true;
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
        if (current.display === 'OBJ_DATENUMBER') {
          item.props.type = 'datetime';
        }
        if (current.display === 'OBJ_TIME') {
          item.props.type = 'timerange';

        }
        if (current.display === 'OBJ_DATE') {
          item.props.type = 'datetime';

          if( current.type === 'STRING' ){

           }

        }
        if (current.display === 'OBJ_TIME') {
          item.props.type = 'timerange';
        }


        if (current.display === 'text') {
          switch (current.fkdisplay) {
          case 'drp':
            item.props.single = true;
            item.props.data = {};
            item.props.defaultSelected = this.defaultValue(current);
            break;
          case 'mrp':
            item.props.single = false;
            item.props.data = {};
            item.props.defaultSelected = this.defaultValue(current);
            break;
          case 'pop':
            item.props.single = false;
            item.props.data = {};
            item.props.defaultSelected = this.defaultValue(current);
            break;
          case 'mop':
            item.props.type = 'AttachFilter';
            item.props.fkobj = {
              refobjid: current.refobjid,
              reftable: current.reftable,
              reftableid:current.reftableid
            };
            item.props.datalist = [];
            item.props.Selected = [{
              label:current.refobjid,
              value:current.valuedata
            }];
            break;
          default: break;
          }
        }
        if( current.display === "image" ){
          // 待确定
          item.props.type = 'ImageUpload';
          //let valuedata = JSON.parse(current.valuedata);
          console.log(this);
          let valuedata = [{"NAME":"1.jpg","URL":"http://profcweb.oss-cn-hangzhou.aliyuncs.com/PS_C_PRO/15083511/4aedfab6-1cf9-4e15-b70e-47e19c49b7a8.jpg"},{"NAME":"2.jpg","URL":"http://profcweb.oss-cn-hangzhou.aliyuncs.com/PS_C_PRO/15083511/1e71f4d0-7b7f-4656-9b3a-2fc18f529987.jpg"},{"NAME":"3.jpg","URL":"http://profcweb.oss-cn-hangzhou.aliyuncs.com/PS_C_PRO/15083511/034f373c-0d3c-4dd4-9729-3ea2804cc29e.jpg"},{"NAME":"4.jpg","URL":"http://profcweb.oss-cn-hangzhou.aliyuncs.com/PS_C_PRO/15083511/9882ceb1-49f9-4da7-8742-fbdf8bc60f80.jpg"},{"NAME":"5.jpg","URL":"http://profcweb.oss-cn-hangzhou.aliyuncs.com/PS_C_PRO/15083511/1202ae27-e450-4c68-8430-133d5d58352d.jpg"}];
          item.props.itemdata = {
            colname: current.colname,
            width: 200,
            height: 200,
            readonly: current.readonly,
            masterName:this.masterName,
            objId:this.masterId,
            sendData:{
              path:`${this.masterName}/${this.masterId}/`
            },
            url:'/ad-app/p/cs/upload2',
            valuedata:valuedata
          };

        }
        return item;
      },
      getTableQuery() { // 获取列表的查询字段
        this.getTableQueryForForm(this.searchData);
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

<style>
  .burgeon-collapse > .burgeon-collapse-item > .burgeon-collapse-header{
    text-align: center;
    padding: 0;
    margin: 0;
    line-height: 24px;
    font-size: 12px;
    height: 28px;
    font-weight: normal;
    color: #1f2d3d;
    background: #f8f7f7;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  .burgeon-collapse{
    margin-bottom: 10px;
  }
</style>

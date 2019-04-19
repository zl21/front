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
            <template v-if="FormItemComponent!==''">
              <component
                :is="FormItemComponent"   
                :ref="'FormComponent_'+index"
                :key="index"
                :form-item-lists="item.childs"
                :verifymessageform="VerifyMessageForm"
                :mountdata-form="mountdataForm"
                :type="type"
                :default-column="defaultData.objviewcol"
                @formDataChange="formDataChange"
              />
            </template>
          </div>
        </Panel>
      </Collapse>
    </template>
    <template v-if="type === ''">
      <template v-if="FormItemComponent!==''">
        <component
          :is="FormItemComponent"   
          ref="FormComponent_0"
          :verifymessageform="VerifyMessageForm"
          :mountdata-form="mountdataForm"
          :form-item-lists="computdefaultData"
          @formDataChange="formDataChange"
        />
      </template>
    </template>
  </div>
</template>

<script>
  import Vue from 'vue';
  import FormItemComponent from './ComFormItemComponent';
  import ItemComponent from './ItemComponent';
  import {
    fkQueryList,
    fkFuzzyquerybyak,
    fkGetMultiQuery,
    fkDelMultiQuery
  } from '../constants/fkHttpRequest';
  import regExp from '../constants/regExp';

  export default {
    name: 'CompositeForm',
    components: {},
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
      moduleFormType: {
        type: String,
        default() {
          return '';
        }
      },
      updateForm: {
        type: Function,
        default() {
          return '';
        }
      },
      masterName: {
        // 表单名称
        type: String,
        default() {
          return '';
        }
      },
      masterId: {
        // 表单id
        type: String,
        default() {
          return '';
        }
      }
    },
    data() {
      return {
        newdefaultData: [], // 初始化form
        formData: {}, // 监听form变化
        VerificationForm: [], // 校验form
        defaultFormData: {}, // form 默认值
        mountChecked: false,
        verifyMessItem: {}, // 空form        watchComputFormList:[],
        FormItemComponent: Vue.extend(FormItemComponent),
        childForm: {
          childs: []
        },
        tip: 'new',
        expand: 'expand' // 面板是否展开
      };
    },
    computed: {
      computdefaultData: {
        get() {
          // console.log('computdefaultData');
          let items = [];
          // 存放单个form child
          const childForm = {
            childs: []
          };
          // 有面板的数据
          if (
            this.type
            && Object.prototype.hasOwnProperty.call(this.defaultData, 'addcolums')
          ) {
            items = this.defaultData.addcolums.reduce((array, current, index) => {
              let tem = [];
              if (Object.prototype.hasOwnProperty.call(current, 'childs')) {
                tem = current.childs.reduce((array2, current2, itemIndex2) => {
                  current2.formIndex = index;
                  const option = this.reduceForm(array2, current2, itemIndex2);
                  array2.push(option);
                  return array2;
                }, []);
                array.push({
                  childs: tem.concat([]),
                  hrdisplay: current.hrdisplay,
                  parentdesc: current.parentdesc,
                  parentname: current.parentname
                });
              } else if (Object.prototype.hasOwnProperty.call(current, 'child')) {
                const option = this.reduceForm([], current.child, index);
                if (option.item) {
                  childForm.childs.push(option);
                }
              }
              return array;
            }, []);
          } else if (
            Object.prototype.hasOwnProperty.call(this.defaultData, 'inpubobj')
          ) {
            // 表单的数据
            items = this.defaultData.inpubobj.reduce(
              (array, current, itemIndex) => {
                current.formIndex = 'inpubobj';
                const option = this.reduceForm(array, current, itemIndex);
                array.push(option);
                return array;
              },
              []
            );
          }
          // 数据重组  默认展开
          if (this.childForm.childs[0]) {
            childForm.hrdisplay = 'expand';
            items.push(childForm);
          }
          return items;
        },
        set(val) {
          return val;
        }
      }
    },
    watch: {
      computdefaultData: {
        handler(val, old) {
          // console.log(JSON.stringify(val) ===JSON.stringify(old))
          if (JSON.stringify(val) === JSON.stringify(old)) {
            this.FormItemComponent = '';
            setTimeout(() => {
              this.FormItemComponent = Vue.extend(FormItemComponent);
            }, 0);
          }
        },
        deep: true
      }
    },
    updated() {},
    methods: {
      CollapseClose() {},
      Comparison() {},
      formDataChange(data) {
        // 表单数据修改  判断vuex 里面是否有input name
        if (!this.mountChecked) { 
          return false;
        }
        if (Array.isArray(data)) {
          data = data[0];
        }
        this.formData = Object.assign(this.formData, data);
        const key = Object.keys(data)[0];
        if (key.split(':').length > 1) {
          delete this.formData[key.split(':')[0]];
        } else {
          delete this.formData[`${key}:NAME`];
        }

        this.VerificationForm.forEach((item) => {
          Object.keys(this.formData).forEach((option) => {
            if (item.key === option.split(':')[0]) {
              item.value = this.formData[option];
            }
          });
        });

        const message = this.setVerifiy();
        if (message.messageTip.length > 0) {
          this.$emit('VerifyMessage', message);
        }
        this.$emit('formChange', this.formData);
      },
      VerifyMessageForm(value) {
        // 获取需要校验的表单
        // 初始化form 校验
        this.VerificationForm = this.VerificationForm.concat(value);

        const data = this.setVerifiy();
        if (data.messageTip.length > 0) {
          this.$emit('VerifyMessage', data);
        }

      // console.log(value,this.VerificationForm,'VerificationForm');
      // console.log(this.VerificationForm);
      },
      mountdataForm(value) {
        // 获取表单默认值
        setTimeout(() => {
          this.mountChecked = true;
        }, 300);
        this.defaultFormData = Object.assign(this.defaultFormData, value);
        this.$emit('InitializationForm', this.defaultFormData);
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
            keydown: (event) => {
              // 输入框的keydown event, $this
              if (event.keyCode === 13) {
                // enter回车查询
                if (this.type === 'PanelForm') {
                  // 是否是面板
                  //  组建是否获取光标
                  this.focusItem(index, current);
                }
                this.searchClickData();
              }
            },
            keyup: () => {
              if (current.isuppercase) {
                this.lowercaseToUppercase(index, current);
              }
            },
            'on-delete': ($this, item, key) => {
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
            'popper-value': ($this, value, Selected) => {
              // 当外键下拉展开时去请求数据
              let item = [];
              if (current.formIndex !== 'inpubobj') {
                item = this.$refs[`FormComponent_${current.formIndex}`][0]
                  .newFormItemLists;
              } else {
                item = this.$refs.FormComponent_0.newFormItemLists;
              }

              item[index].item.value = value;
              if (Selected !== 'change') {
                item[index].item.props.Selected = Selected;
              }
            // this.formItemsLists = this.formItemsLists.concat([]);
            },
            'popper-show': ($this, item) => {
              // 当气泡拉展开时去请求数据
              fkGetMultiQuery({
                searchObject: {
                  tableid: item.props.fkobj.reftableid
                },
                success: (res) => {
                  this.freshDropDownPopFilterData(res, index, current);
                }
              });
            },
            'on-show': ($this) => {
              // 当外键下拉站开始去请求数据
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
            inputValueChange: (value) => {
              // 外键的模糊搜索
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
            pageChange: (currentPage, $this) => {
              // 外键的分页查询
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
          obj.item.props.regx = regExp.Letter;
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
        if (
          !item.display
          || item.display === 'text'
          || item.display === 'textarea'
        ) {
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
        if (item.display === 'image') {
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
          default:
            break;
          }
        }

        if (item.display === 'OBJ_DATE' || item.display === 'OBJ_DATENUMBER') {
          str = 'DatePicker';
        }

        if (item.display === 'OBJ_TIME') {
          str = 'TimePicker';
        }

        return str;
      },
      defaultValue(item) {
        // if(!item.valuedata){
        //   item.valuedata = '';
        //   return '';
        // }
        // 设置表单的默认值
        if (item.display === 'OBJ_DATENUMBER') {
          // 日期控件
          if (item.defval || item.valuedata) {
            return `${item.defval || item.valuedata} 00:00:00` || '';
          }
          return '';
        }
        if (item.display === 'OBJ_TIME') {
          return item.defval || item.valuedata || '';
        }
        // 设置表单的默认值
        if (item.display === 'check') {
          if (item.valuedata === 'N' || item.defval === 'N') {
            return false;
          }
          if (item.valuedata === 'Y' || item.defval === 'Y') {
            return true;
          }
        }
       
        if (item.display === 'OBJ_SELECT' && item.defval) {
          // 处理select的默认值
          const arr = [];
          arr.push(item.valuedata);
          return arr;
        }

        if (item.fkdisplay === 'drp' || item.fkdisplay === 'pop' || item.fkdisplay === 'mrp') {
          // 外键默认值
          const arr = [];
          arr.push({
            ID: item.refobjid || '',
            Label: item.valuedata || ''
          });
          return arr;
        }
        return item.defval || item.valuedata || '';
      // wewe
      },
      propsType(current, item) {
        // 表单 props
        const obj = item;
        item.props.disabled = item.props.readonly;
        item.props.maxlength = item.props.length;
        if (current.type === 'NUMBER') {
          //  数字校验  '^\\d{0,8}(\\.[0-9]{0,2})?$'
          
          const string = `^\\\d{0,${current.length}}(\\\.[0-9]{0,${current.scale}})?$`;
          const typeRegExp = new RegExp(string);
          if (current.scale > 0) {
            item.props.regx = typeRegExp;
          } else {
            item.props.regx = regExp.Digital;
          }
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
          const arr = current.combobox.reduce((sum, items) => {
            sum.push({
              label: items.limitdesc,
              value: items.limitval
            });
            return sum;
          }, []);
          item.options = arr;
          return item;
        }
        // 多状态合并的select
        if (current.conds && current.conds.length > 0) {
          let sumArray = [];
          current.conds.map((option) => {
            sumArray = sumArray.concat(
              option.combobox.reduce((sum, temp) => {
                sum.push({
                  label: temp.limitdesc,
                  value: `${option.colname}|${temp.limitval}`
                });
                return sum;
              }, [])
            );
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
          item.props.type = 'time';
        }
        if (current.display === 'OBJ_DATE') {
          item.props.type = 'datetime';
        }
        if (current.display === 'OBJ_TIME') {
          item.props.type = 'time';
        }

        if (current.display === 'text') {
          switch (current.fkdisplay) {
          case 'drp':
            item.props.single = true;
            item.props.data = {};
            item.props.empty = 0;
            item.props.defaultSelected = this.defaultValue(current);
            break;
          case 'mrp':
            item.props.single = false;
            item.props.data = {};
            item.props.empty = 0;
            item.props.defaultSelected = this.defaultValue(current);
            break;
          case 'pop':
            item.props.single = false;
            item.props.data = {};
            item.props.empty = 0;
            item.props.defaultSelected = this.defaultValue(current);
            break;
          case 'mop':
            item.props.type = 'AttachFilter';
            item.props.empty = 0;
            item.props.fkobj = {
              refobjid: current.refobjid,
              reftable: current.reftable,
              reftableid: current.reftableid,
              url: '/p/cs/menuimport'
            };
            item.props.datalist = [];
            item.props.Selected = [
              {
                label: current.refobjid,
                value: current.valuedata
              }
            ];
            break;
          default:
            break;
          }
        }
        if (current.display === 'image') {
          // 待确定
          item.props.type = 'ImageUpload';
          const valuedata = current.valuedata
            ? JSON.parse(current.valuedata)
            : '';
          item.props.itemdata = {
            colname: current.colname,
            width: 200,
            height: 200,
            readonly: current.readonly,
            masterName: this.masterName,
            objId: this.masterId,
            sendData: {
              path: `${this.masterName}/${this.masterId}/`
            },
            url: '/ad-app/p/cs/upload2',
            valuedata
          };
        }
        return item;
      },
      getTableQuery() {
        // 获取列表的查询字段
        this.getTableQueryForForm(this.searchData);
      },
      freshDropDownPopFilterData(res, index, current) {
        // 外键下拉时，更新下拉数据
        if (res.length > 0) {
          res.forEach((item) => {
            item.label = item.value;
            item.value = item.key;
            item.delete = true;
          });
          let item = [];
          if (current.formIndex !== 'inpubobj') {
            item = this.$refs[`FormComponent_${current.formIndex}`][0]
              .newFormItemLists;
          } else {
            item = this.$refs.FormComponent_0.newFormItemLists;
          }

          item[index].item.props.datalist = res;
        }
      },
      freshDropDownSelectFilterData(res, index, current) {
        // 外键下拉时，更新下拉数据
        let item = [];
        if (current.formIndex !== 'inpubobj') {
          item = this.$refs[`FormComponent_${current.formIndex}`][0]
            .newFormItemLists;
        } else {
          item = this.$refs.FormComponent_0.newFormItemLists;
        }
        item[index].item.props.totalRowCount = res.data.data.totalRowCount;
        item[index].item.props.data = res.data.data;
      },
      freshDropDownSelectFilterAutoData(res, index, current) {
        // 外键的模糊搜索数据更新
        let item = [];
        if (current.formIndex !== 'inpubobj') {
          item = this.$refs[`FormComponent_${current.formIndex}`][0]
            .newFormItemLists;
        } else {
          item = this.$refs.FormComponent_0.newFormItemLists;
        }
        item[index].item.props.hidecolumns = ['id', 'value'];
        item[index].item.props.AutoData = res.data.data;
      },
      lowercaseToUppercase(index, current) {
        // 将字符串转化为大写
        let item = [];
        if (current.formIndex !== 'inpubobj') {
          item = this.$refs[`FormComponent_${current.formIndex}`][0]
            .newFormItemLists;
        } else {
          item = this.$refs.FormComponent_0.newFormItemLists;
        }
        item[index].item.value = item[index].item.value.toUpperCase();
      },
      setVerifiy() {
        // 校验提示
        const VerificationMessage = {
          eq: '',
          index: '',
          messageTip: [],
          validateForm: ''
        };
        this.VerificationForm.forEach((item) => {
          if (item.value === undefined || item.value.length < 1) {
            const label = `请输入${item.label}`;
            VerificationMessage.messageTip.push(label);
            if (VerificationMessage.messageTip.length < 2) {
              VerificationMessage.validateForm = item.onfousInput;
              VerificationMessage.index = item.index;
              VerificationMessage.eq = item.eq;
            } else if (
              VerificationMessage.eq === ''
              || VerificationMessage.eq > item.eq
            ) {
              VerificationMessage.eq = item.eq;
              if (
                VerificationMessage.index === ''
                || VerificationMessage.index > item.index
              ) {
                VerificationMessage.index = item.index;
                VerificationMessage.validateForm = item.onfousInput;
              }
            }
          }
        });

        return VerificationMessage;
      },
      focusItem(index, current) {
        // 下一个组件获取光标
        const item = this.$refs[`FormComponent_${current.formIndex}`][0]
          .$children;
      
        if (item[index + 1]) {
          // if (type === 'input') {}
          if (item[index + 1].$el.querySelector('input') && item[index + 1].items.type !== 'checkbox') {
            item[index + 1].$el.querySelector('input').focus();
          }
        }  
      }
    },
    mounted() {
    },
    created() {
      this.computdefaulForm = this.computdefaultData;
    }
  };
</script>

<style>
.burgeon-collapse > .burgeon-collapse-item > .burgeon-collapse-header {
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
.burgeon-collapse {
  margin-bottom: 10px;
}
</style>

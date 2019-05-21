/* eslint-disable import/no-dynamic-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable array-callback-return */
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
          :is-title-show="item.isTitleShow"
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
                :mapp-status="setMapping"
                :verifymessageform="VerifyMessageForm"
                :mountdata-form="mountdataForm"
                :type="type"
                :default-column="defaultColumnCol"
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
          :mapp-status="setMapping"
          :default-column="defaultColumnCol"
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
  import { Version } from '../constants/global';

  import regExp from '../constants/regExp';

  const {
    fkQueryList, fkFuzzyquerybyak, fkGetMultiQuery, fkDelMultiQuery 
  // eslint-disable-next-line import/no-dynamic-require
  } = require(`../__config__/actions/version_${Version}/formHttpRequest/fkHttpRequest.js`);

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
      defaultSetValue: {
        type: Object,
        default() {
          return {};
        }
      },
      paths: {
        type: Array,
        default() {
          return [];
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
        formDataDef: {}, // 监听form 变化有value 和 文字
        VerificationForm: [], // 校验form
        defaultFormData: {}, // form 默认值
        Mapping: {}, // 设置映射关系
        mapData: {}, // 全部联动关系
        mountChecked: false,
        verifyMessItem: {}, // 空form        watchComputFormList:[],
        FormItemComponent,
        childFormData: [],
        defaultColumnCol: this.defaultData.objviewcol,
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
          // const childForm = {
          //   childs: []
          // };
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
                current.child.formIndex = index;
                const option = this.reduceForm([], current.child, index);
                if (option.item) {
                  this.childForm(option);
                }
                array.push({
                  childs: [option],
                  hrdisplay: 'expand',
                  isTitleShow: false
                });
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

          return items;
        },
        set(val) {
          return val;
        }
      }
    },
    watch: {
      computdefaultData: {
        handler() {
          // console.log(JSON.stringify(val) ===JSON.stringify(old))
          // if (JSON.stringify(val) === JSON.stringify(old)) {
          //   this.FormItemComponent = '';
          //   setTimeout(() => {
          //     this.FormItemComponent = FormItemComponent;
          //   }, 0);
          // }
        },
        deep: true
      }
    },
    updated() {},
    methods: {
      CollapseClose() {},
      Comparison() {},
      childForm(option) {
        return this.childFormData.push(option);
      },
      setMapping(Mapping, mapData) {
        this.mapData = Object.assign(this.mapData, mapData);
        this.Mapping = Object.assign(this.Mapping, Mapping);
      },
      // eslint-disable-next-line consistent-return
      formDataChange(data, setdefval) {
        // 表单数据修改  判断vuex 里面是否有input name
        if (!this.mountChecked) {
          return false;
        }
        if (Array.isArray(data)) {
          data = data[0];
        }
        this.formData = Object.assign(this.formData, data);
        this.formDataDef = Object.assign(this.formDataDef, setdefval);

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
          this.verifyMessItem = message;
          this.$emit('VerifyMessage', message);
        } else {
          this.verifyMessItem = {};
          this.$emit('VerifyMessage', {});
        }
        this.$emit('formChange', this.formData, this.formDataDef);
      },
      VerifyMessageForm(value) {
        // 获取需要校验的表单
        // 初始化form 校验
        this.VerificationForm = this.VerificationForm.concat(value);


        const data = this.setVerifiy();
        if (data.messageTip.length > 0) {
          this.verifyMessItem = data;
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
                  this.focusItem(index, current, array);
                }
                this.searchClickData();
              }
            },
            change: () => {
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
                serviceId: current.serviceId,
                success: () => {
                  fkGetMultiQuery({
                    searchObject: {
                      tableid: item.props.fkobj.reftableid
                    },
                    serviceId: current.serviceId,
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
                serviceId: current.serviceId,
                success: (res) => {
                  this.freshDropDownPopFilterData(res, index, current);
                }
              });
            },
            'on-show': ($this) => {
              // 当外键下拉站开始去请求数据
              let searchObject = {};
              if (Object.hasOwnProperty.call(current, 'refcolval')) {
                const query = current.refcolval.expre === 'equal' ? `=${this.formData[current.refcolval.srccol]}` : '';
                searchObject = {
                  isdroplistsearch: true,
                  refcolid: current.colid,
                  fixedcolumns: {
                    [current.refcolval.fixcolumn]: query,
                  },
                  startindex: 0,
                  range: $this.pageSize
                };
              } else {
                searchObject = {
                  isdroplistsearch: true,
                  refcolid: current.colid,
                  startindex: 0,
                  range: $this.pageSize
                };
              }
              fkQueryList({
                searchObject,
                serviceId: current.serviceId,
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
                serviceId: current.serviceId,
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
                serviceId: current.serviceId,
                success: (res) => {
                  this.freshDropDownSelectFilterData(res, index, current);
                }
              });
            }
          },
          validate: this.validateList(current)
        };
        // 属性赋值
        // 属性isuppercase控制
        if (current.isuppercase) {
          // obj.item.props.regx = regExp.Letter;
        }

        this.propsType(current, obj.item);
        return obj;
      },
      validateList(current) {
        // 联动校验
        if (Object.hasOwnProperty.call(current, 'dynamicforcompute')) {
          return {
            dynamicforcompute: current.dynamicforcompute
          };
        }
        if (Object.hasOwnProperty.call(current, 'hidecolumn')) {
          return {
            hidecolumn: current.hidecolumn
          };
        }
        if (Object.hasOwnProperty.call(current, 'refcolval')) {
          return {
            refcolval: current.refcolval
          };
        }
        return {};
      },
      searchClickData() {
        // 按钮查找
        this.$emit('on-formEnter');
      },
      checkDisplay(item) {
        // 组件显示类型
        let str = '';
        if (item.readonly === true && item.fkdisplay) {
          //  不可编辑 变成 input
          str = 'input';

          return str;
        }
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
        if (item.display === 'text' || item.display === 'xml') {
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
        if (item.readonly === true && item.fkdisplay) {
          //  不可编辑 变成 input
          return item.defval || item.valuedata || '';
        }
        // 设置表单的默认值
        if (item.display === 'textarea' && !item.fkdisplay || item.display === 'text' && !item.fkdisplay) {
          if (this.defaultSetValue[item.colname]) {
            return this.defaultSetValue[item.colname];
          }
        }
        if (item.display === 'OBJ_DATENUMBER') {
          // 日期控件
          // 保存change 之前的默认值
          if (this.defaultSetValue[item.colname]) {
            return this.defaultSetValue[item.colname];
          }
          if (item.defval || item.valuedata) {
            return `${item.defval || item.valuedata} ` || '';
          }
          return '';
        }
        if (item.display === 'OBJ_TIME') {
          // 保存change 之前的默认值
          if (this.defaultSetValue[item.colname]) {
            return this.defaultSetValue[item.colname];
          }
          return item.defval || item.valuedata || '';
        }
        // 设置表单的默认值

        if (item.display === 'check') {
          // 保存change 之前的默认值
          if (this.defaultSetValue[item.colname]) {
            return this.defaultSetValue[item.colname];
          }
          return item.valuedata || item.defval;
        }
        // console.log(item, this.defaultSetValue);

        if (item.display === 'OBJ_SELECT' || item.display === 'select') {
          // 处理select的默认值

          const arr = [];
          if (this.defaultSetValue[item.colname]) {
            arr.push(this.defaultSetValue[item.colname]);
          } else {
            arr.push(item.valuedata || item.defval);
          }
          
          return arr;
        }

        if (item.fkdisplay === 'drp'  || item.fkdisplay === 'mrp') {
          // 外键默认值
          const arr = [];
          if (this.defaultSetValue[item.colname]) {
            arr.push({
              ID: this.defaultSetValue[item.colname][0].ID || '',
              Label: this.defaultSetValue[item.colname][0].Label || ''
            });
          } else {
            arr.push({
              ID: item.refobjid || '',
              Label: item.valuedata || item.defval || ''
            });
          }
          
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
        item.props.comment = item.props.comment;
        item.props.path = this.paths.length > 0;
        if (item.type === 'checkbox') {
          const checkName = ['Y', '1', true];
          const falseName = ['N', '0', false];
          const check = falseName.some((x, i) => x === current.valuedata || x === current.defval);
          if (check) {
            // eslint-disable-next-line no-tabs
            item.props.falseValue	= current.valuedata || current.defval;
            const index = falseName.findIndex(x => x === item.props.falseValue);
            item.props.trueValue = checkName[index];
          } else {
            // eslint-disable-next-line no-tabs
            item.props.trueValue	= current.valuedata || current.defval;
            const index = checkName.findIndex(x => x === item.props.trueValue);
            item.props.falseValue = falseName[index];
          }
        }

        if (current.type === 'OBJ_SELECT' || current.display === 'select') {
          // 下拉是单选
          item.props.multiple = false;
        }
        if (current.type === 'NUMBER') {
          //  数字校验  '^\\d{0,8}(\\.[0-9]{0,2})?$'

          item.props.number = true;
          // console.log(current.display);
          if (current.display === 'text' && !current.fkdisplay) {
            const string = `^\\\d{0,${current.length}}(\\\.[0-9]{0,${current.scale}})?$`;
            const typeRegExp = new RegExp(string);
            if (current.scale > 0) {
              item.props.regx = typeRegExp;
            } else {
              item.props.regx = regExp.Digital;
            }
          }
        }


        if (!item.display || item.display === 'text') {
          item.props.type = 'text';
          item.props.empty = '';
          if (item.display === 'textarea') {
            item.props.type = 'textarea';
          }
          if (item.props.number) {
            // item.props.type = 'number';
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
          arr.unshift({
            label: '请选择',
            value: ''
          });
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
            item.unshift({
              label: '请选择',
              value: ''
            });
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
        if (current.datelimit === 'before') {
          item.props.options = {
            disabledDate(date) {
              // 之前 含今天
              return date && date.valueOf() < new Date().valueOf();
            }
          };
        } else if (current.datelimit === 'after') {
          // 之后 含今天
          item.props.options = {
            disabledDate(date) {
              return date && date.valueOf() > new Date().valueOf();
            }
          };
        } else if (current.datelimit === 'beforetoday') {
          // 之前 不含今天
          item.props.options = {
            disabledDate(date) {
              return date && date.valueOf() < new Date().valueOf() - 1 * 24 * 60 * 60 * 1000;
            }
          };
        } else if (current.datelimit === 'aftertoday') {
          // 之后 不含今天
          item.props.options = {

            disabledDate(date) {
              return date && date.valueOf() > new Date().valueOf() - 1 * 24 * 60 * 60 * 1000;
            }
          };
        }
        if (current.display === 'OBJ_DATENUMBER') {
          item.props.type = 'date';
        }
        if (current.display === 'OBJ_TIME') {
          item.props.type = 'time';
        }
        if (current.display === 'OBJ_DATE') {
          item.props.type = 'datetime';
        }

        if (current.display === 'text' || current.display === 'xml') {
          switch (current.fkdisplay) {
          case 'drp':
            item.props.single = true;
            item.props.data = {};
            item.props.empty = 0;
            item.props.AutoData = [];
            item.props.defaultSelected = this.defaultValue(current);
            break;
          case 'mrp':
            item.props.single = false;
            item.props.data = {};
            item.props.empty = 0;
            item.props.AutoData = [];
            item.props.defaultSelected = this.defaultValue(current);
            break;
          case 'pop':
            item.props.type = 'AttachFilter';
            item.props.empty = 0;
            item.props.optionTip = false;
            item.props.AutoData = [];
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
          case 'mop':
            item.props.type = 'AttachFilter';
            item.props.empty = 0;
            item.props.AutoData = [];
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
            : [];
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
          if (item.value === undefined || item.value === 0 || item.value === '') {
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
      focusItem(index, current, arry) {
        // 下一个组件获取光标
        const item = this.$refs[`FormComponent_${current.formIndex}`][0]
          .$children;
        let _index = index;
        // const input_arry = item.reduce((option, name, index) => {
        //   if (name.$el.querySelector('input') && name.items.type !== 'checkbox') {
        //     option.push(name.$el.querySelector('input'));
        //   }
        //   return option;
        // }, []);
        if (arry[_index + 1] && arry[_index + 1].item.props.readonly) {
          _index = index + 1;
        }
        // eslint-disable-next-line array-callback-return
        // eslint-disable-next-line consistent-return
        item.some((option, i) => {
          if (i > _index) {
            if (option.$el.querySelector('input') && option.items.type !== 'checkbox') {
              option.$el.querySelector('input').focus();
              return i > index;
            }
          }
        //
        });


        // if (item[index + 1] || item[index + 2]) {
        //   // if (type === 'input') {}
        //   if (item[index + 1].$el.querySelector('input') && item[index + 1].items.type !== 'checkbox') {
        //     item[index + 1].$el.querySelector('input').focus();
        //   }
        // }
      },
      setdefaultColumnCol() {
        const width = this.$el.offsetWidth;
        if (width < 580 && width !== 0) {
          this.defaultColumnCol = 1;
        } else {
          this.defaultColumnCol = this.defaultData.objviewcol;
        }
      }
    },
    mounted() {
      this.VerificationForm = [];
      
      if (this.$el) {
        this.setdefaultColumnCol();
      }
      window.addEventListener('resize', (e) => {
        if (this.$el) {
          this.setdefaultColumnCol();
        }
      });
      if (!this.$el) {
        window.removeaddEventListener('resize');
      }
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

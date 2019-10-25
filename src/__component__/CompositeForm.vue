/* eslint-disable no-undef */
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
                :path="path"
                :form-index="index"
                :form-item-lists="item.childs"
                :isreftabs="isreftabsForm"
                :child-table-name="childTableName"
                :refcolval-data="refcolvaData"
                :mapp-status="setMapping"
                :is-main-table="isMainTableForm"
                :condition="conditiontype"
                :module-form-type="moduleFormType"
                :get-state-data="getStateData"
                :verifymessageform="VerifyMessageForm"
                :mountdata-form="mountdataForm"
                :mounted-type="mountNumber"
                :type="type"
                :default-column="defaultColumnCol"
                @formDataChange="formDataChange"
              />
            </template>
          </div>
        </Panel>
      </Collapse>
    </template>
    <template v-if="type !== 'PanelForm'">
      <template v-if="FormItemComponent!==''">
        <component
          :is="FormItemComponent"
          ref="FormComponent_0"
          :path="path"
          :isreftabs="isreftabsForm"
          :form-index="0"
          :refcolval-data="refcolvaData"
          :child-table-name="childTableNameForm"
          :verifymessageform="VerifyMessageForm"
          :mapp-status="setMapping"
          :module-form-type="moduleFormType"
          :default-column="defaultColumnCol"
          :condition="conditiontype"
          :mounted-type="mountNumber"
          :is-main-table="isMainTableForm"
          :get-state-data="getStateData"
          :mountdata-form="mountdataForm"
          :form-item-lists="computdefaultData"
          @formDataChange="formDataChange"
        />
      </template>
    </template>
  </div>
</template>

<script>
  // import { setTimeout } from 'timers';
  import FormItemComponent from './ComFormItemComponent';
  import { Version, MODULE_COMPONENT_NAME } from '../constants/global';

  import regExp from '../constants/regExp';
  import { getGateway } from '../__utils__/network';
  import ItemComponent from './ItemComponent';

  const {
    fkQueryList,
    fkFuzzyquerybyak,
    fkGetMultiQuery,
    fkDelMultiQuery
  // eslint-disable-next-line import/no-dynamic-require
  } = require(`../__config__/actions/version_${Version()}/formHttpRequest/fkHttpRequest.js`);
  export default {
    name: 'CompositeForm',
    components: {},
    props: {
      isMainTable: {
        // 是否 主表
        type: Boolean,
        default() {
          return false;
        }
      },
      defaultData: {
        // 默认后台配置
        type: Object,
        default() {
          return {};
        }
      },
      objreadonly: {
        // 是否可读
        type: Boolean,
        default() {
          return false;
        }
      },
      defaultSetValue: {
        // change 复制后的传值
        type: Object,
        default() {
          return {};
        }
      },
      isreftabs: {
        // 是否存在子表
        type: Boolean,
        default() {
          return false;
        }
      }, 
      childTableName: {
        // 子表表明
        type: String,
        default() {
          return '';
        }
      },
      paths: {
        // 路由的
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
        // 是上下结构还是左右
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
      },
      condition: {
        // 是标准列还是 但对象界面
        type: String,
        default() {
          return '';
        }
      }
    },
    inject: [MODULE_COMPONENT_NAME],
    data() {
      return {
        newdefaultData: [], // 初始化form
        formData: {}, // 监听form变化
        formDataDef: {}, // 监听form 变化有value 和 文字
        VerificationForm: [], // 校验form
        VerificationFormItem: [],
        defaultFormData: {}, // form 默认值
        Mapping: {}, // 设置映射关系
        mapData: {}, // 全部联动关系
        mountChecked: false, // 区分是默认值还是change 值
        mountNumber: 0, // 页面是否刷新
        verifyMessItem: {}, // 空form        watchComputFormList:[],
        FormItemComponent,
        refcolvaData: {},
        refcolvalAll: {},
        conditiontype: '',
        childFormData: [],
        computdefaultData: [], // form
        pathArry: [], // path 数组
        show: true,
        defaultColumnCol: this.defaultData.objviewcol || 4,
        tip: 'new',
        expand: 'expand' // 面板是否展开
      };
    },
    watch: {
      defaultData: {
        handler() {
          // 开启  默认值(刷新界面))
          this.mountChecked = false;
          // 开启 (刷新界面))
          this.mountNumber = (Math.random() * 1000).toFixed(0);
          this.computdefaultData = this.reorganizeForm();
          this.defaultColumnCol = this.defaultData.objviewcol || 4;
          this.Comparison();
        },
        deep: true
      },
      objreadonly: {
        handler() {
          this.computdefaultData = this.reorganizeForm();
          this.conditiontype = this.condition;
          this.Comparison();
        },
        deep: true
      }
    },
    computed: {
      path() {
        return this.paths[1] || '';
      },
      isreftabsForm() {
        // 
        if (this.masterName.length > 0 && this.childTableName.length > 0 && Version() === '1.3') {
          return true;
        }
        return this.isreftabs;
      },
      childTableNameForm() {
        // 子表名称
        return this.childTableName;
      },
      isMainTableForm() {
        // 主表
        return this.isMainTable;
      }
    },
    updated() {},
    methods: {
      CollapseClose() {},
      Comparison() {
        //  重新初始化校验
        this.VerificationForm = [];
        this.verifyMessItem = [];
        this.formData = {};
        this.formDataDef = {};
      },
      childForm(option) {
        return this.childFormData.push(option);
      },
      setMapping(Mapping, mapData) {
        this.mapData = Object.assign(this.mapData, mapData);
        this.Mapping = Object.assign(this.Mapping, Mapping);
      },
      reorganizeForm() {
        // 重置表单 配置
        let items = [];
        // 有面板的数据
        // 有面板的数据  child,inpubobj,childs
        const childs = {
          list: [],
          parentdesc: '',
          hrdisplay: ''
        };
        const hrdata = [];
        const defaultData = JSON.parse(JSON.stringify(this.defaultData));
        if (defaultData.addcolums) {
          const data = defaultData.addcolums.reduce((array, current) => {
            if (current.child) {
              // hr
              childs.isTitleShow = true;
              if (Array.isArray(current.child)) {
                const index = current.child.findIndex(
                  element => element.display === 'hr'
                );
                if (index !== -1) {
                  childs.parentdesc = current.child.name;
                }
                current.child.split(index, 1);
                childs.list.push(current.child);
              } else if (current.child.display !== 'hr') {
                childs.list.push(current.child);
              } else if (current.child.display === 'hr') {
                hrdata.push({
                  childs: [],
                  parentdesc: current.child.name,
                  hrdisplay: ''
                });
              }
            } else if (current.inpubobj) {
              childs.list.push(current.inpubobj);
            } else {
              array.push(current);
            }
            return array;
          }, []);
          data.push(...hrdata);
          if (childs.list.length > 0) {
            data.push({
              childs: childs.list,
              parentdesc: childs.parentdesc,
              isTitleShow: childs.isTitleShow,
              hrdisplay: 'expand'
            });
            defaultData.addcolums = [...data];
          }
        }
        if (
          this.type
          && Object.prototype.hasOwnProperty.call(defaultData, 'addcolums')
        ) {
          items = defaultData.addcolums.reduce((array, current, index) => {
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
                parentname: current.parentname,
                isTitleShow: !current.isTitleShow
              });
              return array;
            }
          }, []);
        } else if (
          Object.prototype.hasOwnProperty.call(defaultData, 'inpubobj')
        ) {
          // 表单的数据
          items = defaultData.inpubobj.reduce((array, current, itemIndex) => {
            current.formIndex = 'inpubobj';
            const option = this.reduceForm(array, current, itemIndex);
            array.push(option);
            return array;
          }, []);
        }
        return items;
      },
      // eslint-disable-next-line consistent-return
      formDataChange(data, setdefval, current) {
        // 表单数据修改  判断vuex 里面是否有input name
        // console.log(data, setdefval);
        if (current.item.props.isuppercase && data[current.item.field]) {
          data[current.item.field] = data[current.item.field].toUpperCase();
        }
        this.refcolvaData = Object.assign(JSON.parse(JSON.stringify(this.defaultFormData)), data);
        if (!this.mountChecked && this.conditiontype !== 'list') {
          // 区分是否是默认值的change 拦截
          return false;
        }

        if (Array.isArray(data)) {
          data = data[0];
        }
        const formData = Object.assign(JSON.parse(JSON.stringify(this.defaultSetValue)), this.formDataDef);
        this.formData = Object.assign(JSON.parse(JSON.stringify(this.formData)), data);
        this.formDataDef = Object.assign(formData, setdefval);
        // 获取表单的默认值
        const key = Object.keys(data)[0];
        if (key && key.split(':').length > 1) {
          delete this.formData[current.item.field];
        } else {
          delete this.formData[current.item.inputname];
        }
        //  校验赋值
        this.VerificationForm.forEach((item) => {
          Object.keys(this.formData).forEach((option) => {
            if (item.key === option.split(':')[0]) {
              item.value = this.formData[option];
            }
          });
        });
        // 校验
        const message = this.setVerifiy();

        if (message.messageTip.length > 0) {
          this.verifyMessItem = message;
          this.$emit('VerifyMessage', message);
        } else {
          this.verifyMessItem = {};
          this.$emit('VerifyMessage', {});
        }
        // let v1.4外键 及number
        if (!this.formData[current.item.field]) {
          if (current.item.props.number === true || current.item.props.fkdisplay === 'pop' || current.item.props.fkdisplay === 'drp') {
            this.formData[current.item.field] = 0;
          } else if (current.item.props.fkdisplay) {
            this.formData[current.item.field] = '';
          } else {
            this.formData[current.item.field] = '';
          }
        }
        // 获取需要校验的表单
        this.$emit('formChange', this.formData, this.formDataDef);
        this.getStateData();
      },
      VerifyMessageForm(value, type) {
        // 获取需要校验的表单
        // 初始化form 校验
        this.mountChecked = true;
        this.VerificationFormItem[type] = [];
        this.VerificationFormItem[type].push(...value);
        this.VerificationForm = this.VerificationFormItem.reduce((arr, item) => arr.concat(item), []);
        const data = this.setVerifiy();
        if (data.messageTip.length > 0) {
          this.verifyMessItem = data;
        }
        this.$emit('VerifyMessage', data);
      },
      mountdataForm(value) {
        // 获取表单默认值
        setTimeout(() => {
          this.mountChecked = true;
        }, 200);
        this.refcolvaData = {};
        this.defaultFormData = Object.assign(JSON.parse(JSON.stringify(this.defaultFormData)), value);
        // 去除 空字符串
        const defaultFormData = Object.keys(this.defaultFormData).reduce((arr, option) => {
          if (this.defaultFormData[option] !== '' && this.defaultFormData[option] !== undefined && this.defaultFormData[option] !== null) {
            if (Array.isArray(this.defaultFormData[option])) {
              if (Object.hasOwnProperty.call(this.defaultFormData[option], 'ID')) {
                arr[option] = this.defaultFormData[option].ID;
              } else {
                arr[option] = this.defaultFormData[option][0];
              }
            } else {
              arr[option] = this.defaultFormData[option];
            }
          }
          return arr;
        }, {});

        // 外部change的值(复制修改过后的值 去修改 页面)
        const defaultSetValue = Object.keys(this.defaultSetValue).reduce((arr, option) => {
          if (defaultFormData[option]) {
            arr[option] = defaultFormData[option];
          }
          return arr;
        }, {});
        if (this.moduleFormType === 'horizontal') {
          this.formData = Object.assign({}, defaultSetValue);
          this.$emit('formChange', defaultSetValue, this.defaultSetValue);
        }
        this.getStateData();
        this.defaultFormData = defaultFormData;
        this.$emit('InitializationForm', defaultFormData);
      },
      reduceForm(array, current, index) {
        // 重新配置 表单的 事件及属性
        const obj = {};
        obj.row = current.row ? current.row : 1;
        obj.col = current.col ? current.col : 1;
        obj.component = ItemComponent;
        obj.show = Object.hasOwnProperty.call(current, 'hidecolumn') ? this.hidecolumn(current, array) : true;
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
            clear: () => {
              const LinkageForm = this.$store.state[this[MODULE_COMPONENT_NAME]].LinkageForm || [];
              const mappStatus = this.$store.state[this[MODULE_COMPONENT_NAME]].mappStatus || [];
              this.getStateData(); // 获取主表信息
              Object.keys(mappStatus).forEach((item) => {
                if (!this.refcolvalAll[mappStatus[item]]) {
                  const Index = LinkageForm.findIndex(option => option.key === item);
                  if (LinkageForm[Index].input) {
                    // console.log(LinkageForm[Index].input);
                    // LinkageForm[Index].input.value = '';
                  }
                }
              });
            },
            change: (value) => {
              if (current.fkdisplay) {
                this.focusChange(value, current, index);
              }
              if (current.display === 'check') {
                // this.changeItem(index, current, value);
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
            fkrpSelected: () => {
              let item = [];
              if (current.formIndex !== 'inpubobj') {
                item = this.$refs[`FormComponent_${current.formIndex}`][0]
                  .newFormItemLists;
              } else {
                item = this.$refs.FormComponent_0.newFormItemLists;
              }
              item[index].item.props.AutoData = [];
              item[index].item.props.defaultSelected = item[index].item.value;
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

              //
              item[index].item.props.Selected = Selected;
              item[index].item.value = value;
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
              this.getStateData(); // 获取主表信息
              let Fitem = [];
              if (current.formIndex !== 'inpubobj') {
                Fitem = this.$refs[`FormComponent_${current.formIndex}`][0]
                  .newFormItemLists;
              } else {
                Fitem = this.$refs.FormComponent_0.newFormItemLists;
              }
              // 先清除一下
              Fitem[index].item.props.data = {};
              let searchObject = {};
              if (Object.hasOwnProperty.call(current, 'refcolval')) {
                let refcolval = this.refcolvalAll[current.refcolval.srccol]
                  ? this.refcolvalAll[current.refcolval.srccol]
                  : '';
                if (this.refcolvalAll[current.refcolval.srccol] === undefined) {
                  refcolval = this.defaultFormData[current.refcolval.srccol];
                }
                const LinkageForm = this.$store.state[this[MODULE_COMPONENT_NAME]].LinkageForm || [];
                const Index = LinkageForm.findIndex(item => item.key === current.refcolval.srccol);
                if (!refcolval) {
                  if (Index !== -1) {
                    this.$Message.info(`请先选择${LinkageForm[Index].name}`);
                    if (LinkageForm[Index].input) {
                      LinkageForm[Index].input.focus();
                      return false;
                    }
                  } else {
                    this.$Message.info('请先选择关联的表');
                  }
                  return false;
                }
                const query = current.refcolval.expre === 'equal' ? `=${refcolval}` : '';

                searchObject = {
                  isdroplistsearch: true,
                  refcolid: current.colid,
                  fixedcolumns: {
                    [current.refcolval.fixcolumn]: query
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
            blur: (event, $this, item) => {
              // 失去光标 单对象 外键 value 清除
              let Fitem = [];
              if (current.formIndex !== 'inpubobj') {
                Fitem = this.$refs[`FormComponent_${current.formIndex}`][0]
                  .newFormItemLists;
              } else {
                Fitem = this.$refs.FormComponent_0.newFormItemLists;
              }
              if (current.isuppercase) {
                this.lowercaseToUppercase(index, current);
              }
              if (item.props.fkdisplay && this.conditiontype !== 'list') {
                if (item.type === 'AttachFilter') {
                  if (item.props.Selected[0] && item.props.Selected[0].ID === '') {
                    Fitem[index].item.value = '';

                    this.resultData = {};
                    Fitem[index].item.props.Selected = [
                      {
                        label: '',
                        ID: ''
                      }
                    ];
                  }
                } else if (item.type === 'DropDownSelectFilter') {
                  if (Array.isArray(item.value)) {
                    if (item.value[0].ID === '' || item.value[0].ID === undefined) {
                      Fitem[index].item.props.defaultSelected = [];
                    }
                  } else {
                    Fitem[index].item.props.defaultSelected = [];
                  }
                }
              }
            },
            inputValueChange: (value) => {
              this.focusChange(value, current, index);
            },
            pageChange: (currentPage, $this) => {
              // 外键的分页查询

              let searchObject = {};
              if (current.refcolval && current.refcolval.srccol) {
                const refcolval = this.refcolvalAll[current.refcolval.srccol]
                  ? this.refcolvalAll[current.refcolval.srccol]
                  : '';
                const query = current.refcolval.expre === 'equal' ? `=${refcolval}` : '';
                searchObject = {
                  isdroplistsearch: true,
                  refcolid: current.colid,
                  startindex: $this.data.defaultrange * ($this.currentPage - 1),
                  range: $this.pageSize,
                  fixedcolumns: {
                    [current.refcolval.fixcolumn]: query
                  },
                };
              } else {
                searchObject = {
                  isdroplistsearch: true,
                  refcolid: current.colid,
                  startindex: $this.data.defaultrange * ($this.currentPage - 1),
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
            }
          },
          validate: this.validateList(current)
        };
        this.propsType(current, obj.item);
        return obj;
      },
      hidecolumn(current, array) {
        //  隐藏判断
        const check = array.some((option) => {
          const refcolumn = current.hidecolumn.refcolumn;
          const refval = current.hidecolumn.refval;
          let val = option.item.value;
          if (Array.isArray(option.item.value) && option.item.value[0]) {
            if (Object.hasOwnProperty.call(option.item.value[0], 'ID')) {
              val = option.item.value[0].ID;
            } else {
              val = option.item.value[0];
            }
          }
          return option.item.field === refcolumn && val === refval;
        });
        return check;
      },
      focusChange(value, current, index) {
        // 外键的模糊搜索
        if (!value) {
          return false;
        }
        let sendData = {};
        if (Object.hasOwnProperty.call(current, 'refcolval')) {
          let refcolval = this.formData[current.refcolval.srccol]
            ? this.formData[current.refcolval.srccol]
            : '';
          if (this.formData[current.refcolval.srccol] === undefined) {
            refcolval = this.defaultFormData[current.refcolval.srccol];
          }
          if (!refcolval) {
            this.$Message.info('请选择关联表字段');
            return false;
          }
          const query = current.refcolval.expre === 'equal' ? `=${refcolval}` : '';
          sendData = {
            ak: value,
            colid: current.colid,
            fixedcolumns: {
              whereKeys: {
                [current.refcolval.fixcolumn]: query
              }
            }
          };
        } else {
          sendData = {
            ak: value,
            colid: current.colid,
            fixedcolumns: {}
          };
        }

        fkFuzzyquerybyak({
          searchObject: sendData,
          serviceId: current.serviceId,
          success: (res) => {
            this.freshDropDownSelectFilterAutoData(res, index, current);
          }
        });
        return true;
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
        setTimeout(() => {
          this.$emit('on-formEnter');
        }, 200);
      },
      checkDisplay(item) {
        // 组件显示类型
        let str = '';
        // if (this.objreadonly ) {
        //   // 页面只读标记
        //   if(item.fkdisplay === 'drp' || item.fkdisplay === 'mop'|| item.fkdisplay === 'pop' || item.fkdisplay === 'mrp' ){
        //      item.readonly === true;
        //   }
        //   //return str;
        // }
        // if (item.readonly === true && item.fkdisplay) {
        //   //  不可编辑 变成 input
        //      if(item.fkdisplay === 'drp' || item.fkdisplay === 'mop'|| item.fkdisplay === 'pop' || item.fkdisplay === 'mrp' ){
        //         str = "input";
        //          return str;
        //      }

        // }
        if (item.readonly === true && item.fkdisplay) {
          //  不可编辑 变成 input
          if (
            item.fkdisplay === 'drp'
            || item.fkdisplay === 'mop'
            || item.fkdisplay === 'pop'
            || item.fkdisplay === 'mrp'
          ) {
            str = 'input';
            return str;
          }
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
        if (
          item.display === 'text'
          || item.display === 'xml'
          || item.display === 'OBJ_FK'
        ) {
          const casefkdisplay = item.fkdisplay || (item.fkobj && item.fkobj.searchmodel);
          switch (casefkdisplay) {
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
        if (item.display === 'clob') {
          str = 'Wangeditor';
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
        // 组件的默认值  
        if (this.objreadonly) {
          // 页面只读标记

          // if (item.display === "select" || item.display === "OBJ_SELECT") {
          //   const value = item.defval || item.valuedata;
          //   const index = item.combobox.findIndex(x => x.limitval === value);
          //   return item.combobox[index].limitdesc || "";
          // }
        }
        if (item.readonly === true && item.fkdisplay) {
          //  不可编辑 变成 input

          return item.valuedata || item.defval || '';
        }
        // 设置表单的默认值
        if (
          (item.display === 'textarea' && !item.fkdisplay)
          || (item.display === 'text' && !item.fkdisplay)
        ) {
          if (this.defaultSetValue[item.colname] !== undefined) {
            return this.defaultSetValue[item.colname];
          }
          return item.valuedata || item.defval || '';
        }
        if (item.display === 'OBJ_DATENUMBER' || item.display === 'OBJ_DATE') {
          // 日期控件
          // 保存change 之前的默认值
          if (item.rangecolumn) {
            const start = item.rangecolumn.upperlimit;
            const end = item.rangecolumn.lowerlimit;
            return [start.defval || start.valuedata, end.defval || end.valuedata];
          }

          if (this.defaultSetValue[item.colname] !== undefined) {
            return this.defaultSetValue[item.colname];
          }
          return item.valuedata || item.defval || '';
        }
        if (item.display === 'OBJ_TIME') {
          // 保存change 之前的默认值
          if (this.defaultSetValue[item.colname] !== undefined) {
            return this.defaultSetValue[item.colname];
          }
          return item.valuedata || item.defval || '';
        }
        // 设置表单的默认值

        if (item.display === 'check') {
          // 保存change 之前的默认值
          if (this.defaultSetValue[item.colname] !== undefined) {
            return this.defaultSetValue[item.colname];
          }
          return item.valuedata || item.defval || 'N';
        }
        // console.log(item, this.defaultSetValue);

        if (item.display === 'OBJ_SELECT' || item.display === 'select') {
          // 处理select的默认值
          const arr = [];
          if (this.defaultSetValue[item.colname] !== undefined) {
            arr.push(this.defaultSetValue[item.colname]);
          } else {
            arr.push(item.valuedata || item.defval);
          }
          return arr;
        }
        // 
        if (item.display === 'image') {
          let arr = [];
          try {
            if (this.defaultSetValue[item.colname]) {
              arr = this.defaultSetValue[item.colname];
            } else {
              arr = JSON.parse(item.valuedata);
            }
          } catch (err) {
            if (typeof item.valuedata === 'string') {
              arr = [{
                URL: item.valuedata
              }];
            } else {
              arr = [];
            }
          }
          return arr;
        }
        if (item.display === 'doc') {
          let arr = [];
          try {
            if (this.defaultSetValue[item.colname]) {
              arr = this.defaultSetValue[item.colname];
            } else {
              arr = JSON.parse(item.valuedata);
            }
          } catch (err) {
            if (typeof item.valuedata === 'string') {
              if (item.valuedata.length > 0) {
                arr = [{
                  URL: item.valuedata
                }];
              }
            } else {
              arr = [];
            }
          }
          return arr;
        }
        // const fkdisplayValue = this.defaultSetValue[item.colname] && this.defaultSetValue[item.colname][0];
        // if (item.fkdisplay === 'mop') {
        //   if (fkdisplayValue) {
        //     return fkdisplayValue.lable;

        // }

        // if (item.fkdisplay === 'pop') {
        //   const fkdisplayValue = this.defaultSetValue[item.colname] && this.defaultSetValue[item.colname][0];
        //   const ID = item.refobjid ? item.refobjid : '';
        //   arr.push({
        //     ID: item.refobjid === '-1' ? '' : ID,
        //     Label: item.valuedata || item.defval || ''
        //   });
        //   if (this.defaultSetValue[item.colname] && this.defaultSetValue[item.colname][0]) {
        //     arr[0].ID = fkdisplayValue ? fkdisplayValue.ID : '';
        //     arr[0].Label = fkdisplayValue ? fkdisplayValue.Label : '';
        //   }

        //   return arr;
        //   if (fkdisplayValue) {
        //     return fkdisplayValue.Label;
        //   }
        //   return item.defval || item.valuedata || item.default || '';
        // }
        if (this.objreadonly === true) {
          if (item.valuedata && /total/.test(item.valuedata) && item.fkdisplay === 'mop') {
            const valuedata = JSON.parse(item.valuedata);
            return `已经选中${valuedata.total}条` || '';
          }
          return this.defaultSetValue[item.colname] || item.valuedata || item.default || item.defval || '';
        }
        const fkdisplayValue = this.defaultSetValue[item.colname] && this.defaultSetValue[item.colname][0];
        if (item.fkdisplay === 'drp' || item.fkdisplay === 'mrp' || item.fkdisplay === 'pop' || item.fkdisplay === 'mop') {
          // 外键默认值
          const arr = [];

          const ID = item.refobjid ? item.refobjid : '';
          if (item.fkdisplay === 'mrp' && fkdisplayValue) {
            // 多选change
            const refobjid = (fkdisplayValue.ID && fkdisplayValue.ID.split(',')) || [];
            const valuedata = (fkdisplayValue.Label && fkdisplayValue.Label.split(',')) || [];
            const option = refobjid.reduce((currty, itemI, index) => {
              currty.push({
                ID: itemI || '',
                Label: valuedata[index] || ''
              });
              return currty;
            }, []);
            // arr = [...option];
            return option;
          } if (item.fkdisplay === 'mrp' && item.refobjid) {
            // 多选默认值
            const refobjid = (item.refobjid && item.refobjid.split(',')) || [];
            const valuedata = (item.valuedata && item.valuedata.split(',')) || [];
            const option = refobjid.reduce((currty, itemI, index) => {
              currty.push({
                ID: itemI || '',
                Label: valuedata[index] || ''
              });
              return currty;
            }, []);
            // arr = [...option];
            return option;
          }


          arr.push({
            ID: item.refobjid === '-1' ? '' : ID,
            Label: item.valuedata || item.defval || ''
          });

          if (item.fkdisplay === 'mop') {
            arr[0].ID = item.valuedata || item.defval || '';
            if (item.valuedata && /total/.test(item.valuedata)) {
              const valuedata = JSON.parse(item.valuedata);
              arr[0].Label = `已经选中${valuedata.total}条` || '';
              arr.push(`已经选中${valuedata.total}条` || '');
            }
          } else if (item.fkdisplay === 'pop') {
            arr.push((fkdisplayValue && fkdisplayValue.label) || '');
          }
          if (fkdisplayValue) {
            if (item.fkdisplay === 'drp' || item.fkdisplay === 'mrp') {
              arr[0].ID = fkdisplayValue ? fkdisplayValue.ID : '';
              arr[0].Label = fkdisplayValue ? fkdisplayValue.Label : '';
            } else if (item.fkdisplay === 'pop' || item.fkdisplay === 'mop') {
              arr[0].ID = fkdisplayValue ? fkdisplayValue.ID : '';
              arr[0].Label = fkdisplayValue ? fkdisplayValue.Label : '';
              arr.push((fkdisplayValue && fkdisplayValue.Label) || '');
            }
          }

          return arr;
        }


        return this.defaultSetValue[item.colname] || item.valuedata || item.defval || item.default || '';
      // wewe
      },
      propsType(current, item) {
        // 表单 props
        const obj = item;


        item.props.maxlength = item.props.length;
        // item.props.disabled = item.props.readonly;
        item.props.comment = item.props.comment;


        if (this.objreadonly) {
          // 页面只读标记
          item.props.placeholder = '';
        }
        // 去除请输入 字段
        if (item.props.readonly) {
          item.props.placeholder = '';
        }


        // 前端自定义标记
        if (current.webconf) {
          const webconf = current.webconf;
          // 读写规则
          if (webconf.display === 'enumerate') {
            item.type = 'EnumerableInput';
          } else if (webconf.display === 'jsonmaker') {
            // 拓展属性
            item.type = 'ExtentionInput';
          }
        }
        // 上传文件插件
        if (item.props.display === 'doc') {
          item.type = 'docfile';
          const valuedata = this.defaultValue(current) || [];
          const filesLength = Number(current.webconf && current.webconf.filesLength);
          let readonly = current.readonly;
          readonly = this.objreadonly ? true : readonly;
          item.props.itemdata = {
            colname: current.colname,
            readonly,
            filesLength,
            masterName: this.masterName,
            objId: this.masterId,
            sendData: {
              path: `${this.masterName}/${this.masterId}/`
            },
            url: getGateway('/p/cs/batchUpload'),
            valuedata
          };
        }

        if (item.type === 'checkbox') {
          const checkName = ['Y', '1', true];
          const falseName = ['N', '0', false];
          const check = falseName.some(
            x => x === current.valuedata || x === current.defval
          );
          if (check) {
            // eslint-disable-next-line no-tabs
            item.props.falseValue = current.valuedata || current.defval || falseName[0];
            const index = falseName.findIndex(x => x === item.props.falseValue);
            item.props.trueValue = checkName[index] || checkName[0];
          } else {
            // eslint-disable-next-line no-tabs
            item.props.trueValue = current.valuedata || current.defval || checkName[0];
            const index = checkName.findIndex(x => x === item.props.trueValue);
            item.props.falseValue = falseName[index] || falseName[0];
          }
          item.props.disabled = this.objreadonly
            ? this.objreadonly
            : item.props.readonly;
          return current.valuedata || current.defval || '';
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
            const string = `^\\\d{0,${current.length}}(\\\.[0-9]{0,${
              current.scale
            }})?$`;
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
          if (item.display === 'textarea') {
            item.props.type = 'textarea';
          }
          if (current.isnotnull === true) {
            item.required = true;
          }
          if (current.ispassword) {
            item.props.type = 'password';
          }
          item.props.disabled = this.objreadonly
            ? this.objreadonly
            : item.props.readonly;
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
          item.props.disabled = this.objreadonly
            ? this.objreadonly
            : item.props.readonly;
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
            item.props.disabled = this.objreadonly
              ? this.objreadonly
              : item.props.readonly;

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
        //  const start = item.rangecolumn.upperlimit;
        //     const end = item.rangecolumn.lowerlimit;
        if (current.datelimit === 'before' || (current.rangecolumn && current.rangecolumn.datelimit === 'before')) {
          item.props.options = {
            disabledDate(date) {
              // 之前 含今天
              return date && date.valueOf() > new Date().valueOf();
            }
          };
        } else if (current.datelimit === 'after' || (current.rangecolumn && current.rangecolumn.datelimit === 'after')) {
          // 之后 含今天
          item.props.options = {
            disabledDate(date) {
              return date && date.valueOf() < new Date().valueOf() - 1 * 24 * 60 * 60 * 1000;
            }
          };
        } else if (current.datelimit === 'beforetoday' || (current.rangecolumn && current.rangecolumn.datelimit === 'beforetoday')) {
          // 之前 不含今天
          item.props.options = {
            disabledDate(date) {
              return (
                date
                && date.valueOf() > new Date().valueOf() - 1 * 24 * 60 * 60 * 1000
              );
            }
          };
        } else if (current.datelimit === 'aftertoday' || (current.rangecolumn && current.rangecolumn.datelimit === 'aftertoday')) {
          // 之后 不含今天
          item.props.options = {
            disabledDate(date) {
              return (
                date
                && date.valueOf() < new Date().valueOf()
              );
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
          if (current.rangecolumn) {
            item.props.type = 'datetimerange';
          } else {
            item.props.type = 'datetime';
          }
        }

        if (current.display === 'text' || current.display === 'xml') {
          switch (current.fkdisplay) {
          case 'drp':
            item.props.single = true;
            item.props.data = {};
            item.props.enterType = true;
            item.props.fk_type = 'drp';
            item.props.AutoData = [];
            item.props.defaultSelected = this.defaultValue(current);
            // eslint-disable-next-line no-case-declarations
            const that = this;
            // eslint-disable-next-line no-case-declarations
            const currentThat = current;
            item.props.isShowPopTip = () => {
              that.getStateData(); // 获取主表信息
              if (Object.hasOwnProperty.call(currentThat, 'refcolval')) {
                let refcolval = that.refcolvalAll[currentThat.refcolval.srccol]
                  ? that.refcolvalAll[currentThat.refcolval.srccol]
                  : '';
                if (that.refcolvalAll[currentThat.refcolval.srccol] === undefined) {
                  refcolval = that.defaultFormData[currentThat.refcolval.srccol];
                }
                const LinkageForm = that.$store.state[this[MODULE_COMPONENT_NAME]].LinkageForm || [];
                const Index = LinkageForm.findIndex(itemI => itemI.key === currentThat.refcolval.srccol);
                if (!refcolval) {
                  if (Index !== -1) {
                    this.$Message.info(`请先选择${LinkageForm[Index].name}`);
                    if (LinkageForm[Index].input) {
                      LinkageForm[Index].input.focus();
                      return false;
                    }
                  } else {
                    this.$Message.info('请先选择关联的表');
                  }
                  return false;
                }
                return true;
              }
              return true;
            };
            break;
          case 'mrp':
            item.props.single = false;
            item.props.data = {};
            item.props.fk_type = 'mrp';
            item.props.enterType = true;
            item.props.AutoData = [];
            item.props.defaultSelected = this.defaultValue(current);
            break;
          case 'pop':
            if (!item.props.disabled) {
              item.props.type = 'AttachFilter';
              item.props.optionTip = false;
              item.props.enterType = true;
              item.props.show = false;

              item.props.dialog = {
                model: {
                  title: current.fkdesc,
                  width: 920,
                  mask: true,
                  draggable: true,
                  closable: true,
                  scrollable: true,
                  maskClosable: false,
                  'footer-hide': true
                }
              };
              //  单对象界面
              item.props.AutoData = [];
              item.props.fkobj = {
                colid: current.colid,
                reftable: current.reftable,
                serviceId: current.serviceId,
                reftableid: current.reftableid,
                show: false,
                url:
                  `${current.serviceId ? (`/${current.serviceId}`) : ''
                  }/p/cs/menuimport`
              };
              item.props.datalist = [];
              item.props.Selected = [];
              if (!item.props.readonly && !this.objreadonly) {
                item.props.Selected.push(this.defaultValue(current)[0]);
                item.value = this.defaultValue(current)[0].Label;
              }
            }

            break;
          case 'mop':
            item.props.type = 'AttachFilter';
            item.props.enterType = true;
            item.props.show = true;
            item.props.AutoData = [];
            item.props.dialog = {
              model: {
                width: 920,
                mask: true,
                draggable: true,
                closable: true,
                scrollable: true,
                maskClosable: false,
                title: '弹窗多选',
                'footer-hide': false
              }
            };
            item.props.fkobj = {
              refobjid: current.refobjid,
              reftable: current.reftable,
              reftableid: current.reftableid,
              serviceId: current.serviceId,
              show: true,
              saveType: 'object',
              url:
                `${current.serviceId ? (`/${current.serviceId}`) : ''
                }/p/cs/menuimport`
            };
            item.props.datalist = [];
            item.props.Selected = [];
            item.props.filterDate = {};
            if (!item.props.readonly && !this.objreadonly) {
              item.value = this.defaultValue(current)[1];
              item.props.Selected.push(this.defaultValue(current)[0]);
            }

            break;
          default:
            break;
          }
        }
        if (current.display === 'image') {
          // 待确定
          item.props.type = 'ImageUpload';
          const valuedata = this.defaultValue(current);
          const ImageSize = Number(current.webconf && current.webconf.ImageSize);

          let readonly = current.readonly;
          readonly = this.objreadonly ? true : readonly;
          item.props.itemdata = {
            colname: current.colname,
            width: (current.col / this.defaultColumnCol) > 0.4 ? 220 : 160,
            height: 120,
            readonly,
            ImageSize,
            masterName: this.masterName,
            objId: this.masterId,
            sendData: {
              path: `${this.masterName}/${this.masterId}/`
            },
            url: getGateway('/p/cs/upload2'),
            valuedata
          };
        }
        if (current.display === 'clob') {
          item.props.path = `${this.masterName}/${this.masterId}/`;
        }
        if ((item.props.readonly === true && item.props.fkdisplay) || (this.objreadonly && item.props.fkdisplay)) {
          //  不可编辑 变成 input
          if (
            item.props.fkdisplay === 'drp'
            || item.props.fkdisplay === 'mop'
            || item.props.fkdisplay === 'pop'
            || item.props.fkdisplay === 'mrp'
          ) {
            item.props.type = 'text';
            item.type = 'input';
            item.props.defaultSelected = [{
              ID: current.refobjid,
              Label: current.valuedata
            }];
            item.props.Selected = [{
              ID: current.refobjid,
              Label: current.valuedata
            }];
          }
        }
        item.props.disabled = this.objreadonly
          ? this.objreadonly
          : item.props.readonly;
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
        item[index].item.props.pageSize = res.data.data.defaultrange;
        item[index].item.props.data = res.data.data;
      },
      freshDropDownSelectFilterAutoData(res, index, current, type) {
        // 外键的模糊搜索数据更新
        let item = [];
        if (current.formIndex !== 'inpubobj') {
          item = this.$refs[`FormComponent_${current.formIndex}`][0]
            .newFormItemLists;
        } else {
          item = this.$refs.FormComponent_0.newFormItemLists;
        }
        item[index].item.props.hidecolumns = ['id', 'value'];
        if (type === 'empty') {
          item[index].item.props.AutoData = [];
          item[index].item.props.defaultSelected = [];
        } else {
          if (res.data.data.length < 1) {
            delete this.formData[`${current.colname}:NAME`];
          // console.log(current.colname,this.formData);
          }
          item[index].item.props.AutoData = res.data.data;
        }
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
      changeItem(index, current, value) {
        // check
        let item = [];
        if (current.formIndex !== 'inpubobj') {
          item = this.$refs[`FormComponent_${current.formIndex}`][0]
            .newFormItemLists;
        } else {
          item = this.$refs.FormComponent_0.newFormItemLists;
        }
        item[index].item.value = value;
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
          // 校验值是不是有值
          if (item.value === undefined || item.value === '' || item.value === null || (item.value === 0 && item.fkdisplay) || item.value === '[]') {
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
        const focusItemArry = [...arry];
        focusItemArry.splice(0, index + 1);
        const _index = index
          + 1
          + focusItemArry.findIndex(itemI => itemI.item.props.readonly === false);

        if (item[_index] && arry[_index].item.type !== 'checkbox') {
          if (item[_index].$el.querySelector('input')) {
            item[_index].$el.querySelector('input').focus();
          } else if (item[_index].$el.querySelector('textarea')) {
            item[_index].$el.querySelector('textarea').focus();
          }
          return false;
        }
        this.focusItem(_index, current, arry);
        return true;
      },
      setdefaultColumnCol() {
        // 设置表单 展示 的值
        const width = this.$el.offsetWidth;
        if (width < 580 && width !== 0) {
          this.defaultColumnCol = 1;
        } else {
          this.defaultColumnCol = this.defaultData.objviewcol;
        }
      },
      getStateData() {
        // 获取 主子表的状态值
        this.refcolvalAll = {};
        const state = this.$store.state[this[MODULE_COMPONENT_NAME]];
        if (this.condition === 'list') {
          return {};
        }
        if (this.$route.params.itemId === undefined) {
          return false;
        }
        if (!state || !state.updateData[this.masterName]) {
          return false;
        }

        if (this.$route.params.itemId.toLocaleLowerCase() !== 'new') {
          if (this.isreftabsForm) {
            const defaultMain = JSON.parse(JSON.stringify((state.updateData[this.masterName].default[this.masterName] || {})));
            const modifyMain = JSON.parse(JSON.stringify((state.updateData[this.masterName].modify[this.masterName] || {})));
            this.refcolvalAll = Object.assign(defaultMain, modifyMain, this.formData);

            return this.refcolvalAll;
          }
          const modifyMain = JSON.parse(JSON.stringify((state.updateData[this.masterName].modify[this.masterName] || {})));
          const defaultMain = JSON.parse(JSON.stringify((state.updateData[this.masterName].default[this.masterName] || {})));
          this.refcolvalAll = Object.assign(defaultMain, modifyMain);
        } else {
          const addMain = JSON.parse(JSON.stringify((state.updateData[this.masterName].add[this.masterName] || {})));
          const modifyMain = JSON.parse(JSON.stringify((state.updateData[this.masterName].modify[this.masterName] || {})));
          const defaultMain = JSON.parse(JSON.stringify((state.updateData[this.masterName].default[this.masterName] || {})));
          this.refcolvalAll = Object.assign(defaultMain, addMain, this.formData, modifyMain);
        }
        return this.refcolvalAll;
      },
    },
    mounted() {
      this.Comparison();
      if (this.$el) {
        this.setdefaultColumnCol();
      }
      this.conditiontype = this.condition;
      window.addEventListener('resize', () => {
        if (this.$el) {
          this.setdefaultColumnCol();
        }
      });
      if (!this.$el) {
        window.removeaddEventListener('resize');
      }
    },
    created() {
      this.computdefaultData = this.reorganizeForm();
      this.mountNumber = (Math.random() * 1000).toFixed(0);
    },
    deactivated() {
      if (this.$store._mutations && this.$store._mutations[`${this[MODULE_COMPONENT_NAME]}/updateLinkageForm`]) {
        if (this.moduleFormType !== 'horizontal' || !this.isreftabsForm) {
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateLinkageForm`, []);
        }
      }
    }
  };
</script>

<style>
.burgeon-collapse > .burgeon-collapse-item > .burgeon-collapse-header {
  text-align: center;
  padding: 0;
  margin: 0;
  height: 28px!important;
  line-height: 28px!important;
  font-size: 12px;
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

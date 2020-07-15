/* eslint-disable no-undef */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable array-callback-return */
<!--suppress ALL:form-item-lists="FormLists(item.childs)" -->
<template>
  <div>
    <template v-if="type === 'PanelForm'">
      <!-- 面板内 -->
      <Collapse
        v-for="(item,index) in computdefaultData"
        :key="index"
        v-model="item.showHrdisplay "
        active-key="index"
        @on-change="CollapseClose(index,item.hrdisplay)"
      >
        <Panel
          :key="index"
          class="Rburgeon-collapse-content-box"
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
                :is-copy="isCopy"
                :class="tableGetName=== '' ? 'R3masterForm' : tableGetName"
                :form-index="index"
                :form-item-lists="item.childs"
                :isreftabs="isreftabsForm"
                :set-objreadonly="setObjreadonly"
                :child-table-name="childTableName"
                :refcolval-data="refcolvaData"
                :mapp-status="setMapping"
                :web-conf-single="webConfSingle"
                :is-main-table="isMainTableForm"
                :partent-vue="partentVue"
                :condition="conditiontype"
                :module-form-type="moduleFormType"
                :get-state-data="getStateData"
                :getset-attset-props="getsetAttsetProps"
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
    <!-- 面板外 -->
    <template v-if="type !== 'PanelForm'">
      <template v-if="FormItemComponent!==''">
        <component
          :is="FormItemComponent"
          ref="FormComponent_0"
          :path="path"
          :isreftabs="isreftabsForm"
          :form-index="0"
          :is-copy="isCopy"
          :class="tableGetName"
          :refcolval-data="refcolvaData"
          :child-table-name="childTableNameForm"
          :verifymessageform="VerifyMessageForm"
          :set-objreadonly="setObjreadonly"
          :web-conf-single="webConfSingle"
          :mapp-status="setMapping"
          :partent-vue="partentVue"
          :module-form-type="moduleFormType"
          :default-column="defaultColumnCol"
          :condition="conditiontype"
          :mounted-type="mountNumber"
          :getset-attset-props="getsetAttsetProps"
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
  import { DispatchEvent } from '../__utils__/dispatchEvent';


  const fkHttpRequest = () => require(`../__config__/actions/version_${Version()}/formHttpRequest/fkHttpRequest.js`);
  
  export default {
    name: 'CompositeForm',
    components: {},
    props: {
      from: {
        // 引入此组件的来源
        type: String,
        default() {
          return '';
        }
      },
      webConfSingle: {// 当前子表webConf
        type: Object,
        default: () => ({})
      },
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
      readonly: {
        // 界面是否配置了readonly
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
        VerificationFormItem: [], // 需要验证的组件
        defaultFormData: {}, // form 默认值
        Mapping: {}, // 设置映射关系
        mapData: {}, // 全部联动关系
        mountChecked: false, // 区分是默认值还是change 值
        mountNumber: 0, // 页面是否刷新
        verifyMessItem: {}, // 空form        watchComputFormList:[],
        FormItemComponent,
        refcolvaData: {}, // 当前组件修改后和当前
        refcolvalAll: {}, // 关联当前页面的 所有数据
        conditiontype: '', // 是查询还是保存界面
        InitializationFormTime: '', // 当前初始化时间
        childFormData: [],    
        labelForm: {}, // label 值
        r3Form: {},
        timeChange: 0,
        computdefaultData: [], // form
        setAttsetProps: {}, // 静态属性 映射
        pathArry: [], // path 数组
        show: true,
        copyInt: true,
        labelFormSave: {},
        defaultColumnCol: this.defaultData.objviewcol || 4,
        tip: 'new',
        setVerifyMessageTime: null,
        setVerifyMessageTimeII: null,
        setChangeTime: null,
        formDataSave: {}, // change
        LinkageForm: [], // 界面 所有表单组件配置
        hidecolumnForm: {}, // 界面 隐藏字段
        defaultDataInt: {}, // 默认值的value
        formItem: {},
        watchTime: null,
        expand: 'expand' // 面板是否展开
      };
    },
    watch: {
      // mountNumber: {
      //   handler() {
      //     // 组件重组
      //     this.Comparison();
      //     this.reorganizeForm();
      //   }

      // },
      defaultData: {
        handler() {
          this.openLoading();
          // 开启  默认值(刷新界面))
          this.mountChecked = false;
          clearTimeout(this.watchTime);
          this.watchTime = setTimeout(() => {
            this.mountChecked = false;
            // 清空界面的 默认值
            this.defaultFormData = {};
            this.Comparison();
            // 开启 (刷新界面))
            this.mountNumber = (Math.random() * 1000).toFixed(0);
            // 组件重组
            this.reorganizeForm();

            this.defaultColumnCol = this.defaultData.objviewcol || 4;
          }, 200);
        },
        deep: true
      },
      objreadonly: {
        handler() {
          this.reorganizeForm();
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
      setObjreadonly() {
        return this.objreadonly;
      },
      tableGetName() {
        // 获取表名称
        return this.isMainTable ? '' : this.childTableName;
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
      isCopy() {
        // 是否是copty 
        return this.defaultData.copy;
      },
      Comparison() {
        //  重新初始化校验
        this.VerificationForm = [];
        this.verifyMessItem = [];
        this.VerificationFormItem = [];
        this.formData = {};
        this.formDataDef = {};
        this.formDataSave = {};
        this.labelForm = {};
        this.r3Form = {};
        this.labelFormSave = {};
      },
      isReadonly(current) {
        // 设置界面的 是否 disable
        if (current.webconf && current.webconf.ignoreDisableWhenEdit && this.conditiontype !== 'list') {
          if (this.defaultData.isdefault && !current.disabled && !current.readonly && !this.objreadonly) {
            return false;
          }
          return current.disabled || false;
        }
        if (this.conditiontype === 'list') {
          return current.disabled || false;
        }
        if (this.objreadonly) {
          return true;
        }
        if (current.disabled || current.readonly) {
          return true;
        }
        return current.disabled || false;
      },
      childForm(option) {
        return this.childFormData.push(option);
      },
      setMapping(Mapping, mapData) {
        this.mapData = Object.assign(this.mapData, mapData);
        this.Mapping = Object.assign(this.Mapping, Mapping);
      },
      reorganizeFormInit() {
        let items = [];
        // 有面板的数据
        // 有面板的数据  child,inpubobj,childs
        const childs = {
          list: [],
          parentdesc: '',
          hrdisplay: '',
          showHrdisplay: ''
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
                  hrdisplay: '',
                  showHrdisplay: ''
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
              hrdisplay: 'expand',
              showHrdisplay: 'expand'
            });
          }
          defaultData.addcolums = [...data];
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
              if (array !== undefined) {
                array.push({
                  childs: tem.concat([]),
                  hrdisplay: current.hrdisplay,
                  showHrdisplay: current.hrdisplay,
                  parentdesc: current.parentdesc,
                  parentname: current.parentname,
                  isTitleShow: !current.isTitleShow
                });
              }
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
      reorganizeForm() {
        // 重置表单 配置
        clearTimeout(this.setChangeTime);
        this.setChangeTime = setTimeout(() => {
          this.computdefaultData = this.reorganizeFormInit();

          // 隐藏判断
          if (Array.isArray(this.computdefaultData)) {
            this.computdefaultData.forEach((item, i) => {
              if (Array.isArray(item.childs)) {
                item.childs.forEach((option, j) => {
                  let show = true;
                 
                  if (option.item && Object.hasOwnProperty.call(option.item.validate, 'hidecolumn')) {
                    const showHide = this.hidecolumn(option, i, j);
                    if (option.item.validate.hidecolumn.ishide) {
                      show = !showHide;
                    } else {
                      show = showHide;
                    }
                  }

                  // option.show = Object.hasOwnProperty.call(option.item.validate, 'hidecolumn') ? this.hidecolumn(option, i, j) : true;
                  if (option.item.props.display === 'none') {
                    show = false;
                  }  
                  option.show = show;
                });
              } else {
                let show = true;
                if (Object.hasOwnProperty.call(item.item.validate, 'hidecolumn')) {
                  const showHide = this.hidecolumn(item, i);
                  if (item.item.validate.hidecolumn.ishide) {
                    show = !showHide;
                  }
                }
                item.show = show;
              }
            });
          }
        }, 80);
      },
      setChangeValue(data) {
        // 修改联动值
        // this.getStateData();

        const mappStatus = this.$store.state[this[MODULE_COMPONENT_NAME]].mappStatus || [];
        const LinkageForm = this.$store.state[this[MODULE_COMPONENT_NAME]].LinkageForm || {};

        const key = mappStatus[Object.keys(data)[0]];
        const LinkageFormItem = LinkageForm[key];
        if (LinkageFormItem) {
          // 通知清空
          window.eventType(`${this[MODULE_COMPONENT_NAME]}setLinkForm`, window, { key: Object.keys(data)[0], data, tableName: this.tableGetName });
        }
        // let documentkey = '';

        // if (LinkageFormItem && this.tableGetName && !LinkageFormItem.item.maintable) {
        //   documentkey = document.querySelector(`.${this.tableGetName}`).querySelector(`#${key}`);
        // } else {
        //   documentkey = document.querySelector(`#${key}`);
        // }
        // // console.log(key, mappStatus, LinkageFormItem, 'key');
        // if (!document.querySelector(`#${key}`)) {
        //   return false;
        // }
        // const LinkageFormInput = documentkey.querySelector('.burgeon-icon-ios-close-circle');
        // if (LinkageFormInput) {
        //   LinkageFormInput.click();
        // }
        // return true;
      },
      // eslint-disable-next-line consistent-return
      setHideColms(data) {
        const key = Object.keys(data)[0];
        if (this.hidecolumnForm[key]) {
          // 通知隐藏关系
          const refcolvaData = Object.assign(JSON.parse(JSON.stringify(this.defaultFormData)), data);
          window.eventType(`${this[MODULE_COMPONENT_NAME]}setHideForm`, window, {
            key, list: this.hidecolumnForm[key], data: refcolvaData, tableName: this.tableGetName 
          });
        }
        return true;
      },
      setDynamicForcompute(data, current) {
        if (current.item && Object.hasOwnProperty.call(current.item.validate, 'dynamicforcompute')) {
          window.eventType(`${this[MODULE_COMPONENT_NAME]}Dynam`, window, {
            ...current.item.validate,
            data: Object.assign(JSON.parse(JSON.stringify(this.refcolvalAll)), data)
          });
        }
      },
      formDataChange(data, setdefval, current, label) {
        // 表单数据修改  判断vuex 里面是否有input name
        if (current.item.props.isuppercase && data[current.item.field]) {
          if (typeof data[current.item.field] === 'string') { 
            data[current.item.field] = data[current.item.field].toUpperCase();
          }
        }
        // 针对明细列表外键回车查询功能
        if (this.conditiontype !== 'list') {
          if (current) {
            if (current.item.props.fkdisplay === 'drp' || current.item.props.fkdisplay === 'mrp') {
              if (!Array.isArray(setdefval[current.item.field])) {
                data[current.item.field] = '';
              }
            }
          }
        }
        this.refcolvaData = Object.assign(JSON.parse(JSON.stringify(this.defaultFormData)), data);
        if (!this.mountChecked && this.conditiontype !== 'list') {
          // 区分是否是默认值的change 拦截
          this.labelForm = {};
          return false;
        }

        // 计算逻辑
        this.setDynamicForcompute(data, current);

        // 修改联动的值
        this.setChangeValue(data, current);
        // 修改隐藏
        this.setHideColms(data, current);
        if (Array.isArray(data)) {
          data = data[0];
        }
        const formData = Object.assign(JSON.parse(JSON.stringify(this.defaultSetValue)), this.formDataDef);
        this.formData = Object.assign(JSON.parse(JSON.stringify(this.formData)), data);
        this.formDataSave = Object.assign(JSON.parse(JSON.stringify(this.formDataSave)), data);

        this.formDataDef = Object.assign(formData, setdefval);
        // 获取表单的默认值

        const key = Object.keys(data)[0];
        if (key && key.split(':').length > 1) {
          delete this.formData[current.item.field];
          delete this.formDataSave[current.item.field];
        } else {
          delete this.formData[current.item.inputname];
          delete this.formDataSave[current.item.inputname];
        }

        // let v1.4外键 及number
        if (!this.formData[current.item.field] && Version() === '1.4') {
          if (current.item.props.number === true || current.item.props.fkdisplay === 'pop' || current.item.props.fkdisplay === 'drp') {
            this.formData[current.item.field] = 0;
          } else if (current.item.props.fkdisplay) {
            this.formData[current.item.field] = '';
          } else {
            this.formData[current.item.field] = '';
          }
          this.formDataSave[current.item.field] = this.formData[current.item.field];
        }

        // 获取需要校验的表单
        // 开启
        if (Version() === '1.3') {
          if (this.formData[current.item.field] === '' || this.formData[current.item.field] === undefined || this.formData[current.item.field] === '[]') {
            this.formData[current.item.field] = '';
            this.formDataSave[current.item.field] = null;
          }
        }
        // 开启
        // 注释

        // const labelForm = Object.keys(this.formData).reduce((arr, itemLabel) => {
        //   if (!this.labelForm[itemLabel]) {
        //     arr[itemLabel] = '';
        //   }
        //   return arr;
        // }, {});
        this.labelForm = Object.assign(this.labelForm, label);
        this.labelFormSave = Object.assign(this.labelFormSave, label);
        // 必填校验
        clearTimeout(this.setVerifyMessageTimeII);
        this.setVerifyMessageTimeII = setTimeout(() => { 
          this.VerificationFormItem = [];
          this.setVerifyMessageForm();
        }, 100);
        if (this.conditiontype !== 'list' && this.$route.params.itemId && this.$route.params.itemId.toLocaleUpperCase() === 'NEW' && this.labelForm[current.item.field] === '') {
          // eslint-disable-next-line no-shadow
          delete this.formDataSave[current.item.field];
          delete this.formDataDef[current.item.field];
          delete this.labelFormSave[current.item.field];
          // eslint-disable-next-line no-shadow
          const data = {
            key: current.item.field,
            itemName: this.tableGetName
          };
          this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/seleteAddData`, data);
        } else if (this.conditiontype !== 'list' && this.$route.params.itemId && this.$route.params.itemId.toLocaleUpperCase() !== 'NEW' && this.labelForm[current.item.field] === this.r3Form[current.item.field]) {
          let form = this.formData[current.item.field];
          let defaultFormData = this.defaultFormData[current.item.field];
          try {
            if (typeof form === 'object') {
              form = JSON.String(form);
            } else {
              form = form.toString();
            }
          } catch (error) {
            form = this.formData[current.item.field] || '';
          }
          try {
            if (typeof defaultFormData === 'object') {
              defaultFormData = JSON.String(defaultFormData);
            } else {
              defaultFormData = defaultFormData.toString();
            }
          } catch (error) {
            defaultFormData = this.defaultFormData[current.item.field] || '';
          }
          if (form === defaultFormData) {
            delete this.formDataSave[current.item.field];
            delete this.formDataDef[current.item.field];
            delete this.labelFormSave[current.item.field];
            // eslint-disable-next-line no-shadow
            const data = {
              key: current.item.field,
              itemName: this.tableGetName
            };
            this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/seleteAddData`, data);
          }
        } 

        this.$emit('formChange', this.formDataSave, this.formDataDef, this.labelFormSave);
        this.getStateData();

        
        // 注释
      },
      VerifyMessageForm(value, type) {
        // 获取需要校验的表单
        // 初始化form 校验
        this.mountChecked = true;
        this.VerificationForm = [];
        this.VerificationFormItem[type] = [];
        this.VerificationFormItem[type].push(...value);
        clearTimeout(this.setVerifyMessageTime);
        this.setVerifyMessageTime = setTimeout(() => {
          this.VerificationForm = this.VerificationFormItem.reduce((arr, item) => arr.concat(item), []);
          const formData = Object.assign(JSON.parse(JSON.stringify(this.defaultFormData)), this.formData);
          this.VerificationForm.forEach((item) => {
            Object.keys(formData).forEach((option) => {
              if (item.key === option.split(':')[0]) {
                item.value = formData[option];
              }
            });
          });
          
          const data = this.setVerifiy();     
          if (data.messageTip.length > 0) {
            this.verifyMessItem = data;
          }
          this.$emit('VerifyMessage', data);
        }, 100);
      },
      setVerifyMessageForm() {
        //  校验赋值
        this.VerificationForm = [];
        Object.keys(this.$refs).forEach((item) => {
          if (this.$refs[item] && this.$refs[item][0]) {
            this.$refs[item][0].VerificationFormInt('change');
          } else if (this.$refs[item]) {
            this.$refs[item].VerificationFormInt('change');
          }
        });
      },
      getValue(defaultSetValue) {
        const defaultSetValueData = Object.keys(JSON.parse(JSON.stringify(defaultSetValue))).reduce((arr, option) => {
          if (defaultSetValue[option]) {
            if (Array.isArray(defaultSetValue[option])) {
              if (defaultSetValue[option][0]) {
                if (defaultSetValue[option][0].ID) {
                  arr[option] = defaultSetValue[option][0].ID;
                  if (defaultSetValue[option].length > 1) {
                    arr[option] = defaultSetValue[option].reduce((curry, item) => {
                      curry.push(item.ID);
                      return curry;
                    }, []);
                  }
                } else {
                  arr[option] = defaultSetValue[option][0];
                }
              }
            } else {
              arr[option] = defaultSetValue[option];
            }
            // this.labelForm = Object.assign(,);
          }
          return arr;
        }, {});
        return defaultSetValueData;
      },
      partentVue() {
        // 返回当前实例
        return this;
      },
      mountdataForm(value, formItem) {
        // 获取表单默认值
        setTimeout(() => {
          this.mountChecked = true;
        }, 200);
        this.refcolvaData = {};
        this.defaultFormData = Object.assign(JSON.parse(JSON.stringify(this.defaultFormData)), value);
        // 去除 空字符串
        const defaultFormData = Object.keys(this.defaultFormData).reduce((arr, option) => {
          if (this.defaultFormData[option] !== '' && this.defaultFormData[option] !== undefined && this.defaultFormData[option] !== null) {
            if (this.defaultFormData[option][0] && Object.hasOwnProperty.call(this.defaultFormData[option][0], 'ID')) {
              if (this.defaultFormData[option].length > 0) {
                const arrValue = this.defaultFormData[option].reduce((all, optionII) => {
                  all.push(optionII.ID);
                  return all;
                }, []);
                if (arrValue.length > 1) {
                  arr[option] = arrValue.join(',');
                } else {
                  arr[option] = arrValue.join('');
                }
              }
            } else {
              arr[option] = this.defaultFormData[option];
            }
          }
          return arr;
        }, {});

        // 1.3 外键传参 label
        // if (Version() === '1.3') {
        //   const formItemArry = formItem.reduce((arr, item) => {
        //     console.log(item.item.value);
        //     return arr;
        //   }, {});
        //   console.log(this.defaultFormData, formItemArry, '66');
        // }

        // 1.3 版本的 label 
        this.r3Form = Object.assign(this.r3Form, formItem);


        // 、、 外部change的值(复制修改过后的值 去修改 页面)
        const defaultSetValue = Object.keys(JSON.parse(JSON.stringify(this.defaultSetValue))).reduce((arr, option) => {
          if (this.defaultSetValue[option]) {
            if (Array.isArray(this.defaultSetValue[option])) {
              if (this.defaultSetValue[option][0]) {
                if (this.defaultSetValue[option][0].ID || this.defaultSetValue[option][0].ID === '') {
                  arr[option] = this.defaultSetValue[option][0].ID;
                  if (this.defaultSetValue[option].length > 1) {
                    arr[option] = this.defaultSetValue[option].reduce((curry, item) => {
                      curry.push(item.ID);
                      return curry;
                    }, []);
                  }
                } else {
                  arr[option] = this.defaultSetValue[option];
                }
              }
            } else {
              arr[option] = this.defaultSetValue[option];
            }
            // this.labelForm = Object.assign(,);
          }
          return arr;
        }, {});
        // if (this.moduleFormType === 'horizontal') {
        //   // 开启
        // }
        // this.formData = Object.assign({}, defaultSetValue);

        this.getStateData();
        this.defaultFormData = Object.assign(defaultFormData, defaultSetValue);
        // 默认值
        
        this.copyInt = false;
        clearTimeout(this.InitializationFormTime);
        this.InitializationFormTime = setTimeout(() => {
          setTimeout(() => {
            if (this.defaultData.copy) {
              DispatchEvent('globalNoticeCopy', {
                detail: {
                  hideCopyLoading: true
                }
              }); 
            } else {
              if (this.tableGetName !== '') {
                return false;
              }
              DispatchEvent(`${this[MODULE_COMPONENT_NAME]}globaVerifyMessageClosed`, {
                detail: {
                  hideLoadingForButton: true
                }
              });
            }
          }, 50);
        }, 100);
        

        this.$emit('InitializationForm', defaultFormData, this.defaultSetValue, this.r3Form);
        // 注释
      },
      getObjId(current) {
        if (current.refcolval && current.refcolval.srccol === '$OBJID$') {
          if (this.$route.params.itemId.toLocaleUpperCase() === 'NEW') {
            return false;
          }
          return this.$route.params.itemId;
        } 
        return false;
      },
      reduceForm(array, current, index) {
        // 重新配置 表单的 事件及属性
        if (current.fkobj && current.fkobj.serviceId) {
          current.serviceId = current.fkobj.serviceId;
        }
        const obj = {};
        obj.row = current.row ? current.row : 1;
        obj.col = current.col ? current.col : 1;
         if (current.display === 'clob') {
            obj.col = this.defaultColumnCol;
          }
        obj.component = ItemComponent;
        obj.show = true;
        obj.item = {
          type: this.checkDisplay(current),
          title: current.name,
          field: current.colname,
          value: this.defaultValue(current),
          inputname: current.inputname,
          props: { ...current, showCol: obj.show },
          event: {
            keydown: (event) => {
              // 输入框的keydown event, $this
              if (event.keyCode === 13) {
                // enter回车查询
                if (this.type === 'PanelForm') {
                  // 是否是面板
                  //  组建是否获取光标
                  if (current.display === 'textarea') {
                    return;
                  }
                  this.focusItem(index, current, array);
                }
                this.searchClickData();
              }
            },
            clear: ($this, item) => {
              this.getStateData(); // 获取主表信息
              // let Fitem = [];
              // if (current.formIndex !== 'inpubobj') {
              //   Fitem = this.$refs[`FormComponent_${current.formIndex}`][0]
              //     .newFormItemLists;
              // } else {
              //   Fitem = this.$refs.FormComponent_0.newFormItemLists;
              // }
              // if (item) {
              //   Fitem[index].item.props.defaultSelected = item.props.defaultSelected;
              //   Fitem[index].item.value = undefined;
              // }

              // if (
              //   items.props.fkdisplay === 'drp'
              //   || items.props.fkdisplay === 'mrp'
              // ) {
              //   this.newFormItemLists[index].props.defaultSelected = items.props.defaultSelected;
              // }
              // if (
              //   items.props.fkdisplay === 'mop'
              //   || items.props.fkdisplay === 'pop'
              // ) {
              //   this.newFormItemLists[index].props.Selected = items.props.Selected;
              // }
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
              fkHttpRequest().fkDelMultiQuery({
                searchObject: {
                  tableid: item.props.fkobj.reftableid,
                  modelname: key
                },
                serviceId: current.serviceId,
                success: () => {
                  fkHttpRequest().fkGetMultiQuery({
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
              fkHttpRequest().fkGetMultiQuery({
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
              Fitem[index].item.props.totalRowCount = 0;
              let searchObject = {};
              const check = this.getLinkData(current);

              if (check[1]) {
                const query = current.refcolval.expre === 'equal' ? `=${check[1]}` : '';
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
                // 多值查询判断
                const refArray = this.getRefcolvalArray(current);
                if (refArray[0]) {
                  searchObject.fixedcolumns = refArray[1];
                }
              }
              // 权限查询
              searchObject = this.setSeachObject(searchObject, current);
              let serviceId = null;
              if (current) {
                if (current.serviceId) {
                  serviceId = current.serviceId;
                } else if (current.fkobj && current.fkobj.serviceId) {
                  serviceId = current.fkobj.serviceId;
                }
              }
              
              fkHttpRequest().fkQueryList({
                searchObject,
                serviceId,
                success: (res) => {
                  this.freshDropDownSelectFilterData(res, index, current);
                }
              });
              

              return false;
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
                    if (item.value && item.value[0] && (item.value[0].ID === '' || item.value[0].ID === undefined)) {
                      Fitem[index].item.props.defaultSelected = [{
                        label: '',
                        ID: ''
                      }];
                      Fitem[index].item.value = [{
                        label: '',
                        ID: ''
                      }];
                      this.formData[Fitem[index].item.field] = '';
                    }
                  } else {
                    Fitem[index].item.props.defaultSelected = [
                      {
                        label: '',
                        ID: ''
                      }
                    ];
                    Fitem[index].item.value = [];
                    this.formData[Fitem[index].item.field] = '';
                  }
                }
              }
            },
            inputValueChange: (value) => {
              this.focusChange(value, current, index);
            },
            pageChange: (currentPage, $this) => {
              // 外键的分页查询
              const LinkageForm = this.$store.state[this[MODULE_COMPONENT_NAME]].LinkageForm || {};
              // eslint-disable-next-line no-unused-vars
              let LinkageFormInput = '';
              if (current.refcolval && current.refcolval.srccol) {
                LinkageFormInput = LinkageForm[current.refcolval.srccol];
              }
              const check = this.getLinkData(current);
              let searchObject = {};

              if (check[1]) {
                const query = current.refcolval.expre === 'equal' ? `=${check[1]}` : '';
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
                // 多值查询判断
                const refArray = this.getRefcolvalArray(current);
                if (refArray[0]) {
                  searchObject.fixedcolumns = refArray[1];
                }
              }              
              // 权限查询
              searchObject = this.setSeachObject(searchObject, current);
              fkHttpRequest().fkQueryList({
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
        // ignoreDisableWhenEdit 去除不可编辑的状态 
       
       
        // 获取全部
        const srccol = obj.item.validate.refcolval && obj.item.validate.refcolval.srccol;
        const prmsrccol = current.refcolprem && current.refcolprem.srccol;
        let _valuedata = current.valuedata || current.defval || '';
        if (this.defaultSetValue && this.defaultSetValue[current.colname]) {
          _valuedata = this.defaultSetValue[current.colname];
          this.formItem[`${this.tableGetName}${obj.item.field}`] = this.defaultSetValue[current.colname];
        } else {
          this.formItem[`${this.tableGetName}${obj.item.field}`] = _valuedata;
        }
        if (current.display === 'select' || current.display === 'check') {
          if (!Array.isArray(current.combobox)) {
            return false;
          }
          const optionIndex = current.combobox.findIndex(x => x.limitval === _valuedata);
          if (optionIndex !== -1) {
            _valuedata = current.combobox[optionIndex].limitdesc;
          } else {
            _valuedata = '';
          }
        }
        this.formItem[`${this.tableGetName}${obj.item.field}`] = _valuedata;
   
        this.LinkageForm.push({
          key: `${this.tableGetName}${obj.item.field}`,
          name: obj.item.title,
          show: obj.show,
          srccol: `${this.tableGetName}${srccol || prmsrccol}`,
          maintable: (obj.item.validate.refcolval && obj.item.validate.refcolval.maintable) || false,
          tableName: this.tableGetName
        }); 
        //  表单 存值
        this.defaultDataInt[obj.item.field] = obj.item.value;
        
        //  隐藏字段的映射
        const hideSrccol = obj.item.validate.hidecolumn && obj.item.validate.hidecolumn.refcolumn;
        if (hideSrccol) {
          if (!this.hidecolumnForm[hideSrccol]) {
            this.hidecolumnForm[hideSrccol] = [obj.item.field];
          } else {
            this.hidecolumnForm[hideSrccol].push(obj.item.field);
          }
        }
        // 静态属性
        if (obj.item.props.webconf && obj.item.props.webconf.setAttributes) {
          obj.item.props.webconf.setAttributes.field.forEach((option) => {
            if (!this.setAttsetProps[option.refcolumn]) {
              this.setAttsetProps[option.refcolumn] = [obj.item.field];
            } else if (this.setAttsetProps[option.refcolumn].findIndex(x => x === obj.item.field) === -1) {
              this.setAttsetProps[option.refcolumn].push(obj.item.field);
            }
          });
        }
        //  display none
        if (current.display === 'none') {
          obj.show = false;
        }

        
        return obj;
      },
      setSeachObject(obj, current) {
        // precolnameslist 权限
        obj = JSON.parse(JSON.stringify(obj));
        if (current.precolnameslist) {
          if (Object.hasOwnProperty.call(obj, 'ak')) {
            obj.fixedcolumns.precolnameslist = JSON.parse(JSON.stringify(current.precolnameslist));
          } else {
            obj.precolnameslist = JSON.parse(JSON.stringify(current.precolnameslist));
          }
          return obj;
        }
        if (current.refcolprem) {
          if (!obj.fixedcolumns) {
            obj.fixedcolumns = {};
          }
          const val = this.formData[current.refcolprem.srccol];
          if (Object.hasOwnProperty.call(obj, 'ak')) {
            obj.fixedcolumns.precolnameslist = [JSON.parse(JSON.stringify(current.refcolprem))];
            obj.fixedcolumns.precolnameslist[0].refcolval = val;
          } else {
            obj.precolnameslist = [JSON.parse(JSON.stringify(current.refcolprem))];
            obj.precolnameslist[0].refcolval = val;
          }
        }
        return JSON.parse(JSON.stringify(obj));
      },
      getsetAttsetProps() {
        return this.setAttsetProps;
      },
      getRefcolvalArray(current) {
        // 获取 多值查询
        // eslint-disable-next-line no-unused-vars
        if (current.webconf && current.webconf.refcolvalArray) {
          const refVal = current.webconf.refcolvalArray.reduce((arr, item) => {
            if (item.maintable) {
              this.getStateData(); // 获取主表信息
              const refcolval = this.refcolvalAll[item.srccol]
                ? this.refcolvalAll[item.srccol]
                : '';
              arr[item.fixcolumn] = `=${refcolval || ''}`;
              arr[item.fixcolumn] = `${refcolval ? `=${refcolval}` : ''}`;
            } else {
              const data = Object.assign(JSON.parse(JSON.stringify(this.defaultFormData)), this.formData);
              arr[item.fixcolumn] = `${data[item.srccol] ? `=${data[item.srccol]}` : ''}`;
            }
            return arr;
          }, {});
          return [true, refVal];
        }
        return [false];
      },
      getLinkData(current) {
        // 获取表信息
        if (current.refcolprem) {
          // 数据权限功能
          const premValue = this.formData[current.refcolprem.srccol];
          const premLinkageForm = this.$store.state[this[MODULE_COMPONENT_NAME]].LinkageForm || {};
          const premLinkageFormInput = premLinkageForm[this.tableGetName + current.refcolprem.srccol];
          if (premLinkageFormInput && premLinkageFormInput.item.show && !premValue) {
            this.$Message.info(`请先选择${premLinkageFormInput.item.name}`);
          }
          if (!premValue) {
            let pretableName = document.querySelector('.compositeAllform');
            if (this.tableGetName) {  
              pretableName = document.querySelector(`.${premLinkageFormInput.item.tableName}`);
            }
            if (pretableName && pretableName.querySelector(`#${current.refcolprem.srccol}`)) {
              setTimeout(() => {
                pretableName.querySelector(`#${current.refcolprem.srccol}`).querySelector('input').focus();
              }, 100);
            }
            return [false];
          }
        }

        if (Object.hasOwnProperty.call(current, 'refcolval')) {
          let refcolval = {};
          const checkGetObjId = this.getObjId(current);
          // 判断 来源值是否是 objid，新增不需要
          if (checkGetObjId !== false) {
            return [true, checkGetObjId];  
          }

          if (current.refcolval.maintable) {
            this.getStateData(); // 获取主表信息
            refcolval = this.refcolvalAll[current.refcolval.srccol]
              ? this.refcolvalAll[current.refcolval.srccol]
              : '';
            // if (this.refcolvalAll[current.refcolval.srccol] === undefined) {
            //   const data = Object.assign(this.defaultFormData, this.formData);
            //   refcolval = data[current.refcolval.srccol]; 
            // }
          } else {
            const data = Object.assign(JSON.parse(JSON.stringify(this.defaultFormData)), this.formData);
            refcolval = data[current.refcolval.srccol]; 
          }
          const LinkageForm = this.$store.state[this[MODULE_COMPONENT_NAME]].LinkageForm || {};

          let LinkageFormInput = {};
          if (this.tableGetName && !current.refcolval.maintable) {
            LinkageFormInput = LinkageForm[this.tableGetName + current.refcolval.srccol];
          } else {
            LinkageFormInput = LinkageForm[current.refcolval.srccol];
          }
          if (!refcolval) {
            if (LinkageFormInput && LinkageFormInput.item.show) {
              if (current.refcolval.maintable) {
                this.$Message.info(`请先选择主表${LinkageFormInput.item.name}`);
              } else {
                this.$Message.info(`请先选择${LinkageFormInput.item.name}`);
              }

              if (this.tableGetName) {
                if (current.refcolval.maintable) {
                  let LinkageFormfocus = document.querySelector('.compositeAllform');
                  if (LinkageFormfocus && LinkageFormfocus.querySelector(`#${current.refcolval.srccol}`)) {
                    LinkageFormfocus = LinkageFormfocus.querySelector(`#${current.refcolval.srccol}`).querySelector('input');
                    setTimeout(() => {
                      LinkageFormfocus.focus();
                    }, 100);
                  }
                  return [false];
                }
                const tableName = document.querySelector(`.${LinkageFormInput.item.tableName}`);
                if (tableName.querySelector(`#${current.refcolval.srccol}`)) {
                  setTimeout(() => {
                    tableName.querySelector(`#${current.refcolval.srccol}`).querySelector('input').focus();
                  }, 100);
                }
                return [false];
              } 
              const LinkageFormfocus = document.querySelector(`#${LinkageFormInput.item.key}`).querySelector('input');
              if (LinkageFormfocus) {
                setTimeout(() => {
                  LinkageFormfocus.focus();
                }, 100);
                return [false];
              }
            }
          } else {
            return [true, refcolval];  
          }
          return [true];
        }
        return [true];
      },
      hidecolumn(current) {
        //  隐藏判断

        if (Object.hasOwnProperty.call(current.item.validate, 'hidecolumn')) {
          const refcolumn = current.item.validate.hidecolumn.refcolumn;
          const refval = current.item.validate.hidecolumn.refval;
          const data = this.getValue(this.defaultDataInt);
          // 添加查询条件
         
          const refvalArr = refval.split(',');
          if (data[refcolumn]) {
            data[refcolumn] = data[refcolumn].toString();
          }
          let val = data[refcolumn];

          if (current.item.validate.hidecolumn.match && current.item.validate.hidecolumn.match === 'label') {
            val = this.formItem[refcolumn];
          }
          let expression = '=';
          if (current.item.validate.hidecolumn.expression) {
            expression = current.item.validate.hidecolumn.expression;
          }
          if (expression !== '=') {
            if (val) {
              return eval(val.replace(/\s+/g, '') + expression + refval.replace(/\s+/g, ''));
            }
          }
         

          const arrIndex = refvalArr.findIndex(x => x.toString() === val);
          return arrIndex !== -1;
        }
       
        
        return true;
      },
      focusChange(value, current, index) {
        // 外键的模糊搜索
        if (!value) {
          return false;
        }
        let sendData = {};
        const check = this.getLinkData(current);
        if (!check[0] && !check[1]) {
          document.activeElement.value = '';
        }
        if (check[1]) {
          const query = current.refcolval.expre === 'equal' ? `=${check[1]}` : '';
          sendData = {
            ak: value,
            colid: current.colid,
            fixedcolumns: {
              whereKeys: {
                [current.refcolval.fixcolumn]: query
              }
            }
          };
        } else if (check[0]) {
          sendData = {
            ak: value,
            colid: current.colid,
            fixedcolumns: {}
          }; 
          // 多值查询判断
          const refArray = this.getRefcolvalArray(current);
          if (refArray[0]) {
            sendData.fixedcolumns = {
              whereKeys: refArray[1]
            }; 
          }
        }
        if (!check[0]) {
          return false;
        }
        sendData = this.setSeachObject(sendData, current);
        fkHttpRequest().fkFuzzyquerybyak({
          searchObject: sendData,
          serviceId: current.serviceId,
          success: (res, time) => {
            if (this.timeChange < time) {
              this.timeChange = time;
              this.freshDropDownSelectFilterAutoData(res, index, current);
            }
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
        const checkIsReadonly = this.isReadonly(item);
        

        if (checkIsReadonly === true && item.fkdisplay) {
          //  不可编辑 变成 input
          if (
            item.fkdisplay === 'drp'
            || item.fkdisplay === 'mop'
            || item.fkdisplay === 'pop'
            || item.fkdisplay === 'mrp'
          ) {
            // str = 'input';
            // return str;
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
          const casefkdisplay = item.fkdisplay || (item.fkobj && item.fkobj.fkdisplay);
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
      setLabel(key, value, item) {
        return false;
        // const valueLabel = {};
        // if (item.display === 'checkbox') {
        //   const optionIndex = item.combobox.findIndex(x => x.limitval === value);
        //   if (optionIndex !== -1) {
        //     valueLabel[item.colname] = item.combobox[optionIndex].limitdesc;
        //   } else {
        //     console.log(item.combobox);
        //     valueLabel[item.colname] = '';
        //   }
        // } else if (item.display === 'select') {
        //   if (value !== undefined) {
        //     if (Array.isArray(value)) {
        //       value = value[0];
        //     }
        //     const optionIndex = item.combobox.findIndex(x => x.value === value);
        //     if (optionIndex !== -1) {
        //       valueLabel[item.colname] = item.combobox[optionIndex].limitdesc;
        //     } else {
        //       valueLabel[item.colname] = '';
        //     }
        //   } else {
        //     valueLabel[item.colname] = '';
        //   }
        // }
        // if (item.fkdisplay === 'pop' || item.fkdisplay === 'mop' || item.fkdisplay === 'drp') {
        //   if (Array.isArray(value)) {
        //     valueLabel[item.colname] = value[0].Label;
        //   }
        // } else if (item.fkdisplay === 'mrp') {
        //   if (Array.isArray(value)) {
        //     valueLabel[item.colname] = value.reduce((arr, option, i) => {
        //       arr.push(option.Label);
        //       return arr;
        //     }, [])
        //       .join(',');
        //   }
        // } else {
        //   valueLabel[item.colname] = value;
        // }
        // this.labelForm = Object.assign(this.labelForm, valueLabel);
      },
      defaultValue(item) {
        // 组件的默认值  
        // const checkIsReadonly = this.isReadonly(item);

        // if (item.readonly === true && item.fkdisplay) {
        //   //  不可编辑 变成 input

        //   return item.valuedata || item.defval || '';
        // }
        // 设置表单的默认值
        if (this.defaultSetValue[item.colname] !== undefined) {
          if (this.defaultData.copy) {
            this.setLabel(item.colname, this.defaultSetValue[item.colname], item);
          }
        }
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
          // eslint-disable-next-line no-unused-vars
          let check = '';
          
          if (Array.isArray(item.combobox)) {
            item.combobox.forEach((option) => {
              if (option.limitdis) {
                check = option.limitval;
              } else {
                check = option.limitval;
              }
            });
          }
          return item.valuedata || item.defval;
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
              if (typeof this.defaultSetValue[item.colname] === 'string') {
                arr = JSON.parse(this.defaultSetValue[item.colname]);
              } else {
                arr = this.defaultSetValue[item.colname];
              }
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
        if (this.readonly && item.fkdisplay === 'mop') {
          if (item.valuedata && /total/.test(item.valuedata)) {
            const valuedata = JSON.parse(item.valuedata);
            return `已经选中${valuedata.total}条` || '';
          }
          return this.defaultSetValue[item.colname] || item.valuedata || item.default || item.defval || '';
        }
        const fkdisplayValue = this.defaultSetValue[item.colname] && this.defaultSetValue[item.colname][0];
        if (item.fkobj) {
          item.fkdisplay = item.fkobj.fkdisplay;
        }

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
            const valuedata = ((item.valuedata || item.defval) && (item.valuedata || item.defval).split(',')) || [];
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

        console.log('tag');
        return this.defaultSetValue[item.colname] || item.valuedata || item.defval || item.default || '';
      // wewe
      },
      propsType(current, item) {
        // 表单 props
        const obj = item;
        // 判断是显示隐藏 是否 需要webcon
        const checkIsReadonly = this.isReadonly(current);
        item.props.maxlength = item.props.length;
        // item.props.disabled = item.props.readonly;
        item.props.comment = item.props.comment;
        item.props.tableGetName = this.tableGetName;


        if (checkIsReadonly) {
          item.props.placeholder = '';
        }
        // 去除请输入 字段
        if (item.props.readonly) {
          item.props.placeholder = '';
        }


        // 前端自定义标记
        if (current.webconf && this.conditiontype !== 'list') {
          const webconf = current.webconf;
          // 读写规则
          if (webconf.display === 'enumerate') {
            item.type = 'EnumerableInput';
          } else if (webconf.display === 'jsonmaker') {
            // 拓展属性
            item.type = 'ExtentionInput';
            item.props.supportType = '';
          }
        }
        // 上传文件插件
        if (item.props.display === 'doc') {
          item.type = 'docfile';
          const valuedata = this.defaultValue(current) || [];
          const filesLength = Number(current.webconf && current.webconf.filesLength);
          const filesize = Number(current.webconf && 1024 * 1024 * Number(current.webconf.filesize));
          let readonly = current.readonly;
          readonly = checkIsReadonly;
          item.props.itemdata = {
            colname: current.colname,
            readonly,
            filesLength,
            filesize,
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
          if (Array.isArray(item.props.combobox)) {
            item.props.combobox.forEach((option) => {
              if (option.limitdis) {
                item.props.trueValue = option.limitval;
                item.props.trueLabel = option.limitdesc;
              } else {
                item.props.falseValue = option.limitval;
                item.props.falseLabel = option.limitdesc;
              }
            });
          }
          item.props.disabled = checkIsReadonly;
          return current.valuedata || current.defval || item.props.falseValue;
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
            // 只能输入 正整数 
            let string = '';

            if (current.webconf && current.webconf.ispositive) {
              string = `^\\d{0,${current.length}}(\\\.[0-9]{0,${
                current.scale
              }})?$`;
            } else {
              string = `^(-|\\+)?\\d{0,${current.length - current.scale}}(\\\.[0-9]{0,${
                current.scale
              }})?$`;
            }
            
            const typeRegExp = new RegExp(string);
            if (current.scale > 0) {
              item.props.regx = typeRegExp;
            } else if (current.webconf && current.webconf.ispositive) {
              item.props.regx = regExp.Number;
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
          item.props.disabled = checkIsReadonly;
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
          item.props.disabled = checkIsReadonly;
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
            item.props.disabled = checkIsReadonly;

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
        if (current.display === 'text' || current.display === 'xml' || current.display === 'OBJ_FK') {
          const casefkdisplay = current.fkdisplay || (current.fkobj && current.fkobj.fkdisplay);
          switch (casefkdisplay) {
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
            item.props.isShowPopTip = () => that.getLinkData(currentThat)[0];
            break;
          case 'mrp':
            item.props.single = false;
            item.props.data = {};
            item.props.fk_type = 'mrp';
            item.props.enterType = true;
            item.props.AutoData = [];
            item.props.defaultSelected = this.defaultValue(current);
            // eslint-disable-next-line no-case-declarations
            const selft = this;
            // eslint-disable-next-line no-case-declarations
            const mrpcurrentThat = current;
            item.props.isShowPopTip = () => selft.getLinkData(mrpcurrentThat)[0];

            break;
          case 'pop':
            item.props.type = 'AttachFilter';
            item.props.optionTip = false;
            item.props.enterType = true;
            item.props.show = false;
            // 失去光标是否保存
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
            // if (!item.props.readonly && !this.objreadonly) {
            //   item.props.Selected.push(this.defaultValue(current)[0]);
            //   item.value = this.defaultValue(current)[0].Label;
            // } else {
            //   item.value = this.defaultValue(current)[0].Label;
            // }
            item.props.Selected.push(this.defaultValue(current)[0]);
            item.value = this.defaultValue(current)[0].Label;
            if (!item.props.readonly && !this.objreadonly) {
              item.props.disabled = false;
            } else {
              item.props.disabled = true;
            }

            break;
          case 'mop':
            item.props.type = 'AttachFilter';
            // 是否回车
            item.props.enterType = true;
            item.props.show = true;
            // 模糊查询数据
            item.props.AutoData = [];
            //  弹窗的配置
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
            // 右边的气泡数据
            item.props.datalist = [];
            // 选中值
            item.props.Selected = [];
            // 过滤值
            item.props.filterDate = {};
            item.value = '';
            item.props.Selected.push(this.defaultValue(current)[0]);
            // if (!item.props.readonly && !this.objreadonly) {
            //   item.value = this.defaultValue(current)[1];
            //   item.props.Selected.push(this.defaultValue(current)[0]);
            // }
            if (!item.props.readonly && !this.objreadonly) {
              item.props.disabled = false;
            } else {
              item.props.disabled = true;
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
          // const imgSize = Number(current.webconf && 0.05 * 1024 * 1024);

          let readonly = current.readonly;
          readonly = checkIsReadonly;
          item.props.itemdata = {
            colname: current.colname,
            width: (current.col / this.defaultColumnCol) > 0.4 ? 200 : 140,
            height: 120,
            readonly,
            ImageSize,
            name: '上传',
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
        // if ((checkIsReadonly && item.props.fkdisplay)) {
        //   //  不可编辑 变成 input
        //   const refobjid = current.refobjid !== '-1' ? current.refobjid : '';
        //   if (
        //     item.props.fkdisplay === 'drp'
        //     || item.props.fkdisplay === 'mrp'
        //   ) {
        //     // item.props.type = 'text';
        //     // item.type = 'input';
        //     item.props.defaultSelected = [{
        //       ID: refobjid,
        //       Label: current.valuedata
        //     }];
           
        //     item.value = current.valuedata;
        //   }
        //   if (
        //     item.props.fkdisplay === 'mop'
        //     || item.props.fkdisplay === 'pop'
        //   ) {           
        //     item.props.Selected = [{
        //       ID: refobjid,
        //       Label: current.valuedata
        //     }];
        //     item.value = current.valuedata;
        //   }
        // }
        item.props.disabled = checkIsReadonly;
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
        item[index].item.props.pageSize = res.data.data.defaultrange;
        item[index].item.props.data = res.data.data;
        item[index].item.props.totalRowCount = res.data.data.totalRowCount;
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
        if (typeof item[index].item.value === 'string') {
          item[index].item.value = item[index].item.value.toUpperCase();
        }
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
          // if (Array.isArray(item.value) && item.fkdisplay) {
          //   if (item.value[0]) {
          //     if (item.value[0].ID === '' || item.value[0].ID === 0 || item.value[0].ID === '-1' || item.value[0].ID === null) {
          //       item.value = '';
          //     }
          //   } else if (item.value[0] === null || item.value[0] === '') {
          //     item.value = '';
          //   }
          // }

          // if (Array.isArray(item.value) && item.value[0] === null) {
          //   item.value = '';
          // }
          // if (item.value === 0 && item.type === 'select' && item.defval === null) {
          //   item.value = '';
          // }
          const labelForm = Object.assign(JSON.parse(JSON.stringify(this.r3Form)), this.labelForm);
          if (labelForm[item.key] === undefined || labelForm[item.key] === '' || labelForm[item.key] === null) {
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
            this.refcolvalAll = Object.assign(defaultMain, modifyMain);

            return this.refcolvalAll;
          }
          const modifyMain = JSON.parse(JSON.stringify((state.updateData[this.masterName].modify[this.masterName] || {})));
          const defaultMain = JSON.parse(JSON.stringify((state.updateData[this.masterName].default[this.masterName] || {})));
          this.refcolvalAll = Object.assign(defaultMain, modifyMain);
        } else {
          const addMain = JSON.parse(JSON.stringify((state.updateData[this.masterName].add[this.masterName] || {})));
          const modifyMain = JSON.parse(JSON.stringify((state.updateData[this.masterName].modify[this.masterName] || {})));
          const defaultMain = JSON.parse(JSON.stringify((state.updateData[this.masterName].default[this.masterName] || {})));
          if (this.tableGetName === '') {
            this.refcolvalAll = Object.assign(defaultMain, addMain, modifyMain, this.formData);
          } else {
            this.refcolvalAll = Object.assign(defaultMain, addMain, modifyMain);
          }
        }
        return this.refcolvalAll;
      },
      setResize() {
        if (this.$el) {
          this.setdefaultColumnCol();
        }
      },
      openLoading() { // 表单更新时重新加载loading
        if (!this.tableGetName) { // 子表不添加loading
          const currentTableName = this[MODULE_COMPONENT_NAME].split('.')[1];
          const dom = document.querySelector(`#${currentTableName}-loading`);
          if (!dom && this.from === 'singlePage') {
            // this.$route.params.tableName！==currentTableName说明调用刷新时，路由已切换到其它tab,此时不需要加loading
            if (this.$route.params.tableName === currentTableName) {
              this.$loading.show(this.tableName);
            }
          }
        }
      }
    },
    mounted() {
      this.Comparison();
      this.openLoading();
      setTimeout(() => {
        if (this.LinkageForm.length > 0 && this.LinkageForm[0]) {
          if (this.$store._mutations[`${this[MODULE_COMPONENT_NAME]}/updateLinkageForm`]) {
            const data = {
              formList: this.LinkageForm,
              formIndex: this.formIndex
            };
            this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateLinkageForm`, data);
          }  
        }
      }, 500);
      if (this.$el) {
        this.setdefaultColumnCol();
      }
      this.conditiontype = this.condition;

      window.addEventListener('resize', this.setResize);
      
      if (this.type === 'PanelForm') {
        return false;
      }
      return true;
    },
    created() {
      this.reorganizeForm();
      this.mountNumber = (Math.random() * 1000).toFixed(0);
      window.eventType = function eventType(name, docm, obj) {
        const event = document.createEvent('HTMLEvents');
        // initEvent接受3个参数：
        // 事件类型，是否冒泡，是否阻止浏览器的默认行为
        // 初始化新创建的 Event
        // 触发document上绑定的click事件
        event.initEvent(name, false, true);
        if (docm) {
          event.value = obj;
          docm.dispatchEvent(event);
        }
      };
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.setResize);
    },
    deactivated() {
      clearTimeout(this.setChangeTime);

      // if (this.$store._mutations && this.$store._mutations[`${this[MODULE_COMPONENT_NAME]}/updateLinkageForm`]) {
      //   if (this.moduleFormType !== 'horizontal' || !this.isreftabsForm) {
      //     this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateLinkageForm`, []);
      //   }
      // }
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
.Rburgeon-collapse-content-box .burgeon-collapse-content > .burgeon-collapse-content-box{
   padding-top: 8px!important;
}
.burgeon-collapse {
  margin-bottom: 10px;
}
</style>

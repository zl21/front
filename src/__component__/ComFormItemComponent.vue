/* eslint-disable no-console */
<template>
  <div>
    <div
      v-if="searchFoldnum === 0"
      class="FormItemComponent"
      :style="setWidth"
    >
      <div
        v-for="(item,index) in dataColRol"
        v-show="item.show !== false"
        :id="item.item.field"
        :key="index"
        class="FormItemComponent-item"
        :style="setDiv(item)"
      >
        <component
          :is="item.component"
          :ref="'component_'+index"
          :class="item.item.field"
          :index="index"
          :type="type"
          :web-conf-single="webConfSingle"
          :items="item.item"
          @inputChange="inputChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
  // import { setTimeout } from 'timers';
  import layoutAlgorithm from '../__utils__/layoutAlgorithm';
  import { Version, interlocks, MODULE_COMPONENT_NAME } from '../constants/global';


  const fkHttpRequest = () => require(`../__config__/actions/version_${Version()}/formHttpRequest/fkHttpRequest.js`);


  export default {
    name: 'FormItemComponent',
    computed: {
      // 计算属性的 getter
      dataColRol() {
        const list = layoutAlgorithm(this.defaultColumn, this.newFormItemLists);
        return Object.keys(list).reduce((temp, current) => {
          temp.push(list[current]);
          return temp;
        }, []);
      },
      // 计算属性的 后台传值
      formDataObject() {
        let obj = {};
        // 监听组件的 后台字段的值  默认值及数据联动
        obj = this.newFormItemLists.reduce((option, items) => {
          const value = items.item.props.refobjid
            ? items.item.props.refobjid
            : items.item.value;
          if (value === undefined) {
            return option;
          }
          // if (items.item.props.readonly) {
          // 外键 不可编辑
          //   if (items.item.props.refobjid !== '-1') {
          //     option[items.item.field] = items.item.props.refobjid
          //       ? items.item.props.refobjid
          //       : items.item.value;
          //     if (Array.isArray(items.item.value) && items.item.value[0]) {
          //       option[items.item.field] = items.item.value[0].ID;
          //     }
          //   } else {
          //     option[items.item.field] = items.item.value || '';
          //   }
          // } else {
          // }
          if (Array.isArray(items.item.value)) {
            if (
              items.item.value[0]
              && Object.hasOwnProperty.call(items.item.value[0], 'ID')
            ) {
              if (items.item.value[0].ID === '-1') {
                option[items.item.field] = '';
              } else {
                option[items.item.field] = items.item.value.reduce((arr, optionII) => {
                  arr.push(optionII.ID);
                  return arr;
                }, []);
                if (option[items.item.field].length > 1) {
                  option[items.item.field] = option[items.item.field].join(',');
                } else {
                  option[items.item.field] = option[items.item.field].join('');
                }
              }
            } else if (items.item.value[0]) {
              if (items.item.type === 'ImageUpload') {
                option[items.item.field] = JSON.stringify(items.item.value);
              } else if (items.item.type === 'docfile') {
                option[items.item.field] = JSON.stringify(items.item.value);
              } else {
                option[items.item.field] = items.item.value[0];
              }
            }
          } else if (items.item.value) {
            if (items.item.props.Selected && items.item.props.Selected[0] && items.item.props.Selected[0].ID) {
              if (items.item.props.Selected[0].ID === '-1') {
                option[items.item.field] = '';
              } else {
                option[items.item.field] = items.item.props.Selected[0].ID;
              }
            } else {
              option[items.item.field] = items.item.value || items.item.props.valuedata || items.item.props.defval; 
            }
          }

          if (items.item.props.number) {
            if (option[items.item.field]) {
              if (/-/.test(option[items.item.field])) {
                option[items.item.field] = Number(
                  option[items.item.field]
                    .replace(/^\s+|\s+$/g, '')
                    .replace(/-/g, '')
                );
              } else {
                option[items.item.field] = Number(option[items.item.field]);
              }
            }
          } else if (typeof option[items.item.field] === 'string') {
            option[items.item.field] = option[items.item.field].replace(
              /^\s+|\s+$/g,
              ''
            );
          }
          // 初始化隐藏字段clearWhenHidden 清除功能 
          if (items.item.props.webconf && items.item.props.webconf.clearWhenHidden) {
            if (items.show === false) {
              if (items.item.type === 'checkbox') {
                option[items.item.field] = items.item.props.falseValue;
              } else {
                option[items.item.field] = '';
              }
            }
          }
          return option;
        }, {});
        return obj;
      },
      // 计算属性的 div 的坐标起始点
      setDiv() {
        return item => ` grid-column:${item.x}/${item.col + item.x};grid-row:${
          item.y
        }/${item.y + item.row};`;
      },
      pathcheck() {
        return this.path;
      },
      // 计算属性的 div的排列格式
      setWidth() {
        // `this` 指向 vm 实例
        const columns = Number(this.defaultColumn) || 4;
        return `grid-template-columns: repeat(${columns},${100 / columns}%`;
      }
    },
    props: {
      webConfSingle: {// 当前子表webConf
        type: Object,
        default: () => ({})
      },
      defaultColumn: { // 默认列数
        type: Number,
        default: 4
      },
      formItemLists: { // 表单配置
        type: Array,
        default() {
          return [];
        }
      },
      searchFoldnum: { // 超出行数
        type: [Number, String],
        default() {
          return 0;
        }
      },
      formIndex: { // 表单位置
        type: Number,
        default() {
          return 0;
        }
      },
      type: { 
        type: String,
        default() {
          return '';
        }
      },
      mountdataForm: { // 表单初始化
        type: Function,
        default() {
          return function () {};
        }
      },
      isCopy: { // 是否复制
        type: Function,
        default() {
          return function () {};
        }
      },
      getsetAttsetProps: { // 获取静态值
        type: Function,
        default() {
          return function () {};
        }
      },
      verifymessageform: { // 校验
        type: Function,
        default() {
          return function () {};
        }
      },
      mappStatus: {
        type: Function,
        default() {
          return function () {};
        }
      },
      getStateData: {
        type: Function,
        default() {
          return function () {};
        }
      },
      isMainTable: {
        // 是否 主表
        type: Boolean,
        default() {
          return false;
        }
      },
      path: { // 是否有path
        type: String,
        default() {
          return '';
        }
      },
      isreftabs: { // 是否主子表
        type: Boolean,
        default() {
          return false;
        }
      }, // 是否存在子表
      childTableName: {
        type: String,
        default() {
          return '';
        }
      },
      condition: { // 是条件查询还是保存
        type: String,
        default() {
          return '';
        }
      },
      mountedType: { // 监听数据
        type: String,
        default() {
          return '';
        }
      },
      refcolvalData: { // 父级数据
        type: Object,
        default() {
          return {};
        }
      },
      moduleFormType: {
        type: String,
        default() {
          return '';
        }
      },
      setObjreadonly: {
        type: Boolean,
        default() {
          return false;
        }
      },
      partentVue: { // 返回父级实例
        type: Function,
        default() {
          return function () {};
        }
      }
    },
    inject: [MODULE_COMPONENT_NAME],
    data() {
      return {
        indexItem: -1,
        newFormItemLists: [], // 当前form list
        changeFormData: {}, // 当前form 被改动的key
        Mapping: {}, // 设置映射关系
        mapData: {}, // 全部联动关系
        formValueItem: {}, // 当前字段
        changeNumber: 0, // 更改次数
        checkMounted: false, // 是否初始化
        VerificationForm: [], // 需要校验的
        mountedTypeName: '',
        setAttsetProps: {},
        LinkageForm: [], // 所有form
        formDatadefObject: {}, // 获取form默认值
        oldformData: {}, // 老的change
        setHeight: 34,
        setVerficaTime: '', // 校验时间
        formLabels: {}, // 当前字段的label
        timerSet: '',
        fkHttpRequestTime: '',
        formRequestJson: { }, // 表单传参比较
        timerWatch: '', // 监听change 触发
        actived: false
      };
    },
    beforeDestroy() {
      window.removeEventListener(`${this.moduleComponentName}setProps`, this.setPropsListener);
    },
    deactivated() {
      // 清除时间
      clearTimeout(this.timerWatch);
    },
    mounted() {
      this.formValueItem = {};
      this.setAttsetProps = this.getsetAttsetProps();
      this.formRequestJson = {};
      this.VerificationForm = [];
      // 映射回调
      window.addEventListener(`${this.moduleComponentName}setProps`, this.setPropsListener);
      this.mappStatus(this.Mapping, this.mapData);
      setTimeout(() => {
        // 获取校验
        this.VerificationFormInt('mounted');
        // 获取 默认值
        this.mountdataFormInt();
      }, 500);

    // this.VerificationFormInt();
    },
    created() {
      this.newFormItemLists = this.formItemLists.concat([]);
    },
    watch: {
      mountedType() {
        // 监听刷新、切换

        this.formRequestJson = {};
        this.formValueItem = {};
        this.VerificationForm = [];
        this.setAttsetProps = this.getsetAttsetProps();
        setTimeout(() => {
          this.VerificationFormInt();
          this.mountdataFormInt();
        }, 500);
      },
      formDataObject: {
        handler(val, old) {
          // 页面的联动关系及计算逻辑的处理;

          this.oldformData = old;
          if (this.indexItem === -1) {
            return;
          }

          //   拦截默认值
          if (!this.actived) {
            // this.formInit();
            return;
          }
          clearTimeout(this.timerWatch);
          this.timerWatch = setTimeout(() => {
            const allValue = Object.assign(JSON.parse(JSON.stringify(val)), JSON.parse(JSON.stringify(this.refcolvalData)));
            val = Object.assign(allValue, this.formValueItem);
            this.computFormLinkage(val, old);
          }, 100);
        },
        deep: true
      },
      formItemLists: {
        handler() {
          // 监听页面配置的处理
          this.changeNumber = 0;
          // this.newFormItemLists = JSON.parse(JSON.stringify(this.formItemLists));
          this.newFormItemLists = this.formItemLists;
        },
        deep: true
      },
      VerificationForm() {
        // 监听校验的处理
        setTimeout(() => {
          //  传form 默认值
          if (this.verifymessageform) {
            // this.verifymessageform(this.VerificationForm, this.formIndex);
          }
        }, 0);
      }
    },
    methods: {
      setPropsListener(e) {
        if (e.value.type === 'change') {
          const checkItem = this.newFormItemLists.some((item) => {
            const index = e.value.current.findIndex(x => x === item.item.field);
            return index != -1;
          });
          if (checkItem) {
            this.formInit();
          }
        }
      },
      computFormLinkage(val, old) {
        // 页面计算关系
        this.newFormItemLists.map((items, i) => {
          const item = items.item;
          // 筛选字段
          if (item.props.webconf && item.props.webconf.filtercolval) {
            this.filtercolumn(item, i, val, old);
          }
          // 设置属性
          if (item.props.webconf && item.props.webconf.setAttributes) {
            if (!this.setObjreadonly) {
              this.setAttributes(item, i, val, old);
            }
          }

          //  扩展属性 来源字段
          if (item.props.webconf && item.props.webconf.targetField) {
            const jsonArr = this.setJson(item, val);

            item.props.supportType = jsonArr[item.props.webconf.targetField];
          }


          if (Object.hasOwnProperty.call(item.validate, 'dynamicforcompute')) {
            // 计算
            // if (old === undefined) {
            //   return false;
            // }
            // if (
            //   val[item.validate.dynamicforcompute.computecolumn]
            //   === old[item.validate.dynamicforcompute.computecolumn]
            // ) {
            //   this.dynamicforcompute(item, val, i, old);
            // } else {
            //   // this.formDataChange();
            // }
            // this.dynamicforcompute(item, val, i, old);
          } else if (Object.hasOwnProperty.call(item.validate, 'hidecolumn')) {
            //  联动隐藏
            return false;
            
            // const _refcolumn = item.validate.hidecolumn.refcolumn;

            // const _refval = item.validate.hidecolumn.refval === 'object' ? 'object' : item.validate.hidecolumn.refval;
            // if (val[_refcolumn] === undefined) {
            //   return false;
            // }
            // const refvalArr = _refval.split(',');
            // const arrIndex = refvalArr.findIndex(x => x.toString() === val[_refcolumn].toString());
            // const checkVal = arrIndex !== -1 ? 1 : 0;
            // const checkShow = items.show ? 1 : 0;

            // if (checkVal !== checkShow) {
            //   this.hidecolumn(item, i, val, old);
            // }
          } else if (Object.hasOwnProperty.call(item.validate, 'refcolval')) {
            // 来源字段
            // this.refcolval(item, val, i);
          }
          if (old === 'mounted') {
            this.setformUrl(item, val, items);
          }
          return items;
        });
      },
      setformUrl(item, val) {
        // 联动  来源数据后台查询
        if (item.props.webconf && item.props.webconf.formRequest) {
          const isCopyCheck = this.isCopy();
          if (this.actived && isCopyCheck) {
            return true;
          }

          // const setLabel = this.getLable(items);
          this.formRequest(item.field, val, item, item.props.webconf.formRequest);
        } else {
          // eslint-disable-next-line no-lonely-if
          if (item.props.webconf && item.props.webconf.formRequest) {
            this.formRequest(item.field, val, item, item.props.webconf.formRequest);
          }
        }
        return true;
      },
      inputget(formIndex, index, items) {
        // 获取input
        const elDiv = this.$refs[`component_${index}`][0]
          && this.$refs[`component_${index}`][0].$el;
        if (!elDiv) {
          return false;
        }
        let onfousInput = {};
        if (items.item.type === 'textarea') {
          onfousInput = elDiv.querySelector('textarea');
        } else {
          onfousInput = elDiv.querySelector('input');
        }
        return onfousInput;
      },  
      formInit() {
        // 表单初始化
        const val = this.getStateData();
        setTimeout(() => {
          if (this.actived === false) {
            this.computFormLinkage(val, 'mounted');
          } else {
            this.computFormLinkage(val);
          }
        }, 50);
      }, 
      setDynamicForcompute(data, current) {
        // 监听 计算
        if (current.item && Object.hasOwnProperty.call(current.item.validate, 'dynamicforcompute')) {
          setTimeout(() => {
            window.eventType(`${this[MODULE_COMPONENT_NAME]}Dynam`, window, {
              ...current.item.validate,
              data: Object.assign(JSON.parse(JSON.stringify(this.getStateData())), data)
            });
          }, 200);
        }
      },
      mountdataFormInt() {
        this.actived = false;
        setTimeout(() => {
          //  传form 默认值
          const Item = this.newFormItemLists.reduce((arr, item) => {
            this.setDynamicForcompute({}, item);
            const setLabel = this.getLable(item);
            arr = Object.assign(arr, setLabel);
            return arr;
          }, {}); 
          this.formInit();         
          this.mountdataForm(this.formDataObject, Item);
          setTimeout(() => {
            this.actived = true;
          }, 300);
        }, 100);
      },
      VerificationFormInt(type) {
        //  form 计算 校验
        clearTimeout(this.setVerficaTime);
        let check = false;
        this.setVerficaTime = setTimeout(() => {
          this.VerificationForm = [];
          this.newFormItemLists.forEach((item, index) => {
            if (item.item.required && item.show && !item.item.props.disabled) {
              check = true;
              this.verificationMap(this.formIndex, index, item, type);
            }
          });
          if (check === false) {
            this.verifymessageform([], this.formIndex, type);
          }
        }, 100);
      },
      verificationMap(formIndex, index, items, type) {
        // 获取校验的配置及节点
        const elDiv = this.$refs[`component_${index}`][0]
          && this.$refs[`component_${index}`][0].$el;
        if (!elDiv) {
          return false;
        }
        let onfousInput = {};
        if (items.item.type === 'textarea') {
          onfousInput = elDiv.querySelector('textarea');
        } else {
          onfousInput = elDiv.querySelector('input');
        }
        let valueData = this.formDataObject[items.item.field];       
        if (items.item.props.fkdisplay === 'drp' 
          || items.item.props.fkdisplay === 'mrp'
          || items.item.props.fkdisplay === 'mop'
          || items.item.props.fkdisplay === 'pop') {
          if (!valueData || valueData === '0') {
            // 外键 校验
            valueData = '';
          }
        }
        this.VerificationForm.push({
          index,
          eq: formIndex,
          type: items.item.props.display,
          value: valueData,
          key: items.item.field,
          label: items.item.title,
          defval: items.item.value,
          fkdisplay: items.item.props.fkdisplay,
          onfousInput
        });
        
        this.verifymessageform(this.VerificationForm, this.formIndex, type);
        return true;
      },
      setMapping(data) {
        //  获取映射关系
        const temp = Object.keys(data).reduce((a, c) => {
          const f = (key) => {
            if (!data[key]) {
              return [];
            }
            return [data[key]].concat(f(data[key]));
          };
          a[c] = f(c);
          return a;
        }, {});
        return temp;
      },
      formDataChange() {
      // console.log(this.changeFormData,'formDataChange');
      // this.$emit('formDataChange', this.dataProcessing(), this.newFormItemLists[this.indexItem]);
      },
      dataProcessing(current, type) {
        // change 后台传值
        
        let obj = {};
        if (current.item.field) {
          // 当存在field时直接生成对象
          if (current.item.type === 'DropDownSelectFilter') {
            // 若为外键则要处理输入还是选中
            if (current.item.value instanceof Array) {
              // 结果为数组则为选中项
              delete obj[current.item.inputname];
              // console.log(current.item.value);
              obj[current.item.field] = current.item.value
                .reduce((sum, temp) => {
                  sum.push(temp.ID);
                  return sum;
                }, [])
                .join(',');
              if (Version() === '1.3') {
                //  id 转number
                if (current.item.value.length < 2) {
                  // eslint-disable-next-line no-restricted-globals
                  if (isNaN(Number(obj[current.item.field])) || obj[current.item.field] === '' || obj[current.item.field] === null) {
                    obj[current.item.field] = obj[current.item.field];
                  } else {
                    obj[current.item.field] = Number(obj[current.item.field]);
                  }
                } 
              }
            } else if (this.condition !== '') {
              // 模糊查询
              delete obj[current.item.field];
              obj[current.item.inputname] = current.item.value;
            } else {
              delete obj[current.item.inputname];
              obj[current.item.field] = current.item.value;          
            }
          //  else {
          //   // 否则为输入项

          // }
          } else if (
            current.item.value
            && JSON.stringify(current.item.value).indexOf('bSelect-all') >= 0
          ) {
            // 当为全选时，将对应的字段改为undefined
            obj[current.item.field] = undefined;
          } else if (current.item.type === 'AttachFilter') {
            // 若为外键则要处理输入还是选中
            if (current.item.props.Selected[0] && this.condition === '') {
              obj[current.item.field] = current.item.props.Selected && current.item.props.Selected[0].ID || '';
              if (Version() === '1.3') {
                //  id 转number
                obj[current.item.field] = obj[current.item.field];
              }
            } else if (this.condition) {
              // 模糊查询
              delete obj[current.item.field];
              obj[current.item.inputname] = current.item.value;
            } else {
              obj[current.item.field] = '';
            }

          // 单对象界面 不需要
          // else {
          //   obj[current.item.inputname] = current.item.value;
          // }
          } else if (current.item.type === 'checkbox') {
            obj[current.item.field] = current.item.value;
          } else if (current.item.value) {
            if (current.item.props.number) {
              if (current.item.type === 'input') {
                obj[current.item.field] = current.item.value;
              } else if (typeof current.item.value === 'number' || typeof current.item.value === 'object') {
                obj[current.item.field] = current.item.value;
              } else {
                const value = current.item.value
                  ? current.item.value.replace(/^\s+|\s+$/g, '').replace(/-/g, '')
                  : '';

                obj[current.item.field] = Number(value);
              }
            } else if (typeof current.item.value === 'string') {
              obj[current.item.field] = current.item.value
                ? current.item.value.replace(/^\s+|\s+$/g, '')
                : current.item.value;
            } else {
              obj[current.item.field] = current.item.value;
            }
          } else {
            obj[current.item.field] = current.item.value;
          }
        } else if (current.item.value) {
          // 处理多个select合并
          obj = Object.assign(
            obj,
            current.item.value.reduce((objData, item) => {
              if (item !== 'bSelect-all') {
                const key = item.split('|')[0];
                const value = item.split('|')[1];
                if (!objData[key]) {
                  objData[key] = [];
                }
                objData[key].push(value);
              }
              return objData;
            }, {})
          );
        }

        this.changeFormData = obj;
        if (current.item.props.number) {
          this.changeFormData = Number(obj[Object.keys(obj)[0]]);
        } else {
          this.changeFormData = obj;
        }
        const valueItem = {};
        if (Object.keys(obj)[0]) {
          if (current.item.type === 'AttachFilter') {
            valueItem[Object.keys(obj)[0]] = current.item.props.Selected;
          } else if (current.item.type === 'DropDownSelectFilter' && !current.item.value) {
            valueItem[Object.keys(obj)[0]] = [{
              Label: '',
              ID: ''
            }];
          } else if (current.item.props.isuppercase) {
            if (typeof current.item.value === 'string') {
              if (valueItem[Object.keys(obj)[0]]) {
                valueItem[Object.keys(obj)[0]] = current.item.value.toUpperCase();
              } else {
                valueItem[Object.keys(obj)[0]] = current.item.value.toUpperCase();
              }
            } else {
              valueItem[Object.keys(obj)[0]] = current.item.value;
            }
          } else {
            valueItem[Object.keys(obj)[0]] = current.item.value;
          }
        }
        // data
        if (current.item.type === 'DatePicker' && current.item.props.rangecolumn) {
          const start = current.item.props.rangecolumn.upperlimit;
          const end = current.item.props.rangecolumn.lowerlimit;
          delete obj[current.item.field];
          obj[start.colname] = current.item.value[0];
          obj[end.colname] = current.item.value[1];
        }
        // checkbox


        // 向父组件抛出整个数据对象以及当前修改的字段
        const setLabel = this.getLable(current);
        this.$emit('formDataChange', obj, valueItem, current, setLabel, this);
        
        // 兼容结束
        if (type !== 'none') {
          this.formValueItem = Object.assign(JSON.parse(JSON.stringify(this.formValueItem)), JSON.parse(JSON.stringify(obj)));
        }
        //  change 值 走后台接口赋值
        if (current.item.field) {
          if (this.setAttsetProps && this.setAttsetProps[current.item.field]) {
            clearTimeout(this.timerSet);
            this.timerSet = setTimeout(() => {
              window.eventType(`${this.moduleComponentName}setProps`, window, { current: this.setAttsetProps[current.item.field], type: 'change' });
            }, 100);
          }
        }

        if (current.item.props.webconf && current.item.props.webconf.formRequest) {
          if (setLabel[current.item.field] === '' && (obj[current.item.field] === undefined || obj[current.item.field] === '')) {
            if (current.item.value) {
              return false;
            }
            this.formRequest(current.item.field, obj, current.item, current.item.props.webconf.formRequest);
          } else if (obj[current.item.field] && setLabel[current.item.field]) {
            this.formRequest(current.item.field, obj, current.item, current.item.props.webconf.formRequest);
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (current.item.props.webconf && current.item.props.webconf.formRequest) {
            this.formRequest(current.item.field, obj, current.item, current.item.props.webconf.formRequest);
          }
        }
      },
      getLable(current) {
        // R3 label 属性
        const valueLabel = {};
        // if (!this.formDataObject[current.item.field]) {
        //   // 判断是否有值
        //   if (this.formValueItem[current.item.field] !== undefined && this.formValueItem[current.item.field] !== null) {
        //     valueLabel[current.item.field] = this.formValueItem[current.item.field];
        //   } else {
        //     valueLabel[current.item.field] = '';
        //   }
        //   if (current.item.props.fkdisplay === 'mop' && current.item.props.Selected[0] && current.item.props.Selected[0].ID) {
        //     valueLabel[current.item.field] = current.item.props.Selected[0].ID;
        //   }
        //   return valueLabel;
        // }
        if (current.item.type === 'AttachFilter' && current.item.props.Selected[0]) {
          if (current.item.props.Selected[0]) {
            valueLabel[current.item.field] = current.item.props.Selected[0].Label;
          } else {
            valueLabel[current.item.field] = '';
          }
        } else if (current.item.type === 'DropDownSelectFilter') {
          if (current.item.value instanceof Array) {
            // 结果为数组则为选中项
            // console.log(current.item.value);
            valueLabel[current.item.field] = current.item.value
              .reduce((sum, temp) => {
                sum.push(temp.Label);
                return sum;
              }, [])
              .join(',');
          } else {
            valueLabel[current.item.field] = '';
          }
        } else if (current.item.type === 'checkbox') {
          const optionIndex = current.item.props.combobox.findIndex(x => x.limitval === current.item.value);
          if (optionIndex !== -1) {
            valueLabel[current.item.field] = current.item.props.combobox[optionIndex].limitdesc;
          } else {
            valueLabel[current.item.field] = current.item.props.falseLabel;
          }
        } else if (current.item.type === 'select') {
          if (current.item.value !== undefined) {
            let value = current.item.value;
            if (Array.isArray(current.item.value)) {
              value = current.item.value[0];
            }
            const optionIndex = current.item.options.findIndex(x => x.value === value);
            if (optionIndex !== -1) {
              valueLabel[current.item.field] = current.item.options[optionIndex].label;
            } else {
              valueLabel[current.item.field] = '';
            }
          } else {
            valueLabel[current.item.field] = '';
          }
        } else if (current.item.type === 'ImageUpload' || current.item.type === 'docfile') {
          try {
            if (Array.isArray(current.item.value)) {
              valueLabel[current.item.field] = current.item.value.length === 0 ? '' : current.item.value;
            } else {
              const value = JSON.parse(current.item.value);
              if (value.length === 0) {
                valueLabel[current.item.field] = '';
              } else {
                valueLabel[current.item.field] = current.item.value;
              }
            }
          } catch (err) {
            valueLabel[current.item.field] = current.item.value;
          }
        } else {
          valueLabel[current.item.field] = current.item.value;
        }
        if (current.item.props.isuppercase && typeof valueLabel[current.item.field] === 'string') {
          valueLabel[current.item.field] = valueLabel[current.item.field].toLocaleUpperCase();
        }
        return valueLabel;
      },
      formRequest(key, obj, current, conf, index) {
        // 走后台接口
        // const jsonArr = this.setJson(current, this.formDataObject);  通过setJson获取整个表单数据会有问题，改成获取当前panel数据
        const jsonArr = JSON.parse(JSON.stringify(this.formDataObject));
        // 拦截是否相同
        // if (this.formDataObject[key] === obj[key]) {
        //   return false;
        // }
        
        const refcolumn = conf.refcolumn.split(',');
        const ASSIGN = refcolumn.reduce((arr, item) => {
          arr[item] = typeof jsonArr[item] === 'string' ? jsonArr[item].trim() : jsonArr[item] || '';
          return arr;
        }, {});
        //          ID: obj[current.field] || obj[current.inputname],
        if (JSON.stringify(ASSIGN) === JSON.stringify(this.formRequestJson)) {
          return false;
        }
        this.formRequestJson = JSON.parse(JSON.stringify(ASSIGN));
        const data = {
          ASSIGN
        };
        if (!conf.url) {
          return false;
        }
        //   拦截默认值
        const isCopyCheck = this.isCopy();
        if (!this.actived && !isCopyCheck) {
          return true;
        }
        fkHttpRequest().equalformRequest({
          url: conf.url,
          searchObject: data,
          success: (res) => {
            // code =-2 目标字段未查询到，不清空来源字段值， [] 清空来源字段值
            if (res.code && res.code === -1) {
              current.value = [{
                ID: null,
                Label: null
              }];
              if (document.getElementsByClassName(`${current.field}`)[0].getElementsByClassName('ark-icon-ios-close-circle').length > 0) {
                document.getElementsByClassName(`${current.field}`)[0].getElementsByClassName('ark-icon-ios-close-circle')[0].click();
                this.formRequest(key, obj, current, conf);
              }

              return;
            }
            const tableName = this.isMainTable ? '' : this.childTableName;
            if (res && res.length < 1 && res.code !== -2) {
              current.value = [{
                ID: null,
                Label: null
              }];
              if (document.getElementsByClassName(`${current.field}`)[0].getElementsByClassName('ark-icon-ios-close-circle').length > 0) {
                document.getElementsByClassName(`${current.field}`)[0].getElementsByClassName('ark-icon-ios-close-circle')[0].click();
                this.formRequest(key, obj, current, conf);
              }
            } else {
              window.eventType(`${this.moduleComponentName}setProps`, window, {
                type: 'equal', key, list: res, tableName 
              });
            }
          }
        });
        return true;
      },
      resetForm() {
        // 重置表单
        const arr = JSON.parse(JSON.stringify(this.formItemLists));
        arr.map((temp, index) => {
          temp.component = this.formItemLists[index].component;
          return temp;
        });
        this.newFormItemLists = arr;
        this.indexItem = -1;
      },
      inputChange(value, items, index) {
        this.indexItem = index;
        this.newFormItemLists[index].item.value = value; 
        this.newFormItemLists = this.newFormItemLists.concat([]);
        this.dataProcessing(this.newFormItemLists[index], index);
        return true;
      },
      refcolval() {
        // if (interlocks() === true) {
        //   const srccol = items.validate.refcolval.srccol;
          
        //   const jsonArr = Object.assign(JSON.parse(JSON.stringify(json)), JSON.parse(JSON.stringify(this.getStateData())));
        //   if (!jsonArr[srccol]) {
        //     if (items.type === 'DropDownSelectFilter') {
        //       // console.log(items.props.defaultSelected, index, items);
        //       // this.newFormItemLists[index].item.value = '';
        //       // this.newFormItemLists[index].item.props.defaultSelected = [];
        //     } else {
        //       // this.newFormItemLists[index].item.value = '';
        //     }
        //   }
        // }
      },
      dynamicforcompute(data) {
        // 被计算 属性 加减乘除

        const str = data.dynamicforcompute.refcolumns.reduce(
          (temp, current) => {
            temp = temp.replace(new RegExp(current, 'g'), ((Number(data.data[current]) * 1000) / 1000));
            return temp;
          },
          data.dynamicforcompute.express
        );
        const _index = this.newFormItemLists.findIndex(
          option => option.item.field === data.dynamicforcompute.computecolumn
        );
        
        if (this.newFormItemLists[_index]) {
          let DyNvalue = '';
          if (!eval(str) && eval(str) !== 0) {
            DyNvalue = '';
          } else if (eval(str) === 0) {
            DyNvalue = 0;
          } else {
            const scale = this.newFormItemLists[_index].item.props.scale;
            DyNvalue = eval(str).toFixed(scale);
          }
          if (Number(this.newFormItemLists[_index].item.value) !== Number(DyNvalue)) {
            setTimeout(() => {
              this.newFormItemLists[_index].item.value = DyNvalue;
              this.dataProcessing(this.newFormItemLists[_index], 'none');
            }, 10);
          }
        }
      },
      setJson(item, val) {
        if (item.props.tableGetName) {
          // 子表明细联动
          // eslint-disable-next-line no-const-assign
          // return JSON.parse(JSON.stringify(this.formDataObject)); // 此逻辑是获取单个panel表单的数据，更换成获取整个的表单的数据
          return JSON.parse(JSON.stringify(this.refcolvalData));
        } 
        // 获取当前表单数据及主表字段
        // eslint-disable-next-line no-const-assign
        return Object.assign(JSON.parse(JSON.stringify(val)), JSON.parse(JSON.stringify(this.getStateData('item'))));
      },
      setAttributes(item, formindex, val, type) {
        //  设置属性
        const field = item.props.webconf.setAttributes.field;
        // 获取值
        const jsonArr = this.setJson(item, val);


        if (!Array.isArray(field)) {
          return false;
        }
        const checkout = field.every((option) => {
          let optionValue = jsonArr[option.refcolumn];
          if (optionValue === undefined) {
            optionValue = '';
          }
          if (typeof optionValue !== 'string') {
            if (optionValue === null) {
              optionValue = '';
            }
            optionValue = optionValue.toString();
            optionValue = optionValue.replace(/^\s+|\s+$/g, '');
          }
          if (typeof option.refval === 'string') {
            option.refval = option.refval.replace(/^\s+|\s+$/g, '').replace(/-/g, '');
          } else {
            option.refval = option.refval.toString();
          }

          const refval = option.refval.split(',');

          const refIndex = refval.findIndex(x => x.toString() === optionValue);
          return refIndex !== -1;
        });
        item.props.required = item.required || false;
        const props = JSON.parse(JSON.stringify(item.props));
        const checkoutProps = Object.keys(item.props.webconf.setAttributes.props).every(setItem => String(item.props.webconf.setAttributes.props[setItem]) === String(props[setItem]));
        
        if (!item.oldProps) {
          item.oldProps = Object.keys(item.props.webconf.setAttributes.props).reduce((arr, i) => {
            arr[i] = props[i] || false;
            return arr;
          }, {});
          if (item.props.regx) {
            item.oldProps.regx = item.props.regx;
          }
          // eslint-disable-next-line no-prototype-builtins
          if (!Object.hasOwnProperty('readonly', item.oldProps)) {
            item.oldProps.readonly = props.readonly;
            item.oldProps.disabled = props.readonly;
          }

          if (item.required === undefined) {
            item.oldProps._required = false;
          } else {
            item.oldProps._required = item.required;
          }
        }
                                
        if (checkout && !checkoutProps) {
          // if (item.props.webconf.setAttributes.props.value === '') {
          //   item.value = '';
          // }
          if (item.props.webconf.setAttributes.props.hasOwnProperty('disabled') || item.props.webconf.setAttributes.props.hasOwnProperty('readonly')) {
            item.props.webconf.setAttributes.props.disabled = item.props.webconf.setAttributes.props.hasOwnProperty('disabled') ? item.props.webconf.setAttributes.props.disabled : item.props.webconf.setAttributes.props.readonly;
            item.props.webconf.setAttributes.props.disabled = item.props.webconf.setAttributes.props.hasOwnProperty('readonly') ? item.props.webconf.setAttributes.props.readonly : item.props.webconf.setAttributes.props.disabled;
          }
          
          item.props = Object.assign(props, item.props.webconf.setAttributes.props);
          if (item.oldProps.regx) {
            item.props.regx = item.oldProps.regx;
          }
          if (item.props.webconf.setAttributes.props.required) {
            item.required = true;
          } else if (item.props.webconf.setAttributes.props.required === false) {
            item.required = false;
          }
          window.eventType(`${this.moduleComponentName}setProps`, window, item);
        } else if (checkout !== true && checkoutProps) {
          item.required = item.oldProps._required;
          const itemProps = JSON.parse(JSON.stringify(item.props));
          item.props = Object.assign(itemProps, item.oldProps);
          if (item.props.display === 'doc' || item.props.display === 'image') {
            item.props.itemdata.disabled = item.oldProps.disabled;
            item.props.itemdata.readonly = item.oldProps.readonly;
          }
          window.eventType(`${this.moduleComponentName}setProps`, window, item);

          // this.newFormItemLists[formindex].item.props.disabled = item.oldProps.disabled;
          // this.newFormItemLists[formindex].item.props.readonly = item.oldProps.disabled;
          // this.newFormItemLists[formindex].item.props.required = item.oldProps._required;
          // if (item.oldProps.regx) {
          //   this.newFormItemLists[formindex].item.props.regx = item.oldProps.regx;
          // }
        } 
        const that = this;
        if (type === 'mounted') {
          setTimeout(() => {
            that.VerificationFormInt('mounted');
          }, 100);
        } 
        return true;
      },
      filtercolumn(item, formindex, val, type) {
        // 过滤筛选
        const jsonArr = this.setJson(item, val);
        const filterValue = jsonArr[item.props.webconf.filtercolval.col];
        if (!filterValue) {
          return false;
        }

        let itemValue = item.value;
        if (Array.isArray(itemValue)) {
          itemValue = itemValue.join('');
        }
        if (item.type === 'select') {
          if (!item.olderOptions) {
            item.olderOptions = item.options;
          }
          if (!Array.isArray(item.props.webconf.filtercolval.map[filterValue])) {
            return false;
          }
          const checkout = item.props.webconf.filtercolval.map[filterValue].findIndex(x => x === itemValue);
          const optionsArr = item.olderOptions.reduce((arr, option) => {
            const index = item.props.webconf.filtercolval.map[filterValue].findIndex(x => x === option.value);
            if (index !== -1) {
              arr.push(option);
            }
            return arr;
          }, []);
          item.options = optionsArr.concat([]);
          // this.dataProcessing(this.newFormItemLists[formindex], formindex);
          if (checkout !== -1) { 
            return false;
          }
          if (this.newFormItemLists[formindex] && checkout === -1) {
            this.newFormItemLists[formindex].item.value = '';
            if (type === 'mounted') {
              this.VerificationFormInt('mounted');
            }   
          }
          // input.innerText = '';
        }
        return true;
      },
      hidecolumn(items, index, json, type) {
        // 隐藏
        // 获取值
        const labelForm = this.partentVue().labelForm;
        const jsonArr = JSON.parse(JSON.stringify(json));
        const refcolumn = items.validate.hidecolumn.refcolumn;
        const refval = items.validate.hidecolumn.refval;
        // 是否显示 隐藏字段
        // this.newFormItemLists[index].show = false;
        // this.newFormItemLists = this.newFormItemLists.map((option) => {
        // });

        let value = jsonArr[refcolumn];
        if (value !== undefined) {
          value = value.toString();
        } else {
          value = '';
        }
        if (items.validate.hidecolumn.match && items.validate.hidecolumn.match === 'label') {
          value = labelForm[refcolumn];
        }
        const refvalArr = refval.split(',');
        const refIndex = refvalArr.findIndex(x => x.toString() === value);

        let expression = '=';
        if (items.validate.hidecolumn.expression) {
          expression = items.validate.hidecolumn.expression;
        }
        if (expression !== '=') {
          // eslint-disable-next-line use-isnan
          if (parseFloat(value) === 0) {
            value = 0;
          // eslint-disable-next-line use-isnan
          } else if (value === '') {
            value = undefined;
          }

          if (items.validate.hidecolumn.ishide) {
            this.newFormItemLists[index].show = !eval(Number(value) + expression + refval);
          } else {
            this.newFormItemLists[index].show = eval(Number(value) + expression + refval);
          }
          this.newFormItemLists[index].item.props.showCol = this.newFormItemLists[index].show;
        } else if (refIndex !== -1) {
          if (items.validate.hidecolumn.ishide) {
            this.newFormItemLists[index].show = false;
            this.newFormItemLists[index].item.props.showCol = false;
          } else {
            this.newFormItemLists[index].show = true;
            this.newFormItemLists[index].item.props.showCol = true;
          }
          // 添加小组件的字段配置
        } else if (items.validate.hidecolumn.ishide) {
          this.newFormItemLists[index].show = true;
          this.newFormItemLists[index].item.props.showCol = true;
        } else {
          this.newFormItemLists[index].show = false;
          this.newFormItemLists[index].item.props.showCol = false;
        }


        if (this.$store._mutations[`${this[MODULE_COMPONENT_NAME]}/updateLinkageForm`]) {
          if (this.$store._mutations[`${this[MODULE_COMPONENT_NAME]}/updateLinkageForm`]) {
            const data = {
              formList: [
                { 
                  key: items.field,
                  name: items.title,
                  show: this.newFormItemLists[index].show,
                  srccol: items.validate.refcolval && items.validate.refcolval.srccol,
                  tableName: this.isMainTable ? '' : this.childTableName
                }
              ],
              formIndex: ''
            };
            this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateLinkageForm`, data);
          }  
        }
        if (!items.props.showCol && items.props.webconf && items.props.webconf.clearWhenHidden) {
          //   清除页面 联动的值
          if (items.type === 'checkbox') {
            // 添加checkbox 的判断
            this.newFormItemLists[index].item.value = items.props.falseValue;
          } else {
            this.newFormItemLists[index].item.value = '';
          } 
          this.newFormItemLists[index].item.props.defaultSelected = [];
          this.dataProcessing(this.newFormItemLists[index], index);
        }

        if (type === 'mounted') {
          this.VerificationFormInt('mounted');
        }  
      },
      deepClone(target) {
        // 定义一个变量
        let result;
        // 如果当前需要深拷贝的是一个对象的话
        if (typeof target === 'object') {
          // 如果是一个数组的话
          if (Array.isArray(target)) {
            result = []; // 将result赋值为一个数组，并且执行遍历
            for (const i in target) {
              // 递归克隆数组中的每一项
              result.push(this.deepClone(target[i]));
            }
            // 判断如果当前的值是null的话；直接赋值为null
          } else if (target === null) {
            result = null;
            // 判断如果当前的值是一个RegExp对象的话，直接赋值    
          } else if (target.constructor === RegExp) {
            result = target;
          } else {
            // 否则是普通对象，直接for in循环，递归赋值对象的所有值
            result = {};
            for (const i in target) {
              result[i] = this.deepClone(target[i]);
            }
          }
          // 如果不是对象的话，就是基本数据类型，那么直接赋值
        } else {
          result = target;
        }
        // 返回最终结果
        return result;
      }
    }
  };
</script>

<style lang="less">
.FormItemComponent > div {
  /*border:1px solid #fff;*/
  box-sizing: border-box;
}
.itemComponent .ark-date-picker {
  width: 100%;
}
.FormItemComponent {
  display: grid;
  grid-template-columns: repeat(4, 25%);
}
</style>

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
          :index="index"
          :type="type"
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
          if (list[current].item.type === 'Wangeditor') {
            list[current].col = this.defaultColumn;
          }
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
          if (items.item.props.readonly) {
            // 外键 不可编辑
            option[items.item.field] = items.item.props.refobjid
              ? items.item.props.refobjid
              : items.item.value;
          } else {
            if (Array.isArray(items.item.value)) {
              if (
                items.item.value[0]
                && Object.hasOwnProperty.call(items.item.value[0], 'ID')
              ) {
                option[items.item.field] = items.item.value[0].ID;
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
                option[items.item.field] = items.item.props.Selected[0].ID;
              } else {
                option[items.item.field] = items.item.props.defval || items.item.props.valuedata || items.item.value; 
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
          }
          // 初始化隐藏字段clearWhenHidden 清除功能 
          if (items.item.props.webconf && items.item.props.webconf.clearWhenHidden) {
            if (items.show === false) {
              option[items.item.field] = '';
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
      defaultColumn: {
        type: Number,
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
      formIndex: {
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
      mountdataForm: {
        type: Function,
        default() {
          return '';
        }
      },
      getsetAttsetProps: {
        type: Function,
        default() {
          return function () {};
        }
      },
      verifymessageform: {
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
      path: {
        type: String,
        default() {
          return '';
        }
      },
      isreftabs: {
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
      condition: {
        type: String,
        default() {
          return '';
        }
      },
      mountedType: {
        type: String,
        default() {
          return '';
        }
      },
      refcolvalData: {
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
        timerSet: '',
        actived: false
      };
    },
    mounted() {
      this.setAttsetProps = this.getsetAttsetProps();
      // 映射回调
      window.addEventListener(`${MODULE_COMPONENT_NAME}setProps`, (e) => {
        if (e.value.type === 'change') {
          const checkItem = this.newFormItemLists.some((item) => {
            const index = e.value.current.findIndex(x => x === item.item.field);
            return index != -1;
          });
          if (checkItem) {
            this.formInit();
          }
        }
      });
      this.mappStatus(this.Mapping, this.mapData);
      setTimeout(() => {
        // 获取校验
        this.VerificationFormInt();
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
        setTimeout(() => {
          this.VerificationFormInt();
          this.mountdataFormInt();
        }, 500);
      },
      formDataObject: {
        handler(val, old) {
          // 页面的联动关系及计算逻辑的处理
          this.oldformData = old;
          if (this.indexItem === -1) {
            return;
          }
          //   拦截默认值
          if (!this.actived) {
            return;
          }
          const allValue = Object.assign(JSON.parse(JSON.stringify(val)), JSON.parse(JSON.stringify(this.refcolvalData)));
          val = Object.assign(allValue, this.formValueItem);
         
          this.computFormLinkage(val, old);
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
            this.verifymessageform(this.VerificationForm, this.formIndex);
          }
        }, 0);
      }
    },
    methods: {
      computFormLinkage(val, old) {
        // 页面计算关系
        this.newFormItemLists.map((items, i) => {
          const item = items.item;
          // 筛选字段
          if (item.props.webconf && item.props.webconf.filtercolval) {
            this.filtercolumn(item, i, val);
          }
          // 设置属性
          if (item.props.webconf && item.props.webconf.setAttributes) {
            this.setAttributes(item, i, val);
          }


          //  扩展属性 来源字段
          if (item.props.webconf && item.props.webconf.targetField) {
            item.props.supportType = val[item.props.webconf.targetField];
          }
           

          if (Object.hasOwnProperty.call(item.validate, 'dynamicforcompute')) {
            // 计算

            if (
              val[item.validate.dynamicforcompute.computecolumn]
              === old[item.validate.dynamicforcompute.computecolumn]
            ) {
              this.dynamicforcompute(item, val, i);
            } else {
              // this.formDataChange();
            }
          } else if (Object.hasOwnProperty.call(item.validate, 'hidecolumn')) {
            //  联动隐藏
            
            const _refcolumn = item.validate.hidecolumn.refcolumn;

            const _refval = item.validate.hidecolumn.refval === 'object' ? 'object' : item.validate.hidecolumn.refval;
            if (val[_refcolumn] === undefined) {
              return false;
            }
            const refvalArr = _refval.split(',');
            const arrIndex = refvalArr.findIndex(x => x.toString() === val[_refcolumn].toString());
            const checkVal = arrIndex !== -1 ? 1 : 0;
            const checkShow = items.show ? 1 : 0;
            if (checkVal !== checkShow) {
              this.hidecolumn(item, i, val);
            }
          } else if (Object.hasOwnProperty.call(item.validate, 'refcolval')) {
            // 来源字段
            this.refcolval(item, val, i);
          }
          return items;
        });
      },
      inputget(formIndex, index, items) {
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
        const val = this.getStateData();
        this.computFormLinkage(val);
      }, 
      mountdataFormInt() {
        this.actived = false;
        setTimeout(() => {
          //  传form 默认值
          const Item = this.newFormItemLists.reduce((arr, item) => {
            const setLabel = this.getLable(item);
            arr = Object.assign(arr, setLabel);
            return arr;
          }, {});          
          this.mountdataForm(this.formDataObject, Item);
          this.formInit();
          setTimeout(() => {
            this.actived = true;
          }, 300);
        }, 100);
      },
      VerificationFormInt() {
        //  form 计算 校验
        this.VerificationForm = [];
        this.newFormItemLists.forEach((item, index) => {
          if (item.item.required && item.show && !item.item.props.disabled) {
            this.verificationMap(this.formIndex, index, item);
          }
        });
      },
      verificationMap(formIndex, index, items) {
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
        const valueData = this.formDataObject[items.item.field];
        this.VerificationForm.push({
          index,
          eq: formIndex,
          type: items.item.props.display,
          value: valueData,
          key: items.item.field,
          label: items.item.title,
          fkdisplay: items.item.props.fkdisplay,
          onfousInput
        });
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
      dataProcessing(current) {
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
                  obj[current.item.field] = Number(obj[current.item.field]);
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
                obj[current.item.field] = Number(obj[current.item.field]);
              }
            } else if (this.condition) {
              // 模糊查询
              delete obj[current.item.field];
              obj[current.item.inputname] = current.item.value;
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
            console.log(current.item.value);
            valueItem[Object.keys(obj)[0]] = [{
              Label: '',
              ID: ''
            }];
          } else if (current.item.props.isuppercase) {
            if (typeof current.item.value === 'string') {
              if (valueItem[Object.keys(obj)[0]]) {
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
        
        this.formValueItem = Object.assign(this.formValueItem, obj);
        // 兼容结束

        // 向父组件抛出整个数据对象以及当前修改的字段
        const setLabel = this.getLable(current);

        this.$emit('formDataChange', obj, valueItem, current, setLabel);
        //  change 值 走后台接口赋值
        if (current.item.field) {
          if (this.setAttsetProps && this.setAttsetProps[current.item.field]) {
            clearTimeout(this.timerSet);
            this.timerSet = setTimeout(() => {
              window.eventType(`${MODULE_COMPONENT_NAME}setProps`, window, { current: this.setAttsetProps[current.item.field], type: 'change' });
            }, 100);
          }
        }

      
        if (current.item.props.webconf && current.item.props.webconf.formRequest) {
          if (obj[current.item.field] || obj[current.item.field] === '') {
            if (current.item.props.fkdisplay && current.item.value[0]) {
              if (Number(current.item.value[0].ID) !== Number(obj[current.item.field]) && current.item.value[0].ID !== '') {
                return false;
              }
              if (this.oldformData[current.item.field] === obj[current.item.field]) {
                return false;
              }
              this.formRequest(current.item.field, obj, current.item, current.item.props.webconf.formRequest);
            } else {
              this.formRequest(current.item.field, obj, current.item, current.item.props.webconf.formRequest);
            }
          } else {
            this.formRequest(current.item.field, obj, current.item, current.item.props.webconf.formRequest);
          }
        }
      },
      getLable(current) {
        // R3 label 属性
        const valueLabel = {};
        if (!this.formDataObject[current.item.field]) {
          // 判断是否有值
          return false;
        }
        if (current.item.type === 'AttachFilter' && current.item.props.Selected[0]) {
          valueLabel[current.item.field] = current.item.props.Selected[0].Label;
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
          }
        } else if (current.item.type === 'select') {
          if (current.item.value) {
            const optionIndex = current.item.options.findIndex(x => x.value === current.item.value);
            if (optionIndex !== -1) {
              valueLabel[current.item.field] = current.item.props.combobox[optionIndex].limitdesc;
            }
          }
        } else {
          valueLabel[current.item.field] = current.item.value;
        }
        return valueLabel;
      },
      formRequest(key, obj, current, conf) {
        // 走后台接口
        const jsonArr = Object.assign(JSON.parse(JSON.stringify(this.formDataObject)), JSON.parse(JSON.stringify(this.getStateData())));
        // 拦截是否相同
        // if (this.formDataObject[key] === obj[key]) {
        //   return false;
        // }
        const refcolumn = conf.refcolumn.split(',');
        const ASSIGN = refcolumn.reduce((arr, item) => {
          arr[item] = jsonArr[item] || '';
          return arr;
        }, {});
        //          ID: obj[current.field] || obj[current.inputname],
        const data = {
          ASSIGN
        };
        if (!conf.url) {
          return false;
        }
        //   拦截默认值
        if (!this.actived) {
          return true;
        }
        fkHttpRequest().equalformRequest({
          url: conf.url,
          searchObject: data,
          success: (res) => {
            window.eventType(`${MODULE_COMPONENT_NAME}setProps`, window, { type: 'equal', key, list: res });
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
      refcolval(items, json) {
        if (interlocks() === true) {
          const srccol = items.validate.refcolval.srccol;
          
          const jsonArr = Object.assign(JSON.parse(JSON.stringify(json)), JSON.parse(JSON.stringify(this.getStateData())));
          if (!jsonArr[srccol]) {
            if (items.type === 'DropDownSelectFilter') {
              // console.log(items.props.defaultSelected, index, items);
              // this.newFormItemLists[index].item.value = '';
              // this.newFormItemLists[index].item.props.defaultSelected = [];
            } else {
              // this.newFormItemLists[index].item.value = '';
            }
          }
        }
      },
      dynamicforcompute(items, json) {
        // 被计算 属性 加减乘除
        const str = items.validate.dynamicforcompute.refcolumns.reduce(
          (temp, current) => {
            temp = temp.replace(new RegExp(current, 'g'), Number(json[current]));
            return temp;
          },
          items.validate.dynamicforcompute.express
        );
        const _index = this.newFormItemLists.findIndex(
          option => option.item.field === items.validate.dynamicforcompute.computecolumn
        );
        if (this.newFormItemLists[_index]) {
          this.newFormItemLists[_index].item.value = eval(str);
        }
      },
      setAttributes(item, formindex, val) {
        //  设置属性
        const jsonArr = Object.assign(JSON.parse(JSON.stringify(val)), JSON.parse(JSON.stringify(this.getStateData())));
        const field = item.props.webconf.setAttributes.field;
        if (!Array.isArray(field)) {
          return false;
        }
        const checkout = field.every((option) => {
          let optionValue = jsonArr[option.refcolumn];
          if (!optionValue) {
            optionValue = '';
          }
          if (typeof optionValue !== 'string') {
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

        if (!item.oldProps) {
          item.oldProps = JSON.parse(JSON.stringify(item.props));
          item.oldProps.required = item.required;
          if (item.props.regx) {
            item.oldProps.regx = item.props.regx;
          }
        }
        const props = JSON.parse(JSON.stringify(item.props));
        const checkoutProps = Object.keys(item.props.webconf.setAttributes.props).every(setItem => item.props.webconf.setAttributes.props[setItem] === props[setItem]);
        if (checkout && !checkoutProps) {
          if (item.props.webconf.setAttributes.props.value === '') {
            item.value = '';
          }
          if (item.props.webconf.setAttributes.props.required) {
            item.required = true;
          } else {
            item.required = false;
          }
          item.props = Object.assign(props, item.props.webconf.setAttributes.props);
          window.eventType(`${MODULE_COMPONENT_NAME}setProps`, window, item);
        } else if (checkout !== true && checkoutProps) {
          this.newFormItemLists[formindex].item.props = Object.assign(item.oldProps, {});
          item.required = item.oldProps.required;
        }        
        this.VerificationFormInt();
        return true;
      },
      filtercolumn(item, formindex, val) {
        // 过滤筛选
        const filterValue = val[item.props.webconf.filtercolval.col];
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
            this.newFormItemLists[formindex].item.value = -1;
          }
          // input.innerText = '';
        }
        return true;
      },
      hidecolumn(items, index, json) {
        // 隐藏
        const jsonArr = Object.assign(JSON.parse(JSON.stringify(json)), JSON.parse(JSON.stringify(this.getStateData())));

        const refcolumn = items.validate.hidecolumn.refcolumn;
        const refval = items.validate.hidecolumn.refval;
        // 是否显示 隐藏字段
        // this.newFormItemLists[index].show = false;
        this.newFormItemLists = this.newFormItemLists.map((option) => {
          if (option.item.field === refcolumn) {
            if (option.item) {
              const value = jsonArr[refcolumn];
              const refvalArr = refval.split(',');
              const refIndex = refvalArr.findIndex(x => x.toString() === value.toString());

              if (refIndex !== -1) {
                this.newFormItemLists[index].show = true;
                // 添加小组件的字段配置
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
              if (items.props.webconf && items.props.webconf.clearWhenHidden) {
                //   清除页面 联动的值
                this.newFormItemLists[index].item.value = '';
                this.newFormItemLists[index].item.props.defaultSelected = [];
                this.dataProcessing(this.newFormItemLists[index], index);
              }

              this.VerificationFormInt();
              // this.VerificationForm = this.VerificationMap();
              // this.VerificationFormInt();
            }
          }
          return option;
        });
      }
    }
  };
</script>

<style lang="less">
.FormItemComponent > div {
  /*border:1px solid #fff;*/
  box-sizing: border-box;
}
.itemComponent .burgeon-date-picker {
  width: 100%;
}
.FormItemComponent {
  display: grid;
  grid-template-columns: repeat(4, 25%);
}
</style>

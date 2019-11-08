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
        LinkageForm: [], // 所有form
        formDatadefObject: {}, // 获取form默认值
        setHeight: 34,
        actived: false
      };
    },
    mounted() {
      //   this.newFormItemLists.map((item) => {
      //     if (Object.hasOwnProperty.call(item.item.validate, 'refcolval')) {
      //       this.Mapping[item.item.validate.refcolval.srccol] = item.item.field;
      //     }
      //   });
      //   this.formValueItem = {};

      //   this.mapData = this.setMapping(this.Mapping);
      
      // 映射回调
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
          if (this.indexItem === -1) {
            return;
          }
          //   拦截默认值
          if (!this.actived || Object.keys(this.refcolvalData).length < 2) {
            return;
          }

          const allValue = Object.assign(JSON.parse(JSON.stringify(val)), JSON.parse(JSON.stringify(this.refcolvalData)));
          val = Object.assign(allValue, this.formValueItem);

          this.newFormItemLists.map((items, i) => {
            const item = items.item;
            // 筛选字段
            if (item.props.webconf && item.props.webconf.filtercolval) {
              // 主控字段的值
              this.filtercolumn(item, i, val);
            }

            //  扩展属性 来源字段
            if (item.props.webconf && item.props.webconf.targetField) {
              item.props.supportType = val[item.props.webconf.targetField];
            }
           
            if (Object.hasOwnProperty.call(item.validate, 'dynamicforcompute')) {
              if (
                val[item.validate.dynamicforcompute.computecolumn]
                === old[item.validate.dynamicforcompute.computecolumn]
              ) {
                this.dynamicforcompute(item, val, i);
              } else {
              // this.formDataChange();
              }
            } else if (Object.hasOwnProperty.call(item.validate, 'hidecolumn')) {
              const _refcolumn = item.validate.hidecolumn.refcolumn;
              const _refval = item.validate.hidecolumn.refval === 'object' ? 'object' : item.validate.hidecolumn.refval.toString().trim();
              if (val[_refcolumn] === undefined) {
                return false;
              }
              // console.log(val[_refcolumn] ===_refval,val[_refcolumn],_refval );
              const arrIndex = _refval.indexOf(val[_refcolumn] || '');
              const checkVal = arrIndex !== -1 ? 1 : 0;
              const checkShow = items.show ? 1 : 0;

              // console.log(_refval , val[_refcolumn]);
              // console.log(_refcolumn,',old[_refcolumn]',checkVal,checkShow);
              // console.log(item.title, checkVal, checkShow, _refval, _refcolumn, val, val[_refcolumn].toString().trim());
              if (checkVal !== checkShow) {
                this.hidecolumn(item, i);
              }
            } else if (Object.hasOwnProperty.call(item.validate, 'refcolval')) {
              this.refcolval(item, val, i);
            // this.formDataChange();
            }
            return items;
          });
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
        this.newFormItemLists.map((items, i) => {
          const item = items.item;
          this.LinkageForm.push({
            key: items.item.field,
            name: items.item.title,
            srccol: items.item.validate.refcolval && items.item.validate.refcolval.srccol,
          });
         
          //  扩展属性 来源
          if (item.props.webconf && item.props.webconf.targetField) {
            item.props.supportType = val[item.props.webconf.targetField];
          }
           
          if (Object.hasOwnProperty.call(item.validate, 'dynamicforcompute')) {
            // this.dynamicforcompute(item, val, i);
          } else if (Object.hasOwnProperty.call(item.validate, 'hidecolumn')) {
            const _refcolumn = item.validate.hidecolumn.refcolumn;
            const _refval = item.validate.hidecolumn.refval === 'object' ? 'object' : item.validate.hidecolumn.refval.toString().trim();
            if (val[_refcolumn] === undefined) {
              if (_refval === 'Y') {
                val[_refcolumn] = 'N';
              }
              if (_refval === '1') {
                val[_refcolumn] = '0';
              }
              if (_refval === true) {
                val[_refcolumn] = 'false';
              }
            }
            const checkVal = _refval === (val[_refcolumn] || '').toString().trim() ? 1 : 0;
            const checkShow = items.show ? 1 : 0;
            if (checkVal !== checkShow) {
              this.hidecolumn(item, i);
            }
          } else if (Object.hasOwnProperty.call(item.validate, 'refcolval')) {
            this.refcolval(item, val, i);
            // this.formDataChange();
          }
          return items;
        });
        if (this.LinkageForm.length > 0 && this.LinkageForm[0]) {
          if (this.$store._mutations[`${this[MODULE_COMPONENT_NAME]}/updateLinkageForm`]) {
            const data = {
              formList: this.LinkageForm,
              formIndex: this.formIndex
            };
            this.$store.commit(`${this[MODULE_COMPONENT_NAME]}/updateLinkageForm`, data);
          }  
        }
      },  
      mountdataFormInt() {
        this.actived = false;
        setTimeout(() => {
          //  传form 默认值
          this.mountdataForm(this.formDataObject);
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
          if (item.item.required && item.show) {
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
            valueItem[Object.keys(obj)[0]] = [{
              Label: '',
              ID: ''
            }];
          } else if (current.item.props.isuppercase) {
            if (valueItem[Object.keys(obj)[0]]) {
              valueItem[Object.keys(obj)[0]] = current.item.value.toUpperCase();
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

        // 向父组件抛出整个数据对象以及当前修改的字段
        this.$emit('formDataChange', obj, valueItem, current);
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
      },
      refcolval(items, json, index) {
        if (interlocks() === true) {
          const srccol = items.validate.refcolval.srccol;
          
          const jsonArr = Object.assign(JSON.parse(JSON.stringify(json)), JSON.parse(JSON.stringify(this.getStateData())));
          if (!jsonArr[srccol]) {
            if (items.type === 'DropDownSelectFilter') {
              // console.log(items.props.defaultSelected, index, items);
              this.newFormItemLists[index].item.value = '';
              this.newFormItemLists[index].item.props.defaultSelected = [];
            } else {
              this.newFormItemLists[index].item.value = '';
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
      filtercolumn(item, formindex, val) {
        const filterValue = val[item.props.webconf.filtercolval.col];
        if (item.type === 'select') {
          if (!item.olderOptions) {
            item.olderOptions = item.options;
          }
          const checkout = item.props.webconf.filtercolval.map[filterValue].findIndex(x => x === item.value);
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
      },
      hidecolumn(items, index) {
        // 隐藏
        const refcolumn = items.validate.hidecolumn.refcolumn;
        const refval = items.validate.hidecolumn.refval;
        // 是否显示 隐藏字段
        // this.newFormItemLists[index].show = false;
        this.newFormItemLists = this.newFormItemLists.map((option) => {
          if (option.item.field === refcolumn) {
            if (option.item) {
              const value = Array.isArray(option.item.value)
                ? option.item.value.toString()
                : option.item.value;
              if (JSON.stringify(refval).indexOf(JSON.stringify(value)) !== -1) {
                this.newFormItemLists[index].show = true;
              } else {
                this.newFormItemLists[index].show = false;
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
  grid-auto-rows: minmax(auto);
}
</style>

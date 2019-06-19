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
  import layoutAlgorithm from '../__utils__/layoutAlgorithm';
  import { Version, interlocks } from '../constants/global';

  export default {
    name: 'FormItemComponent',
    computed: {
      // 计算属性的 getter
      dataColRol() {
        const list = layoutAlgorithm(this.defaultColumn, this.newFormItemLists);
        return Object.keys(list).reduce((temp, current) => {
          // console.log(list[current].item.value, 'item');
          temp.push(list[current]);
          return temp;
        }, []);
      },
      VerificationForm() {
        let obj = {}; // 当前form 需要校验的key
        obj = this.newFormItemLists.reduce((option, items, index) => {
          if (Array.isArray(items.item.value)) {
            if (
              items.item.value[0]
            && Object.hasOwnProperty.call(items.item.value[0], 'ID')
            ) {
              if (items.item.required === true) {
                // 赋值 需要校验的 值
                // 判断必须输入的值是否为空
                option.push({
                  index,
                  type: items.item.props.display,
                  eq: this.formIndex,
                  value: items.item.value[0].ID,
                  key: items.item.field,
                  label: items.item.title
                });
              }
            } else if (items.item.required === true) {
              // 赋值 需要校验的 值
              // 判断必须输入的值是否为空
              option.push({
                index,
                type: items.item.props.display,
                eq: this.formIndex,
                value: items.item.value[0],
                key: items.item.field,
                label: items.item.title
              });
            }
          } else if (items.item.required === true) {
            // 赋值 需要校验的 值
            option.push({
              index,
              eq: this.formIndex,
              type: items.item.props.display,
              value: items.item.value,
              key: items.item.field,
              label: items.item.title
            });
          }

          return option;
        }, []);
        return obj;
      },
      // 计算属性的 后台传值
      formDataObject() {
        let obj = {};
        // 监听组件的 后台字段的值  默认值及数据联动
        obj = this.newFormItemLists.reduce((option, items) => {
          const value = items.item.props.refobjid
            ? items.item.props.refobjid
            : items.item.value;
          if (value !== undefined && value.length < 1) {
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
                if (items.item.value[0].ID) {
                  option[items.item.field] = items.item.value[0].ID;
                }
              } else if (items.item.value[0]) {
                option[items.item.field] = items.item.value[0];
              }
            } else if (items.item.value) {
              option[items.item.field] =              items.item.props.defval
              || items.item.value
              || items.item.props.valuedata;
            }
            if (items.item.props.number) {
              if (option[items.item.field]) {
                option[items.item.field] = Number(
                  option[items.item.field]
                    .replace(/^\s+|\s+$/g, '')
                    .replace(/-/g, '')
                );
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
      Condition: {
        type: String,
        default() {
          return '';
        }
      }
    },
    data() {
      return {
        indexItem: -1,
        newFormItemLists: [], // 当前form list
        changeFormData: {}, // 当前form 被改动的key
        Mapping: {}, // 设置映射关系
        mapData: {}, // 全部联动关系
        formValueItem: {}, //当前字段
        changeNumber: 0, // 更改次数
        formDatadefObject: {}, // 获取form默认值
        setHeight: 34
      };
    },
    mounted() {
      this.newFormItemLists.map((item) => {
        if (Object.hasOwnProperty.call(item.item.validate, 'refcolval')) {
          this.Mapping[item.item.validate.refcolval.srccol] = item.item.field;
        }
      });
      this.mapData = this.setMapping(this.Mapping);
      // 映射回调
      this.mappStatus(this.Mapping, this.mapData);
    // this.VerificationFormInt();
    },
    created() {
      this.newFormItemLists = this.formItemLists.concat([]);
    },
    watch: {
      VerificationForm: {
        handler(val, old) {
          if (
            val.length > old.length
          || JSON.stringify(val) !== JSON.stringify(old)
          ) {
            if (this.indexItem < 0) {
              setTimeout(() => {
                this.VerificationFormInt();
              }, 300);
            }
          }
        },
        deep: true
      },
      formDataObject: {
        handler(val, old) {
          // if (this.indexItem === -1) {
          //   return;
          // }
          //console.log(val,'this.indexItem',this.indexItem);
          val = Object.assign(val,this.formValueItem);
          this.changeNumber = this.changeNumber + 1;
          // this.formDatadefObject = val;
          this.newFormItemLists.map((items, i) => {
            const item = items.item;
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
              const _refval = item.validate.hidecolumn.refval;
              let checkVal =  _refval === val[_refcolumn] ? 1 : 0;
              let checkShow =  items.show ? 1 : 0;
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
          this.changeNumber = 0;
          this.newFormItemLists = this.formItemLists.concat();
        },
        deep: true
      }
    },
    methods: {
      VerificationFormInt() {
        //  form 计算 校验
        // 传值默认data
        if (this.VerificationForm.length < 1) {
          return false;
        }
        const VerificationForm = this.VerificationForm.reduce((item, current) => {
          // 判断必须输入的值是否为空
          const elDiv =          this.$refs[`component_${current.index}`][0]
          && this.$refs[`component_${current.index}`][0].$el;
          
          if (!elDiv) {
            return [];
          }
          let onfousInput = {};
          if (current.type === 'textarea') {
            onfousInput = elDiv.querySelector('textarea');
          } else {
            onfousInput = elDiv.querySelector('input');
          }
          if (current && onfousInput) {
            item.push({
              ...current,
              onfousInput
            });
          }

          return item;
        }, []);

        setTimeout(() => {
          //  传form 默认值
          if (this.verifymessageform) {
            this.verifymessageform(VerificationForm);
          }
          this.mountdataForm(this.formDataObject);
        }, 100);
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
              if (Version === '1.3') {
                //  id 转number
                obj[current.item.field] = Number(obj[current.item.field]);
              }
            } else if (this.Condition) {
              // 模糊查询
              delete obj[current.item.field];
              obj[current.item.inputname] = current.item.value;
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
            if (current.item.props.Selected) {
              obj[current.item.field] = current.item.props.Selected;
              if (Version === '1.3') {
                //  id 转number
                obj[current.item.field] = Number(obj[current.item.field]);
              }
            } else if (this.Condition) {
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
          } else if (Version === '1.4') {
            obj[current.item.field] = current.item.props.empty;
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
          valueItem[Object.keys(obj)[0]] = current.item.value;
        }
        this.formValueItem = obj;
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
        if (interlocks === 'qiaodan') {
          const srccol = items.validate.refcolval.srccol;

          if (json[srccol] === undefined) {
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
        this.newFormItemLists[_index].item.value = eval(str);
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
              console.log(refcolumn ,JSON.stringify(refval) === JSON.stringify(value));
              if (JSON.stringify(refval) === JSON.stringify(value)) {
                this.newFormItemLists[index].show = true;
              } else {
                this.newFormItemLists[index].show = false;
              }
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

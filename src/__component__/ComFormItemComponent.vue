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
  import { Version, VersionName } from '../constants/global.js';

  export default {
    name: 'FormItemComponent',
    computed: {
      FormItemLists: {
        get() {
          const arr = JSON.parse(JSON.stringify(this.formItemLists));
          return arr;
        },
        set(newValue) {
          this.newFormItemLists = newValue;
        }

      },
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
            if (items.item.value[0] && Object.hasOwnProperty.call(items.item.value[0], 'ID')) {
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
        obj = this.newFormItemLists.reduce((option, items) => {
          if (Array.isArray(items.item.value)) {
            if (items.item.value[0] && Object.hasOwnProperty.call(items.item.value[0], 'ID')) {
              if (items.item.value[0].ID) {
                option[items.item.field] = items.item.value[0].ID;
              }
            }
          } else if (items.item.value) {
            option[items.item.field] = items.item.value || items.item.props.valuedata || items.item.props.defval;
          }

          return option;
        }, {});
        return obj;
      },
      // 计算属性的 div 的坐标起始点
      setDiv() {
        return item => ` grid-column:${item.x}/${item.col + item.x};grid-row:${item.y}/${item.y + item.row};`;
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
          return function () {

          };
        }
      },
      mappStatus: {
        type: Function,
        default() {
          return function () {

          };
        }
      }
    },
    data() {
      return {
        indexItem: -1,
        newFormItemLists: this.formItemLists, // 当前form list
        changeFormData: {}, // 当前form 被改动的key
        Mapping: {}, // 设置映射关系
        mapData: {}, // 全部联动关系
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


      // 传值默认data
      const VerificationForm = this.VerificationForm.reduce((item, current) => {
        // 判断必须输入的值是否为空
        const elDiv = this.$refs[`component_${current.index}`][0].$el;
        let onfousInput = {};
        if (current.type === 'textarea') {
          onfousInput = elDiv.querySelector('textarea');
        } else {
          onfousInput = elDiv.querySelector('input');
        }
        item.push({
          ...current,
          onfousInput
        });
        return item;
      }, []);

      if (this.verifymessageform) {
        this.verifymessageform(VerificationForm);
      }

      this.mountdataForm(this.formDataObject);
    },
    created() {
    },
    watch: {
      formDataObject: {
        handler(val, old) {
          if (this.indexItem < 0) {
            return;
          }
          this.newFormItemLists.map((items, i) => {
            const item = items.item;

            if (Object.hasOwnProperty.call(item.validate, 'dynamicforcompute')) {
              if ((val[item.validate.dynamicforcompute.computecolumn] === old[item.validate.dynamicforcompute.computecolumn])) {
                this.dynamicforcompute(item, val, i);
              } else {
                // this.formDataChange();
              }
            } else if (Object.hasOwnProperty.call(item.validate, 'hidecolumn')) {
              const _refcolumn = item.validate.hidecolumn.refcolumn;
              if (val[_refcolumn] !== old[_refcolumn]) {
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
      }
    },
    methods: {
      setMapping(data) {
        //  获取映射关系
        const temp = Object.keys(data).reduce((a, c) => {
          const f = (key) => {
            if (!data[key]) { return []; }
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
        if (current.item.field) { // 当存在field时直接生成对象
          if (current.item.type === 'DropDownSelectFilter') { // 若为外键则要处理输入还是选中
            if (current.item.value instanceof Array) { // 结果为数组则为选中项
              delete obj[current.item.inputname];
              obj[current.item.field] = current.item.value.reduce((sum, temp) => {
                sum.push(temp.ID); return sum;
              }, []).join(',');
            } else { // 否则为输入项
              delete obj[current.item.field];
              obj[current.item.inputname] = current.item.value;
            }
          } else if (current.item.value && JSON.stringify(current.item.value).indexOf('bSelect-all') >= 0) {
            // 当为全选时，将对应的字段改为undefined
            obj[current.item.field] = undefined;
          } else if (current.item.type === 'AttachFilter') { // 若为外键则要处理输入还是选中
            if (current.item.props.Selected.length > 0) {
              obj[current.item.field] = current.item.props.Selected[0];
            } else {
              obj[current.item.inputname] = current.item.value;
            }
          } else if (current.item.type === 'checkbox') {
            obj[current.item.field] = current.item.value;
          } else if (current.item.value.toString().length > 0) {
            if (current.item.props.number) {
              if (current.item.type === 'input') {
                obj[current.item.field] = current.item.value;
              } else {
                const value = current.item.value.replace(/-|00:00:00/g, '').replace(/^\s+|\s+$/g, '');
                obj[current.item.field] = Number(value);
              }
            } else if (typeof current.item.value === 'string') {
              obj[current.item.field] = current.item.value.replace('00:00:00', '');
            } else {
              obj[current.item.field] = current.item.value.replace(/^\s+|\s+$/g, '');
            }
          } else {
            obj[current.item.field] = current.item.props.empty;
          }
        } else if (current.item.value) { // 处理多个select合并
          obj = Object.assign(obj, current.item.value.reduce((objData, item) => {
            if (item !== 'bSelect-all') {
              const key = item.split('|')[0];
              const value = item.split('|')[1];
              if (!objData[key]) {
                objData[key] = [];
              }
              objData[key].push(value);
            }
         
            return objData;
          }, {}));
        }
        if (current.item.props.number) {    
          this.changeFormData = Number(obj[Object.keys(obj)[0]]);
        } else {
          this.changeFormData = obj;
        }
        // 向父组件抛出整个数据对象以及当前修改的字段
        this.$emit('formDataChange', obj, current);
      },
      resetForm() { // 重置表单
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
        console.log(items, 'items', VersionName, this.mapData);
      },
      dynamicforcompute(items, json) {
        // 被计算 属性 加减乘除
        const str = items.validate.dynamicforcompute.refcolumns.reduce((temp, current) => {
          temp = temp.replace(new RegExp(current, 'g'), Number(json[current]));
          return temp;
        }, items.validate.dynamicforcompute.express);
        const _index = this.newFormItemLists.findIndex(option => option.item.field === items.validate.dynamicforcompute.computecolumn);
        this.newFormItemLists[_index].item.value = eval(str);
      },
      hidecolumn(items, index) {
        // 隐藏
        console.log('index');
        const refcolumn = items.validate.hidecolumn.refcolumn;
        const refval = items.validate.hidecolumn.refval;
        this.newFormItemLists = this.newFormItemLists.map((option) => {
          if (option.item.field === refcolumn) {
            if (option.item.value === refval) {
              this.newFormItemLists[index].show = true;
            } else {
              this.newFormItemLists[index].show = false;
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
.itemComponent .burgeon-date-picker{
    width: 100%;
}
.FormItemComponent {
  display: grid;
  grid-template-columns: repeat(4, 25%);
  grid-auto-rows: minmax(auto);
}
</style>

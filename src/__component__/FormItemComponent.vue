/* eslint-disable no-console */
<template>
  <div>
    <!-- 需要下拉 -->
    <DownComponent
      v-if="dataColRol.length >0"
      :title="title"
      :set-height="setHeight"
      :row-all="rowAll"
      :default-spread="defaultSpread"
      :search-foldnum="Number(searchFoldnum)"
    >
      <div
        slot="dwonContent"
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
            :class="'form_'+item.item.props.require"
            :index="index"
            :items="item.item"
            :label-width="item.labelWidth"
            @inputChange="inputChange"
          />
        </div>
      </div>
    </DownComponent>
    <div
      v-if="Number(searchFoldnum) === 0"
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
          :items="item.item"
          @inputChange="inputChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import layoutAlgorithm from '../__utils__/layoutAlgorithm';
  import DownComponent from './DownComponent';


  export default {
    name: 'FormItemComponent',
    components: {
      DownComponent
    },
    computed: {
      FormItemLists() {
        const arr = JSON.parse(JSON.stringify(this.formItemLists));
        arr.map((temp, index) => {
          temp.component = this.formItemLists[index].component;
          temp.item.event = this.formItemLists[index].item.event;
          temp.item.props = this.formItemLists[index].item.props;
          return temp;
        });
        // 兼容 tab 切换
        return arr;
      },
      // 计算属性的 getter
      dataColRol() {
        const list = layoutAlgorithm(Number(this.defaultColumn), this.newFormItemLists);
        return Object.keys(list).reduce((temp, current) => {
          // 计算显示行数
          this.rowAll = list[current].row + list[current].y - 1;
          temp.push(list[current]);
          return temp;
        }, []);
      },
      // 计算属性的 后台传值
      formDataObject() {
        let obj = {};
        obj = this.newFormItemLists.reduce((option, items) => {
          option[items.item.field] = items.item.value;
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
        type: [Number, String],
        default: 4
      },
      formItemsData: {
        type: Object,
        default() {
          return {};
        }
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
      title: {
        type: String,
        default() {
          return '';
        }
      },
      defaultSpread: {
        type: Boolean,
        default() {
          return true;
        }
      }
    },
    data() {
      return {
        newFormItemLists: [],
        indexItem: -1,
        rowAll: 0,
        setHeight: 34
      };
    },
    mounted() {
    },
    created() {
    },
    watch: {
      FormItemLists: {
        handler(val) {
          this.newFormItemLists = val.concat([]);
        },
        deep: true
      },
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
            } else {
              // this.formDataChange();
            }
            return items;
          });

          if (JSON.stringify(this.formItemsData) !== this.dataProcessing(this.newFormItemLists)) {
            this.formDataChange();
          }
        },
        deep: true
      }
    },
    methods: {
      formDataChange() { // 向父组件抛出整个数据对象以及当前修改的字段
        // console.log(this.dataProcessing());
        this.$emit('formDataChange', this.dataProcessing(this.newFormItemLists), this.newFormItemLists[this.indexItem], this.indexItem);
      },
      dataProcessing(arr) {
        const Arr = arr.concat([]);
        return Arr.reduce((obj, current) => {
          if (current.item.field) { // 当存在field时直接生成对象
            if (current.item.type === 'DropDownSelectFilter') { // 若为外键则要处理输入还是选中
              if (current.item.value instanceof Array) { // 结果为数组则为选中项
                delete obj[current.item.inputname];
                const value = current.item.value.reduce((sum, temp) => { sum.push(temp.ID); return sum; }, []);
                if (value.length > 0 && value[0] !== '') {
                  obj[current.item.field] = value;
                }
              } else { // 否则为输入项
                delete obj[current.item.field];
                if (current.item.props.fk_type != 'mrp') {
                  obj[current.item.inputname] = current.item.value;
                }
              }
            } else if (current.item.type === 'AttachFilter') { // 若为外键则要处理输入还是选中
              if (current.item.props.Selected[0] && current.item.props.Selected[0].ID !== undefined) {
                obj[current.item.field] = current.item.props.Selected[0].ID;
              } else {
                obj[current.item.inputname] = current.item.value;
              }
            } else {
              obj[current.item.field] = current.item.value;
            }
          } else if (current.item.props.type === 'checkbox') {
            if (current.item.value === true) {
              obj[current.item.field] = 'Y';
            } else {
              obj[current.item.field] = 'N';
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
          return obj;
        }, {});
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
        if (this.newFormItemLists[index].item.props.display === 'OBJ_DATENUMBER') {
          // 列表界面 配置 显示字符串
          if (Array.isArray(value)) {
            const _value = value.reduce((arry, item) => {
              arry.push(new Date().setNewFormt(item, '/', ''));
              return arry;
            }, []);
            this.newFormItemLists[index].item.value = _value;
          } else {
            this.newFormItemLists[index].item.value = new Date().setNewFormt(value, '/', '');
          }
        } else {
          this.newFormItemLists[index].item.value = value;
        }
        this.newFormItemLists = this.newFormItemLists.concat([]);
      },
      dynamicforcompute(items, json, index) {
        // 被计算 属性 加减乘除
        const str = items.validate.dynamicforcompute.refcolumns.reduce((temp, current) => {
          temp = temp.replace(new RegExp(current, 'g'), Number(json[current]));
          return temp;
        }, items.validate.dynamicforcompute.express);
        this.newFormItemLists[index].item.value = eval(str);
      },
      hidecolumn(items, index) {
        // 隐藏
        const refcolumn = items.validate.hidecolumn.refcolumn;
        const refval = items.validate.hidecolumn.refval;

        this.newFormItemLists = this.newFormItemLists.map((option) => {
          if (option.item.field === refcolumn) {
            if (option.item.value === refval) {
              this.newFormItemLists[index].show = false;
            } else {
              this.newFormItemLists[index].show = true;
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
.itemComponent .ark-date-picker{
    width: 100%;
}
.FormItemComponent {
  display: grid;
  grid-template-columns: repeat(4, 25%);
  grid-auto-rows: minmax(auto);
}
</style>

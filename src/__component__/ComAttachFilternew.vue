<template>
  <div :class="classes">
    <AttachFilter v-if="!showDisabled"
                  ref="AttachFilter"
                  v-model="InputValue"
                  v-bind="propsData"
                  :auot-data="propsData.AutoData"
                  :default-selected="selected"
                  @on-show="attachFilterPopperShow"
                  @input="attachFilterInput"
                  @on-change="attachFilterChange"
                  @on-select="attachFilterSelected"
                  @on-focus="attachFilterInputFocus"
                  @on-blur="attachFilterInputBlur"
                  @on-keyup="attachFilterInputKeyup"
                  @on-keydown="attachFilterInputKeydown"
                  @on-ok="attachFilterOk"
                  @on-cancel="attachFilterCancel"
                  @on-clear="attachFilterClear">
      <div v-if="propsData.componentType"
           slot="daigo">
        <component :is="propsData.componentType"
                   ref="complex"
                   :fkobj="propsData.fkobj"
                   :filter="filterDate"
                   :default="selected"/>
      </div>
    </AttachFilter>
    <Input v-if="showDisabled"
           ref="AttachFilter"
           v-model="InputValue"
           v-bind="propsData"
           type="text"
           :auot-data="propsData.AutoData"
           :default-selected="selected"
           @on-show="attachFilterPopperShow"
           @input="attachFilterInput"
           @on-change="attachFilterChange"
           @on-select="attachFilterSelected"
           @on-focus="attachFilterInputFocus"
           @on-blur="attachFilterInputBlur"
           @on-keyup="attachFilterInputKeyup"
           @on-keydown="attachFilterInputKeydown"
           @on-ok="attachFilterOk"
           @on-cancel="attachFilterCancel"
           @on-clear="attachFilterClear"
           @on-uploadFile="attachFile"/>
  </div>
</template>

<script>
  // 弹窗多选面板
  // import { setTimeout } from 'timers';
  import Dialog from './ComplexsDialog';
  // 弹窗单选
  import myPopDialog from './PopDialog';
  import dataProp from '../__config__/props.config';
  import {Version, classFix} from '../constants/global';

  const fkHttpRequest = () => require(`../__config__/actions/version_${Version()}/formHttpRequest/fkHttpRequest.js`);

  export default {
    name: 'ComAttachFilter',
    model: {
      prop: 'value',
      event: 'on-change',
    },
    props: {
      // defaultValue: {
      //   type: String,
      //   // 后台传参
      //   default() {
      //     return '';
      //   }
      // },
      value: {
        // 默认选中值
        type: [Array, String],
        default() {
          return [];
        }
      },
      propstype: {
        // 各种props
        type: Object,
        default() {
          return {};
        }
      }
    },
    data() {
      return {
        filterDate: {},
        selected: [
          {
            Label: '',
            ID: ''
          }
        ],
        clickTimer: 0,
        InputValue: '',
        showDisabled: false,
        activedMounted: false,
        fkobj: {}, // 过滤
        propsData: {},
        resultData: {} // 结果传值
      };
    },
    computed: {
      classes: () => `${classFix}AttachFilter-pop`
    },
    watch: {
      value: {
        handler(val, old) {

          if (JSON.stringify(val) === JSON.stringify(old)) {
            return false;
          }
          if (Array.isArray(this.value)) {
            if (this.value[0] && this.value[0].ID && this.value[0].ID !== -1) {
              // this.selected = this.value;
              this.InputValue = this.value[0] && this.value[0].Label;
            }
          } else {
            this.InputValue = this.value
          }

        }
      },
      propstype() {
        // 将设置的props和默认props进行assign
        this.propsData = JSON.parse(JSON.stringify(this.propstype));

        if (this.propsData.disabled) {
          this.showDisabled = this.propsData.disabled;
        } else {
          this.showDisabled = false;
        }

      },
      deep: true
    },
    methods: {
      valueChange(type) {
        let selectd = this.selected;
        let InputValue = this.InputValue;
        clearTimeout(this.clickTimer);
        this.clickTimer = setTimeout(() => {
          console.log(InputValue);
          if (type === 'clear') {
            this.$emit('on-change', '', 'clear', this);
          } else {
            // 处理弹窗单选数据
            if (selectd[0] && selectd[0].ID) {
              this.$emit('on-change', selectd, type, this);
            } else {
              this.$emit('on-change', InputValue, type, this);
            }

          }
        }, 200);
      },
      attachFilterInput(value) {
        this.InputValue = value;

        this.selected = [];
        this.valueChange('change');

        this.inputValueChange(value);

      },
      inputValueChange(value) {
        // 外键的模糊搜索

        if (!value) {
          return false;
        }


        fkHttpRequest().fkFuzzyquerybyak({
          searchObject: {
            ak: value,
            colid: this.propsData.fkobj.colid || this.propsData.colid,
            fixedcolumns: {}
          },
          serviceId: this.propsData.fkobj.serviceId,
          success: (res) => {
            this.propsData.hidecolumns = ['id', 'value'];
            this.propsData.AutoData = res.data.data;

          }
        });
        return true;
      },
      // AttachFilter event
      attachFilterChange(value) {

        // this.InputValue = value;

        // // 谢世华  为了处理标准列表界面字段数据消失问题
        // // if (value.indexOf('已经选中') >= 0) {
        // //   this.InputValueChange('change');
        // // }

        // this.valueChange('change');

      },
      attachFilterSelected(row) {
        this.InputValue = row.label;

        this.selected = [
          {
            Label: row.label,
            ID: row.value
          }
        ];

        this.propsData.AutoData = [];
        this.valueChange('selected');
        return true;
      },
      attachFilterInputFocus(event, $this) {
        this.$emit('on-focus', event, $this);
      },
      attachFilterInputBlur(event, $this) {
        if (!this.selected[0] && this.propsData.blurType !== false) {
          this.InputValue = '';
          this.selected = [
            {
              Label: '',
              ID: ''
            }
          ];
          this.filterDate = {};
        }
        // this.InputValueChange('blur');
        this.$emit('on-blur', event, $this);
      },
      attachFilterInputKeyup(value, event, $this) {
        this.$emit('on-keyup', value, event, $this);
      },
      attachFilterInputKeydown(value, event, $this) {
        this.$emit('on-keydown', value, event, $this);
      },
      freshDropDownPopFilterData(res) {
        // 外键下拉时，更新下拉数据
        if (res.length > 0) {
          res.forEach((item) => {
            item.label = item.value;
            item.value = item.key;
            item.delete = true;
          });
          this.propsData.datalist = [];
          this.propsData.datalist = dataProp.AttachFilter.props.datalist.concat(
            res
          );
        } else {
          this.propsData.datalist = dataProp.AttachFilter.props.datalist.concat(
            []
          );
        }
      },
      attachFilterClear() {
        this.InputValue = '';
        this.resultData = {};
        this.selected = [];
        this.filterDate = {};
        console.log('clear,==========');
        this.valueChange('clear');
      },
      attachFilterPopperShow(value, instance) {
        if (Array.isArray(instance.datalist)) {
          instance.datalist.forEach((item) => {
            item.class = '';
          });
        }
        if (instance.showModal === false) {
          fkHttpRequest().fkGetMultiQuery({
            searchObject: {
              tableid: this.propsData.fkobj.reftableid
            },
            serviceId: this.propsData.serviceId,
            success: (res) => {
              this.freshDropDownPopFilterData(res);
            }
          });
          return false;
        }
        if (
          this.selected[0]
          && this.selected[0].ID
        // && /total/.test(this.selected[0].ID)
        ) {
          // this.filter = data;
          instance.complexs = false;
          setTimeout(() => {
            // 打开弹窗
            instance.complexs = true;
          }, 100);
          // const data = JSON.parse(this.selected[0].ID);
          // setTimeout(() => {
          //   if (this.$refs.complex && typeof data === 'object') {
          //     // this.$refs.complex.setvalueData(data, 1);
          //     this.$refs.complex.init();
          //   }
          // }, 500);
        } else {
          instance.complexs = false;
          this.filterDate = {};
          this.resultData = {};
          setTimeout(() => {
            // 打开弹窗
            instance.complexs = true;
          }, 100);
        }
        return true;
      },
      attachFile(index, res, instance) {
        if (res.code !== 0) {
          this.$Modal.fcError({
            title: '错误',
            content: res.message,
            mask: true
          });
        } else {
          fkHttpRequest().fkGetMultiQuery({
            searchObject: {
              tableid: this.propsData.fkobj.reftableid
            },
            serviceId: this.propsData.serviceId,
            success: (response) => {
              this.freshDropDownPopFilterData(response);
            }
          });
        }
      },
      attachFilterCancel($this) {
        this.filterDate = {};

      },
      attachFilterOk($this) {
        // this.resultData = Object.assign({}, this.$refs.complex);
        if ($this._data.params) {
          const value = $this._data.parms[$this._data.showKey].val;
          this.selected = [
            {
              Label: value,
              ID: $this._data.parms.ID.val
            }
          ];
          this.InputValue = value;
        } else {
          this.InputValue = '';
          this.selected = [
            {
              Label: '',
              ID: ''
            }
          ];
          this.attachFilterClear();
        }

        this.valueChange();
      }
    },
    mounted() {
      this.propsData = JSON.parse(JSON.stringify(this.propstype));

      if (this.propsData.disabled) {
        this.showDisabled = this.propsData.disabled;
      } else {
        this.showDisabled = false;
      }
      if (Array.isArray(this.value)) {
        if (this.value[0] && this.value[0].ID && this.value[0].ID !== -1) {
          this.selected = this.value;
          this.InputValue = this.value[0] && this.value[0].Label;

        }
      } else {
        this.InputValue = this.value
      }

      // this.selected = this.InputValue;
      // if (!this.selected[0]) {
      //   this.selected = [{
      //     Label: '',
      //     ID: ''
      //   }];
      // }
      this.propstype.show = false;
      this.propsData.componentType = myPopDialog;
      setTimeout(() => {
        this.activedMounted = true;
      }, 100)


    }
  };
</script>

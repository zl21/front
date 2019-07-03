<template>
  <div class="comAttachFilter">
    <AttachFilter
      v-model="value"
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
      @on-popclick="attachFilterPopclick"
      @on-clear="attachFilterClear"
      @on-uploadFile="attachFile"
    >
      <div
        v-if="propsData.componentType"
        slot="daigo"
      >
        <component
          :is="propsData.componentType"
          ref="complex"
          :fkobj="propsData.fkobj"
          :filter="filterDate"
        />
      </div>
    </AttachFilter>
  </div>
</template>

<script>
  // 弹窗多选面板
  import { type } from 'os';
  import Dialog from './ComplexsDialog';
  // 弹窗单选
  import myPopDialog from './PopDialog';
  import dataProp from '../__config__/props.config';
  import { Version } from '../constants/global';


  const {
    fkQueryList,
    fkFuzzyquerybyak,
    fkGetMultiQuery,
    fkDelMultiQuery
  // eslint-disable-next-line import/no-dynamic-require
  } = require(`../__config__/actions/version_${Version}/formHttpRequest/fkHttpRequest.js`);

  export default {
    name: 'ComAttachFilter',
    props: {
      defaultValue: {
        type: String,    
        default() {
          return '';
        }
      },
      defaultSelected: {
        type: Array,    
        default() {
          return [];
        }
      },
      propstype: {
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
        value: '',
        fkobj: {}, // 过滤
        propsData: {},
        resultData: {} // 结果传值
      };
    },
    watch: {
      propstype() {
        // 将设置的props和默认props进行assign
        // const item = this.items;
        this.value = this.defaultValue;
        this.selected = this.defaultSelected;
        // if (this.selected[0].Label && /total/.test(this.selected[0].Label)) {
        //   const valuedata = JSON.parse(this.selected[0].Label);
        //   this.selected[0].Label = `已经选中${valuedata.total}条` || '';
        // }
        this.propsData = JSON.parse(JSON.stringify(this.propstype));
        if (this.propstype.fkdisplay === 'pop') {
          this.propstype.show = false;  
          this.propsData.componentType = myPopDialog;
        } else {
          this.propsData.componentType = Dialog;
          this.propstype.show = true;  
        }
      }
    },
    methods: {
      valueChange() {
        console.log('valueChange');  
        this.$emit('valuechange', { value: this.value, selected: this.selected });
      }, 
      attachFilterInput(value) {
        this.value = value;
        this.selected = [];
        this.valueChange();
        this.inputValueChange(value);
      },
      inputValueChange(value) {
        // 外键的模糊搜索
        if (!value) {
          return false;
        }
        fkFuzzyquerybyak({
          searchObject: {
            ak: value,
            colid: this.propsData.fkobj.colid || this.propsData.colid,
            fixedcolumns: {}
          },
          serviceId: this.propsData.fkobj.serviceId,
          success: (res) => {
            this.propsData.AutoData = res.data.data;
          }
        });
      },
      // AttachFilter event
      attachFilterChange(value) {
        this.value = value;
        this.valueChange();
      },
      attachFilterSelected(row) {
        this.value = row.label;
        this.selected = [
          {
            Label: row.label,
            ID: row.value
          }
        ];
        this.valueChange();
      },
      attachFilterInputFocus() {
        
      },
      attachFilterInputBlur() {
        if (!this.selected[0]) {
          this.value = '';
          this.selected = [
            {
              Label: '',
              ID: ''
            }
          ];
        }
        this.valueChange();
      },
      attachFilterInputKeyup() {
        
      },
      attachFilterInputKeydown(event, $this) {
        this.$emit('keydown', event, $this);
      },
      attachFilterPopclick(event, row, targName, $this) {
        console.log(event, row, targName, $this); 
        if (targName !== 'I' && event !== 1) {
          // 打开弹窗
          $this.complexs = false;
          setTimeout(() => {
            $this.showModal = true;
            $this.complexs = true;
          }, 100);
          if (event !== 0) {
            this.filterDate = JSON.parse(row.label);
          }
        } else if (targName === 'I') {
          fkDelMultiQuery({
            searchObject: {
              tableid: this.propsData.fkobj.reftableid,
              modelname: row.key
            },
            serviceId: this.propsData.serviceId,
            success: () => {
              fkGetMultiQuery({
                searchObject: {
                  tableid: this.propsData.fkobj.reftableid
                },
                serviceId: this.propsData.serviceId,
                success: (res) => {
                  this.freshDropDownPopFilterData(res);
                }
              });
            }
          });
        }
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
        }
      },
      attachFilterClear() {
        this.value = '';
        this.resultData = {};
        this.selected = [
          {
            Label: '',
            ID: ''
          }
        ];
        this.valueChange();
      },
      attachFilterPopperShow() {
        if (
          this.propsData.fkobj.saveType
          && this.selected[0].ID
          && /total/.test(this.selected[0].ID)
        ) {
          // this.filter = data;
          const data = JSON.parse(this.selected[0].ID);
          setTimeout(() => {
            if (this.$refs.complex && typeof data === 'object') {
              this.$refs.complex.setvalueData(data, 1);
            }
          }, 500);
        }    
        fkGetMultiQuery({
          searchObject: {
            tableid: this.propsData.fkobj.reftableid
          },
          serviceId: this.propsData.serviceId,
          success: (res) => {
            this.freshDropDownPopFilterData(res);
          }
        });
      },
      attachFile() {
        
      },
      attachFilterCancel($this) {
        this.filterDate = {};
        if ($this) {
          if (/选中/.test(this.value)) {
            this.filterDate = this.resultData;
          }
          $this.complexs = false;
        }
      },
      attachFilterOk($this) {
        this.resultData = Object.assign({}, this.$refs.complex);
        if ($this._data.params) {
          const value = $this._data.parms[this.propsData.inputname.split(':')[1]].val;
          this.selected = [
            {
              Label: value,
              ID: $this._data.parms.ID.val
            }
          ];
          this.value = value;
        } else if ($this._data.IN.length > 0) {
          const savemessage = JSON.parse(JSON.stringify($this.savemessage()));
          const saveObjectmessage = $this.savObjemessage();
          this.resultData = savemessage;
          const value = `已经选中${$this._data.IN.length}条数据`;
          this.selected = [
            {
              Label: value,
              ID: saveObjectmessage
            }
          ];
        
          this.value = value;
          if (this.propsData.fkobj.saveType) {
            console.log('saveType');
          } else {
            const Select = [
              {
                Label: value,
                ID: $this._data.IN
              }
            ];
            this.selected = Select;
            this.value = value;
          }
        } else {
          this.value = '';
          this.Selected = [
            {
              Label: '',
              ID: ''
            }
          ];
        }
        this.valueChange();
      }
    },
    created() {
      this.propsData = this.propstype;
      this.value = this.defaultValue;
      console.log(this);
      this.selected = this.defaultSelected;
      if (this.propstype.fkdisplay === 'pop') {
        this.propstype.show = false;  
        this.propsData.componentType = myPopDialog;
      } else {
        this.propsData.componentType = Dialog;
        this.propstype.show = true;  
      }
      if (this.selected[0] && this.selected[0].ID) {
        this.propsData.disabled = true;
      }
    // console.log(this.type,this.formIndex);
    }
  };
</script>

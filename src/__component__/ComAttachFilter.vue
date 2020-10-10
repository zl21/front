<template>
  <div
    :class="propsData.fkdisplay === 'pop' ? 'comAttachFilter AttachFilter-pop':'comAttachFilter'"
  >
    <AttachFilter
      v-if="!showDisabled"
      ref="AttachFilter"
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
          :default="selected"
        />
      </div>
    </AttachFilter>
    <Input
      v-if="showDisabled"
      ref="AttachFilter"
      v-model="value"
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
      @on-popclick="attachFilterPopclick"
      @on-clear="attachFilterClear"
      @on-uploadFile="attachFile"
    />
  </div>
</template>

<script>
  // 弹窗多选面板
  // import { setTimeout } from 'timers';
  import Dialog from './ComplexsDialog';
  // 弹窗单选
  import myPopDialog from './PopDialog';
  import dataProp from '../__config__/props.config';
  import { Version } from '../constants/global';
  import Upload from '../__utils__/upload';

  const fkHttpRequest = () => require(`../__config__/actions/version_${Version()}/formHttpRequest/fkHttpRequest.js`);

  export default {
    name: 'ComAttachFilter',
    props: {
      defaultValue: {
        type: String,
        // 后台传参
        default() {
          return '';
        }
      },
      defaultSelected: {
        // 默认选中值
        type: Array,
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
        value: '',
        showDisabled: false,
        fkobj: {}, // 过滤
        propsData: {},
        resultData: {} // 结果传值
      };
    },
    watch: {
      propstype() {
        // 将设置的props和默认props进行assign
        // const item = this.items;
        if (this.propstype.fkdisplay === 'pop') {
          this.value = this.defaultSelected && this.defaultSelected.length > 0 ? this.defaultSelected[0].Label : '';
        } else {
          this.value = this.defaultSelected && this.defaultSelected.length > 0 ? Array.isArray(this.defaultSelected[0].ID) ? `已经选中${this.defaultSelected[0].ID.length}条数据` : `已经选中${this.defaultSelected.length}条数据` : '';
        }
        
        
        this.selected = this.defaultSelected;
        // if (this.selected[0].Label && /total/.test(this.selected[0].Label)) {
        //   const valuedata = JSON.parse(this.selected[0].Label);
        //   this.selected[0].Label = `已经选中${valuedata.total}条` || '';
        // }

        this.propsData = JSON.parse(JSON.stringify(this.propstype));

        if (this.propsData.disabled) {
          this.showDisabled = this.propsData.disabled;
        } else {
          this.showDisabled = false;
        }
        if (this.propstype.fkdisplay === 'pop') {
          this.propstype.show = false;
          this.propsData.componentType = myPopDialog;
        } else {
          this.propsData.componentType = Dialog;
          if (this.defaultSelected[0] && this.defaultSelected[0].ID && /选中/.test(this.value)) {
            // const data = this.defaultSelected[0].ID; 
            const data = Array.isArray(this.defaultSelected[0].ID) ? this.defaultSelected[0].ID : JSON.parse(this.defaultSelected[0].ID); 
            // 谢世华  修改处理默认值逻辑
            
            if (data.value) {
              data.value.reftable = this.propsData.reftable;
              data.value.reftableid = this.propsData.reftableid;
              data.value.serviceId = this.propsData.serviceId;

              this.filterDate = {
                text: JSON.stringify(data.lists),
                value: data.value,
              };
              this.resultData = {
                text: JSON.stringify(data.lists),
                value: data.value,
              };
            }
          }
          this.propstype.show = true;
        }
      }
    },
    methods: {
      valueChange(type) {
        window.clearTimeout(this.clickTimer);
        this.clickTimer = window.setTimeout(() => {
          if (type === 'clear') {
            this.$emit('valuechange', { value: null, selected: [], type }, this);
          } else {
            // 处理弹窗单选数据
            this.$emit('valuechange', { value: this.propstype.fkdisplay === 'pop' ? ((this.selected && this.selected.length > 0) ? this.selected[0].ID : '') : this.value, selected: this.selected, type }, this);
          }
        }, 200);
      },
      attachFilterInput(value) {
        this.value = value;
        this.selected = [];
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
        this.value = value;
        // 谢世华  为了处理标准列表界面字段数据消失问题
        if (value.indexOf('已经选中') >= 0) {
          this.valueChange('change');
        }
      },
      attachFilterSelected(row) {
        this.value = row.label;
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
          this.value = '';
          this.selected = [
            {
              Label: '',
              ID: ''
            }
          ];
          this.filterDate = {};
        }
        // this.valueChange('blur');
        this.$emit('on-blur', event, $this);
      },
      attachFilterInputKeyup(value, event, $this) {
        this.$emit('on-keyup', value, event, $this);
      },
      attachFilterInputKeydown(value, event, $this) {
        this.$emit('on-keydown', value, event, $this);
      },
      attachFilterPopclick(event, row, targName, $this) {
        if (targName !== 'I' && event !== 1) {
          // 打开弹窗
          $this.complexs = false;
          setTimeout(() => {
            $this.showModal = true;
            $this.complexs = true;
          }, 100);
          if (event > 1) {
            this.filterDate = JSON.parse(row.label);
          }
        } else if (targName === 'I') {
          fkHttpRequest().fkDelMultiQuery({
            searchObject: {
              tableid: this.propsData.fkobj.reftableid,
              modelname: row.key
            },
            serviceId: this.propsData.serviceId,
            success: () => {
              fkHttpRequest().fkGetMultiQuery({
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
        } else {
          this.propsData.datalist = dataProp.AttachFilter.props.datalist.concat(
            []
          );
        }
      },
      attachFilterClear() {
        this.value = '';
        this.resultData = {};
        this.selected = [
        ];
        this.filterDate = {};
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
        if ($this) {
          if (/选中/.test(this.value)) {
            this.filterDate = this.resultData;
          }
          $this.complexs = false;
        }
      },
      attachFilterOk($this) {
        // this.resultData = Object.assign({}, this.$refs.complex);
        if ($this._data.params) {
          const type = this.propsData.inputname.split(':').length > 1 ? this.propsData.inputname.split(':')[1] : 'ENAME';
          const value = $this._data.parms[type].val;
          this.selected = [
            {
              Label: value,
              ID: $this._data.parms.ID.val
            }
          ];
          this.value = value;
        } else if (this.$refs.complex.resultData.list.length > 0) {
          const savemessage = JSON.parse(JSON.stringify(this.$refs.complex.savemessage()));
          const saveObjectmessage = this.$refs.complex.savObjemessage();
          const saveType = JSON.parse(this.$refs.complex.savObjemessage()).lists.result.length;
          this.resultData = savemessage;
          if (saveType > 0) {
            const value = `已经选中${this.$refs.complex.resultData.total}条数据`;
           
        
            if (!this.propsData.fkobj.saveType) {
              const ids = $this.idslist;
              const Select = [
                {
                  Label: value,
                  ID: ids
                }
              ];
              this.selected = Select;
              this.value = value;
              this.filterDate = savemessage;
            } else {
              this.selected = [
                {
                  Label: value,
                  ID: saveObjectmessage
                }
              ];
              this.filterDate = savemessage;
              this.value = value;
            }
          } else {
            this.attachFilterClear();
            // this.$refs.AttachFilter.$refs.AutoComplete.disabled = false;
          }
        } else {
          this.value = '';
          this.selected = [
            {
              Label: '',
              ID: ''
            }
          ];
          this.attachFilterClear();
        }

        if (this.propstype.fkdisplay === 'pop') {
          this.valueChange();
        }
      }
    },
    created() {
      this.propsData = JSON.parse(JSON.stringify(this.propstype));
      this.value = this.defaultValue;
      if (this.propsData.disabled) {
        this.showDisabled = this.propsData.disabled;
      } else {
        this.showDisabled = false;
      }
      
      this.selected = this.defaultSelected;
      if (!this.selected[0]) {
        this.selected = [{
          Label: '',
          ID: ''
        }];
      }
      if (this.propstype.fkdisplay === 'pop') {
        this.propstype.show = false;
        this.propsData.componentType = myPopDialog;
      } else {
        this.propsData.componentType = Dialog;
        this.propstype.show = true;
      }
      if (this.selected[0] && this.selected[0].ID) {
        if (this.propstype.fkdisplay !== 'pop') {
          // this.propsData.disabled = true;
        }
      }

      if (this.defaultSelected[0] && this.defaultSelected[0].ID && /选中/.test(this.defaultSelected[0].Label)) {
        const data = Array.isArray(this.defaultSelected[0].ID) ? this.defaultSelected[0].ID : JSON.parse(this.defaultSelected[0].ID); 
        // 谢世华  修改处理默认值逻辑
        if (data.value) {
          data.value.reftable = this.propsData.reftable;
          data.value.reftableid = this.propsData.reftableid;
          data.value.serviceId = this.propsData.serviceId;

          this.filterDate = {
            text: JSON.stringify(data.lists),
            value: data.value,
          };
          this.resultData = {
            text: JSON.stringify(data.lists),
            value: data.value,
          };
        }
      }
    }
  };
</script>
<style lang="less">
.AttachFilter-pop {
  .iconbj_tcduo:before {
    content: "\e6b1";
  }
  .iconbj_tcduo {
    padding-top: 2px;
  }
  
}
.attachfiter-pop{
  .ark-select-item-selected{
    color: #333333!important;
  }
  .ark-select-item-focus{
    background-color: #fff!important;
  }

}
</style>

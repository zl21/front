<template>
  <div class="comAttachFilter">
    <AttachFilter v-if="!showDisabled"
                  ref="AttachFilter"
                  v-model="valueInput"
                  v-bind="PropsNewData"
                  :disabled="disabled"
                  :optionTip="true"
                  :filterTip="true"
                  :auot-data="PropsNewData.AutoData"
                  :default-selected="selected"
                  :singleTurn="singleTurn"
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
                  @on-uploadFile="attachFile">
      <div v-if="PropsNewData.componentType"
           slot="daigo">
        <component :is="PropsNewData.componentType"
                   ref="complex"
                   :network="$http"
                   :fkobj="PropsNewData.fkobj"
                   :filter="filterDate"
                   :default="selected" />
      </div>
    </AttachFilter>
    <Input v-if="showDisabled"
           ref="AttachFilter"
           v-model="valueInput"
           v-bind="PropsNewData"
           type="text"
           :auot-data="PropsNewData.AutoData"
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
           @on-uploadFile="attachFile" />
  </div>
</template>

<script>
// 弹窗多选面板
// import { setTimeout } from 'timers';
import Dialog from './ComplexsDialog';
// 弹窗单选

const fkHttpRequest = () => require(`../../request/fkHttpRequest`);
import Config from '../../../config/nameConfig';
const prefixCls = `${Config.prefixCls}MopMultiSelect`;
export default {
  name: prefixCls,
  model: {
    prop: 'value',
    event: 'on-value-change',
  },
  props: {
    http: {
      type: Object,
      default () {
        return {};
      }
    },
    defaultSelected: {
      // 默认选中值
      type: Array,
      default () {
        return [];
      }
    },
    value: {
      // 默认选中值
      type: [Array, Object, String],
      default () {
        return [];
      }

    },
    PropsData: {
      // 各种props
      type: Object,
      default () {
        return {};
      }
    },
    singleTurn:{ // 去除单引号
       type: Boolean,
       default: true
    }
  },
  data () {
    return {
      $http: {},
      filterDate: {},
      selected: [
        {
          Label: '',
          ID: ''
        }
      ],
      clickTimer: 0,
      valueInput: '',
      showDisabled: false,
      fkobj: {}, // 过滤
      disabled:false,
      PropsNewData: {
        datalist: [],
        AutoData: [],
        hideColumnsKey: ["id"],
        dialog: {
          model: {
            title: "弹窗多选",
            mask: true,
            draggable: true,
            closable: true,
            scrollable: true,
            maskClosable: false,
            width: 920,
            "footer-hide": false
          }
        },
      },
      resultData: {} // 结果传值
    };
  },
  watch: {
    value (val,old) {
      this.disabled = false;
      if(JSON.stringify(val)=== JSON.stringify(old)){
        return false;
      }
     if(Array.isArray(this.value)){
        this.selected = this.value;
        if(this.value.length>0){
          this.disabled = true;
        }
        this.valueInput = this.value[0] && this.value[0].Label;
      }else{
        this.valueInput = this.value
      }
      this.initresult();

    },
    PropsData (val) {
      // 将设置的props和默认props进行assign
      // const item = this.items;
      if ((this.value && this.value.length > 0) && this.resultData && Object.keys(this.resultData).length > 0) {
        this.valueInput = `已经选中${this.resultData.value.IN.length}条数据`;
      } else {
        this.valueInput = this.value && this.value.length > 0 ? Array.isArray(this.value[0].ID) ? `已经选中${this.value[0].ID.length}条数据` : `已经选中${this.value.length}条数据` : '';
      }


     if(Array.isArray(this.value)){
        this.selected = this.value;
      }

      this.PropsNewData = JSON.parse(JSON.stringify(this.PropsData));

      this.PropsNewData.dialog = {
         model: {
            title: "弹窗多选",
            mask: true,
            draggable: true,
            closable: true,
            scrollable: true,
            maskClosable: false,
            width: 920,
            "footer-hide": false
          }
      }
      if (this.PropsData.disabled) {
        this.showDisabled = this.PropsNewData.disabled;
      } else {
        this.showDisabled = false;
      }
      this.PropsNewData.componentType = Dialog;
      this.initresult();
     
      this.PropsData.show = true;
    },
    deep: true
  },
  methods: {
    valueChange (type) {
      window.clearTimeout(this.clickTimer);
      this.clickTimer = window.setTimeout(() => {
        if (type === 'clear') {
          this.$emit('on-value-change', [], type, this);
        } else {
          this.$emit('on-value-change', this.selected, type, this);
        }
      }, 200);
    },
    attachFilterInput (value) {
      this.valueInput = value;
      this.selected = [];
      this.$emit('on-value-change', this.valueInput, 'Input', this);
      this.inputValueChange(value);
    },
    inputValueChange (value) {
      // 外键的模糊搜索
      if (!value) {
        return false;
      }
      fkHttpRequest().fkFuzzyquerybyak(this.$http, {
        searchObject: {
          ak: value,
          colid: this.PropsNewData.fkobj.colid || this.PropsNewData.colid,
          fixedcolumns: {}
        },
        serviceId: this.PropsNewData.fkobj.serviceId,
        success: (res) => {
          this.PropsNewData.hidecolumns = ['id', 'value'];
          this.PropsNewData.AutoData = res.data.data;
        }
      });
      return true;
    },
    // AttachFilter event
    attachFilterChange (value) {
      this.valueInput = value;
      // 谢世华  为了处理标准列表界面字段数据消失问题
      if (value.indexOf('已经选中') >= 0) {
        this.valueChange('change');
      }
    },
    attachFilterSelected (row) {
      this.valueInput = row.label;
      this.selected = [
        {
          Label: row.label,
          ID: row.value
        }
      ];
      this.PropsNewData.AutoData = [];
      this.valueChange('selected');
      return true;
    },
    attachFilterInputFocus (event, $this) {
      this.$emit('on-focus', event, $this);
    },
    attachFilterInputBlur (event, $this) {
      if (!this.selected[0] && this.PropsNewData.blurType !== false) {
        this.valueInput = '';
        this.selected = [
          {
            Label: '',
            ID: ''
          }
        ];
        this.filterDate = {};
      }
      this.$emit('on-blur', event, $this);
    },
    attachFilterInputKeyup (value, event, $this) {
      this.$emit('on-keyup', value, event, $this);
    },
    attachFilterInputKeydown (value, event, $this) {
      this.$emit('on-keydown', value, event, $this);
    },
    attachFilterPopclick (event, row, targName, $this) {
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
        fkHttpRequest().fkDelMultiQuery(this.$http, {
          searchObject: {
            tableid: this.PropsNewData.fkobj.reftableid,
            modelname: row.key
          },
          serviceId: this.PropsNewData.serviceId,
          success: () => {
            fkHttpRequest().fkGetMultiQuery(this.$http, {
              searchObject: {
                tableid: this.PropsNewData.fkobj.reftableid
              },
              serviceId: this.PropsNewData.serviceId,
              success: (res) => {
                this.freshDropDownPopFilterData(res);
              }
            });
          }
        });
      }
    },
    freshDropDownPopFilterData (res) {
      // 外键下拉时，更新下拉数据
      if (res.length > 0) {
        res.forEach((item) => {
          item.label = item.value;
          item.value = item.key;
          item.delete = true;
        });
        this.PropsNewData.datalist = [];
        this.PropsNewData.datalist = this.PropsNewData.originalDatalist.concat(
          res
        );
        this.$forceUpdate()

      } else {
        this.PropsNewData.datalist = this.PropsNewData.originalDatalist.concat(
          []
        );
      }
    },
    attachFilterClear () {
      this.valueInput = '';
      this.resultData = {};
      this.selected = [
      ];
      this.filterDate = {};
      this.valueChange('clear');
    },
    attachFilterPopperShow (value, instance) {
      if (Array.isArray(instance.datalist)) {
        instance.datalist.forEach((item) => {
          item.class = '';
        });
      }
      if (instance.showModal === false) {
        fkHttpRequest().fkGetMultiQuery(this.$http, {
          searchObject: {
            tableid: this.PropsNewData.fkobj.reftableid
          },
          serviceId: this.PropsNewData.serviceId,
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
    attachFile (index, res, instance) {
      if (res.code !== 0) {
        this.$Modal.fcError({
          title: '错误',
          content: res.message,
          mask: true
        });
      } else {
        fkHttpRequest().fkGetMultiQuery(this.$http, {
          searchObject: {
            tableid: this.PropsNewData.fkobj.reftableid
          },
          serviceId: this.PropsNewData.serviceId,
          success: (response) => {
            this.freshDropDownPopFilterData(response);
          }
        });
      }
    },
    attachFilterCancel ($this) {
      this.filterDate = {};
      if ($this) {
        if (/选中/.test(this.valueInput)) {
          this.filterDate = this.resultData;
        }
        $this.complexs = false;
      }
    },
    attachFilterOk ($this) {
      // this.resultData = Object.assign({}, this.$refs.complex);
      if ($this._data.params) {
        // const type = this.PropsNewData.inputname.split(':').length > 1 ? this.PropsNewData.inputname.split(':')[1] : 'ENAME';
        // const value = $this._data.parms[type].val;
        // this.selected = [
        //   {
        //     Label: value,
        //     ID: $this._data.parms.ID.val
        //   }
        // ];
        // this.valueInput = value;
      } else if (this.$refs.complex.resultData.list.length > 0) {
        const savemessage = JSON.parse(JSON.stringify(this.$refs.complex.savemessage()));
        const saveObjectmessage = this.$refs.complex.savObjemessage();
        const saveType = JSON.parse(this.$refs.complex.savObjemessage()).lists.result.length;
        this.resultData = savemessage;
        if (saveType > 0) {
          const value = `已经选中${this.$refs.complex.resultData.total}条数据`;


          if (!this.PropsData.fkobj.saveType) {
            const ids = $this.idslist;
            const Select = [
              {
                Label: value,
                ID: ids
              }
            ];
            this.selected = Select;
            this.valueInput = value;
            this.filterDate = savemessage;
          } else {
            this.selected = [
              {
                Label: value,
                ID: saveObjectmessage
              }
            ];
            this.filterDate = savemessage;
            this.valueInput = value;
          }
        } else {
          this.attachFilterClear();
          // this.$refs.AttachFilter.$refs.AutoComplete.disabled = false;
        }
      } else {
        this.valueInput = '';
        this.selected = [
          {
            Label: '',
            ID: ''
          }
        ];
        this.attachFilterClear();
      }
      

      // if (this.PropsData.fkdisplay === 'pop') {
      //   this.valueChange();
      // }
    },
    initresult(){
      clearTimeout(this.timer);
      this.timer = setTimeout(()=>{
         this.PropsNewData = Object.assign(this.PropsNewData, JSON.parse(JSON.stringify(this.PropsData)));
        this.PropsNewData.datalist = [{ "value": "更多筛选", "lable": 0 }];
        this.PropsNewData.datalist.push({
          url: this.PropsData.fkobj && this.PropsData.fkobj.url,
          value: '导入',
          lable: 2,
          sendData: {
            table: this.PropsData.fkobj && this.PropsData.fkobj.reftable
          }
        });
        this.PropsNewData.originalDatalist = [...this.PropsNewData.datalist];
          if (this.value && this.value[0] && this.value[0].ID && /选中/.test(this.value[0].Label)) {
            const data = Array.isArray(this.value[0].ID) ? this.value[0].ID : JSON.parse(this.value[0].ID);
            // 谢世华  修改处理默认值逻辑
            if (data.value) {
              data.value.reftable = this.PropsNewData.reftable;
              data.value.reftableid = this.PropsNewData.reftableid;
              data.value.serviceId = this.PropsNewData.serviceId;

              this.filterDate = {
                text: JSON.stringify(data.lists),
                value: data.value,
              };
              this.resultData = {
                text: JSON.stringify(data.lists),
                value: data.value,
              };
            }          }
           },400)
      }
      
  },
  created () {
    this.$http = this.http;
    this.select = [];
    this.valueInput = this.defaultValue;
    if (this.PropsData.disabled) {
      this.showDisabled = this.PropsData.disabled;
    } else {
      this.showDisabled = false;
    }

    if(Array.isArray(this.value)){
        this.selected = this.value;
      }
    if (this.selected && !this.selected[0]) {
      this.selected = [{
        Label: '',
        ID: ''
      }];
    }
    // if (this.PropsData.fkdisplay === 'pop') {
    //   this.PropsData.show = false;
    //   this.PropsNewData.componentType = myPopDialog;
    // } else {

    // }
    this.PropsNewData.componentType = Dialog;
    this.PropsData.show = true;
    this.initresult();
  }
};
</script>

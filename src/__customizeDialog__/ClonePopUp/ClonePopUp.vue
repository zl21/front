<template>
  <div class="clonePopUp">
    <div class="pop-title">
      <div class="pop-input">
        <ul>
          <li>
            <span>{{ chineseName.SOURCETABLENAME }}：</span>
            {{ o_table_name }}
          </li>
          <li class="resTop">
            <span><sub> *</sub>版本号：</span>
            <span class="version">
              <DropDownSelectFilter
                :single="true"
                :data="version.data"
                :total-row-count="version.totalRowCount"
                :data-empty-message="version.dataEmptyMessage"
                :auto-data="version.AutoData"
                @on-popper-show="getVersion"
                @on-fkrp-selected="getVersionID"
                @on-input-value-change="fuzzyquerybyak"
                @on-clear="clear"
              />
            </span>
          </li>
          <li>
            <span><sub> *</sub>{{ chineseName.TARGETTABLENVARCHAR }}：</span>
            <input
              v-model="t_table_name"
              type="text"
            >
          </li>
          <li>
            <span><sub> *</sub>{{ chineseName.TARGETDESCRIPTION }}：</span>
            <input
              v-model="s_table_name"
              type="text"
            >
          </li>
        </ul>
      </div>
      <div class="pop-btn">
        <button
          class="sav-btn"
          @click="save"
        >
          <span>{{ chineseName.CONFIRM }}</span>
        </button>
        <button
          class="cancel-btn"
          @click="cancel"
        >
          <span>{{ chineseName.CANCEL }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import ChineseDictionary from '../../assets/js/ChineseDictionary';
  import network, { urlSearchParams } from '../../__utils__/network';
  import { MODULE_COMPONENT_NAME } from '../../constants/global';

  export default {
    name: 'ClonePopUp',
    inject: [MODULE_COMPONENT_NAME],
    props: {
      objList: {
        type: Array,
        default: () => []
      },
      objTabActionDialogConfig: {
        type: Object,
        default: () => {}
      },
      idArray: {// 获取ID用于多选
        type: [Array, Object],
        default: () => {}
      },
      itemId: {// 获取当前子表表名
        type: String,
        default: () => ''
      },
      actionId: {// 获取自定按钮ID
        type: [Number, String],
        default: () => ''
      },
      popwinMessage: {// 获取popwin类型打开自定义弹框传入元数据信息
        type: Object,
        default: () => {}
      },
      saveDialog:{
         type: Function,
        default: () =>{

        }  
      }
    },
    data() {
      return {
        o_table_name: '', // 源表表名
        t_table_name: '', // 目标表名
        s_table_name: '', // 目标描述
        versionNumber: '', // 版本号
        errorDialog: false, // errorDialog
        errorDialogClass: 'error', // 弹框类型
        errorDialogTitle: '错误', // 弹框标题
        errorData: [{ message: '' }], // 弹框内容
        errorDialogBack: false, // 是否有返回按钮
        chineseName: {}, // 名字集合
        version: {
          data: {},
          totalRowCount: 39,
          pageSize: 10,
          AutoData: [],
          dataEmptyMessage: '数据加载中...', // 无数据的提示
          columns: ['name', 'value'] // 展现的组
        }
      };
    },
    components: {},
    methods: {
      clear() {
        this.version.ID = '';
      },
      getVersionID(value) {
        this.version.ID = value[0].ID;
      },
      getVersion() {
        const searchdata = {
          isdroplistsearch: true,
          table: 'AD_VERSION',
          startindex: 0,
          range: 10,
          fixedcolumns: {
            ISACTIVE: ['=Y'],
            STATUS: ['=1']
          }
        };
        network
          .post('/p/cs/QueryList', urlSearchParams({ searchdata }))
          .then((res) => {
            if (res.data.code === 0) {
              this.version.data = res.data.data;
              this.version.totalRowCount = res.data.data.totalRowCount;
              this.version.pageSize = res.data.data.totalRowCount.defaultrange;
            }
          });
      },
      fuzzyquerybyak(value) {
        const searchdata = {
          ak: value,
          colid: '99467',
          fixedcolumns: {}
        };
        network
          .post('/p/cs/fuzzyquerybyak', urlSearchParams(searchdata))
          .then((res) => {
            if (res.data.code === 0) {
              this.version.AutoData = res.data.data;
            }
          });
      },
      save() {
        let data  = [
          {TMCODE: "1212", ID: -1},
          {TMCODE: "2222", ID: -1},
          {TMCODE: "3333", ID: -1}];
          this.saveDialog(data,data).then((res)=>{
            console.log(res);
            if(res.data.code ===0){
               this.$emit('closeActionDialog', true); // 关闭弹框
            }
          });
           
        return;
        if (!this.t_table_name.trim()) {
          const data = {
            mask: true,
            title: '警告',
            content: '请输入目标表名'
          };
          this.$Modal.fcWarning(data);
        }
        if (!this.s_table_name.trim()) {
          const data = {
            mask: true,
            title: '警告',
            content: '请输入目标描述'
          };
          this.$Modal.fcWarning(data);
        }
        if (!this.version.ID) {
          const data = {
            mask: true,
            title: '警告',
            content: '请输入版本号'
          };
          this.$Modal.fcWarning(data);
        }
        this.$R3loading.show();
        const searchdata = {
          srctable: this.o_table_name, // 源表表名
          destable: this.t_table_name.trim(), // 目标表名
          destdesc: this.s_table_name.trim(), // 目标描述
          ad_version_id: this.version.ID
        };
        network.post('/p/cs/clone', searchdata)
          .then((res) => {
            const { tableName } = this.$route.params;
            if (res.data.code !== 0) {
              // const failInfo = [
              //   {
              //     message: '2测试A已有用户组用户关系记录，不允许删除！', // 报错信息
              //     objid: 11// 对应明细ID
              //   }
              // ];
              // const moduleComponentName = this[MODULE_COMPONENT_NAME];// 当前模块名称
              // this.$emit('closeActionDialog', true, failInfo, moduleComponentName); // 关闭弹框
              this.$emit('closeActionDialog', true); // 关闭弹框
              
            
              this.$R3loading.hide(tableName);
              return;
            }
            const data = {
              mask: true,
              title: '成功',
              content: '克隆成功'
            };
            this.$R3loading.hide(tableName);
            this.$Modal.fcSuccess(data);
            this.$emit('closeActionDialog', true); // 关闭弹框
          });
      }, // 确定
      cancel() {
        this.$emit('closeActionDialog', false); // 关闭弹框
      }, // 取消
      findName(data, name, val) {
        for (const i of data) {
          if (i.parentdesc === name) {
            for (const m of i.childs) {
              if (m.name === val) {
                return m.valuedata;
              }
            }
          }
        }
      },

    },
    created() {
      this.chineseName = ChineseDictionary;
    },
    mounted() {
      console.log('popwinMessage', this);
      this.o_table_name = this.findName(this.objList, '基本信息', '名称');
    },
    destroyed() {
      const dom = document.getElementById('dropDownSelectPopper');
      if (dom) {
        dom.parentNode.removeChild(dom);
      }
    },
  };
</script>
<style lang="less" scoped type="text/less">
.clonePopUp {
  font-size: 12px;
  height: 174px;
  sub{
    color: red;
    font-size: 16px;
    margin-right: 5px;

  }
  .pop-title {
    // width: 400px;
    height: 152px;
    box-sizing: border-box;
  }
  .pop-input {
    padding-top: 10px;
    ul {
      list-style: none;
    }
    li {
      margin-bottom: 10px;
      .version {
        width: 228px;
        height: 22px;
        border-radius: 2px;
      }
    }
    .resTop{
      margin-bottom: 15px;
    }
    span {
      display: inline-block;
      width: 100px;
      text-align: right;
    }
    input {
      border: 1px solid #d8d8d8;
      width: 228px;
      height: 24px;
      padding: 0 7px;
      border-radius: 2px;
      font-size: 12px;
      color: #575757;
      transition: border-color 0.2s ease;
      margin-left: -1px;
    }
    input:focus {
      border-color: #0f8ee9;
    }
  }
  .pop-btn {
    text-align: right;
    padding: 6px 40px 0 0;
    .sav-btn,
    .cancel-btn {
      padding: 0 18px;
      width: 66px;
      height: 24px;
      box-sizing: border-box;
      background-color: #fff;
      border: 1px solid;
      color: #fd6442;
      font-size: 12px;
      border-radius: 2px;
      span {
        color: #fd6442;
      }
    }
    .sav-btn:hover,
    .cancel-btn:hover {
      background-color: rgba(253, 100, 66, 0.3);
      color: rgba(253, 100, 66, 0.6);
    }
  }
}
</style>

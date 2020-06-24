<template>
  <!-- v-if="newformList.addcolums" -->
  <div
    ref="modify"
  >
    <ModalConfirm
      ref="Modal"
      :title="poptitle"
      :width="width"
      :loading="loading"
      :title-align="titleAlign"
      :footer-hide="true"
      @on-cancle="oncancle"
    >
      <div
        slot="Modalsolt"
        class="ModalModify"
      >
        <Spin
          v-if="loading"
          fix
        >
          <Icon
            type="ios-loading"
            size="18"
            class="demo-spin-icon-load" 
          />
        </Spin>
        <div class="modify-tip">
          已选中批量修改记录数：{{ ids }}行
        </div>
        <component 
          :is="'CompositeFormpop'"
          :default-data="newformList"
          :default-column-col="formList.objviewcol"
          class="pop-formPanel"
          type=""
          @formChange="formChange"
        />
        <div class="button R3-button-group modifyButton">
          <Button
            type="fcdefault"
            @click="oncancle"
          >
            取消
          </Button>
          <Button
            type="primary"
            style="margin:0 0 0 10px;"
            @click="confirm"
          >
            确认
          </Button>
        </div>
      </div>
    </ModalConfirm>
  </div>
</template>
<script>
  import { Version } from '../constants/global';
  import ModalConfirm from './Dialog/Confirm.vue';


  const fkHttpRequest = () => require(`../__config__/actions/version_${Version()}/formHttpRequest/fkHttpRequest.js`);

  export default {
    name: 'ModifyDialog',
    components: {
      ModalConfirm
    },
    data() {
      return {
        buttonData: {}, // 按钮信息
        formList: {},
        newformList: {},
        formChangeData: {},
        fixedcolumns: {},
        defaultData: {},
        Condition: 'list',
        changeType: 'Modify',
        objids: [],
        poptitle: '批量修改',
        loading: false,
        type: false, // 判断是勾选 还是批量
        router: {},
        ids: []
      };
    },
    props: {
      title: {
        type: String,
        default() {
          return '标题';
        }
      },
      reffixedcolumns: {
        type: Object,
        default: () => {}
      },
      titleAlign: {
        type: String,
        default: () => 'center'
      }, // 设置标题是否居中 // center left
      width: {
        type: Number,
        default: () => 940
      }, // 设置标题是否居中 // center left
    },
    created() {
      // const searchObject = {
      //   table: this.router.tableName
      // };
      // this.getData(searchObject);
    },
    watch: {
      formList: {
        handler(val) {
          if (Object.hasOwnProperty.call(val, 'addcolums')) {
            let childs = val.addcolums.reduce((arr, item) => {
              const itemChilds = item.childs || item.child;
              if (Array.isArray(itemChilds)) {
                itemChilds.forEach((option) => {
                  option.isnotnull = false;
                });
                arr.push(itemChilds);
              } else {
                itemChilds.isnotnull = false;
                if (itemChilds.display !== 'hr') {
                  arr.push(itemChilds);
                }
              }   
              

              return arr;
            }, []);

            childs = childs.flat();
            this.newformList = {
              inpubobj: childs,
              objviewcol: val.objviewcol
            };
            // this.newformList = {
            //   addcolums: [{
            //     hrdisplay: 'expand',
            //     parentdesc: '批量修改',
            //     parentname: val.addcolums[0].parentname,
            //     childs
            //   }],
            //   objviewcol: val.objviewcol
            // };
          }
        },
        deep: true

      }
    },
    methods: {
      getData(searchObject) {
        fkHttpRequest().fkModify({
          searchObject,
          success: (res) => {
            if (res.data.code === 0) {
              this.loading = false;

              this.formList = res.data.data;
            }
          }
        });
      },
      oncancle() {
        this.$emit('on-oncancle-success', this);
      },
      saveDataOld() {
        this.loading = true;
        const localdata = {
          table: this.router.tableName, // 表名
          column_include_uicontroller: true, //
          reffixedcolumns: {}, // 左边树
        };
        if (!this.type) {
          localdata.objids = this.objids;
        } else {
          localdata.fixedcolumns = this.fixedcolumns; // 参数 条件 
        }
        
        const searchObject = {
          data: {
            [this.router.tableName]: this.formChangeData
          },
          after: {
            [this.router.tableName]: this.defaultData
          },
          searchdata: localdata
        };
        fkHttpRequest().fksaveModify({
          buttonData: this.buttonData,
          searchObject,
          success: (res) => {
            this.loading = false;
            if (res.data.code === 0) {
              this.$emit('on-save-success', res.data);
            }
          }
        });
      },
      saveData() {
        this.loading = true;
        const localdata = {
          table: this.router.tableName, // 表名
          column_include_uicontroller: true, //
          reffixedcolumns: {}, // 左边树
        };
        if (!this.type) {
          localdata.objids = this.objids;
        } else {
          localdata.fixedcolumns = this.fixedcolumns; // 参数 条件 
        }
        const searchObject = {
          fixedData: this.formChangeData,
          searchdata: localdata
        };
        fkHttpRequest().fksaveModify({
          buttonData: this.buttonData,
          searchObject,
          success: (res) => {
            this.loading = false;
            if (res.data.code === 0) {
              this.$emit('on-save-success', res.data);
            }
          }
        });
      },
      open(router, ids, fixedcolumns, id, buttonData) {
        //  打开弹窗
        this.buttonData = buttonData;
        this.ids = ids;
        this.router = router;
        if (id === 'all') {
          this.fixedcolumns = fixedcolumns || {};
          this.type = true;
        } else {
          this.objids = id;
          this.type = false;
        }
        this.$refs.Modal.open();
        this.loading = true;
        const searchObject = {
          table: router.tableName
        };
        this.getData(searchObject);
      },
      formChange(data, defaultData, changeData) {
        // form 修改的数据
        this.formChangeData = Object.assign({}, data);
        this.defaultData = Object.assign({}, changeData);
        Object.keys(this.defaultData).forEach((item) => {
          if (this.defaultData[item] === '' || this.defaultData[item] === undefined) {
            delete this.formChangeData[item];
            delete this.defaultData[item];
          }
        });
      },
      checkData() {
        return Object.keys(this.formChangeData).length > 0;
      },
      confirm() {
        // b保存提交
        const checkTip = this.checkData();
        if (!checkTip) {
          const message = {
            mask: true,
            title: '提醒',
            content: '没有数据更新，请确认！',
          };
          this.$Modal.fcWarning(message);
          return false;
        }
        this.loading = true;
        if (Version() === '1.3') {
          this.saveDataOld();
        } else {
          this.saveData();
        }
        return true;
      }
    },
    mounted() {
    }
  };
</script>
<style lang="less" scoped>
.modify-tip {
    display: inline-block;
    margin-left: 20px;
    font-size: 12px;
    margin: 0px 0 10px;
    height: 24px;
    line-height:24px;
}
.modifyButton{
    text-align: right;
    position: absolute;
    bottom: 0px;
    right: 0px;

}
.ModalModify{
  position: relative;
  max-height: 500px;
  overflow: auto;
  padding-bottom: 40px
}
.pop-formPanel{
    padding: 16px;
    border: 1px solid #dcdee2
}
</style>

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
      @on-ok="confirm"
      @on-cancle="oncancle"
    >
      <div slot="Modalsolt">
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
        formList: {},
        newformList: {},
        formChangeData: {},
        fixedcolumns: {},
        Condition: 'list',
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
              console.log(item.childs || item.child);
              const itemChilds = item.childs || item.child;
              if (Array.isArray(itemChilds)) {
                itemChilds.forEach((option) => {
                  option.isnotnull = false;
                });
              }   
              arr.push(itemChilds);

              return arr;
            }, []);
            console.log(childs);

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
          searchObject,
          success: (res) => {
            this.loading = false;
            this.$emit('on-save-success', res);
          }
        });
      },
      open(router, ids, fixedcolumns, id) {
        //  打开弹窗
        console.log(id, fixedcolumns);
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
      formChange(data) {
        // form 修改的数据

        this.formChangeData = Object.assign(this.formChangeData, data);
      },
      confirm() {
        // b保存提交
        this.saveData();
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
.pop-formPanel{
    padding: 16px;
    border: 1px solid #dcdee2
}
</style>

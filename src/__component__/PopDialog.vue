<template>
  <!-- v-if="newformList.addcolums" -->
  <div
    ref="modify"
  >
    <composite-form></composite-form>
  </div>
</template>
<script>
  import CompositeForm from './CompositeForm.vue';
  import { Version } from '../constants/global';
  import ModalConfirm from './Dialog/Confirm.vue';

  // eslint-disable-next-line import/no-dynamic-require
  const {
    fkModify, fksaveModify
  // eslint-disable-next-line import/no-dynamic-require
  } = require(`../__config__/actions/version_${Version}/formHttpRequest/fkHttpRequest.js`);

  export default {
    name: 'PopDialog',
    components: {
      CompositeForm
    },
    data() {
      return {
        formList: {},
        newformList: {},
        formChangeData: {},
        loading: false,
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
        default: () => 900
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
              arr.push(item.childs);
              return arr;
            }, []);
            childs = childs.flat();
            this.newformList = {
              addcolums: [{
                hrdisplay: 'expand',
                parentdesc: '批量修改',
                parentname: val.addcolums[0].parentname,
                childs
              }],
              objviewcol: val.objviewcol
            };
          }
        },
        deep: true

      }
    },
    methods: {
      getData(searchObject) {
        fkModify({
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
          reffixedcolumns: this.reffixedcolumns, // 左边树
        };
        if (this.ids.length > 0) {
          localdata.objids = this.ids;
        } else {
          localdata.reffixedcolumns = this.reffixedcolumns;// 左边树
        }
        const searchObject = {
          fixedData: this.formChangeData,
          searchdata: localdata
        };
        fksaveModify({
          searchObject,
          success: (res) => {
            this.loading = false;
            this.$emit('on-save-success', res);
          }
        });
      },
      open(router, ids) {
        //  打开弹窗
        this.ids = ids;
        this.router = router;
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
<style lang="less" scope>
.modify-tip {
    display: inline-block;
    margin-left: 20px;
    font-size: 12px;
    margin: 0px 0 10px;
    height: 24px;
    line-height:24px;
}
</style>

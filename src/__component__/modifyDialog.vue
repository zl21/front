<template>
  <!-- v-if="newformList.addcolums" -->
  <div
    
    ref="modify"
  >
    <ModalConfirm
      ref="Modal"
      :title="title"
      :width="width"
      :title-align="titleAlign"
      @on-ok="confirm"
    >
      <div slot="Modalsolt">
        <div class="modify-tip">
          已选中批量修改记录数：{{ ids.length }}行
        </div>
        <component 
          :is="'CompositeFormPanel'"
          :default-data="newformList"
          :default-column-col="formList.objviewcol"
          class="formPanel"
          type="PanelForm"
          @formChange="formChange"
        />
      </div>
    </ModalConfirm>
  </div>
</template>
<script>
  import CompositeFormPanel from './CompositeForm.vue';
  import { Version } from '../constants/global';
  import ModalConfirm from './Dialog/Confirm.vue';

  // eslint-disable-next-line import/no-dynamic-require
  const {
    fkModify, fksaveModify
  // eslint-disable-next-line import/no-dynamic-require
  } = require(`../__config__/actions/version_${Version}/formHttpRequest/fkHttpRequest.js`);

  export default {
    name: 'ModifyDialog',
    components: {
      CompositeFormPanel, ModalConfirm
    },
    data() {
      return {
        formList: {},
        newformList: {},
        formChangeData: {},
        ids: []
      };
    },
    props: {
      router: {
        type: Object,
        default() {
          return {};
        }
      },
      title: {
        type: String,
        default() {
          return '标题';
        }
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
                parentdesc: '采购单',
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
              this.formList = res.data.data;
            }
          }
        });
      },
      saveData() {
        fksaveModify({

        });
      },
      open(router, ids) {
        this.ids = ids;
        this.$refs.Modal.open();
        const searchObject = {
          table: router.tableName
        };
        this.getData(searchObject);
      },
      formChange(data) {
        this.formChangeData = Object.assign(this.formChangeData, data);
      },
      confirm() {
        console.log(this, 'confirmconfirmconfirm');
      }
    },
    mounted() {
      console.log(this.$refs);
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

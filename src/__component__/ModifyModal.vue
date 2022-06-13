<template>
  <!-- v-if="newformList.addcolums" -->
  <div ref="modify">
    <ModalConfirm
      ref="Modal"
      :title="poptitle"
      :width="width"
      :loading="loading"
      :title-align="titleAlign"
      :footer-hide="true"
      @on-cancle="oncancle"
    >
      <div slot="Modalsolt" :class="classes">
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
          {{$t('messages.selectedModifiedRecord',{total:ids})}}
        </div>
        <component
          :is="'panelForm'"
          :defaultData="newformList"
          :CollapseName="CollapseName"
          :tableName="tableName"
          class="pop-formPanel"
          type=""
          @on-changeForm="formChange"
        />
        <div class="button R3-button-group modifyButton">
          <Button
            type="fcdefault"
            @click="oncancle"
          >
            {{$t('buttons.cancel')}}
          </Button>
          <Button
            type="primary"
            style="margin:0 0 0 10px;"
            @click="confirm"
          >
            {{$t('buttons.confirm')}}
          </Button>
        </div>
      </div>
    </ModalConfirm>
  </div>
</template>
<script>
  import { Version, classFix } from '../constants/global';
  import ModalConfirm from './Dialog/Confirm.vue';
import CollapseName from './FormComponents/childrenForm/CollapseComponent.vue';

  let fkHttpRequest = undefined
  import(`../__config__/actions/version_${Version()}/formHttpRequest/fkHttpRequest.js`).then(data => {
    fkHttpRequest = () => data
  })
  // const fkHttpRequest = () => require(`../__config__/actions/version_${Version()}/formHttpRequest/fkHttpRequest.js`);

  export default {
    name: 'ModifyDialog',
    components: {
      ModalConfirm,
    },
    data() {
      return {
        buttonData: {}, // 按钮信息
        formList: {},
        newformList: {},
        formChangeData: {},
        fixedcolumns: {},
        defaultData: {},
        CollapseName: CollapseName,
        Condition: 'list',
        changeType: 'Modify',
        objids: [],
        poptitle: this.$t('buttons.batchEdit'),
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
          return this.$t('tips.title');
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
      this.tableName = 'BatchModal';
      // const searchObject = {
      //   table: this.router.tableName
      // };
      // this.getData(searchObject);
    },
    computed: {
      classes() {
        return [
          `${classFix}ModifyDialog`,
        ];
      },
    },
    watch: {
      formList: {
        handler(val) {
          if (Object.hasOwnProperty.call(val, 'addcolums')) {
            let childs = val.addcolums.reduce((arr, item) => {
              const itemChilds = item.childs || item.child;
              if (Array.isArray(itemChilds)) {
                itemChilds.forEach((option) => {
                  // isnotnull 去除必填
                  option.isnotnull = false;
                  // onjump 不要外键跳转
                  option.onjump = true;
                  if(option.display ==='switch'){
                      option.display = 'select';
                  }
                  
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
              addcolums:  [{
                  childs: childs,
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
            } else if (res.data.error) {
              this.$emit('on-oncancle-success', this);
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
        console.log(data, '=============', changeData);
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
            title: this.$t('feedback.alert'),
            content: this.$t('messages.noUpdatedData'),
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

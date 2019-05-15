<template>
  <div>
    <Modal
      v-model="modalVisible"
      :title="completeTitle"
      :mask="true"
      :closable="true"
      :width="width"
      class="importDialog"
    >
      <div>
        <div class="importICon">
          <span class="icon-span">
            <i>&#xe633;</i>
          </span>
        </div>
        <div class="import-panel">
          <div class="el-upload__tip">
            {{ ChineseDictionary.IMPORTTITLE }}
            <a @click.stop="downloadTemplate">{{ ChineseDictionary.DOWNTEMPLATE }}</a>
          </div>
          <div class="upload-panel">
            <Button
              type="posdefault"
              :size="buttonSize"
            >
              选择文件
            </Button>

            <input
              class="fileInput"
              type="file"
              name
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              @change="fileChange($event)"
            >
            <!-- <label for="选择文件上传" /> -->
            <div
              slot="tip"
              class="tip"
            >
              {{ ChineseDictionary.FILEMAX }}{{ fileSize }}
            </div>
          </div>

          <transition name="fade">
            <span v-if="loading">数据正在导入中，请稍候</span>
          </transition>
        </div>
      </div>
      <div slot="footer">
        <div>
          <Button
            type="fcdefault"
            :disabled="loading"
            :size="buttonSize"
            @click="submitUpload()"
          >
            {{ ChineseDictionary.IMPORT }}
          </Button>

          <Button
            type="fcdefault"
            :size="buttonSize"
            @click.stop="closeDialog(false)"
          >
            {{ ChineseDictionary.CANCEL }}
          </Button>
        </div>
        <div v-if="errorMsg.errorList.length>0">
          <div class="error-message">
            <div>
              <i class="iconfont">&#xe631;</i>
            </div>
            <div>
              <p
                v-if="errorMsg.errorUrl.length > 0"
                class="link"
              >
                <a :href="errorMsg.errorUrl">（下载报错信息）</a>
              </p>
              <div>
                <p>{{ errorMsg.message }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import ChineseDictionary from '../assets/js/ChineseDictionary';
  import network, { urlSearchParams } from '../__utils__/network';

  export default {
    props: {
      name: {
        type: Boolean,
        default: false
      },
      visible: {
        // 显示
        type: Boolean,
        default: true
      },
      title: {
        // 标题
        type: String,
        default: ''
      },
      tablename: {
        // 表名
        type: String,
        default: ''
      },
      mainTable: {
        // 主表名
        type: String,
        default: ''
      },
      mainId: {
        // 主表id
        type: Number,
        default: -1
      },
      width: {
        // 宽度
        type: String,
        default: '630'
      }
    },
    components: {
    //   MyDialog,
    },
    data() {
      return {
        modalVisible: false,
        showFlag: false,
        loading: false, // 是否加载
        ChineseDictionary: {},
        fileSize: '', // 文件尺寸
        importFlies: [], // 导入文件列表
        errorMsg: {
          // 错误信息
          errorUrl: '',
          message: '',
          errorList: []
        },
        files: [],
        buttonSize: 'small'
      };
    },
    mounted() {
      this.ChineseDictionary = ChineseDictionary;
      if (this.visible) this.modalVisible = true;
      else this.modalVisible = false;
      this.axiosSetting();
    }, 
    watch: {
      visible: {
        handler(val, oldval) {
          if (this.visible) this.modalVisible = true;
          else this.modalVisible = false;
          console.log('🐘', this.visible);
          console.log('🐘', val, oldval);
        },
        deep: true
      },
    },
    computed: {
      completeTitle() {
        return `${this.title}导入`;
      }
    },

    methods: {
      fileChange(e) {
        this.files = e.target.files;
      },
      // 发送请求, 获取上传参数
      axiosSetting() {
        network
          .post(
            '/p/cs/settings',
            urlSearchParams({
              configNames: JSON.stringify(['upload.import.max-file-size'])
            })
          )
          .then((res) => {
            if (res.data.code === 0) { this.fileSize = res.data.data['upload.import.max-file-size']; } else this.fileSize = '0M';
          })
          .catch((error) => {
            if (error.response.status === 403) {
              this.closeDialog();
            }
            this.fileSize = '0M';
          });
      },
      // 发送请求, 下载模板
      downloadTemplate() {
        network
          .get(
            '/p/cs/downloadImportTemplate',
            urlSearchParams({
              searchdata: {
                table: this.tablename
              }
            })
          )
          .then((res) => {
            if (res.data.code === 0) {
              const url = `/p/cs/download?filename=${res.data.data}`;
              window.location = url;
            }
          });
      },
      // 提交上传文件请求
      submitUpload() {
        if (this.files.length === 0) {
          this.$Modal.fcWarning({
            title: '警告',
            content: '请先选择要导入的文件！'
          });
        }
        if (this.mainId === -1) {
          // 如果主表未新增
          this.$emit('objectSave');
        }
        network.post(`${this.action}`).then((res) => {
          if (res.data.code === 0) {
          }
        });
      },
      // 清除用户选择文件列表
      clearFile() {
        this.$refs.upload.clearFiles();
        this.loading = false;
      },
      // 上传文件前判断文件大小
      handleBefore(file) {
        const sizes = ['B', 'K', 'M', 'G', 'T'];
        let p;
        const unit = this.fileSize.substr(this.fileSize.length - 1);
        const number = this.fileSize.substr(0, this.fileSize.length - 1);
        for (let i = 0; i < sizes.length; i++) {
          if (unit === sizes[i]) {
            p = i;
            break;
          }
        }
        if (file.size > parseInt(number) * Math.pow(1024, p)) {
          this.$message(`文件最大${this.fileSize}`);
          this.clearFile();
          return false;
        }
        this.loading = true;
      },
      // 上传成功
      handleSuccess(response, file, fileList) {
        const _self = this;
        this.loading = false;
        if (response.code === 0) {
          //          _self.$message({message: response.message, type: 'success'});
          _self.$store.dispatch('timingCalcAsyncTask', { id: response.data });
          _self.closeDialog();
        } else {
          if (undefined === response.path) _self.errorMsg.errorUrl = '';
          else { _self.errorMsg.errorUrl = `/p/cs/download?filename=${response.path}`; }
          _self.errorMsg.errorList = response.data || [
            { rowIndex: 0, message: '' }
          ];
          _self.errorMsg.message = response.message;
          _self.clearFile();
        }
        this.$emit('confirmImport', event);
      },
      // 上传失败
      handleError(err, file, fileList) {
        if (err.status === 403) {
          this.$store.commit('beforeSignout');
          this.closeDialog();
        } else {
          this.$store.commit('errorDialog', {
            // 弹框报错
            message: err
          });
          this.clearFile();
        }
      },
      closeDialog(option) {
        // this.showFlag = option || false;
        // const close = this.$store.state[getModuleName()].buttons.importData.importDialog;
        // this.$store.state.commit('setImportDialogTitle', // 弹框报错
        //                          this.$store.state[getModuleName()].buttons.importData.importDialog = false);
        // this.visible = option || false;
        // this.$emit('update:visible', close);
        this.$emit('closeDialog');
      }
    }
  };
</script>
<style lang="less">
.importDialog {
  .importICon {
    margin: 0;
    text-align: center;
    .icon-span {
      display: inline-block;
      height: 28px;
      width: 28px;
      i {
        color: #09a155;
        font-size: 28px;
      }
    }
  }
  .import-panel {
    padding: 0 40px;
    position: relative;
    .el-upload__tip {
      margin-top: 10px;
      font-size: 12px;
      color: #575757;
    }
    .upload-panel {
      height: 50px;
      margin-top: 10px;
    }
  }
  .fileInput {
    position: relative;
    left: -67px;
    opacity: 0;
    width: 62px;
  }
  .tip {
    font-size: 12px;
    display: inline-block;
    margin-left: -61px;
    color: #b8b8b8;
  }
  // .burgeon-modal-header {
  //   height: 30px !important;
  //   line-height: 30px !important;
  //   background: #f8f8f8 !important;
  //   border-top-right-radius: 10px !important;
  //   border-top-left-radius: 10px !important;
  //   .modal-header-inner {
  //     padding: 0;
  //     height: 30px !important;
  //     line-height: 30px !important;
  //     text-align: center !important;
  //     background: #f8f8f8 !important;
  //     border-bottom: solid 1px #ddd !important;
  //     border-top-right-radius: 10px !important;
  //     border-top-left-radius: 10px !important;
  //     cursor: move !important;
  //   }
  //   .burgeon-modal-header-inner {
  //     line-height: 31px !important;
  //     font-size: 13px !important;
  //     color: #303133 !important;
  //     font-weight: normal;
  //   }
  // }
  .burgeon-modal-body {
    padding: 20px !important;
  }
  .burgeon-icon-ios-close {
    color: #999 !important;
  }
  .burgeon-modal-footer {
    border-top: none !important;
    padding: 0 20px 20px;
    margin: 10px 40px;
  }
  .burgeon-btn-fcdefault {
    height: 24px !important;
    font-size: 12px !important;
    width: 66px !important;
    padding: 0 !important;
  }
  .burgeon-modal-footer button > span {
    font-size: 12px;
  }
}
</style>

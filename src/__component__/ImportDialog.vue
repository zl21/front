<template>
  <div>
    <Modal
      v-model="modalVisible"
      :title="completeTitle"
      :mask="true"
      :closable="true"
      :mask-closable="false"
      :width="width"
      class="importDialog"
    >
      <div>
        <div class="importICon">
          <span class="icon-span">
            <i class="iconfont iconbj_import" />
          </span>
        </div>
        <div class="import-panel">
          <div class="el-upload__tip">
            有效数据起始行:<input
              :value="inpNum"
              class="inputValue"
              type="text"
              placeholder="只能输入正整数"
              @input="handleInput"
              @change="handleInput"
            >;
            <Checkbox
              v-model="singleValue"
              class="singleValue"
            />
            AK重复是否更新已有记录;
          </div>
          <!-- <div class="el-upload__tip">
           
          </div> -->
          <div class="el-upload__tip">
            {{ ChineseDictionary.IMPORTTITLE }}
            <a
              @click.stop="downloadTemplate"
            >{{ ChineseDictionary.DOWNTEMPLATE }}</a>
          </div>
          <div class="upload-panel">
            <Button
              type="posdefault"
              :size="buttonSize"
            >
              选择文件
            </Button>

            <input
              id="file"
              class="fileInput"
              type="file"
              name
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              @change="fileChange($event)"
              @click="clearFile"
            >
            <!-- <label for="选择文件上传" /> -->
            <div
              class="tip"
            >
              {{ ChineseDictionary.FILEMAX }}{{ fileSizeNumber }}
            </div>
            <div class="fileName">
              {{ fileName }}
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
        <div
          v-if="errorMsg.errorList.length>0"
          class="error-content"
        >
          <div class="error-message">
            <div class="left-icon">
              <i class="iconfont">&#xecd0;</i>
            </div>
            <div class="right-content">
              <p
                v-if="errorMsg.errorUrl.length > 0"
                class="link"
              >
                <a :href="errorMsg.errorUrl">（下载报错信息）</a>
              </p>
              <div class="content-message">
                <p class="title">
                  {{ errorMsg.message }}
                </p>
                <p
                  v-for="(msg,index) in errorMsg.errorList"
                  :key="index"
                >
                  <span v-if="msg.rowIndex">第{{ msg.rowIndex }}条记录报错:</span>
                  {{ msg.message }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios';
  import ChineseDictionary from '../assets/js/ChineseDictionary';
  import network, { urlSearchParams, getGateway } from '../__utils__/network';
  import Upload from '../__utils__/upload';
  import { Version } from '../constants/global';

  export default {
    name: 'ImportDialog',
    props: {
      name: {
        type: Boolean,
        default: false
      },
      visible: {
        // 显示
        type: Boolean,
        default: false
      },
      title: {
        // 标题
        type: String,
        default: ''
      },
      tablename: {
        // 子表名
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
        type: [Number, String],
        default: -1
      },
      width: {
        // 宽度
        type: String,
        default: '630'
      }
    },
    components: {},
    data() {
      return {
        inputValue: '2', // 有效起始行
        singleValue: '', // 更新记录
        modalVisible: false,
        showFlag: false,
        loading: false, // 是否加载
        ChineseDictionary: {},
        fileSizeNumber: '',
        fileSize: '', // 文件尺寸
        importFlies: [], // 导入文件列表
        errorMsg: {
          // 错误信息
          errorUrl: '',
          message: '',
          errorList: []
        },
        files: [],
        buttonSize: 'small',
        fileName: ''
      };
    },
    watch: {
      modalVisible: {
        handler(val) {
          if (!val) {
            this.$emit('closeDialog');
          }
        }
      }
    },
    mounted() {
      this.ChineseDictionary = ChineseDictionary;
      if (this.visible) this.modalVisible = true;
      else this.modalVisible = false;
      this.axiosSetting();
    },

    computed: {
      completeTitle() {
        return `${this.title}导入`;
      },
      inpNum() {
        return this.inputValue;
      }
    },

    methods: {
      handleInput(event) {
        const val = event.target.value.trim();
        // 只能是正整数或空,可根据需求修改正则
        if (/^[1-9]\d*$|^$/.test(val)) {
          this.inputValue = val;
        } else {
          event.target.value = this.inputValue;
        }
      },
      clearFile() {
        this.fileName = '';
        this.loading = false;
        this.files = [];
        const fileDom = document.getElementById('file');
        fileDom.value = '';
      },
      fileChange(e) {
        this.errorMsg = {
          // 错误信息
          errorUrl: '',
          message: '',
          errorList: []
        };
        this.files = e.target.files[0];
        this.fileName = e.target.files[0].name;
        this.fileSize = e.target.files[0].size;
      },
      // 发送请求, 获取上传参数
      axiosSetting() {
        network.post('/p/cs/settings',
                     urlSearchParams({
                       configNames: JSON.stringify(['upload.import.max-file-size'])
                     })).then((res) => {
          if (res.data.code === 0) {
            this.fileSizeNumber = res.data.data['upload.import.max-file-size'];
          } else this.fileSizeNumber = '0M';
        })
          .catch((error) => {
            if (error.response.status === 403) {
              this.closeDialog();
            }
            this.fileSizeNumber = '0M';
          });
      },
      // 发送请求, 下载模板
      downloadTemplate() {
        // 下载模版
        const path = getGateway('/p/cs/downloadImportTemplate');
        axios({
          url: path,
          method: 'get',
          params: {
            searchdata: {
              table: this.tablename
            }
          }
        }).then((res) => {
          if (res.data.code === 0) {
            const url = `${getGateway('/p/cs/download')}?filename=${
              res.data.data
            }`;
            window.location = url;
          }
        });
      },
      // 提交上传文件请求
      submitUpload() {
        if (this.files.length === 0) {
          this.$Modal.fcWarning({
            title: '警告',
            mask: true,
            content: '请先选择要导入的文件！'
          });
          return;
        } 
        this.uploadFileChange();
      },
      uploadFileChange() {
        this.errorMsg = {
          // 错误信息
          errorUrl: '',
          message: '',
          errorList: []
        };
        this.loading = true;
        // 上传文件
        const fileInformationUploaded = this.files;
        this.$loading.show();
        const url = `${getGateway('/p/cs/import')}`;
        const updataValue = this.singleValue ? 'Y' : 'N';
        const sendData = {
          table: this.tablename,
          mainTable: this.mainTable,
          mainId: this.mainId,
          menu: this.title,
          isUpdate: updataValue,
          startRow: this.inpNum
        };
        const aUploadParame = Object.assign(
          {},
          {
            target: fileInformationUploaded,
            url,
            sendData,
            imgSize: this.fileSize,
            success: this.handleSuccess,
            onerror: this.handleError,
            onloadstart: this.onloadstart,
            type: 'file'

          }
        );
        const article = new Upload(aUploadParame);
      },

      // 上传成功
      handleSuccess(response) {
        const { tableName } = this.$route.params;
        if (response.code === 0) {
          if (Version() === '1.4') {
            this.$loading.hide(tableName);
            this.closeDialog();
            this.fileName = '';
            this.$Modal.fcSuccess({
              title: '成功',
              mask: true,
              content: response.message
            });
          } else {
            this.$emit('imporSuccess', response.data);
          }
        } else {
          this.$loading.hide(tableName);
          if (response.data) {
            if (response.data.path) {
              if (response.data.path === 'undefined ===') {
                this.errorMsg.errorUrl = '';
              } else {
                this.errorMsg.errorUrl = `/p/cs/download?filename=${
                  response.data.path
                }`;
              }
            }
            this.errorMsg.errorList = response.data.error || [
              { rowIndex: 0, message: '' }
            ];
          } else {
            this.errorMsg.errorList = response.error || [
              { rowIndex: 0, message: '' }
            ];
          }
          this.errorMsg.message = response.message;
          // this.$Modal.fcWarning({
          //   title: '警告',
          //   mask: true,
          //   content: response.message
          // });
          this.clearFile();
        }
        this.$emit('confirmImport');
      },
      // 上传失败
      handleError(e) {
        const { tableName } = this.$route.params;
        this.$loading.hide(tableName);
        const emg = e;
        let formatJsonEmg = null;
        try {
          formatJsonEmg = JSON.stringify(JSON.parse(emg), null, 4);
        } catch (v) {
          if (typeof emg === 'string') {
            formatJsonEmg = emg.replace(/<br\/>/g, '\r\n');
          }
        }
        window.vm.$Modal.fcError({
          mask: true,
          titleAlign: 'center',
          title: '错误',
          render: h => h('div', {
            style: {
              padding: '10px 20px 0',
              display: 'flex',
              lineHeight: '16px'
            }
          }, [
            
            h('i', {
              props: {
              },
              style: {
                marginRight: '5px',
                display: 'inline-block',
                'font-size': '28px',
                'margin-right': ' 10px',
                'line-height': ' 1',
                padding: ' 10px 0',
                color: 'red'
              },
              class: 'iconfont iconbj_error fcError '
            }),
            h('div', {
              style: `width: 80%;
                  margin: 1px;
                  margin-bottom: -8px;
                  box-sizing: border-box;
                  padding: 5px;
                  resize: none;
                  max-height: 100px;
                  max-width: 300px;
                  overflow: auto;
                  `
            }, formatJsonEmg)
          ])
        });
        this.clearFile();
        this.closeDialog();
      },
      closeDialog() {
        this.modalVisible = false;
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
      .inputValue{
        border: none;
        border-bottom: 1px solid #b8b8b8;
        text-align: center;
        width: 100px;
      }
      .singleValue{
        margin-left:10px;
      }
    }
    .upload-panel {
      height: 50px;
      margin-top: 10px;
    }
    .fileName {
      height: 21px;
      line-height: 21px;
      color: #606266;
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
  .error-content {
    border-top: solid 1px #bcbcbc;
    text-align: left;
    position: relative;
    font-size: 12px;
    margin-top: 10px;
    .error-message {
      height: auto;
      margin: 10px 0px;
      max-height: 240px;
      position: relative;
      width: 550px;
      .left-icon {
        height: 28px;
        width: 28px;
        position: absolute;
        left: 0;
        top: 0;
        i {
          font-size: 28px;
          color: #e80000;
        }
      }
      .right-content {
        position: relative;
        margin-left: 38px;
        .link {
          line-height: 16px;
          a {
            color: #0f8ee9;
            cursor: pointer;
            display: inline-block;
            padding-top: 6px;
            text-decoration: none;
          }
        }
        .content-message {
          max-height: 220px;
          min-height: 28px;
          overflow: auto;
          p {
            word-break: break-word;
            line-height: 16px;
            margin: 6px 0;
          }
        }
      }
    }
  }
  // .ark-modal-header {
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
  //   .ark-modal-header-inner {
  //     line-height: 31px !important;
  //     font-size: 13px !important;
  //     color: #303133 !important;
  //     font-weight: normal;
  //   }
  // }
  .ark-modal-body {
    padding: 20px !important;
  }
  .ark-icon-ios-close {
    color: #999 !important;
  }
  .ark-modal-footer {
    border-top: none !important;
    padding: 0 20px 20px;
    margin: 10px 40px;
  }
  .ark-btn-fcdefault {
    height: 24px !important;
    font-size: 12px !important;
    width: 66px !important;
    padding: 0 !important;
  }
  .ark-modal-footer button > span {
    font-size: 12px;
  }
}
</style>

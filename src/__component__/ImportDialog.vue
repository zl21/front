<template>
  <div class="file-dialog">
    <Modal
      v-model="name"
      :title="completeTitle"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <div class="file-content">
        <div class="icon-panel">
          <span class="icon-span">
            <i
              v-if="mode=='import'"
              class="iconfont"
            >&#xe633;</i>
            <i
              v-if="mode=='export'"
              class="iconfont"
            >&#xe632;</i>
          </span>
        </div>
        <!-- <el-form
          v-if="mode=='export'"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="文件名：">
            <el-input
              :value="tablename"
              readonly 
            />
          </el-form-item>
          <el-form-item label="导出位置：">
            <el-input
              v-model="exportProp.location"
              icon="local"
            />
          </el-form-item>
        </el-form> -->
        <div
          v-if="mode=='import'"
          class="import-panel"
        >
          <div class="el-upload__tip">
            {{ ChineseDictionary.IMPORTTITLE }}<a @click.stop="downloadTemplate">{{ ChineseDictionary.DOWNTEMPLATE }}</a>
          </div>
          <!-- <el-upload
            ref="upload"
            class="upload-panel"
            :action="action"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :data="table"
            :before-upload="handleBefore"
            :on-success="handleSuccess"
            :on-progress="handleProgress"
            :on-error="handleError"
            :auto-upload="false"
            :file-list="importFlies"
          >
            <el-button
              type="primary"
              @click="clearFile"
            >
              {{ ChineseDictionary.SELECTFILE }}
            </el-button>
            <div
              slot="tip"
              class="upload-tip"
            >
              {{ ChineseDictionary.FILEMAX }}{{ fileSize }}
            </div>
          </el-upload> -->
          <transition name="fade">
            <span
              v-if="loading"
              class="uploadmessage"
            >数据正在导入中，请稍候
            <!-- <img
              src="../../../static/img/loading-progress@2x.gif"
              alt="......"
            > -->
            </span>
          </transition>
        </div>
      </div>
      <div slot="footer">
        <div class="button-panel">
          <Button
            v-if="mode=='import'"
            :disabled="loading"
            @click="submitUpload"
          >
            {{ ChineseDictionary.IMPORT }}
          </Button>
          <Button v-if="mode=='export'">
            {{ ChineseDictionary.EXPORT }}
          </Button>
          <Button @click.stop="closeDialog(false)">
            {{ ChineseDictionary.CANCEL }}
          </Button>
        </div>
        <div
          v-if="errorMsg.errorList.length>0"
          class="error-content"
        >
          <div class="error-message">
            <div class="left-icon">
              <i class="iconfont">&#xe631;</i>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
//   import axios from '../../utils/request';
  import ChineseDictionary from '../assets/js/ChineseDictionary';
  //   import MyDialog from '../dialog/mydialog';

  export default {
    props: {
      name: {
        type: Boolean,
        default: false,
      },
      visible: {// 显示
        type: Boolean,
        default: true,
      },
      mode: {// 类型, 导入/导出(弃用)
        type: String,
        default: 'import',
      },
      title: {// 标题
        type: String,
        default: '',
      },
      tablename: {// 表名
        type: String,
        default: '',
      },
      mainTable: {// 主表名
        type: String,
        default: '',
      },
      mainId: {// 主表id
        type: Number,
        default: -1,
      },
      ischangeShop: Boolean, // 换店特定
      isReadjust: Boolean, // 调价明细
      isRebate: Boolean, // 折让明细
    
    },
    components: {
    //   MyDialog,
    },
    data() {
      return {
        showFlag: true,
        loading: false, // 是否加载
        ChineseDictionary: {},
        fileSize: '', // 文件尺寸
        importFlies: [], // 导入文件列表
        errorMsg: {// 错误信息
          errorUrl: '',
          message: '',
          errorList: [],
        },
       
      };
    },
    created() {
      this.ChineseDictionary = ChineseDictionary;
      if (this.visible) this.showFlag = true;
      else this.showFlag = false;
      this.axiosSetting();
    },
    computed: {
      // 标题
      completeTitle() {
        if (this.mode === 'export') {
          return `${this.title}导出`;
        } 
        return `${this.title}导入`;
      },
      // 发送上传请求 同时提供的参数
      table() {
        if (this.mainId === -1) {
          return {
            table: this.tablename,
            menu: this.title,
          };
        } if (this.isRebate) {
          return {
            table: this.sublistTable, // 折让明细表名
            mainTable: this.mainTable,
            mainId: this.objId2, // 子表id
            menu: this.title,
          };
        }
        return {
          table: this.tablename,
          mainTable: this.mainTable,
          mainId: this.isReadjust ? this.objId2 : this.mainId,
          menu: this.title,
        };
      },
      action() {
        return this.ischangeShop
          ? '/p/cs/btranplanChangStoreImport'
          : (this.tablename === 'DL_B_TRAN_OUT'
            ? '/p/cs/tranimport' : (this.tablename === 'DL_B_PAND_ITEM' ? '/p/cs/binventoryimport' : '/p/cs/import'));
      },
    },
    methods: {
      // 发送请求, 获取上传参数
      axiosSetting() {
        // this.importGetUploadParametersForButtons();
        // if (this.buttons.importParameters.code === 0) {
        //   this.fileSize = this.$store.state.buttons.importParameters['upload.import.max-file-size'];
        // } else {
        //   this.fileSize = '0M';
        // }
      },
      // 发送请求, 下载模板
      downloadTemplate() {
        // if (this.title === '换店') {
        //   return window.location = 'http://fcweb.oss-cn-hangzhou.aliyuncs.com/DL_B_TRAN_PLAN/计划单-换店明细.xls';
        // } if (this.tablename === 'DL_B_TRAN_OUT') {
        //   return window.location = 'http://fcweb.oss-cn-hangzhou.aliyuncs.com/DL_B_TRAN_OUT/调拨出库导入模板.xls';
        // }       
        if (this.buttons.importTemplate.code === 0) {
          const url = `/p/cs/download?filename=${this.buttons.importTemplate.data}`;
          window.location = url;
        }
      },
      // 提交上传文件请求
      // submitUpload() {

      //   if (this.$refs.upload.$refs['upload-inner'].fileList.length === 0) {
      //     this.$store.commit('errorDialog', { // 弹框报错
      //       message: '请先选择要导入的文件！',
      //       type: 'warning',
      //     });
      //     return;
      //   }
      //   if (this.mainId == -1) {
      //     // 如果主表未新增
      //     this.$emit('objectSave');
      //     return;
      //   }

      //   this.errorMsg.errorList = [];
      //   this.$refs.upload.submit();
      // },
      // 清除用户选择文件列表
      clearFile() {
        this.$refs.upload.clearFiles();
        this.loading = false;
      },
      // 上传文件前判断文件大小
      // handleBefore(file) {
      //   const sizes = ['B', 'K', 'M', 'G', 'T']; let
      //     p;
      //   const unit = this.fileSize.substr(this.fileSize.length - 1);
      //   const number = this.fileSize.substr(0, this.fileSize.length - 1);
      //   for (let i = 0; i < sizes.length; i++) {
      //     if (unit === sizes[i]) {
      //       p = i;
      //       break;
      //     }
      //   }
      //   if (file.size > parseInt(number) * Math.pow(1024, p)) {
      //     this.$message(`文件最大${this.fileSize}`);
      //     this.clearFile();
      //     return false;
      //   }
      //   this.loading = true;
      // },
      // 上传文件中操作----unused
      // 上传成功
      handleSuccess(response) {
        this.loading = false;
        if (response.code === 0) {
          //          this.$message({message: response.message, type: 'success'});
          this.$store.dispatch('timingCalcAsyncTask', { id: response.data });
          this.closeDialog();
        } else {
          if (undefined === response.path) this.errorMsg.errorUrl = '';
          else this.errorMsg.errorUrl = `/p/cs/download?filename=${response.path}`;
          this.errorMsg.errorList = response.data || [{ rowIndex: 0, message: '' }];
          this.errorMsg.message = response.message;
          this.clearFile();
        }
        this.$emit('confirmImport');
      },
      // 上传失败
      handleError(err) {
        if (err.status === 403) {
          this.$store.commit('beforeSignout');
          this.closeDialog();
        } else {
          this.$store.commit('errorDialog', { // 弹框报错
            message: err,
          });
          this.clearFile();
        }
      },
      closeDialog(option) {
        this.showFlag = option || false;
        this.$emit('update:visible', option);
      },
    },

  };
</script>

<style lang="less" type="text/less">
  @font-color: #575757;
  @default-border-color: #d8d8d8;
  @default-border: solid 1px @default-border-color;
  .file-dialog {
    .el-progress {
      display: none;
    }
    &.none {
      display: none;
    }
    &.export {
      .my-dialog {
        /*height: 188px;*/
      }
    }
    &.import {
      .my-dialog {
        min-height: 210px;
        max-height: 710px;
      }
    }
    .uploadmessage {
      font-size: 12px;
      height: 21px;
      line-height: 21px;
      color: #b8b8b8;
      img {
        margin-left: 4px;
        height: 2px;
      }
    }
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
      opacity: 0
    }
    .my-dialog {
      border-radius: 12px;
      color: @font-color;
      font-size: 12px;
      width: 630px;
      .el-dialog__body {
        /*height: 128px;*/
      }
    }
    .file-content {
      width: 590px;
      .icon-panel {
        margin: 0;
        text-align: center;
        .icon-span {
          display: inline-block;
          height: 28px;
          width: 28px;
          i {
            color: #09A155;
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
          color: @font-color;
          a {
            color: #0F8EE9;
            text-decoration: none;
            cursor: pointer;
          }
        }
        .upload-panel {
          height: 50px;
          margin-top: 10px;
          .upload-tip {
            font-size: 12px;
            display: inline-block;
            margin-left: 4px;
            color: #b8b8b8;
          }
          .el-upload-list {
            height: 21px;
          }
          .el-button--primary {
            background-color: #fd6442;
            border-color: #fd6442;
            border-radius: 2px;
            color: #ffffff;
            height: 24px;
            font-size: 12px;
            padding: 0;
            width: 66px;
            &:hover {
              background-color: #E6502f;
              color: #f3cec5;
            }
          }
          .el-upload-list {
            .el-upload-list__item {
              font-size: 12px;
              margin-top: 4px;
              &:first-child {
                font-size: 12px;
                margin-top: 4px;
              }
              .el-upload-list__item-name [class^=el-icon] {
                margin-right: 4px;
              }
              .el-upload-list__item-status-label {
                display: none;
              }
              .el-icon-close {
                display: none;
              }
              .el-icon-document {
                font-family: 'iconfont' !important;
                &:before {
                  content: "\e63b";
                  color: @font-color;
                }
              }
            }
          }

        }
      }
      .el-form-item {
        margin-bottom: 10px;
        .el-form-item__label {
          font-size: 12px;
          height: 24px;
          line-height: 24px;
          padding: 0;
        }
      }
      .el-form-item__content {
        line-height: 24px;
        font-size: 12px;
        .el-input {
          font-size: 12px;
          .el-input__inner {
            border-radius: 2px;
            border: @default-border;
            height: 24px;
            padding: 0 0 0 6px;
            width: 240px;
          }
        }
      }
    }
    .el-dialog__footer {
      .button-panel {
        margin: 10px 40px;
        .el-button {
          border: solid 1px #fd6442;
          border-radius: 2px;
          color: #fd6442;
          height: 24px;
          font-size: 12px;
          width: 66px;
          padding: 0;
          &:hover {
            opacity: .6;
          }
        }
      }

      .error-content {
        border-top: solid 1px #bcbcbc;
        text-align: left;
        position: relative;
        .error-message {
          height: auto;
          margin: 10px 40px;
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
                color: #0F8EE9;
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
    }
  }
</style>

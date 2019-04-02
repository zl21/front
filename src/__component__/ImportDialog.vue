<template>
  <div>
    <Modal
      v-model="visible"
      :title="completeTitle"
    >
      <div>
        <div>
          <span>
            <i
              v-if="mode=='import'"
            >&#xe633;</i>
            <i
              v-if="mode=='export'"
            >&#xe632;</i>
          </span>
        </div>
        <div
          v-if="mode=='import'"
          class="import-panel"
        >
          <div>
            {{ ChineseDictionary.IMPORTTITLE }}<a @click.stop="downloadTemplate">{{ ChineseDictionary.DOWNTEMPLATE }}</a>
          </div>
          <div>
            <input
              id=""
              type="file"
              name=""
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              @change="fileChange($event)"
            >
           
            <label for="选择文件上传" />
            <div
              slot="tip"
>
              {{ ChineseDictionary.FILEMAX }}{{ fileSize }}
            </div>
          </div>
         
          <transition name="fade">
            <span
              v-if="loading"
            >数据正在导入中，请稍候
            </span>
          </transition>
        </div>
      </div>
      <div slot="footer">
        <div>
          <Button
            v-if="mode=='import'"
            :disabled="loading"
            @click="submitUpload()"
          >
            {{ ChineseDictionary.IMPORT }}
          </Button>
        
          <Button @click.stop="closeDialog(false)">
            {{ ChineseDictionary.CANCEL }}
          </Button>
        </div>
        <div
          v-if="errorMsg.errorList.length>0"
        >
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
                <p>
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
  import ChineseDictionary from '../assets/js/ChineseDictionary';
  import network, { urlSearchParams } from '../__utils__/network';

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
      mode: {// 类型, 导入
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
        files: []
       
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
        let url = '';
        if (this.ischangeShop) {
          url = '/p/cs/btranplanChangStoreImport';
        } else if (this.tablename === 'DL_B_TRAN_OUT') {
          url = '/p/cs/tranimport';
        } else if (this.tablename === 'DL_B_PAND_ITEM') {
          url = '/p/cs/binventoryimport';
        } else {
          url = '/p/cs/import'; 
        }
        return url;
      },
    },
  
    methods: {
      fileChange(e) {
        this.files = e.target.files;
      },
      // 发送请求, 获取上传参数
      axiosSetting() {
        network.post('/p/cs/settings', urlSearchParams({
          configNames: JSON.stringify(['upload.import.max-file-size'])
        })).then((res) => {
          if (res.data.code === 0) this.fileSize = res.data.data['upload.import.max-file-size'];
          else this.fileSize = '0M';
        }).catch((error) => {
          if (error.response.status === 403) {
            this.closeDialog();
          }
          this.fileSize = '0M';
        });
      },
      // 发送请求, 下载模板
      downloadTemplate() {
        network.get('/p/cs/downloadImportTemplate', urlSearchParams({
          searchdata: {
            table: this.tablename,
          },
        })).then((res) => {
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
            content: '请先选择要导入的文件！',
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
        const sizes = ['B', 'K', 'M', 'G', 'T']; let
          p;
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
          else _self.errorMsg.errorUrl = `/p/cs/download?filename=${response.path}`;
          _self.errorMsg.errorList = response.data || [{ rowIndex: 0, message: '' }];
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

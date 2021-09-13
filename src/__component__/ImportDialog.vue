<template>
  <div>
    <Modal
      v-model="modalVisible"
      :title="completeTitle"
      :mask="true"
      :closable="true"
      :mask-closable="false"
      :width="width"
      :class="classes"
    >
      <div>
        <div class="importICon">
          <span class="icon-span">
            <i class="iconfont iconbj_import" />
          </span>
        </div>
        <div class="import-panel">
          <div class="el-upload__tip">
            {{$t('messages.startLine')}}:<input
              :value="inpNum"
              class="inputValue"
              type="text"
              :placeholder="$t('messages.onlyPositiveInteger')"
              @input="handleInput"
              @change="handleInput"
            >;
            <Checkbox
              v-model="singleValue"
              class="singleValue"
            />
            {{$t('messages.ifUpdateRecord')}};
          </div>
          <!-- <div class="el-upload__tip">

          </div> -->
          <div class="el-upload__tip">
            {{ ChineseDictionary.IMPORTTITLE }}
            <span
              class="downloadTemplate"
              @click="downloadTemplate"
            >
              {{ ChineseDictionary.DOWNTEMPLATE }}
            </span>
          </div>
          <div class="upload-panel">
            <Button
              type="posdefault"
              :size="buttonSize"
            >
              {{$t('buttons.selectFile')}}
            </Button>
            <!-- name -->
            <input
              id="file"
              class="fileInput"
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              @change="fileChange($event)"
              @click="clearFile"
            >

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
            <span v-if="loading">{{$t('messages.waitForImport')}}</span>
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
                <a :href="errorMsg.errorUrl">（{{$t('messages.downloadErrorMessage')}}）</a>
              </p>
              <div class="content-message">
                <p class="title">
                  {{ errorMsg.message }}
                </p>
                <p
                  v-for="(msg,index) in errorMsg.errorList"
                  :key="index"
                >
                  <span v-if="msg.rowIndex">{{$t('messages.recordError',{num:msg.rowIndex})}}}:</span>
                  <span v-html="msg.message"></span>
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
  import { Version, encodeControl, classFix } from '../constants/global';
  import { mapState } from 'vuex';

  export default {
    name: 'ImportDialog',
    props: {
      // name: {
      //   type: Boolean,
      //   default: false
      // },
      visible: {// 是否打开弹框
        // 显示
        type: Boolean,
        default: false
      },
      title: {// 弹框title
        // 标题
        type: String,
        default: ''
      },
      tablename: {// /p/cs/downloadImportTemplate 用于下载模版,上传文件参数
        // 子表名
        type: String,
        default: ''
      },
      mainTable: {// 用于/p/cs/import参数上传文件
        // 主表名
        type: String,
        default: ''
      },
      mainId: {// 用于/p/cs/import参数上传文件
        // 主表id
        type: [Number, String],
        default: -1
      },
      width: {// 当前弹框参数
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
    created() {
      this.loadingName = this.$route.meta.moduleName.replace(/\./g, '-');
    },
    mounted() {
      this.ChineseDictionary = ChineseDictionary;
      if (this.visible) this.modalVisible = true;
      else this.modalVisible = false;
      this.axiosSetting();
    },

    computed: {
       ...mapState('global', {
        activeTab: ({ activeTab }) => activeTab,
        // isRequest: ({ isRequest }) => isRequest,

      }),
      classes: () => `${classFix}importDialog`,
      completeTitle() {
        return `${this.title}${this.$t('buttons.import')}`;
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
            // window.location = url;
            this.downloadUrlFile(url);
          }
        });
      },
      // downLoad(path) {
      //   const eleLink = document.createElement('a');
      //   // eleLink.id = 'expertFile';
      //   eleLink.setAttribute('href', path);
      //   eleLink.style.display = 'none';
      //   document.body.appendChild(eleLink);
      //   eleLink.click();
      //   // document.getElementById('expertFile').remove();
      // },
      downloadUrlFile(url) {
        const self = this;
        const domFrame = window.parent.document.getElementById('downLoadListFrame');
        if (domFrame != null) {
          window.parent.document.body.removeChild(domFrame);
        }
        const downloadFile = {};
        if (typeof downloadFile.iframe === 'undefined') {
          const iframe = document.createElement('iframe');
          iframe.setAttribute('id', 'downLoadListFrame');
          iframe.style.display = 'none';
          self.addEvent('load', iframe, () => { self.iframeLoad(iframe); });
          iframe.src = url;
          downloadFile.iframe = iframe;
          document.body.appendChild(downloadFile.iframe);
          
        }
      },
      // 判断iframe的src
      iframeLoad(iframe) {
        const src = (iframe.src) ? iframe.src : iframe.contentWindow.locatiion.href;
        console.log('src::', src);
        setTimeout(() => {
            iframe.src = '';
        }, 1000);
      },
      // 调用方法时绑定iframe的load事件
      addEvent(eventName, element, fn) {
        if (element.attachEvent) element.attachEvent(`on${eventName}`, fn);
        else element.addEventListener(eventName, fn, false);
      },
      // 提交上传文件请求
      submitUpload() {
        if (this.files.length === 0) {
          this.$Modal.fcWarning({
            title: this.$t('feedback.warning'),
            mask: true,
            content: this.$t('messages.selectImportFile')
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
        this.$R3loading.show(this.loadingName);
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

        if(this.mainTable !== this.tablename && this.mainTable !==''){
          let label = this.activeTab.label.replace(/新增|编辑/g,'');
          sendData.menu = label +'-'+this.title;
        }

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
        // eslint-disable-next-line no-unused-vars
        const article = new Upload(aUploadParame);
      },

      // 上传成功
      handleSuccess(response) {
        if (response.code === 0) {
          if (Version() === '1.4') {
            this.$R3loading.hide(this.loadingName);
            this.closeDialog();
            this.fileName = '';
            this.$Modal.fcSuccess({
              title: this.$t('feedback.success'),
              mask: true,
              content: response.message
            });
            this.$emit('confirmImport');
          } else {
            this.$emit('imporSuccess', response.data);
          }
        } else {
          this.$R3loading.hide(this.loadingName);
          if (response.data) {
            if (response.data.path) {
              if (response.data.path === 'undefined ===') {
                this.errorMsg.errorUrl = '';
              } else {
                const gatewayth = getGateway('/p/cs/download?filename');
                this.errorMsg.errorUrl = this.urlChange(`${gatewayth}=${
                  response.data.path
                }`);
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
          this.clearFile();
          this.$emit('confirmImport');
        }
      },
      urlChange(url) { // 对下载的url地址进行转换，处理特殊字符
        if (encodeControl()) {
          const arr = url.split('?')[0].split('/');
          let [last] = [...arr].reverse();
          last = encodeURIComponent(last);
          arr[arr.length - 1] = last;
          return arr.join('/');
        }
        return url;
      },
      // 上传失败
      handleError(e) {
        this.$R3loading.hide(this.loadingName);
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
          title: this.$t('feedback.error'),
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

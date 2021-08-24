<template>
  <div :class="classFixName">
    <div v-if="docList.valuedata && (docList.valuedata.length >0||docList.valuedata.url)">
      <ul :class="`${classFixName}-list`">
        <li v-for="(option,index) in docList.valuedata"
            :key="index"
            v-dragging="{ item: option, list: docList.valuedata,group:option  }">
          <a v-if="getDocFileWebConf"
             target="_blank"
             @click="downloadUrlFile(`${getDocFileWebConfUrl}?url=${option.url}`)">{{ option.name }}</a>
          <a v-else
             @click="urlChange(option.url)">{{ option.name }}</a>
          <i v-if="docList.readonly!== true && option.name"
             class="iconfont iconios-close-circle-outline"
             @click="deleteLi(index,option)" />
        </li>
      </ul>
    </div>

    <!--

     -->
    <form ref="file">
      <label :class="docList.readonly ? `${classFixName}-disabled` :''">
        <i class="iconfont iconmd-cloud-upload" data-target-tag="fkIcon" />
        <input type="file"
               multiple="multiple"
               :disabled="docList.readonly"
               :accept="accept"
               @change.stop="uploadFileChange($event)">
        {{$t('tips.uploadAttachment')}}
      </label>
      <span v-if="percent"
            class="proInfo">
        {{$t('docFile.importingFile')}}……
      </span>
      <Progress
        v-if="percent"
        :percent="uploadProgress"
        :status="uploadProgress===100 ? 'success': 'active'"
      />
    </form>
  </div>
</template>

<script>
import i18n from '../../utils/i18n'
import Config from '../../../config/nameConfig';
import Upload from './upload';
const prefixCls = `${Config.prefixCls}docfile`;
const classFixName = `${Config.classFix}docfile`;
import'./docfile.less';



export default {
  name: prefixCls,
  model: {
    prop: 'value',
    event: 'on-change',
  },
  props: {
    value: {
      type: [Array,String],
      default: () => {
        return []
      }
    },
    http: {   // 请求
      type: Object,
      default: () => {

      }
    },
    dataitem: {// 上传文件类型字段元数据配置，如在定制界面使用，需和元数据配置参数保持一致
      type: Object,
      default () {
        return {
          //readonly: '', //控制字段是否可编辑
          // filesLength 上传数量
          // filesize  文件大小,
          // url: '/ad-app/p/cs/upload2',
          // sendData:{
          //   path: `${this.item.tableName}/${this.item.itemId}/`,
          // }
        };
      }
    },
    itemWebconf: {// 表单字段webconf
      type: Object,
      default () {
        return {};
      }
    },
    webConfSingle: {// 是否需要isPreview标记
      type: Object,
      default: () => ({})
    },
    draggingTag: {// 拖拽group属性标示，如果当前界面多次使用了当前组件，需保持标示唯一性
      type: String,
      default: () => {
        if (this && this.dataitem && this.dataitem.colname) {
          return this.dataitem.colname;
        }
        return toString(new Date().getTime());
      }
    },
    encodeControl: {  //
      type: Boolean,
      default: () => {
        return false;
      }
    },
    accept: { // 文件上传格式控制
      type: String,
      default: '*'
    },
    serviceId: {
      type: String,
      default: () => ''
    }
  },
  mounted () {
    // this.$dragging.$on('dragend', (res) => {
    //   // const data = JSON.parse(res.group);
    //   const valuedata = this.docList.valuedata;
    //   if (valuedata.length > 0) {
    //     this.$emit('filechange', valuedata);
    //   }
    // });
  },
  data () {
    return {
      percent: false,
      classFixName:classFixName,
      uploadProgress: 0, // 上传进度
      docList: {
      },
    };
  },
  computed: {
    // getDocFileWebConf() {
    //   if (this.itemWebconf && this.itemWebconf.docFile) {
    //     return this.itemWebconf.docFile.isPreview;
    //   }
    //   return false;
    // },
    // getDocFileWebConfUrl() {
    //   if (this.itemWebconf && this.itemWebconf.docFile) {
    //     return this.itemWebconf.docFile.url;
    //   }
    //   return null;
    // }
    getDocFileWebConf () {
      if (this.webConfSingle && this.webConfSingle.docFile) {
        return this.webConfSingle.docFile.isPreview;
      }
      return false;
    },
    getDocFileWebConfUrl () {
      if (this.webConfSingle && this.webConfSingle.docFile) {
        return this.webConfSingle.docFile.url;
      }
      return null;
    }
  },
  watch: {
    dataitem: {
      handler () {
        this.docList = Object.assign({}, this.dataitem);
        // this.docList.readonly = this.docList.disabled;
        try {

        } catch (error) {

        }
        this.docList.valuedata = [...this.value];

        this.setvaluedata();
      },
      deep: true
    },

  },
  // updated() {
  //   this.$nextTick(() => {
  //     console.log(333, this.docList.valuedata);
  //     const valuedata = this.docList.valuedata;
  //     // this.$emit('filechange', valuedata);
  //   });
  // },
  methods: {
    downloadUrlFile (url) {
      const self = this;
      const domFrame = window.parent.document.getElementById('downLoadListFrame');
      if (domFrame != null) {
        window.parent.document.body.removeChild(domFrame);
      }
      const downloadFile = {};
      if (typeof downloadFile.iframe === 'undefined') {
        const iframe = document.createElement('iframe');
        iframe.setAttribute('id', 'downLoadListFrame');
        self.addEvent('load', iframe, () => { self.iframeLoad(iframe); });
        iframe.src = url;
        downloadFile.iframe = iframe;
        document.body.appendChild(downloadFile.iframe);
        setTimeout(() => {
          iframe.src = '';
        }, 1000);
      }
    },
    // 判断iframe的src
    iframeLoad (iframe) {
      const src = (iframe.src) ? iframe.src : iframe.contentWindow.locatiion.href;
      // console.log('src::', src);
    },
    // 调用方法时绑定iframe的load事件
    addEvent (eventName, element, fn) {
      if (element.attachEvent) element.attachEvent(`on${eventName}`, fn);
      else element.addEventListener(eventName, fn, false);
    },
    urlChange (url) { // 对下载的url地址进行转换，处理特殊字符
      if (this.encodeControl) {
        const arr = url.split('?')[0].split('/');
        let [last] = [...arr].reverse();
        last = encodeURIComponent(last);
        arr[arr.length - 1] = last;
        return arr.join('/');
      }

      this.downloadUrlFile(url);
      return url;
    },
    filechange () {
      const valuedata = this.docList.valuedata;
      console.log('valuedata', valuedata)
      this.$emit('on-change', valuedata);
    },
    checkFile (files) {

      if ((this.docList.valuedata.length + files.length) > this.docList.filesLength && this.docList.filesLength) {
        this.$Message.info(this.$t('docFile.uploadFileLimit',{total:this.docList.filesLength}));
        return false;
      }
      for (let i = 0; i < files.length; i++) {
        const idx = files[i].name.lastIndexOf('.');
        const ext = files[i].name.substr(idx + 1).toUpperCase();
        const accept = this.itemWebconf && this.itemWebconf.UploadAccept ? this.itemWebconf.UploadAccept.toUpperCase() : this.accept.toUpperCase();
        const arr = accept.split(',');
        if (accept !== '*' && !arr.includes(ext)) {
          this.$Message.info(this.$t('docFile.fileCanNotUpload',{file: files[i].name}));
          return false;
        }
      }


      return true;
    },
    uploadFileChange (e) {
      // 上传图片
      const fileInformationUploaded = e.target.files;
      if (!this.checkFile(e.target.files)) {
        return false;
      }
      const url = this.serviceId ? this.serviceId + this.docList.url : this.docList.url;
      const sendData = this.docList.sendData;
      const aUploadParame = Object.assign(
        {},
        {
          target: fileInformationUploaded,
          url,
          multiple: true,
          length: this.docList.ImageSize,
          imgSize: this.docList.filesize,
          sendData,
          fileName: 'files',
          success: this.success,
          type: 'file',
          onerror: this.onerror,
          progress: this.progress,
          onload: this.onload,
          onloadstart: this.onloadstart,
          onloadend: this.onloadend
        }
      );
      const article = new Upload(aUploadParame);
    },
    success (res) {
      let uploadIds = [];
      let filelist = [];
      this.percent = false;
      this.uploadProgress = 0;
      if (res.code === 0) {
        if (Array.isArray(res.data)) {
          res.data.forEach((item) => {
            uploadIds.push(item.UploadId);
            filelist.push({
              name: item.Name,
              url: item.Url,
              Size: item.Size
            });
          });
        } else {
          return false;
        }
      } else {
        this.$Modal.fcError({
          title: this.$t('tips.error'),
          content: res.message,
          mask: true
        });
      }
      if (!this.checkFile(filelist)) {
        return false;
      }
      if (uploadIds.length < 1) {
        return false;
      }
      uploadIds = uploadIds.join(',');
      this.docList.valuedata.push(...filelist);
      filelist = [];
      this.filechange();
      this.$refs.file.reset();
    },
    deleteLi (index) {
      this.$Modal.fcWarning({
        mask: true,
        showCancel: true,
        title: this.$t('tips.alert'),
        content: this.$t('docFile.continueDeleteFile'),
        onOk: () => {
          this.docList.valuedata.splice(index, 1);
          this.filechange();
        }
      });
    },
    onerror (e) {
      this.$refs.file.reset();
      this.percent = false;
      this.uploadProgress = 0;
      this.$Message.info(e);
    },
    progress (e, press) {
      // 上传进度
      this.uploadProgress = Math.floor(e.loaded / e.total * 100);
    },
    onload (e) {
      this.percent = true;
      // console.log(e);
    },
    setvaluedata () {
      this.docList = Object.assign({}, this.dataitem);
      this.docList.valuedata = Array.isArray(this.value) ? [...this.value] : [];
      if (this.docList.valuedata === '') {
        this.docList.valuedata = [];
      } else if (typeof this.docList.valuedata === 'string') {
        this.docList.valuedata = JSON.parse(this.docList.valuedata);
      }
    }

  },

  beforeCreate() {
    this.$t = i18n.t.bind(i18n)
  },

  created () {
    setTimeout(()=>{
    this.setvaluedata();
    },10)
    //this.setvaluedata();
  }
};
</script>



/* eslint-disable import/no-dynamic-require */
<template>
  <div class="r3-file-doc">
    <div v-if="docList.valuedata.length >0||docList.valuedata.url">
      <ul class="re-doc-list">
        <li
          v-for="(option,index) in docList.valuedata"
          :key="index"
          v-dragging="{ item: option, list: docList.valuedata,group: draggingTag }"
        >
          <a
            v-if="getDocFileWebConf"
            :href="`${getDocFileWebConfUrl}?url=${option.url}`"
            target="_blank"
          >{{ option.name }}</a>
          <a
            v-else
            :href="urlChange(option.url)"
          >{{ option.name }}</a>
          <i
            v-if="docList.readonly!== true && option.name"
            class="iconfont iconios-close-circle-outline"
            @click="deleteLi(index,option)"
          />
        </li>
      </ul>
    </div>      
    
    <!-- 
       
     -->
    <form
      ref="file"
    >
      <label :class="docList.readonly ? 'r3-filedoc-disabled' :''"><i
        class="iconfont iconmd-cloud-upload"
        data-target-tag="fkIcon"
      /><input
        type="file"
        multiple="multiple"
        :disabled="docList.readonly"
        :accept="accept"
        @change.stop="uploadFileChange($event)"
      >上传附件</label>
      <span
        v-if="percent"
        class="proInfo"
      >
        文件正在导入中……
      </span>
    </form>
  </div>
</template>

<script>
  import Upload from '../../__utils__/upload';
  import {
    Version, MODULE_COMPONENT_NAME, INSTANCE_ROUTE_QUERY, INSTANCE_ROUTE, encodeControl
  } from '../../constants/global';
  import store from '../../__config__/store.config';

  const apiVersion = Version();
  const fkHttpRequest = () => require(`../../__config__/actions/version_${apiVersion}/formHttpRequest/fkHttpRequest.js`);


  export default {
    name: 'Docfile',
    // inject: [MODULE_COMPONENT_NAME, INSTANCE_ROUTE_QUERY, INSTANCE_ROUTE],
    
    props: {
      dataitem: {
        type: Object,
        default() {
          return {};
        }
      },
      itemWebconf: {// 表单字段webconf
        type: Object,
        default() {
          return {};
        }
      },
      webConfSingle: {// 当前子表webConf
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
      accept: { // 文件上传格式控制
        type: String,
        default: '*'
      }
    },
    mounted() {
      // this.$dragging.$on('dragend', (res) => {
      //   // const data = JSON.parse(res.group);
      //   const valuedata = this.docList.valuedata;
      //   if (valuedata.length > 0) {
      //     this.$emit('filechange', valuedata);
      //   }
      // });
    },
    data() {
      return {
        percent: false,  
        docList: {},
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
      getDocFileWebConf() {
        if (this.webConfSingle && this.webConfSingle.docFile) {
          return this.webConfSingle.docFile.isPreview;
        }
        return false;
      },
      getDocFileWebConfUrl() {
        if (this.webConfSingle && this.webConfSingle.docFile) {
          return this.webConfSingle.docFile.url;
        }
        return null;
      }
    },
    watch: {
      dataitem: {
        handler() {
          this.docList = Object.assign({}, this.dataitem);
          // this.docList.readonly = this.docList.disabled;

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
      filechange() {
        const valuedata = this.docList.valuedata;
        this.$emit('filechange', valuedata);
      }, 
      checkFile(files) {
        if ((this.docList.valuedata.length + files.length) > this.docList.filesLength && this.docList.filesLength) {
          this.$Message.info(`只能上传${this.docList.filesLength}个文件`);
          return false;
        }

        
        for (let i = 0; i < files.length; i++) {
          const idx = files[i].name.lastIndexOf('.'); 
          const ext = files[i].name.substr(idx + 1).toUpperCase();   
          const accept = this.itemWebconf && this.itemWebconf.UploadAccept ? this.itemWebconf.UploadAccept.toUpperCase() : this.accept.toUpperCase();
          const arr = accept.split(',');
          if (accept !== '*' && !arr.includes(ext)) {
            this.$Message.info(`${files[i].name}不支持上传`);
            return false;
          }
        }


        return true;
      },
      uploadFileChange(e) {
        // 上传图片
        const fileInformationUploaded = e.target.files;
        if (!this.checkFile(e.target.files)) {
          return false;
        }
        const url = this.docList.url;
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
      success(res) {
        let uploadIds = [];
        let filelist = [];
        this.percent = false;
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
        }        
        if (!this.checkFile(filelist)) {
          return false;
        }
        if (uploadIds.length < 1) {
          return false;
        }
        uploadIds = uploadIds.join(',');
        fkHttpRequest().batchUploadProgress({
          searchObject: {
            uploadIds
          },
          success: (data) => {
            if (data.code === 0) {
              this.docList.valuedata.push(...filelist);
              filelist = [];
              this.filechange();
            }
          }

        });
        // console.log(result);
        this.$refs.file.reset();
      },
      deleteLi(index) {
        this.$Modal.fcWarning({
          mask: true,
          showCancel: true,
          title: '提示',
          content: '此操作将永久删除该文件, 是否继续?',
          onOk: () => {
            this.docList.valuedata.splice(index, 1);
            this.filechange();
          }
        });
      },
      onerror(e) {
        this.$refs.file.reset();
        this.percent = false;
        this.$Message.info(e);
      },
      progress(e, press) {
        // 上传进度
      },
      onload(e) {
        this.percent = true;
        // console.log(e);
      },
      setvaluedata() {
        this.docList = Object.assign({}, this.dataitem);
        if (this.docList.valuedata === '') {
          this.docList.valuedata = [];
        } else if (typeof this.docList.valuedata === 'string') {
          this.docList.valuedata = JSON.parse(this.docList.valuedata);
        }
      }

    },
    created() {
      this.setvaluedata();
    }
  };
</script>

<style lang="less">
.r3-file-doc{
    color: #0f8ee9; 
    
   label{
       cursor: pointer; 
   }
   .disbaled{
     color:#999;
   }
   .proInfo{
     height:20px;
     color:#999;
     transition: all 0.4s;
   }
   .iconios-close-circle-outline{
    vertical-align: inherit;
    font-size: 14px;
    cursor:pointer;
       
   }
   .r3-filedoc-disabled{
      color: #999;
      cursor: not-allowed;
    }
   input{
        opacity: 0;
        display: none
   }
   .re-doc-list{
       li{
              padding:5px 6px;
            line-height: 16px;
            vertical-align: middle; 
            list-style-type:none

           }
         
   }
}  

</style>

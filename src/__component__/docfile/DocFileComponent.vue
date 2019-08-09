/* eslint-disable import/no-dynamic-require */
<template>
  <div class="r3-file-doc">
    <div>
        <ul class="re-doc-list">
            <li>文件展示名称<i class="iconfont iconbj_delete2" @click="deleteLi(index,item)"></i></li>
        </ul>
    </div>      
                 

    <form ref="file">
      <label><i
        class="iconfont iconbj_link"
        data-target-tag="fkIcon"
      /><input
        type="file"
        multiple="multiple"
        accept="application/vnd.ms-excel ,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, 
                application/msword, application/msexcel,
                application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                application/vnd.openxmlformats-officedocument.wordprocessingml.template" 
        @change.stop="uploadFileChange($event)"
      >上传附件</label>
    </form>
  </div>
</template>

<script>
  import Upload from '../../__utils__/upload';

  export default {
    name: 'Docfile',
    props: {
      dataitem: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    data() {
      return {
        docList: {}
      };
    },
    computed: {
      
    },
    watch: {
      dataitem: {
        handler(val) {
          console.log(val);
          this.docList = Object.assign({}, this.dataitem);
        },
        deep: true
      }
    },
    methods: {
      uploadFileChange(e) {
        // 上传图片
        console.log(this.docList);
        const fileInformationUploaded = e.target.files;
        const url = this.docList.url;
        const sendData = this.docList.sendData;
        const aUploadParame = Object.assign(
          {},
          {
            target: fileInformationUploaded,
            url,
            multiple: true,
            length: 3,
            sendData,
            success: this.success,
            onerror: this.onerror,
            progress: this.progress,
            onload: this.onload,
            onloadstart: this.onloadstart,
            onloadend: this.onloadend
          }
        );
        const article = new Upload(aUploadParame);
      },
      success() {
        this.$refs.file.reset();
        // console.log(result);
      },
      onerror() {
        this.$refs.file.reset();
      },
      progress(e) {
        // 上传进度
        // console.log(e);
      },
      onload(e) {
        // console.log(e);
      },

    },
    created() {
      this.docList = Object.assign({}, this.dataitem);
    }
  };
</script>

<style lang="less">
.r3-file-doc{
    color: #0f8ee9; 
   label{
       cursor: pointer; 
   }
   input{
        opacity: 0;
        display: none
   }
   .re-doc-list{
       li{
              padding:5px 6px; 
           }
         
   }
}
</style>

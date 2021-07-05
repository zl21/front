<template>
  <div>
    <div id="editor"
         ref="editor"
         class="editor" />
  </div>
</template>

  <script>
import wangEditor from '../../utils/wangeditor/wangEditor.js';
const fkHttpRequest = () => require(`../../request/fkHttpRequest`);
import Config from '../../../config/nameConfig';
const prefixCls = `${Config.prefixCls}Wangeditor`;

export default {
  name: prefixCls,
  model: {
    prop: 'value',
    event: 'on-value-change',
  },
  props: {
    tabAction: { // 是否可点击菜单
      type: Boolean,
      default: false
    },
    isActives: { // 是否可点编辑
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    http: {  // 网络请求
      type: Object,
      default () {
        return {};
      }
    },
    item: {
      type: Object,
      default () {
        return {};
      }
    },
    SetUploadprogress: {
      // 重写上传进度
      type: Function,
      default () {
        return function () { };
      }
    },
    editorUpload: {
      // 重写上传接口 
      type: Function,
      default () {
        return function () { };
      }
    },
    Url: {  // 网络路径  uploadUrl:'上传' ,progressUrl
      type: Object,
      default () {
        return {};
      }
    },
    serviceId: {  // 拼接网关
      type: String,
      default () {
        return '';
      }

    }

  },
  data () {
    return {
      editor: {},
      ImgArray: [],
      IMGArray1: [],
      timertomUploadImg: false,
      valueData: '',
      Html: '',
      textHtml: '',
    };
  },
  mounted () {
    this.$http = this.http;

    setTimeout(()=>{
        this.init();
        this.textHtml = this.value;
        this.editor.txt.html(this.textHtml);
    },100)
   
  },
  computed: {
    itemData () {
      return this.item;
    }
  },
  methods: {
    init () {
      //  富文本初始化
      const self = this;
      this.editor = new wangEditor(`#${this.$refs.editor && this.$refs.editor.id}`);
      // 或者 let editor = new E(document.getElementById('#editor'))
      this.editor.customConfig.zIndex = 100;
      // 使用 base64 保存图片
      this.editor.customConfig.uploadImgShowBase64 = true;
      this.editor.customConfig.customUploadImg = function (files, insert) {
        // files 是 input 中选中的文件列表
        // insert 是获取图片 url 后，插入到编辑器的方法
        // $("#editor"+self.itemdata.colid).children("img").css("display","block")
        const inserts = insert;
        for (let i = 0; i < files.length; i++) {
          self.IMGArray1.push({ file: files[i], insert });
        }
        self.tomUploadImg();
      };

      this.editor.customConfig.onchange = function (html) { // html 即变化之后的内容
        self.valueData = html == '<p><br></p>' ? null : html;
        self.$emit('on-value-change', self.valueData);
      };
      this.editor.customConfig.menus = [ // 自定义菜单配置
        'head', // 标题
        'bold', // 粗体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'video', // 插入视频
        'code', // 插入代码
        'undo', // 撤销
        'redo', // 重复
      ];

      this.editor.create(); // 初始化编辑器

      const editorSelector = this.$refs.editor;
      this.$nextTick(() => {
        // 默认值
        self.valueData = this.textHtml;
        this.editor.txt.html(this.textHtml);
        // 是否可编辑，需要在初始化之后 true是可编辑，传过来的是false，取反
        if (this.isActives) {
          const _htmlMask = document.createElement('div');
          _htmlMask.setAttribute('id', 'editor_layer_mask');
          _htmlMask.style.display = 'block';
          if(editorSelector){
           editorSelector.appendChild(_htmlMask);
          }
        }
        this.editor.$textElem.attr('contenteditable', !this.isActives);
        const _block = !this.tabAction ? 'none' : 'block';
        const _html = document.createElement('div');
        _html.setAttribute('id', 'editor_layer');
        _html.style.display = _block;
         if(editorSelector){
           editorSelector.appendChild(_html);
          }else{
            return false
          }
        const textArea = document.createElement('textArea');
        textArea.setAttribute('id', 'textarea');
        textArea.setAttribute('style', 'display:none;width:100%;height:100%;resize:none;');
        if (editorSelector.querySelector('.w-e-text-container')) {
          editorSelector.querySelector('.w-e-text-container').appendChild(textArea);
        }
        const wangEditoMenu = document.createElement('div');
        wangEditoMenu.style.display = 'inline-flex';

        wangEditoMenu.innerHTML = `<div class="w-e-menu" id="_wangEditor_btn_fullscreen">
                                    <a class="_wangEditor_btn_fullscreen" href="###">全屏</a></div>
                                    <div class="w-e-menu" id="_wangEditor_btn_html">
                                    <a class="_wangEditor_btn_html" href="###">html</a></div>`;

        // // 添加全屏 html 按钮
        editorSelector.querySelector('.w-e-toolbar').appendChild(wangEditoMenu);
        editorSelector.querySelector('#_wangEditor_btn_fullscreen').addEventListener('click', () => {
          self.toggleFullscreen(editorSelector);
        });
        editorSelector.querySelector('#_wangEditor_btn_html').addEventListener('click', () => {
          self.toggleHtml(editorSelector);
        });
      });
    },
    toggleFullscreen (editorSelector) {
      if (editorSelector.querySelector('._wangEditor_btn_fullscreen').innerText === '全屏') {
        editorSelector.querySelector('._wangEditor_btn_fullscreen').innerText = '退出全屏';
        editorSelector.className = 'editor fullscreen-editor';
      } else {
        editorSelector.querySelector('._wangEditor_btn_fullscreen').innerText = '全屏';
        editorSelector.className = 'editor';
      }
    },
    toggleHtml (editorSelector) {
      if (editorSelector.querySelector('._wangEditor_btn_html').innerText === 'html') {
        editorSelector.querySelector('._wangEditor_btn_html').innerText = '退出';

        document.getElementById('editor_layer').style.display = 'block';
        editorSelector.querySelector('#textarea').style.display = 'block';
        editorSelector.querySelector('.w-e-text').style.display = 'none';
        editorSelector.querySelector('#textarea').value = editorSelector.querySelector('.w-e-text').innerHTML;
      } else {
        editorSelector.querySelector('._wangEditor_btn_html').innerText = 'html';
        editorSelector.querySelector('.w-e-text').style.display = 'block';
        editorSelector.querySelector('#textarea').style.display = 'none';
        document.getElementById('editor_layer').style.display = 'none';
        const value = editorSelector.querySelector('#textarea').value.replace(/<script/gi, '&lt;script').replace(/(on[a-z$_]+)\s*\=/gi, '$1');
        editorSelector.querySelector('.w-e-text').innerHTML = value;
      }
      // editorSelector.querySelector('.w-e-toolbar').childNodes.forEach((item) => {
      //   if (item.className === 'w-e-menu') {
      //     if (editorSelector.querySelector('._wangEditor_btn_html').innerText === 'html') {
      //       item.style.opacity = 1;
      //     } else {
      //       item.style.opacity = 0;
      //     }
      //   }
      // });
    },
    fkeditorUpload (customUploadImg) {

      return new Promise((resolve) => {
        fkHttpRequest().editorUpload(this.$http, {
          params: {
            customUploadImg,
            url: this.Url.uploadUrl
          },
          // eslint-disable-next-line consistent-return
          success: (res) => {
            if (res.data.code === 0) {
              resolve(res.data.data);
            }
          }
        });
      });

    },
    tomUploadImg () { // 上传图片方法
      if (this.timertomUploadImg == true) {
        return;
      }
      const self = this;
      const data = this.IMGArray1.shift();
      if (!data) {
        setTimeout(() => {
          this.tomUploadImg();
        }, 500);
        return;
      }
      const path = this.itemData.path;
      const customUploadImg = {
        file: data.file,
        path
      };
      this.fkeditorUpload(customUploadImg).then((res) => {
        res.insert = data.insert;
        self.ImgArray.push(res);
         const upload = this.ImgArray.shift();

        self.uploadProgress(upload);
        setTimeout(() => {
          self.tomUploadImg();
        }, 500);

      });


    },

    uploadProgress (upload) {
      const self = this;
      if (this.timertomUploadImg == true) {
        return;
      }
      if (!upload) {
        return;
        setTimeout(() => {
         // this.uploadProgress();
        }, 500);
        return;
      }
      fkHttpRequest().fkQueuploadProgressry(this.$http, {
        searchObject: {
          uploadId: upload.UploadId,
        },
        url: this.Url.progressUrl,
        serviceId: this.serviceId,
        // eslint-disable-next-line consistent-return
        success: (res) => {
          if (res.data.data == 100) {
            upload.insert(upload.Url);
            self.editor.customConfig.onchange = function (html) { // html 即变化之后的内容
              self.itemdata.valuedata = html == '<p><br></p>' ? null : html;
              self.$emit('on-value-change', self.itemdata);
            };
          }else{
             setTimeout (() => {
              self.uploadProgress(upload);
            }, 300);
          }
          
        }
        
    }
      );



  }


}
};
  </script>

  <style lang="less">
.editor {
  position: relative;
  b {
    font-weight: bold;
  }
}

#editor_layer {
  background: #f1f1f1;
  position: absolute;
  width: 100%;
  top: 0px;
  height: 33px;
  z-index: 103;
  opacity: 0.5;
}

#_wangEditor_btn_fullscreen {
  position: relative;
  z-index: 150;
}

.w-e-toolbar {
  flex-wrap: wrap;
  -webkit-box-lines: multiple;
}

.w-e-toolbar .w-e-menu:hover {
  z-index: 10002 !important;
}

.w-e-menu a {
  text-decoration: none;
}

.fullscreen-editor {
  position: fixed !important;
  width: 100% !important;
  height: 100% !important;
  left: 0px !important;
  top: 0px !important;
  background-color: white;
  z-index: 9999;
}

#_wangEditor_btn_html {
  position: relative;
  z-index: 150;
}

.fullscreen-editor .w-e-text-container {
  width: 100% !important;
  height: 95% !important;
}
#editor_layer_mask {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  z-index: 999;
  background: rgba(0, 0, 0, 0.01);
}
</style>

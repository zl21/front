<template>
  <div>
    <div id="editor" ref="editor" :class="classes" />
  </div>
</template>

  <script>
  import wangEditor from '../assets/js/wangeditor/wangEditor';
  import { Version, classFix } from '../constants/global';

  const fkHttpRequest = () => require(`../__config__/actions/version_${Version()}/formHttpRequest/fkHttpRequest.js`);

  export default {
    name: 'Wangeditor',
    props: {
      tabAction: { // 是否可点击菜单
        type: Boolean,
        default: false
      },
      isActives: { // 是否可点编辑
        type: Boolean,
        default: true
      },
      valuedata: {
        type: String,
        default: ''
      },
      item: {
        type: Object,
        default() {
          return {};
        }
      }

    },
    data() {
      return {
        editor: {},
        ImgArray: [],
        IMGArray1: [],
        timertomUploadImg: false,
        value: '',
        Html: '',
        textHtml: '',
      };
    },
    mounted() {
      this.init();
      this.textHtml = this.valuedata;
      this.editor.txt.html(this.textHtml);
    },
    computed: {
      classes: () => `${classFix}editor`,
      itemData() {
        return this.item;
      }
    },
    watch: {
      valuedata() {
        this.textHtml = this.valuedata;
        if (!this.item.trigger) {
          this.editor.txt.html(this.textHtml);
        }
      }

    },
    methods: {
      init() {
        //  富文本初始化
        const self = this;
        this.editor = new wangEditor(`#${this.$refs.editor.id}`);
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
          self.value = html == '<p><br></p>' ? null : html;
          self.$emit('getChangeItem', self.value);
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
          self.value = this.textHtml;
          this.editor.txt.html(this.textHtml);
          // 是否可编辑，需要在初始化之后 true是可编辑，传过来的是false，取反
          if (this.isActives) {
            const _htmlMask = document.createElement('div');
            _htmlMask.setAttribute('id', 'editor_layer_mask');
            _htmlMask.style.display = 'block';
            editorSelector.appendChild(_htmlMask);
          }


          this.editor.$textElem.attr('contenteditable', !this.tabAction);
          const _block = !this.tabAction ? 'none' : 'block';
          const _html = document.createElement('div');
          _html.setAttribute('id', 'editor_layer');
          _html.style.display = _block;
          editorSelector.appendChild(_html);
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
      toggleFullscreen(editorSelector) {
        if (editorSelector.querySelector('._wangEditor_btn_fullscreen').innerText === this.$t('buttons.fullscreen')) {
          editorSelector.querySelector('._wangEditor_btn_fullscreen').innerText = this.$t('buttons.exitFullscreen');
          editorSelector.className = 'editor fullscreen-editor';
        } else {
          editorSelector.querySelector('._wangEditor_btn_fullscreen').innerText = this.$t('buttons.fullscreen');
          editorSelector.className = 'editor';
        }
      },
      toggleHtml(editorSelector) {
        if (editorSelector.querySelector('._wangEditor_btn_html').innerText === 'html') {
          editorSelector.querySelector('._wangEditor_btn_html').innerText = this.$t('buttons.exit');

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
      tomUploadImg() { // 上传图片方法
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
        //
        fkHttpRequest().editorUpload({
          params: {
            customUploadImg
          },
          // eslint-disable-next-line consistent-return
          success: (res) => {
            if (res.data.code === 0) {
              // 上传代码返回结果之后，将图片插入到编辑器中
              res.data.data.insert = data.insert;
              self.ImgArray.push(res.data.data);
              self.uploadProgress();
              // setTimeout(()=>{self.tomUploadImg()},500);
            }
            setTimeout(() => {
              self.tomUploadImg();
            }, 500);
          }
        });
      },
      uploadProgress() {
        if (this.timertomUploadImg == true) {
          return;
        }
        const upload = this.ImgArray.shift();
        if (!upload) {
          setTimeout(() => {
            this.uploadProgress();
          }, 500);
          return;
        }
        const self = this;
        fkHttpRequest().fkQueuploadProgressry({
          searchObject: {
            uploadId: upload.UploadId
          },
          // eslint-disable-next-line consistent-return
          success: (res) => {
            if (res.data.data == 100) {
              upload.insert(upload.Url);
              self.editor.customConfig.onchange = function (html) { // html 即变化之后的内容
                self.itemdata.valuedata = html == '<p><br></p>' ? null : html;
                self.$emit('getChangeItem', self.itemdata);
              };
            }
            setTimeout(() => {
              self.uploadProgress();
            }, 50);
          }
        });
      }


    }
  };
  </script>

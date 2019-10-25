<template>
  <div class="pro_desc">
    <!-- <div class="buttonGroup">
      <Button
        v-for="(item, index) in buttonGroup"
        :key="index"
        @click="buttonClick(item)"
        v-text="item.name"
      />
    </div> -->

    <div class="content">
      <!-- 商品／颜色主图 -->
      <Collapse
        v-model="openCollapse"
      >
        <Panel
          name="1"
          title-type="center"
        >
          商品/颜色主图 
          <div
            slot="content"
            class="item-area"
          >
            <div class="pro_img">
              <div>主图视频:</div>
              <div>
                <input
                  v-model="video"
                  type="text"
                  placeholder="视频VID"
                >
                <span
                  class="span-tip"
                  @click="showPicture"
                >视频上传教程</span>
                <span class="span-tip">
                  <a
                    :href="uploadImage"
                    target="_blank"
                  >视频上传入口</a>
                </span>
                <ul style="display: none;">
                  <li>
                    <div :style="{backgroundImage: 'url('+videoCover+')',height:'64px'}" />
                  </li>
                </ul>
              </div>
            </div>
            <div class="pro_img">
              <div>商品主图:</div>
              <div class="imageContent">
                <ul class="clearfix">
                  <li
                    v-for="(item,index) in proImg"
                    :key="index"
                    v-dragging="{ item: item, list: proImg, group: 'color', key: item }"
                    @mouseout.stop="proImgOut(item)"
                    @mouseover.stop="proImgDrag(item)"
                    @mousedown.stop="proImgOut(item)"
                  >
                    <i
                      v-show=" item.flag"
                      class="iconfont iconios-close-circle"
                      @click.stop="proImgDelect(item,index)"
                      @mousedown.stop
                    />
                    <Poptip
                      v-model="item.flag"
                      placement="right"
                      title
                      trigger="hover"
                      popper-class="el-popover-img"
                      transfer
                    >
                      <div
                        :style="{backgroundSize:'auto 100%',backgroundImage: 'url('+item.URL+'?x-oss-process=image/quality,q_80)',height:'64px',width:'64px'}"
                        :title="item.NAME" 
                      />
                      <div
                        slot="content"
                        :style="{backgroundSize:'auto 100%',backgroundImage: 'url('+item.URL+'?x-oss-process=image/quality,q_80)',height:'300px',width:'300px'}"
                        :title="item.NAME"
                      />

                      <!-- <div
                        slot="content"
                        :title="item.NAME"
                          style="width:300px;height:300px;z-index:100;position:relative;"
                      >
                        <img
                          :src="`${item.URL}?x-oss-process=image/quality,q_80`"
                            style="width:300px;height:300px;z-index:100;"
                        >
                      </div>

                      <img
                        v-if="item.URL.indexOf('http://5b0988e595225.cdn.sohucs.com/images/20180118/a0163c6be9d247918669229bed6c7280.png') < 0"
                        :src="item.URL"
                        style="width:64px;height: 64px"
                      > -->
                    </Poptip>
                  </li>

                  <li
                    v-if="proImg.length < 15"
                    @click="proImgChange"
                  >
                    <div :style="{height:'64px',border: '1px solid #c7c7c7'}">
                      <span class="upload-span">+ 添加图片</span>
                    </div>
                    <form
                      role="form"
                      method="POST"
                      enctype="multipart/form-data"
                      style="display: none"
                    >
                      <div>
                        <input
                          :id="'proImg'+objId"
                          type="file"
                          multiple="multiple"
                          style="filter:alpha(opacity=0);opacity:0;width: 0;height: 0;display: none"
                          @change.stop="uploadFileChange($event)"
                        >
                      </div>
                    </form>
                  </li>
                </ul>
                <p class="imageInstruction">
                  建议尺寸：800*800像素，你可以拖拽图片调整顺序，最多上传15张
                </p>
              </div>
            </div>
            <div class="pro_color_img">
              <div>颜色主图:</div>
              <div class="imageContent">
                <ul class="clearfix">
                  <li
                    v-for="(item,index) in colorList"
                    :key="index"
                  >
                    <span>{{ item.ECODE+item.ENAME }}</span>
                    <div
                      @mouseout.stop="colImgOut(item)"
                      @mouseover.stop="colImgDrag(item)"
                      @mousedown.stop="colImgOut(item)"
                    >
                      <i
                        v-show="item.flag &&item.URL !== ''"
                        class="iconfont iconios-close-circle"
                        @click.stop="colImgDelete(item,index)"
                        @mousedown.stop
                      />
                      <span
                        class="upload-span"
                        @click="colImgChange(item,index)"
                      >+ 添加图片</span>
                      <Poptip
                        v-model="item.flag"
                        placement="right"
                        title
                        trigger="hover"
                        transfer
                      >
                      {{item.flag}}
                        <div
                          :style="{backgroundSize:'auto 100%',backgroundImage: 'url('+item.URL+'?x-oss-process=image/quality,q_80)',height:'64px',width:'64px'}"
                          :title="item.NAME" 
                        />
                        <div
                          slot="content"
                          :style="{backgroundSize:'auto 100%',backgroundImage: 'url('+item.URL+'?x-oss-process=image/quality,q_80)',height:'300px',width:'300px'}"
                          :title="item.NAME"
                        />
                      </Poptip>
                    </div>
                  </li>
                </ul>
                <p class="imageInstruction">
                  建议尺寸：800*800像素，颜色项维护请在“颜色尺寸”栏。
                </p>
              </div>
            </div>
          </div>
        </Panel>
      </Collapse>
    </div>
  </div>
</template>

<script>
  import ChineseDictionary from '../../assets/js/ChineseDictionary';
  import network, { urlSearchParams } from '../../__utils__/network';

  export default {
    name: 'ProDesc',
    created() {
      this.ChineseDictionary = ChineseDictionary;

      if (this.status) {
        this.buttonGroup.splice(0, 1);
      }

      this.getData();
    },
    mounted() {
      const { tableName, tableId, itemId } = this.$route.params;
      this.objId = itemId;
    //   this.$dragging.$on('dragged', ({ value }) => {});
    //   this.$dragging.$on('dragend', ({ value }) => {
    //     this.saveObj.IMAGE = JSON.stringify(this.proImg);
    //   });
    },
    props: {
    },
    watch: {
    },
    data() {
      return {
        objId: '',
        openCollapse: '1',
        ChineseDictionary: {},
        currentView: '', // 控制富文本
        buttonGroup: [
          {
            name: '保存',
            icon: '',
            defbutton: 'N',
            action: ''
          },
          {
            name: '刷新',
            icon: '',
            defbutton: 'J',
            action: ''
          },
          {
            name: '返回',
            icon: '',
            defbutton: null,
            action: ''
          }
        ], // 按钮组
        itemdata: {
          // 富文本的传值
          colid: this.objId,
          valuedata: ''
        },
        storageItem: {
          name: 'PS_C_PRO',
          id: this.objId
        },
        formObj: {
        // 日志数据
        },
        childs: [
          // 控制收缩
          {
            show: true
          },
          {
            show: true
          },
          {
            show: true
          }
        ],
        video: '',
        videoCover: '',
        proImg: [
        // 商品主图
        ],
        colorList: [
        // 颜色主图
        ],

        saveObj: {
        // 保存数据
        },
        pictureDialog: { show: false },
        uploadImage: 'http://signin.aliyun.com/qiaodan/login.htm'
      };
    },
    components: {
    },
    methods: {
      reaptData(obj) {
        // 深拷贝
        if (obj instanceof Array) {
          // array
          const temp = [];
          obj.forEach((item, index) => {
            const temp2 = [];
            if (item instanceof Array) {
              item.forEach((item2, index) => {
                temp2.push(item2);
              });
              temp.push(temp2);
            } else {
              temp.push(item);
            }
          });
          return temp;
        } 
        // obj
        const temp = {};

        for (const item in obj) {
          temp[item] = obj[item];
        }

        return temp;
      },
     
    
      getData() {
        // 获取数据
       
        const { tableName, tableId, itemId } = this.$route.params;

        // 获取主图
        network.post('/p/cs/proImage', urlSearchParams({
          param: {
            PS_C_PRO_ID: itemId
          }
        })).then((res) => {
          if (res.data.code === 0) {
            if (res.data.data) {
              this.proImg = [];
              // 商品主图
              if (res.data.data.UPLOAD_IMAGE_BASE) {
                this.uploadImage = res.data.data.UPLOAD_IMAGE_BASE;
              }
              if (res.data.data.IMAGE) {
                this.proImg = JSON.parse(res.data.data.IMAGE);
                this.proImg.forEach((item) => {
                  this.$set(item, 'flag', false);
                });
              } 
              // else if (!this.modify) {
              //   this.proImg.push({
              //     NAME: '默认图片',
              //     URL: '/src/assets/image/open@2x.png'
              //   });
              // }
            }
          }

          // 获取颜色主图
          const params = {
            param: {
              PS_C_PRO_ID: itemId
            }
          };
          network.get('/p/cs/cprospecload', {
            params
          }).then((col) => {
            if (col.data.code === 0) {
              this.colorList = [];
              this.colorList = col.data.data.COLOR;

              if (col.data.data.COLOR.length > 0) {
                col.data.data.COLOR.forEach((item) => {
                  if (res.data.data) {
                    if (!res.data.data.IMAGE_SKU || res.data.data.IMAGE_SKU.length == 0) {
                      // if (this.modify) {
                      //   this.$set(item, 'URL', '');
                      //   this.$set(item, 'flag', false);
                      //   // item.URL = '/static/img/addImg.png'
                      // } else {
                      // this.$set(item, 'URL', 'http://5b0988e595225.cdn.sohucs.com/images/20180118/a0163c6be9d247918669229bed6c7280.png');
                      this.$set(item, 'flag', false);
                      // item.URL = '/static/img/default@2x.png'
                      // }
                    } else {
                      JSON.parse(res.data.data.IMAGE_SKU).forEach((temp) => {
                        if (temp.ID === item.ID) {
                          this.$set(item, 'flag', false);
                          if (temp.URL) {
                            this.$set(item, 'URL', temp.URL);
                          } else {
                            // this.$set(item, 'URL', 'http://5b0988e595225.cdn.sohucs.com/images/20180118/a0163c6be9d247918669229bed6c7280.png');
                          }
                          // item.URL = temp.URL
                        }
                      });
                    }
                  }
                });
              }
            }
          });
        });
      },
     
      proImgDelect(item, index) {
        // 商品主图删除
        this.proImg.splice(index, 1);
        this.saveObj.IMAGE = JSON.stringify(this.proImg);
      },
      proImgChange() {
        $(`#proImg${this.objId}`).trigger('click');
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isGIF = file.type === 'image/gif';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isGIF && !isPNG) {
          this.$message.error('上传图片只能是 JPG,PNG,GIF 格式!');
          $(`#proImg${this.objId}`).val('');
          $(`#colImg${this.objId}`).val('');
        } else if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
          $(`#proImg${this.objId}`).val('');
          $(`#colImg${this.objId}`).val('');
        }

        return (isJPG || isGIF || isPNG) && isLt2M;
      },
      uploadFileChange() {
        // 主图上传
        const list = $(`#proImg${this.objId}`)[0].files;
        let value = '';

        if (this.proImg.length + list.length > 15) {
          this.$message.error(`最多上传${15 - this.proImg.length}张图片`);
          $(`#proImg${this.objId}`).val('');

          return;
        }
        for (let i = 0; i < list.length; i++) {
          value = list[i];
          if (!this.beforeAvatarUpload(value)) {
            return;
          }

          const data = new FormData();
          const path = `PS_C_PRO/${this.objId}/`;
          data.append('file', value);
          data.append('path', path);
          if (value == undefined) {
            return;
          }

          this.$ajax.formAjax(
            '/p/cs/upload2',
            data,
            (res) => {
              this.uploadProgress(res.data.UploadId, () => {
                this.proImg.push({
                  NAME: res.data.Name,
                  URL: res.data.Url,
                  flag: false
                });
                this.saveObj.IMAGE = JSON.stringify(this.proImg);
              });
            },
            false
          );

          setTimeout(() => {
            $(`#proImg${this.objId}`).val('');
          }, 200);
        }
      },
      uploadProgress(uploadid, cb) {
        // 主图上传进度
        const callback = cb;
        $.ajax({
          url: '/p/cs/uploadProgress',
          type: 'post',
          dataType: 'json',
          async: false,
          data: { uploadId: uploadid },
          success(res) {
            if (res.code == 0) {
              if (res.data == 100) {
                callback();
              } else {
                setTimeout(() => {
                  this.uploadProgress(uploadid, cb);
                }, 50);
              }
            } else {
              $(`#proImg${this.objId}`).val('');
            }
          },
          error(res) {
            $(`#proImg${this.objId}`).val('');
          }
        });
      },
      colImgChange(item, index) {
           const dom = document.getElementById(`colImg${this.objId}${index}`);
           console.log(`colImg${this.objId}${index}`)
          dom.click();
          // $(`#colImg${this.objId}${index}`).trigger('click');
      },
      uploadColorChange(item, index) {
        // 颜色图上传

        const value = $(`#colImg${this.objId}${index}`)[0].files[0];
        if (!value || !this.beforeAvatarUpload(value)) {
          return;
        }

        const data = new FormData();
        const path = `PS_C_SKU/${this.objId}/`;
        data.append('file', value);
        data.append('path', path);
        if (value == undefined) {
          return;
        }

        this.$ajax.formAjax(
          '/p/cs/upload2',
          data,
          (res) => {
            this.uploadProgress(res.data.UploadId, () => {
              this.$set(this.colorList[index], 'URL', res.data.Url);
              this.saveObj.IMAGE_SKU = JSON.stringify(this.colorList);
            });
          },
          false
        );

        setTimeout(() => {
          $(`#colImg${this.objId}${index}`).val('');
        }, 200);
      },
      colImgDelete(item, index) {
        // 颜色图的删除
        this.$set(this.colorList[index], 'URL', '');
        this.saveObj.IMAGE_SKU = JSON.stringify(this.colorList);
      },
      getChangeItem(value) {
        // 富文本的修改
        this.saveObj.DETAILDESC = value.valuedata;
      },
      proImgDrag(item) {
        // this.proImg[index].flag = true
        this.$set(item, 'flag', true);
      },
      proImgOut(item) {
        // this.proImg[index].flag = false
        this.$set(item, 'flag', false);
      },
      colImgDrag(item) {
        // this.proImg[index].flag = true

        if (item.URL == '') {
        } else {
          this.$set(item, 'flag', true);
        }
      },
      colImgOut(item) {
        // this.proImg[index].flag = false
        this.$set(item, 'flag', false);
      },
      showPicture() {
        this.pictureDialog.show = true;
      },
      fetchCover() {
        if (this.video) {
          fetch(`/p/cs/videoInfo?videoId=${this.video}`).then((res) => {
            console.log(res.data.ret);
            this.videoCover = res.data.ret.coverURL;
          });
        }
      }
    }
  };
</script>

<style lang="less">
.pro_desc {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  .buttonGroup {
    margin-top: 10px;
    margin-bottom: 9px;
    font-size: 0;
    height: 24px;
    button {
      height: 24px;
      width: auto;
      margin-right: 8px;
      margin-left: 0px;
      padding: 0 8px;
      background: #fff;
      color: #fd6442;
      border: 1px solid #fd6442;
      border-radius: 2px;
      font-size: 12px;

      &:hover {
        border-color: rgba(253, 100, 66, 0.6);
        color: rgba(253, 100, 66, 0.6);
      }
    }

    > button:last-child {
      margin-right: 0px;
    }
  }

  .content {
    flex: 1;
    overflow: auto;
      .item-area {
        .imageContent{
          display: flex;
          flex-direction: column;
        }
         >div{
            min-height: 64px;
          }
        .pro_img {
          display: flex;
          > div {
            // display: inline-block;
            .upload-span {
              cursor: pointer;
              display: block;
              height: 62px;
              width: 62px;
              line-height: 62px;
              transform: scale(0.9);
            }
            .span-tip {
              color: #0f8ee9;
              cursor: pointer;
              margin: 0 6px;
              a {
                color: #0f8ee9;
                text-decoration: none;
              }
            }
          }

          > div:first-child {
            width: 90px;
            margin-right: 12px;
            text-align: right;
          }

          > div:last-child {
            flex: 1;
            
            > p {
              color: #d3d3d3;
              font-size: 12px;
            }


            .clearfix::before,
            .clearfix::after {
              content: "";
            }
            .clearfix::after {
              clear: both;
            }
            ul {
              list-style:none;
              li {
                width: 64px;
                height: 64px;
                margin-right:15px;
                // padding-right: 12px;
                padding-bottom: 10px;
                float: left;
                margin-bottom: 10px;
                position: relative;
                > i.iconios-close-circle {
                  color: #e80000;
                  position: absolute;
                  top: -11px;
                  right: -4px;
                  cursor: pointer;
                  z-index: 10;
                }

                > span {
                  width: 64px;
                  height: 64px;
                  display: inline-block;

                  > div {
                    background-size: auto 100%;
                    background-position: center;
                    background-repeat: no-repeat;
                  }
                }

                > div {
                  // width: 100%;
                  // height: 100%;
                  // border: 1px solid #c7c7c7;
                  // color: #0f8ee9;
                  // text-align: center;
                  // box-sizing: border-box;
                  // background-size: auto 100%;
                  // background-position: center;
                  // background-repeat: no-repeat;
                }
              }

              li:last-child {
                div {
                  background-size: auto 90%;
                }
              }
            }
          }
        }

        .pro_color_img {
          margin-top: 12px;
          display: flex;
          > div {
            // display: inline-block;
          }

          > div:first-child {
            width: 90px;
            margin-right: 12px;
            text-align: right;
          }

          > div:last-child {
            flex: 1;
            .clearfix::before,
            .clearfix::after {
              content: "";
            }
            .clearfix::after {
              clear: both;
            }
            ul {
              list-style:none;
              li {
                min-width: 64px;
                margin-right: 12px;
                float: left;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin-bottom: 10px;
                > span {
                  display: inline-block;
                  height: 20px;
                  line-height: 20px;
                  width: 100%;
                  text-align: center;
                  box-sizing: border-box;
                  border: 1px solid #c7c7c7;
                  border-radius: 2px;
                  padding: 0 5px;
                }

                > div {
                  /*padding: 2px;*/
                  border: 1px solid #c7c7c7;
                  height: 64px;
                  box-sizing: border-box;
                  position: relative;
                  margin-top: 2px;
                  width: 64px;

                  i.iconios-close-circle {
                    color: #e80000;
                    position: absolute;
                    right: -5px;
                    top: -6px;
                    cursor: pointer;
                    z-index: 10;
                  }
                  > span:first-child {
                    display: inline-block;
                    position: absolute;
                    top: -4px;
                    left: 50%;
                    margin-left: -2px;
                    border-left: 4px solid transparent;
                    border-right: 4px solid transparent;
                    border-bottom: 4px solid #c7c7c7;

                    &:after {
                      content: "";
                      position: absolute;
                      top: 1px;
                      left: -3px;
                      border-left: 3px solid transparent;
                      border-right: 3px solid transparent;
                      border-bottom: 3px solid white;
                    }
                  }

                  > span:last-child {
                    display: block;
                    width: 100%;
                    height: 100%;
                    div {
                      width: 100%;
                      display: inline-block;
                      background-size: auto 100%;
                      background-position: center;
                      background-repeat: no-repeat;
                    }

                    .default {
                      background-size: auto 90%;
                    
                    }
                  }
                  > div {
                    width: 100%;
                    display: inline-block;
                    background-size: auto 100%;
                    background-position: center;
                    background-repeat: no-repeat;
                  }
                }
              }
            }
          }
        }
      }
    .pro_detail {
      .item-area {
        position: relative;
        padding: 10px;
        > div {
          position: relative;
        }
      }
    }

    .pro_mark {
      .item-area {
        display: flex;
        .el-col {
          flex: 1;
          height: 28px;
          display: flex;
          label {
            text-align: right;
            width: 102px;
            display: inline-block;
            height: 28px;
            line-height: 28px;
          }

          span {
            display: inline-block;
            flex: 1;
            height: 24px;
            line-height: 22px;
            margin-top: 2px;
            box-sizing: border-box;
            border: 1px solid #bfcbd9;
            padding: 0 4px;
            background: #f4f4f4;
            border-radius: 2px;
          }
        }
      }
    }
    .imageInstruction{
        color: #d3d3d3;
        font-size: 12px;
        margin-top: 8px;
    }
      .upload-span {
                        cursor: pointer;
                        color: #0f8ee9;
                        display: block;
                        height: 62px;
                        width: 62px;
                        line-height: 62px;
                        transform: scale(0.9);
                      }
  }
  .pictureDialog {
    .el-dialog__body {
      padding: 0;
      .dialog-scroll {
        height: 560px;
        width: 1000px;
        overflow: auto;
      }
    }
  }
}
</style>

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
      <Collapse v-model="openCollapse">
        <Panel title-type="center" name="1"/>
        商品/颜色主图 
      </Collapse>
      <div
        class="pro_c"
        :class="{'flod':!childs[0].show}"
      >
        <h5 @click="triangleDisplay('pro_c')">
          商品/颜色主图&nbsp;
          <i
            v-show="childs[0].show"
            class="iconfont"
          >&#xe645;</i>
          <i
            v-show="!childs[0].show"
            class="iconfont"
          >&#xe616;</i>
        </h5>
        <div class="item-area">
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
            <div>
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
                    v-show="modify && item.flag"
                    class="iconfont deleteIcon"
                    @click.stop="proImgDelect(item,index)"
                    @mousedown.stop
                  >&#xe6b4;</i>
                  
                  <Poptip
                    v-model="item.flag"
                    placement="right"
                    title
                    trigger="hover"
                    popper-class="el-popover-img"
                  >
                    <div
                      slot="reference"
                      :style="{backgroundImage: 'url('+item.URL+'?x-oss-process=image/quality,q_80)',height:'64px'}"
                      :title="item.NAME"
                    />
                    <img
                      v-if="item.URL.indexOf('/static/img/default@2x.png') < 0"
                      :src="item.URL"
                      :style="{maxWidth:'400px'}"
                    >
                  </Poptip>
                </li>

                <li
                  v-if="modify && proImg.length < 15"
                  @click="proImgChange"
                >
                  <div :style="{height:'64px'}">
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
              <p v-if="modify">
                建议尺寸：800*800像素，你可以拖拽图片调整顺序，最多上传15张
              </p>
            </div>
          </div>
          <div class="pro_color_img">
            <div>颜色主图:</div>
            <div>
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
                    <span />
                    <i
                      v-show="modify && item.flag"
                      class="iconfont deleteIcon"
                      @click.stop="colImgDelete(item,index)"
                      @mousedown.stop
                    >&#xe6b4;</i>
                    <Poptip
                      placement="right"
                      title
                      trigger="hover"
                      popper-class="el-popover-img"
                    >
                      <!--<div slot="reference" v-bind:style="{backgroundImage: 'url('+item.URL+'?x-oss-process=image/quality,q_80)',height:'64px'}" :class="{'default':item.URL != '/static/img/default@2x.png'}"  @click="colImgChange(item,index)"></div>-->

                      <div
                        slot="reference"
                        :style="{backgroundImage: 'url('+item.URL+')',height:'62px'}"
                        :class="{'default':item.URL != '/static/img/default@2x.png'}"
                        @click="colImgChange(item,index)"
                      >
                        <span
                          v-if="item.URL == ''"
                          class="upload-span"
                        >+ 添加图片</span>
                      </div>
                      <img
                        v-if="item.URL != '/static/img/default@2x.png' && item.URL != ''"
                        :src="item.URL"
                        :style="{maxWidth:'400px'}"
                      >
                      <form
                        slot="reference"
                        role="form"
                        method="POST"
                        enctype="multipart/form-data"
                        style="display: none"
                      >
                        <div>
                          <input
                            :id="'colImg'+objId+index"
                            type="file"
                            style="filter:alpha(opacity=0);opacity:0;width: 0;height: 0;display: none"
                            @change.stop="uploadColorChange(item,index)"
                          >
                        </div>
                      </form>
                    </Poptip>
                  </div>
                </li>
              </ul>
              <p v-if="modify">
                建议尺寸：800*800像素，颜色项维护请在“颜色尺寸”栏。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ChineseDictionary from '../../assets/js/ChineseDictionary';

  export default {
    name: 'ProDesc',
    created() {
      this.ChineseDictionary = ChineseDictionary;

      if (!this.modify || this.status) {
        this.buttonGroup.splice(0, 1);
      }

      this.getData();
    },
    mounted() {
    //   const self = this;
    //   this.$dragging.$on('dragged', ({ value }) => {});
    //   this.$dragging.$on('dragend', ({ value }) => {
    //     self.saveObj.IMAGE = JSON.stringify(self.proImg);
    //   });
    },
    props: {
      modify: {
      // 保存按钮控制  true 标准商品档案  false 配销中心
      },
      objId: {
        type: String
      },
      tabConfig: {},
      status: {}, // 整体状态,是否可编辑
      exportFlag: {} // 导入状态
    },
    watch: {
      objId: {
        handler(val, oldval) {
          this.getData();
        }
      }
    },
    data() {
      return {
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
      getMyDate(str) {
        const oDate = new Date(str);
        const oYear = oDate.getFullYear();
        const oMonth = oDate.getMonth() + 1;
        const oDay = oDate.getDate();
        const oHour = oDate.getHours();
        const oMin = oDate.getMinutes();
        const oSen = oDate.getSeconds();
        const oTime = `${oYear 
        }-${ 
          this.getzf(oMonth) 
        }-${ 
          this.getzf(oDay) 
        } ${ 
          this.getzf(oHour) 
        }:${ 
          this.getzf(oMin) 
        }:${ 
          this.getzf(oSen)}`; // 最后拼接时间
        return oTime;
      },
      // 补0操作
      getzf(num) {
        if (parseInt(num) < 10) {
          num = `0${num}`;
        }
        return num;
      },
      triangleDisplay(option) {
        // 收缩切换

        $(`.${option}`)
          .find('.item-area')
          .slideToggle();
        if (option == 'pro_c') {
          this.childs[0].show = !this.childs[0].show;
        } else if (option == 'pro_detail') {
          this.childs[1].show = !this.childs[1].show;
        } else {
          this.childs[2].show = !this.childs[2].show;
        }
      },
      buttonClick(item) {
        if (item.name == '返回') {
          this.goBack();
          return;
        }

        if (item.name == '刷新') {
          this.saveObj = {};
          this.getData();
        }

        if (item.name == '保存') {
          this.objectSave();
        }
      },
      goBack() {
        // 返回
        // let type = this.$store.state.activeTab.type;
        // let params = {
        //   name: this.$route.query.tableName,
        //   label: this.$route.query['ptitle'],
        //   id: this.$route.query.id,
        //   pid: this.$route.query.pid,
        //   type: this.$route.query.ptype,
        //   ctype: type,
        //   path: '/'+this.$route.path.split('/')[1] + '/'+ this.$route.query.ptype + '/' + this.$route.query.tableName + '?id=' + this.$route.query.pid
        // }

        const _self = this;

        const query = _self.$route.query;
        query.id = query.cid;
        delete query.cid;
        // 返回列表的
        const params = {
          id: _self.$route.query.pid,
          type: 'table',
          name: _self.$route.query.tableName,
          label: _self.$route.query.ptitle
        };
        // 返回单对象的
        // let params = {
        //   id: query.id,
        //   type: 'singleView',
        //   name: _self.$route.query.tableName,
        //   label: _self.$route.query.tabTitle,
        //   query: query
        // };
        console.log(params);
        _self.$store.commit('TabClose', params);
      },
      getData() {
        // 获取数据
        const self = this;

        // 获取主图
        axios({
          url: '/p/cs/proImage',
          method: 'post',
          data: {
            param: JSON.stringify({
              PS_C_PRO_ID: self.objId
            })
          }
        }).then((pro) => {
          if (pro.data.code == 0) {
            if (pro.data.data) {
              self.proImg = [];
              // 商品主图
              if (pro.data.data.UPLOAD_IMAGE_BASE) {
                self.uploadImage = pro.data.data.UPLOAD_IMAGE_BASE;
              }
              if (pro.data.data.IMAGE) {
                self.proImg = JSON.parse(pro.data.data.IMAGE);

                self.proImg.forEach((item) => {
                  // item.flag = false

                  self.$set(item, 'flag', false);
                });
              } else if (!self.modify) {
                self.proImg.push({
                  NAME: '默认图片',
                  URL: '/static/img/default@2x.png'
                });
              }

              // 其他数据

              self.$set(self.itemdata, 'valuedata', pro.data.data.DETAILDESC);
              self.currentView = 'editor';
              self.formObj = pro.data.data;

              self.video = pro.data.data.VIDEO;

              self.$nextTick(() => {
                if (self.$refs[`editor${self.objId}`]) {
                  self.$refs[`editor${self.objId}`].getData(self.itemdata);
                }
              });
            } else {
              self.proImg = [];
              self.currentView = 'editor';
              self.$set(self.itemdata, 'valuedata', null);
              self.$nextTick(() => {
                if (self.$refs[`editor${self.objId}`]) {
                  self.$refs[`editor${self.objId}`].getData(self.itemdata);
                }
              });
            }
          }

          // 获取颜色主图
          axios({
            url: '/p/cs/cprospecload',
            method: 'get',
            params: {
              param: JSON.stringify({
                PS_C_PRO_ID: self.objId
              })
            }
          }).then((col) => {
            if (col.data.code == 0) {
              self.colorList = [];
              self.colorList = col.data.data.COLOR;

              if (col.data.data.COLOR.length > 0) {
                col.data.data.COLOR.forEach((item, index) => {
                  if (pro.data.data) {
                    if (
                      !pro.data.data.IMAGE_SKU
                      || pro.data.data.IMAGE_SKU.length == 0
                    ) {
                      console.log(self.modify);
                      if (self.modify) {
                        self.$set(item, 'URL', '');
                        self.$set(item, 'flag', false);
                      // item.URL = '/static/img/addImg.png'
                      } else {
                        self.$set(item, 'URL', '/static/img/default@2x.png');
                        self.$set(item, 'flag', false);
                      // item.URL = '/static/img/default@2x.png'
                      }
                    } else {
                      JSON.parse(pro.data.data.IMAGE_SKU).forEach((temp) => {
                        if (temp.ID == item.ID) {
                          self.$set(item, 'flag', false);
                          if (temp.URL) {
                            self.$set(item, 'URL', temp.URL);
                          } else if (self.modify) {
                            self.$set(item, 'URL', '');
                          } else {
                            self.$set(
                              item,
                              'URL',
                              '/static/img/default@2x.png'
                            );
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
      objectSave() {
        // 保存
        const self = this;

        self.proImg.forEach((item) => {
          item.flag = false;
        });

        if (self.saveObj.IMAGE_SKU) {
          const arr = self.reaptData(JSON.parse(self.saveObj.IMAGE_SKU));

          if (arr.length > 0) {
            arr.forEach((index, item) => {
              if (index.URL == '') {
                index.URL = null;
              }

              delete index.flag;
            });

            self.saveObj.IMAGE_SKU = JSON.stringify(arr);
          }
        }

        if (self.saveObj.IMAGE) {
          if (JSON.parse(self.saveObj.IMAGE).length > 0) {
            const arr = JSON.parse(self.saveObj.IMAGE);
            if (arr.length > 0) {
              arr.forEach((index, item) => {
                delete index.flag;
              });
              if (arr.length == 0) {
                self.saveObj.IMAGE = null;
              } else {
                self.saveObj.IMAGE = JSON.stringify(arr);
              }
            }
          } else {
            self.saveObj.IMAGE = null;
          }
        }

        if (self.video) self.saveObj.VIDEO = self.video;
        else self.saveObj.VIDEO = '';

        const obj = {
          table: 'PS_C_PRO',
          objid: self.objId,
          data: JSON.stringify({ PS_C_PRO: self.saveObj })
        };

        self.$ajax.dataAjax('/p/cs/objectSave', obj, (res) => {
          self.$message({
            message: res.message,
            type: 'success'
          });
          self.saveObj = {};
          self.getData();
        });
      },
      proImgDelect(item, index) {
        // 商品主图删除
        const self = this;
        this.proImg.splice(index, 1);
        self.saveObj.IMAGE = JSON.stringify(self.proImg);
      },
      proImgChange() {
        $(`#proImg${this.objId}`).trigger('click');
      },
      beforeAvatarUpload(file) {
        const self = this;
        const isJPG = file.type === 'image/jpeg';
        const isGIF = file.type === 'image/gif';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isGIF && !isPNG) {
          this.$message.error('上传图片只能是 JPG,PNG,GIF 格式!');
          $(`#proImg${self.objId}`).val('');
          $(`#colImg${self.objId}`).val('');
        } else if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
          $(`#proImg${self.objId}`).val('');
          $(`#colImg${self.objId}`).val('');
        }

        return (isJPG || isGIF || isPNG) && isLt2M;
      },
      uploadFileChange() {
        // 主图上传
        const self = this;
        const list = $(`#proImg${self.objId}`)[0].files;
        let value = '';

        if (self.proImg.length + list.length > 15) {
          this.$message.error(`最多上传${15 - self.proImg.length}张图片`);
          $(`#proImg${self.objId}`).val('');

          return;
        }
        for (let i = 0; i < list.length; i++) {
          value = list[i];
          if (!self.beforeAvatarUpload(value)) {
            return;
          }

          const data = new FormData();
          const path = `PS_C_PRO/${self.objId}/`;
          data.append('file', value);
          data.append('path', path);
          if (value == undefined) {
            return;
          }

          self.$ajax.formAjax(
            '/p/cs/upload2',
            data,
            (res) => {
              self.uploadProgress(res.data.UploadId, () => {
                self.proImg.push({
                  NAME: res.data.Name,
                  URL: res.data.Url,
                  flag: false
                });
                self.saveObj.IMAGE = JSON.stringify(self.proImg);
              });
            },
            false
          );

          setTimeout(() => {
            $(`#proImg${self.objId}`).val('');
          }, 200);
        }
      },
      uploadProgress(uploadid, cb) {
        // 主图上传进度
        const callback = cb;
        const self = this;

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
                  self.uploadProgress(uploadid, cb);
                }, 50);
              }
            } else {
              $(`#proImg${self.objId}`).val('');
            }
          },
          error(res) {
            $(`#proImg${self.objId}`).val('');
          }
        });
      },
      colImgChange(item, index) {
        if (this.modify) {
          $(`#colImg${this.objId}${index}`).trigger('click');
        }
      },
      uploadColorChange(item, index) {
        // 颜色图上传
        const self = this;

        const value = $(`#colImg${self.objId}${index}`)[0].files[0];
        if (!value || !self.beforeAvatarUpload(value)) {
          return;
        }

        const data = new FormData();
        const path = `PS_C_SKU/${self.objId}/`;
        data.append('file', value);
        data.append('path', path);
        if (value == undefined) {
          return;
        }

        self.$ajax.formAjax(
          '/p/cs/upload2',
          data,
          (res) => {
            self.uploadProgress(res.data.UploadId, () => {
              self.$set(self.colorList[index], 'URL', res.data.Url);
              self.saveObj.IMAGE_SKU = JSON.stringify(self.colorList);
            });
          },
          false
        );

        setTimeout(() => {
          $(`#colImg${self.objId}${index}`).val('');
        }, 200);
      },
      colImgDelete(item, index) {
        // 颜色图的删除
        const self = this;
        self.$set(self.colorList[index], 'URL', '');
        self.saveObj.IMAGE_SKU = JSON.stringify(self.colorList);
      },
      getChangeItem(value) {
        // 富文本的修改
        this.saveObj.DETAILDESC = value.valuedata;
      },
      proImgDrag(item) {
        const self = this;
        // self.proImg[index].flag = true
        this.$set(item, 'flag', true);
      },
      proImgOut(item) {
        const self = this;
        // this.proImg[index].flag = false
        this.$set(item, 'flag', false);
      },
      colImgDrag(item) {
        const self = this;
        // self.proImg[index].flag = true

        if (item.URL == '') {
        } else {
          this.$set(item, 'flag', true);
        }
      },
      colImgOut(item) {
        const self = this;
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

    > div {
      border: 1px solid #b4b4b4;
      border-radius: 4px;
      margin-bottom: 10px;

      > h5 {
        color: #1f2d3d;
        background: #f8f7f7;
        text-align: center;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        font-weight: normal;
        border-bottom: solid 1px #b4b4b4;
      }

      > .item-area {
        padding: 10px 10px 10px 0;
      }
    }

    > div.flod {
      > h5 {
        border-bottom: none;
      }
    }

    .pro_c {
      .item-area {
        > div {
          min-height: 64px;
        }

        .pro_img {
          display: flex;
          > div {
            display: inline-block;
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
              li {
                width: 64px;
                height: 64px;
                padding-right: 12px;
                padding-bottom: 10px;
                float: left;
                position: relative;

                > i.deleteIcon {
                  color: #e80000;
                  position: absolute;
                  top: -9px;
                  right: 7px;
                  cursor: pointer;
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
                  width: 100%;
                  height: 100%;
                  border: 1px solid #c7c7c7;
                  color: #0f8ee9;
                  text-align: center;
                  box-sizing: border-box;
                  background-size: auto 100%;
                  background-position: center;
                  background-repeat: no-repeat;
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
            display: inline-block;
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
              margin-top: 8px;
            }
            .clearfix::before,
            .clearfix::after {
              content: "";
            }
            .clearfix::after {
              clear: both;
            }
            ul {
              li {
                min-width: 64px;
                margin-right: 12px;
                float: left;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
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

                  i.deleteIcon {
                    position: absolute;
                    right: 0px;
                    top: -3px;
                    color: #e80000;
                    cursor: pointer;
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

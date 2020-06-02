<template>
  <div class="pro_desc">
    <div class="buttonGroup">
      <Button
        v-for="(item, index) in buttonGroup"
        :key="index"
        @click="buttonClick(item)"
        v-text="item.name"
      />
    </div>
    
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
                        v-show="item.flag &&item.URL == ''"
                        class="iconfont iconios-close-circle"
                        @click.stop="colImgDelete(item,index)"
                        @mousedown.stop
                      />
                      
                      <Poptip
                        v-model="item.flag"
                        placement="right"
                        title
                        trigger="hover"
                        transfer
                      >
                        <span
                          v-if="!item.URL"
                          class="upload-span"
                          @click="colImgChange(item,index)"
                        >+ 添加图片
                          <form
                            role="form"
                            method="POST"
                            enctype="multipart/form-data"
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
                        </span>
                       
                        <div
                          v-if="item.URL"
                          :style="{backgroundSize:'auto 100%',backgroundImage: 'url('+item.URL+'?x-oss-process=image/quality,q_80)',height:'64px',width:'64px'}"
                          :title="item.NAME" 
                        />
                        <div
                          v-if="item.URL=== ''"
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
    <Modal
      v-model="dialogShow"
      title="视频上传教程"
      :width="1100"
      :height="560"
      :footer-hide="true"
      :closable="true"
    >
      <div class="dialog-scroll">
        <img
          src="/src/assets/image/course.jpg"
          width="100%"
        >
      </div>
    </Modal>
  </div>
</template>

<script>
  import network, { urlSearchParams } from '../../__utils__/network';
  import { custommizedRequestUrl, MODULE_COMPONENT_NAME, INSTANCE_ROUTE_QUERY } from '../../constants/global';
  import store from '../../__config__/store.config';

  export default {
    name: 'ProDesc',
    inject: [MODULE_COMPONENT_NAME, INSTANCE_ROUTE_QUERY],  

    created() {
      const { itemId } = this.$route.params;
      if (itemId !== 'New') {
        this.getData();
      }
    },
    mounted() {
      const { itemId } = this.$route.params;
      this.objId = itemId;
      // if (!this._inactive) {
      //   window.addEventListener('customizeClick', this.clickCustomize);
      // }
    },
    props: {
      itemInfo: {// 当前子表信息
        type: Object,
        default: () => ({})
      },
    },
    watch: {
    },
    data() {
      return {
        buttonGroup: [
          { name: '保存', eName: 'save' },
          { name: '刷新', eName: 'refresh' },
          { name: '返回', eName: 'back' }


        ],
        saveParams: {},
        dialogShow: false,
        // dialogConfig: {
        //   title: '提示',
        //   mask: true,
        //   footerHide: false,
        //   contentText: '',
        //   confirm: () => {
        //   }
        // }, // 弹框配置信息
        objId: '',
        openCollapse: '1',
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
        uploadImage: 'http://signin.aliyun.com/qiaodan/login.htm'
      };
    },
    components: {
    },
    methods: {
      buttonClick(data) {
        if (data.eName === 'save') {
          this.objectSave();
        } else if (data.eName === 'refresh') {
          this.getData('refresh');
        } else {
          const param = {
            tableId: '23276',
            tableName: 'PS_C_PRO',
            back: true,
          };
          store.commit('global/tabOpen', param);
        }
      },
      // clickCustomize(event) {
      //   // store.commit(`${this[MODULE_COMPONENT_NAME]}/updateModifyData`, { tableName: this.itemInfo.tablename, value: this.saveObj });
      //   if (event.detail.type === 'save') {
      //     this.saveParams = event.detail;
      //     this.objectSave(event.detail);
      //   }
      // },
      getData(type) {
        // 获取数据
       
        const { itemId } = this.$route.params;

        // 获取主图
        const url = custommizedRequestUrl()['/p/cs/proImage'];
        network.post(url || '/p/cs/proImage', urlSearchParams({
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
            

              if (res.data.data.DETAILDESC) { // 更新框架表单修改数据
                const values = {};
                // values[this.itemInfo.tablename] = { DETAILDESC: res.data.data.DETAILDESC };
                // store.commit(`${this[MODULE_COMPONENT_NAME]}/updateModifyData`, { 
                //   tableName: this.itemInfo.tablename,
                //   value: values,
                // });
                if (type === 'refresh') {
                  // store.commit(`${this[MODULE_COMPONENT_NAME]}/updateChangeData`, { 
                  //   tableName: this.itemInfo.tablename,
                  //   value: values,
                  // });
                }
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
          const URL = custommizedRequestUrl()['/p/cs/cprospecload'];
          network.get(URL || '/p/cs/cprospecload', {
            params
          }).then((col) => {
            if (col.data.code === 0) {
              const indexTab = null;
            
              this.colorList = [];
              this.colorList = col.data.data.COLOR;

              if (col.data.data.COLOR.length > 0) {
                col.data.data.COLOR.forEach((item) => {
                  if (res.data.data) {
                    if (!res.data.data.IMAGE_SKU || res.data.data.IMAGE_SKU.length === 0) {
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
      reaptData(obj) { // 深拷贝
        if (obj instanceof Array) { // array
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
        } // obj
        const temp = {};

        for (const item in obj) {
          temp[item] = obj[item];
        }

        return temp;
      },
      objectSave(params) { // 保存
        console.log(333, this.saveObj);
        this.proImg.forEach(((item) => {
          item.flag = false;
        }));
        if (this.saveObj.IMAGE_SKU) {
          const arr = this.reaptData(JSON.parse(this.saveObj.IMAGE_SKU));

          if (arr.length > 0) {
            arr.forEach((index, item) => {
              if (index.URL == '') {
                index.URL = null;
              }

              delete index.flag;
            });

            this.saveObj.IMAGE_SKU = JSON.stringify(arr);
          }
        }

        if (this.saveObj.IMAGE) {
          if (JSON.parse(this.saveObj.IMAGE).length > 0) {
            const arr = JSON.parse(this.saveObj.IMAGE);
            if (arr.length > 0) {
              arr.forEach((index, item) => {
                delete index.flag;
              });
              if (arr.length == 0) {
                this.saveObj.IMAGE = null;
              } else {
                this.saveObj.IMAGE = JSON.stringify(arr);
              }
            }
          } else {
            this.saveObj.IMAGE = null;
          }
        }
        const edit = store.state[`${this[MODULE_COMPONENT_NAME]}`].updateData[this.itemInfo.tablename].modify[this.itemInfo.tablename];
        this.saveObj.DETAILDESC = edit.DETAILDESC;

        if (this.video) this.saveObj.VIDEO = this.video;
        else this.saveObj.VIDEO = '';
        const obj = {
          table: 'PS_C_PRO',
          objid: this.objId,
          data: JSON.stringify({ PS_C_PRO: this.saveObj })
        };
        network.post('/p/cs/objectSave', urlSearchParams(obj)).then((res) => {
          const message = res.data.message;
          const data = {
            title: '成功',
            content: `${message}`
          };
          this.$Message.success(data);
          this.saveObj = {};
          this.getData();
        });

        // this.$ajax.dataAjax('/p/cs/objectSave', obj, (res) => {
        //   this.$message({
        //     message: res.message,
        //     type: 'success'
        //   });
        //   this.saveObj = {};
        //   this.getData();
        // });
      },
      proImgDelect(item, index) {
        // 商品主图删除
        this.proImg.splice(index, 1);
        this.saveObj.IMAGE = JSON.stringify(this.proImg);
      },
      proImgChange() {
        const dom = document.getElementById(`proImg${this.objId}`);
        dom.click();
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isGIF = file.type === 'image/gif';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isGIF && !isPNG) {
          const message = '上传图片只能是 JPG,PNG,GIF 格式!';
          const data = {
            mask: true,
            title: '错误',
            content: `${message}`
          };
          this.$Modal.fcError(data);
          document.querySelector(`#proImg${this.objId}`).value = '';
          document.querySelector(`#colImg${this.objId}`).value = '';
        } else if (!isLt2M) {
          const message = '上传图片大小不能超过 2MB!';
          const data = {
            mask: true,
            title: '错误',
            content: `${message}`
          };
          this.$Modal.fcError(data);
          document.querySelector(`#proImg${this.objId}`).value = '';
          document.querySelector(`#colImg${this.objId}`).value = '';
        }
        return (isJPG || isGIF || isPNG) && isLt2M;
      },
      uploadFileChange() {
        // 主图上传
        const dom = document.querySelector(`#proImg${this.objId}`);
        const list = [...dom.files];
        const values = dom.files[0];
        if (this.proImg.length + list.length > 15) {
          const message = `最多上传${15 - this.proImg.length}张图片`;
          const data = {
            mask: true,
            title: '错误',
            content: `${message}`
          };
          this.$Modal.fcError(data);
          document.querySelector(`#proImg${this.objId}`).value = '';
          return;
        }
        list.forEach((value) => { // 循环调用接口上传
          if (!this.beforeAvatarUpload(value)) {
            return;
          }
          const data = new FormData();
          const path = `PS_C_PRO/${this.objId}/`;
          data.append('file', values);
          data.append('path', path);
          if (value === undefined) {
            return;
          }
          network.post('/p/cs/upload2', data).then((res) => {
                                                     this.proImg.push({
                                                       NAME: res.data.data.Name,
                                                       URL: res.data.data.Url,
                                                       flag: false
                                                     });
                                                     this.saveObj.IMAGE = JSON.stringify(this.proImg);
                                                   },
                                                   false);
          setTimeout(() => {
            document.querySelector(`#proImg${this.objId}`).value = '';
          }, 200);
        });
      },
      uploadProgress(uploadid, cb) {
        // 主图上传进度
        const callback = cb;
        network.post('/p/cs/uploadProgress', urlSearchParams({ uploadId: uploadid })).then((res) => {
          if (res.data.code === 0) {
            if (res.data.data === 100) {
              callback();
            } else {
              setTimeout(() => {
                this.uploadProgress(uploadid, cb);
              }, 50);
            }
          } else {
            document.querySelector(`#proImg${this.objId}`).value = '';
          }
        }).catch(() => {
          document.querySelector(`#proImg${this.objId}`).value = '';
        });
      },
      colImgChange(item, index) {
        const dom = document.getElementById(`colImg${this.objId}${index}`);
        dom.click();
      },
      uploadColorChange(item, index) {
        // 颜色图上传
        const value = document.querySelector(`#colImg${this.objId}${index}`).files[0];
        if (!value || !this.beforeAvatarUpload(value)) {
          return;
        }

        const data = new FormData();
        const path = `PS_C_SKU/${this.objId}/`;
        data.append('file', value);
        data.append('path', path);
        if (value === undefined) {
          return;
        }
        network.post('/p/cs/upload2', data).then((res) => {
                                                   this.uploadProgress(res.data.data.UploadId, () => {
                                                     this.$set(this.colorList[index], 'URL', res.data.data.Url);
                                                     this.saveObj.IMAGE_SKU = JSON.stringify(this.colorList);
                                                   });
                                                 },
                                                 false);

        setTimeout(() => {
          document.querySelector(`#colImg${this.objId}${index}`).value = '';
        }, 200);
      },
      colImgDelete(item, index) {
        // 颜色图的删除
        this.$set(this.colorList[index], 'URL', '');
        this.saveObj.IMAGE_SKU = JSON.stringify(this.colorList);
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
        this.dialogShow = true;
        // this.$refs.dialogRef.open();
        // const title = '视频上传教程';
        // this.dialogConfig = {
        //   title,
        //   footerHide: true,
        //   titleAlign: 'center'
        // };
      },
     
    },
    // beforeDestroy() {
    //   window.removeEventListener('customizeClick', this.clickCustomize);
    // },
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
  
}
.dialog-scroll {
    height: 560px;
        width: 1000px;
        overflow: auto;
  }
</style>

<template>
  <div class="bcl-ImageUpload">
     <PreviewPicture :images="defaultProps.valuedata"
                      :show="show"
                      @on-cancel="cancel"
                      :defaultIndex="defaultIndex" />
    <i-circle v-if="percent>0"
              :percent="percent"
              class="percent" :style="`height:${defaultProps.height - 20}px;width:${defaultProps.width - 20}px;`">
      <span class="demo-Circle-inner"
            style="font-size:24px">{{percent}}%</span>
    </i-circle>
    <ImageUpload :dataitem="newProps"
                 @deleteImg="(item, index) => deleteImg(item, index)"
                 @uploadFileChangeSuccess="uploadFileChangeSuccess"
                 @uploadFileChangeOnerror="uploadFileChangeOnerror"
                 @uploadFileChangeProgress="uploadFileChangeProgress"
                 @dblclick="uploadFileDblclick"></ImageUpload>
  </div>

</template>

<script>
import i18n from '../../utils/i18n'
const fkHttpRequest = () => require(`../../request/fkHttpRequest`);
import PreviewPicture from '../preview-picture/PreviewPicture.vue';
import Config from '../../../config/nameConfig';
const prefixCls = `${Config.prefixCls}ImageUpload`;

export default {
  name: prefixCls,
  model: {
    prop: 'value',
    event: 'on-Change',
  },
  components: {
    PreviewPicture,
  },
  props: {
    PropsData: {  // 上传属性
      type: Object,
      default: () => {
        // readonly: '', //控制字段是否可编辑
        // url: '/ad-app/p/cs/upload2',
        // sendData:{
        //   path: `${this.item.tableName}/${this.item.itemId}/`,
        //   column: this.item.colname,
        //   tableName: this.item.tableName
        // },
        // name: '上传'

      }
    },
    http: {   // 请求
      type: Object,
      default: () => {

      }
    },
    value: {   // 默认值
      type: [Array, String],
      default: () => {

      }
    },
    serviceId: {
      type: String,
      default: () => ''
    }
  },
  computed: {
    newProps () {
      this.defaultProps.valuedata = Array.isArray(this.value) ? this.value : [];
      let _props = Object.assign(this.defaultProps, this.PropsData);
      _props.readonly = _props.disabled;
      _props.serviceId = this.serviceId || '';
      // _props.url = this.serviceId ? this.serviceId + _props.url : _props.url;
      _props.readonly = _props.readonly;
      return _props;
    }

  },
  mounted () {
  },
  methods: {
    cancel(){
      this.show = false;
    },
    deleteImg (item, index) {
      // 删除图片
      const self = this;
      this.$Modal.fcWarning({
        mask: true,
        showCancel: true,
        title: this.$t('tips.alert'),
        content: this.$t('imageUpload.deleteImg'),
        onOk: () => {
          self.defaultProps.valuedata.splice(index - 1, 1);
          self.$emit('on-delete', index, this);
          self.$emit('on-Change', this.defaultProps.valuedata, this);
        }
      });
    },
    uploadFileChangeProgress (data) {
      // 上传进度
      // var percent = Math.round(data.loaded * 100 / data.total);
      // this.percent = percent;
      let self = this;
      this.percent = 1;
      setTimeout(() => {
        self.percent = 10;
      }, 30)
    },
    uploadFileChangeSuccess (data) {
      // 上传成功
      const self = this;
      const resultData = data;
      const valuedata = this.defaultProps.valuedata;
      if (data.data) {
        this.uploadProgress(data.data).then(() => {

          const fixedData = Array.isArray(valuedata) ? [...valuedata] : [];
          fixedData.push({
            NAME: resultData.data.Name,
            URL: resultData.data.Url
          });
          // this.value = fixedData;
          this.$emit('on-Change', fixedData, this);
        });
      }
    },
    uploadProgress (data) {
      let self = this;
      return new Promise((resolve, reject) => {
        this.fkQueuploadProgressry(data, resolve);
      });
    },
    fkQueuploadProgressry (data, resolve) {
      let self = this;
      fkHttpRequest().fkQueuploadProgressry(this.http, {
        searchObject: {
          uploadId: data.UploadId,
        },
        serviceId: this.serviceId,
        // eslint-disable-next-line consistent-return
        success: (res) => {
          self.percent = res.data.data;
          if (res.data.data == 100) {
            self.percent = 0;
            resolve(res.data);
          } else {
            if (self.cycleTimer && self.cycleTime === 4) {
              self.cycleTime = 0;
              self.cycleTimer = null;
              return resolve();
            }
            self.cycleTimer = setTimeout(() => {
              self.cycleTime ++;
              self.fkQueuploadProgressry(data, resolve)
            }, 200)
          }
        }
      });

    },
    uploadFileChangeOnerror (e) {
      this.$Message.info(e);
    },
    uploadFileDblclick (array = [], index) {
      // 双击
      if (this.value && this.value.length > 0) {
        this.defaultIndex = index;
        this.show = true;
      }else{
        this.$Message.info(this.$t('imageUpload.noPicturePreview'));
      }


    }

  },
  data () {
    return {
      percent: 0,
      defaultIndex: 0,
      show: false,
      defaultProps: {
        width: 250,
        height: 250,
        valuedata: []
      },
      cycleTime: 0,
      cycleTimer: null
    };
  },

  beforeCreate() {
    this.$t = i18n.t.bind(i18n)
  },
}
</script>
<style lang="less" scoped>
.bcl-ImageUpload {
  position: relative;
  .percent {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 100;
    background: #fff;
    // transform: translate(50%, 50%);
  }
}
</style>

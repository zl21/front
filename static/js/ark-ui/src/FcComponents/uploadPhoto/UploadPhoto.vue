<template>
    <div :class="prefixCls">
        <div :class="prefixCls + '-up'">
            <div v-if="isEmpty" :class="prefixCls + '-up-empty'" :style="{width: `${imgFrameWidth}px`, height: `${imgFrameHeight}px`}">
                <Icon type="iconmd-images"></Icon>
                <div :class="prefixCls + '-up-empty-title'">{{t('i.upload.uploadPic')}}</div>
                <div :class="prefixCls + '-up-empty-tip'" v-if="tipText.length > 0" v-for="(item, index) in tipText" :key="index">{{item}}</div>
            </div>
            <Poptip v-else
                    :trigger="poptipAttribute.trigger? poptipAttribute.trigger : 'hover'"
                    :placement="poptipAttribute.placement? poptipAttribute.placement : 'right'"
                    :transfer="poptipAttribute.transfer? poptipAttribute.transfer : true"
                    :padding="poptipAttribute.padding? poptipAttribute.padding : '0'"
                    :class="prefixCls + '-up-poptip'"
                    v-bind="poptipAttribute">
                <div :class="imageClass" ref="imageContent" @dblclick="dblclick(0)" :style="`background-image: url(${imgUrl || dataitem.valuedata[0].URL});width: ${imgFrameWidth}px; height: ${imgFrameHeight}px`">
                    <div :class="prefixCls + '-up-img-icon'" v-if="deleteBtnShow && !dataitem.readonly">
                        <Icon type="iconios-close-circle" @click.stop="deleteImage(dataitem.valuedata[0], 0)"></Icon>
                    </div>
                </div>
                <div slot="content" :class="`${this.prefixCls}-up-img-preview`">
                    <div :class="previewImgClass" :style="{ width: `${previewWidth}px`, height: `${previewHeight}px`}">
                        <img :src="imgUrl || dataitem.valuedata[0].URL || ''">
                    </div>
                </div>
            </Poptip>
        </div>
        <div :class="prefixCls + '-down'" v-if="uploadBtnShow && !dataitem.readonly">
            <Button v-if="isUploading" type="warning" loading :class="prefixCls + '-down-btn'">{{t('i.upload.uploading')}}</Button>
            <label v-else ref="file">
                <input
                    type="file"
                    ref="uploadInput"
                    accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
                    style="filter:alpha(opacity=0);opacity:0;position: fixed; z-index: -1"
                    @change.stop="uploadFileChange(dataitem,$event)"
                >
                <Button type="primary" :class="prefixCls + '-down-btn'" @click="uploadBtn">{{btnText}}</Button>
            </label>
        </div>
    </div>
</template>

<script>
import Icon from '../../components/icon/icon.vue';
import Upload from '../../utils/upload';
import {t} from '../../locale/index';
import local from '../../mixins/locale';
import burgeonConfig from '../../assets/config';
import Button from '../../components/button/button.vue';
import Poptip from '../../components/poptip/poptip.vue';

const prefixCls = `${burgeonConfig.prefixCls}`;
export default {
    data() {
        return {
            imgFrameWidth: this.dataitem.width ? this.dataitem.width : 180, // 图片框子的宽度
            imgFrameHeight: this.dataitem.height ? this.dataitem.height : 180, // 图片框子的高度
            isEmpty: true, // 是否为空
            isUploading: false, // 正在上传
            imageRealWidth: null, // 图片实际的宽度
            imageRealHeight: null, // 图片实际的高度
            realImageTimer: null, // 获取真实图片的定时器

            imagePreviewShow: false, // 是否显示预览图片
            imagePreviewTop: 0, // 预览图片定位
            imagePreviewLeft: 0, // 预览图片定位
            imagePreviewPosition: 'right', // 预览图片位置

            spacing: 16, // 原图与预览图之间的距离
        };
    },
    name: 'UploadPhoto',
    mixins: [local],
    components: {
        Button,
        Icon,
        Poptip
    },
    props: {
        dataitem: {
            type: Object,
            default: () => ({})
        },
        poptipAttribute: {
            type: Object,
            default: () => ({})
        }, // poptip 属性
        mode: {
            type: String,
            default: 'aspectFit'
        }, // 图片展示的类型
        fileParamsKey: {
            type: String,
            default: ''
        }, // 请求参数
        imgUrl: {
            type: String,
            default: ''
        }, // 图片地址
        btnText: {
            type: String,
            default: () => t('i.upload.uploadPic')
        }, // 按钮文字
        uploadBtnShow: {
            type: Boolean,
            default: true
        }, // 是否显示上传图片的按钮
        deleteBtnShow: {
            type: Boolean,
            default: true
        }, // 是否显示删除图片的按钮
        tipText: {
            type: Array,
            default: () => []
        }, // 提示文字
        previewWidth: {
            type: Number,
            default: 500
        }, // 预览区域宽度
        previewHeight: {
            type: Number,
            default: 500
        }, // 预览区域高度
        fileTargetAttribute: {
            type: Array,
            default: () => []
        } // 图片 file 自带的属性，仅支持 lastModified，lastModifiedDate，name，size，type，webkitRelativePath
    },
    watch: {
        dataitem: {
            handler(val) {
                if (val.width) {
                    this.imgFrameWidth = val.width;
                }
                if (val.height) {
                    this.imgFrameHeight = val.height;
                }
                if (val.valuedata && val.valuedata.length > 0 && val.valuedata[0].URL) {
                    this.isEmpty = false;
                    this.getRealImage();
                } else {
                    this.isEmpty = true;
                }
            },
            deep: true
        },
        imgUrl: {
            handler() {
                this.getRealImage();
            },
            deep: true
        }
    },
    computed: {
        prefixCls(){
            return `${prefixCls}upload-photo`;
        },
        previewImgClass() {
            return [
                `${this.prefixCls}-up-img-preview-con`,
                {
                    [`${this.prefixCls}-up-img-preview-height`] : this.imageRealWidth > this.imageRealHeight,
                    [`${this.prefixCls}-up-img-preview-width`] : this.imageRealWidth < this.imageRealHeight,
                    [`${this.prefixCls}-up-img-preview-contain`] : this.imageRealWidth === this.imageRealHeight
                }
            ];
        },
        imageClass() {
            return [
                `${this.prefixCls}-up-img`,
                {
                    [`${this.prefixCls}-up-scaletofill`] : this.mode === 'scaleToFill',
                    [`${this.prefixCls}-up-aspectfit`] : this.mode === 'aspectFit',
                    [`${this.prefixCls}-up-aspectfill`] : this.mode === 'aspectFill',
                    [`${this.prefixCls}-up-top`] : this.mode === 'top',
                    [`${this.prefixCls}-up-bottom`] : this.mode === 'bottom',
                    [`${this.prefixCls}-up-center`] : this.mode === 'center',
                    [`${this.prefixCls}-up-left`] : this.mode === 'left',
                    [`${this.prefixCls}-up-right`] : this.mode === 'right',
                    [`${this.prefixCls}-up-top-left`] : this.mode === 'top-left',
                    [`${this.prefixCls}-up-top-right`] : this.mode === 'top-right',
                    [`${this.prefixCls}-up-bottom-left`] : this.mode === 'bottom-left',
                    [`${this.prefixCls}-up-bottom-right`] : this.mode === 'bottom-right'
                }
            ];
        }
    },
    beforeDestroy() {
        if (this.realImageTimer) {
            clearInterval(this.realImageTimer);
        }
    },
    mounted() {
        if (this.dataitem.valuedata && this.dataitem.valuedata.length > 0 && this.dataitem.valuedata[0].URL) {
            this.isEmpty = false;
            this.getRealImage();
        }
    },
    methods: {
        mouseenter() {
            this.getPreviewPosition();
            this.imagePreviewShow = true;
        }, // 鼠标进入
        mouseleave() {
            this.imagePreviewShow = false;
        }, // 鼠标离开
        getPreviewPosition() {
            let windowWidth = window.innerWidth; // 窗口的宽度
            let windowHeight = window.innerHeight; // 窗口的高度
            const {
                top, bottom, right, left
            } = this.$refs.imageContent.getClientRects()[0]; // imageContent的距离，单位px
            const imageContentBottom = windowHeight - bottom; // 图片组件到窗口底部的距离
            const imageContentRight = windowWidth - right; // 图片组件到窗口底部的距离
            const imageContentSingleSideHeight = ( this.previewHeight - this.imgFrameHeight ) / 2;

            // 计算下预览图能不能在右侧放下，如果不能就放到左侧
            if ((this.previewWidth + this.spacing) > imageContentRight) {
                this.imagePreviewPosition = 'left';
                this.imagePreviewLeft = - this.previewWidth - this.spacing;
            } else {
                this.imagePreviewPosition = 'right';
                this.imagePreviewLeft = this.dataitem.width;
            }
            // 计算图片的上下的位置
            if (imageContentSingleSideHeight > top) {
                this.imagePreviewTop = - (top - this.spacing);
            } else if (imageContentSingleSideHeight > imageContentBottom) {
                this.imagePreviewTop = - ((imageContentSingleSideHeight * 2) - imageContentBottom + this.spacing);
            } else {
                this.imagePreviewTop = - imageContentSingleSideHeight;
            }
        }, // imageContent 获取预览图的定位
        isIE(){
            if (window.navigator.userAgent.indexOf('MSIE')>=1) {
                return true;
            } else {
                return false;
            }
        }, // 判断是不是ie浏览器
        deleteImage(item, index) {
            this.$emit('deleteImg', item, index);
        }, // 点击删除的icon
        dblclick (index) {
            if (!this.isIE()){
                this.$emit('dblclick', this.dataitem.valuedata,index);
            }

        }, //双击预览
        getRealImage() {
            const url = this.imgUrl || this.dataitem.valuedata[0].URL || '';
            if(url) {
                let num = 0;
                const img = new Image();
                img.src = url;
                if (img.complete) {
                    this.imageRealWidth = img.width;
                    this.imageRealHeight = img.height;
                } else {
                    this.realImageTimer = setInterval(() => {
                        num++;
                        if (img.width>0 || img.height>0 || num > 100) {
                            this.imageRealWidth = img.width;
                            this.imageRealHeight = img.height;
                            clearInterval(this.realImageTimer);
                        }
                    }, 20);
                }
            }
        }, // 获取真实的图片
        uploadBtn() {
            this.$refs.uploadInput.click();
        }, // 上传图片按钮点击
        uploadFileChange(itemdata, e) {
            // 上传图片
            const fileInformationUploaded = e.target.files[0];
            const { url } = itemdata;
            const { sendData } = itemdata;
            let sendDataObj = sendData;
            let fileTargetObj = {};
            if (this.fileTargetAttribute.length > 0) {
                this.fileTargetAttribute.forEach(item => {
                    fileTargetObj[item] = fileInformationUploaded[item] || '';
                });
                sendDataObj = Object.assign(fileTargetObj, sendData);
            }
            const aUploadParame = Object.assign(
                {},
                {
                    target: fileInformationUploaded,
                    fileName: this.fileParamsKey,
                    url,
                    sendData: sendDataObj,
                    type:'Image',
                    success: this.success,
                    onerror: this.onerror,
                    progress: this.progress,
                    onload: this.onload,
                    onloadstart: this.onloadstart,
                    onloadend: this.onloadend
                }
            );
            this.isUploading = true;
            const article = new Upload(aUploadParame);
        },

        success(result) {
            this.isUploading = false;
            this.$emit('uploadFileChangeSuccess', result);
        },
        onerror(result) {
            this.isUploading = false;
            this.$emit('uploadFileChangeOnerror', result);
        },
        progress(e) {
            // 上传进度
            this.$emit('uploadFileChangeProgress', e);
        },
        onload(e) {
            this.$emit('uploadFileChangeOnload', e);
        },
        onloadstart(e) {
            this.$emit('uploadFileChangeOnloadstart', e);
        },
        onloadend(e) {
            this.$emit('uploadFileChangeOnloadend', e);
        }
    }
};
</script>

<style lang="less">
</style>

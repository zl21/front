<template>
    <div :ref="id" :class="[classes, position]" :style="wrapStyles">
        <Notice
            v-for="notice in notices"
            :key="notice.name"
            :prefix-cls="prefixCls"
            :styles="notice.styles"
            :type="notice.type"
            :content="notice.content"
            :position="notice.position"
            :duration="notice.duration"
            :render="notice.render"
            :has-title="notice.hasTitle"
            :withIcon="notice.withIcon"
            :closable="notice.closable"
            :name="notice.name"
            :transition-name="notice.transitionName"
            :on-close="notice.onClose"
            :contentComponent="notice.contentComponent">
        </Notice>
    </div>
</template>
<script>
    import Vue from 'vue';
import Notice from './notice.vue';

    import { transferIndex, transferIncrease } from '../../../utils/transfer-queue';
    import burgeonConfig from '../../../assets/config';

    const prefixCls = `${burgeonConfig.prefixCls}notification`;
    let seed = 0;
    const now = Date.now();

    function getUuid () {
        return `${burgeonConfig.prefixCls.substr(0,burgeonConfig.prefixCls.length-1)}Notification_${now}_${seed++}`;
    }

    export default {
        components: { Notice },
        props: {
            prefixCls: {
                type: String,
                default: prefixCls
            },
            styles: {
                type: Object,
                default: function () {
                    return {
                    };
                }
            },
            content: {
                type: String
            },
            className: {
                type: String
            },
            position: {
                type: String
            },
            id: {
                type: String
            },
            verticalOffset: {
                type: Number
            },
            onClose: {
                type: Function
            }
        },
        data () {
            return {
                notices: [],
                tIndex: this.handleGetIndex()
            };
        },
        computed: {
            classes () {
                return [
                    `${this.prefixCls}`,
                    {
                        [`${this.className}`]: !!this.className
                    }
                ];
            },
            wrapStyles () {
                let styles = Object.assign({}, this.styles);
                styles['z-index'] = Vue.prototype.$IVIEW.defaultZindex + this.tIndex;
                styles[this.verticalProperty] = `${this.verticalOffset}px`;
                styles[this.horizontalClass] = 0;
                return styles;
            },
            horizontalClass() {
                return this.position.indexOf('right') > -1 ? 'right' : 'left';
            },
            verticalProperty() {
                return /^top-/.test(this.position) ? 'top' : 'bottom';
            },
            positionStyle() {
                return {
                    [this.verticalProperty]: `${this.verticalOffset}px`
                };
            }
        },
        created() {
        },
        methods: {
            add (notice) {
                const name = notice.name || getUuid();

                let _notice = Object.assign({
                    styles: {
                        right: '50%'
                    },
                    content: '',
                    duration: 1.5,
                    closable: false,
                    name: name
                }, notice);

                this.notices.push(_notice);
                this.tIndex = this.handleGetIndex();
            },
            close (name, e) {
                if (this.onClose) this.onClose();
                // const notices = this.notices;
                // for (let i = 0; i < notices.length; i++) {
                //     if (notices[i].name === name) {
                //         this.notices.splice(i, 1);
                //         break;
                //     }
                // }
                this.notices = [];
                setTimeout(() => {
                    this.$refs[this.id].remove();
                }, 1000)
            },
            closeAll () {
                this.notices = [];
            },
            handleGetIndex () {
                transferIncrease();
                return transferIndex;
            },
        }
    };
</script>

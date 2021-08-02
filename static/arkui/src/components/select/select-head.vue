<template>
    <div @click="onHeaderClick" :class="[prefixCls + '-selection-head']">

        <span
            :class="singleDisplayClasses"
            v-show="singleDisplayValue"
        >{{ singleDisplayValue }}</span>
        <input
            :id="inputElementId"
            type="text"
            v-if="filterable"
            v-model="query"
            :disabled="disabled"
            :class="[prefixCls + '-input']"
            :placeholder="showPlaceholder ? localePlaceholder : ''"
            :style="inputStyle"
            autocomplete="off"
            :readonly="multiple && !!query"
            spellcheck="false"
            @keydown="resetInputState"
            @keydown.enter="handleInputEnter"
            @keydown.delete="handleInputDelete"
            @focus="onInputFocus"
            @blur="onInputFocus"

            ref="input">
        <Icon type="ios-close-circle" :class="[prefixCls + '-arrow']" v-if="resetSelect"
              @click.native.stop="onClear"></Icon>
        <Icon type="ios-arrow-down" :class="[prefixCls + '-arrow']" v-if="!resetSelect && !remote && !disabled"></Icon>
    </div>
</template>
<script>
    import Icon from '../icon';
    import Emitter from '../../mixins/emitter';
    import Locale from '../../mixins/locale';
    import burgeonConfig from '../../assets/config';

    const prefixCls = `${burgeonConfig.prefixCls}select`;

    export default {
        name: 'iSelectHead',
        mixins: [Emitter, Locale],
        components: {Icon},
        props: {
            disabled: {
                type: Boolean,
                default: false
            },
            filterable: {
                type: Boolean,
                default: false
            },
            multiple: {
                type: Boolean,
                default: false
            },
            remote: {
                type: Boolean,
                default: false
            },
            initialLabel: {
                type: [String, Number, Array]
            },
            values: {
                type: Array,
                default: () => []
            },
            clearable: {
                type: [Function, Boolean],
                default: false
            },
            inputElementId: {
                type: String
            },
            placeholder: {
                type: String
            },
            queryProp: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                prefixCls: prefixCls,
                query: '',
                inputLength: 20,
                remoteInitialLabel: this.initialLabel,
                preventRemoteCall: false,
                isFocus: false
            };
        },
        created() {
        },
        computed: {
            singleDisplayClasses() {
                const {filterable, multiple, showPlaceholder} = this;

                return [{
                    [`${prefixCls}-placeholder`]: !filterable && this.values.length === 0,
                    [`${prefixCls}-selected-value`]: !showPlaceholder && !multiple && !filterable
                }];
            },
            singleDisplayValue() {

                if ((this.multiple && this.values.length > 0) || this.filterable) {

                    let showValues = '';
                    this.values.forEach((element, index) => {
                        if (index === (this.values.length - 1)) {
                            showValues += element.label;
                        } else {
                            showValues += `${element.label},`;
                        }
                    });
                    if (this.values.length === 0) {
                        return false;
                    }

                    if (this.filterable && this.values.length > 0) {
                        return false;
                    }
                    return showValues;
                }
                return `${this.selectedSingle}` || this.localePlaceholder;
            },
            showPlaceholder() {
                let status = false;
                if (!this.multiple) {
                    const value = this.values[0];
                    if (typeof value === 'undefined' || String(value).trim() === '') {
                        status = !this.remoteInitialLabel;
                    }
                } else if (!this.values.length > 0) {
                    status = true;
                }
                return status;
            },
            resetSelect() {
                if (this.values.length === 0) {
                    return false;
                }
                return !this.showPlaceholder && this.clearable || (this.clearable && this.singleDisplayValue && this.multiple && this.values.length > 0);
            },
            inputStyle() {
                let style = {};
                if (this.multiple) {
                    // if (this.showPlaceholder) {
                    //     style.width = '100%';
                    // } else {
                    //     style.width = `${this.inputLength}px`;
                    // }
                    style.width = '100%';
                }

                return style;
            },
            localePlaceholder() {
                if (this.placeholder === undefined) {
                    return this.t('i.select.placeholder');
                } else {
                    return this.placeholder;
                }
            },
            selectedSingle() {
                const selected = this.values[0];
                return selected ? selected.label : this.remoteInitialLabel || '';
            },
            selectedMultiple() {
                return this.multiple ? this.values : [];
            }
        },
        methods: {
            onInputFocus(e) {
                // 失去焦点且选中项为空，清除query
                if (this.values && this.values.length === 0) {
                    this.query = '';
                }
                this.isFocus = e.type === 'focus';
                this.$emit(e.type === 'focus' ? 'on-input-focus' : 'on-input-blur');
            },
            removeTag(value) {
                if (this.disabled) {
                    return false;
                }
                this.dispatch('iSelect', 'on-select-selected', value);
            },
            resetInputState() {
                this.inputLength = this.$refs.input.value.length * 12 + 20;
                this.$emit('on-keydown');
            },
            handleInputEnter(event) {
                this.dispatch('iSelect', 'on-enter', event);
            },
            handleInputDelete() {
                if (this.multiple && this.selectedMultiple.length && this.query === '') {
                    this.removeTag(this.selectedMultiple[this.selectedMultiple.length - 1]);
                }
            },
            onHeaderClick(e) {
                if (this.filterable && e.target === this.$el) {
                    this.$refs.input.focus();
                }
            },
            onClear() {
                this.query = '';
                this.$emit('on-clear');
            }
        },
        watch: {
            // 下拉里面选中的选项array-在切换数据的时候
            values(val) {
                // 如果不是异步请求数据，return出去
                if (!this.filterable) {
                    return;
                }

                // 异步才走下面的逻辑
                this.preventRemoteCall = true;
                // 多选且非异步
                if (this.multiple && !this.filterable) {
                    this.query = '';
                    this.preventRemoteCall = false; // this should be after the query change setter above
                    return;
                }
                // #982
                // 没有选中的值
                if ((typeof val === 'undefined' || val === '' || val === null || val.length === 0) && this.isFocus) {
                    // this.query = '';
                } else {
                    // let str = '';
                    // val.map((item, index) => {
                    //     if (index === val.length - 1) {
                    //         str += `${item.label}`;
                    //     } else {
                    //         str += `${item.label},`;
                    //     }
                    //
                    //     return true;
                    // });
                    const str = val.map(v => v.label).join(',');
                    if (this.multiple) {
                        this.query = str;
                    } else {
                        if (this.isFocus) return;
                        this.query = val && val.length > 0 ? val[0].label : '';
                    }
                }
                this.$nextTick(() => this.preventRemoteCall = false); // this should be after the query change setter above
            },
            query(val) {
                if (this.preventRemoteCall) {
                    this.preventRemoteCall = false;
                    return;
                }

                this.$emit('on-query-change', val);
            },
            queryProp(query) {
                // console.log('query', query)
                if (query !== this.query) {
                    this.query = query;
                }
                if (this.multiple && this.values.some(v => v.value === 'bSelect-all')) {
                    this.query = '全部';
                }
            }
        }
    };
</script>

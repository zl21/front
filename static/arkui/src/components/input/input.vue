<template>
    <div :class="wrapClasses">
        <template v-if="type !== 'textarea'">
            <!--前置元素-->
            <div :class="[prefixCls + '-group-prepend']" v-if="prepend" v-show="slotReady">
                <slot name="prepend"></slot>
            </div>

            <!--前置内容-->
            <!--后置内容-->
            <span :class="[
                `${burgeonConfig.prefixCls}input-innerWrap`,
                append ? `${burgeonConfig.prefixCls}input-inner` : '',
                ]"
                  v-if="!append"
            >
                <!--1,功能类可以重复，展示类不可重复-->
                <!--清除clearable-->
                <i v-if="clearable && currentValue"
                   :class="[
                       burgeonConfig.prefixCls+'icon',
                       burgeonConfig.prefixCls+'iconios-close-circle iconfont iconios-close-circle',
                       prefixCls + '-icon',
                       prefixCls + '-icon-clear',
                       prefixCls + '-icon-normal'
                   ]"
                   ref="clearIcon"
                   @click="handleClear"
                ></i>

                <!--2,展示类-->
                <!--icon带Icon的输入框-->
                <i v-if="icon"
                   :class="[
                        burgeonConfig.prefixCls+'icon',
                        burgeonConfig.prefixCls+'icon-'+icon+' iconfont icon' + icon,
                        prefixCls + '-icon',
                        prefixCls + '-icon-normal'
                    ]"
                   @click="handleIconClick"
                ></i>
                <!--search-->
                <i v-else-if="search && enterButton === false"
                   c
                   :class="[
                        burgeonConfig.prefixCls+'icon',
                        burgeonConfig.prefixCls+'iconfont iconios-search',
                        prefixCls + '-icon',
                        prefixCls + '-icon-normal',
                        prefixCls + '-search-icon'
                    ]"
                   @click="handleSearch"
                ></i>
                <!--wordLimit-->
                <span v-else-if="isWordLimitVisible"
                      :class="`${burgeonConfig.prefixCls}input-limitWrap`"
                >
                    <span :class="`${burgeonConfig.prefixCls}input-limitTxt`">{{ textLength }}/{{ upperLimit }}</span>
                </span>
                <!--尾部图标-->
                <span v-else-if="showSuffix"
                      :class="[
                        burgeonConfig.prefixCls+'input-suffix',
                        showSuffix
                    ]">
                    <slot name="suffix">
                        <i :class="[`${burgeonConfig.prefixCls}icon`,`${burgeonConfig.prefixCls} iconfont icon` + suffix,suffix]"
                           v-if="suffix"></i>
                    </slot>
                </span>

                <!--loading-->
                <transition name="fade">
                    <i
                        :class="[
                            burgeonConfig.prefixCls+'icon',
                            burgeonConfig.prefixCls+' iconfont iconios-loading',
                            burgeonConfig.prefixCls+'load-loop',
                            prefixCls + '-icon',
                            prefixCls + '-icon-validate'
                        ]"
                        v-if="!icon"></i>
                </transition>

                <!--扩展元素-->

            </span>

            <!--value气泡框-->
            <Poptip v-if="disabled && disabledHidden" placement="top" trigger="hover" word-wrap :content="currentValue">
                <input
                    :id="elementId"
                    :autocomplete="autocomplete"
                    :spellcheck="spellcheck"
                    ref="input"
                    :type="type"
                    :class="inputClasses"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    :maxlength="maxlength"
                    :readonly="readonly"
                    :name="name"
                    :number="number"
                    :autofocus="autofocus"
                    :value="currentValue"
                    @keyup.enter="handleEnter"
                    @keyup="handleKeyup"
                    @keypress="handleKeypress"
                    @keydown="handleKeydown"
                    @focus="handleFocus"
                    @blur="handleBlur"
                    @input="handleInput"
                    @change="handleChange">
            </Poptip>
            <input v-else
                   :id="elementId"
                   :autocomplete="autocomplete"
                   :spellcheck="spellcheck"
                   ref="input"
                   :type="type"
                   :class="inputClasses"
                   :placeholder="__disablePlaceholder__ ? undefined : placeholder"
                   :disabled="disabled"
                   :maxlength="maxlength"
                   :readonly="readonly"
                   :name="name"
                   :number="number"
                   :autofocus="autofocus"
                   :value="currentValue"
                   @keyup.enter="handleEnter"
                   @keyup="handleKeyup"
                   @keypress="handleKeypress"
                   @keydown="handleKeydown"
                   @focus="handleFocus"
                   @blur="handleBlur"
                   @input="handleInput"
                   @change="handleChange"
                   @paste="handlePaste">
            <!--search查询-->
            <div v-if="search && enterButton"
                 :class="[
                        prefixCls + '-group-append',
                        prefixCls + '-search'
                     ]"
                 @click="handleSearch">
                <Icon v-if="enterButton === true" type="ios-search"></Icon>
                <template v-else>{{ enterButton }}</template>
            </div>
            <!--后置元素-->
            <div v-if="append" :class="[prefixCls + '-group-append']" ref="append" v-show="slotReady">
                <slot name="append"></slot>
            </div>
            <!--头部图标-->
            <span v-else-if="showPrefix"
                  :class="[
                    burgeonConfig.prefixCls+'input-prefix',
                    showPrefix
                  ]">
                <slot name="prefix">
                    <i :class="[burgeonConfig.prefixCls+'icon',burgeonConfig.prefixCls+' icon' + prefix,prefix]"
                       v-if="prefix"></i>
                </slot>
            </span>
        </template>
        <textarea
            v-else
            resize="both"
            :id="elementId"
            :wrap="wrap"
            :autocomplete="autocomplete"
            :spellcheck="spellcheck"
            ref="textarea"
            :class="[textareaClasses,{'readonlyIE':isIEclass},{'encode-text' : encrypt && currentValue}]"
            :style="textareaStyles"
            :placeholder="placeholder"
            :disabled="getDisabledValue"
            :rows="rows"
            :maxlength="maxlength"
            :readonly="getReadonlyValue"
            :name="name"
            :unselectable="disabled ? '' : unselectable"
            :value="encrypt? encryptedTextArea :currentValue"
            :autofocus="autofocus"
            @keyup.enter="handleEnter"
            @keyup="handleKeyup"
            @keypress="handleKeypress"
            @keydown="handleKeydown"
            @focus="handleFocus"
            @blur="handleBlur"
            @input="handleInput"
            @paste="handlePaste"
            @compositionstart="handleCompositionStart"
            @compositionend="handleCompositionEnd"
            @contextmenu='handleContextmenu'
        >
        </textarea>
        <span :class="`${prefixCls}-textarea-innerWrap`">
            <i v-if="type === 'textarea' && clearable && currentValue"
               :class="[
               burgeonConfig.prefixCls+'icon',
               burgeonConfig.prefixCls+'iconios-close-circle iconfont iconios-close-circle',
               prefixCls + '-icon',
               prefixCls + '-icon-clear',
               prefixCls + '-icon-normal'
           ]"
               ref="clearIcon"
               @click="handleClear"
            ></i>
            <span v-if="isWordLimitVisible && type === 'textarea'" :class="`${burgeonConfig.prefixCls}input-limitWrap`">
                <span :class="`${burgeonConfig.prefixCls}input-limitTxt`">{{ textLength }}/{{ upperLimit }}</span>
            </span>
        </span>


    </div>
</template>
<script>
    /* eslint-disable no-lonely-if,prefer-destructuring */

    import {oneOf, findComponentUpward} from '../../utils/assist';
    import calcTextareaHeight from '../../utils/calcTextareaHeight';
    import Emitter from '../../mixins/emitter';


    import burgeonConfig from '../../assets/config';

    const prefixCls = `${burgeonConfig.prefixCls}input`;

    export default {
        name: 'Input',
        mixins: [Emitter],
        props: {
            __disableInputEvent__: {
                default: false
            },
            __disablePlaceholder__: {
                default: false
            },
            type: {
                validator(value) {
                    return oneOf(value, ['text', 'textarea', 'password', 'url', 'email', 'date']);
                },
                default: 'text'
            },
            value: {
                type: [String, Number],
                default: ''
            },
            size: {
                validator(value) {
                    return oneOf(value, ['small', 'large', 'default']);
                },
                default() {
                    return !this.$IVIEW || this.$IVIEW.size === '' ? 'default' : this.$IVIEW.size;
                }
            },
            placeholder: {
                type: String,
                default: '请输入'
            },
            maxlength: {
                type: Number
            },
            disabled: {
                type: Boolean,
                default: false
            },
            icon: String,
            autosize: {
                type: [Boolean, Object],
                default: false
            },
            rows: {
                type: Number,
                default: 2
            },
            readonly: {
                type: Boolean,
                default: false
            },
            name: {
                type: String
            },
            number: {
                type: Boolean,
                default: false
            },
            autofocus: {
                type: Boolean,
                default: false
            },
            spellcheck: {
                type: Boolean,
                default: false
            },
            autocomplete: {
                validator(value) {
                    return oneOf(value, ['on', 'off', 'new-password']);
                },
                default: 'off'
            },
            clearable: {
                type: Boolean,
                default: false
            },
            elementId: {
                type: String
            },
            wrap: {
                validator(value) {
                    return oneOf(value, ['hard', 'soft']);
                },
                default: 'soft'
            },
            prefix: {
                type: String,
                default: ''
            },
            regx: {},
            suffix: {
                type: String,
                default: ''
            },
            search: {
                type: Boolean,
                default: false
            },
            enterButton: {
                type: [Boolean, String],
                default: false
            },
            customData: {
                type: Object,
                default: () => {
                }
            },
            disabledHidden: {
                type: Boolean,
                default: false
            },
            // 文本加密,type为textarea时有效
            encrypt: {
                type: Boolean,
                default: false
            },
            // 是否显示输入字数统计，只在 type = "text" 或 type = "textarea" 时有效
            wordLimit: {
                type: Boolean,
                default: false
            }
        },
        model: {
            event: 'on-input-model'
        },
        data() {
            return {
                unselectable: '',
                compositionBefore: '',
                compositionValue: '',
                beforeEmitModelValue: '',
                currentValue: this.value,
                prefixCls: prefixCls,
                burgeonConfig: burgeonConfig,
                prepend: true,
                append: true,
                slotReady: false,
                textareaStyles: {},
                showPrefix: false,
                showSuffix: false,
                inputEvent: {},
                isNumber: false,
                chinese: false,
                pasteRegex: false,
                isIEclass: false
            };
        },
        computed: {
            // textare加密文本
            encryptedTextArea() {
                return this.currentValue.replace(/./g, '·');
            },

            // 是否是加密的textarea
            isEncryptedTextarea() {
                return this.encrypt && this.type === 'textarea';
            },

            getReadonlyValue() {
                if (!!window.ActiveXObject || 'ActiveXObject' in window && this.disabled) { //判断是否是IE 11及以下或者其他(其他里包括IE edge)
                    this.unselectable = 'on';
                    return true;
                } else {
                    this.isIEclass = false;
                    this.unselectable = '';
                    return this.readonly;
                }
            },
            getDisabledValue() {
                if (!!window.ActiveXObject || 'ActiveXObject' in window) { //判断是否是IE 11及以下或者其他(其他里包括IE edge)
                    if (this.disabled) {
                        this.isIEclass = true;
                    }

                } else {
                    this.isIEclass = false;
                }
                return this.disabled;
            },
            wrapClasses() {
                return [
                    `${prefixCls}-wrapper`,
                    {
                        [`${prefixCls}-wrapper-${this.size}`]: !!this.size,
                        [`${prefixCls}-type`]: this.type,
                        [`${prefixCls}-group`]: this.prepend || this.append || (this.search && this.enterButton),
                        [`${prefixCls}-group-${this.size}`]: (this.prepend || this.append || (this.search && this.enterButton)) && !!this.size,
                        [`${prefixCls}-group-with-prepend`]: this.prepend,
                        [`${prefixCls}-group-with-append`]: this.append || (this.search && this.enterButton),
                        [`${prefixCls}-hide-icon`]: this.append, // #554
                        [`${prefixCls}-with-search`]: this.search && this.enterButton
                    }
                ];
            },
            inputClasses() {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-${this.size}`]: !!this.size,
                        [`${prefixCls}-disabled`]: this.disabled,
                        [`${prefixCls}-disabledHidden`]: this.disabled && this.disabledHidden,
                        [`${prefixCls}-with-prefix`]: this.showPrefix,
                        [`${prefixCls}-with-suffix`]: this.showSuffix || (this.search && this.enterButton === false)
                    }
                ];
            },
            textareaClasses() {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-disabled`]: true
                    },
                    {
                        [`${prefixCls}-textarea-limit`]: this.wordLimit
                    }
                ];
            },
            isWordLimitVisible() {
                return this.wordLimit
                    && this.maxlength
                    && (this.type === 'text' || this.type === 'textarea')
                    && !this.readonly;
            },
            upperLimit() {
                return this.maxlength;
            },
            textLength() {
                if (typeof this.value === 'number') {
                    return String(this.value).length;
                }
                return (this.value || '').length;
            }
        },
        methods: {
            // 右击菜单
            handleContextmenu(e) {
                if (this.isEncryptedTextarea) {
                    e.preventDefault();
                }
            },
            handleCompositionStart(e) {
                this.chinese = true;
                this.compositionBefore = e.target.value;
                if (this.isEncryptedTextarea && e.target.selectionStart !== e.target.selectionEnd) {
                    this.isSelectedText = true;
                    this.selectionStartOfSelectedText = e.target.selectionStart;
                    this.selectedText = window.getSelection().toString();
                }
            },
            handleCompositionEnd(e) {
                if (this.isEncryptedTextarea && !e.data) {
                    // 值没变化时就显示之前的密文
                    e.target.value = this.encryptedTextArea;
                    this.chinese = false;
                    return;
                }
                if (this.isEncryptedTextarea && e.data) {
                    this.selectionStart = e.target.selectionStart;
                    const offset = Math.max(e.data.length - 1, 0); // 每多一个中文会导致光标偏移一位，所以要减掉
                    const selectionStart = e.target.selectionStart - offset - 1; // 粘贴时，按下键盘时的光标位置为准
                    let value = '';

                    // 输入的值覆盖已选文本的情况
                    if (this.isSelectedText && e.data) {
                        this.selectionStart = this.selectionStartOfSelectedText + e.data.length;

                        const charArr = this.oldValue.split('');
                        charArr.splice(this.selectionStartOfSelectedText, this.selectedText.length, e.data);
                        value = charArr.join('');

                        this.isSelectedText = false;
                    } else {
                        const charArr = this.oldValue.split('');
                        charArr.splice(selectionStart, 0, e.data);
                        value = charArr.join('');
                    }

                    this.oldValueArr.push({
                        value: this.currentValue,
                        selectionStart: e.target.selectionStart
                    });
                    // 这个判断这为了修复--输入一个中文拼音然后删除，会导致之前输入字符显示明文
                    if (value !== this.currentValue) {
                        e.target.value = value;
                        this.$emit('on-input-model', value);
                        this.$emit('on-change', e, this);
                    }
                }
                this.chinese = false;
                // 抛出v-model
                if (!this.isEncryptedTextarea) {
                    this.$emit('on-input-model', e.target.value);
                    this.$emit('on-change', e, this);
                }
                if (this.__disableInputEvent__) {
                    this.compositionValue = e.target.value.replace(this.compositionBefore, '');
                    e.target.value = e.target.value.replace(this.compositionValue, '');
                }
            },
            handleEnter(event) {
                this.$emit('on-enter', event, this);
                if (this.search) {
                    this.$emit('on-search', this.currentValue, this);
                }
            },
            // 剪切
            handlePaste(e) {
                if (this.isEncryptedTextarea) {
                    const clipboardData = e.clipboardData;
                    this.keyData = clipboardData.getData('text');
                    this.selectionStartOfPaste = e.target.selectionStart;

                    // 是否是粘贴覆盖已选中的文本
                    if (e.target.selectionStart !== e.target.selectionEnd) {
                        this.isSelectedText = true;
                        this.selectionStartOfSelectedText = e.target.selectionStart;
                    }
                    this.isPaste = true;
                }
                this.$emit('paste', e);
            },

            handleKeydown(event) {
                if (this.isEncryptedTextarea) {
                    const ctrlKey = 17;
                    const cmdKey = 91;
                    let keyData = event.key;
                    this.keyCode = event.keyCode;
                    // 按下回车
                    if (this.keyCode === 13) {
                        keyData = '\n';
                    }
                    // 是否按下控制按钮
                    if (event.keyCode === ctrlKey || event.keyCode === cmdKey) {
                        this.isPressControl = true;
                    }
                    // 是否按下撤销
                    if (this.isPressControl && this.keyCode === 90) {
                        this.isPressUndo = true;
                    }

                    this.selectionStartOfKeyDown = event.target.selectionStart;
                    this.oldValue = this.currentValue;
                    this.keyData = keyData;

                    // 判断是否选中了部分文本
                    if (event.target.selectionStart !== event.target.selectionEnd) {
                        this.selectedText = window.getSelection().toString();
                        this.isSelectedText = true;
                        this.selectionStartOfSelectedText = event.target.selectionStart;
                    }
                }
                this.$emit('on-keydown', event, this);
            },
            handleKeypress(event) {
                this.$emit('on-keypress', event, this);
            },
            handleKeyup(event) {
                if (this.isEncryptedTextarea) {
                    const ctrlKey = 17;
                    const cmdKey = 91;
                    if (event.keyCode === ctrlKey || event.keyCode === cmdKey) {
                        this.isPressControl = false; // 是否按下控制按钮
                        this.isPressUndo = false; // 是否按下撤销按钮
                    }
                }
                this.$emit('on-keyup', event, this);
            },
            handleIconClick(event) {
                this.$emit('on-click', event, this);
            },
            handleFocus(event) {
                this.$emit('on-focus', event, this);
            },
            handleBlur(event) {
                if (this.number) {
                    if (event.target.value) {
                        event.target.value = Number(event.target.value);
                        this.$emit('on-change', event, this);
                    }
                }
                this.$emit('on-blur', event, this);
                if (!findComponentUpward(this, ['DatePicker', 'TimePicker', 'Cascader', 'Search'])) {
                    this.dispatch('FormItem', 'on-form-blur', this.currentValue);
                }
            },
            handleInput(event) {
                if (this.pasteRegex) {
                    return false;
                }
                if (this.chinese) {
                    return false;
                }
                // 修复：失去焦点后按撤销会导致加密文本变明文
                if (document.activeElement !== event.target) {
                    return false;
                }
                // 非撤销操作进行缓存
                if (this.isEncryptedTextarea && !this.isPressUndo) {
                    this.oldValueArr.push({
                        value: this.currentValue,
                        selectionStart: event.target.selectionStart
                    });
                }

                this.$emit('input', event.target.value, this);

                if (this.regx) {
                    if (this.number) {
                        if (event.target.value) {
                            let val = event.target.value;
                            if (!this.regx.test(event.target.value)) {
                                event.target.value = this.currentValue;
                                this.$emit('on-regx-check', event.target.value, this, val);
                            }
                            this.beforeEmitModelValue = event.target.value;
                            if (Number.isNaN(Number(event.target.value))) {
                                event.target.value = '';
                                this.$emit('on-input-model', 0);
                                this.currentValue = event.target.value;
                            } else {
                                this.$emit('on-input-model', Number(event.target.value));
                                this.currentValue = event.target.value;
                            }
                            !this.isEncryptedTextarea && this.$emit('on-change', event, this);
                        } else if (event.target.value === '') {
                            this.$emit('on-input-model', event.target.value);
                            !this.isEncryptedTextarea && this.$emit('on-change', event, this);
                        }
                    } else {
                        let val = event.target.value;
                        if (val && !this.regx.test(event.target.value)) {
                            if (event.target.value && event.target.value.indexOf('……') > -1) {
                                event.target.value = event.target.value.replace('……', '');
                            } else {
                                event.target.value = this.currentValue;
                            }
                            this.$emit('on-regx-check', event.target.value, this, val);
                        }
                        this.$emit('on-input-model', event.target.value);
                        this.currentValue = event.target.value;
                        !this.isEncryptedTextarea && this.$emit('on-change', event, this);
                    }
                } else {
                    let value = event.target.value;
                    if (this.number && value !== '') {
                        value = Number.isNaN(Number(value)) ? value : Number(value);
                    }
                    this.$emit('on-input-model', value);
                    this.setCurrentValue(value);
                    !this.isEncryptedTextarea && this.$emit('on-change', event, this);
                }

                // 加密textarea
                if (this.isEncryptedTextarea) {
                    this.selectionStart = event.target.selectionStart;
                    const selectionStart = this.isPaste ? this.selectionStartOfPaste + 1 : this.selectionStart; // 粘贴时，按下键盘时的光标位置为准

                    // 按下撤销
                    if (this.isPressUndo) {
                        const oldValue = this.oldValueArr.pop();
                        this.selectionStart = oldValue.selectionStart;
                        event.target.value = oldValue.value;
                        this.$emit('on-input-model', oldValue.value);
                        this.$emit('on-change', event, this);
                        this.isPaste = false;
                        return false;
                    }

                    // 覆盖已选文本的情况(没有按删除键的情况下)
                    if (this.isSelectedText && this.keyCode !== 8) {
                        this.selectionStart = this.selectionStartOfSelectedText + this.keyData.length;
                        // 先删除再粘贴
                        const charArr = this.oldValue.split('');
                        charArr.splice(this.selectionStartOfSelectedText, this.selectedText.length, this.keyData);
                        event.target.value = charArr.join('');

                        this.$emit('on-input-model', charArr.join(''));
                        this.$emit('on-change', event, this);
                        this.isPaste = false;
                        this.isSelectedText = false;
                        return false;
                    }

                    // 手动把新加的输入值和原来的值进行拼接
                    let charArr = this.oldValue.split('');
                    if (event.target.value.length >= this.oldValue.length) {
                        // 输入值
                        charArr.splice(selectionStart - 1, 0, this.keyData);
                    } else if (event.target.value.length < this.oldValue.length && event.target.value !== '') {
                        // 删除
                        charArr.splice(selectionStart, this.oldValue.length - event.target.value.length);
                    } else {
                        // 全选删除
                        charArr = [];
                    }
                    event.target.value = charArr.join('');
                    this.$emit('on-input-model', charArr.join(''));
                    this.$emit('on-change', event, this);

                    this.isPaste = false;
                    this.isSelectedText = false;
                }
            },
            handleChange(event) {
                this.$emit('on-input-change', event, this);
            },
            setCurrentValue(value) {
                if (value === this.currentValue) {
                    return;
                }
                this.$nextTick(() => {
                    this.resizeTextarea();
                });
                this.currentValue = value;
                if (!findComponentUpward(this, ['DatePicker', 'TimePicker', 'Cascader', 'Search'])) {
                    this.dispatch('FormItem', 'on-form-change', value);
                }
            },
            resizeTextarea() {
                const autosize = this.autosize;

                if (!autosize || this.type !== 'textarea') {
                    return false;
                }

                const minRows = autosize.minRows;
                const maxRows = autosize.maxRows || this.rows;

                this.textareaStyles = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
            },
            focus() {
                if (this.type === 'textarea') {
                    this.$refs.textarea.focus();
                } else {
                    this.$refs.input.focus();
                }
            },
            blur() {
                if (this.type === 'textarea') {
                    this.$refs.textarea.blur();
                } else {
                    this.$refs.input.blur();
                }
            },
            handleClear() {
                const e = {target: {value: ''}};
                this.$emit('on-input-model', '');
                this.$emit('input', '', this);
                this.setCurrentValue('');
                this.$emit('on-clear', e, this);
                this.$emit('on-change', e, this);
            },
            handleSearch() {
                console.log('handleSearch')
                if (this.disabled) {
                    return false;
                }
                this.$refs.input.focus();
                this.$emit('on-search', this.currentValue, this);
            },
            getClearIconStyle() {
                this.$nextTick(() => {
                    if (this.append) {
                        let paddingRight = this.$refs.append.offsetWidth;
                        if (this.$refs.clearIcon) {
                            this.$refs.clearIcon.style['margin-right'] = `${paddingRight}px`;
                        }
                    }
                });
            },

            calcIconOffset(place) {
                let elList = [].slice.call(this.$el.querySelectorAll('.ark-input-prefix') || []);
                if (!elList.length) {
                    return;
                }
                let el = null;
                for (let i = 0; i < elList.length; i++) {
                    if (elList[i].parentNode === this.$el) {
                        el = elList[i];
                        break;
                    }
                }
                if (!el) {
                    return;
                }
                const pendantMap = {
                    suffix: 'append',
                    prefix: 'prepend'
                };

                const pendant = pendantMap[place];
                if (this.$slots[pendant]) {
                    el.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${this.$el.querySelector(`.ark-input-group-${pendant}`).offsetWidth}px)`;
                    el.style.zIndex = 2;
                } else {
                    el.removeAttribute('style');
                }
            },
            updateIconOffset() {
                this.calcIconOffset('prefix');
            }
        },
        watch: {
            value(val) {
                const {beforeEmitModelValue} = this;
                const splitValue = beforeEmitModelValue.split('.');
                if (splitValue.length === 2 && Number(splitValue[0]) === val) {
                    this.setCurrentValue(beforeEmitModelValue);
                } else {
                    this.setCurrentValue(val);
                }
            },
            currentValue(val) {
                // console.log('watch-val', val)
                if (this.isEncryptedTextarea) {
                    if (this.cursorTimer) {
                        clearTimeout(this.cursorTimer);
                        this.cursorTimer = null;
                    }
                    // 重新定位光标位置
                    this.cursorTimer = setTimeout(() => {
                        const dom = this.$refs.textarea;
                        dom.setSelectionRange(this.selectionStart, this.selectionStart);
                    }, 20);
                }
                if (val) {
                    this.getClearIconStyle();
                }
            }
        },
        updated() {
            const {customData} = this;
            if (customData && Object.prototype.toString.call(customData) === '[object Object]') {
                Object.keys(customData).forEach((key) => {
                    if (Object.keys(this.$props).indexOf(key) === -1) {
                        this[key] = customData[key];
                    }
                });
            }
            this.$nextTick(this.updateIconOffset);
        },
        created() {
            // 下面变量用于textarea加密
            this.selectionStart = null; // 光标位置
            this.keyData = ''; // 记录按键按下的值
            this.keyCode = null; // 记录按下的键
            this.oldValue = ''; // 记录上次输入的值
            this.selectionStartOfKeyDown = null; // 按下按键时光标的位置
            this.selectionStartOfPaste = null; // 粘贴时光标的位置
            this.isPaste = false; // 监听粘贴
            this.oldValueArr = []; // 回滚数据用
            this.isPressControl = false; // 是否按下控制按钮
            this.isPressUndo = false; // 是否按下撤销
            this.isSelectedText = false; // 是否是选中文本后进行粘贴
            this.selectionStartOfSelectedText = null; // 选中文本后进行输入时光标的位置
            this.selectedText = ''; // 记录光标选中的文本
        },

        mounted() {
            setTimeout(() => {
                if (this.autofocus) {
                    this.focus();
                }

            }, 100);
            if (this.type !== 'textarea') {
                this.prepend = this.$slots.prepend !== undefined;
                this.append = this.$slots.append !== undefined;
                this.showPrefix = this.prefix !== '' || this.$slots.prefix !== undefined;
                this.showSuffix = this.suffix !== '' || this.$slots.suffix !== undefined;
            } else {
                this.prepend = false;
                this.append = false;
            }
            let that = this;
            if (this.$refs.input) {
                this.$refs.input.addEventListener('paste', (event) => {
                    this.pasteRegex = true;
                    setTimeout(() => {
                        if (this.regx && !this.regx.test(event.target.value)) {
                            this.pasteRegex = true;
                            event.target.value = '';
                            this.$emit('on-input-model', '');
                            this.currentValue = '';
                            this.pasteRegex = false;
                        } else {
                            this.pasteRegex = false;
                        }
                        this.handleInput(event);
                    }, 0);
                });
                this.$refs.input.addEventListener('compositionstart', (event) => {
                    that.chinese = true;
                });
                this.$refs.input.addEventListener('compositionend', (event) => {
                    that.chinese = false;
                    if (that.regx && !that.regx.test(event.target.value)) {
                        event.target.value = that.value;
                        return false;
                    }
                    if (that.number) {
                        event.target.value = that.value;
                        return false;
                    }
                    that.handleInput(event);
                });


            }
            this.slotReady = true;
            this.resizeTextarea();
            this.getClearIconStyle();
            setTimeout(() => {
                this.updateIconOffset();
            }, 100);
        }
    };
</script>

<style scoped lang="less">
    .encode-text {
        font-size: 16px;
        font-weight: bold;
    }
</style>

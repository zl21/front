import Vue from 'vue';
// 校验filed
export class Validate extends Vue {
    constructor() {
        super()
        // 模板   
        this.setTemplate();
        // 数据   
        this.data = this.setData;
        // 方法   
        this.setMethods();
        this.setProps();
        this.setWatch();
        this.setMounted();

    }
    setWatch() {
        this.watch = {
            rules: {
                handler(val) {
                    this.rulesData = val;
                }
            },
            value: {
                handler(val) {
                    //
                    this.setClassName();

                }
            },
            message:{
                handler(val) {
                    // 校验提示
                    this.$parent.errTip = val;
                }
            }
        }
    }
    setMounted() {
        this.mounted = function () {
            setTimeout(() => {
                this.rulesData = this.rules;
                this.addEventListener();
                this.setClassName();
                this.$parent.$refs.ValidateItem = this;
            }, 50)

        };
    }
    setProps() {
        this.props = {
            value: { // 属性集合
                type: [Object, Array, String, Number, Date],
                default: () => {
                    return '';
                }

            },
            rules: { // 属性集合
                type: [Object],
                default: () => {
                    return {};
                }

            },
            labelWidth:{
                type:[String,Number],
                default: () => {
                    return 0;
                }
            },
            showTip:{
                type:Boolean,
                default: () => {
                    return false;
                }
            }
        }
    }
    setTemplate() {
        this.template = `
        <div :class="className">
           <slot />
           <div class="validate_item_tip" v-if="showTip">
                <div v-if="message && message.length>0 " v-bind:style="{display: 'flex',marginLeft: labelWidth + 'px' }">
                    <Icon type="ios-alert" /><span>{{message}}</span>
                </div>    
           </div>
      </div>
      `;
    }
    setData() {
        return {
            rulesData: {},
            className: 'validate_item',
            types: { // 校验的规则
                regx: 'regx',
                len: '=',
                min: '=>',
                max: '<=',
                callback: 'fun'
                // range: '%s must be between %s and %s'
            },
            message: '',
        }
    }

    setMethods() {
        this.methods = {
            validateFormInt(){
                // 点击按钮校验规则
                let trigger = this.rules.trigger || {};
                let required = this.rules.required;
                let self = this;
                // 事件的校验
                if (required && required.type) {
                    self.verifyTypes(self.value, trigger['blur'],'blur');
                }
                return this.message;
            },
            validateRequire(val,type) {
                // 验证非空提示
                let required = this.rulesData['required'];
                if (required && required.type && required.trigger ===type ) {
                    if (this.isEmpty(val)) {
                        this.message = required.message;
                        return false
                    }

                }
                return true;
            },
            verifyTypes(val, rule,type) {
                // 校验规则
                this.message = '';
                // 先判断是否空值
                if(!this.validateRequire(val,type)){
                    return;
                }
                Object.keys(this.types).some((item) => {

                    if (rule[item]) {
                        if (this.types[item] !== 'fun' && this.types[item] !== 'regx') {
                            let checked = eval(val.length + this.types[item] + rule[item]);
                            if (!checked) {
                                this.message = rule.message;
                                return;
                            }
                        } else {
                            if (this.types[item] === 'fun') {
                                // 函数调用
                                if (typeof rule[item] === 'function') {
                                    if (typeof rule[item]().then === 'function') {

                                        rule[item].call(this, val).then((res) => {
                                            this.message = res;
                                            return;
                                        })
                                    } else {
                                        this.message = rule[item].call(this, val);
                                        return;
                                    }

                                }
                            }
                            if (this.types[item] === 'regx') {
                                if (new RegExp(rule[item]).test(val) === false) {
                                    this.message = rule.message;
                                    return;
                                }

                            }

                        }

                    }
                });
            },
            isEmpty(v) {
                // 校验是否为空
                switch (typeof v) {
                    case 'undefined':
                        return true;
                    case 'string':
                        if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
                        break;
                    case 'boolean':
                        if (!v) return true;
                        break;
                    case 'number':
                        if (0 === v || isNaN(v)) return true;
                        break;
                    case 'object':
                        if (null === v || v.length === 0) return true;
                        for (var i in v) {
                            return false;
                        }
                        return true;
                }
            },
            setClassName() {
                // 设置class
                let required = this.rules.required;
                if (required && required.type) {
                    this.className = required && required.type ? 'validate_item validate_required' : 'validate_item';
                }
            },
            addEventListener() {
                // 监听校验事件
                let trigger = this.rules.trigger || {};
                let required = this.rules.required;
                let self = this;
                // 事件的校验
                if (required && required.type) {
                    // 空值的事件
                    let trigger_required = this.rules.required.trigger;

                    let trigger_key = Object.keys(trigger);
                    // 判断空值事件与事件trigger 是否相同
                    if (!Object.keys(trigger).includes(trigger_required)) {
                        trigger_key.push(trigger_required);
                    }

                    let $el = this.$el.querySelector('input') || this.$el.querySelector('textarea');
                    trigger_key.forEach((type) => {

                        $el?$el.addEventListener(type, (e) => {
                            if (trigger[type]) {
                                // 校验事件
                                self.verifyTypes(self.value, trigger[type],type);

                            } else {
                                if (required.trigger === type) {
                                    // 校验空值
                                    self.validateRequire(self.value,type);
                                }
                            }
                        }):null;
                    })
                }
               

            }

        }


    }
    init() {
        let VueCompent = {
            data: this.data,
            methods: this.methods,
            props: this.props,
            mounted: this.mounted,
            watch: this.watch,
            template: this.template
        }
        let ValidateCom = Vue.extend(VueCompent);
        
        return new ValidateCom().$options;
    }

}

// 表单
export const validateForm = function(name){
    // 全局校验
        let formItem = this.$refs[name];
        let message = [];
        formItem.forEach((item)=>{
            let  ValidateItem = item.$refs.ValidateItem;
            let  errorTip = ValidateItem.validateFormInt();
            if(errorTip.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length>0){
                message.push(errorTip);
            }
        })
        return message;

}


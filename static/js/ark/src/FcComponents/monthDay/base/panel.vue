<template>
    <div :class="[prefixCls + '-body-wrapper']" @mousedown.prevent>
        <div :class="[prefixCls + '-body']">
            <div :class="[timePrefixCls + '-header']" v-if="showDate">{{ visibleDate }}</div>
            <div :class="[prefixCls + '-content']">
                <time-spinner
                    ref="timeSpinner"
                    :months="timeSlots[0]"
                    :days="timeSlots[1]"
                    :disabled-months="disabledHMS.disabledMonths"
                    :disabled-days="disabledHMS.disabledDays"
                    :hide-disabled-options="hideDisabledOptions"
                    @on-change="handleChange"
                    @on-pick-click="handlePickClick"></time-spinner>
            </div>
        </div>
    </div>
</template>
<script>
import TimeSpinner from './time-spinner.vue';
import burgeonConfig from '../../../assets/config';
import {initTimeDate} from '../../../components/date-picker/util';
import Mixin from '../../../components/date-picker/panel/panel-mixin';
import Options from '../../../components/date-picker/time-mixins';

const prefixCls = `${burgeonConfig.prefixCls}picker-panel`;
const timePrefixCls = `${burgeonConfig.prefixCls}time-picker`;

const capitalize = (str) => str[0].toUpperCase() + str.slice(1);
const mergeDateHMS = (date, hours, minutes, seconds) => {
    const newDate = new Date(date.getTime());
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(seconds);
    return newDate;
};
const unique = (el, i, arr) => arr.indexOf(el) === i;
const returnFalse = () => false;

// console.log('initTimeDate', initTimeDate())

export default {
    name: 'TimePickerPanel',
    components: {TimeSpinner},
    mixins: [Mixin, Options],
    props: {
        disabledDate: {
            type: Function,
            default: returnFalse
        },
        format: {
            type: String,
            default: 'HH:mm:ss'
        },
        value: {
            type: Array,
            required: true
        },

        disabledMonths: {
            type: Array,
            default () {
                return [];
            }
        },
        disabledDays: {
            type: Array,
            default () {
                return [];
            }
        },
        hideDisabledOptions: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            prefixCls: prefixCls,
            timePrefixCls: timePrefixCls,
            date: this.value[0] || initTimeDate(),
            showDate: false
        };
    },
    computed: {
        showSeconds() {
            return !(this.format || '').match(/mm$/);
        },
        visibleDate() {
            const date = this.date;
            const month = date.getMonth() + 1;
            const tYear = this.t('i.datepicker.year');
            const tMonth = this.t(`i.datepicker.month${month}`);
            return `${date.getFullYear()}${tYear} ${tMonth}`;
        },
        timeSlots() {
            if (!this.value[0]) {
                return [];
            }

            return ['getMonth', 'getDate'].map(slot => this.date[slot]());
        },
        disabledHMS() {
            // console.log('computed-disabledHMS-this', this)

            const disabledTypes = ['disabledMonths', 'disabledDays'];
            // console.log('this.value', this.value)
            if (this.disabledDate === returnFalse || !this.value[0]) {
                const disabled = disabledTypes.reduce(
                    (obj, type) => (obj[type] = this[type], obj), {}
                );
                return disabled;
            } else {
                const slots = [12, 31];

                const disabled = ['Months', 'Days'].map(type => this[`disabled${type}`]);

                // console.log('disabled', disabled)
                const disabledHMS = disabled.map((preDisabled, j) => {
                    const slot = slots[j];
                    const toDisable = [];
                    // const toDisable = preDisabled;
                    // console.log('preDisabled', preDisabled)
                    for (let i = 0; i < slot; i += 1) {
                        const hms = this.timeSlots.map((slot, x) => (x === j ? i : slot));
                        const testDateTime = mergeDateHMS(this.date, ...hms);

                        // j === 1 ? console.log('this.disabledDate(testDateTime, true)', this.disabledDate(testDateTime, true)) : '';
                        if (this.disabledDate(testDateTime, true)) {
                            toDisable.push(i);
                        }
                    }
                    return toDisable.filter(unique);
                });
                // console.log('disabledHMS', disabledHMS)
                const res = disabledTypes.reduce(
                    (obj, type, i) => (obj[type] = disabledHMS[i], obj), {}
                );
                // console.log('res', res)
                return res;
            }
        }
    },
    watch: {
        value(dates) {
            let newVal = dates[0] || initTimeDate();
            newVal = new Date(newVal);
            this.date = newVal;
        }
    },
    methods: {
        handleChange(date, emit = true) {
            // console.log('this.value', this.value)
            // console.log('this.date', this.date)
            const newDate = new Date(this.date);
            Object.keys(date).forEach( type => {
                let temp = type === 'month' ? date[type] - 1 : date[type];
                if (type === 'month') {
                    newDate['setDate'](1);
                }
                // console.log('temp', temp)
                return newDate[`set${capitalize(type)}`](temp);
            } );
            // console.log('newDate', newDate)
            if (emit) {
                this.$emit('on-pick', newDate, 'time');
            }
        }
    },
    mounted() {
        if (this.$parent && this.$parent.$options.name === 'DatePicker') {
            this.showDate = true;
        }
    }
};
</script>

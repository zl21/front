<template>
    <div :class="classes">
        <div :class="[prefixCls+ '-list']" ref="months">
            <ul :class="[prefixCls + '-ul']">
                <li :class="getCellCls(item)" v-for="item in monthsList" v-show="!item.hide"
                    @click="handleClick('month', item)">{{ item.text }}月
                </li>
            </ul>
        </div>
        <div :class="[prefixCls+ '-list']" ref="days">
            <ul :class="[prefixCls + '-ul']">
                <li :class="getCellCls(item)" v-for="item in daysList" v-show="!item.hide"
                    @click="handleClick('date', item)">{{ item.text }}日
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import {deepCopy, scrollTop, firstUpperCase} from '../../../utils/assist';
import burgeonConfig from '../../../assets/config';

const prefixCls = `${burgeonConfig.prefixCls}time-picker-cells`;
const timeParts = ['months', 'days'];

export default {
    name: 'TimeSpinner',
    props: {
        months: {
            type: [Number, String],
            default: NaN
        },
        days: {
            type: [Number, String],
            default: NaN
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
            spinerSteps: [1, 1, 1].map((one, i) => one),
            prefixCls: prefixCls,
            compiled: false,
            focusedColumn: -1, // which column inside the picker
            focusedTime: [0, 0, 0] // the values array into [hh, mm, ss]
        };
    },
    computed: {
        classes() {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-with-seconds`]: this.showSeconds
                }
            ];
        },
        monthsList() {
            let months = [];
            const step = this.spinerSteps[0];
            const focusedHour = this.focusedColumn === 0 && this.focusedTime[0];
            const hour_tmpl = {
                text: 1,
                selected: false,
                disabled: false,
                hide: false
            };

            for (let i = 1; i < 13; i += step) {
                const month = deepCopy(hour_tmpl);
                month.text = i;
                month.focused = i === focusedHour;

                if (this.disabledMonths.length && this.disabledMonths.indexOf(i) > -1) {
                    month.disabled = true;
                    if (this.hideDisabledOptions) {
                        month.hide = true;
                    }
                }
                if (this.months === i - 1) {
                    month.selected = true;
                }
                months.push(month);
            }
            return months;
        },
        daysList() {
            let days = [];
            const step = this.spinerSteps[1];
            const focusedMinute = this.focusedColumn === 1 && this.focusedTime[1];
            const minute_tmpl = {
                text: 1,
                selected: false,
                disabled: false,
                hide: false
            };

            for (let i = 1; i < 32; i += step) {
                const day = deepCopy(minute_tmpl);
                day.text = i;
                day.focused = i === focusedMinute;

                if (this.disabledDays.length && this.disabledDays.indexOf(i) > -1) {
                    day.disabled = true;
                    if (this.hideDisabledOptions) {
                        day.hide = true;
                    }
                }
                if (this.days === i) {
                    day.selected = true;
                }
                // 禁用每个月30天的【4，6，9，11】
                if (([4,6,9,11].indexOf(this.months + 1) > -1 && i > 30) || (this.months === 1 && i > 29)) {
                    day.disabled = true;
                }
                days.push(day);
            }
            return days;
        },
    },
    methods: {
        getCellCls(cell) {
            return [
                `${prefixCls}-cell`,
                {
                    [`${prefixCls}-cell-selected`]: cell.selected,
                    [`${prefixCls}-cell-focused`]: cell.focused,
                    [`${prefixCls}-cell-disabled`]: cell.disabled

                }
            ];
        },
        chooseValue(values) {
            const changes = timeParts.reduce((obj, part, i) => {
                const value = values[i];
                if (this[part] === value) {
                    return obj;
                }
                return {
                    ...obj,
                    [part]: value
                };
            }, {});
            if (Object.keys(changes).length > 0) {
                this.emitChange(changes);
            }
        },
        handleClick(type, cell) {
            if (cell.disabled) {
                return;
            }
            const data = {[type]: cell.text};
            this.emitChange(data);
        },
        emitChange(changes) {
            this.$emit('on-change', changes);
            this.$emit('on-pick-click');
        },
        scroll(type, index) {
            const from = this.$refs[type].scrollTop;
            const to = 24 * this.getScrollIndex(type, index);
            scrollTop(this.$refs[type], from, to, 500);
        },
        getScrollIndex(type, index) {
            const Type = firstUpperCase(type);
            const disabled = this[`disabled${Type}`];
            if (disabled.length && this.hideDisabledOptions) {
                let _count = 0;
                disabled.forEach(item => (item <= index ? _count++ : ''));
                index -= _count;
            }
            return index;
        },
        updateScroll() {
            this.$nextTick(() => {
                timeParts.forEach(type => {
                    this.$refs[type].scrollTop = 24 * this[`${type}List`].findIndex(obj => obj.text == this[type]);
                });
            });
        },
        updateFocusedTime(col, time) {
            this.focusedColumn = col;
            this.focusedTime = time.slice();

        }
    },
    watch: {
        months(val) {
            if (!this.compiled) {
                return;
            }
            this.scroll('months', this.monthsList.findIndex(obj => obj.text == val));
        },
        days(val) {
            if (!this.compiled) {
                return;
            }
            this.scroll('days', this.daysList.findIndex(obj => obj.text == val));
        },
        focusedTime(updated, old) {
            timeParts.forEach((part, i) => {
                if (updated[i] === old[i] || typeof updated[i] === 'undefined') {
                    return;
                }
                const valueIndex = this[`${part}List`].findIndex(obj => obj.text === updated[i]);
                this.scroll(part, valueIndex);
            });
        }
    },
    mounted() {
        this.$nextTick(() => this.compiled = true);
    }
};
</script>


<template>
    <ul :class="simpleWrapClasses" :style="styles" v-if="simple">
        <li
            :title="t('i.page.prev')"
            :class="prevClasses"
            @click="prev">
            <a><Icon type="ios-arrow-back"></Icon></a>
        </li>
        <div :class="simplePagerClasses" :title="currentPage + '/' + allPages">
            <input
                type="text"
                :value="currentPage"
                autocomplete="off"
                spellcheck="false"
                @keydown="keyDown"
                @keyup="keyUp"
                @change="keyUp">
            <span>/</span>
            {{ allPages }}
        </div>
        <li
            :title="t('i.page.next')"
            :class="nextClasses"
            @click="next">
            <a><Icon type="ios-arrow-forward"></Icon></a>
        </li>
    </ul>
    <ul :class="wrapClasses" :style="styles" v-else>
        <Pager
            :total="total"
            :pagerCount="pagerCount"
            :prevText="prevText"
            :nextText="nextText"
            :current-page="currentPage"
            :all-pages="allPages"
            @change-page="changePage"
        ></Pager>

        <!-- <span :class="[prefixCls + '-total']" v-if="showTotal">
            <slot>{{ t('i.page.total') }} {{ total }} <template v-if="total <= 1">{{ t('i.page.item') }}</template><template v-else>{{ t('i.page.items') }}</template></slot>
        </span> -->
        <Options
            :show-sizer="showSizer"
            :page-size="currentPageSize"
            :page-size-opts="pageSizeOpts"
            :placement="placement"
            :transfer="transfer"
            :show-elevator="showElevator"
            :_current.once="currentPage"
            :current="currentPage"
            :all-pages="allPages"
            :is-small="isSmall"
            :showTotal="showTotal"
            :total="total"
            @on-size="onSize"
            @on-page="onPage">
        </Options>
    </ul>
</template>
<script>
    import { oneOf } from '../../utils/assist';
    import Options from './options.vue';
    import Pager from './pager.vue';
    import Locale from '../../mixins/locale';

    import BurgeonConfig from '../../assets/config';

    const prefixCls = `${BurgeonConfig.prefixCls}page`;

    export default {
        name: 'Page',
        mixins: [Locale],
        components: { Options, Pager },
        props: {
            current: {
                type: Number,
                default: 1
            },
            total: {
                type: Number,
                default: 0
            },
            pageSize: {
                type: Number,
                default: 10
            },
            pageSizeOpts: {
                type: Array,
                default () {
                    return [10, 20, 30, 40];
                }
            },
            placement: {
                validator (value) {
                    return oneOf(value, ['top', 'bottom']);
                },
                default: 'bottom'
            },
            transfer: {
                type: Boolean,
                default () {
                    return !this.$IVIEW || this.$IVIEW.transfer === '' ? false : this.$IVIEW.transfer;
                }
            },
            size: {
                validator (value) {
                    return oneOf(value, ['small']);
                }
            },
            simple: {
                type: Boolean,
                default: false
            },
            showTotal: {
                type: Boolean,
                default: false
            },
            showElevator: {
                type: Boolean,
                default: false
            },
            showSizer: {
                type: Boolean,
                default: false
            },
            className: {
                type: String
            },
            styles: {
                type: Object
            },
            prevText: {
                type: String,
                default: ''
            },
            nextText: {
                type: String,
                default: ''
            },
            pagerCount: {
                type: Number,
                default: 7
            }
        },
        data () {
            return {
                prefixCls: prefixCls,
                currentPage: this.current,
                currentPageSize: this.pageSize
            };
        },
        created() {
            // console.log(this)
        },
        watch: {
            total (val) {
                let maxPage = Math.ceil(val / this.currentPageSize);
                if (maxPage < this.currentPage ) {
                    this.currentPage = maxPage === 0 ? 1 : maxPage;
                }
            },
            current (val) {
                // console.log('current-val', val)
                this.currentPage = val;
            },
            pageSize (val) {
                this.currentPageSize = val;
            }
        },
        computed: {
            isSmall () {
                return !!this.size;
            },
            allPages () {
                const allPage = Math.ceil(this.total / this.currentPageSize);
                return allPage === 0 ? 1 : allPage;
            },
            simpleWrapClasses () {
                return [
                    `${prefixCls}`,
                    `${prefixCls}-simple`,
                    {
                        [`${this.className}`]: !!this.className
                    }
                ];
            },
            simplePagerClasses () {
                return `${prefixCls}-simple-pager`;
            },
            wrapClasses () {
                return [
                    `${prefixCls}`,
                    {
                        [`${this.className}`]: !!this.className,
                        mini: !!this.size
                    }
                ];
            },
            prevClasses () {
                return [
                    `${prefixCls}-prev`,
                    {
                        [`${prefixCls}-disabled`]: this.currentPage === 1,
                        [`${prefixCls}-custom-text`]: this.prevText !== ''
                    }
                ];
            },
            nextClasses () {
                return [
                    `${prefixCls}-next`,
                    {
                        [`${prefixCls}-disabled`]: this.currentPage === this.allPages,
                        [`${prefixCls}-custom-text`]: this.nextText !== ''
                    }
                ];
            }
        },
        methods: {
            changePage (page) {
                // if (this.currentPage != page) {
                //     this.currentPage = page;
                //     this.$emit('update:current', page);
                //     this.$emit('on-change', page);
                // }
                this.currentPage = page;
                this.$emit('update:current', page);
                this.$emit('on-change', page);
            },
            onSize (pageSize) {
                this.currentPageSize = pageSize;
                this.$emit('on-page-size-change', pageSize);
                this.changePage(1);
            },
            onPage (page) {
                this.changePage(page);
            },
            keyDown (e) {
                const key = e.keyCode;
                const condition = (key >= 48 && key <= 57) || (key >= 96 && key <= 105) || key === 8 || key === 37 || key === 39;

                if (!condition) {
                    e.preventDefault();
                }
            },
            keyUp (e) {
                const key = e.keyCode;
                const val = parseInt16(e.target.value);

                if (key === 38) {
                    this.prev();
                } else if (key === 40) {
                    this.next();
                } else if (key === 13) {
                    let page = 1;

                    if (val > this.allPages) {
                        page = this.allPages;
                    } else if (val <= 0 || !val) {
                        page = 1;
                    } else {
                        page = val;
                    }

                    e.target.value = page;
                    this.changePage(page);
                }
            },
            prev () {
                const current = this.currentPage;
                if (current <= 1) {
                    return false;
                }
                this.changePage(current - 1);
            },
            next () {
                const current = this.currentPage;
                if (current >= this.allPages) {
                    return false;
                }
                this.changePage(current + 1);
            },
        }
    };
</script>

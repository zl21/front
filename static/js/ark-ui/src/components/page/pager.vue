<template>
    <span>
        <li :title="t('i.page.prev')" :class="prevClasses" @click="prev">
            <a><template v-if="prevText !== ''">{{ prevText }}</template><Icon v-else type="ios-arrow-back"></Icon></a>
        </li>
        <li title="1" :class="firstPageClasses" @click="changePage(1)"><a>1</a></li>
        <li :title="t('i.page.prev5')" v-if="showPrevMore" :class="[prefixCls + '-item-jump-prev']"
            @click="fastPrev"><a><Icon type="ios-arrow-back"></Icon></a></li>
        <li
            v-for="pager in pagers"
            :key="pager"
            :title="pager"
            :class="[prefixCls + '-item', pager === currentPage ? activeCls : '']"
            @click="changePage(pager)"
        >
            <a>{{pager}}</a>
        </li>
        <li :title="t('i.page.next5')" v-if="showNextMore" :class="[prefixCls + '-item-jump-next']"
            @click="fastNext"><a><Icon type="ios-arrow-forward"></Icon></a></li>
        <li :title="allPages" v-if="allPages > 1" :class="lastPageClasses" @click="changePage(allPages)"><a>{{ allPages }}</a></li>
        <li :title="t('i.page.next')" :class="nextClasses" @click="next">
            <a><template v-if="nextText !== ''">{{ nextText }}</template><Icon v-else type="ios-arrow-forward"></Icon></a>
        </li>
    </span>
</template>


<script>
    import BurgeonConfig from '../../assets/config';
    import Locale from '../../mixins/locale';

    const prefixCls = `${BurgeonConfig.prefixCls}page`;
    export default {
        name: 'Pager',
        mixins: [Locale],
        props: {
            currentPage: {
                type: Number,
                default: 1
            },
            allPages: {
                type: Number,
                default: 0
            },
            total: {
                type: Number,
                default: 0
            },
            pagerCount: {
                type: Number
            },
            prevText: {
                type: String,
                default: ''
            },
            nextText: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                prefixCls: prefixCls,
                showPrevMore: false,
                showNextMore: false
            };
        },
        computed: {
            pagers() {
                const {pagerCount} = this;
                const halfPagerCount = (pagerCount - 1) / 2;

                const currentPage = Number(this.currentPage);
                const allPages = Number(this.allPages);

                let showPrevMore = false;
                let showNextMore = false;

                if (allPages > pagerCount) {
                    if (currentPage > pagerCount - halfPagerCount) {
                        showPrevMore = true;
                    }

                    if (currentPage < allPages - halfPagerCount) {
                        showNextMore = true;
                    }
                }

                const array = [];

                if (showPrevMore && !showNextMore) {
                    const startPage = allPages - (pagerCount - 2);
                    for (let i = startPage; i < allPages; i++) {
                        array.push(i);
                    }
                } else if (!showPrevMore && showNextMore) {
                    for (let i = 2; i < pagerCount; i++) {
                        array.push(i);
                    }
                } else if (showPrevMore && showNextMore) {
                    const offset = Math.floor(pagerCount / 2) - 1;
                    for (let i = currentPage - offset; i <= currentPage + offset; i++) {
                        array.push(i);
                    }
                } else {
                    for (let i = 2; i < allPages; i++) {
                        array.push(i);
                    }
                }

                this.showPrevMore = showPrevMore;
                this.showNextMore = showNextMore;
                console.log('array', array)
                return array;
            },
            firstPageClasses() {
                return [
                    `${prefixCls}-item`,
                    `${prefixCls}-item-firstpage`,
                    {
                        [`${prefixCls}-item-active`]: this.currentPage === 1
                    }
                ];
            },
            lastPageClasses() {
                return [
                    `${prefixCls}-item`,
                    `${prefixCls}-item-lastpage`,
                    {
                        [`${prefixCls}-item-active`]: this.currentPage === this.allPages
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
            },
            activeCls: () => `${prefixCls}-item-active`
        },
        methods: {
            changePage(val) {
                this.$emit('change-page', val);
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
            fastPrev() {
                const page = this.currentPage - 5;
                if (page > 0) {
                    this.changePage(page);
                } else {
                    this.changePage(1);
                }
            },
            fastNext() {
                const page = this.currentPage + 5;
                if (page > this.allPages) {
                    this.changePage(this.allPages);
                } else {
                    this.changePage(page);
                }
            }
        }
    };

</script>

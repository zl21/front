<template>
    <virtual-list
        ref="tree"
        :height="height"
        :listData="localListData"
        :keygen="options.keygen"
        :childKey="options.childKey"
        :renderTitle="options.renderTitle"
        :emptyText="emptyText"
        :treeOpt="{ mode: mode, checked: localValue, showCheckbox }"
        @on-check-change="checkChange"
    ></virtual-list>
</template>

<script>
import burgeonConfig from '../../assets/config';
import VirtualList from '../../components/virtual-list';

const prefixCls = `${burgeonConfig.prefixCls}tree-v`;

export default {
    name: 'TreeV',
    components: {VirtualList},
    props: {
        height: {
            type: Number
        },
        listData: {
            type: Array
        },
        nodeInteraction:{
            type: Boolean,
            default: true
        },
        options: {
            type: Object,
            default: () => ({
                keygen: 'ID',
                childKey: 'children',
                renderTitle: 'title'
            })
        },
        // mode 0: full  1: child only  ##2: parent only
        mode: {
            type: Number,
            default: 0
        },
        value: {
            type: Array,
            default: () => []
        },
        showCheckbox: {
            type: Boolean,
            default: false
        },
        emptyText: {
            type: String,
            default: '暂无数据'
        }
    },
    computed: {
        classes() {
            return `${prefixCls}`;
        },
    },
    data() {
        return {
            localListData: [],
            localValue: []
        };
    },
    created() {
        // console.log('listData', this.listData)
    },
    watch: {
        listData: {
            handler (newV, oldV) {
                this.localListData = JSON.parse(JSON.stringify(newV));
            },
            immediate: true,
            deep:true
        },
        value: {
            handler (newV, oldV) {
                this.localValue = JSON.parse(JSON.stringify(newV));
            },
            immediate: true,
            deep:true
        }
    },
    mounted() {
        // console.log('this.localListData', this.localListData)
    },
    updated() {
    },
    methods: {
        expandAll() {
            this.$refs.tree.expandAll();
        },
        collapseAll() {
            this.$refs.tree.collapseAll();
        },
        clearAll() {
            console.log('clearAll-2');
            this.localValue = [];
            this.$refs.tree.clearAll();
        },
        handleCheck() {
            this.$refs.tree.handleCheck();
        },
        showAll(type) {
            this.$refs.tree.showAll(type);
        },
        checkChange(checked, node) {
            this.$emit('on-check-change', checked, node);
        },
        search(query) {
            console.log('query-treeV', query)
            this.$refs.tree.query(query);

        }
    }
};
</script>

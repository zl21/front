<template>
    <virtual-list
        ref="tree"
        :listData="localListData"
        :keygen="options.keygen"
        :childKey="options.childKey"
        :renderTitle="options.renderTitle"
        :treeOpt="{
            mode: mode,
            checked: value
        }"
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
        }
    },
    computed: {
        classes() {
            return `${prefixCls}`;
        },
    },
    data() {
        return {
            localListData: []
        };
    },
    created() {
        console.log('listData', this.listData)
    },
    watch: {
        listData: {
            handler (newV, oldV) {
                this.localListData = newV;
            },
            immediate: true,
            deep:true
        }
    },
    mounted() {
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
            this.$refs.tree.clearAll();
        },
        showAll(type) {
            this.$refs.tree.showAll(type);
        },
        checkChange(checked, node) {
            this.$emit('on-check-change', checked, node);
        }
    }
};
</script>

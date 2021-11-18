<template>
    <div
        ref="scroller"
        :style="wrapStyles"
        :class="containerCls"
        @scroll="handleScroll($event)"
    >
        <div ref="phantom" :class="phantomCls" :style="{ height: contentHeight }"></div>
        <div v-if="visibleData && visibleData.length > 0" ref="content" :class="contentCls" :style="{ width: option.width + 'px', transform: `translateY(${offset}px)` }">
            <div
                :class="itemCls"
                ref="items"
                :id="item._index"
                :key="item._index"
                v-for="item in visibleData">
                <div v-if="renderNode(item)">
                    {{renderNode(item)}}
                </div>
                <div v-else>
                    <div v-if="item.visible" :class="treeNodeCls" :style="{'margin-left': `${(item.level - 1) * 10}px`}">
                        <span :class="arrowClasses" @click="toggleExpand(item)">
                            <Icon v-if="item.children && item.children.length" :type="item.expand ? 'iconbj_off' : 'iconbj_on'" ></Icon>
                        </span>
                        <label v-if="treeOptions.showCheckbox">
                            <Checkbox
                                :value="item.checked"
                                :disabled="item.disabled"
                                :indeterminate="item.indeterminate"
                                @click.native.prevent="handleCheck(item)"
                            ></Checkbox>
                        </label>
                        <span
                            :class="nodeCls"
                            :style="nodeSty(item)"
                            @click="titleClick(item)"
                        >{{item[renderTitle] || ''}} @ {{item.checked}} # {{item.expand}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-else :class="emptyCls">{{emptyText}}</div>
    </div>
</template>

<script>
import burgeonConfig from '../../assets/config';
import Icon from '../icon/icon.vue';

const prefixCls = `${burgeonConfig.prefixCls}virtual-list`;
let lastTime = 0;

const flatten = function(
    list,
    childKey = 'children',
    level = 1,
    parent = null,
    defaultExpand = false,
    checked = false,
    indeterminate = false,
    defaultChecked,
    keygen,
    query = false
) {
    let arr = [];
    list.forEach(item => {
        item.level = level;
        if (defaultChecked && defaultChecked.length > 0) {
            item.checked = !defaultChecked.indexOf(item[keygen]);
        } else {
            item.checked = false;
        }
        item.indeterminate = false;
        if (item.expand === undefined) {
            item.expand = defaultExpand;
        }
        if (item.visible === undefined) {
            item.visible = true;
        }
        if (!parent.visible || !parent.expand) {
            item.visible = false;
        }
        item.parent = parent;
        item.query = false;
        item.children = item[childKey];
        arr.push(item);
        if (item[childKey]) {
            arr.push(
                ...flatten(
                    item[childKey],
                    childKey,
                    level + 1,
                    item,
                    defaultExpand,
                    checked,
                    indeterminate,
                    query
                )
            );
        }
    });
    return arr;
};


export default {
    name: 'VirtualList',
    components: { Icon },
    props: {
        height: {
            type: [String, Number]
        },
        //唯一键
        keygen: {
            type: String,
            default: 'key'
        },
        childKey: {
            type: String,
            default: 'children'
        },
        renderTitle: {
            type: String,
            default: 'title'
        },
        emptyText: {
            type: String,
            default: '暂无数据'
        },
        //渲染
        renderItem: {
            type: String | Function,
            default: ''
        },
        //所有列表数据
        listData: {
            type: Array,
            default: () => []
        },
        timeout: { //刷新频率
            type: Number,
            default: 17
        },
        option: {
            // 配置对象
            type: Object,
            default() {
                return {
                    width: 300, //滚动容器的宽度
                    height: 500, //滚动容器的高度
                    itemHeight: 25 // 单个item的高度
                };
            }
        },
        treeOpt: {
            type: Object,
            default: () => ({
                showCheckbox: false,
                nodeInteraction: true,
                mode: 0
            })
        }
    },
    computed: {
        classes() {
            return `${prefixCls}`;
        },
        wrapStyles() {
            return Object.assign({}, { overflowX: 'auto' }, { height: `${this.height || 300}px` });
        },
        containerCls() {
            return `${prefixCls}-container`;
        },
        phantomCls() {
            return `${prefixCls}-phantom`;
        },
        contentCls() {
            return `${prefixCls}-content`;
        },
        itemCls() {
            return `${prefixCls}-item`;
        },
        treeNodeCls() {
            return `${prefixCls}-tree-node`;
        },
        nodeCls() {
            return `${prefixCls}-node`;
        },
        emptyCls() {
            return `${prefixCls}-empty`;
        },
        arrowClasses () {
            return [
                `${prefixCls}-arrow`,
            ];
        },
        visibleCount() {
            return Math.floor(this.option.height / this.option.itemHeight);
        },
        treeOptions() {
            return Object.assign({}, { nodeInteraction: true, mode: 0 }, this.treeOpt);
        }
    },
    // created() {
    //     this.localListData = JSON.parse(JSON.stringify(this.listData));
    // },
    mounted() {
        this.localListData = [...this.handleFlattenTree(this.treeOptions)];
        this.updateView();
    },
    watch: {
        localListData: {
            handler (newV) {
                this.updateView();
            },
            immediate: true,
            deep:true
        }
    },
    data() {
        return {
            offset: 0, // translateY偏移量
            contentHeight: '0px',
            // 组件内部数据
            visibleData: [],
            localListData: [],
            findVal: ''
        };
    },
    methods: {
        getContentHeight() {
            this.contentHeight = `${(this.localListData || []).filter(item => item.visible).length * this.option.itemHeight}px`;
        },
        updateView(type) {
            this.getContentHeight();
            this.$emit('update', this.listData);
            this.handleScroll('e', type);
        },
        handleScroll(e, type) {
            let currentTime = Number(new Date());
            if (currentTime - lastTime > this.timeout) {
                const scrollTo = type ? 0 : this.$refs.scroller && this.$refs.scroller.scrollTop;
                this.updateVisibleData(scrollTo);
                if (type) { this.$refs.scroller.scrollTop = 0; }
                lastTime = currentTime;
            }
        },
        updateVisibleData(scrollTop = 0) {
            let start = Math.floor(scrollTop / this.option.itemHeight) - Math.floor(this.visibleCount / 2);
            start = start < 0 ? 0 : start;
            const end = start + this.visibleCount * 2;
            this.visibleData = (this.localListData || []).filter(item => item.visible).slice(start, end);
            // console.log('updateVisibleData--visibleData', this.visibleData)
            this.offset = start * this.option.itemHeight;
        },
        // 获取本地拍平数据
        handleFlattenTree(treeOptions) {
            const { keygen } = this;
            const { checked: defaultChecked } = treeOptions;
            return flatten(this.listData, this.childKey, 1, {
                level: 0,
                visible: true,
                expand: true,
                children: this.listData
            }, false, false, false, defaultChecked, keygen);
        },

        renderNode(data) {
            const {renderItem} = this;
            if (renderItem) {
                const render = typeof renderItem === 'function' ? renderItem : d => d[renderItem];
                return render(data);
            }
            return false;
        },
        titleClick(item) {
            if (this.treeOptions.showCheckbox) {
                this.handleCheck(item);
                return;
            }
            this.singleCheck(item);
        },
        nodeSty(item) {
            const title = this.findVal && item.title.indexOf(this.findVal) > -1 ? {color: '#e80707'} : {};
            const bgc = item.checked ? {backgroundColor: '#2d8cf04d'} : {};
            return Object.assign({}, title, bgc);
        },
        // 节点点击
        toggleExpand(item) {
            const isExpand = item.expand;
            if (isExpand) {
                this.collapse(item, true); // 折叠
            } else {
                this.expand(item, true); // 展开
            }
            this.updateView();
        },
        //展开节点
        expand(item) {
            if (item.children) {
                item.expand = true;
                this.recursionVisible(item.children, true);
            }
        },
        //折叠节点
        collapse(item) {
            if (item.children) {
                item.expand = false;
                this.recursionVisible(item.children, false);
            }
        },
        //折叠所有
        collapseAll(level = 1) {
            this.localListData.forEach(item => {
                item.expand = false;
                if (item.level !== level) {
                    item.visible = false;
                }
            });
            this.updateView('collapseAll');
        },
        //展开所有
        expandAll() {
            this.localListData.forEach(item => {
                item.expand = true;
                item.visible = true;
            });
            this.updateView('expandAll');
        },
        //清除所有
        clearAll() {
            const { keygen } = this;
            const { checked: defaultChecked } = this.treeOptions;
            this.localListData = flatten(this.listData, this.childKey, 1, {
                level: 0,
                visible: true,
                expand: true,
                children: this.listData
            }, true, false, false, defaultChecked, keygen, false);
            this.updateVisibleData();
        },
        showAll(type) {
            type ? this.expandAll() : this.collapseAll();
        },
        //递归节点
        recursionVisible(children, status) {
            children.forEach(node => {
                node.visible = status;
                if (node.children && !status) {
                    node.expand = status;
                    this.recursionVisible(node.children, status);
                }
            });
        },
        // 单选
        singleCheck(item) {
            // 清除其他选项
            this.localListData = [...this.handleFlattenTree(Object.assign({}, this.treeOptions, { checked: []}))]
            // 选中当前点击
            if (!item) {
                this.updateView('collapseAll')
                return;
            }
            if (item.indeterminate) {
                item.indeterminate = false;
            }
            item.checked = !item.checked;
            this.updateView();
            // 抛出事件
            let checkedList = this.localListData.filter(v => v.checked);
            console.log('checkedList', checkedList);
            this.onCheckChange(checkedList, item);
        },
        // 勾选
        handleCheck(item) {
            console.log('item', item)
            if (!item) {
                this.updateView('collapseAll')
                return;
            }
            if (item.indeterminate) {
                item.indeterminate = false;
            }
            item.checked = !item.checked;
            if (item.children) {
                this.checkedChild(item.children, item.checked);
            }
            if (this.treeOptions.nodeInteraction) {
                // 父子节点向上联动
                this.updateParent(item, item.checked);
            }
            this.updateView();

            let checked = [];
            let checkedList = this.localListData.filter(v => v.checked);
            // console.log('checkedList', checkedList);
            // mode 0: full  1: child only  ##2: parent only
            if (this.treeOptions.mode === 0) {
                checked = checkedList;
            } else if (this.treeOptions.mode === 1) {
                // 获取当前节点的子节点，在flattenTree中过滤掉
                checked = this.getChildNode(checkedList);
            } else {
                checked = this.getChildNode(checkedList);
            }
            // console.log('handleCheck', checked, item)
            this.onCheckChange(checked, item);
        },
        checkedChild(children, status) {
            children.forEach(node => {
                node.checked = status;
                if (node.indeterminate) {
                    node.indeterminate = false;
                }
                if (node.children) {
                    this.checkedChild(node.children, status);
                }
            });
        },
        // 父子节点向上联动
        updateParent(node, check) {
            if (node.parent) {
                // 判断父节点的所有子节点的选中状态
                const allChecked = node.parent.children.every(item => item.checked);
                const someChecked = node.parent.children.some(item => item.checked || item.indeterminate);
                if (check) {
                    node.parent.checked = allChecked;
                    node.parent.indeterminate = !node.parent.checked;
                } else {
                    node.parent.checked = false;
                    node.parent.indeterminate = someChecked;
                }
                if (node.parent.parent) {
                    this.updateParent(node.parent, check);
                }
            }
        },
        // 获取当前节点的子节点，在flattenTree中过滤掉
        getChildNode(checkedList) {
            return checkedList.reduce((prev, cur) => {
                !cur.children && prev.push(cur);
                return prev;
            },[]);
        },

        // emit-[on-check-change]
        onCheckChange(checked, node) {
            this.$emit('on-check-change', checked, node);
        },

        query(val) {
            console.log('query-vl', val)
            if(!val || !val.trim()) return;
            this.expandAll();
            this.findVal = val.trim();
            // this.flattenTree
            // this.localListData = this.localListData.map(v => ({
            //     ...v,
            //     expand: true,
            //     query: v.title.indexOf(val) > -1
            // }));
            // console.log('this.localListData', this.localListData)
            // this.updateView();
        }
    }
};
</script>

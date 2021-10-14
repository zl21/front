<template>
  <collapse-transition>
    <ul :class="classes"
        ref="ul">
      <li>
        <span :class="arrowClasses"
              v-show="showArrow"
              @click="handleExpand">

          <!-- <Icon v-if="showArrow" type="ios-arrow-forward"></Icon> -->

          <Icon v-if="showArrow && expand"
                type="iconbj_off"></Icon>
          <Icon v-if="showArrow && !expand"
                type="iconbj_on"></Icon>
          <Icon v-if="showLoading"
                type="ios-loading"
                :class="[`${burgeonConfig.prefixCls}load-loop`]"></Icon>
        </span>
        <label>
          <Checkbox v-if="showCheckbox"
                    :value="checked"
                    ref="Checkbox"
                    :indeterminate="indeterminate"
                    @click.native.prevent="handleCheck"></Checkbox>
          <p v-if="data.render"
             style="display: inline-block;"
             :class="titleClasses"
             @click="handleSelect">
            <Render :render="data.render"
                    :data="data"
                    :node="node"
                    @click.native="handleSelect"></Render>
          </p>
          <p style="display: inline-block;"
             :class="titleClasses"
             @click="handleSelect"
             v-else-if="isParentRender">
            <Render :render="parentRender"
                    :data="data"
                    :node="node"></Render>
          </p>
          <span v-else
                :class="titleClasses"
                @click="handleSelect">
            <textDisplay :query="query"
                         :title="data.title"
                         :queryStyle="queryStyle"></textDisplay>

            <span>{{text}}</span>
          </span>
        </label>
        <TreeNodeShow v-show="data.expand"
                      v-for="(item, i) in children"
                      :key="i"
                      :datas="item"
                      :query="query"
                      :queryStyle="queryStyle"
                      :selectMessageShow="selectMessageShow"
                      :selectMessage="selectMessage"
                      :getTreeDom="getTreeDom"
                      :multiple="multiple"
                      :show-checkbox="showCheckbox"
                      :children-key="childrenKey">
        </TreeNodeShow>
      </li>
    </ul>
  </collapse-transition>
</template>
<script>
import Vue from 'vue';
import Checkbox from '../checkbox/checkbox.vue';
import Icon from '../icon/icon.vue';
import Render from './render';
import textDisplay from './textDisplay';
import CollapseTransition from '../base/collapse-transition';
import Emitter from '../../mixins/emitter';
import { findComponentUpward } from '../../utils/assist';
import burgeonConfig from '../../assets/config';

const prefixCls = `${burgeonConfig.prefixCls}tree`;

export default {
  name: 'TreeNodeShow',
  mixins: [Emitter],
  components: {
    Checkbox, Icon, CollapseTransition, Render, textDisplay
  },
  props: {
    datas: {
      type: Object,
      default () {
        return {};
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    childrenKey: {
      type: String,
      default: 'children'
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    query: {
      type: String
    },
    queryStyle: {
      type: Object
    },
    selectMessageShow: {
      type: Boolean,
      default: false
    },
    selectMessage: {
      type: Function
    },
    getTreeDom:{
      type: Function
    }
  },
  data () {
    return {
      text: '',
      data: {},
      expand: false,
      checked:false,
      checkedNode:{}, // 选中的节点
      indeterminate:false,
      prefixCls: prefixCls
    };
  },
  watch: {
    datas: {
      handler (val) {
        console.log('val',);
        this.data = val;
         //this.expand = val.expand;
         //this.checked = val.checked;
         //this.indeterminate = val.indeterminate;
        this.text = this.selectedMessage();
      },
      deep: true
    }
  },
  created () {
    this.data = this.datas;
    this.expand = this.data.expand;
    this.checked = this.data.checked;
    this.indeterminate = this.data.indeterminate;
    this.text = this.selectedMessage();
  },
  computed: {
    classes () {
      return [
        `${prefixCls}-children`
      ];
    },
    selectedCls () {
      return [
        {
          [`${prefixCls}-node-selected`]: this.data.selected
        }
      ];
    },
    arrowClasses () {
      return [
        `${prefixCls}-arrow`,
        {
          [`${prefixCls}-arrow-disabled`]: this.data.disabled,
          [`${prefixCls}-arrow-open`]: this.expand
        }
      ];
    },
    titleClasses () {
      return [
        `${prefixCls}-title`,
        {
          [`${prefixCls}-title-selected`]: this.data.selected
        }
      ];
    },
    showArrow () {
      return (this.data[this.childrenKey] && this.data[this.childrenKey].length) || ('loading' in this.data && !this.data.loading);
    },
    showLoading () {
      return 'loading' in this.data && this.data.loading;
    },
    isParentRender () {
      const Tree = findComponentUpward(this, 'Tree');
      return Tree && Tree.render;
    },
    parentRender () {
      const Tree = findComponentUpward(this, 'Tree');
      if (Tree && Tree.render) {
        return Tree.render;
      } else {
        return null;
      }
    },
    node () {
      const Tree = findComponentUpward(this, 'Tree');
      if (Tree) {
        // 将所有的 node（即flatState）和当前 node 都传递
        return [Tree.flatState, Tree.flatState.find(item => item.nodeKey === this.data.nodeKey)];
      } else {
        return [];
      }
    },
    children () {
      return this.data[this.childrenKey] ? this.data[this.childrenKey] : [];
    }

  },
  methods: {
    selectedMessage () {
      if (this.children.length > 0 && this.selectMessageShow) {
        if (this.selectMessage) {
          return this.selectMessage(this.data.selectedNum);
        } else {
          return `(已选择${this.data.selectedNum})`;
        }
      } else {
        return null;
      }
    },
    handleExpand () {

      const item = this.data;
        if (this.data.disabled) {
        return;
      }

      this.expand = ! this.expand;
      if (this.$refs.ul && this.$refs.ul.querySelectorAll('ul')) {
        this.$refs.ul.querySelectorAll('ul').forEach(element => {
          if (this.expand) {
            element.style.display = 'block';
          } else {
            element.style.display = 'none';
          }
        });
        this.dispatch('Tree', 'toggle-expand', this.data);
      }
    },
    handleSelect () {
      if (this.data.disabled) {
        return;
      }
      this.dispatch('Tree', 'on-selected', this.data.nodeKey);
    },
    handlenodes(){
        let tree = this.getTreeDom();
        if (!tree){
            return true;
        }
        let node = [];
        tree.$children.forEach((item)=>{
            let childrenNode = Object.keys(item.checkedNode).reduce((arr,option)=>{
                    arr = arr.concat(item.checkedNode[option]);
                    return arr;
            },[]);
            if (childrenNode.length<1){
                item.indeterminate = false;
             }
            node = node.concat(childrenNode);
        });
        tree.$emit('on-check-change', node);

    },
    handleCheck () {

      if (this.data.disabled) {
        return;
      }
        this.checked = !this.checked;
        if (this.$parent.$refs.Checkbox ){
            this.$parent.indeterminate = true;
            if (this.checked){
             this.$parent.checkedNode[this.data.nodeKey] = this.data;
            } else {
             delete this.$parent.checkedNode[this.data.nodeKey];
            }
        }
        // this.indeterminate = !this.indeterminate;
    if (this.data.children){
        if (this.indeterminate ){
            this.checked = false;
        }
        if (this.checked){
            this.data.children.forEach((item)=>{
            this.checkedNode[item.nodeKey] = item;
            });
        } else {
           this.checkedNode = {};
        }
        this.$children.forEach((item,index)=>{
            if (index !== 0){
                item.checked = this.checked ;
            }

        });
         this.indeterminate = false;

    }
    this.handlenodes();
   // this.$refs.Checkbox.value = true;
    //   this.dispatch('Tree', 'on-check', changes);
    }
  }
};
</script>

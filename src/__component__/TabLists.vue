<!-- <div
      v-for="(tab, tabIndex) in openedMenuLists"
      :key="`tab-list-${tabIndex}`"
      class="tab-item"
    >
      {{ tab.label }}
    </div> -->
<template>
  <div
    v-if="openedMenuLists.length > 0"
    id="a"
    class="openedMenuLists"
  >
    <span
      v-show="clickshow"
      class="prev"
    ><i class="iconfont">&#xe610;</i></span>
    <ul
      class="tab-list"
    >
      <a
        v-for="(tag, index) in openedMenuLists"
        :key="index"
        :class="{active:tag.isActive === true,tag}"
        :title="tag.label"
        @click="switchTab(tag,index)"
      >
        <div
          class="openedMenuListsItem"
        >
          {{ tag.label }}
          <span
            class="close"
            @click.stop="handleClose(tag,index)"
          ><Icon type="ios-close" /></span>
        </div>
      </a>
    </ul>
    <span
      v-show="clickshow"
      class="next"
    ><i class="iconfont">&#xe611;</i></span>
    <router-link to="/">
      <span
        class="emptying"
        @click="emptyTabs"
      ><i class="iconfont">&#xe617;</i></span>
    </router-link>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import router from '../__config__/router.config';

  export default {
    name: 'TabLists',
    data() {
      return {
        SEARCH: '查找',
        clickshow: false,
        tagIndex: 0,
      };
    },
    mounted: {},
    computed: {
      ...mapState('global', {
        openedMenuLists: ({ openedMenuLists }) => openedMenuLists
      }),
     
    },
    watch: {
      // openedMenuLists: {
      //   handler(val) {
      //     this.$nextTick(() => {
      //       const tabOpenedMenuLists = document.getElementsByClassName('openedMenuLists')[0];
      //       const tabOpenedMenuListsTabListA = document.getElementsByClassName('tag')[0];
      //       const length = Math.floor((tabOpenedMenuLists.offsetWidth - 75) / 122);
      //       const width = tabOpenedMenuLists.offsetWidth - 75;
      //       const tagWidth = this.openedMenuLists.length * 122;
      //       const left = Math.abs(tagWidth - width);
      //       if (val.length > length) {
      //         this.clickshow = true;
      //         tabOpenedMenuListsTabListA.setAttribute('left', `-${left}px`);
      //       } else {
      //         this.clickshow = false;
      //         tabOpenedMenuListsTabListA.setAttribute('left', '0px');
      //       }
      //     });
      //   },
      // },
    },
    methods: {
      ...mapActions('global', { emptyTabs: 'emptyTabs' },),
      // ...mapActions('global', { TabCloseAppoint: 'TabCloseAppoint' },), 
      switchTab(item, index) {
        // this.tagIndex = index;
        const tag = this.openedMenuLists[index];
        this.$store.commit('global/switchActiveTab', tag);
        router.push({ path: tag.routeFullPath });
      },
      handleClose(tag) {
        const self = this;
        this.removeKeepAlivePages(tag);
        self.$store.commit('global/TabCloseAppoint', tag);
      }, // 关闭当前tab
      removeKeepAlivePages(path) { // 删除左侧最近使用
        const pageType = this.$route.path.split('/')[2];
        if (pageType === 'TABLE') {
          this.$store.commit('global/addExcludedComponents', 
                             {
                               keepAliveModuleName: path.keepAliveModuleName
                             });
        }
      },
     
      
    }
  };
</script>

<style scoped lang="less">

.openedMenuLists {
  background-color: #fff;
  border-bottom: 1px solid #dfdfdf;
  height: 34px;
  display: flex;
  box-sizing: border-box;
  .active {
  border-top: 2px solid #fd6442;
    
    border-bottom: 1px solid white;
    .burgeon-tag-text {
    color: #fd6442 !important;
    }
}
  .tab-list{
    margin: 0px;
    padding: 0;
    display: inline-block;
    flex: 1;
    height: 34px;
    position: relative;
    z-index: 0;
    display: flex;
    overflow: hidden;
    a{
      display: inline-block;
      text-decoration: none;
      position: relative;
      cursor: pointer;
      .openedMenuListsItem{
        height: 31px;
        width: 81px;
        display: block;
        padding-left: 20px;
        padding-right: 20px;
        line-height: 31px;
        background-color: #fff;
        box-sizing: content-box;
        text-align: center;
        color: #000;
        border: none;
        border-top: 2px solid #fff;
        border-right: 1px solid #dfdfdf;
        border-radius: 0;
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border-bottom: 1px solid #dfdfdf;
        margin: 0;
        .close{
          position: absolute!important;
          top: 7px!important;
          right: 2px!important;
          line-height: 16px;
          border-radius: 2px;
          display: none;
          color: #000000;
          text-align: center;
          cursor: pointer;
          font-size: 12px;
          height: 16px;
          width: 16px;
        }
          .close:hover{
            background-color: #d4d4d4;
            color: #000000;
          }
        }
        	&:hover{
            .close{
              display: block!important;
            }
          }
    }
    
  }
}
</style>

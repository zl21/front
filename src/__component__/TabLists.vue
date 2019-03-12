<template>
  <div
    v-if="openedMenuLists.length > 0"
    ref="openedMenuLists"
    class="openedMenuLists"
  >
    <span
      v-show="clickShow"
      class="prev"
      @click="prevClick"
    >
      <img
        src="../assets/image/leftArrow.png"
        alt=""
        @click="prevClick"
      >
    </span>
    <ul
      ref="tabList"
      class="tab-list"
    >
      <a
        v-for="(tag, index) in openedMenuLists"
        :key="index"
        ref="tabBox"
        :class="{active:tag.isActive === true}"
        class="tabBox"
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
          ><img
            src="../assets/image/iconX.png"
            alt=""
          ></span>
        </div>
      </a>
    </ul>
    <span
      v-show="clickShow"
      class="next"
      @click="nextClick"
    >
      <img
        src="../assets/image/rightArrow.png"
        alt=""
      >
    </span>
    <router-link to="/">
      <span
        class="emptying"
        @click="emptyClick"
      >
        <img
          src="../assets/image/delete.png"
          alt=""
        >
      
      </span>
    </router-link>
  </div>
 
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import router from '../__config__/router.config';

  export default {
    name: 'TabLists',
    data() {
      return {
        clickShow: true,
        tagIndex: 0,
      };
    },
    computed: {
      ...mapState('global', {
        openedMenuLists: ({ openedMenuLists }) => openedMenuLists
      }),
    },
    mounted() {
      const _this = this;
      window.onresize = () => { // 定义窗口大小变更通知事件
        _this.tabWidth = document.body.offsetWidth - 180 - 30 + 1 + 10;
        const tabBox = _this.$refs.openedMenuLists;
        tabBox.style.width = `${Number(_this.tabWidth)}px`;
      };
    },
    watch: {
      openedMenuLists: {
        handler(val) {
          this.$nextTick(() => {
            const _this = this;
            const tabOpenedMenuLists = _this.$refs.openedMenuLists;
            const tabOpenedMenuListsTabListA = _this.$refs.tabBox;
            const length = Math.floor((this.tabWidth) / 122); // 总长减去垃圾桶和2个箭头的宽度/每个tab的宽    计算当前宽度能放几个tab标签
            const width = this.tabWidth;// 当前页面总宽
            const tagWidth = this.openedMenuLists.length * 122;// 获取到tab的数量*每个tab的宽度=当前所占的总宽度
            const left = Math.abs(tagWidth - width);// 绝对值     计算出当没超出的时候剩余多少宽，超出之后超出了多少宽
            let i = 0;
            const TabListA = tabOpenedMenuListsTabListA.length;
            if (val.length > length) { // 判断如果超出当前tab盒子的总宽
              this.clickShow = true;
              for (i = 0; i < TabListA; i++) {
                tabOpenedMenuLists.style.width = `${this.tabWidth}px`;
                tabOpenedMenuListsTabListA[i].style.left = `-${left}px`;
              }
              _this.$refs.tabList.scrollTo({ right: `${val.length - length}`, behavior: 'smooth' });
            } else {
              this.clickShow = false;
              for (i = 0; i < TabListA; i++) {
                tabOpenedMenuListsTabListA[i].style.left = '0px';
              }
            }
          });
        },
      },
    },
    methods: {
      switchTab(item, index) {
        const tag = this.openedMenuLists[index];
        this.$store.commit('global/switchActiveTab', tag);
        router.push({ path: tag.routeFullPath });
      },
      handleClose(tag) {
        const self = this;
        this.removeKeepAlivePages(tag);
        self.$store.commit('global/TabCloseAppoint', tag);
      }, // 关闭当前tab
      removeKeepAlivePages(path) { 
        this.$store.commit('global/selectKeepAliveList', path);
      },
      emptyClick() {
        this.clickshow = false;
        this.$store.commit('global/emptyTabs');
      },

      prevClick() {
        let i = 0;
        const domAll = this.$refs.tabBox;
        const domAllLength = domAll.length;
        for (i = 0; i < domAllLength; i++) {
          const tabBoxRight = Number(domAll[i].style.left.replace('px', '').replace('-', '')) - 122;
          if (tabBoxRight < 0) {
            domAll[i].style.left = '0px';
          } else {
            domAll[i].style.left = `-${tabBoxRight}px`;
          }
        }
      },
      nextClick() {
        let i = 0;
        const domAll = this.$refs.tabBox;
        const domWidth = this.$refs.tabList.offsetWidth;
        const tabWidth = this.openedMenuLists.length * 122;
        const domAllLength = domAll.length;
        for (i = 0; i < domAllLength; i++) {
          const tabBoxLeft = Number(domAll[i].style.left.replace('px', '').replace('-', '')) + 122;
          if (tabBoxLeft >= (tabWidth - domWidth)) {
            domAll[i].style.left = `-${tabWidth - domWidth}px`;
          } else {
            domAll[i].style.left = `-${tabBoxLeft}px`;
          }
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
  >span{
    display: inline-block;
    width: 20px;
    height: 33px;
    margin: 0;
    box-sizing: border-box;
    vertical-align: middle;
    text-align: center;
    line-height: 33px;
    background-color: white;
    z-index: 22;
    position: relative;
    cursor: pointer;
    .next{
       border-left: 1px solid #dfdfdf;
    }
    .prev{
      border-right: 1px solid #dfdfdf;
    }
  }
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
          opacity: 0;
          color: #000000;
          text-align: center;
          cursor: pointer;
          font-size: 12px;
          height: 16px;
          width: 16px;
          >img{
            position: relative;
            left: -2px;
            top: -2px;
            width: 19px;
          }
        }
        .close:hover{
              opacity: 1;
              background-color: #d4d4d4;
              color: #000000;
            }
        } 
    }
    
  } 
  >a{
    color: black;
    width: 34px;
    height: 33px;
    border-left: 1px solid #dfdfdf;
    text-align: center;
    line-height: 44px;
    text-decoration: none;
    .emptying{
    width: 35px;
    height: 33px;
    display: inline-block;
    img{
      width: 17px;
       height: 20px;
    }
  }
  }
}
</style>

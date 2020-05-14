<template>
  <div
    v-if="openedMenuLists.length > 0 && showModule.TabLists"
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
        alt
        @click="prevClick"
      >
    </span>
    
    <ul
      ref="tabList"
      class="tab-list"
    >
      <a
        v-for="(tag, index) in getOpenedMenuLists"
        :key="index"
        ref="tabBox"
        v-dragging="{ item: tag, list:getOpenedMenuLists,group: 'color'}"
        class="tabBox"
        :title="tag.label"
        @click="switchTab(tag,index)"
      >
        <span
          :class="{active:tag.isActive === true}"
          class="openedMenuListsItem"
          :title="tag.label"
        >
          {{ tag.label }}
          <span
            class="close"
            @click.stop="handleClose(tag,index)"
          >
            <img
              src="../assets/image/iconX.png"
              alt
            >
          </span>
        </span>
      </a>
    </ul>
    <span
      v-show="clickShow"
      class="next"
      @click="nextClick"
    >
      <img
        src="../assets/image/rightArrow.png"
        alt
      >
    </span>
    <span
      class="emptying"
      @click="emptyClick"
    >
      <i
        class="iconfont iconbj_delete "
        style="color:#ff6049"
      />
      <!-- <img
        src="../assets/image/delete.png"
        alt
      > -->
    </span>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';

  import router from '../__config__/router.config';

  export default {
    name: 'TabLists',
    data() {
      return {
        clickShow: true,
        tagIndex: 0,
        getOpenedMenuLists: []
      };
    },
    mounted() {
      if (!this._inactive && this._inactive !== null) {
        this.$dragging.$on('dragged', ({ value }) => { // 更新MenuList
          this.updataOpenedMenuLists(value.list);
        });
      }
      this.getOpenedMenuLists = JSON.parse(JSON.stringify(this.openedMenuLists));
    },
    computed: {
      ...mapState('global', {
        openedMenuLists: ({ openedMenuLists }) => openedMenuLists,
        showModule: ({ showModule }) => showModule
      }),
      menuLists() {
        const openedMenuListsLength = this.openedMenuLists.length;
        return openedMenuListsLength;
      },
    },
    watch: {
      menuLists: {
        handler(val) {
          this.$nextTick(() => {
            const tabOpenedMenuLists = this.$refs.openedMenuLists;
            if (tabOpenedMenuLists) {
              const length = Math.floor(
                (tabOpenedMenuLists.offsetWidth - 75) / 122
              );
              const width = tabOpenedMenuLists.offsetWidth - 75;
              const tagWidth = this.menuLists * 122;
              const left = Math.abs(tagWidth - width);
              if (val > length) {
                this.clickShow = true;
                this.$refs.tabBox.forEach((item) => {
                  item.style.left = `-${left}px`;
                });
              } else {
                this.clickShow = false;
                this.$refs.tabBox.forEach((item) => {
                  item.style.left = '0px';
                });
              }
            }
          });
        }
      },
      openedMenuLists: {
        handler(val) {
          this.getOpenedMenuLists = JSON.parse(JSON.stringify(val));
        },
        deep: true
      },
    },
    methods: {
      ...mapMutations('global', [
        'tabCloseAppoint',
        'addExcludedComponents',
        'emptyTabs',
        'switchTabForActiveTab',
        'updataOpenedMenuLists'
      ]),
      switchTab(item, index) {
        const tag = this.openedMenuLists[index];
        if (router.currentRoute.fullPath !== tag.routeFullPath) {
          router.push({ path: tag.routeFullPath });
          this.switchTabForActiveTab(item);
        }
      },
      handleClose(tag) {
        this.tabCloseAppoint(tag);
      }, // 关闭当前tab
      emptyClick() {
        this.clickshow = false;
        this.emptyTabs();
      },

      prevClick() {
        this.$refs.tabBox.forEach((item) => {
          const tabBoxRight = Number(item.style.left.replace('px', '').replace('-', '')) - 122;
          if (tabBoxRight < 0) {
            item.style.left = '0px';
          } else {
            item.style.left = `-${tabBoxRight}px`;
          }
        });
      },
      nextClick() {
        const tabBoxs = this.$refs.tabBox;
        const domWidth = this.$refs.tabList.offsetWidth;
        const tabWidth = this.openedMenuLists.length * 122;
        tabBoxs.forEach((item) => {
          const tabBoxLeft = Number(item.style.left.replace('px', '').replace('-', '')) + 122;
          if (tabBoxLeft >= tabWidth - domWidth) {
            item.style.left = `-${tabWidth - domWidth}px`;
          } else {
            item.style.left = `-${tabBoxLeft}px`;
          }
        });
      }
    }
  };
</script>

<style scoped lang="less">
.active {
  border-top: 2px solid #fd6442 !important;
  border-bottom: 2px solid white !important;
  color: #fd6442 !important;
}
.openedMenuLists {
  background-color: #fff;
  display: flex;
  box-sizing: border-box;
  height: 33px;
    border-bottom: 1px solid #dfdfdf;

  > span {
    display: inline-block;
    width: 20px;
    height: 100%;
    margin: 0;
    box-sizing: border-box;
    vertical-align: middle;
    text-align: center;
    line-height: 33px;
    background-color: white;
    z-index: 22;
    position: relative;
    cursor: pointer;
    .next {
      border-left: 1px solid #dfdfdf;
    }
    .prev {
      border-right: 1px solid #dfdfdf;
    }
  }

  .tab-list {
    margin: 0px;
    padding: 0;
    display: inline-block;
    flex: 1;
    position: relative;
    z-index: 0;
    display: flex;
    overflow: hidden;
    user-select: none;
    height: 34px;
    a {
      display: inline-block;
      text-decoration: none;
      position: relative;
      cursor: pointer;
      color: #000;

      .openedMenuListsItem {
        height: 29px;
        width: 81px;
        display: block;
        padding-left: 20px;
        padding-right: 20px;
        line-height: 31px;
        background-color: #fff;
        box-sizing: content-box;
        text-align: center;
        border: none;
        border-top: 2px solid #fff;
        border-right: 1px solid #dfdfdf;
        border-radius: 0;
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        // border-bottom: 1px solid #dfdfdf;
        margin: 0;
        .close {
          position: absolute !important;
          top: 7px !important;
          right: 2px !important;
          line-height: 16px;
          border-radius: 2px;
          opacity: 0;
          color: #000000;
          text-align: center;
          cursor: pointer;
          font-size: 12px;
          height: 16px;
          width: 16px;
          > img {
            position: relative;
            left: -2px;
            top: -2px;
            width: 19px;
          }
        }
        .close:hover {
          opacity: 1;
          background-color: #d4d4d4;
          color: #000000;
        }
      }
    }
    .tabBox:hover {
      .close {
        opacity: 1;
        color: #000000;
      }
    }
  }

  .emptying {
    width: 34px;
    border-left: 1px solid #dfdfdf;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 17px;
      height: 20px;
    }
  }
  .emptying:hover {
    opacity: 0.6;
  }
}
</style>

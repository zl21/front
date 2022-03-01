<template>
  <div
    v-if="openedMenuLists.length > 0 && showModule.TabLists"
    ref="openedMenuLists"
    :class="classes"
  >
    <Tabs type="card" class="openedMenuListsItem" 
         closable 
        @on-click="switchTab" 
        @on-drag-drop="handleDragDrop"
        :title="true"
        ref="tabs"
        :closedClick="handleClose"
        draggable
        :value="tagIndex">
        <TabPane  v-for="(tag, index) in openedMenuLists" 
        ref="tabBox"
        class="tabBox"
        :id="`${tag.tableName}_TAB`"
        :key="index" :label="tag.label" :name="index.toString()" ></TabPane>
        <span
          class="emptying"
           slot="extra"
          @click="emptyClick"
        >
          <i
            class="iconfont iconbj_delete "
            :title="$t('messages.closeBills')"
          />
          <!-- <img
            src="../assets/image/delete.png"
            alt
          > -->
        </span>
    </Tabs>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import { classFix } from '../constants/global';
  import {DispatchEvent,R3_TAB_CLOSE} from '../__utils__/dispatchEvent'

  // importwindow.vm.$router.from '../__config__/router.config';

  export default {
    name: 'TabLists',
    data() {
      return {
        clickShow: true,
        tagIndex: 0,
        // getOpenedMenuLists: []
      };
    },
    mounted() {
      // if (!this._inactive && this._inactive !== null) {
      //   this.$dragging.$on('dragged', ({ value }) => { // 更新MenuList
      //     this.updataOpenedMenuLists(value.list);
      //   });
      // }
      // this.getOpenedMenuLists = JSON.parse(JSON.stringify(this.openedMenuLists));
    },
    computed: {
      ...mapState('global', {
        openedMenuLists: ({ openedMenuLists }) => openedMenuLists,
        activeTab: ({ activeTab }) => activeTab,
        showModule: ({ showModule }) => showModule
      }),
      menuLists() {
        const openedMenuListsLength = this.openedMenuLists.length;
        return openedMenuListsLength;
      },
      classes() {
        return [
          `${classFix}openedMenuLists`,
        ];
      },
    },
    watch: {
      openedMenuLists:{
        handler(val) {
          if(Number(this.tagIndex) === val.length){
             this.setTagIndex(this.activeTab)
          }
        }
      },
      activeTab:{
        handler(val) {
          this.setTagIndex(val)
         
        }
      }
      // menuLists: {
      //   handler(val) {
      //     this.$nextTick(() => {
      //       const tabOpenedMenuLists = this.$refs.openedMenuLists;
      //       if (tabOpenedMenuLists) {
      //         const length = Math.floor(
      //           (tabOpenedMenuLists.offsetWidth - 75) / 122
      //         );
      //         const width = tabOpenedMenuLists.offsetWidth - 75;
      //         const tagWidth = this.menuLists * 122;
      //         const left = Math.abs(tagWidth - width);
      //         console.log(val , length,'-=--');

      //         if (val > length) {
      //           this.clickShow = true;
      //           this.$refs.tabBox.forEach((item) => {
      //             item.style.left = `-${left}px`;
      //           });
      //         } else {
      //           this.clickShow = false;
      //           this.$refs.tabBox.forEach((item) => {
      //             item.style.left = '0px';
      //           });
      //         }
      //       }
      //     });
      //   }
      // },
      // openedMenuLists: {
      //   handler(val) {
      //     this.getOpenedMenuLists = JSON.parse(JSON.stringify(val));
      //   },
      //   deep: true
      // },
    },
    methods: {
      ...mapMutations('global', [
        'tabCloseAppoint',
        'addExcludedComponents',
        'emptyTabs',
        'switchTabForActiveTab',
        'updataOpenedMenuLists',
        'updataSwitchTag'
      ]),
      setTagIndex(val){
         this.tagIndex =  this.openedMenuLists.findIndex((x)=>{
              return x.keepAliveModuleName === val.keepAliveModuleName;
          });
          this.tagIndex = this.tagIndex.toString();
          setTimeout(()=>{
              if(this.openedMenuLists.length === Number(this.tagIndex)+1 && this.$refs.tabs){
                this.$refs.tabs.scrollNext();
              }
          },200)

      },
      switchTab(index) {
        const tag = this.openedMenuLists[index];
        if (this.$router.currentRoute.fullPath !== tag.routeFullPath) {
          this.updataSwitchTag(true);
         window.vm.$router.push({ path: tag.routeFullPath });
          this.switchTabForActiveTab(tag);
          // this.updataSwitchTag(false);
        }
      },
      // 拖拽排序
      handleDragDrop(name1, name2, fromIndex, toIndex) {
        const activeTab = this.openedMenuLists[this.tagIndex]
        const list = [... this.openedMenuLists]
        const temp = list[fromIndex]
        list.splice(fromIndex, 1)
        list.splice(toIndex, 0, temp)
        this.updataOpenedMenuLists(list)

        this.switchTabForActiveTab(activeTab)
      },
      handleClose(index) {
       const tag = this.openedMenuLists[index];
        this.tabCloseAppoint(tag);
        DispatchEvent(R3_TAB_CLOSE, {
          detail: {
            index,
            ...tag
          }
        })
      }, // 关闭当前tab
      emptyClick() {
        this.clickshow = false;
        if(this.openedMenuLists.length>50){
         window.vm.$router.push('/');
           window.location.reload();
        }else{
          this.emptyTabs();
        }
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


<template>
  <div
    :class="searchBtn ? 'tag right' :'tag tag-search right' "
  >
    <template v-if="searchBtn === false">
      <AutoComplete
        ref="AutoComplete"
        v-model="keyWord"
        class="nav-search"
        icon="ios-search"
        placeholder="请输入要查询的功能名"
        @on-click="searchBtn = true"
        @on-keydown="enter"
        @on-change="searchData"
      >
        <div
          v-if="loading"
          style="min-height:30px"
        >
          <Spin
            fix
          >
            <Icon
              type="ios-loading"
              size="18"
              class="demo-spin-icon-load"
            ></Icon>
          </Spin>
        </div>

        <div
          v-if="searchList.length<1 && keyWord && keyWord.length>0 && !loading"
          class="none-search"
        >
          抱歉，没有此功能!
        </div>
        <Option
          v-for="(item,index) in searchList"
          :key="index"
          :value="index"
          :lable="item.desc"
          @on-select-selected="routerNext"
        >
          {{ item.desc }}
        </Option>
      </AutoComplete>
    </template>

    <span
      v-if="searchBtn === true"
      class="buttonIcon"
      @click="searchBtn = false"
    >
      <i
        title="查询功能名"
        class="iconfont iconmd-search"
      />
    </span>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex';
  import closedImg from '../assets/image/closed@2x.png';
  import openedImg from '../assets/image/open@2x.png';
  import logoImg from '../assets/image/logo.png';
  import bannerImg from '../assets/image/banner.png';
  import { routeTo } from '../__config__/event.config';
  import network, { urlSearchParams } from '../__utils__/network';
  import { STANDARD_TABLE_LIST_PREFIX, Version } from '../constants/global';
  import { updateSessionObject } from '../__utils__/sessionStorage';


  export default {
    name: 'ComAutoComplete',
    components: {

    },

    data() {
      return {
        // primaryMenuShow: false,
        imgSrc: {
          closedImg,
          openedImg,
          logoImg,
          bannerImg,
        },
        show: false,
        searchBtn: true,
        searchList: [],
        setPanel: {
          show: true,
          list: [],
        },
        keyWord: '',
        loading: false,
        dialogConfig: {
          title: '提示',
          mask: true,
          footerHide: false,
          contentText: '',
          confirm: () => {
          },
        }, // 弹框配置信息
        dialogComponentName: null,
        togglePrimaryMenuData: [],
        messageTimer: null
      };
    },
    watch: {
      searchBtn(val) {
        if (val === false) {
          setTimeout(() => {
            this.$refs.AutoComplete && this.$refs.AutoComplete.$el.querySelector('input').focus();
            // this.$refs.AutoComplete.$el.querySelector('input').click();
          }, 300);
        }
      },
      searchList() {
        this.$refs.AutoComplete.$el.querySelector('input').click();
      }
    },
    methods: {
      ...mapActions('global', ['getTaskMessageCount', 'updataTaskMessageCount']),
      ...mapMutations('global', ['updateTaskMessageCount', 'doCollapseHistoryAndFavorite', 'changeSelectedPrimaryMenu', 'hideMenu', 'tabOpen', 'directionalRouter','updateDashboardPageValue']),
      enter(event) {
        if (event.keyCode === 13) {
          let index = 0;
          if (this.$refs.AutoComplete.$refs.select.focusIndex !== -1) {
            index = this.$refs.AutoComplete.$refs.select.focusIndex;
          } else {
            index = 0;
          }
          const routerItem = this.searchList[index];

          if (routerItem) {
            this.routeTonext(routerItem);
          }
        }
      },
      routeTonext(data) {
        const {
          name, url, type, tabid, actid
        } = data;
        let tableId = '';
        if (type === 'table') {
          tableId = tabid;
        } else {
          tableId = actid;
        }
        // window.sessionStorage.setItem('dynamicRoutingForHideBackButton', true);
        // window.sessionStorage.setItem('dynamicRouting', true); // 需要注释下掉这行-> fix:在单对象界面，点击搜索结果去另一张表后，再回单对象界面点返回，此时单对象标签消失了
        if (url) {
          const menuType = url.substring(url.lastIndexOf('/') + 1, url.length);
          if (menuType === 'New') {
            const modifyPageUrl = url.substring(0, Number(url.length) - 3);
            const clickMenuAddSingleObjectData = {
              k: `/${url}`,
              v: modifyPageUrl
            };
            updateSessionObject('clickMenuAddSingleObject', clickMenuAddSingleObjectData);
            // 关闭
          }
         this.updateDashboardPageValue(false);

        }
        routeTo({ type, info: { tableName: name, tableId, url } }, () => {
          this.keyWord = '';
          this.updateDashboardPageValue(false);
          setTimeout(() => {
            this.searchList = [];
          }, 100);
        });
        // }
      },
      searchData(value) {
        this.searchList = [];
        if (value === undefined || value.length < 1) {
          return;
        }
        const values = this.$refs.AutoComplete.$el.querySelector('input').value;
        if (values !== value) {
          return;
        }
        this.loading = true;
        network
          .post(
            '/p/cs/SearchWords',
            urlSearchParams({
              words: value,
            })
          )
          .then((r) => {
            this.loading = false;
            if (r.status === 200 && r.data.code === 0) {
              const data = r.data.data || r.data.datas;
              this.searchList = data;
            }
          });
      },
      setBtn() {
      },
      routerNext(name) {
        const index = name.value;
        const routerItem = this.searchList[index];
        if (routerItem) {
          this.routeTonext(routerItem);
        }
        //
      },

    },
    mounted() {

    },
    beforeDestroy() {
    }
  };
</script>

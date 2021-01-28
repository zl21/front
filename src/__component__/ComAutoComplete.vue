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
            this.$refs.AutoComplete.$el.querySelector('input').focus();
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
      ...mapMutations('global', ['updateTaskMessageCount', 'doCollapseHistoryAndFavorite', 'changeSelectedPrimaryMenu', 'hideMenu', 'tabOpen', 'directionalRouter']),
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
          }
        }
        routeTo({ type, info: { tableName: name, tableId, url } }, () => {
          this.keyWord = '';
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
        network
          .post(
            '/p/cs/SearchWords',
            urlSearchParams({
              words: value,
            })
          )
          .then((r) => {
            if (r.status === 200 && r.data.code === 0) {
              this.searchList = r.data.data || r.data.datas;
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

<style lang="less">
  .ark-drawer-content {
    //重置arkUI样式
    border-top-left-radius: 0px !important;
    border-top-right-radius: 0px !important;
  }
  
  .ark-drawer-body {
    //重置arkUI样式
    padding: 0px !important;
  }
  
  .navigator {
    height: 100%;
    display: flex;
    background-color: #1f272c;
     a{
          color:white
        }
      .badge{
        width: 42px;
        height: 42px;
        // background: #eee;
        border-radius: 6px;
        display: inline-block;
       
       
    }
    .left {
      img.trigger {
        height: 50px;
      }
      
      img.logo {
        position: absolute;
        width: 30px;
        top: 10px;
        left: 18px;
      }
      
      img.banner {
        width: 76px;
        height: 30px;
        position: absolute;
        top: 11px;
        left: 64px;
      }
      
      img:hover {
        cursor: pointer;
      }
    }
    
    .middle {
      margin-left: 10px;
      position: relative;
      display: flex;
      flex: 1 1 1px;
      overflow: auto;
    }
     .middle::-webkit-scrollbar {
        display: none;
    }
   .buttonIcon{
     width:100%;
     height:100%;
     display: inline-block;
   } 
    .nav-search {
      input {
        display: inline-block;
        width: 100%;
        padding: 0 8px;
        border: solid 1px #fff;
        border-radius: 15px;
        background: #4f5356;
        height: 28px;
        line-height: 28px;
        color: #fff;
        font-size: 13px;
        transition: all 0.25s;

        &:hover{
            font-size: 12px;
            padding: 0px 14px;
            transition: all 0.25s;
        }
      }
      
      i {
        color: #c0c4cc;
        padding-top: 2px;
      }
    }
    
    .tag {
      width: 50px;
      float: left;
      font-size: 24px;
      text-align: center;
      line-height: 50px;
      cursor: pointer;
      color: #fff;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      
      i {
        font-size: 22px;
      }
      
      .ark-badge-count{
        top: 2px;
      }
    }
    
    .tag-search {
      width: 192px;
      line-height: 40px;
      .ark-select{
          text-align: left;
      }
    }
    
    .tag:hover {
      background: #2e373c;
    }
  }
  
  .Poptip-nav {
    ul {
      li {
        &:hover {
          background: #f4f4f4;
        }
        
        padding: 0 20px;
        text-align: left;
        margin: 0;
        line-height: 34px;
        cursor: pointer;
        color: #606266;
        font-size: 14px;
        list-style: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
</style>

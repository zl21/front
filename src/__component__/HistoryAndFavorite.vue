<template>
  <div
    v-if="isShow"
    class="history-and-favorite"
    :style="{ width: collapseHistoryAndFavorite ? '50px' : '180px' }"
  >
    <div class="history-favorite-container">
      <div
        class="favorite"
        @mouseenter="onMouseOverFavoriteSeen"
        @mouseleave="onMoueOutFavoriteSeen"
      >
        <div
          class="label"
          :class="{ collapse: collapseHistoryAndFavorite }"
          @click="collapseFavorite = !collapseFavorite"
        >
          <i
            class="iconfont iconbj_col left-icon"
          />
          <span v-if="!collapseHistoryAndFavorite">
            收藏夹
            <i
              v-if="!collapseFavorite"
              class="iconfont iconios-arrow-up arrow-icon"
            />
            <i
              v-if="collapseFavorite"
              class="iconfont iconios-arrow-down arrow-icon"
            />
          </span>
        </div>
        <transition>
          <ul
            v-if="!collapseFavorite && !collapseHistoryAndFavorite ||favoriteSeen"
            :class="{'onMouseOverShow':favoriteSeen}"
          >
            <li
              v-for="(d, i) in favorite"
              :key="`favorite-${i}`"
              :title="d.label "
              @click="routeTo(d)"
            >
              {{ d.label }}
            </li>
          </ul>
        </transition>
      </div>
      <div
        class="history"
        @mouseenter="onMouseOverHistorySeen"
        @mouseleave="onMoueOuthHistorySeen"
      >
        <div
          class="label"
          :class="{ collapse: collapseHistoryAndFavorite }"
          @click="collapseHistory = !collapseHistory"
        >
          <i
            class="iconfont iconbj_record left-icon"
          />
          <span v-if="!collapseHistoryAndFavorite">
            最近使用
           
            <i
              v-if="!collapseHistory"
              class="iconfont iconios-arrow-up arrow-icon"
            />
            <i
              v-if="collapseHistory"
              class="iconfont iconios-arrow-down arrow-icon"
            />
          </span>
        </div>
        <transition>
          <ul
            v-if="!collapseHistory && !collapseHistoryAndFavorite || historySeen"
            :class="{'onMouseOverShow': historySeen}"
          >
            <li
              v-for="(d, i) in history"
              :key="`history-${i}`"
              :title="d.label "
              @click="routeTo(d)"
            >
              {{ d.label }}
            </li>
          </ul>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions,mapMutations } from 'vuex';
  import { routeTo } from '../__config__/event.config';
  import { enableHistoryAndFavoriteUI, enableHistoryAndFavorite } from '../constants/global';
  

  export default {
    name: 'HistoryAndFavorite',
    data() {
      return {
        collapseHistory: false,
        collapseFavorite: false,
        historySeen: false,
        favoriteSeen: false

      };
    },
    computed: {
      ...mapState('global', {
        collapseHistoryAndFavorite: ({ collapseHistoryAndFavorite }) => collapseHistoryAndFavorite,
        history: ({ history }) => history.concat([]).reverse(),
        favorite: ({ favorite }) => favorite.concat([]).reverse(),
        showModule: ({ showModule }) => showModule,
      }),
      isShow() {
        if (enableHistoryAndFavoriteUI() === false) {
          return enableHistoryAndFavoriteUI();
        }
        return this.showModule.HistoryAndFavorite;
      }
    },
    methods: {
      ...mapActions('global', ['getHistoryAndFavorite','updateDashboardPageValue']),
      ...mapMutations('global', ['updateDashboardPageValue']),
      onMouseOverHistorySeen() {
        if (this.collapseHistoryAndFavorite) {
          this.historySeen = true;
        }
      },
      onMouseOverFavoriteSeen() {
        if (this.collapseHistoryAndFavorite) {
          this.favoriteSeen = true;
        }
      },
      onMoueOutFavoriteSeen() {
        if (this.collapseHistoryAndFavorite) {
          this.favoriteSeen = false;
        }
      },
      onMoueOuthHistorySeen() {
        if (this.collapseHistoryAndFavorite) {
          this.historySeen = false;
        }
      },
      routeTo(data) {
        const {
          type
        } = data;
        const { value, id, url } = data;
        this.updateDashboardPageValue(false);
        routeTo({ type, info: { tableName: value, tableId: id, url } });
      },
    },
    mounted() {
      this.getHistoryAndFavorite();
    }
  };
</script>

<style scoped lang="less">
  .history-and-favorite {
    user-select: none;
    
    .history-favorite-container {
      height: 100%;
      background-color: #fff;
    }
    
    height: 100%;
    padding: 10px 0 10px 10px;
    display: flex;
    flex-direction: column;
    
    .favorite, .history {
      label:hover, li:hover {
        cursor: pointer;
      }
      div.label.collapse {
        padding: 0 12px;
      }
      div.label {
        position: relative;
        color: #101417;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        background-color: #fff;
        border-bottom: 1px solid #f1f1f1;
        padding: 0 20px 0 26px;
        i.left-icon {
          margin-right: 8px;
        }
        
        i.arrow-icon {
          position: absolute;
          top: 0;
          right: 20px;
        }
      }
      
      div.label:hover {
        background-color: #f1f1f1;
      }
      .onMouseOverShow{
        width: 165px;
        position: fixed;
        left: 60px;
        background: white;
        top: 60px;
        z-index: 1000;
        padding-left:0;
        border-radius: 2px;
       box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        li{
        padding:15px 50px;
        line-height: 1px;
           
        }
        li:hover{
          background-color: #ecf5ff;
            color: #66b1ff;
        }
      }

      ul {
        padding-left: 20px;
        overflow: hidden;
        li {
          list-style: none;
          color: #101417;
          height: 30px;
          line-height: 30px;
          font-size: 13px;
          padding-left: 26px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        li:hover {
          background-color: #f1f1f1;
        }
      }
    }
  }
</style>

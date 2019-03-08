<template>
  <div
    class="history-and-favorite"
    :style="{ width: collapseHistoryAndFavorite ? '50px' : '180px' }"
  >
    <div class="history-favorite-container">
      <div class="favorite">
        <div
          class="label"
          :class="{ collapse: collapseHistoryAndFavorite }"
          @click="collapseFavorite = !collapseFavorite"
        >
          <i class="iconfont icon-liebiao-shoucang left-icon" />
          <span v-if="!collapseHistoryAndFavorite">
            收藏夹
            <i
              v-if="!collapseFavorite"
              class="iconfont icon-xiajiantou arrow-icon"
            />
            <i
              v-if="collapseFavorite"
              class="iconfont icon-shangjiantou arrow-icon"
            />
          </span>
        </div>
        <transition name="fade">
          <ul v-if="!collapseFavorite && !collapseHistoryAndFavorite">
            <li
              v-for="(d, i) in favorite"
              :key="`favorite-${i}`"
              @click="routeTo(d)"
            >
              {{ d.label }}
            </li>
          </ul>
        </transition>
      </div>
      <div class="history">
        <div
          class="label"
          :class="{ collapse: collapseHistoryAndFavorite }"
          @click="collapseHistory = !collapseHistory"
        >
          <i class="iconfont icon-record left-icon" />
          <span v-if="!collapseHistoryAndFavorite">
            最近使用
            <i
              v-if="!collapseHistory"
              class="iconfont icon-xiajiantou arrow-icon"
            />
            <i
              v-if="collapseHistory"
              class="iconfont icon-shangjiantou arrow-icon"
            />
          </span>
        </div>
        <transition name="fade">
          <ul v-if="!collapseHistory && !collapseHistoryAndFavorite">
            <li
              v-for="(d, i) in history"
              :key="`history-${i}`"
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
  import { mapState, mapActions } from 'vuex';
  import { routeTo } from '../__config__/event.config';
  
  export default {
    name: 'HistoryAndFavorite',
    data() {
      return {
        collapseHistory: false,
        collapseFavorite: false
      };
    },
    computed: {
      ...mapState('global', {
        collapseHistoryAndFavorite: ({ collapseHistoryAndFavorite }) => collapseHistoryAndFavorite,
        history: ({ history }) => history.concat([]).reverse(),
        favorite: ({ favorite }) => favorite.concat([]).reverse()
      })
    },
    methods: {
      ...mapActions('global', ['getHistoryAndFavorite']),
      routeTo(data) {
        const { type, value, id } = data;
        routeTo({ type, info: { tableName: value, tableId: id } });
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
        }
        
        li:hover {
          background-color: #f1f1f1;
        }
      }
    }
  }
</style>

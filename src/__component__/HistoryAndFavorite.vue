<template>
  <div
    v-if="isShow"
    :class="classes"
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
  import { mapState, mapActions } from 'vuex';
  import { routeTo } from '../__config__/event.config';
  import { enableHistoryAndFavoriteUI, enableHistoryAndFavorite, classFix } from '../constants/global';


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
      },
      classes () {
        return [
          `${classFix}history-and-favorite`,
        ];
      }
    },
    methods: {
      ...mapActions('global', ['getHistoryAndFavorite']),
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
        routeTo({ type, info: { tableName: value, tableId: id, url } });
      },
    },
    mounted() {
      this.getHistoryAndFavorite();
    }
  };
</script>

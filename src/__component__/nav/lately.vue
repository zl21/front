<template>
 
    <div
        class="tag history"
        @mouseenter="onMouseOverHistorySeen"
        @mouseleave="onMoueOuthHistorySeen"
      >
        <Dropdown @on-click="routeTo">
          <slot>
            <i
              class="iconfont iconmd-time"
            />
          </slot>
        <DropdownMenu slot="list" trigger="click"   v-if="history.length>0" >
            <DropdownItem  
               v-for="(d, i) in history"
              :key="`history-${i}`"
              :title="d.label "
              :name="d"
              placement="bottom-end"
              @click="routeTo(d)">
                 {{ d.label }}
              </DropdownItem>
        </DropdownMenu>
        <DropdownMenu  v-if="history.length===0"
                  slot="list"
                  >
                  <DropdownItem>
                    暂无历史记录
                  </DropdownItem>  
          </DropdownMenu>
       </Dropdown>
      </div>
</template>

<script>
  import { mapState, mapActions,mapMutations } from 'vuex';
  import { routeTo } from '../../__config__/event.config';
  import { enableHistoryAndFavoriteUI, enableHistoryAndFavorite, classFix } from '../../constants/global';


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
      classes() {
        return [
          `${classFix}history-and-favorite tag`,
        ];
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
        
        if(document.querySelector('.NaVertical')){
           if(this.$parent && this.$parent.$parent){
            this.$parent.$parent.$parent.currentVisible = false;
            this.$parent.$parent.$parent.$forceUpdate();
          }
        }
        
      },
    },
    mounted() {
      this.getHistoryAndFavorite();
    }
  };
</script>
<style lang="scss" scoped>
.ark-dropdown-menu{
  max-width: 150px;
  overflow-x: auto;
}
</style>

<template>
  <div class="history-and-favorite" style="width: 180px;">
    <div class="history-favorite-container">
      <div class="favorite">
        <div class="label">收藏夹</div>
        <ul>
          <li v-for="(d, i) in favorite" :key="`favorite-${i}`">
            {{ d.label }}
          </li>
        </ul>
      </div>
      <div class="history">
        <div class="label">最近使用</div>
        <ul>
          <li v-for="(d, i) in history" :key="`history-${i}`">
            {{ d.label }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import network from '../__utils__/network';
  
  export default {
    name: 'HistoryAndFavorite',
    data() {
      return {
        favorite: [],
        history: []
      };
    },
    mounted() {
      network.post('p/cs/getHistoryAndFavorite').then((res) => {
        const { history, favorite } = res.data.data;
        this.history = history;
        this.favorite = favorite;
      });
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
      div.label {
        color: #101417;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        background-color: #fff;
        padding-left: 26px;
        border-bottom: 1px solid #f1f1f1;
      }
      div.label:hover {
        background-color: #f1f1f1;
      }
      ul {
        padding-left: 20px;
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

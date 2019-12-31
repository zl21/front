<template>
  <div class="searchFormContainer">
    <DownComponent
      :search-foldnum="searchFoldnum"
      :set-height="setHeight"
      :row-all="rowAll"
      @on-toggle="toggle"
    >
      <FormLayout
        slot="dwonContent"
        ref="FormLayout"
        class="formLayout"
        :default-column="defaultColumn"
        :defaultconfig="defaultconfig"
      />
    </DownComponent>
  </div>
</template>

<script>
  import DownComponent from '../DownComponent';

  export default {
    data() {
      return {};
    },
    name: 'SearchForm',
    components: {
      DownComponent
    },
    watch: {},
    computed: {},
    props: {
      setHeight: {
        type: Number,
        default() {
          return 0;
        }
      }, // 默认行高
      rowAll: {
        type: [Number, String],
        default() {
          return 0;
        }
      }, // 总共几行
      searchFoldnum: {
        type: [Number, String],
        default() {
          return 0;
        }
      }, // 默认展示几行
      defaultColumn: {
        //   form默认展示列
        type: Number,
        default: 4
      },
      defaultconfig: {
        //   form默认配置
        type: Array,
        default() {
          return [];
        }
      }
    },
    methods: {
      verifyMessage() {
        return this.$refs.FormLayout.verifyMessage();
      },
      toggle(value) {
        console.log(value);
      }
    }
  };
</script>

<style lang="less">
    .searchFormContainer {
        .formLayout {
            margin-top: 10px;
        }
    }
</style>

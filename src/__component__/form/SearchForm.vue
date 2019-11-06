<template>
    <div class="searchFormContainer">
        <DownComponent :searchFoldnum="searchFoldnum" :setHeight="setHeight" :rowAll="rowAll">
            <FormLayout slot="dwonContent" class="formLayout"
                        :defaultColumn="defaultColumn"
                        :defaultconfig="defaultconfig" ref="FormLayout"></FormLayout>
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

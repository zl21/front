<template>
  <div class="StandardTableListRootDiv">
    <FormItemComponent
      :form-item-lists="lists"
      :default-column="4"
    />
    <AgTable
      ref="agTableElement"
      :page-attribute="pageAttribute"
      :datas="ag.datas"
      :on-page-change="onPageChange"
      :on-page-size-change="onPageSizeChange"
    />
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import router from '../__config__/router.config';
  import AgTable from './StandardTable';
  import FormItemComponent from './FormItemComponent';
  import itemComponent from './itemComponent';
  import { STANDARD_TABLE_COMPONENT_PREFIX } from '../constants/global';

  const getComponentName = () => {
    const { tableName, tableId } = router.currentRoute.params;
    return `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
  };

  export default {
    components: {
      AgTable, FormItemComponent
    },
    computed: {
      ag() {
        return this.$store.state[getComponentName()].ag;
      },
      pageAttribute() {
        const ag = this.$store.state[getComponentName()].ag;
        return {
          current: (ag.datas.start + ag.datas.defaultrange) / ag.datas.defaultrange,
          total: ag.datas.totalRowCount,
          'page-size-opts': ag.datas.selectrange,
          'show-elevator': true,
          'show-sizer': true,
          'show-total': true
        };
      }
    },
    data() {
      return {
        moduleStateKey: getComponentName(),
        searchData: {
          table: this.$route.params.tableName,
          startIndex: 0,
          range: 10
        },
        lists: [
          {
            row: 1,
            col: 1,
            component: itemComponent,
            item: {
              // item 类型
              type: 'input', // 必填!
              // label名称
              title: '商品名称', // 必填!
              // 字段名称
              field: 'goods_name', // 必填!
              // input值
              value: '1',
              props: {
              },
              event: {
                change: (event, $this) => {
                  console.log(event, $this);
                },
              },
              validate: // 校验规则  默认onchage
                {
                  // 动态计算key
                  dynamicforcompute: {
                    // 逻辑运算key
                    refcolumns: ['is_postage', 'cate_id'],
                    // 被计算字段（目标）
                    computecolumn: 'goods_name',
                    // 中间函数
                    express: 'is_postage + cate_id'
                  },
                  // 提示信息
                  tip: '',
                  // 触发方法
                  trigger: ''
                }
            }


          },
          {
            row: 1,
            col: 1,
            // 字段名称
            component: itemComponent,
            item: {
              // item 类型
              type: 'checkbox', // 必填!
              // label名称
              title: '是否包邮', // 必填!
              // 字段名称
              field: 'is_postage', // 必填!
              // input值
              value: '2',
              props: {

              },
              validate: {
                hidecolumn: {
                  refcolumn: 'cate_name',
                  refval: '2'
                }
              }
            }
          },
          {
            row: 1,
            col: 1,
            component: itemComponent,
            item: {
              // item 类型
              type: 'select', // 必填!
              
              // label名称
              title: '产品分类', // 必填!
              // 字段名称
              field: 'cate_id', // 必填!
              // input值
              value: '',
              options: [
                { value: '104', label: '生态蔬菜', disabled: false },
                { value: '105', label: '新鲜水果', disabled: false },
              ],
              props: {
                
              },
              validate: [ // 校验规则  默认onchage
              ]
            }
          },
          {
            row: 1,
            col: 1,
            component: itemComponent,
            item: {
              // item 类型
              type: 'input', // 必填!
              // label名称
              title: '产品name', // 必填!
              // 字段名称
              field: 'cate_name', // 必填!
              // input值
              value: '',
              props: {

              },
              validate: {
                // // 隐藏字段
                // hidecolumn: {
                //   // 逻辑运算key
                //   refcolumn: ['cate_name'],
                //   // 隐藏条件 value值
                //   refval: '2'
                // }
              }
            }
          }
        ]
      };
    },
    methods: {
      ...mapActions('global', ['updateAccessHistory']),
      getQueryListForAg(searchData) {
        this.$store.dispatch(`${getComponentName()}/getQueryListForAg`, searchData);
      },
      getQueryList() {
        const { agTableElement } = this.$refs;
        agTableElement.showAgLoading();
        this.getQueryListForAg(this.searchData);
      },
      onPageChange(page) {
        const { range } = this.searchData;
        this.searchData.startIndex = range * (page - 1);
        this.getQueryList();
      },
      onPageSizeChange(pageSize) {
        this.searchData.startIndex = 0;
        this.searchData.range = pageSize;
        this.getQueryList();
      },
    },
    mounted() {
      this.getQueryList();
    },
    activated() {
      const { tableId } = this.$route.params;
      this.updateAccessHistory({ type: 'table', id: tableId });
    }
  };
</script>

<style scoped lang="less">
  .StandardTableListRootDiv {
    width: 100%;
    overflow: auto;
  }
</style>

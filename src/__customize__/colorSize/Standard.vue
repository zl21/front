<template>
  <div class="standard_container">
      <!--<search-form :searchFoldnum="3" :setHeight="34" :rowAll="4" :defaultconfig="defaultconfig"></search-form>-->
      <div class="button_group">
          <Button type="fcdefault">返回</Button>
      </div>
    <div class="tabs_container">
      <TabPanels
        type="singleCard"
        is-keep-alive
        :tab-margin-left="20"
        :tab-height="26"
        :tab-panels="tabPanels"
      />
    </div>
  </div>
</template>

<script>
  import SizeComponent from './SizeComponent';
  import ColorComponent from './ColorComponent';
  import searchForm from '../../__component__/form/SearchForm';

  export default {
    data() {
      return {
        defaultconfig: [
          {
            item: {
              type: 'Input', // 组件类型
              required: true, // 是否必填
              label: '11111',
              props: {
                placeholder: '后台字段',
                value: '666',
                regularMessage:'请输入666', // 报错提示
                regx:/[0-9]/g // 校验规则
              },
              event: {
                'on-change': (e) => {
                  this.number = 2;
                  //this.config[1].show = false;
                }
              }
            }
          },
          {
            show: true,// 是否显示隐藏
            row: 1, // 行高
            col: 1, // 列宽
            item: {
              type: 'Input', // 组件类型
              required: true, // 是否必填
              label: '116666',
              props: {
                placeholder: '后台字段',
                value: '',
                regularMessage:'请输入666' // 报错提示
              },
              event: {
                'on-change': (e) => {
                  this.number = 2;
                  //this.config[1].show = false;
                }
              }
            }
          },
          {
            show: true,// 是否显示隐藏
            row: 1, // 行高
            col: 1, // 列宽
            item: {
              type: 'Select', // 组件类型
              required: true,
              label: '22222',
              props: {
                placeholder: '后台字段',
                options: [{
                  value: 'New York',
                  label: 'New York'
                },
                  {
                    value: 'London',
                    label: 'London'
                  },
                  {
                    value: 'Sydney',
                    label: 'Sydney'
                  },
                  {
                    value: 'Ottawa',
                    label: 'Ottawa'
                  },
                  {
                    value: 'Paris',
                    label: 'Paris'
                  },
                  {
                    value: 'Canberra',
                    label: 'Canberra'
                  }]
              },
              event: {
                'on-change': (e) => {
                  console.log(e);
                }
              }
            }
          },
          {
            item: {
              type: 'Input', // 组件类型
              required: true, // 是否必填
              label: '11111',
              props: {
                placeholder: '后台字段',
                value: '666',
                regularMessage:'请输入666', // 报错提示
                regx:/[0-9]/g // 校验规则
              },
              event: {
                'on-change': (e) => {
                  this.number = 2;
                  //this.config[1].show = false;
                }
              }
            }
          },
          {
            show: true,// 是否显示隐藏
            row: 1, // 行高
            col: 1, // 列宽
            item: {
              type: 'Input', // 组件类型
              required: true, // 是否必填
              label: '116666',
              props: {
                placeholder: '后台字段',
                value: '',
                regularMessage:'请输入666' // 报错提示
              },
              event: {
                'on-change': (e) => {
                  this.number = 2;
                  //this.config[1].show = false;
                }
              }
            }
          },
          {
            show: true,// 是否显示隐藏
            row: 1, // 行高
            col: 1, // 列宽
            item: {
              type: 'Select', // 组件类型
              required: true,
              label: '22222',
              props: {
                placeholder: '后台字段',
                options: [{
                  value: 'New York',
                  label: 'New York'
                },
                  {
                    value: 'London',
                    label: 'London'
                  },
                  {
                    value: 'Sydney',
                    label: 'Sydney'
                  },
                  {
                    value: 'Ottawa',
                    label: 'Ottawa'
                  },
                  {
                    value: 'Paris',
                    label: 'Paris'
                  },
                  {
                    value: 'Canberra',
                    label: 'Canberra'
                  }]
              },
              event: {
                'on-change': (e) => {
                  console.log(e);
                }
              }
            }
          },
          {
            item: {
              type: 'Input', // 组件类型
              required: true, // 是否必填
              label: '11111',
              props: {
                placeholder: '后台字段',
                value: '666',
                regularMessage:'请输入666', // 报错提示
                regx:/[0-9]/g // 校验规则
              },
              event: {
                'on-change': (e) => {
                  this.number = 2;
                  //this.config[1].show = false;
                }
              }
            }
          },
          {
            show: true,// 是否显示隐藏
            row: 1, // 行高
            col: 1, // 列宽
            item: {
              type: 'Input', // 组件类型
              required: true, // 是否必填
              label: '116666',
              props: {
                placeholder: '后台字段',
                value: '',
                regularMessage:'请输入666' // 报错提示
              },
              event: {
                'on-change': (e) => {
                  this.number = 2;
                  //this.config[1].show = false;
                }
              }
            }
          },
          {
            show: true,// 是否显示隐藏
            row: 1, // 行高
            col: 1, // 列宽
            item: {
              type: 'Select', // 组件类型
              required: true,
              label: '22222',
              props: {
                placeholder: '后台字段',
                options: [{
                  value: 'New York',
                  label: 'New York'
                },
                  {
                    value: 'London',
                    label: 'London'
                  },
                  {
                    value: 'Sydney',
                    label: 'Sydney'
                  },
                  {
                    value: 'Ottawa',
                    label: 'Ottawa'
                  },
                  {
                    value: 'Paris',
                    label: 'Paris'
                  },
                  {
                    value: 'Canberra',
                    label: 'Canberra'
                  }]
              },
              event: {
                'on-change': (e) => {
                  console.log(e);
                }
              }
            }
          },
          {
            item: {
              type: 'Input', // 组件类型
              required: true, // 是否必填
              label: '11111',
              props: {
                placeholder: '后台字段',
                value: '666',
                regularMessage:'请输入666', // 报错提示
                regx:/[0-9]/g // 校验规则
              },
              event: {
                'on-change': (e) => {
                  this.number = 2;
                  //this.config[1].show = false;
                }
              }
            }
          },
          {
            show: true,// 是否显示隐藏
            row: 1, // 行高
            col: 1, // 列宽
            item: {
              type: 'Input', // 组件类型
              required: true, // 是否必填
              label: '116666',
              props: {
                placeholder: '后台字段',
                value: '',
                regularMessage:'请输入666' // 报错提示
              },
              event: {
                'on-change': (e) => {
                  this.number = 2;
                  //this.config[1].show = false;
                }
              }
            }
          },
          {
            show: true,// 是否显示隐藏
            row: 1, // 行高
            col: 1, // 列宽
            item: {
              type: 'Select', // 组件类型
              required: true,
              label: '22222',
              props: {
                placeholder: '后台字段',
                options: [{
                  value: 'New York',
                  label: 'New York'
                },
                  {
                    value: 'London',
                    label: 'London'
                  },
                  {
                    value: 'Sydney',
                    label: 'Sydney'
                  },
                  {
                    value: 'Ottawa',
                    label: 'Ottawa'
                  },
                  {
                    value: 'Paris',
                    label: 'Paris'
                  },
                  {
                    value: 'Canberra',
                    label: 'Canberra'
                  }]
              },
              event: {
                'on-change': (e) => {
                  console.log(e);
                }
              }
            }
          },
          {
            item: {
              type: 'Input', // 组件类型
              required: true, // 是否必填
              label: '11111',
              props: {
                placeholder: '后台字段',
                value: '666',
                regularMessage:'请输入666', // 报错提示
                regx:/[0-9]/g // 校验规则
              },
              event: {
                'on-change': (e) => {
                  this.number = 2;
                  //this.config[1].show = false;
                }
              }
            }
          },
          {
            show: true,// 是否显示隐藏
            row: 1, // 行高
            col: 1, // 列宽
            item: {
              type: 'Input', // 组件类型
              required: true, // 是否必填
              label: '116666',
              props: {
                placeholder: '后台字段',
                value: '',
                regularMessage:'请输入666' // 报错提示
              },
              event: {
                'on-change': (e) => {
                  this.number = 2;
                  //this.config[1].show = false;
                }
              }
            }
          },
          {
            show: true,// 是否显示隐藏
            row: 1, // 行高
            col: 1, // 列宽
            item: {
              type: 'Select', // 组件类型
              required: true,
              label: '22222',
              props: {
                placeholder: '后台字段',
                options: [{
                  value: 'New York',
                  label: 'New York'
                },
                  {
                    value: 'London',
                    label: 'London'
                  },
                  {
                    value: 'Sydney',
                    label: 'Sydney'
                  },
                  {
                    value: 'Ottawa',
                    label: 'Ottawa'
                  },
                  {
                    value: 'Paris',
                    label: 'Paris'
                  },
                  {
                    value: 'Canberra',
                    label: 'Canberra'
                  }]
              },
              event: {
                'on-change': (e) => {
                  console.log(e);
                }
              }
            }
          },
          {
            show: true,// 是否显示隐藏
            row: 1, // 行高
            col: 1, // 列宽
            item: {
              type: 'DatePicker', // 组件类型
              label: '33333',
              props: {
                placeholder: '666',
                option: [{
                  label: 'ddd',
                  value: '1'
                }]
              },
              event: {
                'on-change': (e) => {
                  console.log(e);
                }
              }
            }
          }
        ],
        tabPanels: [
          {
            label: '颜色', // tab标签名字
            component: ColorComponent, // tab标签里的组件
            ref: 'test1', // tab标签里的组件的ref
            componentAttribute: {}, // 组件属性
            cilckCallback: (index, name, instance) => { // 点击标签时的回调方法，index为tabPanelsData数组下标，name为当前标签名称，instance为当前标签内的组件实例
              console.log(index, name, instance);
            }
          },
          {
            label: '尺寸', // tab标签名字
            component: SizeComponent, // tab标签里的组件
            ref: 'test1', // tab标签里的组件的ref
            componentAttribute: {}, // 组件属性
            cilckCallback: (index, name, instance) => { // 点击标签时的回调方法，index为tabPanelsData数组下标，name为当前标签名称，instance为当前标签内的组件实例
              console.log(index, name, instance);
            }
          }
        ]
      };
    },
    name: 'Standard',
    components: {
      searchForm
    },
    methods: {},
    watch: {},
    computed: {}
  };
</script>

<style lang="less">
    .standard_container {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 10px 0px;
        .button_group {

        }
        .tabs_container{
            flex: 1;
            margin-top: 10px;
        }
        .burgeon-tabs-panels{
            height: 100%;
            display: flex;
            flex-direction: column;
            .burgeon-tabs-panels-content{
                flex: 1;
                overflow: hidden;
            }
        }
    }
</style>

<template>
  <div>
    <h1> Component Prototype </h1>
    <div class="container">
      <div class="wrapper">
        <h4>字段读写规则应用：EnumerableInput</h4>
        <EnumerableInput
          @valueChange="enumerableValueChange1"
          :enumerable-lists="enumerableLists1"
          :default-value="`${1010101}`"
        />
      </div>
      <div class="wrapper">
        <h4>表的读写规则应用：EnumerableInput</h4>
        <EnumerableInput
          @valueChange="enumerableValueChange2"
          :enumerable-lists="enumerableLists2"
          :default-value="'AMDQSVUB'"
          :strictMode="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import EnumerableInput from './EnumerableInput';
  
  const enumerableLists1 = [
    {
      text: '新增界面可见',
      value: 1,
    }, {
      text: '新增界面可编辑',
      value: 1,
    }, {
      text: '编辑界面可见',
      value: 1,
    }, {
      text: '编辑界面可编辑',
      value: 1,
    }, {
      text: '列表界面可见',
      value: 1,
    }, {
      text: '不可见且有默认值',
      value: 1,
    }, {
      text: '批量修改可见',
      value: 1,
    },
  ];
  const enumerableLists2 = [
    {
      text: 'ADD-新增',
      value: 'A',
    }, {
      text: 'MODIFY-修改',
      value: 'M',
    }, {
      text: 'DELETE-删除',
      value: 'D',
    }, {
      text: 'QUERY-查询',
      value: 'Q',
    }, {
      text: 'SUBMIT-提交',
      value: 'S',
    }, {
      text: 'VOID-作废',
      value: 'V',
    }, {
      text: 'UNSUBMIT-取消提交',
      value: 'U',
    }, {
      text: 'BATCH-批量修改',
      value: 'B',
    },
  ];
  
  export default {
    name: 'ComponentPrototype',
    data: () => ({
      enumerableLists1,
      enumerableLists2
    }),
    components: {
      EnumerableInput
    },
    methods: {
      enumerableValueChange1(value) {
        console.log('value change = ', value);
      },
      enumerableValueChange2(value) {
        console.log('value change = ', value);
      }
    }
  };
</script>

<style scoped lang="less">
  .container {
    display: flex;
    .wrapper {
      margin: 30px auto;
      width: 30%;
      padding: 5px;
    }
  }
</style>

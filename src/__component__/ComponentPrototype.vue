<template>
  <div>
    <h1> Component Prototype </h1>
    <div clss="container">
      <div style="width: 80%; height: 400px; margin: 0 auto;">
        <ExtentionProperty></ExtentionProperty>
      </div>
    </div>
    <div class="container">
      <div class="wrapper">
        <h3>字段读写规则应用：EnumerableInput</h3>
        <EnumerableInput
          @valueChange="enumerableValueChange1"
          :enumerable-lists="enumerableForColumn"
          :default-value="`${1010101}`"
        />
      </div>
      <div class="wrapper">
        <h3>表的读写规则应用：EnumerableInput</h3>
        <EnumerableInput
          @valueChange="enumerableValueChange2"
          :enumerable-lists="enumerableForTable"
          :default-value="'AMDQSVUB'"
          :strictMode="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import EnumerableInput from './EnumerableInput';
  import ExtentionProperty from './ExtentionProperty';
  import enumerableForColumn from '../constants/enumerateInputForColumn';
  import enumerableForTable from '../constants/enumerateInputForTable';
  import extentionForColumn from '../constants/extentionPropertyForColumn';
  import extentionForTable from '../constants/extentionPropertyForTable';
  
  export default {
    name: 'ComponentPrototype',
    data: () => ({
      enumerableForColumn,
      enumerableForTable
    }),
    components: {
      EnumerableInput,
      ExtentionProperty
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
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 5px;
  }
  .container {
    font-family: "Roboto", "Microsoft YaHei", sans-serif;
    display: flex;
    .wrapper {
      margin: 30px auto;
      width: 30%;
      padding: 5px;
    }
  }
</style>

<template>
  <div
    class="componentPrototype"
    style="height: 100%; overflow: scroll"
  >
    <h1> Component Prototype </h1>
    <div class="container">
      <div class="wrapper">
        <h3>字段读写规则应用：EnumerableInput</h3>
        <EnumerableInput
          :enumerable-config="enumerableForColumn"
          :default-value="`${1010101}`"
          @valueChange="enumerableValueChange1"
          @keydown="onKeydown"
        />
      </div>
      <div class="wrapper">
        <h3>表的读写规则应用：EnumerableInput</h3>
        <EnumerableInput
          :enumerable-config="enumerableForTable"
          :default-value="'AMDQSVUB'"
          :strict-mode="false"
          @valueChange="enumerableValueChange2"
          @keydown="onKeydown"
        />
      </div>
    </div>
    
    <!--  拓展属性   -->
    <div class="container">
      <div style="width: 90%; height: 500px; margin: 0 auto;">
        <h3>Extention For Table</h3>
        <ExtentionInput
          :extention-config="extentionForTable"
          :default-data="''"
          @valueChange="extentionValueChange1"
          @keydown="onKeydown"
        />
      </div>
    </div>
    
    <div class="divider" />
    
    <div clss="container">
      <div style="width: 90%; height: 500px; margin: 0 auto;">
        <h3>Extention For Column</h3>
        <ExtentionInput
          :extention-config="extentionForColumn"
          @valueChange="extentionValueChange2"
          @keydown="onKeydown"
        />
      </div>
    </div>
    <div class="divider" />
  </div>
</template>

<script>
  import EnumerableInput from './EnumerableInput';
  import ExtentionInput from './ExtentionInput';
  import enumerableForColumn from '../constants/enumerateInputForColumn';
  import enumerableForTable from '../constants/enumerateInputForTable';
  import extentionForColumn from '../constants/extentionPropertyForColumn';
  import extentionForTable from '../constants/extentionPropertyForTable';
  
  const extentionDataForTable = {
    fkdrplist: {
      orderby: [
        {
          column: '1-1',
          asc: true
        },
        {
          column: '1-2',
          asc: true
        }
      ],
      searchcols: [
        '1-1',
        '1-2',
        '1-3',
        '1-4',
        '1-5'
      ]
    },
    orderby: [
      {
        column: '2-1',
        asc: false
      },
      {
        column: '2-2',
        asc: false
      }
    ],
    multiCenter: [
      '3-1'
    ],
    multiColumn: [
      '3-3'
    ],
    multiFilter: [
      '3-4'
    ],
    fuzzyQuery: [
      {
        colName: '4-1-1',
        matchType: '4-1-2'
      },
      {
        colName: '4-2-1',
        matchType: '4-2-2'
      }
    ],
    ak2: '5-1',
    DisableEXPORT: true,
    smalltable: true,
    pdtcol: '6-1',
    qtycol: '6-2',
    qtyisshow: true,
    defnum: 6,
    filteracshow: [
      {
        ackey: 'actionMODIFY',
        sqlfilter: '7-1'
      },
      {
        ackey: 'ctionDELETE',
        sqlfilter: '7-2'
      }
    ],
    pstatus: {
      col: '8-1',
      readforvals: [
        '8-2'
      ]
    },
    wkprioritys: [
      '9-1',
      '9-2',
      '9-3'
    ],
    status4css_priority: 'a>b>c>d>e>f>g',
    listrange: 11,
    cusQResult: {
      action: '12'
    }
  };
  
  export default {
    name: 'ComponentPrototype',
    data: () => ({
      extentionDataForTable,
      enumerableForColumn,
      enumerableForTable,
      extentionForColumn,
      extentionForTable
    }),
    components: {
      EnumerableInput,
      ExtentionInput
    },
    methods: {
      onKeydown(e) {
        console.log(e);
      },
      extentionValueChange2(value) {
        console.log('extentionValueChange2', value);
      },
      extentionValueChange1(value) {
        console.log('extentionValueChange1', value);
      },
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
  .componentPrototype {
    font-family: Consolas, "Hiragino Sans GB", "Microsoft YaHei", serif;
    .divider {
      height: 30px;
      width: 100%;
    }
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
  }
</style>

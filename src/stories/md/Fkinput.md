## fkinput  user manual

### 一. 组件说明
1. 外键关联类型的input框。
2. 使用场景：
	- businessForm中drp/mrp类型的表单项；
	- 表格中需要render外键关联类型的input时。

### 二. 配置项说明

```
props: {
		colname: 'OLD_BARCODE',
		style: 'popInput',
		version: '1.4',
		isActive: true,
		itemdata: this.itemdata,
}
on: {
		getFkChooseItem: (val) => {
				console.log('val:', val);
				console.log('params:', params);
				this.getFkChooseItem(val, params);
		},
}
```

### 三. 使用说明

- #### 使用场景一：[businessForm中](http://knowledge.ark.burgeononline.com/repository#/entryComponents/2/907857/2/2061 "businessForm中")


- #### 使用场景二：自定义render
`组件文件中（A.vue），如：changeTag.vue`

1. 引入组件：
```
import myInput from 'professionalComponents/fkinput.vue';
import Vue from 'vue';
Vue.component('drpInput', myInput);
```

2. 注册：
```
components: {
    	myInput,
},
```

3. render：

```
tableConfig: {
        pageShow: true,
        total: 0,
        pageSize: 10,
        current: 1,
        isShowSelection: true, // 展示select列
        indexColumn: true, // 展示序号列
        columns: [
          {
            title: '换吊牌后条码',
            key: 'OLD_BARCODE',
            render: (h, params) => h('drpInput', {
              props: {
                colname: 'OLD_BARCODE',
                style: 'popInput',
                version: '1.4',
                isActive: true,
                itemdata: this.itemdata,
              },
              style: {
                marginRight: '5px',
              },
              on: {
                getFkChooseItem: (val) => {
                  console.log('val:', val);
                  console.log('params:', params);
                  this.getFkChooseItem(val, params);
                },
              },
            }),
          },
        ],
        data: [{
          PICK_NO: 1, PS_C_SKU_ECODE: 1, TOT_QTY_OUT: 1, OLD_BARCODE: ''
        }],
      },
```

4. 可能要写的样式：

```
<style lang="less" scoped>
.changeTag {
  /deep/ .ark-table-cell {
    .el-input__inner {
      height: auto;
      line-height: 1;
      border: none;
    }
    .item-input {
      width: 40%;
    }
    .item-input .add-input {
      padding: 0;
      width: 100%;
    }
  }
}
</style>
```

------------

&copy;撰写：zhou.l@burgeon.cn
# businessButton

### 一、组件说明
#### 1. 概述
基础组件，或展示二级、三级的下拉菜单。

#### 2. 应用场景
用于配置按钮组。

### 二、使用说明
##### 1. 引用

```javascript
import businessButton from 'professionalComponents/businessButton';
```

##### 2. 应用

* 基本按钮

```javascript
// .vue
<businessButton class="modal-footer" :btn-config="btnConfig" />

// .js
export default {
  components: {
    businessButton
  },
  data() {
      return {
        btnConfig: {
            typeAll: 'default', // 按钮统一风格样式
            btnsite: 'right', // 按钮位置 (right , center , left)
            buttons: [
              {
                webname: 'orderExport',
                text: '导出',
                btnclick: () => {
                  // TODO
                }
              },
              {
                webname: 'iconbj_setup',
                icon: 'iconfont iconbj_setup',
                btnclick: () => {
                  // TODO
                }
              }
            ]
        }
      }
  }
}
```

![image.png](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAA0CAYAAABB/vzFAAAERUlEQVR4Ae2czU8TQRjGuflnmHjx4EEvHiVRb8YLHryokQM2pMrBhIt48IAxoCJfUQ5oPEtirEZJTPwADUI1bUmUxFAwIQGKH2jSFgRTeMzblnS77ey807Kws51NGnY77+4+7/Obd3a67VIHs/jagTpfZ2eSgwHs805gABvAPnfA5+mZCjaAfe6Az9MzFWwA+9wBn6dnKtgAzjmQTP3F/MJvxL99x/TskqdfpJG0kmbVxct5VpIXq4J//kpibn4Z6ZU1bG5uqnq24/GkkbSSZtLOXbyeZyV5SQFTjyajdABrB0maSTunknXKUyUvKWAa6qgadF1IO+UgW3TLk5uXFDCN+zpW7xZQ0k45yBbd8uTmJQVMEyrdF04OnBiv+cDRbADnqXHMMoC95oACPAPYo/A4sjjwODGcc+1kDEezGaLzRDhmSeFlljEX+YLFDUtkJoGv0Tj+ZCzvbdMqR7MBnDebY5YTl/TYAJob2zD4qB+N567h/mgYH0eG0H42gI6hh2g7fwk3wts7YeVodg3w+uMg9h88LnztO9SLtw6O0f4XJx0CFJo4RnBihKeM9WBv10ShStcSmP4wjonxKcyu5/fKpDDV0YDWz8KjKDdwNLsKuP6ZqMcm8LK5uwiwHWi5bfHxnL3hGMGJEZ4lEcKpe1Fh81bDTF8Qd39sbVX/l6PZVcAqFVwOqLWCqd2zgMfaWdooh6bwv+rJ5o+w64DFQHIVPBntR11PLCtXV8Ab86/RGejF+9UCt3T4Aa4EzuBEcxvufLLcJl2JojdwHS8WtweyhwHnzLBWJa07VTy1iTtMwdxyaxwjODH2Y8/0NeBk9zAiKUvLaDsOD8Zy1+NMCvGBJgTG0oWAZByvbl/AnoFcxy40qK9xNLs2RCMRwuUDRx2hOU20ylW0twCXziOAZYwEOzFs/UY1E0Z3yxMsFPGLoSdof68ogLWxu4AdJM7eOiKdIdsBOxxO2sQxghNTfKKaBUyJ1ztWrnUormsJYRFL0lk1UHmv58DjxBQDBmp7iCY3EiFcfZqw+4LSCi6thtIK9h5gSqxmJ1mUfDISwfOuY6AqtV6D/AQ423tr8WNSSdlaJl2lkyvesG7vKCXnELzBGX45MYLDZ0eqmrvRITSj4gZvDtHZdGrxVmXFHF3YkVOdnBgnaatvbuK045cNjWh9J7p163RkcRtHs3ufg8W6dryFYwQnRircfF0otciVAA48Towr4qo4KEezqeC8wRyzqmDhyq4czVLAuv2c1O4k9+eluuXJzUsKWLcfhNsBc38grlue3LykgHV6pMMOl3q5eXTF7kqZba8/lGWXTGCph5uHz8D/N0pUyTSM0bWKLu5efpFG0sp56MzeObycZyV5SYdouwFmWy8HDGC9eCmrNYCVLdNrBwNYL17Kag1gZcv02sEA1ouXsloDWNkyvXYwgPXipazWAFa2TK8dDGC9eCmr/Q/nN4DV3jbQJgAAAABJRU5ErkJggg==)

* 下拉菜单按钮

```javascript
// .vue
 <businessButton
    :btn-config="btnConfig"
    @dropDownClick="(val) => eventGather.dropDownClickChange(val, extendBtn)"
  />
  
// .js
{
	"typeAll": "default",
	"loading": false,
	"buttons": [{
		"menuText": "创建订单",
		"dropDown": true,
		"menus": [{
			"webname": "manualCreation",
			"webid": 2531,
			"text": "手工创建"
		}, {
			"webname": "OcBOrderImportCmd",
			"webid": 2538,
			"text": "导入"
		}, {
			"webname": "ORDER_COPY_CANCELED_ORDER",
			"webid": 2539,
			"text": "取消单复制"
		}, {
			"webname": "ORDER_COPY_AF_SALE",
			"webid": 2540,
			"text": "售后复制"
		}]
	}]
}
```

![image.png](data:image/png;base64,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)
### 三、API

#### businessButton Props

属性 | 说明 | 类型 | 默认值
---|---|---|---
btnConfig | 按钮配置 | Object | -- 

#### businessButton.btnConfig 
属性 | 说明 | 类型 | 默认值
---|---|---|---
loading | 设置按钮为加载中状态 | Boolean | false 
typeAll | 按钮统一风格样式，可选值为`default` ==TODO== | String | 
btnsite | 按钮位置，可选值为`right` , `center` , `left` | String | 
buttons | 按钮 | Array | [] 

#### businessButton.btnConfig.buttons item
属性 | 说明 | 类型 | 默认值
---|---|---|---
isShow | 控制按钮显示隐藏 | Boolean | true 
type | 按钮类型, 不设置默认使用typeAll配置 | String | - 
text | 按钮文本 | String | -
icon | 按钮图标 | String | ''
customIcon | 设置按钮的自定义图标 | String | ''
ghost | 幽灵属性，使按钮背景透明 | Boolean | false
shape | 按钮形状 | String | -
size | 按钮大小，可选值为large、small、default | String | small
class | 按钮自定义class | String | -
disabled | 设置按钮为禁用状态 | Boolean | false
btnclick | 按钮点击事件 | Function | Object | -
dropDown | 下拉菜单按钮类型 | Boolean | false 
menus | 下拉菜单按钮 | Array | [] 
menuText | 下拉菜单按钮文本 | String | -
ref | 注册引用 | String | - 

#### businessButton.btnConfig.buttons.menus item
属性 | 说明 | 类型 | 默认值
---|---|---|---
webname | 控制按钮显示隐藏 | Boolean | true 
text | 按钮文本 | String | -
dropDown | 下拉菜单按钮类型 | Boolean | false 
menus | 下拉菜单按钮 | Array | [] 
menuText | 下拉菜单按钮文本 | String | -
ref | 注册引用 | String | - 

#### businessButton events
事件 | 说明 | 返回值
---|---|---
dropDownClick | 下拉菜单按钮点击事件 | webname，menus 
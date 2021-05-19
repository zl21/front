# @burgeon/business-components

#### 介绍

@burgeon/business-components

是上海伯俊中台事业部产品中心项目架构私有依赖包仓库中复合型业务组件库;

秉承前端项目工程化的思想, 将中台项目中公用的业务组件库抽离, 独立模块依赖包便于后期迭代维护;

#### 安装教程

一. 简易化安装依赖:

1.  命令行: npm install @burgeon/business-components --registry http://47.102.123.140:4873;

2.  优缺点:

    优点: 简单易用,不用切源;

    缺点: 单行命令过多;

二. nrm 安装依赖:

1.  命令行:

    npm install nrm -g;

    nrm add XXX http://47.102.123.140:4873;

    nrm use XXX;

    npm install @burgeon/business-components;

2.  优缺点:

    优点: 引入 nrm 管理依赖包来源; 多源情景下切源方便;

    缺点: 初期命令行相应较多;

#### 使用说明

1. 可在项目的入口文件中使用注入 node_Module 依赖包的方式进行注入并挂载, 即可全局使用;

2. 可在项目单文件中使用 import 方式进行局部引入使用, 实现按需加载, 近而减少包体;

#### 更新版本列表

| Version | Description                                                                                                                            |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| v1.0.1  | 重构组件库项目架构                                                                                                                     |
| v1.0.2  | 添加使用说明                                                                                                                           |
| v1.0.3  | 解决 input 框重叠问题                                                                                                                  |
| v1.0.6  | 标品项目架构调整优化弹窗引用问题                                                                                                       |
| v1.0.7  | 加入定制弹窗                                                                                                                           |
| v1.0.8  | 修改定制页面弹窗配置                                                                                                                   |
| v1.0.9  | 修改 1.4 框架 agGridTable 获取 ID 的方式                                                                                               |
| v1.0.10 | 修改组件 businessLabel 样式                                                                                                            |
| v1.0.11 | 修改组件 businessForm 样式                                                                                                             |
| v1.0.12 | 修改 agTable 序号宽度/businessForm 箭头样式/form 的高度                                                                                |
| v1.0.13 | 修改 ActionTable 表格样式和 businessLabel 样式                                                                                         |
| v1.0.14 | 修改 input 样式                                                                                                                        |
| v1.0.15 | form 表单搜索收起状态下去掉固定高度添加最大高度，解决一行搜索条件留白过多问题                                                          |
| v1.0.16 | LogTable.js 报错修复                                                                                                                   |
| v1.0.17 | businessActionTable 组件新增功能,控制列表单击当前行当前行 checkbox 是否勾选 rowClickNoSelected:(不传参默认为勾选,传参为 true 为不勾选) |
| v1.0.18 | agTable 翻页组件修改 size 属性                                                                                                         |
| v1.0.19 | businessActionTable 单击表格行功能                                                                                                     |
| v1.0.20 | businessActionTable 修改单元格高度                                                                                                     |
| v1.0.21 | businessActionTable 修改布局                                                                                                           |
| v1.0.22 | businessActionTable 修改布局 patch                                                                                                     |
| v1.0.23 | 表格组件新增行颜色                                                                                                                     |
| v1.0.24 | 修改 agTable 序号宽度                                                                                                                  |
| v1.0.25 | 优化 agTable 的重置所有列信息功能                                                                                                      |
| v1.0.26 | 优化组件样式引用空文件及修改 businessDialog 组件引用名                                                                                 |
| v1.0.27 | 优化按钮组件(businessButton)的匹配方式 (btn.text -> btn.webname)                                                                       |
| v1.0.28 | 修改 businessForm - input disabled 样式                                                                                                |
| v1.0.29 | 修改 businessDialog z-index 层级修改                                                                                                   |
| v1.0.30 | businessForm 组件中 AttachFilter 添加 on-clear 事件                                                                                    |
| v1.0.31 | fix:businessForm 组件中 AttachFilter 组件报 warn:Invalid handler for event "on-xxx": got undefined                                     |
| v1.0.32 | fix:businessForm 组件中 AttachFilter 组件报未获取到输入值                                                                              |
| v1.0.33 | fix:publicDialog 组件中 dropSortConfig 中 setFormDrag 命名                                                                             |
| v1.0.34 | easyMatrix 组件模糊搜索点击选中值后赋值给 value                                                                                        |
| v1.0.35 | 增加待审核水印图片                                                                                                                     |
| v1.0.36 | 弹窗组件增加动态 base 路径传参 basePathName                                                                                            |
| v1.0.37 | businessActionTable 修改样式（添加最后一行下边线）                                                                                     |
| v1.0.38 | 添加促销组件                                                                                                                           |
| v1.0.39 | agGrid 依赖文件迁移至私仓                                                                                                              |
| v1.0.40 | agGrid 路径错误补丁                                                                                                                    |
| v1.0.41 | publicDialog.js 路径修改（首字母大写改小写）                                                                                           |
| v1.0.42 | 私仓 import.js 和项目 import.js 合并                                                                                                   |
| v1.0.43 | 将水印配置文件迁移至私仓                                                                                                               |
| v1.0.44 | businessForm 样式微调                                                                                                                  |
| v1.0.45 | businessForm 样式调整(全局)                                                                                                            |
| v1.0.46 | importTable 替换 loading                                                                                                               |
| v1.0.47 | 设置弹窗局部 loading                                                                                                                   |
| v1.0.48 | 修改 businessform 引入的 fktable 组件兼容 1.4 的数据格式（云雀）                                                                       |
| v1.0.49 | 修改 businessform 引入的 fktable 组件修改组件传值                                                                                      |
| v1.0.50 | 修复版本号问题;                                                                                                                        |
| v1.0.51 | 修复 commonPage 的兼容性问题;                                                                                                          |
| v1.0.52 | 修复 importTable 的接口问题;                                                                                                           |
| v1.0.53 | 添加 loading 组件;                                                                                                                     |
| v1.0.54 | businessForm 修改;                                                                                                                     |
| v1.0.55 | businessForm add Tooltip;                                                                                                              |
| v1.0.56 | importTable 兼容优化(sku/spu);                                                                                                         |
| v1.0.57 | 增加 textarea 组件操作事件(enter change blur)                                                                                          |
| v1.0.58 | 1.Tooltip 拓展配置；2.FormItem 拓展动态 class                                                                                          |
| v1.0.59 | 修复 FormItem 拓展动态 class-bug                                                                                                       |
| v1.0.61 | businessform 样式修改                                                                                                                  |
| v1.0.62 | businessform 添加:maxlength="item.maxlength"控制                                                                                       |
| v1.0.63 | 新增通用子表组件 subTable.vue                                                                                                          |
| v1.0.64 | businessTable 优化-无 data 时不展示 thead                                                                                              |
| v1.0.65 | 修改 businessButton -- 按钮透明属性 guost 取值错误                                                                                     |
| v1.0.66 | 修改导入更新组件 class content 为 importContent                                                                                        |
| v1.0.67 | businessButton Alltype 值为 default                                                                                                    |
| v1.0.68 | 组件内部的请求前缀固定                                                                                                                 |
| v1.0.69 | businessform 新增时分秒组件 TimePicker                                                                                                 |
| v1.0.70 | importTable 配置优化封装                                                                                                               |
| v1.0.71 | 时分秒组件添加 placement 属性                                                                                                          |
| v1.0.72 | importTable 配置文件迁移                                                                                                               |
| v1.0.73 | importTable 组件的 loading 及导入成功后刷新页面                                                                                        |
| v1.0.74 | businessForm 组件内 bothInput/bothNumber 参数格式调整                                                                                  |
| v1.0.75 | businessForm 组件内 select 添加模糊搜索                                                                                                |
| v1.0.76 | importTable 组件修改                                                                                                                   |
| v1.0.77 | 修复 fktable 样式问题                                                                                                                  |
| v1.0.78 | fktable 判断接口是否需要添加网关前缀                                                                                                   | 修复 key 重复问题报错 |
| v1.0.79 | businessForm input 样式问题                                                                                                            |
| v1.0.80 | businessButton 文字隐藏修改 ｜ input - padding 修改                                                                                    |
| v1.0.81 | businessButton 组件优化 ｜ businessForm - 默认高度修改                                                                                 |
| v1.0.82 | 三级按钮 html 结构改造                                                                                                                 |
| v1.0.83 | businessForm 组件优化、drp 类型支持 clear                                                                                              |
| v1.0.84 | businessLable 样式修改                                                                                                                 |
| v1.0.85 | axios->network(agGrid)                                                                                                                 |
| v1.0.86 | objinput_dz->fkinput                                                                                                                   |
| v1.0.87 | 标准接口动态匹配网关                                                                                                                   |
| v1.0.88 | importTable computed 优化                                                                                                              |
| v1.0.89 | fkTable-queryList 接口暂时写死                                                                                                         |
| v1.0.90 | importTable 修复                                                                                                                       |
| v1.0.91 | businessForm-select-拓展 on-open-change 方法                                                                                           |
| v1.0.92 | button 三级按钮点击多次触发问题修改                                                                                                    |
| v1.0.93 | businessForm-select-拓展-选中返回选中对象                                                                                              |
| v1.0.94 | agtable 修改配置行高 ｜ 修改 importTable 样式                                                                                          |
| v1.0.95 | importTable catch、参数更改、回调刷新                                                                                                  |
| v1.0.96 | businessForm 拓展自定义 class                                                                                                          |
| v1.0.97 | importTable 优化导入失败的处理、businessActionTable 展示表头                                                                           |
| v1.0.98 | "@burgeon/project-logic": "^1.1.56"                                                                                                    |
| v1.0.99 | businessForm 拓展 checkbox 多选、fkinput 支持返回 rowdata                                                                              |
| v1.1.00 | subTable 配置项 Api 封装                                                                                                               |
| v1.1.01 | 解决 businessForm 无 key 导致的 warning                                                                                                |
| v1.1.02 | businessForm/importTable 优化                                                                                                          |
| v1.1.03 | businessForm-checkbox 修复                                                                                                             |
| v1.1.4  | 迁移库加入静态资源;                                                                                                                    |
| v1.1.5  | 补齐遗漏的组件资源;                                                                                                                    |
| v1.1.6  | businessForm 插槽必填标识                                                                                                              |
| v1.1.7  | 组件内部通信添加自动拼网关方式                                                                                                         |
| v1.1.8  | 网关参数                                                                                                                               |
| v1.1.9  | fkinput                                                                                                                                |
| v1.1.10 | fktable-mrp 模糊搜索                                                                                                                   |
| v1.1.11 | fktable 解决 key 重复问题                                                                                                              |
| v1.1.12 | fktable 添加模糊搜索                                                                                                                   |
| v1.1.13 | fkinput inputEnter 处理                                                                                                                |
| v1.1.14 | 零售发货单弹窗组件调整                                                                                                                 |
| v1.1.15 | downLoad                                                                                                                 |
| v1.1.16 | checkbox扩展属性onlyBox  |
| v1.1.17 | importTable报错修复  |
| v1.1.18 | $i18n  |
| v1.1.19 | 网关  |
| v1.1.20 | fkinput样式调整  |
| v1.1.21 | 网关  |
| v1.1.22 | 样式调整  |
| v1.1.23 | isbackrow clear  |
| v1.1.24 | 重置所有列信息,换接口  |
| v1.1.25 | fkinput bug |
| v1.1.26 | drp模糊搜获的失焦和选中二次$emit导致的bug(临时方案) |
| v1.1.27 | fkinputPlus(fkinput重构v1.0) |
| v1.1.28 | fkinput模糊搜索数据为空，清空输入框（省市区bug） |

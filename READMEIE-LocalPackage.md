## Tutorials

> [You Can Click Here For More Help](https://gitee.com/bojun_front_end/r3-project-template/wikis/burgeon-r3)
>

packageTime: '2020.04.14.11.34':修复左右结构主表配置自定义时，子表不请求问题
packageTime: '2020.04.23.09.19':修复左右结构主表配置自定义时，刷新报错问题，以及切换tab报错
packageTime: '2020.04.28.18.15':修复单对象配置1:1模式时，保存校验必填项问题
packageTime: '2020.04.29.16.20':增加配置isSave时校验必填与空值逻辑，更换树结构列表界面组件
packageTime: '2020.05.04.12.33':增加自定义按钮必填项校验逻辑
packageTime: '2020.05.08.13.15':支持打开的菜单可拖拽排序,需npm install awe-dnd
packageTime: '2020.05.16.14.20':修复了文件上传组件问题/修复外部无法配置backDashboardRoute
packageTime: '2020.05.19.11.00':支持jflow转派到自定义主表，
                                框架向上抛出文件上传组件props   draggingTag参数为设置当前拖拽唯一标示，type:String
                                支持框架内置自定义界面配置custommizedRequestURL:{'当前requestUrl':'配置url'}
packageTime: '2020.05.24.17.53':修改配置isSave校验规则
packageTime: '2020.05.28.11.25':支持单对象子表1:1模式默认值保存
packageTime: '2020.05.30.15.07':解决游客路由请求登出接口403情况报错
packageTime: '2020.06.01.09.50':解决半自定义tab组件加载错误问题，以及表单编辑器控件刷新未清空数据问题
packageTime: '2020.06.02.18.28':解决子表1:1模式无默认值子表保存问题
packageTime: '2020.06.13.12.24':修复列表配置动态路由label取值逻辑
packageTime: '2020.06.17.16.44':支持收藏夹与最近使用可配置
packageTime: '2020.07.07.15.53':自定义弹框点iconX关闭时，需在定制界面内提供clickIconX（）方法，可在关闭弹框前执行clickIconX方法的相关逻辑
                                持配置界面跳转定制界面以及外链界面时提供相关元数据配置信息
                                支持配置actionView为false时，列表界面表格双击不做跳转

next: 1.附件上传一次保存  ossRealtimeSave参数
      2.placeholder的属性控制
      3.查询条件必填控制
      4.修复异步导入刷新问题
      5.修复框架初始化时报错

9.25: 1.blockFullOperation  禁止不选数据时的批量修改操作 默认false
      2.修复单对象上下结构未修改值无法提交问题
      3. 新增有数据修改时增加提示
      

9.19: 1.存储查询条件

10.16: 1.处理标准列表的隐藏列展示问题
       2.通过mixins接入外部逻辑(仅支持部分逻辑处理)
       3.处理外健关联状态多次修改失效问题
       4.标准表格中number类型字段增加特定class

10.22: 1.1.3复制后的字段联动问题处理
       2. 报表类型兼容
       3. 子表垮面板字段联动
       4. 增加任务记录的mixins接入
       5. 海量表新增进入单对象时展现形式问题处理
       


11.14:
       1.去除上传文件大小限制






11.18:
      1.处理上传报错code为0以外的报错信息
      2.单对象界面支持上传图片自定义请求路径，增加参数（当前表名，当前字段名）






12.3
     1.支持标准列表界面内自定义弹框设置明细报错提示信息




 




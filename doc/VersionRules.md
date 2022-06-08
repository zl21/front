## @syman/burgeon-r3  的版本号规则
版本的格式
X.Y.Z
主版本号.次版本号.修补版本号

如果只是修复bug，需要更新Z位。
如果是新增了功能，但是向下兼容，需要更新Y位。

如果有大变动，向下不兼容，需要更新X位。

<<<<<<< HEAD
git tag -a 版本 -m 'v.3.0.1'

=======
### 发版步骤
    1.基于发版开发分支(npm_dev_r3)拉出自己的分支 (分支可以自己名称缩写_功能名称_日期)
    2.功能开发完善后，拉出的分支合并到npm_test_8098(1.4 环境) 或者是npm_test_8098_1.3(1.3 环境)
    3.通知测试编译npm_test_8098 进行测试
    4.测试通过后，方可合并代码到基本分支 npm_dev_r3    
    5.拉出分支经测试无需保留后可删除 


#### 分支名称
  
|  名称 |  用途  |
| ------------ | ------------ |
| npm_publish_r3  | npm 基本表线上发版分支   |
| npm_dev_r3  | npm 基本表线上开发分支   |
| npm_test_8098_1.4  | npm 基本表线上发版1.4测试分支   |
| npm_test_8098_1.3  | npm 基本表线上发版1.3测试分支   |
| feature_list_form   | npm 基本版开发分支   |
| test_8098测试分支   | 早期npm 发版测试分支,目前不要合并,因为有未合并代码   |
| wings   | 云雀项目的开发分支代码  |
| wings_publish   | 云雀发版项目代码   |
|npm_kabin_enableOpenNewTab |卡宾npm 发版分支|
|dev_kabin_enableOpenNewTab |卡宾npm 开发 发版分支|
|compatible_ie11|IE版本发布分支|
|theme_jflow_dev_new |npm 早期基开发分支，目前不维护|
|standard_dev |npm 早期基发版分支，目前不维护|
|R3-1.3 |npm 定制包的文件，目前不维护|
|npm-test-branch-new |所有分支代码，走测试|
|new branch |卡宾和云雀分支代码|
|customizeComponentForConfigPage-new|联客分支(支持模块自定义布局)|


#### 对外抛出函数，变量命名规则
以R3_开头,拼接实际函数名,例如R3_exportData。这样可以避免与业务方命名冲突
>>>>>>> npm_dev_r3

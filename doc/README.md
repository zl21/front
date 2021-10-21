## Tutorials

> [更新文档内容](http://share.ark.burgeononline.com/knowledge/documentation_58582)


## 项目启动
```
start // 本地运行1.4环境
start:1.3 // 本地运行1.3环境
start:project // 编译打包r3，并用项目模拟运行r3包
build:oss // 打包有网关环境给ad环境用
build:oss_no // 打包无网关环境ad环境用
build:test // 打包r3给其他项目定位bug用(因为webpack保留了代码注释和断点)
deploy // 打包r3并发送钉钉通知
server // 本地运行r3打包后的静态文件
```
      
## 代码规范
1.抛出给项目组用的函数,以R3_开头，比如R3_Demo() {}
2..vue文件文件名采用`大驼峰`的方式，例如TestDoc.vue







 




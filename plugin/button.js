
// 这里主要是按钮的逻辑
//创建按钮
//obj 获取的按钮相关数据 buttons 生成按钮的方法（jflowButtons） 生成按钮需要的id
function CreateButton(obj, buttons, id) {


    if (obj.instanceId!==null&&obj.buttons && obj.buttons!==null&&obj.buttons.length > 0) {
      //每一次将判断标志制空，这样每一次进来都能够渲染按钮
      if(document.getElementsByClassName('operate-btn')[0]){
        document.getElementsByClassName('operate-btn')[0].removeAttribute('data-control')
      }
        //         -1, "撤销"
        // 0, "同意"
        // 1, "驳回"
        // 2, "结束流程"
        // 3, "转派"
        // 4, "保存单据修改" 这个按钮不展示
        // 5,"详情页面"
        let buttonans = setInterval(function () {//轮询判断按钮的渲染
            if (document.getElementsByClassName('operate-btn')[0] && document.getElementsByClassName('operate-btn')[0].children && document.getElementsByClassName('operate-btn')[0].children.length > 0 && !document.getElementsByClassName('operate-btn')[0].getAttribute('data-control')) {
                clearInterval(buttonans)
                obj.buttons.map((item, index) => {
                  if (!(item.button === '4')) {
                      let node = document.createElement("button");
                      node.innerText = item.name;
                      if (item.button === '-1' || item.button === '2') {
                          node.onclick = function () {
                              mutipleOperate(item.url,obj.instanceId, buttons, id);
                          }

                      } else {
                          if (item.button === '1') {
                              node.onclick = function () {
                                  window.jflowPlugin.open({ control: true, type: item.button, url: item.url, instanceId:obj.instanceId,returnOption: obj.backNodeIds, buttons: buttons, id: id });
                              }
                          } else {
                              if(item.button==='5'){
                                  node.onclick = function () {
                                  window.open(`http://${window.jflowPlugin.jflowIp}/#/FlowChart?instanceId=${obj.instanceId}`,'_blank','width=800,height=800')
                              }
                              }else{
                                  node.onclick = function () {
                                      window.jflowPlugin.open({ control: true, type: item.button, url: item.url,instanceId:obj.instanceId, buttons: buttons, id: id });
                                  }
                              }
                          }
                      }
                      node.setAttribute("data-new", true)
                      let children = document.getElementsByClassName('operate-btn')[0].children;
                              if (obj.instanceId && obj.instanceId !== null) {
                                  for (let child of children) {
                                      if (child.innerText === "返回") {
                                          var returnbtn = child;
                                      }
                                      if (child.innerText&&child.innerText!==""&&child.innerText !== node.innerText) {
                                          document.getElementsByClassName('operate-btn')[0].insertBefore(node, returnbtn);
                                      }
                                  }
                                  document.getElementsByClassName('operate-btn')[0].setAttribute('data-control', true)
                              }
                          }
                })
                let children = document.getElementsByClassName('operate-btn')[0].children;
                for (let child of children) {
                    if (child.innerText && child.innerText !== "" && (child.innerText === '保存' || child.innerText === '新增' || child.innerText === '作废' || child.innerText === '提交' || child.innerText === '取消提交' || child.innerText === '审核' || child.innerText === '取消审核' || child.innerText === '复制' || child.innerText === '停用')) {
                        if (obj.modifiableFieldName !== null && obj.modifiableFieldName.length > 0) {
                            if (child.innerText !== "保存") {
                                child.style.display = 'none';
                            }
                        } else {
                            child.style.display = 'none';
                        }
                    }
                }
            } else {
                if(document.getElementsByClassName('operate-btn')[0].getAttribute('data-control')){
                    obj.buttons.map((item, index) => {//当按钮已经被重新生成过 现在只需要将按钮展示出来 不必再重新生成一遍
                        if (!(item.button === '4')) {
                            let children = document.getElementsByClassName('operate-btn')[0].children;
                            for(let child of children){
                                if(child.innerText===item.name){
                                    child.style.display='inline-block'
                                }
                                if (child.innerText && child.innerText !== "" && (child.innerText === '保存' || child.innerText === '新增' || child.innerText === '作废' || child.innerText === '提交' || child.innerText === '取消提交' || child.innerText === '审核' || child.innerText === '取消审核' || child.innerText === '复制' || child.innerText === '停用')) {
                                    if (obj.modifiableFieldName !== null && obj.modifiableFieldName.length > 0) {
                                        if (child.innerText !== "保存") {
                                            child.style.display = 'none';
                                        }
                                    } else {
                                        child.style.display = 'none';
                                    }
                                }
                                
                            }
                        }
                    })
                }
                return
            }
        }, 1000)

    } else {
        if (document.getElementsByClassName('operate-btn')[0] && document.getElementsByClassName('operate-btn')[0].children && document.getElementsByClassName('operate-btn')[0].children.length > 0 && document.getElementsByClassName('operate-btn')[0].getAttribute('data-control')) {
            let children = document.getElementsByClassName('operate-btn')[0].children;
            for (let child of children) {
                if (child.hasAttribute("data-new")) {
                    child.style.display='none';
                } else {
                    child.style.display='inline-block';
                }
            }
        }
    }
}
//撤销/结束/详情
function mutipleOperate(url, instanceId,buttons, id) {
    let param = {};
    param.instanceId =instanceId;
    param.userId = window.jflowPlugin.userInfo.id;
    window.jflowPlugin.axios.post(url, param).then(res => {
        if (res.data.resultCode === 0) {
            window.vm.$Message.success(res.data.resultMsg);
            buttons(id);
        } else {
            window.vm.$Message.warning(res.data.resultMsg);
        }
    })
}
export default CreateButton;

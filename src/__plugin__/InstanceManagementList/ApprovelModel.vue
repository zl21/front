<template>
  <div>
    <Modal v-model="modalConfig.control" :title="type==='3'?'选择转派人':'审批意见'" @on-ok="ok" @on-cancel="cancel"  :mask="true" :width="type==='3'?835:520">
    <div class="ApprovelModel" v-if="type==='0'">
      <!-- 同意 -->
      <Input
        v-model="agreecontent"
        type="textarea"
        :rows="4"
        placeholder="请输入审批意见"
      />
    </div>
    <div class="ApprovelModel" v-if="type==='1'">
      <!-- 驳回 -->
      <div class="returnWrap">
       <span class="requireStyle">*</span>
      <Select v-model="returnOption" style="margin-bottom:10px" placeholder="请选择审批单驳回至哪个节点" >
        <Option v-for="item in returnSelection" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      </div>
      <Input v-model="returnContent" type="textarea" :rows="4" placeholder="请输入审批意见"/>
    </div>
    <div class="ApprovelModel" v-if="type==='3'">
      <!-- 转派 -->
      <mutipleSelectPop
        ref="dialogtest"
        :loading="loading"
        :treeLoading="tree_loading"
        :tableLoading="tableLoading"
        :treedata="treedata"
        :componentData="componentData"
        :resultData="resultData"
        :isUse="false"
        @on-select-tree="selectTtree"
        @on-change-tree="changeTtree"
        @on-change-page="changePage"
        @on-change-pageSize="changePageSize"
        @on-row-click="rowClick"
        @on-search="inputsearch"
        @on-transfer="transfer"
        @on-delectli="deleteLi"
        @on-deleBtn="deleBtn"
      ></mutipleSelectPop>
    </div>
  </Modal>
  </div>

</template>
<script>
import mutipleSelectPop from "./MutipleSelectPop";
export default {
  name: "ApprovelModel",
  components:{mutipleSelectPop},
  props: {
    config: {
      type: Object,
      default:()=>{
        return {}
      }
    }
  },
  computed:{
   modalConfig(){
     return this.config
   },
   type(){
     return this.modalConfig.type
   },
   returnSelection(){
     if(this.modalConfig.selection&&this.modalConfig.selection.length>0){
        return this.modalConfig.selection.reduce((acc,cur)=>{
           let itemobj=Object.assign({},cur);
           itemobj.value=cur.nodeId;
           itemobj.label=cur.nodeName;
           acc.push(itemobj);
           return acc
       },[])
      }else{
        return []
      }
    }

  },
  data() {
    return {
      title: "审批意见",
      agreecontent:'',
      returnOption:'',
      returnContent:'',//驳回审批意见
      treedata: [],
      loading: false, // z最大loading
      tree_loading: true, // 左边的 的loading
      tableLoading: false, // 中间的 的loading
      componentData: [
        {
          tab: "筛选结果",
          columns: [
            { key: "NAME", title: "用户名" },
            { key: "ENAME", title: "用户姓名" }
          ],
          list: [],
          total: 0,
          pageSize: 10,
          pageNum: 1, //当前页码
          pageOptions: [10, 20, 50, 100],
          height: 300
        }
      ],
      resultData: {}, // 选中结果
      selectRow: {}, //选中的行
      obj:{}//
    };
  },
  methods: {
    treeTransArray(tree, key) {
      //数转化为数组
      return tree
        .reduce(function iteration(con, item) {
          con.push(item);
          if (item[key] && item[key].length > 0)
            item[key].reduce(iteration, con);
          return con;
        }, [])
        .map(function(item) {
          item[key] = [];
          return item;
        });
    },
    //表格体数据转化
    transferTbody(data) {
      this.componentData[0].total = data.totalRowCount;
      this.componentData[0].pageOptions = data.selectrange;
      //this.componentData[0].pageSize = data.rowCount;
      // this.componentData[0].pageNum = data.rowCount;
      this.componentData[0].list = [];
      data.row.map(item => {
        let tem = {};
        Object.keys(item).map(inner => {
          tem[inner] = item[inner].val;
        });
        if (this.APPROVEL_DRIVER_LIST && this.APPROVEL_DRIVER_LIST.length > 0) {
          //给表格设置默认选中
          this.APPROVEL_DRIVER_LIST.map(inner => {
            if (tem.ID === inner.approve_value) {
              tem._checked = true;
            }
          });
        }
        this.componentData[0].list.push(tem);
      });
    },
    //查找用户信息
    findUser(param) {
      this.tableLoading = true;
      this.$network.post("/jflow/p/c/identity/user/list", param).then(res => {
        this.tableLoading = false;
        let data = res.data;
        if (data.code === 0) {
          this.transferTbody(data.datas);
        }
      });
    },
    //获取树数据
    getTreeData() {
      this.$network.post("/jflow/p/c/identity/org/treeload", {}).then(res => {
        this.tree_loading = false;
        if (res.data.resultCode === 0) {
          this.treedata = [];
          this.treedata = this.arrayTransTree(
            res.data.data.records,
            "CP_C_ORGUP_ID"
          );
          this.findUser({});
        }
      });
    },
    //改造树数据的结构
    arrayTransTree(list, key) {
      let parent = [];
      let children = [];
      list.map(item => {
        item.expand = false;
        item.title = item.ENAME;
        if (item[key] === null || item[key] === "") {
          //根节点
          parent.push(item);
        } else {
          //有父节点的
          children.push(item);
        }
      });
      this.translator(parent, children, key);
      return parent;
    },
    translator(parents, children, key) {
      let temp = [];
      children.map(item => {
        //对子节点数据进行深复制，这里只支持部分类型的数据深复制，对深复制不了解的童靴可以先去了解下深复制
        let temItem = Object.assign({}, item);
        temp.push(temItem);
      });
      //遍历父节点数据
      parents.map(parent => {
        //遍历子节点数据
        children.map((current, index) => {
          //此时找到父节点对应的一个子节点
          if (current[key] === parent.ID) {
            //让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
            temp.splice(index, 1);
            //让当前子节点作为唯一的父节点，去递归查找其对应的子节点
            this.translator([current], temp, key);
            //把找到子节点放入父节点的children属性中
            parent.children
              ? parent.children.push(current)
              : (parent.children = [current]);
          }
        });
      });
    },
    selectTtree(val, vm) {
      // console.log(val, vm);
      this.obj = {};
      this.saveObj = val[0];
      let self = this;
      let valID = val[0].ID.split(".")[1];
      valID = parseInt(valID);
      if (val[0].CP_C_ORGUP_ID === null) {
        //根节点
        this.findUser({});
      } else {
        //当item的TYPE为店仓时
        if (val[0].TYPE === "CP_C_STORE_ID") {
          this.obj.CP_C_STORE_ID = "in(" + valID + ")";
        }
        //当item的TYPE为供应商时
        //  当item的TYPE为组织时
        if (val[0].TYPE === "CP_C_HRORG_ID") {
          this.$network
            .post("/jflow/p/c/identity/org/treequery", { ID: valID })
            .then(res => {
              if (res.data.resultCode === 0) {
                let HRORG = "in ("; //储存键名为CP_C_HRORG_ID对象的ID
                let STORE = "in ("; //储存键名为CP_C_STORE_ID对象的ID
                if (
                  res.data.data.CP_C_HRORG &&
                  res.data.data.CP_C_HRORG.length > 0
                ) {
                  res.data.data.CP_C_HRORG.forEach(item => {
                    HRORG += item.ID + ","; // in 1,2,3,5,6,87,8,6
                  });
                  if (res.data.data.CP_C_HRORG.length > 0) {
                    self.obj.CP_C_HRORG_ID =
                      HRORG.substring(0, HRORG.length - 1) + ")";
                  }
                }
                if (
                  res.data.data.CP_C_STORE &&
                  res.data.data.CP_C_STORE.length > 0
                ) {
                  res.data.data.CP_C_STORE.forEach(item => {
                    STORE += item.ID + ",";
                  });
                  if (res.data.data.CP_C_STORE.length > 0) {
                    self.obj.CP_C_STORE_ID =
                      STORE.substring(0, STORE.length - 1) + ")";
                  }
                }
              } else {
                this.$Modal.fcError({
                  title: "错误提示",
                  content: res.data.resultMsg
                });
              }
            });
        }
        setTimeout(function() {
          self.findUser(self.obj);
        });
      }
    },
    changeTtree(selectedData, vm) {

    },
    changePage(index, vm) {
      this.componentData[0].pageNum = index;
      let param = Object.assign(this.obj, {
        page: index,
        pageSize: this.componentData[0].pageSize
      });
      this.findUser(param);
    },
    changePageSize(index, vm) {
      this.componentData[0].pageSize = index;
      let param = Object.assign(this.obj, {
        page: this.componentData[0].pageNum,
        pageSize: index
      });
      this.findUser(param);
    },
    rowClick(row, index, vm) {
      this.selectRow = Object.assign(this.selectRow, row);
    },
    //搜索
    inputsearch(event, vm) {
      let param = Object.assign(this.obj, {
        page: this.componentData[0].pageNum,
        pageSize: this.componentData[0].pageSize,
        ENAME: event
      });
      this.findUser(param);
    },
    transfer(vm) {
      this.resultData.total
        ? (this.resultData.total = 1)
        : this.$set(this.resultData, "total", 1);
      let selectObj = Object.assign({}, this.selectRow);
      selectObj.string = selectObj.ENAME;
      if (this.resultData.list) {
        this.resultData.list = [];
        this.resultData.list.push(selectObj);
      } else {
        this.$set(this.resultData, "list", [selectObj]);
      }
       this.componentData[0].list.map(item => {
        item._checked = false;
      });
      this.componentData[0].list = this.componentData[0].list.concat([]);
    },
    deleteLi(index, tem) {
      //删除li
      this.resultData.total = this.resultData.total - 1;
      this.resultData.list.splice(index, 1);
    },
    deleBtn(vm) {
      //全部清空事件
      this.resultData.total = 0;
      this.resultData.list = [];
      // this.componentData[0].list.map(item => {
      //   item._checked = false;
      // });
      // this.componentData[0].list = this.componentData[0].list.concat([]);
    },
    ok() {
        if(this.type==='0'){
            this.Agree();//同意
        }
        if(this.type==='1'){
            this.back();//驳回
        }
        if(this.type==='3'){
            this.delegate();//转派
        }
    },
    cancel(){
     window.jflowPlugin.open({control:false})
    },
    Agree() {
      let param = {};
      param.instanceId = this.modalConfig.instanceId;
      param.userId = window.jflowPlugin.userInfo.id;
      param.description = this.agreecontent; //审批意见
      this.$network.post(this.modalConfig.url, param).then(res => {
        if (res.data.resultCode === 0) {
          this.$Message.success(res.data.resultMsg);
          window.jflowPlugin.open({control:false})
          this.modalConfig.buttons(this.modalConfig.id)
        } else {
           this.$Message.warning(res.data.resultMsg);
        }
      });
    },
    //驳回
    back() {
      let param = {};
      param.instanceId = this.modalConfig.instanceId;
      param.userId = window.jflowPlugin.userInfo.id;
      if(this.returnOption===''){
        this.$Message.warning("驳回节点不能为空")
        window.jflowPlugin.open({control:false})
        return
      }else{
        param.backId = this.returnOption; //驳回节点id
      }
      param.description = this.returnContent; //审批意见
      this.$network.post(this.modalConfig.url, param).then(res => {
        if (res.data.resultCode === 0) {
           this.$Message.success(res.data.resultMsg);
          window.jflowPlugin.open({control:false})
          this.modalConfig.buttons(this.modalConfig.id)
        } else {
           this.$Message.warning(res.data.resultMsg);
        }
      });
    },
    //转派
    delegate() {
      let param = {};
      param.instanceId = this.modalConfig.instanceId;
      param.userId = window.jflowPlugin.userInfo.id;
      param.delegateId = this.selectRow.ID;; //驳回节点id
      this.$network.post(this.modalConfig.url, param).then(res => {
        if (res.data.resultCode === 0) {
          this.$Message.success(res.data.resultMsg);
          window.jflowPlugin.open({control:false})
          this.modalConfig.buttons(this.modalConfig.id)
        } else {
           this.$Message.warning(res.data.resultMsg);
        }
      });
    }
  },
  created(){
    this.getTreeData();
  }
};
</script>
<style lang="less" scoped>
.ApprovelModel {
  .returnWrap{
    width:100%;
    display: flex;
    .requireStyle{
    color:red;
    line-height:24px;
  }
  .burgeon-select .burgeon-select-single .burgeon-select-default{
     width:calc(100%-10px);
  }
  }
  
 
}
</style>



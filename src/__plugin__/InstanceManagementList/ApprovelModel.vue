<template>
  <div>
    <Modal
      v-model="modalConfig.control"
      :title="type==='3'?'选择转派人':type==='9'?'人工干预':'审批意见'"
      :mask="true"
      :width="type==='3'?835:520"
      :ok-text="type === '9'?'提交':'确定'"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <!-- 同意 -->
      <div
        v-if="type==='0' || type === '8'"
        class="ApprovelModel"
      >
        <Input
          v-model="agreecontent"
          type="textarea"
          :rows="4"
          placeholder="请输入审批意见"
        />
      </div>

      <!-- 驳回 -->
      <div
        v-if="type==='1'"
        class="ApprovelModel"
      >
        <Input
          v-model="returnContent"
          type="textarea"
          :rows="4"
          placeholder="请输入审批意见"
        />
      </div>

      <!-- 转派 -->
      <div
        v-if="type==='3'"
        class="ApprovelModel"
      >
        <mutipleSelectPop
          ref="dialogtest"
          :loading="loading"
          :tree-loading="tree_loading"
          :table-loading="tableLoading"
          :treedata="treedata"
          :component-data="componentData"
          :result-data="resultData"
          :is-use="false"
          @on-select-tree="selectTtree"
          @on-change-tree="changeTtree"
          @on-change-page="changePage"
          @on-change-pageSize="changePageSize"
          @on-row-dblclick="rowdbClick"
          @on-row-click="rowClick"
          @on-search="inputsearch"
          @on-transfer="transfer"
          @on-delectli="deleteLi"
          @on-deleBtn="deleBtn"
        />
      </div>

      <!-- 人工干预 -->
      <div
        v-if="type==='9'"
        class="ApprovelModel Intervention"
      >
        <div class="details">
          <p
            class="title"
          >
            <span />
            <span>报错信息：</span>
          </p>

          <div>
            <p>
              流程报错:{{ intervention.errorType }}
            </p>
            <p>
              错误简述:{{ intervention.errorMsg }}
            </p>
            <p>
              所在节点:{{ intervention.currentNodeName }}
            </p>
            <p>
              建议措施:{{ intervention.handleOpinion }}
            </p>
          </div>
        </div>
        <div class="deal">
          <p
            class="title"
          >
            <span />
            <span>人工干预处理：</span>
          </p>

          <div style="padding-left: 20px">
            <!-- 接口不通 -->
            <div v-if="Number(intervention.errorCode) === 47">
              <p>
                <label>URL:</label>
                <Input
                  v-model="intervention.handleUrl"
                  type="text"
                />
              </p>
              <p>
                <label>服务参数:</label>
                <Input
                  v-model="intervention.handleParam"
                  type="textarea"
                  class="textarea"
                  :autosize="{ minRows: 3, maxRows: 3 }"
                />
              </p>
            </div>

            <!-- 条件不符 -->
            <div
              v-if="Number(intervention.errorCode) === 5"
              style="margin-bottom:8px;display:flex;align-items: center;"
            >
              <label>干预至某节点:</label>
              <Select
                v-model="selectedNodeValue"
                style="flex:1;margin-left: 10px;"
                class="checkSelect"
                label-in-value
                @on-change="(data) => {selectedNodeValue = data?data.value:null;selectedNode = data}"
              >
                <Option
                  v-for="item in intervention.mannalNodes"
                  :key="item.nodeName"
                  :value="item.nodeId"
                >
                  {{ item.nodeName }}
                </Option>
              </Select>
              <!-- <Select
                v-if="selectCheck === 1"
                v-model="selectedNodeValue"
                class="checkSelect"
                label-in-value
                @on-change="(data) => {selectedNodeValue = data?data.value:null;selectedNode = data}"
              >
                <Option
                  v-for="item in intervention.backNodes"
                  :key="item.nodeName"
                  :value="item.nodeId"
                >
                  {{ item.nodeName }}
                </Option>
              </Select> -->
            </div>

            <!-- 节点报错 -->
            <div v-if="Number(intervention.errorCode) === 33">
              <p>
                <label>人员指派:</label>
              </p>
            </div>

            <!-- 提交失败 -->
            <div v-if="Number(intervention.errorCode) === 53">
              <RadioGroup
                v-model="submitType"
                vertical
                @on-change="selectBackNode = null"
              >
                <Radio :label="0">
                  <span>重新提交</span>
                </Radio>
                <div style="display:flex">
                  <Radio
                    :label="1"
                    style="margin-right: 2px;"
                  >
                    <span>驳回至</span>
                  </Radio>
                  <Select
                    v-model="selectBackNode"
                    class="checkSelect"
                    label-in-value
                    :disabled="submitType === 0"
                  >
                    <Option
                      v-for="item in intervention.backNodes"
                      :key="item.nodeName"
                      :value="item.nodeId"
                    >
                      {{ item.nodeName }}
                    </Option>
                  </Select>
                </div>
              </RadioGroup>
            </div>

            <!-- 备注字段 -->
            <p>
              <label>备注:</label>
              <Input
                v-model="remark"
                type="text"
              />
            </p>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
  import mutipleSelectPop from './MutipleSelectPop.vue';
  import { BacklogData } from '../../plugin/todoList';
  import { DispatchEvent } from '../../__utils__/dispatchEvent';

  export default {
    name: 'ApprovelModel',
    components: { mutipleSelectPop },
    props: {
      config: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      modalConfig() {
        return this.config;
      },
      type() {
        return this.modalConfig.type;
      },
      returnSelection() {
        if (this.modalConfig.selection && this.modalConfig.selection.length > 0) {
          return this.modalConfig.selection.reduce((acc, cur) => {
            const itemobj = Object.assign({}, cur);
            itemobj.value = cur.nodeId;
            itemobj.label = cur.nodeName;
            acc.push(itemobj);
            return acc;
          }, []);
        } 
        return [];
      }
    },
    data() {
      return {
        title: '审批意见',
        agreecontent: '',
        returnOption: '',
        returnContent: '', // 驳回审批意见
        treedata: [],
        loading: false, // z最大loading
        tree_loading: true, // 左边的 的loading
        tableLoading: false, // 中间的 的loading
        componentData: [
          {
            tab: '筛选结果',
            columns: [
              { key: 'NAME', title: '用户名' },
              { key: 'ENAME', title: '用户姓名' }
            ],
            list: [],
            total: 0,
            pageSize: 10,
            pageNum: 1, // 当前页码
            pageOptions: [10, 20, 50, 100],
            height: 300
          }
        ],
        resultData: {}, // 选中结果
        selectRow: {}, // 选中的行
        obj: {}, //


        intervention: {}, // 人工干预数据
        selectCheck: 0, // 0同意 1驳回
        selectedNode: null, // 选中节点
        selectedNodeValue: null, // 选中节点值
        ApproverLists: {}, // 人员指派
        submitType: 0, // 提交失败选择类型
        selectBackNode: null, // 提交失败驳回节点
        remark: null // 备注
      };
    },
    methods: {
      // 表格体数据转化
      transferTbody(data) {
        this.componentData[0].total = data.totalRowCount;
        this.componentData[0].pageOptions = data.selectrange;
        this.componentData[0].list = [];
        data.row.map((item) => {
          const tem = {};
          Object.keys(item).map((inner) => {
            tem[inner] = item[inner].val;
          });
          if (this.APPROVEL_DRIVER_LIST && this.APPROVEL_DRIVER_LIST.length > 0) {
            // 给表格设置默认选中
            this.APPROVEL_DRIVER_LIST.map((inner) => {
              if (tem.ID === inner.approve_value) {
                tem._checked = true;
              }
            });
          }
          this.componentData[0].list.push(tem);
        });
      },
      // 查找用户信息
      findUser(param) {
        this.tableLoading = true;
        this.$network.post('/jflow/p/c/identity/user/list', param).then((res) => {
          this.tableLoading = false;
          const data = res.data;
          if (data.code === 0) {
            this.transferTbody(data.data);
          }
        });
      },
      // 获取树数据
      getTreeData() {
        this.treeLoading = true;
        this.$network.post('/jflow/p/c/identity/org/treeload', {}).then((res) => {
          this.treeLoading = false;
          if (res.data.resultCode === 0) {
            this.treeNewData = [];
            const newArr = [];
            // let root = {};
            if (res.data.data.records.length > 0) {
              res.data.data.records.forEach((item) => {
                const tem = Object.assign(item);
                newArr.push(tem);
              // if (
              //   item["CP_C_ORGUP_ID"] === null ||
              //   item["CP_C_ORGUP_ID"] === ""
              // ) {
              //   root = Object.assign({}, item);
              // }
              });
              this.treeNewData = this.arrayTransTree(newArr, 'CP_C_ORGUP_ID');
            }
            this.findUser({}); // 显示所有的用户
          }
        });
      },
      // 改造树数据的结构
      arrayTransTree(list, key) {
        let parent = [];
        const children = [];
        list.map((item) => {
          item.expand = false;
          item.title = key === 'CP_C_ORGUP_ID' ? item.ENAME : item.NAME;
          if (
            !item[key]
            || (String(item[key]).indexOf('.') !== -1 && !String(item[key]).split('.')[1])
          ) {
            // 根节点
            parent.push(item);
          } else {
            // 有父节点的
            children.push(item);
          }

          return item;
        });
        if (parent.length < 1) {
          // 没有根节点
          const newParent = this.findTreeRootFirstChild(list, key); // 拿到一级节点
          const rootArr = newParent.map(item => item[key]);
          const rootTem = Array.from(new Set([...rootArr]));
          if (rootTem.length === 1) {
            if (key === 'CP_C_ORGUP_ID') {
              parent = [
                {
                  CP_C_ORGUP_ID: null,
                  ECODE: '00000',
                  ENAME: '全部',
                  ID: rootTem[0],
                  MIXNAME: '[00000]全部',
                  ORGTYPE: 'IN',
                  TYPE: 'CP_C_HRORG_ID',
                  title: '全部'
                }
              ];
            } else {
              parent = [
                {
                  PARENT_ID: null,
                  NAME: '全部',
                  ID: rootTem[0],
                  MIXNAME: '[00000]全部',
                  ORGTYPE: 'IN',
                  TYPE: 'CP_C_HRORG_ID',
                  title: '全部'
                }
              ];
            }
          
            this.translator(parent, children, key);
            return parent;
          } 
          this.$Message.warning('数据有问题，请检查...');
          return 'error';
        } 
        this.translator(parent, children, key);

        return parent;
      },
      translator(parents, children, key) {
        const temp = [];
        children.map((item) => {
          // 对子节点数据进行深复制，这里只支持部分类型的数据深复制
          const temItem = Object.assign({}, item);
          temp.push(temItem);
        });
        // 遍历父节点数据
        parents.map((parent) => {
          // 遍历子节点数据
          children.map((current, index) => {
            // 此时找到父节点对应的一个子节点
            if (current[key] === parent.ID) {
              // 让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
              temp.splice(index, 1);
              // 让当前子节点作为唯一的父节点，去递归查找其对应的子节点
              this.translator([current], temp, key);
              // 把找到子节点放入父节点的children属性中
              parent.children
                ? parent.children.push(current)
                : (parent.children = [current]);
            }
          });
        });
      },
      treeTransArray(tree, key) {
        return tree
          .reduce(function iteration(con, item) {
            con.push(item);
            if (item[key] && item[key].length > 0) { item[key].reduce(iteration, con); }
            return con;
          }, [])
          .map((item) => {
            item[key] = [];
            return item;
          });
      },
      findTreeRootFirstChild(Arr, key) {
        let idArr = [];
        const result = [];
        idArr = Arr.map(item => item.ID);
        Arr.map((item) => {
          if (!idArr.includes(item[key])) {
            // 一级节点的特点是存在父节点 但是已父节点为ID的节点是不存在的
            result.push(item);
          }
        });
        return result;
      },
      selectTtree(val, vm) {
        this.obj = {};
        if (this.val.length > 0) {
          this.saveObj = val[0];
          const self = this;
          let valID = val[0].ID.split('.')[1];
          valID = parseInt(valID);
          if (val[0].CP_C_ORGUP_ID === null) {
            // 根节点
            this.findUser({});
          } else {
            // 当item的TYPE为店仓时
            if (val[0].TYPE === 'CP_C_STORE_ID') {
              this.obj.CP_C_STORE_ID = `in(${valID})`;
            }
            // 当item的TYPE为供应商时
            //  当item的TYPE为组织时
            if (val[0].TYPE === 'CP_C_HRORG_ID') {
              this.$network
                .post('/jflow/p/c/identity/org/treequery', { ID: valID })
                .then((res) => {
                  if (res.data.resultCode === 0) {
                    let HRORG = 'in ('; // 储存键名为CP_C_HRORG_ID对象的ID
                    let STORE = 'in ('; // 储存键名为CP_C_STORE_ID对象的ID
                    if (
                      res.data.data.CP_C_HRORG
                      && res.data.data.CP_C_HRORG.length > 0
                    ) {
                      res.data.data.CP_C_HRORG.forEach((item) => {
                        HRORG += `${item.ID},`; // in 1,2,3,5,6,87,8,6
                      });
                      if (res.data.data.CP_C_HRORG.length > 0) {
                        self.obj.CP_C_HRORG_ID = `${HRORG.substring(0, HRORG.length - 1)})`;
                      }
                    }
                    if (
                      res.data.data.CP_C_STORE
                      && res.data.data.CP_C_STORE.length > 0
                    ) {
                      res.data.data.CP_C_STORE.forEach((item) => {
                        STORE += `${item.ID},`;
                      });
                      if (res.data.data.CP_C_STORE.length > 0) {
                        self.obj.CP_C_STORE_ID = `${STORE.substring(0, STORE.length - 1)})`;
                      }
                    }
                  } else {
                    this.$Modal.fcError({
                      title: '错误提示',
                      content: res.data.resultMsg
                    });
                  }
                });
            }
            setTimeout(() => {
              self.findUser(self.obj);
            });
          }
        }
      },
      changeTtree(selectedData, vm) {},
      changePage(index, vm) {
        this.componentData[0].pageNum = index;
        const param = Object.assign(this.obj, {
          page: index,
          pageSize: this.componentData[0].pageSize
        });
        this.findUser(param);
      },
      changePageSize(index, vm) {
        this.componentData[0].pageSize = index;
        const param = Object.assign(this.obj, {
          page: this.componentData[0].pageNum,
          pageSize: index
        });
        this.findUser(param);
      },
      rowClick(row, index, vm) {
        this.selectRow = Object.assign(this.selectRow, row);
      },
      rowdbClick(row, index) {
        // 双击事件
        const selectObj = Object.assign({}, row);
        selectObj.string = selectObj.ENAME;
        if (this.resultData.list) {
          this.resultData.list = [];
          this.resultData.list.push(selectObj);
        } else {
          this.$set(this.resultData, 'list', [selectObj]);
        }
        this.resultData.total
          ? (this.resultData.total = 1)
          : this.$set(this.resultData, 'total', 1);
        this.componentData[0].list.map((item, i) => {
          item._checked = false;
        });
        this.selectRow = Object.assign({}, row);
      },
      // 搜索
      inputsearch(event, vm) {
        const param = Object.assign(this.obj, {
          page: this.componentData[0].pageNum,
          pageSize: this.componentData[0].pageSize,
          ENAME: event
        });
        this.findUser(param);
      },
      transfer(vm) {
        // eslint-disable-next-line no-unused-expressions
        this.resultData.total
          ? (this.resultData.total = 1)
          : this.$set(this.resultData, 'total', 1);
        const selectObj = Object.assign({}, this.selectRow);
        selectObj.string = selectObj.ENAME;
        if (this.resultData.list) {
          this.resultData.list = [];
          this.resultData.list.push(selectObj);
        } else {
          this.$set(this.resultData, 'list', [selectObj]);
        }
        this.componentData[0].list.map((item) => {
          item._checked = false;
        });
        this.componentData[0].list = this.componentData[0].list.concat([]);
      },
      deleteLi(index, tem) {
        // 删除li
        this.resultData.total = this.resultData.total - 1;
        this.resultData.list.splice(index, 1);
      },
      deleBtn(vm) {
        // 全部清空事件
        this.resultData.total = 0;
        this.resultData.list = [];
      },
      ok() {
        if (this.type === '0' || this.type === '8') {
          this.Agree(); // 同意
        }
        if (this.type === '1') {
          this.back(); // 驳回
        }
        if (this.type === '3') {
          this.delegate(); // 转派
        }

        if (this.type === '9') {
          this.interventionConfirm(); // 人工干预
        }
      },
      cancel() {
        window.jflowPlugin.open({ control: false });
      },
      Agree() {
        // const children = document.getElementsByClassName('operate-btn')[0].children;
        // for (const child of children) {
        //   if (child.innerText.trim() !== '同意') {
        //     child.setAttribute('disabled', 'disabled');
        //   }
        // }
        const param = {};
        param.instanceId = window.jflowPlugin.objInstanceId;
        param.userId = window.jflowPlugin.userInfo.id;
        param.nodeId = window.jflowPlugin.nodeId;
        param.description = this.agreecontent; // 审批意见
        param.businessCode = window.jflowPlugin.router.currentRoute.params.itemId;
        param.businessType = window.jflowPlugin.router.currentRoute.params.tableId;
        param.businessName = window.jflowPlugin.router.currentRoute.params.tableName;
        this.$network.post(this.modalConfig.url, param).then(async (res) => {
          window.jflowPlugin.open({ control: false });
          if (res.data.resultCode === 0) {
            this.$Message.success(res.data.resultMsg);
            await this.modalConfig.buttons(window.jflowPlugin.itemId);
            BacklogData(window.jflowPlugin.store);
            DispatchEvent('jflowClick', {
              detail: {
                type: 'refresh'
              }
            });
          } else {
            this.$Modal.fcError({
              title: '错误',
              content: res.data.resultMsg,
              mask: true
            });
          }
        });
      },
      // 驳回
      back() {
        // const children = document.getElementsByClassName('operate-btn')[0].children;
        // for (const child of children) {
        //   if (child.innerText.trim() !== '驳回') {
        //     child.setAttribute('disabled', 'disabled');
        //   }
        // }
        const param = {};
        param.instanceId = window.jflowPlugin.objInstanceId;
        param.userId = window.jflowPlugin.userInfo.id;
        param.nodeId = window.jflowPlugin.nodeId;
        param.businessCode = window.jflowPlugin.router.currentRoute.params.itemId;
        param.businessType = window.jflowPlugin.router.currentRoute.params.tableId;
        param.businessName = window.jflowPlugin.router.currentRoute.params.tableName;
        param.moduleId = window.jflowPlugin.moduleId;
        // if (this.returnOption === "") {
        //   this.$Message.warning("驳回节点不能为空");
        //   window.jflowPlugin.open({ control: false });
        //   return;
        // } else {
        //   param.backId = this.returnOption; //驳回节点id
        // }
        param.description = this.returnContent; // 审批意见
        this.$network.post(this.modalConfig.url, param).then((res) => {
          window.jflowPlugin.open({ control: false });
          if (res.data.resultCode === 0) {
            this.$Message.success(res.data.resultMsg);
            this.modalConfig.buttons(window.jflowPlugin.itemId);
            BacklogData(window.jflowPlugin.store);
            DispatchEvent('jflowClick', {
              detail: {
                type: 'refresh'
              }
            });
          } else {
            this.$Modal.fcError({
              title: '错误',
              content: res.data.resultMsg,
              mask: true
            });
          }
        });
      },
      // 转派
      delegate() {
        // const children = document.getElementsByClassName('operate-btn')[0].children;
        // for (const child of children) {
        //   if (child.innerText.trim() !== '转派') {
        //     child.setAttribute('disabled', 'disabled');
        //   }
        // }
        const param = {};
        param.instanceId = window.jflowPlugin.objInstanceId;
        param.userId = window.jflowPlugin.userInfo.id;
        param.delegateId = this.selectRow.ID; // 驳回节点id
        this.$network.post(this.modalConfig.url, param).then((res) => {
          window.jflowPlugin.open({ control: false });
          if (res.data.resultCode === 0) {
            this.$Message.success(res.data.resultMsg);
            this.selectRow = {};
            this.modalConfig.buttons(window.jflowPlugin.itemId);
            BacklogData(window.jflowPlugin.store);
            DispatchEvent('jflowClick', {
              detail: {
                type: 'refresh'
              }
            });
          } else {
            this.$Modal.fcError({
              title: '错误',
              content: res.data.resultMsg,
              mask: true
            });
          }
        });
      },

      // 获取人工干预信息
      getIntervention() {
        this.$network.post('/jflow/p/cs/error/pageMsg', {
          instanceId: window.jflowPlugin.objInstanceId,
          nodeId: window.jflowPlugin.nodeId,
          userId: window.jflowPlugin.userInfo.id,
          errorCode: this.config.item.errorCode,
          errorTaskId: this.config.item.errorTaskId,
          batch: this.config.item.batch
        })
          .then((res) => {
            if (res.data.resultCode === 0) {
              this.intervention = res.data.data;
            }
          });
      },
      // 人工干预提交
      interventionConfirm() {
        switch (Number(this.intervention.errorCode)) {
        case 33: // 节点报错
          this.ApproverConfirm();
          break;
        case 5: // 条件不符
          this.errAction();
          break;
        case 47: // 接口不通
          this.invocationFail();
          break;
        case 53: // 提交失败
          this.manualsubmit();
          break;
        default:
          break;
        }
      },

      // 条件不符
      errAction() {
        if (!this.selectedNode) {
          this.$Modal.fcWarning({
            title: '警告',
            content: `请选择${this.selectCheck === 0 ? '同意' : '驳回'}节点`,
            mask: true
          });
          return;
        }
        const obj = {
          instanceId: window.jflowPlugin.objInstanceId,
          id: this.intervention.exceptionId,
          nodeId: window.jflowPlugin.nodeId,
          initiator: this.intervention.initiator,
          processStatus: this.intervention.processStatus,
          batch: this.intervention.batch,
          actType: this.selectCheck,
          backNodeId: this.selectedNode.value,
          passNodeId: this.selectedNode.value,
          errorCode: this.intervention.errorCode,
          errorMsg: this.intervention.errorMsg,
          errorBody: this.intervention.errorBody,
          startTime: this.intervention.startTime,
          manualNode: this.selectedNode.label,
          operaterName: window.jflowPlugin.userInfo.ename,
          handleRemark: this.remark
        };

        this.$network.post('/jflow/p/cs/error/errAction', obj)
          .then((res) => {
            if (res.data.resultCode === 0) {
              // this.$parent.$parent.modalType = 'FlowChartShow'
              this.selectCheck = 0;
              this.selectedNode = null;
              this.selectedNodeValue = null;
              this.remark = null;
              if (res.data.resultCode === 0) {
                this.$Message.success(res.data.resultMsg);
                this.modalConfig.buttons(window.jflowPlugin.itemId);
                BacklogData(window.jflowPlugin.store);
                DispatchEvent('jflowClick', {
                  detail: {
                    type: 'refresh'
                  }
                });
              } else {
                this.$Modal.fcError({
                  title: '错误',
                  content: res.data.resultMsg,
                  mask: true
                });
              }
            }
          });
      },  
      ApproverConfirm() { // 节点报错提交
        if (this.ApproverLists.list && this.ApproverLists.list.length > 0) {
          const obj = {
            instanceId: window.jflowPlugin.objInstanceId,
            id: this.intervention.exceptionId,
            nodeId: window.jflowPlugin.nodeId,
            initiator: this.intervention.initiator,
            processStatus: this.intervention.processStatus,
            batch: this.intervention.batch,
            approverInfo: this.ApproverLists.list,
            errorCode: this.intervention.errorCode,
            errorMsg: this.intervention.errorMsg,
            errorBody: this.intervention.errorBody,
            startTime: this.intervention.startTime,
            handleRemark: this.remark,
            operaterName: window.jflowPlugin.userInfo.ename
          };
          this.$network.post('/p/cs/error/modifyApprover', obj)
            .then((res) => {
              if (res.data.resultCode === 0) {
                this.ApproverLists = {};
                this.remark = null;
                this.$Message.success(res.data.resultMsg);
                this.modalConfig.buttons(window.jflowPlugin.itemId);
                BacklogData(window.jflowPlugin.store);
                DispatchEvent('jflowClick', {
                  detail: {
                    type: 'refresh'
                  }
                });
              } else {
                this.$Modal.fcError({
                  title: '错误',
                  content: res.data.resultMsg,
                  mask: true
                });
              }
            });
        } else {
          this.$Modal.fcWarning({
            title: '提示',
            content: '请选择审批人!'
          });
        }
      },
      // 接口不通
      invocationFail() {
        try {
          const reg = /^\{/;
          if (this.intervention.handleParam) {
            if (reg.test(this.intervention.handleParam)) {
              JSON.parse(this.intervention.handleParam);
            } else {
              this.$Modal.fcError({
                title: '错误',
                content: '服务参数数据格式错误',
                mask: true
              });
              return;
            }
          }
        
          const obj = {
            instanceId: window.jflowPlugin.objInstanceId,
            id: this.intervention.exceptionId,
            nodeId: window.jflowPlugin.nodeId,
            userId: window.jflowPlugin.userInfo.id,
            handleUrl: this.intervention.handleUrl,
            handleParam: this.intervention.handleParam,
            handleRemark: this.remark,
            errorTaskId: this.intervention.errorTaskId,
            exceptionId: this.intervention.exceptionId,
            operaterName: window.jflowPlugin.userInfo.ename
          };
          this.$network.post('/p/cs/error/invocationFail', obj)
            .then((res) => {
              if (res.data.resultCode === 0) {
                this.$Message.success(res.data.resultMsg);
                this.modalConfig.buttons(window.jflowPlugin.itemId);
                BacklogData(window.jflowPlugin.store);
                DispatchEvent('jflowClick', {
                  detail: {
                    type: 'refresh'
                  }
                });
              }
            });
        } catch (err) {
          this.$Modal.fcError({
            title: '错误',
            content: '服务参数数据格式错误',
            mask: true
          });
        }
      },
      // 提交失败
      manualsubmit() {
        let url = null;
        let obj = {};
        if (this.submitType === 0) { // 重新提交
          url = '/p/cs/error/manualsubmit';
          obj = {
            instanceId: window.jflowPlugin.objInstanceId,
            errorTaskId: this.intervention.errorTaskId,
            exceptionId: this.intervention.exceptionId,
            nodeId: window.jflowPlugin.nodeId,
            handleRemark: this.remark,
            id: this.intervention.exceptionId,
            operaterName: window.jflowPlugin.userInfo.ename
          };
        } else { // 驳回
          if (!this.selectBackNode) {
            this.$Modal.fcWarning({
              title: '警告',
              content: '请选择驳回节点',
              mask: true
            });
            return;
          }
          url = '/p/cs/error/errAction';
          obj = {
            instanceId: window.jflowPlugin.objInstanceId,
            id: this.intervention.id,
            nodeId: window.jflowPlugin.nodeId,
            initiator: this.intervention.initiator,
            processStatus: this.intervention.processStatus,
            batch: this.intervention.batch,
            actType: 1,
            backNodeId: this.selectBackNode,
            errorCode: this.intervention.errorCode,
            errorMsg: this.intervention.errorMsg,
            errorBody: this.intervention.errorBody,
            startTime: this.intervention.startTime,
            manualNode: this.backNodes.filter(item => item.value === this.selectBackNode)[0].label,
            operaterName: window.jflowPlugin.userInfo.ename,
            errorTaskId: this.intervention.errorTaskId,
          };
        }

        this.$network.post(url, obj)
          .then((res) => {
            if (res.data.resultCode === 0) {
              setTimeout(() => {
                this.selectBackNode = null;
                this.submitType = 0;
                this.remark = null;
                this.$Message.success(res.data.resultMsg);
                this.modalConfig.buttons(window.jflowPlugin.itemId);
                BacklogData(window.jflowPlugin.store);
                DispatchEvent('jflowClick', {
                  detail: {
                    type: 'refresh'
                  }
                });
              });
            }
          });
      },
    },
    created() {
      if (this.config.type === '3') {
        this.getTreeData();
      }

      if (this.config.type === '9') {
        this.getIntervention();
      }
    }
  };
</script>
<style lang="less">
.ApprovelModel {
  .returnWrap {
    width: 100%;
    display: flex;
    .requireStyle {
      color: red;
      line-height: 24px;
    }
    .burgeon-select .burgeon-select-single .burgeon-select-default {
      width: calc(100%-10px);
    }
  }

  &.Intervention{
    .title{
      border-bottom: 1px solid #D8D8D8;
      padding: 4px 10px;
      margin-bottom: 10px;

      >span:first-child{
        width:2px;
        height:12px;
        background:rgba(253,100,66,1);
        vertical-align: middle;
        display: inline-block;
      }
      span{
        color: #FD6442;
      }
    }

    .details{
      >div{
        padding-left: 20px;
        p{
          font-size:12px;
          font-weight:400;
          color:rgba(84,84,84,1);
          line-height:17px;
          margin-bottom: 4px;
        }

        >p:last-child{
          margin-bottom: 16px;
        }
      }
    }

    .deal{
      >div{
        >.checkSelect{
          display: inline-block;
          flex: 1;

          .burgeon-select-selection{
            border-color: #dcdee2;
            box-shadow: none;
          }

          &:first-child{
            width: 60px;
            flex: none;
            .burgeon-select-selection{
              background: #F9F9F9;
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
            }
          }

          &:last-child{
            .burgeon-select-selection{
              border-left: none;
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            }
          } 
        }

        .complexBox{
          width: 100%;
        }
        p{
          line-height: 24px;
          display: flex;
          margin-bottom: 8px;

          >label{
            width: 60px;
            margin-right: 8px;
          }

          .textarea{
            textarea{
              resize: none;
            }
          }
        }
      }
    }
  }
}
</style>

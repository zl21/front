// 人工干预
<template>
  <div :class="classes">
    <div class="content">
      <div
        class="ApprovelModel"
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
                v-model="selectedNode"
                style="flex:1;margin-left: 10px;"
                class="checkSelect"
                label-in-value
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
                <ComplexBox @getTotalResult="getTotalResult" /></complexbox>
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
                      v-for="item in intervention.mannalNodes"
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
    </div>

    <div class="footer">
      <Button
        type="text"
        :disabled="buttonDisabled"
        @click="cancel"
      >
        取消
      </Button>
      <Button
        type="primary"
        :disabled="buttonDisabled"
        @click="interventionConfirm"
      >
        确定
      </Button>
    </div>
  </div>
</template>
<script>
  import { BacklogData } from '../js/todoList';
  import network from '../utils/network';
  import { global } from '../utils/global.config';
  import ComplexBox from './complexPop';
  import { refreshSystem } from '../js/index';
  import { classFix } from '../../src/constants/global';


  export default {
    props: {
      modalConfig: {
        type: Object,
        default: () => ({})
      }
    },
    components: { ComplexBox },
    data() {
      return {
        returnContent: '',
        buttonDisabled: false,

        intervention: {}, // 人工干预数据
        selectCheck: 0, // 0同意 1驳回
        selectedNode: null, // 选中节点
        ApproverLists: {}, // 人员指派
        submitType: 0, // 提交失败选择类型
        selectBackNode: null, // 提交失败驳回节点
        remark: null, // 备注
      };
    },
    computed: {
      classes() {
        return [
          `${classFix}Intervention`,
        ];
      },
    },
    methods: {
      cancel() {
        window.jflowPlugin.open({ control: false });
      },
      // 获取人工干预信息
      getIntervention() {
        network.post('/jflow/p/cs/error/pageMsg', {
          instanceId: global.jflowInfo.instanceId,
          nodeId: global.jflowInfo.nodeId,
          userId: global.userInfo.id,
          errorCode: this.modalConfig.item.errorCode,
          errorTaskId: this.modalConfig.item.errorTaskId,
          batch: this.modalConfig.item.batch
        })
          .then((res) => {
            if (res.data.resultCode === 0) {
              this.intervention = res.data.data;
            }
          });
      },
      // 人工干预
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
          instanceId: global.jflowInfo.instanceId,
          id: this.intervention.exceptionId,
          userId: global.userInfo.id,
          nodeId: global.jflowInfo.nodeId,
          initiator: this.intervention.initiator,
          processStatus: this.intervention.processStatus,
          batch: this.intervention.batch,
          actType: this.intervention.mannalNodes.filter(item => item.nodeId === this.selectedNode)[0].actType,
          mannalNodeId: this.selectedNode,
          errorCode: this.intervention.errorCode,
          errorMsg: this.intervention.errorMsg,
          errorBody: this.intervention.errorBody,
          startTime: this.intervention.startTime,
          mannalNode: this.intervention.mannalNodes.filter(item => item.nodeId === this.selectedNode)[0].nodeName,
          operaterName: global.userInfo.ename,
          handleRemark: this.remark
        };

        network.post('/jflow/p/cs/error/errAction', obj)
          .then(async (res) => {
            if (res.data.resultCode === 0) {
              BacklogData();
              window.jflowPlugin.open({ control: false });
              this.selectCheck = 0;
              this.selectedNode = null;
              this.remark = null;
              if (res.data.resultCode === 0) {
                this.$Message.success(res.data.resultMsg);
                refreshSystem();
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
      // 节点报错的人员指派
      getTotalResult(data) {
        this.ApproverLists = data;
      },
      ApproverConfirm() { // 节点报错提交
        if (this.ApproverLists.list && this.ApproverLists.list.length > 0) {
          const obj = {
            instanceId: global.jflowInfo.instanceId,
            id: this.intervention.exceptionId,
            userId: global.userInfo.id,
            nodeId: global.jflowInfo.nodeId,
            initiator: this.intervention.initiator,
            processStatus: this.intervention.processStatus,
            batch: this.intervention.batch,
            approverInfo: this.ApproverLists.list,
            errorCode: this.intervention.errorCode,
            errorMsg: this.intervention.errorMsg,
            errorBody: this.intervention.errorBody,
            startTime: this.intervention.startTime,
            handleRemark: this.remark,
            operaterName: global.userInfo.ename
          };
          network.post('/jflow/p/cs/error/modifyApprover', obj)
            .then(async (res) => {
              if (res.data.resultCode === 0) {
                BacklogData();
                window.jflowPlugin.open({ control: false });
                this.ApproverLists = {};
                this.remark = null;
                this.$Message.success(res.data.resultMsg);
                refreshSystem();
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
            instanceId: global.jflowInfo.instanceId,
            id: this.intervention.exceptionId,
            nodeId: global.jflowInfo.nodeId,
            userId: global.userInfo.id,
            handleUrl: this.intervention.handleUrl,
            handleParam: this.intervention.handleParam,
            handleRemark: this.remark,
            errorTaskId: this.intervention.errorTaskId,
            exceptionId: this.intervention.exceptionId,
            operaterName: global.userInfo.ename
          };
          network.post('/jflow/p/cs/error/invocationFail', obj)
            .then(async (res) => {
              if (res.data.resultCode === 0) {
                BacklogData();
                window.jflowPlugin.open({ control: false });
                this.$Message.success(res.data.resultMsg);
                this.remark = null;
                refreshSystem();
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
          url = '/jflow/p/cs/error/manualsubmit';
          obj = {
            instanceId: global.jflowInfo.instanceId,
            errorTaskId: this.intervention.errorTaskId,
            exceptionId: this.intervention.exceptionId,
            nodeId: global.jflowInfo.nodeId,
            handleRemark: this.remark,
            id: this.intervention.exceptionId,
            operaterName: global.userInfo.ename,
            userId: global.userInfo.id
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
          url = '/jflow/p/cs/error/errAction';
          obj = {
            instanceId: global.jflowInfo.instanceId,
            id: this.intervention.id,
            nodeId: global.jflowInfo.nodeId,
            initiator: this.intervention.initiator,
            processStatus: this.intervention.processStatus,
            batch: this.intervention.batch,
            actType: this.intervention.mannalNodes.filter(item => item.nodeId === this.selectBackNode)[0].actType,
            mannalNodeId: this.selectBackNode,
            errorCode: this.intervention.errorCode,
            errorMsg: this.intervention.errorMsg,
            errorBody: this.intervention.errorBody,
            startTime: this.intervention.startTime,
            mannalNode: this.intervention.mannalNodes.filter(item => item.nodeId === this.selectBackNode)[0].nodeName,
            operaterName: global.userInfo.ename,
            userId: global.userInfo.id,
            errorTaskId: this.intervention.errorTaskId,
          };
        }

        network.post(url, obj)
          .then((res) => {
            if (res.data.resultCode === 0) {
              BacklogData();
              window.jflowPlugin.open({ control: false });
              setTimeout(async () => {
                this.selectBackNode = null;
                this.submitType = 0;
                this.remark = null;
                this.$Message.success(res.data.resultMsg);
                refreshSystem();
              });
            }
          });
      },
    },
    created() {
      this.getIntervention();
    }
  };
</script>

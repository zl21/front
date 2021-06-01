
<template>
  <div>
    <Modal
      v-model="modalConfig.control"
      :class-name="classes"
      :title="type==='3'?'选择转派人':type==='9'?'人工干预':'审批意见'"
      :mask="true"
      :mask-closable="false"
      :width="type==='3'?835:520"
      :footer-hide="true"
    >
      <component
        :is="currentComponent"
        :modal-config="modalConfig"
      />
      <!-- 同意 -->
      <!-- <div
        v-if="type==='0' || type === '8'"
        class="ApprovelModel"
      >
        <Input
          v-model="agreecontent"
          type="textarea"
          :rows="4"
          placeholder="请输入审批意见"
        />
      </div> -->

      <!-- 驳回 -->
      <!-- <div
        v-if="type==='1'"
        class="ApprovelModel"
      >
        <Input
          v-model="returnContent"
          type="textarea"
          :rows="4"
          placeholder="请输入审批意见"
        />
      </div> -->

      <!-- 转派 -->
      <!-- <div
        v-if="type==='3'"
        class="ApprovelModel"
      >
        <mutipleSelectPop
          v-if="modalConfig.control"
          ref="dialogtest"
          :node-id="config.nodeId"
          :is-mutiple="false"
          :is-use="false"
          @getResult="getResult"
        />
      </div> -->

      <!-- 人工干预 -->
      <div
        v-if="false"
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

      <!-- <div slot="footer">
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
          @click="ok"
        >
          确定
        </Button>
      </div> -->
    </Modal>
  </div>
</template>
<script>

  import Argee from './Argee';
  import Back from './Back';
  import Delegate from './Delegate';
  import Intervention from './Intervention';
  import { classFix } from '../../src/constants/global';

  export default {
    name: 'ApprovelModel',
    props: {
      config: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      classes: () => `${classFix}ApprovelModel`,
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

        currentComponent: null // 当前组建
      };
    },
    created() {
      // 同意，确认
      if (this.config.type === '0' || this.config.type === '8') {
        this.currentComponent = global.components && global.components.Argee ? global.components.Argee : Argee;
      }
      // 驳回
      if (this.config.type === '1') {
        this.currentComponent = global.components && global.components.Back ? global.components.Back : Back;
      }
      // 转派
      if (this.config.type === '3') {
        this.currentComponent = global.components && global.components.Delegate ? global.components.Delegate : Delegate;
      }

      // 人工干预
      if (this.config.type === '9') {
        this.currentComponent = global.components && global.components.Intervention ? global.components.Intervention : Intervention;
        // this.getIntervention();
      }

      // 流程进度
      if (this.config.type === '5') {
        this.currentComponent = global.components.Process;
        // this.getIntervention();
      }
    }
  };
</script>

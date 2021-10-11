<template>
  <div :class="classes">
    <div class="buttonGroup">
      <Button
        type="posdefault"
        @click="saveCubeReport()"
      >
        {{$t('metricsDefinition.saveDefinition')}}
      </Button>
      <Button
        type="fcdefault"
        @click="saveCubeReport()"
      >
        {{$t('metricsDefinition.saveDefinitionSeparately')}}
      </Button>
    </div>
    <Row class="report-intro">
      <span>
        {{$t('metricsDefinition.factTable')}}：
        <em>{{ adTableInfo.NAME }}</em>
      </span>
      <span>
        {{$t('metricsDefinition.reportTemplate')}}：
        <em>{{ adTableInfo.DESCRIPTION }}</em>
      </span>
    </Row>
    <main>
      <div class="parent-box">
        <div class="list">
          <div class="list-header">
            <!-- <Checkbox v-model="isParentAllChecked">可用字段</Checkbox> -->
            {{$t('metricsDefinition.availableField')}}
            <Input
              v-model="fieldName"
              style="width: 92px; height:20px;"
              :placeholder="$t('metricsDefinition.enterFieldName')"
              :expand="false"
              @on-enter="fieldQuery()"
            >
            <Icon
              slot="suffix"
              type="ios-search"
              @click="fieldQuery()"
            />
            </Input>
          </div>
          <div class="treeBox">
            <Tree
              id="treeIcon"
              ref="treeAllCheck"
              :data="list"
              :load-data="loadListData"
              show-checkbox
              @on-check-change="onCheckChange"
            ></Tree>
          </div>
        </div>
      </div>
      <div class="child-box">
        <div
          v-for="(item, idx) in childBoxList"
          :key="idx"
          class="child-item"
        >
          <div class="burgeon-transfer-operation">
            <Button
              :disabled="isParentBtnDisabled"
              type="posdefault"
              size="small"
              @click="getData(idx, item.dataName)"
            >
              &gt;
            </Button>
            <Button
              :disabled="item.isChildBtnDisabled"
              type="posdefault"
              size="small"
              @click="removeData(idx)"
            >
              &lt;
            </Button>
          </div>
          <div class="child-list">
            <div class="list">
              <div class="list-header">
                <!-- <Checkbox v-model="item.isAllChecked">{{ item.name }}</Checkbox> -->
                {{ item.name }}
              </div>
              <div class="list-body">
                <CheckboxGroup
                  v-model="item.childCheckedArr"
                  @on-change="move('child', idx)"
                >
                  <ul>
                    <draggable
                      v-model="item.childList"
                      v-bind="dragOptions"
                      @update="datadragEnd"
                    >
                      <transition-group>
                        <li
                          v-for="(item1, i) in item.childList"
                          :key="`${i+1}`"
                          @dblclick.stop="dbClick(item,item1,idx,$event)"
                        >
                          <Checkbox :label="item1.ID">
                            {{ item1.DESCRIPTION }}
                          </Checkbox>
                        </li>
                      </transition-group>
                    </draggable>
                  </ul>
                </CheckboxGroup>
              </div>
            </div>
            <Button
              class="set-data-btn"
              type="fcdefault"
              size="small"
              :disabled="item.isSetDataDisabled"
              @click="showSetModal(idx)"
            >
              {{ item.setBtnTitle }}
            </Button>
            <Checkbox
              :indeterminate="item.indeterminate"
              :value="item.checkBox"
              @click.prevent.native="checkBatchChange(idx)"
            >
              {{$t('metricsDefinition.ifSelectAll')}}
            </Checkbox>
          </div>
        </div>
      </div>
    </main>
    <p class="tips">
      <Icon type="ios-alert-outline" />
      {{$t('metricsDefinition.lessGroupingField')}}
    </p>
    <Modal
      v-model="isSetDialogShow"
      draggable
      scrollable
      :title="currentIdx != 3 ? $t('metricsDefinition.editGroupField') : $t('metricsDefinition.editSummaryField')"
      @on-ok="saveSetModal()"
    >
      <div v-show="currentIdx != 3">
        <Form
          ref="groupForm"
          :model="groupForm"
          :rules="groupRule"
          :label-width="120"
        >
          <FormItem
            :label="`${$t('metricsDefinition.fieldReference')}：`"
            prop="COLUMN_LINK"
          >
            <Input
              v-model="groupForm.COLUMN_LINK"
              disabled
              placeholder
            /></Input>
          </FormItem>
          <FormItem
            :label="`${$t('tips.description')}：`"
            prop="DESCRIPTION"
          >
            <Input
              v-model="groupForm.DESCRIPTION"
              placeholder
            /></Input>
          </FormItem>
          <FormItem :label="`${$t('metricsDefinition.hideInReport')}：`">
            <Checkbox v-model="groupForm.HIDE_HTML" />
          </FormItem>
        </Form>
      </div>
      <div v-show="currentIdx == 3">
        <Form
          ref="factListForm"
          :model="factListForm"
          :rules="factListRule"
          :label-width="100"
        >
          <FormItem :label="`${$t('metricsDefinition.summaryField')}：`">
            <Input
              v-model="factListForm.COLUMN_LINK"
              disabled
              placeholder
            /></Input>
          </FormItem>
          <FormItem :label="`${$t('metricsDefinition.customColumn')}：`">
            <Input
              v-model="factListForm.USER_FACT"
              placeholder
            /></Input>
          </FormItem>
          <FormItem :label="`${$t('metricsDefinition.variableName')}：`">
            <Input
              v-model="factListForm.VALUE_NAME"
              placeholder
            /></Input>
          </FormItem>
          <FormItem
            :label="`${$t('metricsDefinition.statisticalFunction')}：`"
            prop="FUNCTION_NAME"
          >
            <Select
              v-model="factListForm.FUNCTION_NAME"
              clearable
              style="width:200px"
            >
              <Option
                v-for="item in functionNameList"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem
            :label="`${$t('tips.description')}：`"
            prop="DESCRIPTION"
          >
            <Input
              v-model="factListForm.DESCRIPTION"
              placeholder
            /></Input>
          </FormItem>
          <FormItem
            :label="`${$t('metricsDefinition.displayFormat')}：`"
            prop="VALUE_FORMAT"
          >
            <Select
              v-model="factListForm.VALUE_FORMAT"
              clearable
              style="width:200px"
            >
              <Option
                v-for="item in valueFormatList"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem :label="`${$t('metricsDefinition.securityLevel')}：`">
            <Input
              v-model="factListForm.SECURITY_GRADE"
              placeholder
            /></Input>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>
<script>
  import draggable from 'vuedraggable';
  import network, { urlSearchParams } from '../../__utils__/network';
  import { getSessionObject } from '../../__utils__/sessionStorage';
  import { classFix } from '../../constants/global';

  export default {
    data() {
      return {
        editable: true,
        dragOptions: { animation: 500 },
        lists: [
          { name: 'John' },
          { name: 'Joao' },
          { name: 'Jean' },
          { name: 'Gerard' }
        ],
        dataList: [],
        reportId: 1,
        adTableInfo: {},
        list: [],
        queryList: [],
        fieldName: '',
        parentCheckedArr: [],
        isParentAllChecked: false,
        isParentBtnDisabled: true,
        childBoxList: [
          {
            dataName: 'pageDimList',
            name: this.$t('metricsDefinition.pageDefinition'),
            isAllChecked: false,
            childList: [],
            isChildBtnDisabled: true,
            isSetDataDisabled: true,
            childCheckedArr: [],
            indeterminate: false,
            setBtnTitle: this.$t('metricsDefinition.groupFieldSetting')
          },
          {
            dataName: 'vertDimList',
            name: this.$t('metricsDefinition.columnDefinition'),
            isAllChecked: false,
            childList: [],
            isChildBtnDisabled: true,
            isSetDataDisabled: true,
            childCheckedArr: [],
            indeterminate: false,
            setBtnTitle: this.$t('metricsDefinition.groupFieldSetting')
          },
          {
            dataName: 'horizDimList',
            name: this.$t('metricsDefinition.rowDefinition'),
            isAllChecked: false,
            childList: [],
            isChildBtnDisabled: true,
            isSetDataDisabled: true,
            childCheckedArr: [],
            indeterminate: false,
            setBtnTitle: this.$t('metricsDefinition.groupFieldSetting')
          },
          {
            dataName: 'factList',
            name: this.$t('metricsDefinition.summaryField'),
            isAllChecked: false,
            childList: [],
            isChildBtnDisabled: true,
            isSetDataDisabled: true,
            childCheckedArr: [],
            indeterminate: false,
            setBtnTitle: this.$t('metricsDefinition.summaryFieldSetting')
          }
        ],
        currentIdx: 0,
        isSetDialogShow: false,
        groupForm: {
          COLUMN_LINK: '',
          DESCRIPTION: '',
          isHide: false
        },
        groupRule: {
          COLUMN_LINK: [
            {
              required: true,
              message: this.$t('metricsDefinition.noEmpty'),
              trigger: 'blur'
            }
          ],
          DESCRIPTION: [
            {
              required: true,
              message: this.$t('metricsDefinition.noEmpty'),
              trigger: 'blur'
            }
          ]
        },
        factListForm: {
          COLUMN_LINK: '',
          USER_FACT: '',
          VALUE_NAME: '',
          FUNCTION_NAME: '',
          DESCRIPTION: '',
          VALUE_FORMAT: '',
          SECURITY_GRADE: ''
        },
        factListRule: {
          FUNCTION_NAME: [
            {
              required: true,
              message: this.$t('metricsDefinition.noEmpty'),
              trigger: 'blur'
            }
          ],
          DESCRIPTION: [
            {
              required: true,
              message: this.$t('metricsDefinition.noEmpty'),
              trigger: 'blur'
            }
          ],
          VALUE_FORMAT: [
            {
              required: true,
              message: this.$t('metricsDefinition.noEmpty'),
              trigger: 'blur'
            }
          ]
        },
        functionNameList: [
          {
            value: 'SUM',
            label: this.$t('tips.grandTotal')
          },
          {
            value: 'AVG',
            label: this.$t('tips.average')
          },
          {
            value: 'MAX',
            label: this.$t('tips.max')
          },
          {
            value: 'MIN',
            label: this.$t('tips.min')
          },
          {
            value: 'COUNT',
            label: this.$t('tips.count')
          }
        ],
        valueFormatList: [
          {
            value: '#0',
            label: this.$t('tips.integer')
          },
          {
            value: '#0.00',
            label: this.$t('metricsDefinition.withPercentile')
          },
          {
            value: '#0.000',
            label: this.$t('metricsDefinition.withTenThousandths')
          },
          {
            value: '###,###,###',
            label: this.$t('metricsDefinition.thousandsSeparated')
          },
          {
            value: '###,###,##0.00',
            label: this.$t('metricsDefinition.thousandsAndPercent')
          },
          {
            value: '0%',
            label: this.$t('metricsDefinition.wholePercentage')
          },
          {
            value: '0.00%',
            label: this.$t('metricsDefinition.digitPercentage')
          }
        ]
      };
    },
    components: {
      draggable
    },
    mounted() {
      this.reportId = Object.values(getSessionObject('undataFromPageCustomizeButtonInfo'))[0]
        .itemId || 1;
      this.getList();
    },
    computed: {
      classes: () => `${classFix}metricsDefinition`
      /*  dragOptions() {
          return {
            animation: 0,
            group: "description",
            disabled: !this.editable,
            ghostClass: "ghost"
          };
        }, */
    },
    methods: {
      // 顺序更新执行
      datadragEnd(evt) {
        evt.preventDefault();
        this.childBoxList = JSON.parse(JSON.stringify(this.childBoxList));// 解决拖拽之后CheckBox状态不更新问题
      },
      onCheckChange(obj) {
        console.log(obj);
        this.parentCheckedArr = [];
        this.parentCheckedArr = obj;
        this.move('parent');
        // this.parentCheckedArr=[];
      },
      fieldQuery() {
        const name = this.fieldName;
        const tempList = this.queryList.filter(obj => obj.DESCRIPTION.indexOf(name) !== -1);
        this.list = JSON.parse(JSON.stringify(tempList));
        this.parentCheckedArr = [];
        this.isParentBtnDisabled = true;
      },
      loadListData(item, callback) {
        const params = {
          refTableId: item.REF_TABLE_ID,
          parentFieldName: item.NAME
        };
        network
          .post('/p/cs/rpt/cxtab/v1/selectRefTableColumn',
                urlSearchParams(params))
          .then(
            (res) => {
              const data = res.data.data;
              data.map(
                (item) => {
                  item.title = item.DESCRIPTION;
                  if (item.REF_COLUMN_ID && item.REF_TABLE_ID) {
                    item.loading = false;
                    item.children = [];
                  }
                }
              );
              console.log(data);
              callback(data);
            }
          );
      },
      getList() {
        network
          .get('/p/cs/rpt/cxtab/v1/selectCubeReportConfig', {
            params: { reportId: this.reportId }
          })
          .then(({ data }) => {
            if (data.code == 0) {
              const { adTableInfo, columnInfoList, dimensionFact } = data.data;
              this.adTableInfo = Object.assign({}, adTableInfo);
              columnInfoList.map((item) => {
                item.HIDE_HTML = item.HIDE_HTML || 'N';
                item.title = item.DESCRIPTION;
              });
              columnInfoList.map((item) => {
                if (item.REF_COLUMN_ID && item.REF_TABLE_ID) {
                  item.children = [];
                  item.loading = false;
                }
              });
              this.list = columnInfoList || this.list;
              this.queryList = JSON.parse(JSON.stringify(this.list));
              this.childBoxList.map((item) => {
                item.childList = dimensionFact[item.dataName] || item.childList;
              });
            }
          })
          .catch((error) => {
          });
      },
      move(type, n) {
        if (type == 'parent') {
          this.isParentBtnDisabled = this.parentCheckedArr.length == 0;
        } else {
          this.childBoxList[n].isChildBtnDisabled = this.childBoxList[n].childCheckedArr.length == 0;
          this.childBoxList[n].isSetDataDisabled = this.childBoxList[n].childCheckedArr.length == 0;
          const o = this.childBoxList[n];
          if (o.childCheckedArr.length === o.childList.length) {
            o.indeterminate = false;
            o.checkBox = true;
          } else if (o.childCheckedArr.length > 0) {
            o.indeterminate = true;
            o.checkBox = false;
          } else {
            o.indeterminate = false;
            o.checkBox = false;
          }
        }
      },
      getData(n, type) {
        const arr1 = this.childBoxList[n].childList;
        // const arrNew = this.list.filter(item => this.parentCheckedArr.some(ele => ele == item.ID));
        const arrNew = this.parentCheckedArr;
        const tmp = [];
        arrNew.map((item) => {
          const ishas = false;
          /*   arr1.map((ele) => {
                 if (ele.ID == item.ID) {
                     ishas = true;
                 }
             }); */
          if (!ishas) {
            const o = {
              ID: item.ID,
              COLUMN_LINK: item.NAME,
              DESCRIPTION: item.DESCRIPTION,
              HIDE_HTML: 'N',
              ORDER_NO: null
            };
            if (type == 'factList') {
              o.FUNCTION_NAME = item.FUNCTION_NAME || null;
              o.RP_CXTAB_ID = item.RP_CXTAB_ID || null;
              o.SECURITY_GRADE = item.SECURITY_GRADE || null;
              o.USER_FACT = item.USER_FACT || null;
              o.VALUE_FORMAT = item.VALUE_FORMAT || null;
              o.VALUE_NAME = item.VALUE_NAME || null;
            }
            tmp.push(o);
          }
        });
        this.childBoxList[n].childList = [...arr1, ...tmp];
        // console.log(
        //   "this.childBoxList[n].childList:",
        //   this.childBoxList[n].childList
        // );
        this.isParentBtnDisabled = true;
        this.parentCheckedArr = [];
        const clearCheck = this.$refs.treeAllCheck.getCheckedNodes();
        clearCheck.map(
          (item) => {
            item.checked = false;
          }
        );
      },
      removeData(n) {
        const o = this.childBoxList[n];
        o.childList = o.childList.filter(
          item => !o.childCheckedArr.some(ele => ele == item.ID)
        );
        o.childCheckedArr = [];
        o.indeterminate = false;
        o.isChildBtnDisabled = true;
        o.isSetDataDisabled = true;
        this.childBoxList[n] = o;
      },
      saveCubeReport() {
        const params = {
          reportId: this.reportId,
          reportConfig: {}
        };
        this.childBoxList.map((item) => {
          item.childList.map((ele, i) => {
            ele.ORDER_NO = i + 1;
          });
          params.reportConfig[item.dataName] = item.childList;
        });
        network
          .post(
            '/p/cs/rpt/cxtab/v1/saveCubeReportConfig',
            urlSearchParams(params)
          )
          .then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(data.message);
              return;
            }
            this.$Message.error(data.message);
          });
      },
      dbClick(item, item1, idx, event) {
        console.log('dbClick::item', item);
        console.log('dbClick::item1', item1);
        console.log('dbClick::idx', idx);
        if (!item.childCheckedArr.includes(item1.ID)) {
          item.childCheckedArr.push(item1.ID);
          item.isChildBtnDisabled = item.childCheckedArr.length == 0;
          item.isSetDataDisabled = item.childCheckedArr.length == 0;
        }
        this.showSetModal(idx);
      },
      checkBatchChange(n) {
        this.groupForm = {};
        this.factListForm = {};
        this.currentIdx = n;
        const o = this.childBoxList[n];
        if (o.indeterminate) {
          o.checkBox = false;
        } else {
          o.checkBox = !o.checkBox;
        }
        o.indeterminate = false;
        if (o.checkBox) {
          o.childCheckedArr = o.childList.map(item => item.ID);
        } else {
          o.childCheckedArr = [];
        }
        o.isChildBtnDisabled = o.childCheckedArr.length === 0;
      },
      showSetModal(n) {
        this.groupForm = {};
        this.factListForm = {};
        this.currentIdx = n;
        const o = this.childBoxList[n];
        const obj = Object.assign(
          {},
          o.childList.filter(item => o.childCheckedArr.some(ele => ele === item.ID))[0]
        );
        if (n != 3) {
          obj.HIDE_HTML = obj.HIDE_HTML != 'N';
          this.groupForm = obj;
          // console.log("this.groupForm:", this.groupForm);
        } else {
          this.factListForm = obj;
          // console.log("this.factListForm:", this.factListForm);
        }
        this.isSetDialogShow = true;
      },
      saveSetModal() {
        const name = this.currentIdx != 3 ? 'groupForm' : 'factListForm';
        this.$refs[name].validate((valid) => {
          if (valid) {
            // this.$Message.success('!');
          } else {
            this.$Message.error('Fail!');
          }
        });
        const c = this.childBoxList[this.currentIdx].childList;
        const v = this.currentIdx != 3 ? this.groupForm : this.factListForm;
        c.map((item, i) => {
          if (item.ID == v.ID) {
            c[i] = Object.assign({}, v);
            if (this.currentIdx != 3) {
              c[i].HIDE_HTML = c[i].HIDE_HTML ? 'Y' : 'N';
            }
          }
        });
        this.childBoxList[this.currentIdx].childList = c;
        // console.log(
        //   "this.childBoxList[this.currentIdx].childList:",
        //   this.childBoxList[this.currentIdx].childList
        // );
      }
    }
  };
</script>

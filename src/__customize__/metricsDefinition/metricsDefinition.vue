<template>
    <div class="metricsDefinition">
        <div class="buttonGroup">
            <Button
                    type="posdefault"
                    @click="saveCubeReport()"
            >
                保存交叉表定义
            </Button>
            <Button
                    type="fcdefault"
                    @click="saveCubeReport()"
            >
                另保存交叉表定义
            </Button>
        </div>
        <Row class="report-intro">
      <span>
        事实表：
        <em>{{ adTableInfo.NAME }}</em>
      </span>
            <span>
        报表模版：
        <em>{{ adTableInfo.DESCRIPTION }}</em>
      </span>
        </Row>
        <main>
            <div class="parent-box">
                <div class="list">
                    <div class="list-header">
                        <!-- <Checkbox v-model="isParentAllChecked">可用字段</Checkbox> -->
                        可用字段
                        <Input style="width: 92px; height:20px;"
                               placeholder="输入字段名"
                               :expand="false" v-model="fieldName" @on-enter="fieldQuery()">
                            <Icon type="ios-search" @click="fieldQuery()" slot="suffix"/>
                        </Input>
                    </div>
                    <div class="treeBox">
                        <Tree ref="treeAllCheck" @on-check-change="onCheckChange" :data="list"
                              :load-data="loadListData"
                              id="treeIcon"
                              show-checkbox></Tree>
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
                                        <draggable @update="datadragEnd" v-model="item.childList" v-bind="dragOptions">
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
                                @click.prevent.native="checkBatchChange(idx)">是否全选
                        </Checkbox>
                    </div>
                </div>
            </div>
        </main>
        <p class="tips">
            <Icon type="ios-alert-outline"/>
            越少的分组字段，Cube生成的时间越短，另外，执行快速导出时，仅行定义的分组字段会被使用。
        </p>
        <Modal
                v-model="isSetDialogShow"
                draggable
                scrollable
                :title="currentIdx != 3 ? '编辑分组字段' : '编辑汇总字段'"
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
                            label="字段引用："
                            prop="COLUMN_LINK"
                    >
                        <Input
                                v-model="groupForm.COLUMN_LINK"
                                disabled
                                placeholder
                        /></Input>
                    </FormItem>
                    <FormItem
                            label="描述："
                            prop="DESCRIPTION"
                    >
                        <Input
                                v-model="groupForm.DESCRIPTION"
                                placeholder
                        /></Input>
                    </FormItem>
                    <FormItem label="在网页报表中隐藏：">
                        <Checkbox v-model="groupForm.HIDE_HTML"/>
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
                    <FormItem label="汇总字段：">
                        <Input
                                v-model="factListForm.COLUMN_LINK"
                                disabled
                                placeholder
                        /></Input>
                    </FormItem>
                    <FormItem label="自定义计算列：">
                        <Input
                                v-model="factListForm.USER_FACT"
                                placeholder
                        /></Input>
                    </FormItem>
                    <FormItem label="变量名：">
                        <Input
                                v-model="factListForm.VALUE_NAME"
                                placeholder
                        /></Input>
                    </FormItem>
                    <FormItem
                            label="统计函数："
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
                            label="描述："
                            prop="DESCRIPTION"
                    >
                        <Input
                                v-model="factListForm.DESCRIPTION"
                                placeholder
                        /></Input>
                    </FormItem>
                    <FormItem
                            label="显示格式："
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
                    <FormItem label="安全级别：">
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
    import network, {urlSearchParams} from '../../__utils__/network';
    import {getSeesionObject} from '../../__utils__/sessionStorage';
    import draggable from 'vuedraggable'

    export default {
        data() {
            return {
                editable: true,
                dragOptions: {animation: 500},
                lists: [
                    {name: "John"},
                    {name: "Joao"},
                    {name: "Jean"},
                    {name: "Gerard"}
                ],
                dataList: [],
                reportId: 1,
                adTableInfo: {},
                list: [],
                queryList: [],
                fieldName: "",
                parentCheckedArr: [],
                isParentAllChecked: false,
                isParentBtnDisabled: true,
                childBoxList: [
                    {
                        dataName: 'pageDimList',
                        name: '页定义(仅透视分析中有效)',
                        isAllChecked: false,
                        childList: [],
                        isChildBtnDisabled: true,
                        isSetDataDisabled: true,
                        childCheckedArr: [],
                        indeterminate: false,
                        setBtnTitle: '分组字段设置'
                    },
                    {
                        dataName: 'vertDimList',
                        name: '列定义',
                        isAllChecked: false,
                        childList: [],
                        isChildBtnDisabled: true,
                        isSetDataDisabled: true,
                        childCheckedArr: [],
                        indeterminate: false,
                        setBtnTitle: '分组字段设置'
                    },
                    {
                        dataName: 'horizDimList',
                        name: '行定义',
                        isAllChecked: false,
                        childList: [],
                        isChildBtnDisabled: true,
                        isSetDataDisabled: true,
                        childCheckedArr: [],
                        indeterminate: false,
                        setBtnTitle: '分组字段设置'
                    },
                    {
                        dataName: 'factList',
                        name: '汇总字段',
                        isAllChecked: false,
                        childList: [],
                        isChildBtnDisabled: true,
                        isSetDataDisabled: true,
                        childCheckedArr: [],
                        indeterminate: false,
                        setBtnTitle: '汇总字段设置'
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
                            message: '不可为空',
                            trigger: 'blur'
                        }
                    ],
                    DESCRIPTION: [
                        {
                            required: true,
                            message: '不可为空',
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
                            message: '不可为空',
                            trigger: 'blur'
                        }
                    ],
                    DESCRIPTION: [
                        {
                            required: true,
                            message: '不可为空',
                            trigger: 'blur'
                        }
                    ],
                    VALUE_FORMAT: [
                        {
                            required: true,
                            message: '不可为空',
                            trigger: 'blur'
                        }
                    ]
                },
                functionNameList: [
                    {
                        value: 'SUM',
                        label: '累计'
                    },
                    {
                        value: 'AVG',
                        label: '平均'
                    },
                    {
                        value: 'MAX',
                        label: '最大'
                    },
                    {
                        value: 'MIN',
                        label: '最小'
                    },
                    {
                        value: 'COUNT',
                        label: '计数'
                    }
                    // {// 待添加
                    //   value: "VAR",
                    //   label: "平均差"
                    // },
                    // {
                    //   value: "STDEV",
                    //   label: "均方差"
                    // },
                    // {
                    //   value: "MEDIAN",
                    //   label: "中间值"
                    // }
                ],
                valueFormatList: [
                    {
                        value: '#0',
                        label: '整数'
                    },
                    {
                        value: '#0.00',
                        label: '含百分位'
                    },
                    {
                        value: '#0.000',
                        label: '含万分位'
                    },
                    {
                        value: '###,###,###',
                        label: '千位分隔'
                    },
                    {
                        value: '###,###,##0.00',
                        label: '千位分隔和百分'
                    },
                    {
                        value: '0%',
                        label: '整百分比'
                    },
                    {
                        value: '0.00%',
                        label: '2位百分比'
                    }
                ]
            };
        },
        components: {
            draggable
        },
        mounted() {
            this.reportId = Object.values(getSeesionObject('undataFromPageCustomizeButtonInfo'))[0]
                .itemId || 1;
            this.getList();
        },
        computed: {
            /*  dragOptions() {
                return {
                  animation: 0,
                  group: "description",
                  disabled: !this.editable,
                  ghostClass: "ghost"
                };
              },*/
        },
        methods: {
            // 顺序更新执行
            datadragEnd(evt) {
                evt.preventDefault();
                this.childBoxList = JSON.parse(JSON.stringify(this.childBoxList));// 解决拖拽之后CheckBox状态不更新问题
                console.log(`拖动前的索引 :${evt.oldIndex}`)
                console.log(`拖动后的索引 :${evt.newIndex}`)
            },
            onCheckChange(obj) {
                console.log(obj);
                this.parentCheckedArr = [];
                this.parentCheckedArr = obj;
                this.move("parent");
                // this.parentCheckedArr=[];
            },
            fieldQuery() {
                let name = this.fieldName;
                let tempList = this.queryList.filter((obj) => {
                    return obj.DESCRIPTION.indexOf(name) !== -1;
                });
                this.list = JSON.parse(JSON.stringify(tempList));
                this.parentCheckedArr = [];
                this.isParentBtnDisabled = true;
            },
            loadListData(item, callback) {
                let params = {
                    refTableId: item.REF_TABLE_ID,
                    parentFieldName: item.NAME
                };
                network
                    .post('/p/cs/rpt/cxtab/v1/selectRefTableColumn',
                        urlSearchParams(params)
                    )
                    .then(
                        (res) => {
                            let data = res.data.data;
                            data.map(
                                item => {
                                    item.title = item.DESCRIPTION;
                                    if (item.REF_COLUMN_ID && item.REF_TABLE_ID) {
                                        item.loading = false;
                                        item.children = [];
                                    }
                                }
                            );
                            console.log(data);
                            callback(data)
                        }
                    );
            },
            getList() {
                network
                    .get('/p/cs/rpt/cxtab/v1/selectCubeReportConfig', {
                        params: {reportId: this.reportId}
                    })
                    .then(({data}) => {
                        if (data.code == 0) {
                            const {adTableInfo, columnInfoList, dimensionFact} = data.data;
                            this.adTableInfo = Object.assign({}, adTableInfo);
                            columnInfoList.map((item) => {
                                item.HIDE_HTML = item.HIDE_HTML || 'N';
                                item.title = item.DESCRIPTION;
                            });
                            columnInfoList.map(item => {
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
                    let o = this.childBoxList[n];
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
                    let ishas = false;
                 /*   arr1.map((ele) => {
                        if (ele.ID == item.ID) {
                            ishas = true;
                        }
                    });*/
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
                let clearCheck = this.$refs.treeAllCheck.getCheckedNodes();
                clearCheck.map(
                    item => {
                        item.checked = false
                    }
                )
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
                    .then(({data}) => {
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
                    o.childCheckedArr = o.childList.map(item => {
                        return item.ID;
                    });
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
<style scoped lang="less">

    .metricsDefinition {
        .treeBox {
            box-sizing: border-box;
            height: calc(100% - 30px);
            padding: 10px 10px;
            overflow: scroll;
        }

        .btn {
            height: 22px;
            line-height: 18px;
            margin-right: 8px;
            margin-left: 0px;
            padding: 0 8px;

            span {
                vertical-align: initial;
            }
        }

        .buttonGroup {
            padding: 8px 0px;

            button {
                .btn();
                // height: 22px;
                // line-height: 18px;
                // margin-right: 8px;
                // margin-left: 0px;
                // padding: 0 8px;
                // span {
                //   vertical-align: initial;
                // }
            }
        }

        .report-intro {
            padding: 8px 0 15px;

            span {
                padding-right: 10px;

                em {
                    font-style: normal;
                    color: #fd6442;
                }
            }
        }

        li {
            list-style-type: none;
        }

        main {
            display: block;
            position: relative;
            width: 700px;
            height: 500px;

            .list {
                display: inline-block;
                width: 180px;
                height: 210px;
                font-size: 12px;
                border: 1px solid #e8eaec;
                border-radius: 6px;
                overflow: hidden;

                .list-header {
                    padding: 8px 16px;
                    background: #f9fafc;
                    color: #575757;
                    border-bottom: 1px solid #e8eaec;
                    overflow: hidden;
                    width: 100%;
                }

                .list-body {
                    padding: 8px 16px;
                    line-height: 28px;
                    overflow: scroll;
                    /*   label {
                         cursor: move;
                       }*/
                }
            }

            .parent-box {
                float: left;
                margin-right: 20px;
                width: 180px;
                height: 500px;

                .list {
                    height: 500px;

                    .list-body {
                        height: 460px;
                    }
                }
            }

            .child-box {
                float: left;
                width: 500px;
                height: 500px;

                .child-item {
                    float: left;
                    margin: 0 10px 10px 0;
                    width: 240px;
                    height: 240px;

                    .burgeon-transfer-operation {
                        float: left;
                        margin-top: 100px;
                    }

                    .child-list {
                        float: right;
                        width: 180px;
                        height: 260px;

                        .list-body {
                            height: 180px;
                        }

                        button {
                            .btn();
                        }
                    }
                }
            }
        }

        .tips {
            width: 100%;
            padding: 20px 0;

            i:before {
                margin-right: 5px;
                color: #fd6442;
                font-size: 14px;
                font-weight: bold;
            }
        }
    }
</style>

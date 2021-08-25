// 这里通用性指语义通用，用的地方多不一定代表是通用
export default { 
  // 描述文案(不具有通用性的文字)
  messages: {
    confirmSubmit: '确认执行提交？',
    confirmRefresh: '修改的数据未保存,确定刷新?',
    confirmCancelSubmission: '确认执行取消提交?',
    confirmVoid: '确认执行作废?',
    confirmBack: '修改的数据未保存,确定返回?',
    confirmDelete: '确认执行删除?',
    confirmAdd: '修改的数据未保存,确定新增?',
    confirmReset: '确认执行重置?',
    confirmAction: '确认执行{action}?',
    confirmVoidBill: '确认要作废所选单据吗?',
    confirmCancelVoidBill: '确认要取消作废所选单据吗?',
    moreFilters: '更多筛选',
    viewSelectedResults: '查看选中结果', 
    uploadWarning: '注意：上传文件中，不要放置宏或图标，不要更改列的顺序，数据中不要使用公式。',
    downloadTemplateRemark: '下载模版',
    fileSizeTip: '文件最大',
    PrintImmediately: '直接打印',
    PrintImmediatelyTip: '请先选择需要直接打印的记录！',
    PrintPreview: '打印预览',
    PrintPreviewTip: '请先选择需要打印预览的记录！',
    setTemplate: '设置模板',
    asyncImportSuccess: '本次操作已后台处理，是否至[我的任务]查看',
    maintainTableName: '请维护表名或OBJID',
    setAssociationTable: '请设置外键关联表的显示配置',
    chooseRecord: '请先选择需要{action}的记录！',
    exportAllTip: '当前的操作会执行全量导出，导出时间可能会比较慢！是否继续导出?',
    selectModifiedData: '请选择批量修改数据!',
    updateSearchResult: '未勾选记录,将批量更新所有查询结果(共计{total}行),是否确定继续操作?',
    execExportAll: '操作会执行全量导出', 
    checkID: '请勾选ID',
    checkSingleID: '只能勾选单个ID',
    requiredPersonalInfo: '个人信息不能为空!',
    setPathConfig: '请设置暂存path配置',
    noDetail: '当前跳转路径不可配置动态id，无可勾选的明细',
    NoMenuPermission: '当前用户无菜单权限,将为您跳转到登陆界面', 
    lostSession: '您已失去会话，是否退出登录?',
    searchPlaceholder: '请输入查询内容',
    chooseDeleteData: '请先选择需要删除的数据!',
    selectMainTable: '请选择主表',
    selectedData: '已经选中{total}条数据',
    multiplePop: '弹窗多选',
    enterContent: '不能为空，请输入!',
    saveMainTable: '请先保存主表',
    enterFunctionName: '请输入要查询的功能名',
    noFeature: '抱歉，没有此功能!',
    queryFunctionName: '查询功能名',
    recordInList: '该记录已在选中列表中',
    requiredTemplateName: '模板名称不能为空',
    templateSaved: '模板保存成功',
    selectedItem: '已经选中{total}条',
    deleteImg: '此操作将永久删除该图片, 是否继续?',
    uploadLimit: '只能上传{total}张图片',
    filterError: '请求过滤条件出错',
    startLine: '有效数据起始行',
    onlyPositiveInteger: '只能输入正整数',
    ifUpdateRecord: 'AK重复是否更新已有记录',
    waitForImport: '数据正在导入中，请稍候',
    downloadErrorMessage: '下载报错信息',
    recordError: '第{num}条记录报错',
    selectImportFile: '请选择要导入的文件!',
    enterUserName: '请输入用户名',
    enterPassword: '请输入密码',
    noMessage: '目前没有未读消息',
    selectedModifiedRecord: '已选中批量修改记录数：{total}行',
    noUpdatedData: '没有数据更新，请确认!',
    collapseFavorites: '收起收藏夹与最近使用',
    expandFavorites: '展开收藏夹与最近使用',
    closeBills: '关闭所有已打开的单据',
    enterRole: '请输入角色',
    matchFail: '匹配失败，请重新输入',
    importingFile: '文件正在导入中',
    uploadFileLimit: '只能上传{total}个文件',
    cannotUpload: '不支持上传',
    continueDeleteFile: '此操作将永久删除该文件, 是否继续?',
    enterCode: '请输入验证码',
    enterPhone: '请输入手机号',
    enterSMS: '请输入短信验证码',
    continueLogin: '当前账号登录中，是否继续登录?',
    changePasswordTip: '当前密码1个月未修改，为保数据安全请立即修改',
    enterValidPhone: '请输入正确的手机号',
    getCodeSuccess: '获取验证码成功',
    reacquire: '重新获取',
    listAllColor: '列出所有颜色',
    addColor: '手动新增颜色',
    enterColorInfo: '请输入颜色编码/颜色名称',
    primaryAndSecondaryColor: '主副色',
    fabricColor: '布料颜色',
    colorPicture: '颜色图片',
    contentIsRequired: '输入框内容不能为空',
    distribution: '配卖',
    dataFilterSetting: '数据过滤设置',
    chooseFilterCriteria: '选择筛选条件',
    chooseFilterResults: '选择筛选结果',
    envVariableSetting: '环境变量设置',
    permissionHasSet: '该权限表已经设置数据权限，请重新选择!',
    selectPermission: '请选择权限表',
    noDataSave: '没有需要保存的数据',
    selectPermissionTable: '请选择第{num}行的权限表',
    setDataPermissions: '请给第{num}行设置数据权限',
    unsavedData: '还有未保存的数据!',
    selectFilterCriteria: '请选择筛选条件',
    selectFilterResults: '请选择筛选结果',
    productColorMainImage: '商品/颜色主图',
    mainVideo: '主图视频',
    videoId: '视频VID',
    videoUploadTutorial: '视频上传教程',
    videoUploadEntrance: '视频上传入口',
    productMainImage: '商品主图',
    suggestImageNumber: '建议尺寸：800*800像素，你可以拖拽图片调整顺序，最多上传15张',
    colorMainImage: '颜色主图',
    suggestImageMaintain: '建议尺寸：800*800像素，颜色项维护请在“颜色尺寸”栏',
    pictureUploadFormat: '上传图片只能是 JPG,PNG,GIF 格式!',
    pictureUploadSize: '上传图片大小不能超过 2MB!',
    imagesNumberTip: '最多上传{num}张图片',
    originalRole: '原角色',
    targetRole: '目标角色',
    copyMethod: '复制方式',
    selectCopyMethod: '请选择复制方式',
    overwritePermission: '覆盖原有权限',
    keepPermission: '保留原有权限',
    extensions: '扩展功能',
    ifSave: '是否保存修改的数据?',
    selectOriginRole: '请选择原角色',
    selectTargetRole: '请选择目标角色',
    notContainRole: '目的角色不能包含源角色，请重新选择',
    noChange: '没有更改',
    noGroupInfo: '无分组信息',
    switchStatus: '开关状态',
    fillPassword: '输入密码',
    passwordSecurity: '密码安全程度',
    confirmPassword: '确认密码',
    passwordInconsistent: '两次输入的密码不一致',
    passwordRule: '密码必须由6位以上数字、字母组成',
    enterNewPassword: '请输入新密码',
    selectResetUser: '请勾选需要重置的用户',
    enterOldPassword: '请输入旧密码',
    passwordNewRule: '密码必须由6-18个字符且数字、大小写字母同时存在',
    selectTemplate: '请选择一个模版',
    searchIsRequired: '查询条件[{desc}]不能为空!',
    taskRecord: '任务记录',
    billOpened: '当前单据已打开',
    visibleAddInterface: '新增界面可见',
    editAddInterface: '新增界面可编辑',
    visibleEditInterface: '编辑界面可见',
    editInEditInterface: '编辑界面可编辑',
    visibleListInterface: '列表界面可见',
    invisibleAndDefault: '不可见且有默认值',
    batchModifyVisible: '批量修改可见',
    shippingWarehouse: '发货店仓',
    receivingWarehouse: '收货店仓',
    inventory: '在库库存',
    availableInventory: '可用库存',
    availableReturnWarehouse: '退货店仓可用',
    returnWarehouseInStock: '退货店仓在库',
    setWatermarkText: '请设置水印显示文字',
    selectUpToFile: '最多选择{total}个文件',
    fileTooLarge: '文件内容过大',
    pictureTypeLimit: '图片类型必须是.gif,jpeg,jpg,png中的一种',
    setDefaultForeignKey: '设置默认值为外键类型，请配置默认值为{value}字段的refobjid值',
    switchReadOnlyInterface: '切换到只读界面',
    noPermissionToAccess: '用户无权限访问',
    addCondition: '添加条件',
    pleaseEnterAgain: '请重新输入',
    colorSizeSave: '颜色尺寸保存',
    saveAsTemplate: '保存为模板',
    originalWarehouse: '原始店仓',
    targetWarehouse: '目标店仓',
    VIPType: 'VIP类型',
    noDataProcess: '没有需要处理的数据',
    mergeSubmit: '当前类型对象的多行同时提交将产生数据“合并”的特殊功能。\\n\\n您确认要执行此特殊功能?\\n\\n（选择“取消”如果您尚不了解所谓“合并”的意义，并查看有关帮助以明确）',
    switchEditInterfaceFirst: '请先切换到修改界面',
    switchEditInterface: '切换到修改界面',
    selectLessData: '请选择少于20行的数据，以保证客户端响应速度!',
    modifySelectRow: '修改选中行',
    modifyResult: '修改结果集',
    copyBill: '复制单据',
    selectSummaryTemplate: '请在查询栏选择汇总表模板',
    notDefineSummaryTemplate: '当前表没有定义汇总表模板',
    mustDataType: '必须是日期型',
    mustDigital: '必须是数字型',
    setAgent: '请设置代办人',
    clickClearSetting: '点击清除当前条件设置',
    tickToConfirm: '请在要选择的行首打勾确认!',
    reenterReport: '当前操作界面非报表界面布局，请点击报表中心标签页重新进入报表模块后再试',
    collectionSelected: '该集合已被选择',
    collectionExcluded: '该集合已被排除',
    enterVersionNumber: '请输入版本号',
    enterTargetTable: '请输入目标表名',
    enterTargetDesc: '请输入目标描述',
    expandFavorite: '是否展开收藏夹',
    collapseQuery: '折叠查询条件',
    queryDefaultRows: '查询条件默认显示行数'
  },
  // 具有通用性的文案
  tips: {
    more: '更多',
    all: '全部',
    noData: '暂无数据',
    filterResults: '筛选结果',
    sourceTable: '源表表名',
    targetTable: '目标表名',
    targetDescription: '目标描述',
    queryCondition: '查询条件',
    notEmpty: '不能为空',
    confirmExec: '确认执行',
    accepted: '已验收',
    returned: '已退回',
    boxed: '已装箱',
    boxing: '装箱中',
    charged: '已记账',
    cashed: '已收银',
    completed: '已完成',
    confirmed: '已确认',
    executed: '已执行',
    executing: '执行中',
    abnormalTermination: '异常终止',
    profitable: '已盈亏',
    sent: '已发出',
    submitted: '已提交',
    system: '系统',
    terminated: '已终止',
    approving: '审批中',
    invalid: '已作废',
    approved: '已同意',
    rejected: '已驳回',
    virtualTable: '虚表',
    detail: '明细',
    noFiles: '暂无文件',
    popUp: '弹出框',
    searchResult: '查询结果',
    serialNumber: '编号',
    beSelected: '已经选中', // 这个词被用在判断里。所以不能用'已选中'代替
    title: '标题',
    noPrompt: '暂无提示',
    userLogin: '用户登录',
    message: '消息',
    asyncTask: '异步任务',
    task: '任务',
    allTasks: '全部任务',
    backHome: '回到首页',
    myTask: '我的任务',
    changePassword: '修改密码',
    text: '文字',
    uploadAttachment: '上传附件',
    accountLogin: '账号登录',
    phoneLogin: '手机登录',
    getVerificationCode: '获取验证码',
    colorCode: '颜色编码',
    colorName: '颜色名称',
    mainColor: '主色',
    secondaryColor: '副色',
    sizeCode: '尺寸编码',
    sizeName: '尺寸名称',
    color: '颜色',
    size: '尺寸',
    piece: '条',
    envVariable: '环境变量',
    yes: '是',
    no: '否',
    and: '并且',
    contain: '包含',
    addPicture: '添加图片',
    copyPermission: '复制权限',
    function: '功能',
    expand: '扩展',
    role: '角色',
    open: '开',
    close: '关',
    low: '低',
    medium: '中',
    high: '高',
    oldPassword: '旧密码',
    newPassword: '新密码',
    default: '默认',
    templateName: '模板名称',
    popRadio: '弹框单选',
    functionPermission: '功能权限',
    dataPermission: '数据权限',
    networkMonitor: '网络监控',
    todoList: '待办列表',
    noMatchingData: '无匹配数据',
    activityDate: '活动日期',
    quantity: '数量',
    basicInfo: '基本信息',
    label: '标签',
    hiddenColumn: '隐藏列',
    filterCondition: '筛选条件',
    serverProcessing: '服务器处理中',
    categoryNavigation: '分类导航',
    systemMaintenance: '系统维护',
    operationTimeout: '操作超时',
    noPermission: '没有权限',
    abnormal: '异常',
    report: '报表',
    statistics: '统计',
    printWithTemplate: '套打',
    shortMessage: '短信',
    dialog: '对话框',
    hasBeenSelected: '已被选择',
    hasBeenExcluded: '已被排除',
    notify: '通知',
    priority: '优先级',
    sendTime: '发送时间',
    allNotifications: '全部通告',
    cancelVoid: '取消作废',
    versionNumber: '版本号',
    loading: '加载中',
    name: '名称',
    legend: '图例',
    welcome: '欢迎'
  },
  // 反馈类型的文案(比如进行某个操作，返回操作结果的提示)
  feedback: {
    alert: '提示',
    warning: '警告',
    error: '错误',
    success: '成功',
    selected: '已选中',
    refreshSuccess: '刷新成功',
    saveSuccess: '保存成功',
    modifyFail: '修改失败',
    safeWarning: '安全提示',
    notSupportedFeature: '暂未支持此功能',
    collectionSuccess: '收藏成功',
    collectionFailed: '收藏失败',
    unfavoriteSuccessfully: '取消收藏成功',
    failedToUnfavorite: '取消收藏失败',
    cloneSuccess: '克隆成功'
  },
  // 动作行为(不含按钮里的，比如勾选，输入之类)
  actions: {
    globalSearch: '全局检索',
    selectAll: '全选',
    clear: '清空',
    match: '匹配',
    exclude: '排除'
  },
  // 按钮
  buttons: {
    print: '打印', 
    search: '查找',
    reset: '重置',
    refresh: '刷新',
    back: '返回',
    temporaryStorage: '暂存',
    cancel: '取消',
    confirm: '确认',
    close: '关闭',
    import: '导入', 
    export: '导出', 
    selectFile: '选择文件',
    submit: '提交',
    add: '新增', 
    batchEdit: '批量修改', 
    delete: '删除', 
    deleteDetails: '删除明细',
    cancelSubmission: '取消提交',
    copy: '复制',
    invalid: '作废', 
    batchUpdate: '批量更新',
    edit: '编辑',
    save: '保存',
    find: '搜索',
    jump: '跳转',
    upload: '上传',
    ignore: '忽略',
    fold: '折叠',
    setting: '设置',
    fullscreen: '全屏',
    exitFullscreen: '退出全屏',
    exit: '退出',
    view: '查看',
    antiSubmit: '反提交',
    viewDetails: '查看明细',
    filter: '筛选',
    modify: '修改',
    bulkSubmission: '批量提交',
    batchAdd: '批量添加',
    excludeSelectedRows: '排除选中行',
    excludeAll: '排除全部',
    addSelectedRow: '添加选中行',
    addAll: '添加全部'
  },
  // 表单(具有通用性的文案)
  form: {
    inputPlaceholder: '请输入', 
    selectPlaceholder: '请选择', 
  },
  // 表格(具有通用性的文案)
  table: {
    index: '序号',
    summation: '合计',
    total: '总计'
  },
}
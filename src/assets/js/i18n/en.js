export default { 
  // 描述文案(不具有通用性的文字)
  // 有的句子加空格是为了句子前后接单词，别删
  messages: {
    confirmSubmit: 'Confirm to perform the submission?',
    confirmRefresh: 'The modified data is not saved, are you sure to refresh?',
    confirmCancelSubmission: 'Confirm cancel submission?',
    confirmVoid: 'Confirm void?',
    confirmBack: 'The modified data has not been saved, are you sure to return?',
    confirmDelete: 'Confirm to delete?',
    confirmAdd: 'The modified data has not been saved. Are you sure to add?',
    confirmReset: 'Confirm to perform reset?',
    confirmAction: 'Confirm to perform {action}?',
    confirmVoidBill: 'Are you sure you want to void the selected bill?',
    confirmCancelVoidBill: 'Are you sure you want to cancel the invalidation of the selected bill?',
    moreFilters: 'more filters',
    viewSelectedResults: 'view selected results', 
    uploadWarning: 'Note: Do not place macros or icons in the uploaded file, do not change the order of the columns, and do not use formulas in the data.',
    downloadTemplateRemark: 'download template',
    fileSizeTip: 'maximum file length',
    PrintImmediately: 'print immediately',
    PrintImmediatelyTip: 'Please select the record that needs to be printed directly!',
    PrintPreview: 'print preview',
    PrintPreviewTip: 'Please select the record to be printed and previewed first!',
    setTemplate: 'set template',
    asyncImportSuccess: 'This operation has been processed in the background,whether to check in [My Tasks]',
    maintainTableName: 'Please maintain the table name or OBJID',
    setAssociationTable: 'Please set the display configuration of the foreign key association table',
    chooseRecord: 'Please select the record to be {action}!',
    exportAllTip: 'The current operation will perform a full export, and the export time may be slower! Do you want to continue exporting?',
    selectModifiedData: 'Please select the data to be modified in bulk!',
    updateSearchResult: 'If records are not checked, all query results will be updated in batches (total {total} rows). Are you sure to continue?',
    execExportAll: 'The operation will perform a full export',
    checkID: 'Please check ID',
    checkSingleID: 'Only check a single ID',
    requiredPersonalInfo: 'Personal information cannot be empty!',
    setPathConfig: 'Please set the staging path configuration',
    noDetail: 'The current jump path cannot be configured with a dynamic id, and there is no detail that can be checked',
    NoMenuPermission: 'The current user does not have menu permissions and will be redirected to the login interface for you',
    lostSession: 'You have lost your session, do you want to log out?',
    searchPlaceholder: 'please enter the query content',
    chooseDeleteData: 'Please select the data to be deleted first!',
    selectMainTable: 'Please select the main table ',
    selectedData: '{total} pieces of data have been selected',
    multiplePop: 'multiple selection in pop-up window',
    enterContent: ' can not be empty, please enter!',
    saveMainTable: 'Please save the main table first',
    enterFunctionName: 'Please enter the function name to be queried',
    noFeature: 'Sorry, there is no such feature!',
    queryFunctionName: 'query function name', 
    recordInList: 'The record is already in the selected list',
    requiredTemplateName: 'Template name cannot be empty',
    templateSaved: 'Template saved successfully',
    selectedItem: '{total} selected',
    deleteImg: 'This operation will permanently delete the picture, do you want to continue?',
    uploadLimit: 'Only {total} pictures can be uploaded',
    filterError: 'Error request filter',
    startLine: 'valid data start line',
    onlyPositiveInteger: 'Only positive integers can be entered',
    ifUpdateRecord: 'AK repeat whether to update existing records',
    waitForImport: 'The data is being imported, please wait',
    downloadErrorMessage: 'download error message',
    recordError: 'article {{num}} record error',
    selectImportFile: 'Please select the file to import first!',
    enterUserName: 'please enter user name',
    enterPassword: 'please enter the password',
    noMessage: 'There are currently no unread messages',
    selectedModifiedRecord: 'Number of records selected for batch modification: {total} rows',
    noUpdatedData: 'No data update, please confirm!',
    collapseFavorites: 'collapse favorites and recently used',
    expandFavorites: 'expand favorites and recently used',
    closeBills: 'close all open bills',
    enterRole: 'please enter a role',
    matchFail: 'Match failed, please re-enter',
    importingFile: 'File is being imported',
    uploadFileLimit: 'Only {total} files can be uploaded',
    cannotUpload: ' do not support to upload',
    continueDeleteFile: 'This operation will permanently delete the file, do you want to continue?',
    enterCode: 'please enter verification code',
    enterPhone: 'please enter phone number',
    enterSMS: 'please enter the SMS verification code',
    continueLogin: 'The current account is logged in, whether to continue to log in',
    changePasswordTip: 'The current password has not been modified for 1 month, please modify it immediately to ensure data security',
    enterValidPhone: 'please enter a valid phone number',
    getCodeSuccess: 'get the verification code successfully',
    reacquire: 'reacquire',
    listAllColor: 'list all colors',
    addColor: 'add colors manually',
    enterColorInfo: 'please enter color code or color name', 
    primaryAndSecondaryColor: 'primary and secondary color',
    fabricColor: 'fabric color',
    colorPicture: 'color picture',
    contentIsRequired: 'The content of the input box cannot be empty',
    distribution: 'distribution',
    dataFilterSetting: 'data filtering setting',
    chooseFilterCriteria: 'choose filter criteria',
    chooseFilterResults: 'choose filter results',
    envVariableSetting: 'environment variable settings',
    permissionHasSet: 'Data permissions have been set for this permission table, please select again!',
    selectPermission: 'Please select permission table',
    noDataSave: 'No data to save', 
    selectPermissionTable: 'Please select the permission table on line {num}',
    setDataPermissions: 'Please set data permissions for row {num}',
    unsavedData: 'There is still unsaved data',
    selectFilterCriteria: 'Please select filter criteria',
    selectFilterResults: 'Please select filter results',
    productColorMainImage: 'Product or color main image',
    mainVideo: 'main picture video',
    videoId: 'video VID',
    videoUploadTutorial: 'video upload tutorial',
    videoUploadEntrance: 'video upload entrance',
    productMainImage: 'product main image',
    suggestImageNumber: 'Suggested size: 800*800 pixels, you can drag the pictures to adjust the order, upload up to 15 pictures',
    colorMainImage: 'color main image',
    suggestImageMaintain: 'Suggested size: 800*800 pixels, please maintain the color items in the "color size" column',
    pictureUploadFormat: 'Upload pictures can only be in JPG, PNG, GIF format!',
    pictureUploadSize: 'Upload image size cannot exceed 2MB!',
    imagesNumberTip: 'Upload up to {num} pictures',
    originalRole: 'original role',
    targetRole: 'target role',
    copyMethod: 'copy method',
    selectCopyMethod: 'please select copy method',
    overwritePermission: 'overwrite original permissions',
    keepPermission: 'keep original permissions',
    extensions: 'extensions',
    ifSave: 'Whether to save the modified data?',
    selectOriginRole: 'Please select the original role',
    selectTargetRole: 'Please select the target role',
    notContainRole: 'The destination role cannot contain the source role, please select again',
    noChange: 'No changes',
    noGroupInfo: 'No grouping information',
    switchStatus: 'switch status',
    fillPassword: 'enter password',
    passwordSecurity: 'password security',
    confirmPassword: 'confirm password',
    passwordInconsistent: 'The two passwords entered are inconsistent',
    passwordRule: 'The password must consist of more than 6 numbers and letters',
    enterNewPassword: 'Please enter a new password',
    selectResetUser: 'Please tick the user who needs to be reset',
    enterOldPassword: 'Please enter a old password',
    passwordNewRule: 'The password must contain 6-18 characters and both numbers, uppercase and lowercase letters',
    selectTemplate: 'Please select a template',
    searchIsRequired: 'The query condition [{desc}] cannot be empty',
    taskRecord: 'task record',
    billOpened: 'The current bill is opened',
    visibleAddInterface: 'visible in the add interface',
    editAddInterface: 'editable in the add interface',
    visibleEditInterface: 'visible in the edit interface',
    editInEditInterface: 'editable in the edit interface',
    visibleListInterface: 'visible in the edit interface',
    invisibleAndDefault: 'invisible and has a default value',
    batchModifyVisible: 'modify visibility in bulk',
    shippingWarehouse: 'shipping warehouse',
    receivingWarehouse: 'receiving warehouse',
    inventory: 'inventory',
    availableInventory: 'available inventory',
    availableReturnWarehouse: 'return warehouse is available',
    returnWarehouseInStock: 'return warehouse in stock',
    setWatermarkText: 'Please set the watermark display text',
    selectUpToFile: 'Select up to {total} files',
    fileTooLarge: 'File content is too large',
    pictureTypeLimit: 'The picture type must be one of .gif, jpeg, jpg, png',
    setDefaultForeignKey: 'Set the default value to the foreign key type, please configure the default value to be the refobjid value of the {value} field',
    switchReadOnlyInterface: 'switch to read-only interface',
    noPermissionToAccess: 'The user does not have permission to access',
    addCondition: 'add condition',
    pleaseEnterAgain: 'Please enter again',
    colorSizeSave: 'color size save',
    saveAsTemplate: 'save as template',
    originalWarehouse: 'original warehouse',
    targetWarehouse: 'target warehouse',
    VIPType: 'VIP type',
    noDataProcess: 'No data to process',
    mergeSubmit: 'Submitting multiple rows of objects of the current type at the same time will produce a special function of data "merging". \\n\\nAre you sure you want to perform this special function?\\n\\n (select "Cancel" if you do not understand the meaning of the so-called "merge", and check the relevant help to clarify)',
    switchEditInterfaceFirst: 'Please switch to the edit interface first',
    switchEditInterface: 'Switch to the modification interface',
    selectLessData: "Please select less than 20 rows of data to ensure the client's response speed!",
    modifySelectRow: 'modify the selected row',
    modifyResult: 'modify the result set',
    copyBill: 'copy bill',
    selectSummaryTemplate: 'Please select the summary table template in the query column',
    notDefineSummaryTemplate: 'The current table does not define a summary table template',
    mustDataType: 'Must be date type',
    mustDigital: 'Must be digital',
    setAgent: 'Please set up an agent',
    clickClearSetting: 'Click to clear the current condition settings',
    tickToConfirm: 'Please tick the first line to confirm!',
    reenterReport: 'The current operation interface is not a report interface layout, please click the report center tab to re-enter the report module and try again',
    collectionSelected: 'The collection has been selected',
    collectionExcluded: 'The collection has been excluded',
    enterVersionNumber: 'please enter the version number',
    enterTargetTable: 'please enter the target table name',
    enterTargetDesc: 'please enter a description of the goal',
    expandFavorite: 'whether to expand favorites',
    collapseQuery: 'collapse query conditions',
    queryDefaultRows: 'default number of rows for query conditions'
  },
  // 具有通用性的文案
  tips: {
    more: 'more',
    all: 'all',
    noData: 'no data',
    filterResults: 'filter results',
    sourceTable: 'source table',
    targetTable: 'target table',
    targetDescription: 'target description',
    queryCondition: 'query condition',
    notEmpty: 'can not be empty',
    confirmExec: 'confirm execution',
    accepted: 'accepted',
    returned: 'returned',
    boxed: 'boxed',
    boxing: 'boxing',
    charged: 'charged',
    cashed: 'cashed',
    completed: 'completed',
    confirmed: 'confirmed',
    executed: 'executed',
    executing: 'executing',
    abnormalTermination: 'abnormal termination',
    profitable: 'profitable',
    sent: 'sent',
    submitted: 'submitted',
    system: 'system',
    terminated: 'terminated',
    approving: 'approving',
    invalid: 'invalid',
    approved: 'approved',
    rejected: 'rejected',
    virtualTable: 'virtual table',
    detail: 'detail',
    noFiles: 'No files',
    popUp: 'pop-up windows',
    searchResult: 'search result',
    serialNumber: 'serial number',
    beSelected: 'already selected',
    title: 'title',
    noPrompt: 'no prompt',
    userLogin: 'user login',
    message: 'message',
    asyncTask: 'asynchronous task',
    task: 'task',
    allTasks: 'all tasks',
    backHome: 'back to the homepage',
    myTask: 'my task',
    changePassword: 'change password',
    text: 'text',
    uploadAttachment: 'upload attachment',
    accountLogin: 'account login',
    phoneLogin: 'login with phone',
    getVerificationCode: 'get verification code',
    colorCode: 'color code',
    colorName: 'color name',
    mainColor: 'main color',
    secondaryColor: 'secondary color',
    sizeCode: 'size code',
    sizeName: 'size name',
    color: 'color',
    size: 'size',
    piece: 'piece',
    envVariable: 'environment variable',
    yes: 'yes',
    no: 'no',
    and: 'and',
    contain: 'contain',
    addPicture: 'add pictures',
    copyPermission: 'copy permissions',
    function: 'function',
    expand: 'expand',
    role: 'role',
    open: 'open',
    close: 'close',
    low: 'low',
    medium: 'medium',
    high: 'high',
    oldPassword: 'old password',
    newPassword: 'new password',
    default: 'default',
    templateName: 'template name',
    popRadio: 'pop-up radio',
    functionPermission: 'function permission',
    dataPermission: 'data permission',
    networkMonitor: 'network monitor',
    todoList: 'todo list',
    noMatchingData: 'no matching data',
    activityDate: 'activity date',
    quantity: 'quantity',
    basicInfo: 'basic information',
    label: 'label',
    hiddenColumn: 'hidden column',
    filterCondition: 'filter condition',
    serverProcessing: 'server processing',
    categoryNavigation: 'category navigation',
    systemMaintenance: 'system maintenance',
    operationTimeout: 'operation timeout',
    noPermission: 'permission denied',
    abnormal: 'abnormal',
    report: 'report',
    statistics: 'statistics',
    printWithTemplate: 'print with template',
    shortMessage: 'short message',
    dialog: 'dialog',
    hasBeenSelected: 'has been selected',
    hasBeenExcluded: 'has been excluded',
    notify: 'notify',
    priority: 'priority',
    sendTime: 'send time',
    allNotifications: 'all notifications',
    cancelVoid: 'cancel void',
    versionNumber: 'version number',
    loading: 'loading',
    name: 'name', 
    legend: 'legend',
    welcome: 'welcome'
  },
  // 反馈类型的文案(比如进行某个操作，返回操作结果的提示)
  feedback: {
    alert: 'alert',
    warning: 'warning',
    error: 'error',
    success: 'success',
    selected: 'selected',
    refreshSuccess: 'refresh successfully',
    saveSuccess: 'save successfully',
    modifyFail: 'fail to modify',
    safeWarning: 'safety warning',
    notSupportedFeature: 'This feature is not yet supported',
    collectionSuccess: 'collection success',
    collectionFailed: 'collection failed',
    unfavoriteSuccessfully: 'unfavorite successfully',
    failedToUnfavorite: 'failed to unfavorite',
    cloneSuccess: 'successfully clone'
  },
  // 动作行为(不含按钮里的)
  actions: {
    globalSearch: 'global search',
    selectAll: 'select all',
    clear: 'clear',
    match: 'match',
    exclude: 'exclude'
  },
  // 按钮
  buttons: {
    print: 'print', 
    search: 'search',
    reset: 'reset',
    refresh: 'refresh',
    back: 'back',
    temporaryStorage: 'temporary storage',
    cancel: 'cancel',
    confirm: 'confirm',
    close: 'close',
    import: 'import', 
    export: 'export', 
    selectFile: 'select file',
    submit: 'submit',
    add: 'add',
    batchEdit: 'batch edit',
    delete: 'delete',
    deleteDetails: 'delete details',
    cancelSubmission: 'cancel submission',
    copy: 'copy',
    invalid: 'invalid',
    batchUpdate: 'batch update',
    edit: 'edit',
    save: 'save',
    find: 'find',
    jump: 'jump',
    upload: 'upload',
    ignore: 'ignore',
    fold: 'fold',
    setting: 'setting',
    fullscreen: 'fullscreen',
    exitFullscreen: 'exit fullscreen',
    exit: 'exit',
    view: 'view',
    antiSubmit: 'anti-submit',
    viewDetails: 'view details',
    filter: 'filter',
    modify: 'modify',
    bulkSubmission: 'bulk submission',
    batchAdd: 'batch add',
    excludeSelectedRows: 'exclude selected rows',
    excludeAll: 'exclude all',
    addSelectedRow: 'add selected row',
    addAll: 'add all'
  },
  // 表单(具有通用性的文案)
  form: {
    inputPlaceholder: 'please enter ', 
    selectPlaceholder: 'please select ', 
  },
  // 表格(具有通用性的文案)
  table: {
    index: 'index',
    summation: 'summation',
    total: 'total'
  },
}
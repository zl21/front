import { Version } from '../constants/global'
import i18n from '../assets/js/i18n/index'

// 获取消息返回内容
function getTaskMessage(task) {
  return (
    (task.MESSAGE && task.MESSAGE.val) || (task.CONTENT && task.CONTENT.val)
  )
}

// 获取消息创建时间
function getCreatedTime(task) {
  const field = task.CREATIONDATE ? 'CREATIONDATE' : 'MODIFIEDDATE' // 开始日期有的话就取，没有就用修改日期
  return Version() === '1.3' ? task.BEGINTIME && task.BEGINTIME.val : task[field] && task[field].val
}

// 获取下载地址
function getUrl(task) {
  let url = ''
  const serviceId = window.localStorage.getItem('serviceId')
  const fileUrl = task.URL.val // 接口返回的下载地址
  if (fileUrl) {
    url = serviceId
      ? `/${serviceId}${JSON.parse(fileUrl)[0].url}`
      : JSON.parse(fileUrl)[0].url
  }
  return url
}

// 判断任务是否完成
function isTaskSuccess(task) {
  return Version() === '1.3'
    ? task.TASKSTATE.val === '已完成'
    : task.TASK_STATE.refobjval === 2
}

// 判断任务是否在进行中
function isTaskProcessing(task) {
  return !isTaskSuccess(task) && !isTaskError(task)
}

// 判断任务是否异常
function isTaskError(task) {
  return Version() === '1.3'
    ? task.TASKSTATE.val === '异常终止'
    : task.TASK_STATE.refobjval === 3
}

// 获取任务状态码
function getTaskCode(task) {
  if (isTaskError(task)) {
    return 3
  } else if (isTaskSuccess(task)) {
    return 2
  } else {
    return 1
  }
}

// 获取任务状态值
function getTaskVal(task) {
  return Version() === '1.3' ? task.TASKSTATE.val : task.TASK_STATE.val
}

function isExport(task) {
  if(Version() === '1.3') {
    return task.TASKTYPE.val === '导出'
  } else {
    return task.TITLE.val === 'excel导出'
  }
}

function getTaskName(task) {
  return isExport(task) ? i18n.t('buttons.export') : i18n.t('buttons.import')
}

export {
  getTaskMessage,
  getCreatedTime,
  getUrl,
  getTaskCode,
  getTaskVal,
  getTaskName,
  isTaskSuccess,
  isTaskProcessing,
  isTaskError,
  isExport,
}

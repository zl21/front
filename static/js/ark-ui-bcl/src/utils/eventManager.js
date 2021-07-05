const eventNamePrefix = 'AK_' // 统一事件前缀

// 定义可用的全局事件
const eventList = {
  ClickAgSort: {} // 对象里放事件参数
}

const globalEventList = {}
for(let key in eventList) {
  const eventName = `${eventNamePrefix}${key}`
  globalEventList[eventName] = {
    eventName: eventName,
    event: new CustomEvent(eventName, eventList[key])
  }
}

export default globalEventList


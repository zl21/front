// 字段配置接口
import network from '../__utils__/network';
import {
  enableGateWay
} from '../constants/global'

function autoGateWay(url) {
  if(enableGateWay()) {
    const {customizedModuleName,customizedModuleId} = vm.$route.params
    const originTable = vm.$router.$R3_history[`${customizedModuleName}/${customizedModuleId}`]
    const originTableName = originTable.params.tableName;
    const serviceIdMap = JSON.parse(window.localStorage.getItem('serviceIdMap') || '{}');
    return `/${serviceIdMap[originTableName]}${url}`
  } else {
    return url
  }
}

// 获取当前表的所有模板
export async function getAllTemplate(data, disabledGateWay) {
  const url = disabledGateWay ? `/p/cs/getAllTemplate?hash=${new Date() + Math.random().toString()}` : autoGateWay(`/p/cs/getAllTemplate?hash=${new Date()+ Math.random().toString()}`)
  const res = await network.post(url, data, {
    noServiceId: !disabledGateWay // 因为这个接口在标准列表和定制界面都用到。标准列表已经会自动给接口加网关。所以这里统一手动加网关
  })
  return Promise.resolve(res.data)
}

// 获取表的所有字段
export async function getAllFields(data) {
  const {customizedModuleId} = vm.$route.params
  const res = await network.post(autoGateWay('/p/cs/getAllcolumns'+ `?tableid=${customizedModuleId}&hash=${new Date()}`), data)
  return Promise.resolve(res.data)
}

// 新增模版
export async function createTemplate(data, disabledGateWay) {
  const url = disabledGateWay ? '/p/cs/addTemplateName' : autoGateWay('/p/cs/addTemplateName')
  const res = await network.post(url, data, {
    noServiceId: !disabledGateWay
  })
  return Promise.resolve(res.data)
}

// 查询模板字段
export async function getTemplateFields(data) {
  const res = await network.post(autoGateWay('/p/cs/getColumnTemplate'+ `?hash=${new Date()}`), data)
  return Promise.resolve(res.data)
}

// 保存修改模板字段
export async function saveFields(data) {
  const res = await network.post(autoGateWay('/p/cs/saveColumnTemplate'), data)
  return Promise.resolve(res.data)
}

// 保存和应用模板字段
export async function applyFields(data) {
  const res = await network.post(autoGateWay('/p/cs/saveAndUseTemplate'), data)
  return Promise.resolve(res.data)
}

// 删除模板
export async function removeTemplate(data) {
  const res = await network.post(autoGateWay('/p/cs/deleteColumnTemplate'), data)
  return Promise.resolve(res.data)
}

// 获取公共模板
export async function getPublicTemplate(data) {
  const res = await network.post(autoGateWay('/p/cs/getUserTemplate'), data)
  return Promise.resolve(res.data)
}
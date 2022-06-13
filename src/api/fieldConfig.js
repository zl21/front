// 字段配置接口
import network from '../__utils__/network'
import { enableGateWay } from '../constants/global'

// 根据来源表判断是否加网关
function autoGateWay(url) {
  if (enableGateWay()) {
    const { serviceId } = vm.$route.query
    return `/${serviceId}${url}`
  } else {
    return url
  }
}

// 获取当前表的所有模板
export async function getAllTemplate(data) {
  const res = await network.post(
    autoGateWay(
      `/p/cs/getAllTemplate?hash=${new Date() + Math.random().toString()}`
    ),
    data,
    {
      noServiceId: true,
    }
  )
  return Promise.resolve(res.data)
}

// 获取表的所有字段
export async function getAllFields(data) {
  const { customizedModuleId } = vm.$route.params
  const res = await network.post(
    autoGateWay(
      '/p/cs/getAllcolumns' +
        `?tableid=${customizedModuleId}&hash=${new Date()}`
    ),
    data,
    {
      noServiceId: true,
    }
  )
  return Promise.resolve(res.data)
}

// 新增模版
export async function createTemplate(data, disabledGateWay) {
  const res = await network.post(autoGateWay('/p/cs/addTemplateName'), data, {
    noServiceId: true,
    keepOpen: true
  })
  return Promise.resolve(res.data)
}

// 查询模板字段
export async function getTemplateFields(data) {
  const res = await network.post(
    autoGateWay('/p/cs/getColumnTemplate' + `?hash=${new Date()}`),
    data,
    {
      noServiceId: true,
    }
  )
  return Promise.resolve(res.data)
}

// 保存修改模板字段
export async function saveFields(data) {
  const res = await network.post(
    autoGateWay('/p/cs/saveColumnTemplate'),
    data,
    {
      noServiceId: true,
    }
  )
  return Promise.resolve(res.data)
}

// 保存和应用模板字段
export async function applyFields(data) {
  const res = await network.post(
    autoGateWay('/p/cs/saveAndUseTemplate'),
    data,
    {
      noServiceId: true,
    }
  )
  return Promise.resolve(res.data)
}

// 删除模板
export async function removeTemplate(data) {
  const res = await network.post(
    autoGateWay('/p/cs/deleteColumnTemplate'),
    data,
    {
      noServiceId: true,
    }
  )
  return Promise.resolve(res.data)
}

// 获取公共模板
export async function getPublicTemplate(data) {
  const res = await network.post(autoGateWay('/p/cs/getUserTemplate'), data, {
    noServiceId: true,
  })
  return Promise.resolve(res.data)
}

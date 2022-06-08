// 字段配置接口
import network from '../__utils__/network';

// 获取当前表的所有模板
export async function getAllTemplate(data) {
  const res = await network.post('/p/cs/getAllTemplate', data)
  return Promise.resolve(res.data)
}

// 获取表的所有字段
export async function getAllFields(data) {
  const res = await network.post('/p/cs/getAlcolumns', data)
  return Promise.resolve(res.data)
}


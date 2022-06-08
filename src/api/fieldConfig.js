// 字段配置接口
import network from '../__utils__/network';

export async function getAllTemplate(data) {
  const res = await network.post('/p/cs/getAllTemplate', data)
  return Promise.resolve(res.data)
}
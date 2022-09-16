import axios from 'axios'
import { Message } from 'element-ui'

// 当我们执行npm run dev 读取.env.development文件的内容 => /api => 触发代理 npm run build 走的生产
// process.env.VUE_APP_BASE_API这个值随着我们执行命令来改变
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // /api    /prod-api
  tiemout: 5000 // 设置超时时间
})
service.interceptors.request.use()

// 响应拦截器
service.interceptors.response.use(response => {
  // axiso默认加了一层data
  const { success, message, data } = response.data
  // 要根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经错误了， 还能进 then？ 不能！ 应该进catch
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 返回执行错误 让当前的执行链调出成功 直接进入 catch
})
export default service

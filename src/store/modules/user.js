import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login } from '@/api/user'
const state = {
  token: getToken() // 设置token为共享状态, 一初始化vuex就先从缓存中读取
}
const mutations = {
  setToken(state, token) {
    state.token = token // 将数据设置给vuex
    // 同步给缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null // 将vuex的数据置空
    removeToken() // 同步到缓存
  }
}
const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data) // 拿到token
    context.commit('setToken', result) // 设置token
    // 拿到token说明 登录成功
    setTimeStamp() // 设置当前的时间戳
  },
  // 登出操作
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户资料
    context.commit('removeUseInfo')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

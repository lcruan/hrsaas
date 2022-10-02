import store from '@/store'
// 混入对象
export default {
//   混入对象是组件的选项对象
  methods: {
    // 检查权限 要么有 要么没有  key是要检查的点
    checkPermission(key) {
      // 去用户的信息里面找 pints中有没有key 如果有key 则认为有权限 如果没有key则认为不能点击
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false
    }
  }
}

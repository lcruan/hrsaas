// 权限拦截在路由跳转 导航守卫

import router from '@/router'
import store from '@/store' // 引入store实例 和组件中的this.$store是一回事
import nProgress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css' // 引入进度条样式

// 此时 这个js不需要导出 因为在main.js直接引入的

// 导航前置守卫
// next是前置守卫必须执行的钩子 next必须执行 如果不执行 页面就死了
// next() // 放过
// next(false) 跳转终止
// next(地址) 跳转到这个地址
const whiteList = ['/login', '/404'] // 定义白名单
router.beforeEach((to, from, next) => {
  nProgress.start() // 开启进度条的意思
  if (store.getters.token) {
    // 如果有token
    if (to.path === '/login') {
      // 如果要访问的是登录页
      next('/') // 跳到主页
    } else {
      next()
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 表示要去的地址在白名单
      next()
    } else {
      next('/login')
    }
  }
})
// 导航后置守卫
router.afterEach(() => {
  nProgress.done() // 关闭进度条
})

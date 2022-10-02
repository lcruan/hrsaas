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
router.beforeEach(async(to, from, next) => {
  nProgress.start() // 开启进度条的意思
  if (store.getters.token) {
    // 只有有token的情况下 才能获取资料
    // 如果有token
    if (to.path === '/login') {
      // 如果要访问的是登录页
      next('/') // 跳到主页 // 有token 用处理吗？ 不用
    } else {
      // 只有放过的时候才去获取用户资料
      // 是每次都获取吗？
      // 如果当前vuex中有用户的资料的id 表示 已经有资料了 不需要获取了 如果没有id才需要获取
      if (!store.getters.userId) {
        // 如果没有id才表示当前用户资料没有获取过
        // async 函数所return的内容 用await就可以接收到
        const { roles } = await store.dispatch('user/getUserInfo')
        // 如果说后续 需要根据用户资料获取数据的话 这里必须改成 同步
        // 筛选用户的可用路由
        const routes = await store.dispatch('permission/filterRoutes', roles.menus) // 筛选得到当前用户可用的路由
        // routes就是筛选得到的动态路由
        // 动态路由 添加到 路由表中 默认路由表 只有静态路由没有动态路由
        // addRoutes 必须 用 next(地址) 不能用next()
        router.addRoutes(routes) // 添加动态路由 到路由表
        console.log(routes)
        // 添加完动态路由之后
        next(to.path) // 相当于跳到对应的地址 相当于多做一次跳转 为什么要多做一次跳转
        // 进门了 但是进门之后要去的地方的路还没有铺好，直接走 则掉坑里 多做一次跳转，再从门往里进一次，跳转之前 把路铺好，再进来的时候，路就铺好了
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 表示要去的地址在白名单
      next()
    } else {
      next('/login')
    }
    nProgress.done() // 解决手动切换地址时 进度条不关闭问题
  }
})
// 导航后置守卫
router.afterEach(() => {
  nProgress.done() // 关闭进度条
})

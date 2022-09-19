// 导出员工的路由规则 (动态路由)
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/employees', // 路由地址 /employees
  name: 'employees', // 给模块的一级路由加一个name属性 这个属性 我们后面会在做权限的时候用到
  component: Layout,
  children: [
    {
      // 这里的path为什么不写？ 因为当path是/employees地址的时候，不但要显示一级的layout 还要显示二级路由组件
      // 二级路由的path什么都不用写的时候 此时它表示二级路由的默认路由
      path: '', // 这里不用写 什么都不写表示 /employees 不但有布局 layout  => 员工主页
      component: () => import('@/views/employees'),
      //   路由的元信息 其实就是一个存储数据的地方 可以放任何内容
      meta: {
        title: '员工管理' // 这里为什么要用title 因为左侧导航读取了这里的title属性
      }
    }
  ]
}

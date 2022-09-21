import Layout from '@/layout'
export default {
  // 路由规则
  path: '/permission',
  name: 'permission',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/permission'),
      meta: {
        title: '工资',
        icon: 'money'
      }
    }
  ]
}

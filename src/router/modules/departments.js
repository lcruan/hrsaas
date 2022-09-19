import Layout from '@/layout'
export default {
  // 路由规则
  path: '/departments',
  name: 'departments',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/departments'),
      meta: {
        title: '组织架构'
      }
    }
  ]
}

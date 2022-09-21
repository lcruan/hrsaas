import Layout from '@/layout'
export default {
  // 路由规则
  path: '/social',
  name: 'social',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/social'),
      meta: {
        title: '社保',
        icon: 'table'
      }
    }
  ]
}

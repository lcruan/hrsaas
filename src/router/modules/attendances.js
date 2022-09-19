import Layout from '@/layout'
export default {
  // 路由规则
  path: '/attendances',
  name: 'attendances',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/attendances'),
      meta: {
        title: '考勤'
      }
    }
  ]
}

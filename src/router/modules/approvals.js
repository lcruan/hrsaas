import Layout from '@/layout'
export default {
  // 路由规则
  path: '/approvals',
  name: 'approvals',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/approvals'),
      meta: {
        title: '审批'
      }
    }
  ]
}

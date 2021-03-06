
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue'), redirect: to => {
        return { path: 'message', query: to.query }
      }},
      { path: 'numbers', component: () => import('pages/Numbers.vue') },
      { path: 'message', component: () => import('pages/Message.vue'), props: route => ({ query: route.query.n }) }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes

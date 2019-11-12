
export default [
  {
    path: '',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: './login/index'
  },
  {
    path: '/dataQuery',
    name: 'dataQuery',
    component: '../layouts/index',
    routes:[
      {
        path: '/dataQuery',
        component: './dataQuery/index'
      }
    ]
  },
  {
    path: '/wordCloud',
    name: 'wordCloud',
    component: '../layouts/index',
    routes:[
      {
        path: '/wordCloud',
        component: './wordCloud/index'
      }
    ]
  },
];

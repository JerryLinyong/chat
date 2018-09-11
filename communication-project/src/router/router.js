import Vue from 'vue'
import Router from 'vue-router'
import communication from '@/communication/communication'
import logIn from '@/logIn/logIn'
import register from '@/register/register'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'communication',
      component: communication
    },
    {
      path: '/logIn',
      name: 'logIn',
      component: logIn
    },
    {
      path: '/register',
      name: 'register',
      component: register
    }
  ]
})

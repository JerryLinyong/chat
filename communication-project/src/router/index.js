import Vue from 'vue'
import Router from 'vue-router'
import communication from '@/communication/index'
import logIn from '@/logIn/index'
import register from '@/register/index'

Vue.use(Router)

export default new Router({
  mode: 'history',
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

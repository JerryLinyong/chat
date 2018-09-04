import Vue from 'vue'
import Router from 'vue-router'
import communication from '@/communication/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'communication',
      component: communication
    }
  ]
})

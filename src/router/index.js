import Vue from 'vue'
import Router from 'vue-router'
import App from '../App.vue'

import Systems from '../components/pages/SystemsView'
import LandingPage from '../components/pages/LandingPage'


Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'systems',
      component: Systems
    }
  ]
})

import Vue from 'vue'
import Router from 'vue-router'
import App from '../App.vue'

import MainContent from '../components/MainContent'
import Systems from '../components/pages/SystemsView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/story',
      name: 'Home',
      component: MainContent
    },
    {
      path: '/',
      name: 'systems',
      component: Systems
    },

  ]
})

import Vue from 'vue'
import Router from 'vue-router'
import App from '../App.vue'

import MainContent from '../components/MainContent'
import UrbanHeat from '../components/pages/UrbanHeat'
import Stormwater from '../components/pages/Stormwater'
import Systems from '../components/pages/SystemsView'
import LandingPage from '../components/pages/LandingPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'LandingPage',
      component: LandingPage
    },
    {
      path: '/story',
      name: 'Home',
      component: MainContent
    },
    {
      path: '/urban-heat',
      name: 'urban-heat',
      component: UrbanHeat
    },
    {
      path: '/stormwater',
      name: 'stormwater',
      component: Stormwater
    },
    {
      path: '/systems',
      name: 'systems',
      component: Systems
    },

  ]
})

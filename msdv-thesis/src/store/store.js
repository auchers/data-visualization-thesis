import Vue from 'vue'
import Vuex from 'vuex'

import { bus } from '../main'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    debug : true,
    summary_bins: [],
  },

  getters: {
    getSummaryBins: (state) => {return state.summary_bins}
  },

  actions: {
    setSummaryBins: (activeMaps) => {
      store.commit('storeSummaryBins', activeMaps)
    }
  },

  mutations: {
    storeSummaryBins: (state, payload) => {
      if (state.debug) console.log('storing summary bins to store', payload);
      state.summary_bins = Object.assign({}, payload)
    }
  }
})

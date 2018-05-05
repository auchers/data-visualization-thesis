import Vue from 'vue'
import Vuex from 'vuex'

import { bus } from '../main'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    debug : true,
    summary: false,
    histogram_bins: [],
  },

  getters: {
    getSummary: (state) => {return state.summary},
    getHistogramBins: (state) => {return state.histogram_bins}
  },

  actions: {
    setSummary: (activeMaps) => {
      store.commit('storeSummary', activeMaps)
    }
  },

  mutations: {
    storeSummary: (state, payload) => {
      if (state.debug) console.log('storing summary to store');
      state.summary = Object.assign({}, payload)
    },

    storeHistogramBins: (state, payload) => {
      if (state.debug) console.log('storing histogram bins to store');
      state.histogram_bins = Object.assign({}, payload)
    },

  }
})

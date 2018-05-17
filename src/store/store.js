import Vue from 'vue'
import Vuex from 'vuex'

import { bus } from '../main'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    debug : false,
    summary: false,
    histogram_bins: [],
    isLayerActive: {"heat-reduction": false, "stormwater": false, "habitat": false},
  },

  getters: {
    getSummary: (state) => {return state.summary},
    getHistogramBins: (state) => {return state.histogram_bins},
    getActiveLayers: (state) => {return state.isLayerActive}
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

    updateActiveLayers: (state, layerName) => {
      let current = state.isLayerActive
      current[layerName] = !current[layerName];
      state.isLayerActive = Object.assign({}, current)
      if (state.debug) console.log('updating active layers', state.isLayerActive);
    },

  }
})

import Vue from "vue";
import Vuex from "vuex";
import VulnerabilityModel from "../types/VulnerabilityType";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    vulnerabilities: Array<VulnerabilityModel>()
  },
  getters: {
    getVulnerabilities: state => {
      return state.vulnerabilities;
    },
    getVulnerability: (state) => (id: number) => {
      return state.vulnerabilities.find(v => v.id === id);
    }
  },
  mutations: {
    saveVulnerability(state, payload) {
      state.vulnerabilities.push(payload);
    }
  },
  actions: {},
  modules: {}
});

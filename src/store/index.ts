import Vue from "vue";
import Vuex from "vuex";
// import VulnerabilityType from "../types/VulnerabilityType";
import VulnerabilitiesType from "../types/VulnerabilitiesType";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    vulnerabilities: {
      "en": {},
      "ja": {},
    }
  },
  getters: {
    getVulnerabilities: state => {
      return state.vulnerabilities;
    },
    getVulnerabilitiesForLang: (state) => (lang="en") => {
      return state.vulnerabilities[lang];
    },
    getVulnerability: (state) => (id: number, lang: string) => {
      return state.vulnerabilities[lang][id];
    }
  },
  mutations: {
    saveVulnerability(state, payload) {
      state.vulnerabilities[payload.lang][payload.vulnerability.id] = payload.vulnerability;
      return;
    }
  },
  actions: {},
  modules: {}
});

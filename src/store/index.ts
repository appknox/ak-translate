import Vue from "vue";
import Vuex from "vuex";
import VulnerabilityType from "../types/VulnerabilityType";
import VulnerabilitiesType from "../types/VulnerabilitiesType";
import hash from "object-hash";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    vulnerabilities: {
      en: {},
      ja: {}
    },
    modifiedVulnerabilities: {
      en: {},
      ja: {}
    }
  },
  getters: {
    getVulnerabilities: state => {
      return state.vulnerabilities;
    },
    getVulnerabilitiesForLang: state => (lang = "en") => {
      return state.vulnerabilities[lang];
    },
    getVulnerability: state => (id: number, lang: string) => {
      return state.vulnerabilities[lang][id];
    },
    getModifiedVulnerabilities: state => {
      return state.modifiedVulnerabilities;
    },
    getModifiedVulnerability: state => (id: number, lang: string) => {
      if (!state.modifiedVulnerabilities[lang][id]) {
        return null;
      }
      return state.modifiedVulnerabilities[lang][id]["vulnerability"];
    },
    getModifiedVulnerabilityFull: state => (id: number, lang: string) => {
      return state.modifiedVulnerabilities[lang][id];
    }
  },
  mutations: {
    saveVulnerability(state, payload) {
      state.vulnerabilities[payload.lang][payload.vulnerability.id] =
        payload.vulnerability;
      return;
    },
    saveModifiedVulnerabilityField(state, payload) {
      state.modifiedVulnerabilities[payload.lang][payload.id]["vulnerability"] =
        payload.vulnerability;
      return;
    },
    saveModifiedVulnerability(state, payload) {
      state.modifiedVulnerabilities[payload.lang][payload.id] = {
        "hash": payload.hash,
        "vulnerability": payload.vulnerability
      }
      return;
    },
    initModifiedVulnerabilities(state) {
      for (const lang of ["en", "ja"]) {
        Object.values(state.vulnerabilities[lang]).forEach((v: any) => {
          if (!state.modifiedVulnerabilities[lang][v.id]) {
            state.modifiedVulnerabilities[lang][v.id] = {
              hash: "",
              vulnerability: null
            };
          }
          state.modifiedVulnerabilities[lang][v.id]["hash"] = hash(v);
        });
      }
      return;
    },
    saveModifiedVulnerabilities(state, payload) {
      state.modifiedVulnerabilities = payload;
      return;
    }
  },
  actions: {},
  modules: {}
});

import Vue from "vue";
import Vuex from "vuex";
import hash from "object-hash";
import VulnerabilityType from "../types/VulnerabilityType";
import VulnerabilitiesType from "../types/VulnerabilitiesType";
import {
  TRANSLATION_DEFAULT_LANGUAGE,
  LANGUAGES,
  vulnerabilityMapTpl
} from "@/shared/languages";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    vulnerabilities: vulnerabilityMapTpl(),
    modifiedVulnerabilities: vulnerabilityMapTpl(),
    modifiedVulnerabilitiesCounter: 0,
    vulnerabilitiesCounter: 0,
    branch: "master",
    editor: "",
    language: "",
    commitCount: 0
  },
  getters: {
    getVulnerabilityMapTemplate: state => {
      return vulnerabilityMapTpl();
    },
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
    },
    getBranch: state => {
      return state.branch;
    },
    getLanguage: state => {
      return state.language;
    },
    getEditor: state => {
      return state.editor;
    },
    getCommitCount: state => {
      return state.commitCount;
    },
    hasEditBranch() {
      const currentBranch = localStorage.getItem("branch");
      if (!currentBranch || ["master", ""].includes(currentBranch)) {
        return false;
      }
      return true;
    }
  },
  mutations: {
    saveVulnerability(state, payload) {
      state.vulnerabilities[payload.lang][payload.vulnerability.id] =
        payload.vulnerability;
      state.vulnerabilitiesCounter = state.vulnerabilitiesCounter + 1;
      return;
    },
    updateVulnerabilityField(state, payload) {
      state.vulnerabilities[payload.lang][payload.id][payload.field] =
        payload.value;
      state.vulnerabilitiesCounter = state.vulnerabilitiesCounter + 1;
      return;
    },
    saveModifiedVulnerabilityField(state, payload) {
      state.modifiedVulnerabilities[payload.lang][payload.id]["vulnerability"] =
        payload.vulnerability;
      state.modifiedVulnerabilitiesCounter =
        state.modifiedVulnerabilitiesCounter + 1;
      return;
    },
    saveModifiedVulnerability(state, payload) {
      state.modifiedVulnerabilities[payload.lang][payload.id] = {
        hash: payload.hash,
        vulnerability: payload.vulnerability
      };
      state.modifiedVulnerabilitiesCounter =
        state.modifiedVulnerabilitiesCounter + 1;
      return;
    },
    initModifiedVulnerabilities(state) {
      for (const lang of LANGUAGES) {
        Object.values(state.vulnerabilities[lang.key]).forEach((v: any) => {
          if (!state.modifiedVulnerabilities[lang.key][v.id]) {
            state.modifiedVulnerabilities[lang.key][v.id] = {
              hash: "",
              vulnerability: null
            };
          }
          state.modifiedVulnerabilities[lang.key][v.id]["hash"] = hash(v);
        });
      }
      state.modifiedVulnerabilitiesCounter =
        state.modifiedVulnerabilitiesCounter + 1;
      return;
    },
    resetModifiedVulnerabilities(state) {
      for (const lang of LANGUAGES) {
        Object.values(state.vulnerabilities[lang.key]).forEach((v: any) => {
          state.modifiedVulnerabilities[lang.key][v.id] = {
            hash: hash(v),
            vulnerability: null
          };
        });
      }
      state.modifiedVulnerabilitiesCounter =
        state.modifiedVulnerabilitiesCounter + 1;
      return;
    },
    saveModifiedVulnerabilities(state, payload) {
      state.modifiedVulnerabilities = payload;
      state.modifiedVulnerabilitiesCounter =
        state.modifiedVulnerabilitiesCounter + 1;
      return;
    },
    initLanguage(state, payload) {
      if (!state.language) {
        let lang = localStorage.getItem("language");
        if (!lang) {
          localStorage.setItem("language", TRANSLATION_DEFAULT_LANGUAGE);
          lang = TRANSLATION_DEFAULT_LANGUAGE;
        }
        state.language = lang;
      }
    },
    saveBranch(state, payload) {
      state.branch = payload;
      return;
    },
    saveEditor(state, payload) {
      state.editor = payload;
      return;
    },
    saveCommitCount(state, payload) {
      state.commitCount = payload;
      return;
    }
  },
  actions: {},
  modules: {}
});

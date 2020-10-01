import Vue from "vue";
import Vuex from "vuex";
import hash from "object-hash";
import {
  TRANSLATION_DEFAULT_LANGUAGE,
  LANGUAGES,
  vulnerabilityMapTpl
} from "@/shared/languages";
import VulnerabilityType from "@/types/VulnerabilityType";

Vue.use(Vuex);

function initModVulnerabilities(state) {
  for (const lang of LANGUAGES) {
    Object.values(state.masterVulnerabilities[lang.key]).forEach(vuln => {
      const v: VulnerabilityType = vuln as VulnerabilityType;
      if (!state.modifiedVulnerabilities[lang.key][v.id]) {
        state.modifiedVulnerabilities[lang.key][v.id] = {
          hash: "",
          vulnerability: null
        };
      }
      state.modifiedVulnerabilities[lang.key][v.id]["hash"] = hash(v);
    });
  }
  state.modifiedVulnerabilitiesCounter += 1;
  return;
}

export default new Vuex.Store({
  state: {
    vulnerabilities: vulnerabilityMapTpl(),
    masterVulnerabilities: vulnerabilityMapTpl(),
    modifiedVulnerabilities: vulnerabilityMapTpl(),
    vulnerabilitiesCounter: 0,
    masterVulnerabilitiesCounter: 0,
    modifiedVulnerabilitiesCounter: 0,
    branch: "master",
    editor: "",
    language: "",
    commitCount: 0,
    languageCounter: 0,
    branchCounter: 0
  },
  getters: {
    getVulnerabilityMapTemplate: () => {
      return vulnerabilityMapTpl();
    },
    getVulnerabilities: state => {
      return state.vulnerabilities;
    },
    getMasterVulnerabilities: state => {
      return state.masterVulnerabilities;
    },
    getVulnerabilitiesForLang: state => (lang = "en") => {
      return state.vulnerabilities[lang];
    },
    getVulnerability: state => (id: number, lang: string) => {
      return state.vulnerabilities[lang][id];
    },
    getMasterVulnerability: state => (id: number, lang: string) => {
      return state.masterVulnerabilities[lang][id];
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
    hasEditBranch: state => {
      const currentBranch = state.branch || localStorage.getItem("branch");
      if (!currentBranch || ["master", ""].includes(currentBranch)) {
        return false;
      }
      return true;
    }
  },
  mutations: {
    saveVulnerability(state, payload) {
      state.vulnerabilities[payload.lang][payload.id] = payload.vulnerability;
      state.vulnerabilitiesCounter += 1;
      return;
    },
    updateVulnerabilityField(state, payload) {
      state.vulnerabilities[payload.lang][payload.id][payload.field] =
        payload.value;
      state.vulnerabilitiesCounter += 1;
      return;
    },
    saveMasterVulnerability(state, payload) {
      state.masterVulnerabilities[payload.lang][payload.id] =
        payload.vulnerability;
      state.masterVulnerabilitiesCounter += 1;
      return;
    },
    saveModifiedVulnerabilityField(state, payload) {
      if (!state.modifiedVulnerabilities[payload.lang][payload.id]) {
        initModVulnerabilities(state);
      }
      state.modifiedVulnerabilities[payload.lang][payload.id]["vulnerability"] =
        payload.vulnerability;
      state.modifiedVulnerabilitiesCounter += 1;
      return;
    },
    saveModifiedVulnerability(state, payload) {
      state.modifiedVulnerabilities[payload.lang][payload.id] = {
        hash: payload.hash,
        vulnerability: payload.vulnerability
      };
      state.modifiedVulnerabilitiesCounter += 1;
      return;
    },
    initModifiedVulnerabilities(state) {
      initModVulnerabilities(state);
    },
    resetModifiedVulnerabilities(state) {
      for (const lang of LANGUAGES) {
        Object.values(state.vulnerabilities[lang.key]).forEach(vuln => {
          const v: VulnerabilityType = vuln as VulnerabilityType;
          state.modifiedVulnerabilities[lang.key][v.id] = {
            hash: hash(v),
            vulnerability: null
          };
        });
      }
      state.modifiedVulnerabilitiesCounter += 1;
      return;
    },
    initLanguage(state) {
      if (!state.language) {
        let lang = localStorage.getItem("language");
        if (!lang) {
          localStorage.setItem("language", TRANSLATION_DEFAULT_LANGUAGE);
          lang = TRANSLATION_DEFAULT_LANGUAGE;
        }
        state.language = lang;
      }
    },
    switchLanguage(state, payload) {
      state.language = payload;
      localStorage.setItem("language", state.language);
      state.languageCounter += 1;
      return;
    },
    saveBranch(state, payload) {
      state.branch = payload;
      state.branchCounter += 1;
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

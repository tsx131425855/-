import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import app from "./modules/app";
import settings from "./modules/settings";
import user from "./modules/user";
import tagsView from "./modules/tagsView";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    tagsView,
    user
  },
  getters,
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      reducer(val) {
        return {
          // 只储存state中的
          app: val.app
        };
      }
    })
  ]
});

export default store;

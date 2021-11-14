import { login, logout, getadmin } from "@/api/user";
import { setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const state = {
  token: localStorage.getItem("Token"),
  name: "",
  avatar: "",
  userInfo: ""
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo;
  }
};

const actions = {
  // user login
  loginpHone({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const { data } = response;
          commit("SET_TOKEN", data.token);
          commit("SET_NAME", data.data.account);
          setToken(data.token);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit("SET_TOKEN", "");
          removeToken();
          resetRouter();
          localStorage.removeItem("Token");
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      removeToken();
      resolve();
    });
  },

  // 获取用户信息 info
  userInfo({ commit }) {
    return new Promise((resolve, reject) => {
      console.log(localStorage.getItem("Token"));
      getadmin({
        token: localStorage.getItem("Token")
      })
        .then(response => {
          const { data } = response;
          commit("SET_TOKEN", data.token);
          localStorage.setItem("user", JSON.stringify(response.data));
          commit("SET_USERINFO", response.data);
          setToken(data.token);
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

export default {
  // namespaced: true,
  state,
  mutations,
  actions
};

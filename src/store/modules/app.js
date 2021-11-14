import Cookies from "js-cookie";
import { sidebar } from "@/api/user";
const state = {
  /** 本来是准备再Headers 里面传了 但是 后面变成了 要再数据里面传 好吧  那就再数据里面传咯 */
  sidebar: {
    opened: Cookies.get("sidebarStatus")
      ? !!+Cookies.get("sidebarStatus")
      : true,
    withoutAnimation: false
  },
  device: "desktop",
  sidebarlist: [],
  agentMap: []
};

const mutations = {
  TOGGLE_SIDEBAR: state => {
    /** 看是传cookies  还是怎么弄 */
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      Cookies.set("sidebarStatus", 1);
    } else {
      Cookies.set("sidebarStatus", 0);
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set("sidebarStatus", 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
  SIDEBER_LIST: (state, sidebarlist) => {
    state.sidebarlist = sidebarlist.data;
    state.agentMap = sidebarlist.agent_map;
  }
};

const actions = {
  /** 就是提供给外部调用。 */
  toggleSideBar({ commit }) {
    commit("TOGGLE_SIDEBAR");
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit("CLOSE_SIDEBAR", withoutAnimation);
  },
  toggleDevice({ commit }, device) {
    commit("TOGGLE_DEVICE", device);
  },
  changeSidebar({ commit }) {
    const that = this;
    return new Promise((resolve, reject) => {
      sidebar().then(res => {
        if (res.code == 1) {
          if (res.data) {
            commit("SIDEBER_LIST", res);
            resolve(res);
          }
        } else if (res.code === 2) {
          that.$message.error(res.msg);
        } else {
          that.$message.error(res.msg);
        }
      });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

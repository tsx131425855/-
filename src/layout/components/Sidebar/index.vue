<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in sidebarlist"
          :key="route.title"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>

    <!-- <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >

      <sidebar-item v-for="route in sidebarlist" :key="route.title" :item="route" :base-path="route.route"></sidebar-item>
    </el-menu>
    </el-scrollbar>-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";
import { sidebar } from "@/api/user";
import defaultSettings from "@/settings";
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["sidebar", "sidebarlist"]),
    routes() {
      return this.$router.options.routes;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // 如果设置路径，侧边栏将突出显示您设置的路径
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      // console.log(this.$store.state.settings.sidebarLogo);
      return defaultSettings.leftNavLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  data() {
    /**
     * 这里存放数据
     */
    return {
      // sidebarlist: []
    };
  },
  created() {
    this.getData();
    this.$on("sidebar", function() {
      this.getData();
    });
  },
  methods: {
    getData() {
      this.$store.dispatch("app/changeSidebar").then(res => {
        // console.log(res);
      });
      // const that = this;
      // return new Promise((resolve, reject) => {
      //   sidebar().then(res => {
      //     if (res.code == 1) {
      //       this.sidebarlist = res.data;
      //     } else if (res.code === 2) {
      //       that.$message.error(res.msg);
      //     } else {
      //       that.$message.error(res.msg);
      //     }
      //   });
      //   resolve();
      // });
    }
  }
};
</script>

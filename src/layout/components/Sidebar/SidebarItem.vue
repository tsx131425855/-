<template>
  <div class="menu-wrapper">
    <router-link v-if="item.child.length==0" :to="resolvePath(item.route)">
      <el-menu-item :index="resolvePath(item.route)" :class="{'submenu-title-noDropdown':!isNest}">
        <i v-if="item.icon" :class="item.icon" />
        <span v-if="item&&item.title" slot="title">{{ item.title }}</span>
      </el-menu-item>
    </router-link>

    <el-submenu v-else :index="item.title||item.route">
      <template slot="title">
        <i v-if="item&&item.icon" :class="item.icon" />
        <span v-if="item&&item.title" slot="title">{{ item.title }}</span>
      </template>

      <template v-for="child in item.child">
        <sidebar-item
          v-if="child.child&&child.child.length>0"
          :key="child.rule_id"
          :is-nest="true"
          class="nest-menu"
          :item="child"
          :base-path="resolvePath(child.route)"
        />

        <router-link v-else :key="child.title" :to="resolvePath(child.route)">
          <el-menu-item :index="resolvePath(child.route)">
            <i v-if="child&&child.icon" :class="item.icon" />
            <span v-if="child&&child.title" slot="title">{{ child.title }}</span>
          </el-menu-item>
        </router-link>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils/validate";
import Item from "./Item";
import AppLink from "./Link";
import FixiOSBug from "./FixiOSBug";

export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ""
    }
  },
  data() {
    // TODO:使用render函数重构
    this.onlyOneChild = null;
    return {};
  },
  created() {},
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        console.log(item);
        if (item.hidden) {
          return false;
        } else {
          // 临时设置（只有一个显示子项时使用）
          this.onlyOneChild = item;
          return true;
        }
      });
      // 当只有一个子路由器时，默认显示子路由器
      if (showingChildren.length === 1) {
        return true;
      }

      // 如果没有要显示的子路由器，则显示父路由器
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }

      return false;
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    }
  }
};
</script>

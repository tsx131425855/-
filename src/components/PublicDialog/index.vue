<!-- tsx 弹框 -->
<template>
  <div class>
    <el-dialog
      :title="tsxTitle"
      :visible.sync="dialogVisible"
      :width="tsxWidth"
      :top="marginTop"
      :fullscreen="fullscreen"
      :close-on-click-modal="closeModal"
      :close-on-press-escape="closeEscape"
      :before-close="handleClose"
      :show-close="closeShow"
      :center="center"
    >
      <slot name="forms" />
    </el-dialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    tsxWidth: {
      //  弹框 宽度
      type: String,
      default: "800px"
    },
    tsxTitle: {
      //  弹框 标题
      type: String,
      default: ""
    },
    isShowVisible: {
      // 是否显示
      type: Boolean,
      default: false
    },
    marginTop: {
      // 距离顶部的距离
      type: String,
      default: "5vh"
    },
    fullscreen: {
      //  是否是全屏
      type: Boolean,
      default: false
    },
    closeModal: {
      //  是否可以通过点击 modal 关闭 Dialog
      type: Boolean,
      default: false
    },
    closeEscape: {
      //  是否可以通过按下 ESC 关闭 Dialog
      type: Boolean,
      default: false
    },
    closeShow: {
      //  	是否显示关闭按钮
      type: Boolean,
      default: true
    },
    center: {
      //  是否对头部和底部采用居中布局
      type: Boolean,
      default: false
    }
  },
  data() {
    // 这里存放数据
    return {
      dialogVisible: this.isShowVisible
    };
  },
  // 过滤器
  filters: {},
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    handleClose(done) {
      done();
      this.$emit("handleClose");
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  ctivated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang='scss' scoped>
// @import url(); 引入公共css类
</style>

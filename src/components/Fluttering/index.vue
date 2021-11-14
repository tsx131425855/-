<!-- tsx -->
<template>
  <div class="package" ref="heire" id="heire">
    {{clientWidth}}
    {{clientHeight}}
    {{left}}
    {{top}}
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      clientWidth: window.innerWidth,
      clientHeight: window.innerHeight,
      offsetWidth: document.body.offsetWidth,
      offsetHeight: document.body.offsetHeight,
      left: 0,
      top: 0,
      updown: true,
      inst: null
    };
  },
  // 过滤器
  filters: {},
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    const that = this;
    window.onresize = function temp() {
      that.clientHeight = `${document.documentElement.clientHeight}`;
      that.clientWidth = `${document.documentElement.clientWidth}`;
    };

    this.inst = setInterval(() => {
      if (this.clientWidth > this.left + 300) {
        this.left = this.left + 10;
      } else if (this.left + 300 > this.clientWidth) {
        this.left = this.left - 10;
      }

      if (this.updown) {
        if (this.top <= 0) {
          this.top = this.top + 10;
        } else if (this.clientHeight > this.top + 150) {
          this.top = this.top + 10;
        }
        if (this.top + 150 >= this.clientHeight) {
          this.updown = !this.updown;
        }
      }
      if (!this.updown) {
        if (this.top + 150 >= this.clientHeight) {
          this.top = this.top - 10;
        }
        if (this.top < 0) {
          this.updown = !this.updown;
        }
      }
      //   if (this.clientHeight > this.top + 150) {
      //     this.top = this.top - 10;
      //   }
      //   if (this.clientHeight > this.top + 150) {
      //     this.top = this.top + 10;
      //   } else if (this.top + 150 > this.clientHeight) {
      //     this.top = this.top - 10;
      //   }
      this.$refs.heire.style.left = `${this.left}px`;
      this.$refs.heire.style.top = `${this.top}px`;
      console.log(this.$refs.heire.style);
    }, 100);
  },
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {
    clearInterval(this.inst);
  }, // 生命周期 - 销毁完成
  ctivated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang='scss' scoped>
// @import url(); 引入公共css类
.package {
  width: 300px;
  height: 150px;
  border: 1px solid #fff;
  background-image: linear-gradient(to right, red, yellow);
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  z-index: 999;
  position: absolute;
}
</style>

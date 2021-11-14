<!-- tsx -->
<template>
  <div class>
    <div id="redzone"></div>
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
    return {};
  },
  // 过滤器
  filters: {},
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    addBao: function(left, height, src) {
      var div = document.createElement("div");
      var img = document.createElement("img");
      div.appendChild(img);
      img.className = "roll";
      img.src = src;
      div.style.left = left + "px";
      div.style.height = height + "px";
      div.className = "redBox";
      document.getElementById("redzone").appendChild(div);
      setTimeout(function() {
        document.getElementById("redzone").removeChild(div);
        // console.log(window.innerHeight);
      }, 3000);
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    let vueObject = this;
    setInterval(function() {
      var left = Math.random() * document.body.scrollWidth;
      var height = Math.random() * document.body.scrollHeight;
      //   var src = "./static/images/pocket.png";
      vueObject.addBao(left, height, "");
    }, 500);
  },
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
@keyframes redImg {
  0% {
    top: 0;
  }
  100% {
    top: 100%;
  }
}
.redBox {
  position: absolute;
  /* opacity: 0;*/
  z-index: 10000;
  animation: redImg 3s infinite linear;
  -webkit-animation: redImg 3s infinite linear;
  -moz-animation: redImg 3s infinite linear;
  -ms-animation: redImg 3s infinite linear;
  -o-animation: redImg 3s infinite linear;
}

.redBox {
  position: fixed;
  img {
    display: block;
    width: 1rem;
    height: 1.3rem;
  }
}
</style>

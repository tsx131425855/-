<!-- tsx -->
<template>
  <div class="homelist">
    <div class="barrage-div" ref="marquee">
      <!-- <img :src="mathimg" /> -->
      {{mathname}}
    </div>
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
      mathname: "搞定",
      mathtime: "",
      barrageList: [
        // data定义
        {
          name: "\u6211\u53FC\u4F60\u8001\u6BCD",
          time: "20s"
        },
        {
          name: "\u5751\u4F60\u6CA1\u5546\u91CF",
          time: "10s"
        },
        {
          name: "\u60F3\u5220\u6211\u5F39\u5E55\uFF1F\uFF1F\uFF1F",
          time: "60s"
        },
        {
          name: "\u5C31\u662F \u73A9\u73A9",
          time: "45s"
        }
      ]
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
    marqueeload(value) {
      // methods中的方法
      let mathnum = Math.floor(Math.random() * 3 + 1);
      this.mathname = this.barrageList[mathnum].name;
      this.mathtime = this.barrageList[mathnum].time;
      this.$refs.marquee.className = "barrage-div";
      //   this.$refs.marquee.style.animation = "myfirst 8s infinite";
      //   this.$refs.marquee.style.webkitAnimation = "myfirst 8s infinite";
      //   this.$refs.marquee.style.animationTimingFunction = "linear";
    },

    mounted() {
      let that = this;
      that.marqueeload();
      this.time1 = setInterval(() => {
        that.$refs.marquee.style.animation = "";
        that.$refs.marquee.style.animationTimingFunction = "";
        that.marqueeload();
      }, 8000);
    },
    beforeDestroy() {
      clearInterval(this.time1);
      this.time1 = null;
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    setTimeout(() => {
      this.mounted();
    });
  },
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
.homelist {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  z-index: 999;
}
.barrage-div {
  position: fixed;
  box-sizing: border-box;
  color: #fff;
  bottom: 60px;
  left: -300px;
  top: 60px;
  height: 30px;
  line-height: 30px;
  padding-right: 10px;
  border: 0px solid #fff;
  border-radius: 15px;
  font-size: 30px;
  overflow-x: hidden;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  animation: myfirst 8s infinite;
  -webkit-animation: myfirst 8s infinite;
  -webkit-animation-iteration-count: 3;
  img {
    width: 26px;
    height: 26px;
    vertical-align: middle; //内联块元素，居中对齐
    padding-left: 2px;
    border-radius: 50%;
  }
}
@-webkit-keyframes myfirst {
  0% {
    left: 100%;
  }
  25% {
    left: 50%;
  }
  50% {
    left: 0%;
  }
  75% {
    left: -50%;
  }
  100% {
    left: -100%;
  }
}

@keyframes myfirst {
  0% {
    left: 100%;
  }
  25% {
    left: 50%;
  }
  50% {
    left: 0%;
  }
  75% {
    left: -50%;
  }
  100% {
    left: -100%;
  }
}
</style>


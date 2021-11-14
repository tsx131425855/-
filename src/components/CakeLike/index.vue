<!-- 饼状图tsx -->
<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
/* eslint-disable */
require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/utils";
export default {
  // import引入的组件需要注入到对象中才能使用
  /* eslint-disable */
  components: {},
  props: {
      cakedata:{
          type:Object
      },
      legend:{
          type:Array
      },
      max:{
        type:Number,
        default:999
      },
    className: {
      type: String,
      default: "chart"
    },
     width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
  },
  data() {
    // 这里存放数据
    return {};
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
      cakedata: {
      deep: true,
      handler(val) {
        
        this.initChart(val)    
      }
    }
  },
  // 方法集合
  methods: {
    initChart({one,two,three} = {}) {
        
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption({
        tooltip: {
           trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
           orient: 'vertical',
            left: 'left',
            data: this.legend
        },
        series: [
          {
            name: "",
            type: "pie",
              radius: [0, 80],
            center: ['25%', '50%'],
            data: one,
            itemStyle :{
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
            }
          },
            {
            name: "",
            type: "pie",
            radius : [0, 80],
            center: ['50%', '50%'],
            data: two,
            itemStyle :{
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
            }
          },
          {
            name: "",
            type: "pie",
           radius : [0, 80],
            center: ['80%', '50%'],
            data: three,
            itemStyle :{
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
            }
          },
        ]
      });
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    // this.initChart();
    
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHanlder);
    this.chart.dispose();
    this.chart = null;
  }
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>
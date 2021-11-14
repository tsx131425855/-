<!-- 柱状图tsx -->
<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
/* eslint-disable */
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/utils";
export default {
  /* eslint-disable */
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
      chipsdata:{
          type:Object
      },
      legend:{
          type:Array
      },
      xAxis:{
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
      chipsdata: {
      deep: true,
      handler(val) {
        // console.log(val)
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
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data:this.legend,
          padding:0,
          top :0,
          left:0,
        },
        // grid: {
        //   top: 10,
        //   left: "2%",
        //   right: "2%",
        //   bottom: "3%",
        //   containLabel: true
        // },
        xAxis: [
          {
            data: this.xAxis,
            axisTick: {
              alignWithLabel: false,
               show: false
            },
           axisLine: {
            show: true
        },
        z: 10
          }
        ],
        yAxis: [
          {
           min:0,
           max:this.max,
            axisTick: {
              show: false
            }
          }
        ],
        dataZoom: [
        {
          zoomLock:true,
            type: 'slider',
            end : 20,
            start:0
        }
    ],
        series: [
          {
            name: this.legend[0],
            type: "bar",
            stack: "vistors",
            barWidth: "20px",
            data: one,
            itemStyle :{
                opacity :1
            }
          },
          {
            name: this.legend[1],
            type: "bar",
            stack: "vistors",
            barWidth: "20px",
            data: two,
             itemStyle :{
      opacity :0
            }
          },
          {
            name: this.legend[2],
            type: "bar",
            stack: "vistors",
            barWidth: "20px",
            data: three,
             itemStyle :{
      opacity :0
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
    // this.__resizeHanlder = debounce(() => {
    //   if (this.chart) {
    //     this.chart.resize();
    //   }
    // }, 100);
    // window.addEventListener("resize", this.__resizeHanlder);
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
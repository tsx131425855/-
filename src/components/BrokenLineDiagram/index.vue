
<!-- 折线图tsx -->
<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/utils";

export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "350px"
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object
    },
    xAxis: {
      type: Array
    },
    legend: {
      type: Array
    },
    max: {
      type: Number,
      default: 999
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        // console.log(val);
        this.setOptions(val);
      }
    }
  },
  created() {},
  mounted() {
    // this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    if (this.autoResize) {
      window.removeEventListener("resize", this.__resizeHanlder);
    }
    // const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    // sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    setOptions({ one, two, three } = {}) {
      if (this.chart) {
        this.chart.setOption({
          xAxis: {
            data: this.xAxis,
            boundaryGap: false,
            axisTick: {
              show: false
            }
          },
          grid: {
            left: 10,
            right: 10,
            bottom: 20,
            top: 30,
            containLabel: true
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross"
            },
            padding: [15, 10]
          },
          yAxis: {
            max: this.max,
            axisTick: {
              show: false
            }
          },
          legend: {
            data: this.legend,
            left: 0
          },
          toolbox: {
            left: "center",
            feature: {
              dataZoom: {
                yAxisIndex: "none"
              },
              restore: {},
              saveAsImage: {}
            }
          },
          series: [
            {
              name: this.legend[0],
              smooth: true,
              type: "line",
              data: one,
              color: "#d58569",
              itemStyle: {
                shadowBlur: {
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                  shadowBlur: 10,
                  color: "#d58569"
                },
                width: 5
              }
            },
            {
              name: this.legend[1],
              smooth: true,
              type: "line",
              data: two,
              clip: false,
              lineStyle: {
                opacity: 0
              },
              itemStyle: {
                opacity: 0
              }
            },
            {
              name: this.legend[2],
              smooth: true,
              type: "line",
              data: three,
              clip: false,
              lineStyle: {
                opacity: 0
              },
              itemStyle: {
                opacity: 0
              }
            }
          ]
        });
      }
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
    }
  }
};
</script>

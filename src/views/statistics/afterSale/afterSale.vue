<!-- tsx售后 -->
<template>
  <div class="package">
    <div class="bothSides">
      <div>
        <div>
          <span>今日 &nbsp;&nbsp;&nbsp;</span>
          <span>订单总数:{{ sunData.order_count_today }}&nbsp;</span>
          <span>订单总额:{{ sunData.order_pay_today }} &nbsp;</span>
          <span>退款订单数:{{ sunData.refund_num_today }} &nbsp;</span>
          <span>退款率:{{ sunData.refund_probability_today }} &nbsp;</span>
        </div>
        <div>
          <span>昨日 &nbsp;&nbsp;&nbsp;</span>
          <span>订单总数:{{ sunData.order_count_yesterday }}&nbsp;</span>
          <span>订单总额:{{ sunData.order_pay_yesterday }} &nbsp;</span>
          <span>退款订单数:{{ sunData.refund_num_yesterday }} &nbsp;</span>
          <span>退款率:{{ sunData.refund_probability_yesterday }} &nbsp;</span>
        </div>
      </div>
      <div>
        <el-button round @click="status=1,getDataChart()">今日</el-button>
        <el-button round @click="status=2,getDataChart()">本月</el-button>
      </div>
    </div>
    <BrokenLineDiagram ref="bld" :chartData="chaart" :x-axis="xAxis" :max="max" :legend="legend" />

    <div class="hide">
      <el-select v-if="agent.length>0" v-model="agent_id" class="maright" placeholder="请选择">
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <el-input
        v-model="keyword"
        class="input"
        prefix-icon="el-icon-search"
        placeholder="订单号/手机号/售后编号"
        @change="inputentry"
      />
      <div class="maright">筛选条件</div>
      <el-select v-model="condition" class="maright" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-date-picker
        v-model="time"
        class="maright"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="startend"
      />
      <el-button type="success" class="maright" @click="page=1,getDatalist()">查询</el-button>
      <el-button v-if="derive==1" class="maright" plain @click="exporte">导出</el-button>
    </div>
    <template>
      <el-table
        v-loading="loading"
        :data="dataList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55" />
        <el-table-column prop="service_sn" label="售后编号" />
        <el-table-column prop="order_sn" label="订单编号" />
        <el-table-column prop="create_time" label="售后时间" width="100" />
        <el-table-column prop="user_nickname" label="下单账号" />
        <el-table-column prop="product_id" label="商品ID" />
        <el-table-column prop="number" label="商品数量" width="90" />
        <el-table-column prop="product_name" label="商品名称" />
        <el-table-column prop="amount_pay" label="实付金额" width="100" />
        <el-table-column prop="return_product" label="退货退款" width="100">
          <template slot-scope="scope">{{ scope.row.return_product=="1"?"退货退款":"退货" }}</template>
        </el-table-column>
        <el-table-column prop="midou_money" label="蜜豆抵扣" width="80" />
        <el-table-column prop="money" label="退款金额" width="100" />
        <el-table-column prop="status_text" label="订单状态" width="100" />
        <el-table-column prop="agent_name" label="代理商" />
      </el-table>
    </template>
    <div class="block">
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 30, 40,50]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
/* eslint-disable */
import { Servicelist, Servicechart, ServiceExport } from "@/api/statistics";
import echarts from "echarts";
import BrokenLineDiagram from "@/components/BrokenLineDiagram";

import { turnDate, exporteurl, exportFile } from "@/utils/user";

export default {
  /* eslint-disable */
  // import引入的组件需要注入到对象中才能使用
  components: { BrokenLineDiagram },
  data() {
    // 这里存放数据
    return {
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      status: 1, // 状态 1：今日 2：本月
      sunData: {},
      xAxis: [],
      legend: [],
      dataList: [],
      chaart: {},
      keyword: "",
      time: [new Date(new Date().setHours(0, 0, 0, 0)), new Date()],
      condition: "-1",
      options: [
        {
          value: "-1",
          label: "全部"
        },
        {
          value: "1",
          label: "自提"
        },
        {
          value: "0",
          label: "物流"
        }
      ],
      multipleSelection: [],
      start_time: "",
      end_time: "",
      max: 999,
      loading: false,
      derive: "",
      agent: [],
      agent_id: ""
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
    handleCurrentChange(val) {
      // 页数
      this.page = val;
      console.log(`当前页: ${val}`);
      this.getDatalist();
    },
    handleSizeChange(val) {
      this.limit = val;
      console.log(`每页 ${val} 条`);
      localStorage.setItem("limit", val);
      this.page = 1;
      this.getDatalist();
    },
    inputentry(e) {
      // 搜索 输入
      this.keyword = e;
    },
    handleSelectionChange(val) {
      /** 选中 */
      let arr = [];
      val.map(res => {
        arr.push(res.service_id);
      });
      this.multipleSelection = arr;
    },
    startend(val) {
      /** 获取时间 */
      if (val) {
        this.start_time = turnDate(val[0]);
        this.end_time = turnDate(val[1]);
      } else {
        this.start_time = Day();
        this.end_time = sameDay();
        this.time = [Day(), sameDay()];
      }
    },
    exporte() {
      /** 导出 */
      let url = `${exporteurl}${ServiceExport}?self=${
        this.condition
      }&agent_id=${this.agent_id}&start_time=${this.start_time}&end_time=${
        this.end_time
      }&keywords=${this.keyword}&service_id=${
        this.multipleSelection
      }&token=${localStorage.getItem("Token")}`;
      exportFile(url);
    },
    getDataChart() {
      const data = {
        agent_id: this.agent_id,
        date: this.status
      };
      const that = this;
      return new Promise((resolve, reject) => {
        Servicechart(data).then(res => {
          if (res.code == 1) {
            that.sunData = res.data;
            let obj = {
              one: res.data.service_info.service_num,
              two: res.data.service_info.service_pay
            };
            let max = res.data.service_info.service_num.concat([]);
            that.max = max
              .sort(function(a, b) {
                return a - b;
              })
              .reverse()[0];
            that.chaart = obj;
            that.legend = res.data.service_info.service_name;
            that.xAxis = res.data.service_info.times;
            that.$refs.bld.initChart();
          } else if (res.code === 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch(error => {
        console.log(error);
      });
    },
    getDatalist() {
      const data = {
        page: this.page,
        start_time: this.start_time,
        end_time: this.end_time,
        keyword: this.keyword,
        limit: this.limit,
        agent_id: this.agent_id,
        self: this.condition
      };
      this.loading = true;
      const that = this;
      return new Promise((resolve, reject) => {
        Servicelist(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            that.total = res.data.total;
            if (res.action) {
              res.action.map(val => {
                if (val.tag == "export" && val.display == 1) {
                  that.derive = 1;
                }
              });
            }
            if (res.agent_map) {
              that.agent = res.agent_map;
            }
            that.dataList = res.data.list;
          } else if (res.code === 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch(error => {
        console.log(error);
      });
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getDatalist();
    this.getDataChart();
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
@import "src/styles/hide.scss";
</style>
<!-- 订单统计 -->
<template>
  <div class="package">
    <div class="bothSides">
      <div class="block">
        <div v-if="sunData.summary_data_1">
          <span>{{ sunData.summary_data_1.name }} &nbsp;&nbsp;&nbsp;</span>
          <span>订单数量:{{ sunData.summary_data_1.order_num }}&nbsp;</span>
          <span>订单总额:{{ sunData.summary_data_1.total_amount }} &nbsp;</span>
          <span>下单人数:{{ sunData.summary_data_1.buyer_num }}</span>
        </div>
        <div v-if="sunData.summary_data_2">
          <span>{{ sunData.summary_data_2.name }} &nbsp;&nbsp;&nbsp;</span>
          <span>订单数量:{{ sunData.summary_data_2.order_num }} &nbsp;</span>
          <span>订单总额:{{ sunData.summary_data_2.total_amount }} &nbsp;</span>
          <span>下单人数:{{ sunData.summary_data_2.buyer_num }}</span>
        </div>
      </div>
      <div>
        <span style="margin-right: 10px;">代理商</span>
        <el-select v-if="agent.length>0" v-model="agent_id_chart" placeholder="请选择" size="mini">
          <el-option
            v-for="item in agent"
            :key="item.agent_id"
            :label="item.name"
            :value="item.agent_id"
          />
        </el-select>
        <el-button type="primary" round @click="stat_type=2,getDataChart()">今日</el-button>
        <el-button round @click="stat_type=4,getDataChart()">本月</el-button>
      </div>
    </div>
    <BrokenLineDiagram ref="bld" :chart-data="chaart" :max="max" :x-axis="xAxis" :legend="legend" />
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
        placeholder="请输入订单号/手机号"
        @change="inputentry"
      />
      <!-- <el-select class="maright" v-model="identity_state" placeholder="请选择身份">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>-->
      <el-select v-model="address_type" placeholder="配送方式" class="maright">
        <el-option v-for="item in times" :key="item.value" :label="item.label" :value="item.value" />
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
      <!-- <ListTable :dataList="vipList" ></ListTable> -->
    </div>
    <template>
      <el-table
        v-loading="loading"
        :data="orderList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55" />
        <el-table-column prop="order_sn" label="订单id" width="70" />
        <el-table-column prop="user" label="下单账号">
          <template slot-scope="scope">{{ scope.row.user? scope.row.user.user_nickname :"" }}</template>
        </el-table-column>
        <el-table-column label="下单手机号">
          <template slot-scope="scope">{{ scope.row.user? scope.row.user.user_tel :"" }}</template>
        </el-table-column>
        <el-table-column prop="product" label="商品id" :formatter="dateFormatter" />
        <el-table-column prop="product" label="商品名称" width="180">
          <template slot-scope="scope">
            <pre>{{ scope.row.product | productname }}</pre>
          </template>
        </el-table-column>
        <el-table-column prop="product" label="商品单价">
          <template slot-scope="scope">
            <pre>{{ scope.row.product | priceorigin }}</pre>
          </template>
        </el-table-column>
        <el-table-column prop="product" label="商品数量">
          <template slot-scope="scope">
            <pre>{{ scope.row.product | priceornumber }}</pre>
          </template>
        </el-table-column>
        <el-table-column prop="postage" label="邮费总额" />
        <el-table-column prop="amount_product" label="商品总额" />
        <el-table-column prop="order_amount" label="订单总额" />
        <el-table-column prop="coupon_dis" label="优惠券抵扣" />
        <el-table-column prop="coin_dis" label="金币抵扣" width="80" />
        <el-table-column prop="midou_money" label="蜜豆抵扣" width="80" />
        <el-table-column prop="member_dis" label="自购优惠" />
        <el-table-column prop="amount_pay" label="实付" width="80" />
        <el-table-column prop="address_type_text" label="配送方式" width="80" />
        <el-table-column prop="status_text" label="订单状态" width="80" />
        <el-table-column prop="create_time" label="下单时间" width="100" />
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
/* eslint-disable */
import { orderchart, orderlisst, orderExport } from "@/api/statistics";
import echarts from "echarts";
import BrokenLineDiagram from "@/components/BrokenLineDiagram";
import { turnDate, exporteurl, sameDay, Day, exportFile } from "@/utils/user";
export default {
  /* eslint-disable */
  //import引入的组件需要注入到对象中才能使用
  components: { BrokenLineDiagram },
  data() {
    //这里存放数据
    return {
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      pageSize: 100,
      xAxis: [],
      legend: [],
      max: 99,
      start_time: Day(),
      end_time: sameDay(),
      keyword: "",
      chaart: {},
      identity_state: "",
      options: [],
      time_v: "",
      stat_type: 2,
      address_type: "3",
      sunData: {},
      orderList: [],
      time: [new Date(new Date().setHours(0, 0, 0, 0)), new Date()],
      times: [
        { value: "1", label: "物流" },
        { value: "2", label: "自提" },
        { value: "3", label: "全部" }
      ],
      multipleSelection: [],
      loading: false,
      derive: "1",
      agent_id:
        JSON.parse(localStorage.getItem("user")).agent_id == 1
          ? ""
          : JSON.parse(localStorage.getItem("user")).agent_id,
      agent: [],
      agent_id_chart: "0"
    };
  },
  filters: {
    // 过滤器
    productname(val) {
      return val.map(res => res.product_name).join("\n");
    },
    priceorigin(val) {
      return val.map(res => res.price).join("\n");
    },
    priceornumber(val) {
      return val.map(res => res.number).join("\n");
    }
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
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
        arr.push(res.order_id);
      });
      this.multipleSelection = arr;
    },
    startend(val) {
      /** 获取时间 */
      if (val) {
        this.start_time = turnDate(val[0]);
        this.end_time = turnDate(val[1]);
      } else {
        this.start_time = "";
        this.end_time = "";
        this.time = [];
      }
    },
    exporte() {
      /** 导出 */
      let url = `${exporteurl}${orderExport}?address_type=${
        this.address_type
      }&start_time=${this.start_time}&end_time=${this.end_time}&keywords=${
        this.keyword
      }&order_ids=${this.multipleSelection}&agent_id=${
        this.agent_id
      }&is_export=1&token=${localStorage.getItem("Token")}`;
      exportFile(url);
    },
    getDataChart() {
      const data = {
        agent_id: this.agent_id_chart,
        stat_type: this.stat_type
      };
      const that = this;
      return new Promise((resolve, reject) => {
        orderchart(data).then(res => {
          if (res.code == 1) {
            that.sunData = res.data;
            let obj = {
              one: res.data.chart_data.order_num_list, //订单数量
              two: res.data.chart_data.total_amount_list.map(res =>
                parseFloat(res)
              ), //订单总额
              three: res.data.chart_data.buyer_num_list //购买人次
            };
            that.chaart = obj;
            let max = res.data.chart_data.order_num_list.concat([]);

            that.max = max.sort(function(a, b) {
              return b - a;
            })[0];

            that.legend = res.data.chart_data.explain_list;
            that.xAxis = res.data.chart_data.time_arr;
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
        keywords: this.keyword,
        page_num: this.limit,
        agent_id: this.agent_id,
        address_type: this.address_type
      };
      const that = this;
      this.loading = true;
      return new Promise((resolve, reject) => {
        orderlisst(data).then(res => {
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
            that.orderList = res.data.list;
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
    dateFormatter(row) {
      let arr = [];
      row.product.map(res => {
        arr.push(res.product_id);
      });
      return arr.join(",");
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getDataChart();
    this.getDatalist();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
@import "src/styles/hide.scss";
</style>
<style scoped >
div {
  word-break: keep-all;
}
</style>
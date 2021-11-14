<!-- tsx 外卖订单 -->
<template>
  <div class="package">
    <div class="hide">
      <el-select v-model="agent_id" size="small" class placeholder="请选择代理商">
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <el-select v-model="date_type" size="small" class="gaosizuobian" placeholder="请选择">
        <el-option
          v-for="item in date_map"
          :key="item.value"
          :label="item.text"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="time"
        style="margin-left: 30px;"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <span class="gaosizuobian">订单状态</span>
      <el-select v-model="status" size="small" class="gaosizuobian" placeholder="请选择">
        <el-option
          v-for="item in status_map"
          :key="item.value"
          :label="item.text"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-model="keyword"
        size="small"
        class="input gaosizuobian"
        prefix-icon="el-icon-search"
        placeholder="订单编号/用户账号"
      />
      <el-button
        type="success"
        size="small"
        class
        icon="el-icon-search"
        @click="page=1,getDatalist()"
      >查询</el-button>
      <el-button
        v-if="daochu==1"
        type="success"
        size="small"
        icon="el-icon-search"
        @click="exporte"
      >导出</el-button>
    </div>

    <el-table v-loading="loading" :data="datalist" style="width: 100%">
      <el-table-column fixed align="center" prop="order_sn" label="订单编号" />
      <el-table-column align="center" prop="user_nickname" label="用户昵称" />
      <el-table-column align="center" prop="create_time" label="下单日期" />
      <el-table-column align="center" prop="user_tel" label="用户账号" />
      <el-table-column align="center" prop="store_name" label="商家名称" />
      <el-table-column align="center" prop="agent_name" label="地区" />
      <el-table-column align="center" prop="amount" label="订单总金额" />
      <el-table-column align="center" prop="amount_pay" label="微信支付金额" />
      <el-table-column align="center" prop="balance" label="余额支付金额" />
      <el-table-column align="center" prop="midou_money" label="蜜豆抵扣金额" />
      <el-table-column align="center" prop="fee" label="手续费" />
      <el-table-column align="center" prop="coupon_dis" label="优惠劵优惠金额" />
      <el-table-column align="center" prop="red_packet_dis" label="红包优惠金额" />
      <el-table-column align="center" prop="platform_comm" label="平台抽成" />
      <el-table-column align="center" prop="agent_comm" label="代理商抽成" />
      <el-table-column align="center" prop="village_rebate_comm" label="粉丝返佣" />
      <el-table-column align="center" prop="referer_rebate_comm" label="推荐人返佣（余额）" />
      <el-table-column align="center" prop="status_text" label="订单状态" />
      <el-table-column align="center" prop="service_status" label="是否申请售后" />
      <el-table-column align="center" prop="service_balance" label="退余额" />
      <el-table-column align="center" prop="service_money" label="退微信" />
      <el-table-column align="center" prop="service_fee" label="退手续费" />
      <el-table-column align="center" prop="service_midou_money" label="退蜜豆" />
      <el-table-column align="center" prop="service_comm" label="佣金返回余额" />
    </el-table>

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

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { statisindex, statisexport } from "@/api/finance";
import { exporteurl, turnDate, exportFile } from "@/utils/user";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      keyword: "",
      datalist: [],
      agent_id: "0",
      agent: [],
      multipleSelection: [],
      loading: false,
      time: [],
      start_date: "",
      stop_date: "",
      status: "",
      status_map: [],
      daochu: 0,
      date_type: 0,
      date_map: []
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
    exporte() {
      /** 导出 */
      let start_date = "";
      let stop_date = "";
      if (this.time != null && this.time.length > 0) {
        if (this.time[0] instanceof Date) {
          start_date = turnDate(this.time[0], 3);
        }
        if (this.time[1] instanceof Date) {
          stop_date = turnDate(this.time[1], 3);
        }
      }
      const url = `${exporteurl}${statisexport}?keyword=${
        this.keyword
      }&agent_id=${this.agent_id}&date_type=${this.date_type}&status=${
        this.status
      }&start_date=${start_date}&stop_date=${stop_date}&token=${localStorage.getItem(
        "Token"
      )}`;
      exportFile(url);
    },
    sort(val) {
      if (val.order == "ascending") {
        // 上
        this.date_type = "ASC";
      } else if (val.order == "descending") {
        // 下
        this.date_type = "DESC";
      }
      this.getDatalist();
    },
    getDatalist() {
      let start_date = "";
      let stop_date = "";
      if (this.time != null && this.time.length > 0) {
        if (this.time[0] instanceof Date) {
          start_date = turnDate(this.time[0], 3);
        }
        if (this.time[1] instanceof Date) {
          stop_date = turnDate(this.time[1], 3);
        }
      }

      const data = {
        keyword: this.keyword,
        status: this.status,
        page: this.page,
        limit: this.limit,
        agent_id: this.agent_id,
        date_type: this.date_type,
        start_date,
        stop_date
      };
      const that = this;
      statisindex(data).then(res => {
        if (res.code == 1) {
          if (res.action) {
            res.action.map(val => {
              switch (val.tag) {
                case "export":
                  if (val.display == 1) {
                    that.daochu = 1;
                  }
                  break;
              }
            });
          }
          that.datalist = res.data.list;
          that.total = res.data.total;
          that.agent = res.agent_map;
          that.status_map = res.data.status_map;
          that.date_map = res.data.date_map;
        } else {
          that.$message.error(res.msg);
        }
      });
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getDatalist();
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
@import "src/styles/hide.scss";
</style>

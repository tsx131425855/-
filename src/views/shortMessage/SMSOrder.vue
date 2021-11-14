<!-- tsx -->
<template>
  <div class="package">
    <div class="hide backtsx">
      <span>支付时间：</span>
      <el-date-picker
        v-model="dateRange"
        type="datetimerange"
        class="legf"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="margin-right:20px"
      />
      <span>支付方式：</span>
      <el-select v-model="pay_type" class="maright legf" placeholder="请选择">
        <el-option
          v-for="item in pay_type_map"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <el-input v-model="keyword" style="width:220px;margin-right:20px" placeholder="下单账号/短信套餐名称" />
      <el-button
        type="success"
        style="margin-left:20px"
        icon="el-icon-search"
        @click="page = 1,SMSRecord()"
      >查询</el-button>
      <el-button type="warning" @click="see">查看</el-button>
      <el-button type="info" icon="el-icon-printer" @click="exportData">导出</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="datalist"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed type="selection" width="55" align="center" />
      <el-table-column prop="order_sn" label="订单号" />
      <el-table-column prop="order_name" label="下单账号" />
      <el-table-column prop="order_type" label="账号类型" />
      <el-table-column prop="meal" label="短信套餐名称" />
      <el-table-column prop="num_amount" label="短信条数" />
      <el-table-column prop="pay_amount" label="订单价格" />
      <el-table-column prop="pay_type" label="支付方式" />
      <el-table-column prop="order_discount" label="订单优惠" />
      <el-table-column prop="pay_amount" label="实际支付" />
      <el-table-column prop="pay_time" label="支付时间" />
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
    <PublicDialog
      v-if="order_show"
      :is-show-visible="order_show"
      tsx-title="订单详情"
      tsx-width="1200px"
      :center="true"
      @handleClose="handleClose"
    >
      <div slot="forms">
        <el-row :gutter="20" style="margin-bottom: 50px;">
          <el-col :span="6">
            <span>订单号：{{ datashow.order_sn }}</span>
          </el-col>
          <el-col :span="6">
            <span>下单账号：{{ datashow.contact_num }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 50px;">
          <el-col :span="6">
            <span>短信套餐：{{ datashow.order_meal }}</span>
          </el-col>
          <el-col :span="6">
            <span>短信条数：{{ datashow.num_amount }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 50px;">
          <el-col :span="6">
            <span>订单总额：{{ datashow.pay_amount }}</span>
          </el-col>
          <el-col :span="6">
            <span>订单优惠：{{ datashow.order_discount }}</span>
          </el-col>
          <el-col :span="6">
            <span>实际支付：{{ datashow.pay_amount }}</span>
          </el-col>
        </el-row>

        <div style="border: 1px solid #ccc;padding: 20px 10px;">
          <el-row :gutter="20">
            <el-col :span="6">
              <span>付款单号</span>
            </el-col>
            <el-col :span="4">
              <span>付款时间</span>
            </el-col>
            <el-col :span="4">
              <span>付款金额</span>
            </el-col>
            <el-col :span="4">
              <span>付款账号</span>
            </el-col>
            <el-col :span="4">
              <span>付款账号类型</span>
            </el-col>
          </el-row>
        </div>
        <div style="border: 1px solid #ccc;padding: 20px 10px;">
          <el-row :gutter="20">
            <el-col :span="6">
              <span>{{ datashow.transaction_id }}</span>
            </el-col>
            <el-col :span="4">
              <span>{{ datashow.pay_time }}</span>
            </el-col>
            <el-col :span="4">
              <span>{{ datashow.pay_amount }}</span>
            </el-col>
            <el-col :span="4">
              <span>{{ datashow.pay_num }}</span>
            </el-col>
            <el-col :span="4">
              <span>{{ datashow.pay_type_text }}</span>
            </el-col>
          </el-row>
        </div>
        <div style="display: flex;justify-content: flex-end; margin-top: 20px;">
          <el-button @click="handleClose">关闭</el-button>
        </div>
      </div>
    </PublicDialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  assetorderlist,
  assetorder_info,
  assetexport
} from "@/api/shortMessage";
import { conversiontime, exporteurl, exportFile } from "@/utils/user";
import PublicDialog from "@/components/PublicDialog";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { PublicDialog },
  // 过滤器
  filters: {},
  data() {
    // 这里存放数据
    return {
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      datalist: [],
      multipleSelection: [],
      loading: false,
      dateRange: [],
      pay_type: "",
      keyword: "",
      pay_type_map: [],
      order_show: false,
      datashow: {}
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.SMSRecord();
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {},
  // 方法集合
  methods: {
    handleCurrentChange(val) {
      // 页数
      this.page = val;
      this.SMSRecord();
    },
    handleSizeChange(val) {
      this.limit = val;
      localStorage.setItem("limit", val);
      this.page = 1;
      this.SMSRecord();
    },
    handleClose() {
      this.order_show = false;
    },
    handleSelectionChange(val) {
      /** 选中 */
      if (val.length > 0) this.multipleSelection = val;
      else this.multipleSelection = [];
    },
    /** 查看 */
    see() {
      if (this.multipleSelection.length == 1) {
        assetorder_info({ order_id: this.multipleSelection[0].order_id }).then(
          res => {
            if (res.code == 1) {
              this.order_show = true;
              this.datashow = res.data;
            } else {
              this.$message({ message: res.msg, type: "error" });
            }
          }
        );
      } else {
        this.$message({ message: "请选择一条", type: "info" });
      }
    },
    /** 导出 */
    exportData() {
      const date = conversiontime(this.dateRange, 3);
      const url = `${exporteurl}${assetexport}?start_date=${
        date.start_time
      }&stop_date=${date.end_time}&pay_type=${this.pay_type}&keyword=${
        this.keyword
      }&token=${localStorage.getItem(
        "Token"
      )}&property_id=${localStorage.getItem("propertyselect")}`;
      exportFile(url);
    },
    SMSRecord() {
      const date = conversiontime(this.dateRange, 3);
      const data = {
        start_date: date.start_time,
        stop_date: date.end_time,
        pay_type: this.pay_type,
        keyword: this.keyword,
        page: this.page,
        limit: this.limit
      };
      assetorderlist(data).then(res => {
        if (res.code == 1) {
          this.datalist = res.data.list;
          this.total = res.data.total;
          this.pay_type_map = res.data.pay_type_map;
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    }
  }, // 生命周期 - 销毁完成
  ctivated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang='scss' scoped>
// @import url(); 引入公共css类
@import "src/styles/hide.scss";
</style>

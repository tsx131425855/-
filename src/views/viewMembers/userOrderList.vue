<!-- tsx用户订单列表 -->
<template>
  <div class="package">
    <div class="hide">
      <div class="maright">订单明细</div>
      <el-input
        v-model="keyword"
        class="input"
        prefix-icon="el-icon-search"
        placeholder="自提点/订单号"
        @change="inputentry"
      />
      <el-button type="success" class="maright" @click="page=1,getDatalist()">查询</el-button>
      <el-button plain @click="exporte" class="maright">导出</el-button>
    </div>
    <template>
      <el-table
        v-loading="loading"
        :data="datalist"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          fixed
          type="selection"
          row-key="property_id"
          width="55"
          prop="property_id"
        />
        <el-table-column prop="order_sn" label="订单编号" />
        <el-table-column prop="goods_name" label="商品名称" />
        <el-table-column prop="goods_status" label="订单状态" />
        <el-table-column prop="user_tel" label="下单账号" width="130" />
        <el-table-column prop="grade_name" label="会员等级" />
        <el-table-column prop="price" label="商品单价" />
        <el-table-column prop="number" label="商品数量" />
        <el-table-column prop="coupon_dis" label="优惠券优惠" />

        <el-table-column prop="amount_pay" label="实付" />
        <el-table-column prop="gold_coin" label="金币抵扣" />
        <el-table-column prop="create_time" label="下单时间" width="100" />
        <el-table-column prop="shipping_name" label="配送方式" />
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="delivery_time" label="配送时间" width="100" />
        <el-table-column prop="refund_time" label="申请退款时间" width="100" />
        <el-table-column prop="account_time" label="退款到账时间" width="100" />
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
/* eslint-disable no-alert */
/* eslint-disable */
import { userorderList } from "@/api/userAdministration";
import { exporteurl,exportFile } from "@/utils/user";
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
      multipleSelection: [],
      loading: false
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
        arr.push(res.id);
      });
      this.multipleSelection = arr;
    },
    exporte() {
      /** 导出 */
      let url = `${exporteurl}/property/subscribe/export?start_time=${
        this.start_time
      }&end_time=${this.end_time}&keyword=${this.keyword}&id=${
        this.multipleSelection
      }&token=${localStorage.getItem("Token")}`;
      exportFile(url);
    },
    getDatalist() {
      const data = {
        page: this.page,
        keyword: this.keyword,
        limit: this.limit,
        user_id: this.$route.params.userId
      };
      const that = this;
      this.loading = true;
      return new Promise((resolve, reject) => {
        userorderList(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            that.total = res.data.list.total;
            that.datalist = res.data.list.list;
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
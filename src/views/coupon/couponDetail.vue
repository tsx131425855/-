<template>
  <div class="root">
    <div class="handle">
      <el-button type="info" @click="backRoute">返回</el-button>
      <el-button v-if="hasExport" type="primary" @click="exportExcel">导出</el-button>
      <el-button v-if='hasChange' type="warning" @click="changeCoupon(2)">作废</el-button>
      <el-button v-if="hasChange" type="success" @click="changeCoupon(1)">激活</el-button>
    </div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input style="width: 300px" v-model="keyword" placeholder="优惠券码查询"></el-input>
      </el-form-item>

      <el-form-item label="状态">
        <el-select v-model="status" placeholder="请选择">
          <el-option
            :label="item.val"
            v-for="(item, index) in status_map"
            :key="index"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="page=1;getData(); ">查询</el-button>
      </el-form-item>
    </el-form>
    <template>
      <el-table
        v-loading="loading"
        :data="dataList"
        border
        style="width: 100%"
        fit
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
        <el-table-column fixed type="selection" align="center" width="55" />

        <!-- <el-table-column fixed align="center" prop="service_id" label="售后ID" /> -->
        <el-table-column fixed align="center" prop="coupon_batch_number" width="160" label="批次码" />
        <el-table-column min-width="140px" align="center" prop="coupon_code_number" label="优惠券码" />
        <el-table-column align="center" prop="coupon_type" label="优惠券类型" />
        <el-table-column align="center" prop="coupon_where" label="优惠条件" />
        <el-table-column align="center" prop="coupon_money" label="抵扣金额	" />
        <el-table-column align="center" prop="coupon_discount_type" label="折扣类型" />
        <el-table-column align="center" min-width="100px" prop="coupon_code_stauts" label="状态" />
        <el-table-column align="center" prop="is_delete" label="优惠券状态类型" />
        <el-table-column align="center" prop="user_nickname" label="领取用户" />
        <el-table-column align="center" prop="coupon_code_gettime" label="领取时间" />
        <el-table-column align="center" prop="coupon_code_usetime" label="使用时间" />
        <el-table-column align="center" prop="coupon_start_time" label="开始时间	" />
        <el-table-column align="center" prop="coupon_end_time" label="结束时间" />
        <el-table-column align="center" prop="coupon_name" label="优惠券名称" />

        <!-- <el-table-column align="center" prop="create_time" label="一级代理商抽成"></el-table-column> -->
        <!-- <el-table-column align="center" prop="create_time" label="二级代理商抽成"></el-table-column> -->
        <!-- <el-table-column align="center" prop="create_time" label="三级代理商抽成"></el-table-column>-->
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
import {
  couponDetail,
  changeCouponDetail,
  exportcouponDetail
} from "@/api/coupon";
import { pickerOptions, parseTime } from "@/utils/index";
export default {
  data() {
    return {
      action: [],
      multipleSelection: [],
      coupon_id: "",
      keyword: "",
      status: "",
      status_map: [],
      dataList: [], // 数据
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      loading: false
    };
  },
  created() {
    this.coupon_id = this.$route.query.coupon_id;
    console.log(this.coupon_id);
    this.getData();
  },
  methods: {
    handleCurrentChange(val) {
      // 页数
      this.page = val;
      console.log(`当前页: ${val}`);
      this.getData();
    },
    handleSizeChange(val) {
      this.limit = val;
      console.log(`每页 ${val} 条`);
      this.page = 1;
      this.getData();
    },
    handleSelectionChange(val) {
      /** 选中 */
      console.log(val);
      this.multipleSelection = val;
    },
    /**
     * 返回
     */
    backRoute() {
      console.log(this.$router);
      this.$router.back(-1);
    },
    /**
     * 获取数据
     */
    getData() {
      this.loading = true;
      couponDetail({
        coupon_id: this.coupon_id,
        page: this.page,
        limit: this.limit,
        coupon_code_number: this.keyword,
        coupon_code_stauts: this.status
      }).then(res => {
        if (res.code == 1) {
            this.action = res.action;
          this.status_map = res.data.coupon_code_stauts;
          this.dataList = res.data.list;
          this.total = res.data.count;
          this.loading = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * 修改优惠券订单详情状态
     * @param {type} Number  1: 激活   2: 作废
     */
    changeCoupon(type) {
      changeCouponDetail({
        type,
        coupon_id: this.multipleSelection.map(item => item.coupon_id),
        coupon_code_id: this.multipleSelection.map(item => item.coupon_code_id)
      }).then(res => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          setTimeout(() => {
            this.getData();
          }, 600);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * 导出表格
     */
    exportExcel() {
      let exportUrl = exportcouponDetail({
        coupon_id: this.coupon_id,
        coupon_code_number: this.keyword,
        coupon_code_stauts: this.status
      });
      window.open(exportUrl);
    }
  },
  computed:{
      hasChange() {
          return this.action.some( item => item.path == 'coupon/code/ajax' && item.display == 1 )
      },
      hasExport() {
          return this.action.some( item => item.path == 'coupon/code/export' && item.display == 1 )
      }
  }
};
</script>

<style lang="scss" scoped>
.root {
  padding: 40px;
}
.block {
  margin-top: 20px;
}
.handle {
  margin-bottom: 40px;
}
</style>
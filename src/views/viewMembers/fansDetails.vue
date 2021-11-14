<!-- tsx粉丝明细 -->
<template>
  <div class="package">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="1">
        <div class="hide" style="justify-content: space-between">
          <span class="maright">优惠卷</span>
          <div>
            <el-button type="success" class="" @click="Verification()"
              >赠送</el-button
            >
            <el-button type="warning" class="" @click="Write(1)"
              >核销</el-button
            >
            <el-button type="danger" class="" @click="Write(2)">作废</el-button>
          </div>
        </div>

        <el-table
          v-loading="loading"
          :data="datalists1"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange1"
        >
          <el-table-column fixed type="selection" width="55" />
          <el-table-column prop="coupon_batch_number" label="批次码" />
          <el-table-column prop="coupon_code_number" label="优惠券码" />
          <el-table-column
            prop="coupon_code_gettime"
            label="发放时间"
            width="150"
          />
          <el-table-column prop="coupon_where" label="优惠条件" />
          <el-table-column prop="coupon_money" label="优惠金额" />
          <el-table-column prop="coupon_discount_type_text" label="优惠类型" />
          <el-table-column prop="coupon_name" label="优惠券名称" />
          <el-table-column prop="coupon_code_stauts_text" label="使用状态" />
        </el-table>

        <div class="block">
          <el-pagination
            :current-page="pages1"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="limits1"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totals1"
            @size-change="handleSizeChanges1"
            @current-change="handleCurrentChanges1"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="粉丝明细" name="2">
        <div class="hide">
          <el-select v-model="status" class="maright" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.key"
              :label="item.val"
              :value="item.key"
            />
          </el-select>

          <el-input
            v-model="keyword"
            class="input"
            prefix-icon="el-icon-search"
            placeholder="楼盘名称/会员昵称/会员手机号"
          />
          <el-button
            type="success"
            class="maright"
            @click="(page = 1), getDatalist()"
            >查询</el-button
          >
          <!-- <el-button plain @click="exporte">导出</el-button> -->
          <span
            >所属上级：{{ user_data.user_nickname
            }}{{ user_data.user_tel }}</span
          >
        </div>

        <el-table
          v-loading="loading"
          :data="datalist"
          border
          style="width: 100%"
        >
          <el-table-column
            fixed
            type="selection"
            row-key="property_id"
            width="55"
            prop="property_id"
          />
          <el-table-column prop="lock_time" label="绑定粉丝时间" width="170" />
          <el-table-column prop="user_id" label="粉丝id">
            <template slot-scope="scope">
              <div @click="getDatalist(scope.row.user_id)">
                {{ scope.row.user_id }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="level_text" label="粉丝级别" />
          <el-table-column prop="user_nickname" label="粉丝昵称" />
          <el-table-column prop="user_tel" label="粉丝手机" />
          <el-table-column
            prop="invalid_time"
            label="粉丝失效时间"
            width="170"
          />
          <el-table-column prop="v_days" label="剩余锁粉期" />
          <el-table-column prop="i_days" label="已失效天数" />
          <el-table-column prop="order_amount" label="累计订单金额" />
          <el-table-column prop="order_count" label="累积订单数" />
          <el-table-column prop="order_income" label="累积贡献收益" />
          <el-table-column prop="o_status" label="状态" />
          <el-table-column prop="identity_name" label="会员身份" />
        </el-table>

        <div class="block">
          <el-pagination
            :current-page="page"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          /></div
      ></el-tab-pane>
      <el-tab-pane label="推荐商家返佣明细" name="3"
        ><!-- 推荐商家 -->
        <div class="hide">
          <span class="maright">代理商</span>
          <el-select v-model="agent_id" class="maright" placeholder="请选择">
            <el-option
              v-for="item in agent_map"
              :key="item.agent_id"
              :label="item.name"
              :value="item.agent_id"
            />
          </el-select>
          <el-input
            v-model="keywords"
            class="input"
            prefix-icon="el-icon-search"
            placeholder="商家id，商家名称，商家账号"
          />
          <el-button
            type="success"
            class="maright"
            @click="(pages = 1), recommendlist()"
            >查询</el-button
          >
          <el-button type="warning" class="maright" @click="Unbound"
            >解绑</el-button
          >
          <span>返佣总额：{{ income_total }}</span>
        </div>

        <el-table
          v-loading="loading"
          :data="datalists"
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
          <el-table-column prop="store_id" label="商家id" width="170" />
          <el-table-column prop="store_name" label="商家名称" />
          <el-table-column prop="identity" label="商家身份" />
          <el-table-column prop="income" label="返佣金额" width="170" />
          <el-table-column prop="agent_name" label="所属代理商" />
          <el-table-column prop="disable" label="商家状态" width="170" />
          <el-table-column prop="referer_time" label="绑定时间" />
        </el-table>

        <div class="block">
          <el-pagination
            :current-page="pages"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="limits"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totals"
            @size-change="handleSizeChanges"
            @current-change="handleCurrentChanges"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
/* eslint-disable no-alert */
/* eslint-disable */
import {
  userFansList,
  refererrebatelist,
  refererrebateremove,
  couponlist,
  coupon_send,
  coupon_confiscate,
  coupon_cance,
} from "@/api/userAdministration";
import { MessageBoxs } from "@/utils/elementEncapsulation";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      options: [
        { key: "1", val: "有效粉丝" },
        { key: "2", val: "失效粉丝" },
      ],
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      keyword: "",
      limits: parseInt(localStorage.getItem("limit")) || 10,
      totals: 0,
      pages: 1,
      limits1: parseInt(localStorage.getItem("limit")) || 10,
      totals1: 0,
      pages1: 1,
      keywords: "",
      datalist: [],
      datalists: [],
      datalists1: [],
      agent_id: "0",
      agent_map: [],
      status: "1",
      multipleSelection: [],
      loading: false,
      user_data: {},
      income_total: "",
      user_id: "",
      activeName: "1",
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
      this.getDatalist();
    },
    handleSizeChange(val) {
      this.limit = val;
      localStorage.setItem("limit", val);
      this.page = 1;
      this.getDatalist();
    },
    handleCurrentChanges(val) {
      // 页数
      this.pages = val;
      this.recommendlist();
    },
    handleSizeChanges(val) {
      this.limits = val;
      localStorage.setItem("limit", val);
      this.pages = 1;
      this.recommendlist();
    },
    handleCurrentChanges1(val) {
      // 页数
      this.pages1 = val;
      this.getCoupon();
    },
    handleSizeChanges1(val) {
      this.limits1 = val;
      localStorage.setItem("limit", val);
      this.pages1 = 1;
      this.getCoupon();
    },
    handleSelectionChange1(val) {
      /** 选中 */
      let arr = [];
      val.map((res) => {
        arr.push(res.coupon_code_id);
      });
      this.multipleSelection = arr;
    },
    handleSelectionChange(val) {
      /** 选中 */
      let arr = [];
      val.map((res) => {
        arr.push(res.store_id);
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
    Unbound() {
      if (this.multipleSelection.length > 0) {
        MessageBoxs({
          that: this,
          message: "是否确认解绑 解绑后将不可恢复 ",
        }).then((res) => {
          if (res == true) {
            refererrebateremove({
              user_id: this.user_id,
              store_id: this.multipleSelection,
            }).then((res) => {
              this.loading = false;
              if (res.code == 1) {
                this.pages = 1;
                this.recommendlist();
              } else {
                this.$message.error(res.msg);
              }
            });
          } else;
        });
      } else this.$message.error("请先选择一条");
    },
    Write(val) {
      if (this.multipleSelection.length == 1) {
        MessageBoxs({
          that: this,
          message: `是否确认${val == 1 ? "核销" : "作废"}？`,
        }).then((ss) => {
          if (ss == true) {
            if (val == 1) {
              coupon_cance({
                coupon_code_id: this.multipleSelection[0],
              }).then((res) => {
                if (res.code == 1) {
                  this.getCoupon();
                  this.$message({
                    type: "success",
                    message: res.msg,
                  });
                } else if (res.code === 2) {
                  this.$message.error(res.msg);
                } else {
                  this.$message.error(res.msg);
                }
              });
            } else {
              coupon_confiscate({
                coupon_code_id: this.multipleSelection[0],
              }).then((res) => {
                if (res.code == 1) {
                  this.getCoupon();
                  this.$message({
                    type: "success",
                    message: res.msg,
                  });
                } else if (res.code === 2) {
                  this.$message.error(res.msg);
                } else {
                  this.$message.error(res.msg);
                }
              });
            }
          }
        });
      } else this.$message.error("请先选择一条");
    },
    Verification() {
      this.$prompt("请输入优惠券码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(({ value }) => {
        coupon_send({ coupon_number: value, user_id: this.user_id }).then(
          (res) => {
            this.loading = false;
            if (res.code == 1) {
              this.getCoupon();
              this.$message({
                type: "success",
                message: res.msg,
              });
            } else if (res.code === 2) {
              this.$message.error(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          }
        );
      });
    },
    getDatalist(val) {
      const data = {
        page: this.page,
        keyword: this.keyword,
        limit: this.limit,
        e_status: this.status,
        top_user_id: this.user_id,
      };
      const that = this;
      this.loading = true;
      return new Promise((resolve, reject) => {
        userFansList(data).then((res) => {
          this.loading = false;
          if (res.code == 1) {
            that.total = res.data.list.total;
            that.datalist = res.data.list.list;
            that.user_data = res.data.list.user_data;
            that.agent_map = res.agent_map;
          } else if (res.code === 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch((error) => {
        console.log(error);
      });
    },
    recommendlist() {
      /** 推荐列表 */
      const that = this;
      const data = {
        page: this.pages,
        keyword: this.keywords,
        limit: this.limits,
        user_id: this.user_id,
        agent_id: this.agent_id,
      };
      refererrebatelist(data).then((res) => {
        this.loading = false;
        if (res.code == 1) {
          that.totals = res.data.total;
          that.datalists = res.data.list;
          that.income_total = res.data.income_total;
        } else if (res.code === 2) {
          that.$message.error(res.msg);
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    getCoupon() {
      const that = this;
      const data = {
        page: this.pages1,
        keyword: this.keywords,
        limit: this.limits1,
        user_id: this.user_id,
        agent_id: this.agent_id,
      };
      couponlist(data).then((res) => {
        this.loading = false;
        if (res.code == 1) {
          that.totals1 = res.data.coupon_list.total;
          that.datalists1 = res.data.coupon_list.list;
        } else if (res.code === 2) {
          that.$message.error(res.msg);
        } else {
          that.$message.error(res.msg);
        }
      });
    },
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    if (this.$route.params.userId) {
      this.user_id = this.$route.params.userId;
      this.getDatalist(this.$route.params.userId);
      this.recommendlist();
      this.getCoupon();
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {}, // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
@import "src/styles/hide.scss";
</style>
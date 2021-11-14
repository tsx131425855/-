<!-- tsx 商家订单列表查看-->
<template>
  <div class="package">
    <div>
      <p>基本信息</p>
      <template>
        <el-table v-loading="loading" :data="base_info" border style="width: 100%">
          <el-table-column prop="order_sn" label="订单号" />
          <el-table-column prop="user_nickname" label="下单人昵称" />
          <el-table-column prop="create_time" label="下单时间" />
          <el-table-column prop="user_tel" label="下单账号" />
          <el-table-column prop="status_text" label="订单状态" />
          <el-table-column prop="pay_time" label="支付时间" />
        </el-table>
      </template>
    </div>

    <div>
      <p>商品信息</p>
      <template>
        <el-table v-loading="loading" :data="product_data" border style="width: 100%">
          <el-table-column prop="name" label="商品名称" />
          <el-table-column prop="id" label="商品ID" />
          <el-table-column prop="price" label="商品单价" />
          <el-table-column align="center" prop="product_sku_str" label="规格" />
          <el-table-column prop="number" label="数量" />
          <!-- <el-table-column prop="product_stock" label="库存" /> -->
          <el-table-column prop="amount_product" label="总额" />
          <el-table-column prop="pack_fee" label="打包费" />
          <el-table-column prop="coupon_dis" label="优惠劵" />
          <!-- <el-table-column prop="member_dis" label="自购优惠" /> -->
          <!-- <el-table-column prop="gold_coin" label="金币抵扣" /> -->
          <el-table-column align="center" prop="red_packet_dis" label="红包抵扣" />
          <el-table-column prop="amount" label="实付" />
          <!-- <el-table-column prop="arrival_time" label="送达时间" /> -->
        </el-table>
      </template>
    </div>

    <div>
      <p>付款信息</p>
      <template>
        <el-table v-loading="loading" :data="pay_info" border style="width: 100%">
          <el-table-column prop="transaction_id" label="付款单号" />
          <el-table-column prop="add_time" label="付款时间" />
          <el-table-column prop="pay_fee" label="付款金额" />
          <el-table-column prop="status_text" label="付款状态" />
        </el-table>
      </template>
    </div>

    <div v-if="delivery_info.length>0">
      <p>配送信息</p>
      <template>
        <el-table v-loading="loading" :data="delivery_info" border style="width: 100%">
          <el-table-column prop="store_name" label="配送商家" />
          <el-table-column prop="user_name" label="收货人" />
          <el-table-column prop="user_tel" label="收货电话" />
          <el-table-column prop="address" label="收货信息" />
        </el-table>
      </template>
    </div>

    <div v-if="earnings_info .length>0">
      <p>收益信息</p>
      <template>
        <el-table v-loading="loading" :data="earnings_info" border style="width: 100%">
          <el-table-column prop="count" label="订单总额" />
          <el-table-column prop="amount_dis" label="订单优惠" />
          <el-table-column prop="platform_comm" label="平台服务费" />
          <el-table-column prop="agent_comm" label="区县提成" />
          <el-table-column prop="village_rebate_comm" label="粉丝返佣" />
          <el-table-column prop="referer_rebate_comm" label="推荐人返佣" />
          <el-table-column prop="money" label="用户退款" />
          <el-table-column prop="earnings" label="订单收益" />
        </el-table>
      </template>
    </div>
    <!-- <div>
      <p>
        操作信息
        <el-button type="warning">锁定</el-button>
        <el-button type="danger">解锁</el-button>
      </p>
      <template>
        <el-table v-loading="loading" :data="log_data" border style="width: 100%">
          <el-table-column prop="user_nickname" label="操作者" />
          <el-table-column prop="create_time" label="操作时间" />
          <el-table-column prop="user_nickname" label="订单状态" />
          <el-table-column prop="user_nickname" label="付款状态" />
          <el-table-column prop="user_nickname" label="发提货状态" />
          <el-table-column prop="remark" label="备注" />
        </el-table>
      </template>
    </div>-->

    <div v-if="service_data.length>0">
      <p>
        退款信息
        <!-- <el-button type="warning">受理</el-button> -->
        <el-button type="danger" @click="refuseVisible = true">拒绝退款</el-button>
        <el-button type="danger" @click="refund()">退款</el-button>
        <el-button type="danger" @click="modifyRefund()">修改退款金额</el-button>
      </p>
      <template>
        <el-table
          v-loading="loading"
          :data="service_data"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column fixed type="selection" width="55" />
          <el-table-column prop="service_sn" label="售后编号" />
          <el-table-column prop="create_time" label="申请时间" />
          <el-table-column label="申请商品">
            <template slot-scope="scope">
              <div class="scope">
                <div
                  class="scopeItem"
                  v-for="(item, index) in scope.row.product"
                  :key="index + item.product_name"
                >{{ item.product_name }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="规格">
            <template slot-scope="scope">
              <div class="scope">
                <div
                  class="scopeItem"
                  v-for="(item, index) in scope.row.product"
                  :key="index"
                >{{ item.product_sku_str }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="退款类型">
            <template slot-scope="scope">
              <div class="scope">
                <div
                  class="scopeItem"
                  v-for="(item, index) in scope.row.product"
                  :key="index"
                >{{ item.return_type_text }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="退款数量">
            <template slot-scope="scope">
              <div class="scope">
                <div
                  class="scopeItem"
                  v-for="(item, index) in scope.row.product"
                  :key="index"
                >{{ item.product_number }}</div>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="申请商品个数">
            <template slot-scope="scope">
              <div class="scope">
                <div
                  class="scopeItem"
                  v-for="(item, index) in scope.row.product"
                  :key="index + item.product_name"
                >{{ item.product_number }}</div>
              </div>
            </template>
          </el-table-column>-->
          <!-- <el-table-column prop="return_type_text" label="退款类型" />
          <el-table-column prop="product_number" label="退款数量" />-->
          <el-table-column prop="amount_pay" label="商品合计支付金额" />
          <el-table-column prop="apply_money" label="申请退款金额" />
          <el-table-column prop="return_money" label="实际退款金额" />
          <!-- <el-table-column prop="status_text" label="售后状态" /> -->
          <el-table-column prop="return_product" label="退款状态">
            <template slot-scope="scope">{{ scope.row.return_product }}</template>
          </el-table-column>
        </el-table>
      </template>
    </div>

    <el-dialog
      title="修改退款金额"
      v-if="service_data.length>0"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <!-- <div class="margin">售后编号：{{service_data[0].service_sn}}</div>
      <div class="margin">退款状态：{{service_data[0].status_text}}</div>
      <div class="margin">申请时间：{{service_data[0].create_time}}</div>
      <div class="margin">退款类型：{{service_data[0].return_product}}</div>
      <div class="margin">退款商品：{{service_data[0].product_name}}</div>-->
      <div>
        申请退款金额:
        <el-input class="input" v-model="money" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible= false">关闭</el-button>
        <el-button type="primary" @click="refundModify(),dialogVisible= false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="拒绝退款理由"
      v-if="service_data.length>0"
      :visible.sync="refuseVisible"
      width="30%"
      :before-close="handleClose"
    >
      <!-- <div class="margin">售后编号：{{service_data[0].service_sn}}</div>
      <div class="margin">退款状态：{{service_data[0].status_text}}</div>
      <div class="margin">申请时间：{{service_data[0].create_time}}</div>
      <div class="margin">退款类型：{{service_data[0].return_product}}</div>
      <div class="margin">退款商品：{{service_data[0].product_name}}</div>-->
      <div>
        拒绝受理理由备注:
        <el-input class="input" type="textarea" v-model="reason" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refuseVisible = false">关闭</el-button>
        <el-button type="primary" @click="refundRefuse(),refuseVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  businessOrderDetail,
  businessRefund,
  businessRefundRefuse,
  businessRefundModify
} from "@/api/business";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      dataList: [],
      base_info: [],
      product_data: [],
      pay_info: [],
      delivery_info: [],
      log_data: [],
      service_data: [],
      dialogVisible: false,
      refuseVisible: false,
      reason: "",
      money: "",
      multipleSelection: [],
      earnings_info: []
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
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      console.log(row, column, rowIndex, columnIndex);
      row.product;

      if (columnIndex === 4) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    handleClose(done) {
      done();
    },
    handleSelectionChange(val) {
      /** 选择 */
      let arr = [];
      if (val.length < 2) {
        val.map(res => {
          arr.push(res);
        });
        this.multipleSelection = arr;
      } else {
        this.$message({
          message: "不能多选",
          type: "warning"
        });
      }
    },
    modifyRefund() {
      this.dialogVisible = true;
    },
    refund() {
      // 订单退款
      let data = {};
      if (this.multipleSelection.length > 0) {
        data = {
          service_sn: this.multipleSelection[0].service_sn
        };
      } else {
        this.$message({
          message: "请先选择退款的单号",
          type: "warning"
        });
        return false;
      }

      const that = this;
      return new Promise((resolve, reject) => {
        businessRefund(data).then(res => {
          if (res.code == 1) {
            that.$message({
              message: res.msg,
              type: "success"
            });
            that.multipleSelection = [];
          } else if (res.code === 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
          that.getData();
        });
        resolve();
      }).catch(error => {
        console.log(error);
      });
    },
    refundRefuse() {
      // 订单拒绝退款
      let data = {};
      if (this.multipleSelection.length > 0) {
        data = {
          service_sn: [this.multipleSelection[0].service_sn],
          reason: this.reason
        };
      } else {
        this.$message({
          message: "请先选择退款的单号",
          type: "warning"
        });
        return false;
      }

      const that = this;
      return new Promise((resolve, reject) => {
        businessRefundRefuse(data).then(res => {
          if (res.code == 1) {
            that.$message({
              message: res.msg,
              type: "success"
            });
            that.this.reason = "";
            that.multipleSelection = [];
          } else if (res.code === 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
          that.getData();
        });
        resolve();
      }).catch(error => {
        console.log(error);
      });
    },
    refundModify() {
      // 修改订单退款金额
      const that = this;
      let data = {};
      if (this.multipleSelection.length > 0) {
        data = {
          service_sn: this.multipleSelection[0].service_sn,
          money: this.money
        };
      } else {
        this.$message({
          message: "请先选择退款的单号",
          type: "warning"
        });
        return false;
      }
      return new Promise((resolve, reject) => {
        businessRefundModify(data).then(res => {
          if (res.code == 1) {
            that.$message({
              message: res.msg,
              type: "success"
            });
            that.money = "";
            that.multipleSelection = [];
          } else if (res.code === 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
          that.getData();
        });

        resolve();
      }).catch(error => {
        console.log(error);
      });
    },
    getData() {
      const data = {
        order_id: this.$route.query.order_id
      };
      this.loading = true;
      const that = this;
      return new Promise((resolve, reject) => {
        businessOrderDetail(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            that.dataList = res.data.list;
            that.base_info = [res.data.base_info];
            that.product_data = res.data.product_data.product;
            that.pay_info = [res.data.pay_info];
            that.delivery_info = [res.data.delivery_info];
            that.log_data = res.data.log_data;
            that.service_data = res.data.service_data;
            that.earnings_info = [res.data.earnings_info];
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
    this.getData();
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
.input {
  width: 200px;
}
.margin {
  margin-bottom: 20px;
}
.scope {
  height: 100%;
  display: flex;
  flex-direction: column;

  .scopeItem {
    box-sizing: border-box;
    min-height: 35px;
    padding: 12px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    position: relative;
    &::after {
      position: absolute;
      content: "";
      width: 100%;
      bottom: 0;
      left: 0;
      height: 1px;
      background-color: #ebeef5;
    }
    &:first-child {
      padding-top: 0;
    }
    &:last-child {
      padding-bottom: 0;
      &::after {
        display: none;
      }
    }
  }
}
</style>
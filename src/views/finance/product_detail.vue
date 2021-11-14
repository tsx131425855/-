
<template>
  <!-- 商品订单详情 -->
  <div>
    <div class="module">
      <h3 class="title">基本信息</h3>
      <div class="message">
        <div>
          <span class="options">订单号</span>
          <span>{{ dataList.basic.order_sn }}</span>
        </div>
        <div>
          <span class="options">下单时间</span>
          <span>{{ dataList.basic.create_time }}</span>
        </div>
        <div>
          <span class="options">订单状态</span>
          <span>{{ dataList.basic.status_text }}</span>
        </div>
        <div>
          <span class="options">下单人昵称</span>
          <span>{{ dataList.basic.user && dataList.basic.user.user_nickname }}</span>
        </div>
        <div>
          <span class="options">下单账号</span>
          <span>{{ dataList.basic.user && dataList.basic.user.user_tel }}</span>
        </div>
      </div>
    </div>
    <div class="module">
      <h3 class="title">商品信息</h3>
      <el-table v-loading="loading" :data="dataList.order_product" border style="width: 100%" fit>
        <!-- 商品名称	商品ID	商品单价	数量	邮费	总额	优惠券优惠	会员优惠	金币抵扣	实付	发货状态	核销状态	售后状态	预发货/出库时间	发货/出库时间 -->
        <el-table-column align="center" prop="product_name" label="商品名称"></el-table-column>
        <el-table-column align="center" prop="product_id" label="商品ID"></el-table-column>
        <el-table-column align="center" prop="price" label="商品单价"></el-table-column>
        <el-table-column align="center" prop="number" label="数量"></el-table-column>
        <el-table-column align="center" prop="postage" label="邮费"></el-table-column>
        <el-table-column align="center" prop="amount_product" label="总额"></el-table-column>
        <el-table-column align="center" prop="coupon_dis" label="优惠券优惠"></el-table-column>
        <el-table-column align="center" prop="member_dis" label="会员优惠"></el-table-column>
        <el-table-column align="center" prop="gold_coin" label="金币抵扣"></el-table-column>
        <el-table-column align="center" prop="amount_pay" label="实付"></el-table-column>
        <el-table-column align="center" prop="delivery_status_text" label="发货状态"></el-table-column>
        <el-table-column align="center" prop="verify_status_text" label="核销状态"></el-table-column>
        <el-table-column align="center" prop="service_status_text" label="售后状态"></el-table-column>
        <el-table-column align="center" min-width="160" prop="exdelivery_time" label="预发货/出库时间"></el-table-column>
        <el-table-column align="center" min-width="160" prop="delivery_time" label="发货/出库时间"></el-table-column>
      </el-table>
    </div>

    <div v-if="dataList.delivery.length != 0" class="module">
      <h3 class="title">包裹信息</h3>
      <!-- 快递公司	快递单号	发货时间	物流信息	商品名称	应发	实发	操作 -->
      <el-table :data="dataList.delivery" border style="width: 100%" v-loading="loading" fit>
        <el-table-column align="center" prop="express_name" label="快递公司"></el-table-column>
        <el-table-column align="center" label="快递单号">
          <template slot-scope="scope">{{ scope.row.express_number }}</template>
        </el-table-column>
        <el-table-column align="center" prop="delivery_time" label="发货时间"></el-table-column>
        <el-table-column align="center" prop="status_text" label="物流信息"></el-table-column>
        <el-table-column align="center" prop="product[0].product_name" label="商品名称"></el-table-column>
        <el-table-column align="center" prop="product[0].product_num" label="应发"></el-table-column>
        <el-table-column align="center" prop="product[0].order_product.number" label="实发"></el-table-column>
        <el-table-column align="center" prop="editor" label="操作人"></el-table-column>
      </el-table>
    </div>

    <div class="module">
      <h3 class="title">配送信息</h3>
      <el-table
        v-loading="loading"
        :data="[ dataList.address_detail ]"
        border
        style="width: 100%"
        fit
      >
        <el-table-column align="center" prop="address_type" label="配送方式" />
        <el-table-column align="center" label="配送地址">
          <template slot-scope="scope">
            <span>{{ scope.row.self_address_detail === '-' ? scope.row.delivery_address_detail : scope.row.self_address_detail }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="dataList.log.length != 0" class="module">
      <h3 class="title">操作信息</h3>
      <el-table v-loading="loading" :data="dataList.log" border style="width: 100%" fit>
        <!-- 订单类型	操作者	操作时间	操作动作	备注 -->
        <el-table-column align="center" prop="type_text" label="订单类型"></el-table-column>
        <el-table-column align="center" label="操作者">
          <template slot-scope="scope">{{ scope.row.user.user_name }}</template>
        </el-table-column>
        <el-table-column align="center" prop="create_time" label="操作时间"></el-table-column>
        <el-table-column align="center" prop="action_type_text" label="操作动作"></el-table-column>
        <el-table-column align="center" prop="remark" label="备注"></el-table-column>
      </el-table>
    </div>
    <div class="module" v-if="dataList.service.length != 0" >
      <h3 class="title">退款信息</h3>
      <el-table v-loading="loading" :data="dataList.service" border style="width: 100%" fit>
        <!-- 售后编号	申请售后时间	商品名称	退款数量	退款商品支付合计	申请退款金额	实际退款金额	退款状态 -->
        <el-table-column align="center" prop="service_sn" label="售后编号"></el-table-column>
        <el-table-column  align="center" prop="create_time" label="申请售后时间"></el-table-column>
        <el-table-column  align="center" label="商品名称">
          <template slot-scope="scope">
            <div>
              <div
                v-for=" item in scope.row.product "
                :key="item.product_id"
                style="line-height: 30px; border-bottom:1px solid #ebedf2; margin-bottom: -1px"
              >{{ item.product_name || '-' }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" class-name="colum" label="退款数量">
          <template slot-scope="scope">
            <div>
              <div
                v-for=" item in scope.row.product "
                :key="item.product_id"
                style="line-height: 30px; border-bottom:1px solid #ebedf2; margin-bottom: -1px"
              >{{ item.number }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="service_product_amount_pay" label="退款商品支付合计" />
        <el-table-column align="center" prop="apply_money" label="申请退款金额" />
        <el-table-column align="center" prop="service_success_amount_money" label="实际退款金额" />
        <el-table-column align="center" class-name="colum" label="退款状态">
          <template slot-scope="scope">
            <div
              v-for=" item in scope.row.product "
              :key="item.product_id"
              style="line-height: 30px; border-bottom:1px solid #ebedf2; margin-bottom: -1px"
            >{{ item.status_text }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="agent_name" label="代理商" />

      </el-table>
    </div>
  </div>
</template>
<script>
import { product_detail } from '@/api/finance'
export default {
  data: function() {
    return {
      dataList: {
        address_detail: {},
        basic: {},
        delivery: [],
        log: [],
        order_product: [],
        service: []
      }, // 页面数据
      loading: false, // 是否为加载状态
      order_id: "",
      derive: ""
    };
  },
  methods: {
    getData() {
      this.loading = true
      console.log(product_detail)
      const that = this
      return product_detail({ order_id: this.order_id }).then(res => {
        this.loading = false;

        if (res.code == 1) {
          this.dataList = res.data;
          this.total = res.data.total;
          console.log(this.dataList.delivery);

          if (res.action) {
            res.action.map(val => {
              if (val.tag == "export" && val.display == 1) {
                that.derive = 1;
              }
            });
          }
          
        } else if (res.code == 2) {
          that.$message.error(res.msg)
          if (res.token.length > 0) {
            localStorage.setItem('Token', res.token)
          }
          setTimeout(() => {
            that.$store.dispatch('logout').then(() => {
              location.reload() //
            })
          }, 1000)
        } else {
          this.$message.error(res.msg)
          localStorage.setItem('Token', res.token)
        }
      })
    }
  },
  created() { 
    this.order_id = this.$route.query.order_id
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.module {
  margin: 30px 40px;
  &:last-child {
    margin-bottom: 200px;
  }
  .title {
    margin-bottom: 20px;
  }
}
.message {
  display: flex;
  flex-wrap: wrap;

  > div {
    width: 33%;
    height: 60px;
    margin-bottom: 10px;
    display: flex;
    justify-content: stretch;
    text-align: center;
    line-height: 60px;
    span {
      flex: 1;
      border: 1px solid #ebedf2;
      margin-left: -1px;
    }
    .options {
      background-color: #f5f5f5;
    }
  }
}
</style>

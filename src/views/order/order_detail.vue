
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
      <el-table v-loading="loading" :data="dataList.order_product" border fit>
        <!-- 商品名称	商品ID	商品单价	数量	邮费	总额	优惠券优惠	会员优惠	金币抵扣	实付	发货状态	核销状态	售后状态	预发货/出库时间	发货/出库时间 -->
        <el-table-column align="center" min-width="200" prop="product_name" label="商品名称"></el-table-column>
        <el-table-column align="center" prop="product_id" label="商品ID"></el-table-column>
        <el-table-column align="center" prop="price" label="商品单价"></el-table-column>
        <el-table-column align="center" prop="product_attr_value_name_string" label="规格" />
        <el-table-column align="center" prop="number" label="数量"></el-table-column>
        <el-table-column v-if="dataList.basic.type!=10" align="center" prop="postage" label="邮费"></el-table-column>
        <el-table-column align="center" prop="amount_product" label="总额"></el-table-column>
        <el-table-column align="center" prop="coupon_dis" label="优惠券优惠"></el-table-column>
        <el-table-column
          v-if="dataList.basic.type!=10"
          align="center"
          prop="member_dis"
          label="会员优惠"
        ></el-table-column>
        <el-table-column
          v-if="dataList.basic.type!=10"
          align="center"
          prop="gold_coin"
          label="金币抵扣"
        ></el-table-column>
        <el-table-column
          v-if="dataList.basic.type!=10"
          align="center"
          prop="midou_money"
          label="蜜豆抵扣"
        ></el-table-column>
        <el-table-column
          v-if="dataList.basic.type==10"
          align="center"
          prop="red_packet_dis"
          label="红包抵扣"
        />
        <el-table-column align="center" prop="amount_pay" label="实付"></el-table-column>
        <el-table-column
          v-if="dataList.basic.type!=10"
          align="center"
          prop="delivery_status_text"
          label="发货状态"
        ></el-table-column>
        <el-table-column
          v-if="dataList.basic.type!=10"
          align="center"
          prop="verify_status_text"
          label="核销状态"
        ></el-table-column>
        <el-table-column
          v-if="dataList.basic.type!=10"
          align="center"
          prop="service_status_text"
          label="售后状态"
        ></el-table-column>
        <el-table-column
          v-if="dataList.basic.type!=10"
          align="center"
          min-width="150"
          prop="exdelivery_time"
          label="预发货/出库时间"
        ></el-table-column>
        <el-table-column
          v-if="dataList.basic.type!=10"
          align="center"
          min-width="150"
          prop="delivery_time"
          label="发货/出库时间"
        ></el-table-column>
        <el-table-column v-if="dataList.basic.type!=10" align="center" min-width="100" label="操作">
          <template slot-scope="scope">
            <div style="margin-bottom: 8px">
              <el-button
                size="mini"
                type="danger"
                @click="changeProduct( scope.row.product_id, 2, scope.row.order_pid)"
                v-if="scope.row.delivery_status == 3 && scope.row.service_status != 1"
              >申请售后</el-button>
            </div>
            <div>
              <el-button
                size="mini"
                type="warning"
                v-if="scope.row.delivery_status == 2"
                @click="changeProduct( scope.row.product_id, 1, scope.row.order_pid)"
              >撤销发货</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="module">
      <h3 class="title">收益信息</h3>
      <el-table v-loading="loading" :data="dataList.income" border fit>
        <el-table-column align="center" prop="order_amount" label="订单总额" />
        <el-table-column align="center" prop="discount" label="订单优惠" />
        <el-table-column align="center" prop="platform_comm" label="平台服务费" />
        <el-table-column
          v-if="dataList.basic.type==1||dataList.basic.type==2||dataList.basic.type==13"
          align="center"
          prop="store_comm"
          label="自提点提成"
        />
        <el-table-column
          v-if="dataList.basic.type==1||dataList.basic.type==2||dataList.basic.type==13||dataList.basic.type==10"
          align="center"
          prop="village_rebate_comm"
          label="粉丝返佣"
        />
        <el-table-column
          v-if="dataList.basic.type==12"
          align="center"
          prop="village_rebate_comm"
          label="分销佣金"
        />
        <el-table-column
          v-if="dataList.basic.type==10"
          align="center"
          prop="referer_rebate_comm"
          label="推荐人"
        />
        <el-table-column align="center" prop="order_back" label="用户退款" />
        <el-table-column align="center" prop="agent_comm" label="订单收益" />
      </el-table>
    </div>

    <div v-if="dataList.delivery.length != 0" class="module">
      <h3 class="title">包裹信息</h3>
      <!-- 快递公司	快递单号	发货时间	物流信息	商品名称	应发	实发	操作 -->
      <el-table :data="dataList.delivery" border style="width: 100%" v-loading="loading" fit>
        <el-table-column align="center" prop="express_name" label="快递公司"></el-table-column>
        <el-table-column align="center" label="快递单号">
          <template slot-scope="scope">
            <div>{{ scope.row.express_number }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="delivery_time" label="发货时间">
          <template slot-scope="scope">
            <div>{{ scope.row.delivery_time }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="status_text" label="物流信息"></el-table-column>
        <el-table-column align="center" prop="product[0].product_name" label="商品名称"></el-table-column>
        <el-table-column align="center" prop="product[0].product_num" label="应发"></el-table-column>
        <el-table-column align="center" prop="product[0].order_product.number" label="实发"></el-table-column>
        <el-table-column align="center" prop="editor" label="操作人"></el-table-column>
        <el-table-column width="300px" align="center" label="查看">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="onBagDetail(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
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
        <el-table-column width="300px" align="center" prop="address_type" label="配送方式" />
        <el-table-column align="center" label="配送地址">
          <template slot-scope="scope">
            <span>{{ scope.row.self_address_detail === '-' ? scope.row.delivery_address_detail : scope.row.self_address_detail }}</span>
          </template>
        </el-table-column>
        <el-table-column width="300px" align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="changeSite(scope.row.address_id)">修改</el-button>
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
    <div class="module" v-if="dataList.service.length != 0">
      <h3 class="title">退款信息</h3>
      <div style="margin-bottom: 15px">
        <el-button type="success" @click="handleOreder('accept')">受理</el-button>
        <el-button type="warning" @click="handleOreder('reject')">拒绝受理</el-button>
        <el-button type="primary" @click="handleOreder('receive')">收货</el-button>
        <el-button type="danger" @click="handleOreder('return')">退款</el-button>
      </div>

      <el-table
        @selection-change="handleSelectionChange"
        v-loading="loading"
        :data="dataList.service"
        border
        style="width: 100%"
        fit
      >
        <!-- 售后编号	申请售后时间	商品名称	退款数量	退款商品支付合计	申请退款金额	实际退款金额	退款状态 -->
        <el-table-column fixed type="selection" align="center" width="55" />
        <el-table-column align="center" prop="service_sn" label="售后编号"></el-table-column>
        <el-table-column align="center" prop="create_time" label="申请售后时间"></el-table-column>
        <el-table-column align="center" label="商品名称">
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
        <el-table-column align="center" label="规格">
          <template slot-scope="scope">
            <div>
              <div
                v-for=" item in scope.row.product "
                :key="item.product_id"
                style="line-height: 30px; border-bottom:1px solid #ebedf2; margin-bottom: -1px"
              >{{ item.product_sku_str || '-' }}</div>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
          v-if="dataList.basic.type==10"
          align="center"
          prop="return_type_text"
          label="退款类型"
        />-->
        <el-table-column align="center" label="退款类型">
          <template slot-scope="scope">
            <div>
              <div
                v-for=" item in scope.row.product "
                :key="item.product_id"
                style="line-height: 30px; border-bottom:1px solid #ebedf2; margin-bottom: -1px"
              >{{ item.return_type_text || '-' }}</div>
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
        <el-table-column
          v-if="dataList.basic.type!=10"
          align="center"
          prop="agent_name"
          label="代理商"
        />
      </el-table>
    </div>

    <el-dialog title="收货地址" :visible.sync="showMask" width="600px">
      <el-form :model="mask" label-width="160px" width="450">
        <el-form-item label="活动名称">
          <el-input style="width: 160px" disabled v-model="mask.type" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属代理商">
          <el-select v-model="mask.agent_id" placeholder="请选择" @change="changeSite">
            <el-option
              v-for="item in agent_map"
              :key="item.agent_id"
              :label="item.name"
              :value="item.agent_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择自提点/物流地址">
          <el-select v-model="mask.site" placeholder="请选择">
            <el-option
              v-for="(item) in mask.siteList"
              :key="item.address_id"
              :label="item.address"
              :value="item.address_id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showMask = false">取 消</el-button>
        <el-button type="primary" @click="maskCommit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="包裹详情" :visible.sync="showBagDetail" width="550px">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in bagDetail"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import { product_detail } from "@/api/finance";
import {
  handleOreder,
  modifystatus,
  editaddress,
  editComiitAddress,
  lookBagDetail,
  seckillview
} from "@/api/order";
export default {
  data: function() {
    return {
      AftermultipleSelection: [], // 售后选中商品
      showMask: false, // 是否显示弹窗(修改地址)
      mask: {
        // 弹窗数据
        type: "",
        site: "",
        siteList: [],
        agent_id: "0"
      },
      showBagDetail: false, // 显示包裹详情
      bagDetail: [], // 包裹详情
      dataList: {
        // 数据
        address_detail: {},
        basic: {},
        delivery: [],
        log: [],
        order_product: [],
        service: [],
        income: []
      }, // 页面数据
      loading: false, // 是否为加载状态
      order_id: "",
      derive: "",
      agent_map: [],
      address_id: ""
    };
  },
  methods: {
    // 打开包裹详情
    onBagDetail(id) {
      lookBagDetail({
        delivery_id: id
      })
        .then(res => {
          if (res.code == 1) {
            this.showBagDetail = true;
            this.bagDetail = res.data.record.data;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(res => {
          this.$message.error("请求错误, 请检查网络或者联系管理员");
        });
    },

    // 修改配送/发货地址
    changeSite(id) {
      let address_id = this.address_id;
      if (id) this.address_id = id;
      address_id = id;
      editaddress({
        address_id,
        order_id: this.order_id,
        agent_id: this.mask.agent_id
      }).then(res => {
        if (res.code == 1) {
          this.mask.siteList = res.data.address_list;
          this.mask.type = this.dataList.address_detail.address_type;
          this.mask.site = res.data.address_id;
          this.showMask = true;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 确认提交弹窗
    maskCommit() {
      this.$confirm("是否确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        editComiitAddress({
          order_id: this.order_id,
          address_id: this.mask.site
        }).then(res => {
          if (res.code == 1) {
            this.$message.success(res.msg);
            setTimeout(() => {
              this.getData();
              this.showMask = false;
            }, 600);
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },

    // 修改商品Api
    changeProduct(product_id, type, order_pid) {
      modifystatus({
        order_id: this.order_id,
        order_pid: order_pid,
        product_id,
        type
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
    // 选中售后商品
    handleSelectionChange(val) {
      /** 选中 */
      console.log(val);
      this.AftermultipleSelection = val;
    },
    // 对售后的商品进行处理, 作废, 待处理, 退款, 发货
    handleOreder(act) {
      let _this = this;
      this.$confirm("确认操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let data = {
          act: act,
          service_ids: _this.AftermultipleSelection.map(item => item.service_id)
        };
        console.log(data);
        handleOreder(data)
          .then(res => {
            if (res.code == 1) {
              _this.$message.success(res.msg);
              setTimeout(() => {
                _this.getData();
              }, 600);
            } else {
              _this.$message.error(
                "操作失败, 请确认当前订单状态是否允许进行此操作或联系管理员"
              );
            }
          })
          .catch(res => {
            _this.$message.error("操作失败, 请重试或者联系管理员");
          });
      });
    },

    // 获取页面数据
    getData() {
      this.loading = true;
      console.log(product_detail);
      const that = this;
      return product_detail({ order_id: this.order_id }).then(res => {
        this.loading = false;
        if (res.code == 1) {
          this.dataList = res.data;
          this.total = res.data.total;
          console.log(this.dataList.delivery);
          this.dataList.income = [this.dataList.income];
          if (res.action) {
            res.action.map(val => {
              if (val.tag == "export" && val.display == 1) {
                that.derive = 1;
              }
            });
          }
          this.agent_map = res.agent_map;
        } else if (res.code == 2) {
          that.$message.error(res.msg);
          if (res.token.length > 0) {
            localStorage.setItem("Token", res.token);
          }
          setTimeout(() => {
            that.$store.dispatch("logout").then(() => {
              location.reload(); //
            });
          }, 1000);
        } else {
          this.$message.error(res.msg);
          localStorage.setItem("Token", res.token);
        }
      });
    },
    gitdatato() {
      this.loading = true;
      console.log(product_detail);
      const that = this;
      return seckillview({ order_id: this.order_id }).then(res => {
        this.loading = false;
        if (res.code == 1) {
          this.dataList = res.data;
          this.total = res.data.total;
          console.log(this.dataList.delivery);
          this.dataList.income = [this.dataList.income];
          if (res.action) {
            res.action.map(val => {
              if (val.tag == "export" && val.display == 1) {
                that.derive = 1;
              }
            });
          }
        } else if (res.code == 2) {
          that.$message.error(res.msg);
          if (res.token.length > 0) {
            localStorage.setItem("Token", res.token);
          }
          setTimeout(() => {
            that.$store.dispatch("logout").then(() => {
              location.reload(); //
            });
          }, 1000);
        } else {
          this.$message.error(res.msg);
          localStorage.setItem("Token", res.token);
        }
      });
    }
  },
  created() {
    this.order_id = this.$route.query.order_id;
    if (this.$route.query.type && this.$route.query.type == 1) {
      console.log(this.$route.query.type);
      this.gitdatato();
    } else {
      this.getData();
    }
  }
};
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

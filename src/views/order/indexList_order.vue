<template>
  <div class="root">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-input
          v-model="formInline.product_name"
          placeholder="请输入商品名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="formInline.order_sn"
          placeholder="请输入订单号"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          maxlength="11"
          v-model="formInline.phone"
          placeholder="请输入手机号码"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label-width="80px" label="出库状态">
        <el-select v-model="formInline.region" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label-width="80px" label="状态">
        <el-select v-model="formInline.state" placeholder="请选择">
          <el-option label="全部" value="-1"></el-option>
          <el-option
            :label="item"
            v-for="(item, index) in formInline.stateList"
            :key="index"
            :value="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="80px" label="配送方式">
        <el-select
          @change="
            () => {
              this.formInline.selftSite = [];
            }
          "
          v-model="formInline.delivery"
          placeholder="请选择"
        >
          <el-option label="全部" value="-1"></el-option>
          <el-option
            :label="item"
            v-for="(item, index) in formInline.deliveryList"
            :key="index"
            :value="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="80px" label="自提点">
        <el-select
          :disabled="formInline.delivery == 0"
          v-model="formInline.selftSite"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in formInline.selftSite_list"
            :key="item + index"
            :value="index"
            :label="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="80px" label="商品类型">
        <el-select v-model="formInline.product_type" placeholder="请选择">
          <el-option label="全部" value="-1"></el-option>
          <el-option
            :label="item.name"
            v-for="(item, index) in formInline.product_type_list"
            :key="index"
            :value="index"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label-width="80px" label="下单时间">
        <el-date-picker
          v-model="formInline.orderTime"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label-width="80px" label="配送时间">
        <el-date-picker
          v-model="formInline.delivery_time"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label-width="80px" label="代理商">
        <el-select v-model="formInline.agent" placeholder="请选择">
          <el-option
            :label="item.name"
            v-for="item in formInline.agentList"
            :key="item.agent_id"
            :value="item.agent_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="
            page = 1;
            getData();
          "
          >查询</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="exportExcel">订单导出</el-button>
      </el-form-item>
    </el-form>
    <template>
      <el-table
        v-loading="loading"
        :data="dataList"
        border
        style="width: 100%"
        fit
      >
        <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
        <!-- <el-table-column fixed type="selection" align="center" width="55" /> -->

        <!-- <el-table-column fixed label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editClick(scope.row)">查看</el-button>
          </template>
        </el-table-column>-->
        <el-table-column fixed align="center" prop="order_id" label="ID" />
        <el-table-column
          align="center"
          prop="agent_name"
          width="160"
          label="代理商"
        />
        <el-table-column fixed width="190" align="center" label="订单编号">
          <template slot-scope="scope">
            <router-link
              class="routeLike"
              :to="{ path: `/order_detail?order_id=${scope.row.order_id}` }"
              >{{ scope.row.order_sn }}</router-link
            >
          </template>
        </el-table-column>
        <el-table-column
          fixed
          align="center"
          prop="user.user_tel"
          min-width="110"
          label="下单账号"
        />
        <el-table-column align="center" min-width="240" label="商品名称">
          <template slot-scope="scope">
            <div class="scope">
              <div
                class="scopeItem"
                v-for="(item, index) in scope.row.product"
                :key="index + item.product_name"
              >
                <el-tooltip
                  :open-delay="2000"
                  :content="item.product_name"
                  placement="top"
                >
                  <span>{{ item.product_name }}</span>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="180" label="规格*数量">
          <template slot-scope="scope">
            <div class="scope">
              <div
                class="scopeItem"
                v-for="(item, index) in scope.row.product"
                :key="index + item.product_name"
              >
                {{ item.product_attr_value_name_string + " * " + item.number }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="gold_coin" label="金币(元)" />
        <el-table-column align="center" prop="midou_money" label="蜜豆(元)" />
        <el-table-column align="center" prop="balance" label="余额(元)" />
        <el-table-column align="center" prop="amount_pay" label="实付(元)" />
        <el-table-column align="center" prop="agent_comm" label="订单收益" />
        <!-- <el-table-column align="center" v-if='formInline.product_type == "10"' width="90" prop="referer_rebate_comm" label="推荐人返佣" /> -->
        <el-table-column align="center" prop="retail" label="分销佣金" />
        <el-table-column align="center" prop="type_text" label="类型" />
        <el-table-column align="center" prop="self_text" label="配送方式" />
        <el-table-column align="center" prop="status_text" label="交易状态" />
        <el-table-column
          align="center"
          prop="create_time"
          min-width="160"
          label="时间"
        />

        <!-- <el-table-column align="center" prop="create_time" label="一级代理商抽成"></el-table-column> -->
        <!-- <el-table-column align="center" prop="create_time" label="二级代理商抽成"></el-table-column> -->
        <!-- <el-table-column align="center" prop="create_time" label="三级代理商抽成"></el-table-column>-->
      </el-table>
    </template>
    <div class="block">
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 30, 40, 50]"
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
import { order_list, export_order_list } from "@/api/order";
import { pickerOptions, parseTime } from "@/utils/index";
import { trim } from "@/utils/validate";
export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: pickerOptions,
      },
      action: [],
      multipleSelection: [],
      // 搜索条件
      formInline: {
        product_name: "", // 商品名称
        order_sn: "", // 订单编号
        state: "", // 订单状态
        stateList: [], // 状态列表
        delivery: "", // 配送方式
        deliveryList: [], // 方式列表
        product_type: "", // 商品类型
        product_type_list: [], // 类型列表
        phone: "", // 手机号码
        orderTime: [], // 下单时间
        agent: "", // 代理商
        agentList: [], // 代理商列表
        delivery_time: [], // 配送时间段
        selftSite: [], // 当前选中的自提点
        selftSite_list: [], // 自提点列表
      },
      dataList: [],
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      loading: false,
    };
  },
  created() {
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
    getData() {
      this.loading = true;
      const DATA = {
        product_name: trim(this.formInline.product_name),
        order_sn: trim(this.formInline.order_sn),
        status: this.formInline.state,
        type: this.formInline.product_type,
        user_tel: trim(this.formInline.phone),
        agent_id: this.formInline.agent,
        page: this.page,
        limit: this.limit,
        self: this.formInline.delivery,
        self_point: this.formInline.selftSite,
        export: 0,
        start_date:
          this.formInline.orderTime && this.formInline.orderTime[0]
            ? parseTime(this.formInline.orderTime[0])
            : "",
        end_date:
          this.formInline.orderTime && this.formInline.orderTime[1]
            ? parseTime(this.formInline.orderTime[1])
            : "",
        delivery_time_start:
          this.formInline.delivery_time && this.formInline.delivery_time[0]
            ? parseTime(this.formInline.delivery_time[0])
            : "",
        delivery_time_end:
          this.formInline.delivery_time && this.formInline.delivery_time[1]
            ? parseTime(this.formInline.delivery_time[1])
            : "",
      };

      order_list(DATA).then((res) => {
        this.loading = false;
        if (res.code == 1) {
          this.formInline.agentList = res.agent_map;
          this.action = res.action;
          this.formInline.deliveryList = res.data.self_map;
          this.dataList = res.data.list;
          this.total = res.data.count;
          this.formInline.stateList = res.data.status_map;
          this.formInline.selftSite_list = res.data.address_map;
          this.formInline.product_type_list = res.data.type_map;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    exportExcel() {
      const that = this;
      this.$confirm("请确认筛选条件是否符合", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "开始导出!",
          });

          const data = {
            product_name: trim(this.formInline.product_name),
            order_sn: trim(this.formInline.order_sn),
            status: this.formInline.state,
            type: this.formInline.product_type,
            user_tel: trim(this.formInline.phone),
            agent_id: this.formInline.agent,
            self: this.formInline.delivery,
            self_point: this.formInline.selftSite,
            start_date:
              this.formInline.orderTime && this.formInline.orderTime[0]
                ? parseTime(this.formInline.orderTime[0])
                : "",
            end_date:
              this.formInline.orderTime && this.formInline.orderTime[1]
                ? parseTime(this.formInline.orderTime[1])
                : "",
            delivery_time_start:
              this.formInline.delivery_time && this.formInline.delivery_time[0]
                ? parseTime(this.formInline.delivery_time[0])
                : "",
            delivery_time_end:
              this.formInline.delivery_time && this.formInline.delivery_time[1]
                ? parseTime(this.formInline.delivery_time[1])
                : "",
            export: 1,
          };
          //开启新下载窗口
          window.open(export_order_list(data));
        })
        .catch((res) => {
          this.$message.error("导出出现故障,请联系管理员");
          console.log(res);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.root {
  padding: 40px;
}
.block {
  margin-top: 20px;
}
.scope {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  .scopeItem {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    min-height: 45px;
    line-height: 20px;
    text-align: center;
    flex: 1;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    &::after {
      position: absolute;
      content: "";
      width: 100%;
      bottom: 0;
      left: 0;
      height: 1px;
      background-color: #ebeef5;
    }
    &:last-child {
      padding-bottom: 0;
      &::after {
        display: none;
      }
    }
  }
}
.routeLike {
  color: cornflowerblue;
}
</style>
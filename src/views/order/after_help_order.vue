<template>
  <div class="root">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label-width="80px" label="订单号:">
        <el-input v-model="formInline.order_sn" placeholder="请输入订单号"></el-input>
      </el-form-item>
      <el-form-item label-width="80px" label="用户账号:">
        <el-input v-model="formInline.phone" placeholder="请输入用户账号"></el-input>
      </el-form-item>
      <!-- <el-form-item label-width="80px" label="自提点">
        <el-select v-model="formInline.selfSite" multiple placeholder="请选择">
          <el-option label="全部" value="-1"></el-option>
          <el-option
            v-for="item in formInline.selfSite_list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label-width="80px" label="售后状态">
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

      <el-form-item label-width="80px" label="代理商">
        <el-select v-model="formInline.agent" placeholder="请选择">
          <el-option
            :label="item.name"
            v-for="(item, index) in formInline.agentList"
            :key="index"
            :value="item.agent_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="page=1;getData()">查询</el-button>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="success" @click="onSubmit">导出</el-button>
      </el-form-item> -->
    </el-form>
    <div class="handle">
      <el-button type="success" @click="handleOreder('accept')">受理</el-button>
      <el-button type="warning" @click="handleOreder('reject')">拒绝受理</el-button>
      <el-button type="primary" @click="handleOreder('receive')">收货</el-button>
      <el-button type="danger" @click="handleOreder('return')">退款</el-button>
    </div>
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

        <!-- <el-table-column fixed label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editClick(scope.row)">查看</el-button>
          </template>
        </el-table-column>-->
        <el-table-column fixed align="center" prop="service_id" label="售后ID" />
        <el-table-column align="center" prop="service_sn" width="160" label="售后编号" />
        <el-table-column fixed  width="190" align="center" label="订单编号">
          <template slot-scope="scope">
            <router-link
              class="routeLike"
              :to="{ path: `/order_detail?order_id=${scope.row.order_id}`}"
            >{{ scope.row.order_sn }}</router-link>
          </template>
        </el-table-column>
        <el-table-column fixed align="center" prop="user.user_nickname" min-width="110" label="用户" />
        <el-table-column align="center" min-width="160px" label="商品/数量">
          <template slot-scope="scope">
            <div class="scope">
              <div
                class="scopeItem"
                v-for="(item, index) in scope.row.product"
                :key="index + item.product_name"
              >{{ item.product_name + ' *'+ item.number }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="apply_money" label="申请金额(元)" />
        <el-table-column align="center" prop="balance" label="退款余额(元)" />
        <el-table-column align="center" prop="money" label="退款微信金额(元)" />
        <el-table-column align="center" prop="midou_money" label="退还蜜豆" />
        <el-table-column align="center" prop="return_type" label="退款类型" />
        <el-table-column align="center" prop="status_text" label="售后状态" />
        <el-table-column align="center" prop="descs" label="退款说明" />
        <el-table-column align="center" min-width="160" prop="create_time" label="申请时间" />
        <el-table-column align="center" prop="operator.user_nickname" label="操作人" />
        <el-table-column align="center" prop="agent_name" label="代理商" />
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
import { after_help, handleOreder } from "@/api/order";
import { pickerOptions, parseTime } from "@/utils/index";
import { format } from "path";
export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: pickerOptions
      },
      multipleSelection: [],
      dataList: [],
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      loading: false,
      // 搜索条件
      formInline: {
        order_sn: "", // 订单编号
        state: "", // 订单状态
        stateList: [], // 状态列表
        // selfSite: "", // 自提点
        // selfSite_list: [], // 自提点列表
        phone: "", // 手机号码
        agent: "", // 代理商
        agentList: [] // 代理商列表
      }
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
    onSubmit(e) {
      console.log(e);
    },
    getData() {
      this.loading = true;
      const DATA = {
        order_sn: this.formInline.order_sn,
        status: this.formInline.state,
        user_tel: this.formInline.phone,
        agent_id: this.formInline.agent,
        page: this.page,
        limit: this.limit
      };

      after_help(DATA).then(res => {
        console.log(res);
        this.loading = false;
        if (res.code == 1) {
          this.formInline.agentList = res.agent_map;
          this.action = res.action;
          // this.formInline.deliveryList = res.data.self_map;
          this.dataList = res.data.list;
          this.total = res.data.count;
          this.formInline.stateList = res.data.status_map;
          // this.formInline.product_type_list = res.data.type_map;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    /**
     * 操作售后订单
     * @param {act} String 操作种类( ‘return’:退款，’accept’:受理，’reject’:拒绝受理，’receive’：收货)
     */
    handleOreder(act) {
      let _this = this;
      this.$confirm("确认操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let data = {
          act: act,
          service_ids: _this.multipleSelection.map(item => item.service_id)
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

    exportExcel() {
      const that = this;
      this.$confirm("请确认筛选条件是否符合", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "开始导出!"
          });

          const data = {
            product_name: this.formInline.product_name,
            order_sn: this.formInline.order_sn,
            status: this.formInline.state,
            type: this.formInline.product_type,
            user_tel: this.formInline.phone,
            agent_id: this.formInline.agent,
            start_date:
              this.formInline.orderTime && this.formInline.orderTime[0]
                ? parseTime(this.formInline.orderTime[0])
                : "",
            end_date:
              this.formInline.orderTime && this.formInline.orderTime[1]
                ? parseTime(this.formInline.orderTime[1])
                : ""
          };
          //开启新下载窗口
          window.open(exportProduct(data));
        })
        .catch(res => {
          this.$message.error("导出出现故障,请联系管理员");
          console.log(res);
        });
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
.routeLike{
  color: cornflowerblue
}
</style>
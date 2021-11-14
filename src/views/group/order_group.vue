<template>
  <div class="root">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label-width="80px" label="订单编号:">
        <el-input v-model="order_sn" placeholder="请输入订单编号"></el-input>
      </el-form-item>
      <el-form-item label-width="80px" label="商品名称:">
        <el-input v-model="product_name" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label-width="80px" label="状态:">
        <el-select v-model="status" placeholder="请选择">
          <el-option label="全部" value="-1"></el-option>
          <el-option :label="item" v-for="(item, index) in status_map" :key="index" :value="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="80px" label="代理商:">
        <el-select v-model="agent_id" placeholder="请选择">
          <el-option
            :label="item.name"
            v-for="(item, index) in agent_map"
            :key="index"
            :value="item.agent_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下单时间: ">
        <el-date-picker
          v-model="dateTime"
          type="datetimerange"
          align="center"
          unlink-panels
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="page=1;getData()">查询</el-button>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="success" @click="onSubmit">导出</el-button>
      </el-form-item>-->
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

        <!-- <el-table-column fixed label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editClick(scope.row)">查看</el-button>
          </template>
        </el-table-column>-->
        <el-table-column fixed align="center" prop="order_sn" label="订单编号" />
        <el-table-column align="center" prop="product_name" label="商品名称">
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
        <el-table-column align="center" prop="product.product_price" label="商品Id">
          <template slot-scope="scope">
            <div class="scope">
              <div
                class="scopeItem"
                v-for="(item, index) in scope.row.product"
                :key="index + item.product_name"
              >{{ item.product_id }}</div>
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
              >{{ item.product_attr_value_name_string + ' * ' + item.number }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="create_time" label="下单时间" />
        <el-table-column align="center" prop="success_time" label="成团时间" />
        <el-table-column align="center" prop="status_text" label="订单状态" />
        <el-table-column align="center" prop="amount_pay" label="实付金额" />
        <el-table-column align="center" label="收货信息">
          <template slot-scope="scope">
            <div>{{ scope.row.address.order_address || '无' }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="提货信息">
          <template slot-scope="scope">
            <div>{{ scope.row.address.self_address || '无' }}</div>
          </template>
        </el-table-column>
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
import { order_group } from "@/api/group";
import { pickerOptions, parseTime } from "@/utils/index";
import { format } from "path";
export default {
  data() {
    return {
      pickerOptions: {
        // 日期组件的 <前三月> 快捷设置, 不用在意
        shortcuts: pickerOptions
      },
      multipleSelection: [], // 选中列表
      dataList: [],
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      loading: false,
      product_name: "", // 商品名称
      order_sn: "", // 订单编号
      dateTime: [], // 时间段
      status: "", // 订单状态
      status_map: [], // 状态列表
      agent_id: "", // 供应商Id
      agent_map: [] // 供应商列表
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
    // 删除拼团商品
    deleteProduct() {},
    getData() {
      this.loading = true;
      const DATA = {
        product_name: this.product_name,
        order_sn: this.order_sn,
        start_date:
          this.dateTime && this.dateTime[0] ? parseTime(this.dateTime[0]) : "",
        end_date:
          this.dateTime && this.dateTime[1] ? parseTime(this.dateTime[1]) : "",
        status: this.status,
        agent_id: this.agent_id,
        page: this.page,
        limit: this.limit
      };

      order_group(DATA).then(res => {
        console.log(res);
        this.loading = false;
        if (res.code == 1) {
          this.agent_map = res.agent_map;
          this.action = res.action;
          // this.deliveryList = res.data.self_map;
          this.dataList = res.data.list;
          this.total = res.data.count;
          this.status_map = res.data.status_map;
          // this.product_type_list = res.data.type_map;
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
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "开始导出!"
          });

          const data = {
            product_name: this.product_name,
            order_sn: this.order_sn,
            status: this.state,
            type: this.product_type,
            user_tel: this.phone,
            agent_id: this.agent,
            start_date:
              this.orderTime && this.orderTime[0]
                ? parseTime(this.orderTime[0])
                : "",
            end_date:
              this.orderTime && this.orderTime[1]
                ? parseTime(this.orderTime[1])
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
.routeLike {
  color: cornflowerblue;
}
</style>
<template>
  <div class="root">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label-width="80px" label="申请时间">
        <el-date-picker
          v-model="formInline.time"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label-width="130px" label="会员昵称/Id">
        <el-input v-model="formInline.userName" placeholder="会员昵称/Id"></el-input>
      </el-form-item>

      <el-form-item label-width="80px" label="状态">
        <el-select v-model="formInline.status" placeholder="请选择">
          <el-option
            :label="item.value"
            v-for="(item, index) in formInline.status_map"
            :key="index"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="page=1;getData()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="exportExcel">导出</el-button>
      </el-form-item>
    </el-form>
    <template>
      <el-table v-loading="loading" :data="dataList" border style="width: 100%" fit>
        <el-table-column fixed type="selection" align="center" width="55"></el-table-column>
        <!-- <el-table-column fixed type="selection" align="center" width="55" /> -->
        <!-- <el-table-column fixed align="center" label="操作">
          <template slot-scope="scope">
            <router-link
              class="routeLike"
              :to="{ path: `/order_detail?order_id=${scope.row.order_id}`}"
            >查看</router-link>
          </template>
        </el-table-column> -->
        <el-table-column fixed align="center" prop="user_nickname" label="昵称" />
        <el-table-column align="center" prop="user_tel" label="会员账户" />
        <el-table-column align="center" prop="product_name" label="商品名称" />
        <el-table-column align="center" prop="product_stock" label="试用数(库存)" />
        <el-table-column align="center" prop="product_price" label="商品价值" />
        <el-table-column align="center" min-width="160" prop="create_time" label="申请时间" />
        <!-- <el-table-column align="center" min-width="160" prop="pay_time" label="收货地址" /> -->
        <el-table-column align="center" prop="status_val" label="状态" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-show="!scope.row.status"
              size="small"
              type="success"
              @click="editClick(scope.row.id, 1)"
            >成功</el-button>
            <el-button
              v-show="!scope.row.status"
              size="small"
              type="warning"
              @click="editClick(scope.row.id, 2)"
            >失败</el-button>
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
import { getTrial, updateStatus } from "@/api/membersBoon";
import { pickerOptions, parseTime } from "@/utils/index";
export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: pickerOptions
      },
      action: [],
      multipleSelection: [],
      // 搜索条件
      formInline: {
        userName: "", // 用户账号/Id
        time: [], // 申请时间段
        status: "", // 状态
        status_map: [] // 状态列表
      },
      dataList: [],
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      loading: false
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
    editClick(id, status) {
      updateStatus({
        id,
        status
      }).then(res => {
        if (res.code === 1) {
         this.$message.success(res.msg);
          setTimeout(() => {
            this.getData();
          }, 600);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getData() {
      this.loading = true;
      const DATA = {
        page: this.page,
        limit: this.limit,
        keyword: this.formInline.userName,
        status: this.formInline.status,
        start_date:
          this.formInline.time && this.formInline.time[0]
            ? parseTime(this.formInline.time[0])
            : "",
        end_date:
          this.formInline.time && this.formInline.time[1]
            ? parseTime(this.formInline.time[1])
            : ""
      };

      getTrial(DATA).then(res => {
        this.loading = false;
        if (res.code == 1) {
          this.dataList = res.data.list;
          this.total = res.data.total;
          this.formInline.status_map = res.data.status_map;
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
            product_name: this.formInline.product_name,
            order_sn: this.formInline.order_sn,
            status: this.formInline.state,
            type: this.formInline.product_type,
            user_tel: this.formInline.phone,
            agent_id: this.formInline.agent,
            start_date:
              this.formInline.time && this.formInline.time[0]
                ? parseTime(this.formInline.time[0])
                : "",
            end_date:
              this.formInline.time && this.formInline.time[1]
                ? parseTime(this.formInline.time[1])
                : "",
            export: 1
          };
          //开启新下载窗口
          getTrial(data);
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
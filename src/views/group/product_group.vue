<template>
  <div class="root">
    <el-form :inline="true" class="demo-form-inline">
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
      <el-form-item label-width="80px" label="商品名称:">
        <el-input v-model="product_name" placeholder="请输入商品名称"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="page=1;getData()">查询</el-button>
        <el-button type="warning" @click="deleteProduct">删除</el-button>
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
        <el-table-column fixed align="center" prop="product.product_name" label="商品名称" />
        <el-table-column align="center" prop="product_id" label="商品Id" />
        <el-table-column align="center" prop="product.product_price" label="销售价" />
        <el-table-column align="center" prop="price" label="拼团价" />
        <el-table-column align="center" prop="number" label="成团人数" />
        <el-table-column align="center" prop="time_limit" label="成团时限" />
        <el-table-column align="center" width="160" prop="group_buy.start_time" label="开始时间" />
        <el-table-column align="center" width="160" prop="group_buy.end_time" label="结束时间" />
        <el-table-column align="center" prop="group_buy.status" label="状态" />
        <el-table-column align="center" prop="group_buy.title" label="所属活动" />
        <el-table-column align="center" prop="is_popularize_text" label="是否可推广团" />
        <el-table-column align="center" prop="agent_name" label="所属代理商" />
        <el-table-column align="center" prop="sort" label="排序">
          <template slot-scope="scope">
            <el-input
              type="number"
              min="0"
              v-model="scope.row.sort"
              @change="onSort(scope.row.sort, scope.row.id)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div style="margin-bottom: 10px">
              <el-button type="primary" @click="editClick(scope.row.id)">编辑</el-button>
            </div>
            <div style="margin-bottom: 10px">
              <el-button type="warning" @click="deleteProduct(scope.row.id)">删除</el-button>
            </div>
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
import { product_group, deleteProduct, changeSort } from "@/api/group";
import { pickerOptions, parseTime } from "@/utils/index";
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
      product_name: "",
      status: "",
      status_map: [],
      agent_id: "",
      agent_map: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    onSort(sort, id) {
      changeSort({
        id,
        sort
      }).then(res => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          
        }else {
          this.$message.error(res.msg)
          this.getData();
        }
        
      }).catch(res => {
        console.log('错误返回', res);
        this.$message.error('修改错误');
        this.getData();
      })
    },
    editClick(id) {
      if (id) {
        this.$router.push("/setProduct?id=" + id);
      }
    },
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
    deleteProduct(id) {
      console.log(typeof id);
      let data = {};
      if (typeof id === "number") {
        // 单个删除
        data = {
          ids: [id]
        };
      } else {
        // 全部删除
        data = {
          ids: this.multipleSelection.map(item => item.id)
        };
      }

      this.$confirm("是否确认删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteProduct(data)
            .then(res => {
              if (res.code == 1) {
                this.$message.success(res.msg);
                setTimeout(() => {
                  this.getData();
                }, 600);
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(res => {
              console.log("请求错误信息 => ", res);
              this.$message.error("删除出错, 请检查网络或者联系管理员");
            });
        })
        .catch();

      // deleteProduct;
    },
    getData() {
      this.loading = true;
      const DATA = {
        product_name: this.product_name,
        status: this.status,
        agent_id: this.agent_id,
        page: this.page,
        limit: this.limit
      };

      product_group(DATA).then(res => {
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
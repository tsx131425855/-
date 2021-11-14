<template>
  <div class="root">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-button type="success" @click="add">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="detel">删除</el-button>
      </el-form-item>
      <el-form-item v-if="isSelf" label-width="100px" label="代理商">
        <el-select v-model="agent_id" placeholder="请选择">
          <el-option
            v-for="(item, index) in agent_map"
            :label="item.name"
            :key="index"
            :value="item.agent_id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="page=1; getData();">查询</el-button>
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
        <el-table-column align="center" prop="menu_id" label="编号" />
        <el-table-column align="center" prop="order_name" label="活动名称" />
        <el-table-column align="center" prop="web_show" label="前端显示内容" />
        <el-table-column align="center" prop="desc" label="备注" />
        <el-table-column align="center" prop="name" label="代理商" />
        <el-table-column align="center" prop="add_time" label="创建时间" />

        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <router-link
              class="routeLike"
              :to="{ path: `/whiteDetail?menu_id=${scope.row.menu_id}`}"
            >编辑</router-link>
          </template>
        </el-table-column>
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
import { whiteList, detelWhite } from "@/api/coupon";
export default {
  data() {
    return {
      action: [],
      isSelf: false, // 是否为本平台管理者
      multipleSelection: [], // 选中列表
      dataList: [], // 数据列表
      limit: parseInt(localStorage.getItem("limit")) || 10,
      agent_id: "", // 供应商ID
      agent_map: [], // 供应商列表
      total: 0, // 总数
      page: 1, // 页码
      loading: false // 是否显示loading
    };
  },
  created() {
    this.isSelf = JSON.parse(localStorage.getItem("user")).agent_id == 1;
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
    add() {
      this.$router.push("/whiteDetail");
    },
    detel() {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          detelWhite({
            menu_id: this.multipleSelection.map(item => item.menu_id)
          })
            .then(res => {
              console.log(res);
              if (res.code == 1) {
                this.$message.success(res.msg);

                setTimeout(() => {
                  this.getData();
                }, 600);
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(() => {
              this.$message.error("操作错误, 请重试或者联系管理员");
            });
        })
        .catch(() => {});
    },
    getData() {
      this.loading = true;
      whiteList({
        page: this.page,
        limit: this.limit,
        agent_id: this.agent_id
      }).then(res => {
        if (res.code == 1) {
          this.total = res.data.count;
          this.dataList = res.data.list;
          this.agent_map = res.agent_map;
          this.loading = false;
        } else {
          this.$message.error(res.msg);
        }
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
  margin-bottom: 40px;
}
.routeLike {
  color: cornflowerblue;
}
</style>
<template>
  <div class="root">
    <div style="margin: 30px auto">
      <el-button type="primary" @click="addProduct">添加商品</el-button>
      <el-button type="warning" @click="detel">删除商品</el-button>
    </div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="商品名称">
        <el-input v-model="keyword" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="代理商">
        <el-select v-model="agent_id" placeholder="请选择">
          <el-option
            :label="item.value"
            v-for="(item, index) in agent_map"
            :key="index"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="status" placeholder="请选择">
          <el-option
            :label="item.val"
            v-for="(item, index) in status_map"
            :key="index"
            :value="item.key"
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
        style="width: 100%;"
        fit
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
        <el-table-column fixed type="selection" align="center" width="55" />

        <el-table-column align="center" prop="product_id" label="商品ID" />
        <el-table-column align="center" fixed prop="product_name" min-width="150" label="商品名称" />
        <!-- <el-table-column align="center" prop="product_price" label="商品编号" /> -->
        <el-table-column align="center" prop="cate_name" label="商品分类" />
        <el-table-column align="center" prop="product_price" label="商品价格" />
        <el-table-column align="center" prop="product_ot_price" label="市场价格" />
        <el-table-column align="center" min-width="160" prop="create_time" label="创建时间" />
        <el-table-column align="center" min-width="160" prop="product_end_time" label="结束时间" />
        <el-table-column align="center" prop="product_stock" label="库存" />
        <el-table-column align="center" prop="product_coin" label="金币抵扣限制" />
        <!-- <el-table-column align="center" prop="product_stock" label="是否推荐" /> -->
        <!-- <el-table-column align="center" prop="product_stock" label="状态" /> -->
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
    <el-dialog
      center
      title="添加商品"
      :visible.sync="mask.show"
      top="50px"
      :before-close="cancelMask"
      class="mask"
      :close-on-click-modal="false"
    >
      <el-form :inline="true" label-width="100px">
        <el-form-item label="代理商">
          <el-select v-model="mask.agent_id" placeholder="请选择">
            <el-option
              :label="item.value"
              v-for="(item, index) in agent_map"
              :key="index"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input style="width: 300px" v-model="mask.keyword" placeholder="商品ID/商品名"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="mask.page=1; getTable()">查询</el-button>
          <el-button type="success" @click="confirmMask">确定</el-button>
          <el-button type="info" @click="cancelMask">取消</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="mask.loading"
        :data="mask.table"
        max-height="600"
        border
        fit
        @selection-change="val => { this.mask.multipleSelection = val; }"
      >
        <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
        <el-table-column fixed type="selection" align="center" width="55" />

        <el-table-column align="center" prop="product_id" label="商品ID" />
        <el-table-column align="center" prop="product_name" min-width="110" label="商品标题" />
        <el-table-column align="center" prop="cate_name" label="商品分类" />
        <el-table-column align="center" prop="product_price" label="商品价格" />
        <el-table-column align="center" prop="product_ot_price" label="市场价格" />
        <el-table-column align="center" min-width="160" prop="product_start_time" label="创建时间" />
        <el-table-column align="center" min-width="160" prop="product_end_time" label="结束时间" />
        <el-table-column align="center" prop="product_stock" label="库存" />
        <el-table-column align="center" prop="product_coin" label="金币抵扣限制" />
        <el-table-column align="center" prop="is_recommend" label="是否推荐" />

        <el-table-column align="center" prop="is_show" label="状态" />

        <!-- <el-table-column align="center" prop="create_time" label="一级代理商抽成"></el-table-column> -->
        <!-- <el-table-column align="center" prop="create_time" label="二级代理商抽成"></el-table-column> -->
        <!-- <el-table-column align="center" prop="create_time" label="三级代理商抽成"></el-table-column>-->
      </el-table>
      <div class="block">
        <el-pagination
          :current-page="mask.page"
          :page-sizes="[10, 20, 30, 40,50]"
          :page-size="mask.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="mask.total"
          @size-change="handleMaskSizeChange"
          @current-change="handleMaskCurrentChange"
        />
      </div>
    </el-dialog>
    <!-- <div class="block">
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 30, 40,50]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>-->
  </div>
</template>

<script>
import { getHot, getHotProduct, addHot, deleteHot } from "@/api/hot";
import { pickerOptions, parseTime } from "@/utils/index";
import { arrRoofPlacement } from "@/utils/user";
export default {
  data() {
    return {
      action: [], // 权限列表
      multipleSelection: [], // 选中列表
      status_map: [], // 状态列表
      status: "",
      keyword: "", // 搜索关键字
      dataList: [], // 数据列表
      agent_id: "", // 供应商id
      agent_map: [], // 供应商列表
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      loading: false,
      mask: {
        show: false, // 是否显示
        table: [], // 弹窗中的表格数据
        keyword: "", // 搜索关键字
        multipleSelection: [], // 选中文本
        total: 0, // 总数
        page: 1, // 页码
        limit: parseInt(localStorage.getItem("limit")) || 10,
        loading: false // 是否显示loading
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

    handleMaskCurrentChange(val) {
      // 页数
      this.mask.page = val;
      console.log(`当前页: ${val}`);
      this.getTable();
    },
    handleMaskSizeChange(val) {
      this.mask.limit = val;
      console.log(`每页 ${val} 条`);
      this.mask.page = 1;
      this.getTable();
    },

    handleSelectionChange(val) {
      /** 选中 */
      console.log(val);
      this.multipleSelection = val;
    },
    addProduct() {
      this.mask.show = true;
      //   this.getTable();
    },
    handleGoTop(index) {
      this.dataList = arrRoofPlacement(this.dataList, index);
    },
    getTable() {
      if (!this.mask.agent_id) {
        this.$message.warning("请先选中代理区域");
        return;
      }
      this.mask.loading = true;
      let product_list = this.dataList.map(item => item.product_id);
      getHotProduct({
        agent_id: this.mask.agent_id || "",
        keyword: this.mask.keyword || "",
        page: this.mask.page || "",
        limit: this.mask.limit || "",
        cate_id: this.mask.cate_id || ""
      })
        .then(res => {
          if (res.code == 1) {
            this.mask.loading = false;
            this.mask.total = res.data.count;
            this.mask.table = res.data.list;
            this.mask.product_category = res.data.product_category;
            this.mask.multipleSelection = [];
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {
          this.$message.error("获取表格错误");
        });
    },
    confirmMask() {
      addHot({
        agent_id: this.mask.agent_id,
        product_id: this.mask.multipleSelection.map(item => item.product_id)
      }).then(res => {
        if (res.code === 1) {
          this.$message.success("添加成功");
          this.mask = {
            show: false, // 是否显示
            table: [], // 弹窗中的表格数据
            keyword: "", // 搜索关键字
            multipleSelection: [], // 选中文本
            total: 0, // 总数
            page: 1, // 页码
            loading: false // 是否显示loading
          };
          this.getData();
        } else {
          this.$message.error("添加失败! error:" + res.msg);
        }
      });
    },
    cancelMask() {
      this.$confirm("是否放弃添加?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.mask = {
          show: false, // 是否显示
          table: [], // 弹窗中的表格数据
          keyword: "", // 搜索关键字
          multipleSelection: [], // 选中文本
          total: 0, // 总数
          page: 1, // 页码
          loading: false // 是否显示loading
        };
      });
    },
    handleClose() {
      this.mask.show = false;
    },
    detel() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请先选则需要删除的数据");
        return;
      }
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        deleteHot({
          explosive_id: this.multipleSelection.map(item => item.explosive_id)
        }).then(res => {
          if (res.code === 1) {
            this.$message.success("删除成功");
            this.getData();
          } else {
            this.$message.error("删除失败! error:" + res.msg);
          }
        });
      });
    },
    /**
     * 提交
     */
    commit() {
      if (!this.form.id) {
        commitAddGroup({
          id: this.form.id,
          title: this.form.title,
          start_time:
            this.timeOut && this.timeOut[0] ? parseTime(this.timeOut[0]) : "",
          end_time:
            this.timeOut && this.timeOut[1] ? parseTime(this.timeOut[1]) : "",
          rules: this.form.rules,
          is_auto: this.form.is_auto,
          agent_id: this.form.agent_id,
          auto_time: this.form.auto_time,
          product_ids: this.dataList.map(item => item.product_id)
        }).then(res => {
          if (res.code == 1) {
            this.$message.success("提交成功");
            console.log(this.$router);
            setTimeout(() => {
              this.getData();
            }, 600);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        commitEditGroup({
          id: this.form.id,
          title: this.form.title,
          start_time:
            this.timeOut && this.timeOut[0] ? parseTime(this.timeOut[0]) : "",
          end_time:
            this.timeOut && this.timeOut[1] ? parseTime(this.timeOut[1]) : "",
          rules: this.form.rules,
          is_auto: this.form.is_auto,
          agent_id: this.form.agent_id,
          auto_time: this.form.auto_time,
          product_ids: this.dataList.map(item => item.product_id)
        })
          .then(res => {
            if (res.code == 1) {
              this.$message.success("提交成功");
              console.log(this.$router);
              setTimeout(() => {
                this.getData();
              }, 600);
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(res => {
            this.$message.error("提交出错");
          });
      }
    },
    getData() {
      this.loading = true;
      getHot({
        page: this.page || "",
        limit: this.limit || "",
        keyword: this.keyword || "",
        agent_id: this.agent_id || "",
        is_show: this.status || ""
      })
        .then(res => {
          this.loading = false;
          if (res.code === 1) {
            this.status_map = res.data.is_show;
            this.agent_map = res.data.agent_arr;
            this.dataList = res.data.list;
            this.total = res.data.count;
          } else {
            this.$message.error("获取失败! error:" + res.msg);
          }
        })
        .catch(res => {
          this.$message.error("获取数据错误!");
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
</style>
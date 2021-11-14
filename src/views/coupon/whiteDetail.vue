<template>
  <div class="root">
    <el-form label-width="100px">
      <el-form-item label="活动名称">
        <el-input style="width: 300px" v-model="form.order_name" placeholder="活动名称"></el-input>
      </el-form-item>
      <el-form-item label="前端显示">
        <el-input style="width: 300px" v-model="form.web_show" placeholder="前端显示"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input style="width: 300px" v-model="form.desc" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item v-if="!form.menu_id" label="代理商">
        <el-select v-model="form.agent_id" placeholder="请选择">
          <el-option
            :label="item.val"
            v-for="(item, index) in agent_map"
            :key="index"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-else label="代理商">
        <el-input style="width: 300px" disabled v-model="form.name" placeholder="备注"></el-input>
      </el-form-item>

      <el-form-item style="margin-top: 50px">
        <el-button type="primary" @click="addProduct">添加商品</el-button>
        <el-button type="info" @click="$router.back(-1)">返回</el-button>

        <el-button type="warning" @click="detel">删除</el-button>
        <el-button type="success" style="width: 120px; " @click="commit">提交</el-button>
      </el-form-item>
    </el-form>
    <template>
      <el-table
        v-loading="loading"
        :data="dataList"
        border
        style="width: 100%; margin-left: 30px"
        fit
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
        <el-table-column fixed type="selection" align="center" width="55" />

        <el-table-column align="center" prop="product_id" label="商品ID" />
        <el-table-column align="center" prop="product_name" min-width="110" label="商品名称" />
        <el-table-column align="center" prop="product_price" label="销售价格" />
        <el-table-column align="center" prop="product_stock" label="库存" />
        <el-table-column align="center" prop="cate_name" label="分类" />
        <el-table-column align="center" prop="name" label="代理商" />

        <!-- <el-table-column align="center" prop="create_time" label="一级代理商抽成"></el-table-column> -->
        <!-- <el-table-column align="center" prop="create_time" label="二级代理商抽成"></el-table-column> -->
        <!-- <el-table-column align="center" prop="create_time" label="三级代理商抽成"></el-table-column>-->
      </el-table>
    </template>
    <el-dialog
      center
      title="添加商品"
      :visible.sync="mask.show"
      top="50px"
      :before-close="handleClose"
      class="mask"
      :close-on-click-modal="false"
    >
      <el-form :inline="true" label-width="50px">
        <el-form-item label="分类">
          <el-select v-model="cate_id" placeholder="请选择">
            <el-option
              v-for="item in product_category_map"
              :label="item.value"
              :key="item.key"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input style="width: 300px" v-model="mask.keyword" placeholder="商品ID/商品分类/商品名/代理商"></el-input>
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
        <el-table-column align="center" width="160" prop="add_time" label="创建时间" />
        <el-table-column align="center" prop="product_stock" label="库存" />
        <el-table-column align="center" prop="is_recommend" label="是否推荐	" />
        <el-table-column align="center" prop="is_show" label="状态" />
        <el-table-column align="center" prop="name" label="代理商" />

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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
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
import {
  addWhite, // 添加白名单
  commitWhite, // 提交白名单
  addProduct, // 添加商品
  editWhite, // 修改白名单
  editCommitWhite, // 提交修改
} from "@/api/coupon";

export default {
  data() {
    return {
      action: [], // 权限列表
      multipleSelection: [], // 选中列表

      form: {
        menu_id: 48,
        order_name: "",
        web_show: "",
        desc: "",
        // add_time: 0,
        // update_time: '',
        agent_id: "",
        name: "",
      },
      product_category_map: [],
      cate_id: 0,
      dataList: [], // 数据列表
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
        loading: false, // 是否显示loading
      },
    };
  },

  created() {
    this.form.menu_id = this.$route.query.menu_id;
    this.getData();
  },
  methods: {
    handleCurrentChange(val) {
      // 页数
      this.mask.page = val;
      console.log(`当前页: ${val}`);
      this.getTable();
    },
    handleSizeChange(val) {
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
      if (!this.form.agent_id) {
        this.$message.warning("必须选择您的营业/代理区域");
        return;
      }
      this.mask.show = true;
      this.cate_id = 0;
      this.getTable();
    },
    getTable() {
      this.mask.loading = true;
      let product_list = this.dataList.map((item) => item.product_id);
      addProduct({
        agent_id: this.form.agent_id,
        keyword: this.mask.keyword,
        cate_id: this.cate_id,
        page: this.mask.page,
        limit: this.mask.limit,
        product_id: product_list.length ? product_list : "",
      })
        .then((res) => {
          if (res.code == 1) {
            this.mask.loading = false;
            this.mask.total = res.data.count;
            this.mask.table = res.data.list;
            this.product_category_map = res.data.product_category_map;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {
          this.$message.error("获取表格错误");
        });
    },
    confirmMask() {
      this.dataList = this.dataList.concat(this.mask.multipleSelection);

      this.mask = {
        show: false, // 是否显示
        table: [], // 弹窗中的表格数据
        keyword: "", // 搜索关键字
        multipleSelection: [], // 选中文本
        total: 0, // 总数
        page: 1, // 页码
        loading: false, // 是否显示loading
      };
    },
    cancelMask() {
      this.$confirm("是否放弃添加?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.mask = {
          show: false, // 是否显示
          table: [], // 弹窗中的表格数据
          keyword: "", // 搜索关键字
          multipleSelection: [], // 选中文本
          total: 0, // 总数
          page: 1, // 页码
          loading: false, // 是否显示loading
        };
      });
    },
    handleClose() {
      this.mask.show = false;
    },
    detel() {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then((res) => {
        this.dataList = this.dataList.filter(
          (item) =>
            !this.multipleSelection.some(
              (i) => i.product_id === item.product_id
            )
        ); // 过滤掉选择删除的数据
        console.log(this.dataList);
      });
    },
    /**
     * 提交
     */
    commit() {
      if (!this.form.menu_id) {
        commitWhite({
          order_name: this.form.order_name,
          web_show: this.form.web_show,
          desc: this.form.desc,
          agent_id: this.form.agent_id,
          product_id: this.dataList.map((item) => item.product_id),
        }).then((res) => {
          if (res.code == 1) {
            this.$message.success("提交成功");
            console.log(this.$router);
            setTimeout(() => {
              this.$router.replace("/whiteList");
            }, 600);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        editCommitWhite({
          menu_id: this.form.menu_id,
          order_name: this.form.order_name,
          web_show: this.form.web_show,
          desc: this.form.desc,
          product_id: this.dataList.map((item) => item.product_id),
        })
          .then((res) => {
            if (res.code == 1) {
              this.$message.success("提交成功");
              console.log(this.$router);
              setTimeout(() => {
                this.$router.replace("/whiteList");
              }, 600);
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((res) => {
            this.$message.error("提交出错");
          });
      }
    },
    getData() {
      if (this.form.menu_id) {
        editWhite({
          menu_id: this.form.menu_id,
        })
          .then((res) => {
            console.log(res);
            this.form = res.data.list[0];

            this.dataList = res.data.product;
          })
          .catch((res) => {
            this.$message.error("获取数据错误!");
          });
      } else {
        addWhite().then((res) => {
          if (res.code == 1) {
            this.agent_map = res.data.agent_id;
          } else {
            res.$message.error(res.msg);
          }
        });
      }
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
.handle {
  margin-bottom: 40px;
}
</style>
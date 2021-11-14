<template>
  <div class="root">
    <el-form label-width="100px">
      <el-form-item label="活动名称">
        <el-input style="width: 300px" v-model="form.title" placeholder="活动名称"></el-input>
      </el-form-item>
      <el-form-item label="活动时间">
        <el-date-picker
          v-model="timeOut"
          style="width: 450px"
          align="center"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="活动规则">
        <el-input
          autosize
          style="max-width: 400px"
          type="textarea"
          v-model="form.rules"
          placeholder="活动规则"
        ></el-input>
      </el-form-item>

      <el-form-item label="自动机器凑单">
        <el-switch
          v-model="form.is_auto"
          active-color="#13ce66"
          style="margin-right: 30px;"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>成团时限最后
        <el-select style="width: 120px; margin: 0 8px" v-model="form.auto_time" placeholder="请选择">
          <el-option :label="item" v-for="(item, index) in timeList" :key="index" :value="index"></el-option>
        </el-select>凑单
      </el-form-item>

      <el-form-item label="代理商">
        <el-select
          :loading="loading"
          :disabled="!!form.id"
          v-model="form.agent_id"
          placeholder="请选择"
        >
          <el-option
            :label="item.name"
            v-for="(item, index) in agent_map"
            :key="index"
            :value="item.agent_id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item style="margin-top: 50px">
        <el-button type="primary" @click="addProduct">添加商品</el-button>
        <el-button type="warning" @click="detel">删除</el-button>
        <el-button type="info" @click="$router.back(-1)">返回</el-button>
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
        <el-table-column align="center" label="拼团价">
          <template slot-scope="scope">{{ scope.row.price || '未提交'}}</template>
        </el-table-column>
        <el-table-column align="center" label="成团人数">
          <template slot-scope="scope">{{ scope.row.number || '未提交'}}</template>
        </el-table-column>
        <el-table-column align="center" label="成团时限">
          <template slot-scope="scope">{{ scope.row.time_limit || '未提交'}}</template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button :type="scope.row.id ? 'primary' : 'info'" @click="addRule(scope.row.id)">添加规则</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div style="margin-bottom: 10px">
              <el-button type="success" @click="handleGoTop(scope.$index)">置顶</el-button>
            </div>
          </template>
        </el-table-column>
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
      <el-form :inline="true" label-width="100px">
        <el-form-item>
          <el-input style="width: 300px" v-model="mask.keyword" placeholder="商品ID/商品分类/商品名"></el-input>
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
        <el-table-column align="center" prop="add_time" label="创建时间" />
        <el-table-column align="center" prop="product_stock" label="库存	" />
        <el-table-column align="center" prop="time_limit" label="是否推荐">
          <template slot-scope="scope">{{ scope.row.is_recommend == 1? '是' : '否' }}</template>
        </el-table-column>
        <el-table-column align="center" prop="time_limit" label="状态">
          <template slot-scope="scope">{{ scope.row.is_show == 1? '已上架' : '未上架' }}</template>
        </el-table-column>

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
  productList,
  addGroup,
  commitAddGroup,
  editGroup,
  commitEditGroup
} from "@/api/group";
import { pickerOptions, parseTime } from "@/utils/index";
import { arrRoofPlacement } from "@/utils/user";
export default {
  data() {
    return {
      action: [], // 权限列表
      multipleSelection: [], // 选中列表

      form: {
        id: "", // 活动ID
        title: "",
        rules: "",
        auto_time: "",
        agent_id: "",
        is_auto: 1
      },
      timeOut: [],
      timeList: [], // 凑单时间列表
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
        loading: false // 是否显示loading
      }
    };
  },

  created() {
    this.form.id = this.$route.query.id;
    this.getData();
  },
  methods: {
    addRule(id) {
      if (!id) {
        this.$message.warning("您需要先将订单提交再重新进行规则设置;");
        return;
      }
      this.$router.push("/setProduct?id=" + id);
    },
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
      this.getTable();
    },
    handleGoTop(index) {
      this.dataList = arrRoofPlacement(this.dataList, index);
    },
    getTable() {
      this.mask.loading = true;
      let product_list = this.dataList.map(item => item.product_id);
      productList({
        agent_id: this.form.agent_id,
        keyword: this.mask.keyword,
        page: this.mask.page,
        limit: this.mask.limit,
        product_ids: product_list.length ? product_list : ""
      })
        .then(res => {
          if (res.code == 1) {
            this.mask.loading = false;
            this.mask.total = res.data.count;
            this.mask.table = res.data.list;
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
        loading: false // 是否显示loading
      };
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
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        this.dataList = this.dataList.filter(
          item =>
            !this.multipleSelection.some(i => i.product_id === item.product_id)
        ); // 过滤掉选择删除的数据
        console.log(this.dataList);
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
              this.$router.back(-1);
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
      if (this.form.id) {
        editGroup({
          id: this.form.id
        })
          .then(res => {
            console.log(res);
            this.form = res.data.group;
            this.agent_map = res.agent_map;
            this.timeList = res.data.auto_time_map;
            this.dataList = res.data.group_product;
            this.timeOut = [this.form.start_time, this.form.end_time];
            this.form.auto_time += ""; // 将自动凑单时间转化为字符串格式, 保持其与下拉中的value数据全等
          })
          .catch(res => {
            this.$message.error("获取数据错误!");
          });
      } else {
        addGroup({})
          .then(res => {
            if (res.code == 1) {
              this.agent_map = res.agent_map;
              this.timeList = res.data.auto_time_map;
            } else {
              res.$message.error(res.msg);
            }
          })
          .catch(() => {
            this.$message.error("获取数据错误!");
          });
      }
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
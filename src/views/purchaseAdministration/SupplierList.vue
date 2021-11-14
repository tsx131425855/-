<!-- tsx供应商列表 -->
<template>
  <div class="package">
    <div class="hide backtsx">
      <el-button type="primary" size="small" icon="el-icon-circle-plus" @click="addPurchase">新增</el-button>
      <span class="gaosizuobian">所属代理</span>
      <el-select v-model="agent_id" size="small" class="gaosizuobian" placeholder="请选择">
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <span class="gaosizuobian">状态</span>
      <el-select v-model="inbound" size="small" class="gaosizuobian" placeholder="请选择">
        <el-option
          v-for="item in inbound_map"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <el-input
        v-model="keyword"
        size="small"
        class="input gaosizuobian"
        prefix-icon="el-icon-search"
        placeholder="id"
      />
      <el-button
        type="success"
        size="small"
        class
        @click="page=1,getDatalist()"
        icon="el-icon-search"
      >查询</el-button>
    </div>
    <!-- 列表 -->
    <template>
      <el-table
        v-loading="loading"
        :data="datalist"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55" prop="product_category_id" />
        <el-table-column prop="id" label="供应商id" />
        <el-table-column prop="supplier_code" label="供应商编码" />
        <el-table-column prop="name" label="供应商名称" />
        <el-table-column prop="address_detail" label="供应商地址" />
        <el-table-column prop="phone" label="供应商手机号" />
        <el-table-column prop="created_time_date" label="创建时间" />
        <el-table-column prop="updated_time_date" label="更新时间" />
        <el-table-column prop="status_text" label="状态" />
        <el-table-column prop="agent_name" label="代理商" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="renew(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="lockUp(scope.row)">锁定</el-button>
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

    <el-dialog
      title
      :visible.sync="dialogVisible"
      width="50%"
      top="5vh"
      :fullscreen="fullscreen"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="form" :model="form" :disabled="prohibit" :rules="rules" label-width="100px">
        <el-form-item label="供应商名称" :required="true">
          <el-input placeholder="单行输入" v-model="form.name" size="small"></el-input>
        </el-form-item>
        <!-- <el-form-item label="代理商名称" :required="true">
          <el-input placeholder="单行输入" v-model="form.name" size="small"></el-input>
        </el-form-item>-->
        <el-form-item label="手机号" :required="true">
          <el-input placeholder="单行输入" v-model="form.phone" size="small"></el-input>
        </el-form-item>
        <el-form-item label="供应商地址" :required="true">
          <el-input placeholder="单行输入" v-model="form.address_detail" size="small"></el-input>
        </el-form-item>
        <el-form-item label="超级权限" :required="true">
          <el-radio-group v-model="form.is_all">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" :required="true">
          <el-input placeholder="单行输入" v-model="form.remark" size="small"></el-input>
        </el-form-item>
        <el-form-item label="代理商" :required="true">
          <el-select v-model="form.agent_id" size="small" class placeholder="请选择">
            <el-option
              v-for="item in agent"
              :key="item.agent_id"
              :label="item.name"
              :value="item.agent_id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="conmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
// import { exporteurl, turnDate, sameDay, Day } from "@/utils/user";
import {
  supplierLists,
  supplierAdd,
  supplierEdit,
  supplierLock
} from "@/api/supplier";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      keyword: "",
      agent: [],
      agent_id: JSON.parse(localStorage.getItem("user")).agent_id,
      time: [new Date(new Date().setHours(0, 0, 0, 0)), new Date()],
      loading: false,
      datalist: [],
      dialogVisible: false,
      fullscreen: false,
      form: { is_all: 1 },
      prohibit: false,
      rules: {},
      inbound: "",
      inbound_map: [],
      newEditor: 1
    };
  },
  // 过滤器
  filters: {},
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    handleCurrentChange(val) {
      // 页数
      this.page = val;
      console.log(`当前页: ${val}`);
      this.getDatalist();
    },
    handleSizeChange(val) {
      this.limit = val;
      console.log(`每页 ${val} 条`);
      localStorage.setItem("limit", val);
      this.page = 1;
      this.getDatalist();
    },
    handleSelectionChange(val) {
      /** 选中 */
      let arr = [];
      val.map(res => {
        arr.push(res.product_id);
      });
      this.multipleSelection = arr;
    },
    handleClose(done) {
      done();
    },
    addPurchase() {
      this.newEditor = 1;
      this.form = { is_all: 1 };
      this.dialogVisible = true;
    },
    renew(val) {
      /** 修改 */
      console.log(val);
      this.form = val;
      this.newEditor = 2;
      this.form.agent_id = this.form.agent_id.toString();
      this.dialogVisible = true;
    },
    lockUp(val) {
      const that = this;
      return new Promise((resolve, reject) => {
        supplierLock({ id: val.id }).then(res => {
          console.log(res);
          if (res.code == 1) {
            that.getDatalist();
            that.$message.success(res.msg);
          } else if (res.code == 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
        });
        // resolve();
      }).catch(error => {
        console.log(error);
      });
    },
    setEdit(basic) {
      /** 修改代理商 */
      const that = this;
      return new Promise((resolve, reject) => {
        supplierEdit(basic).then(res => {
          console.log(res);
          if (res.code == 1) {
            that.getDatalist();
            that.dialogVisible = false;
            that.$message.success(res.msg);
          } else if (res.code == 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
        });
        // resolve();
      }).catch(error => {
        console.log(error);
      });
    },
    conmit() {
      /** 提交 */
      const data = this.form;
      if (this.newEditor == 1) this.is_add(data);
      else this.setEdit(data);
    },
    is_add(basic) {
      /** 添加代理商 */
      const that = this;
      return new Promise((resolve, reject) => {
        supplierAdd(basic).then(res => {
          console.log(res);
          if (res.code == 1) {
            that.getDatalist();
            that.dialogVisible = false;
            that.$message.success(res.msg);
          } else if (res.code == 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
        });
        // resolve();
      }).catch(error => {
        console.log(error);
      });
    },
    getDatalist() {
      const that = this;
      const data = {
        agent_id: this.agent_id,
        keyword: this.keyword,
        status: this.inbound,
        page: this.page,
        limit: this.limit
      };
      return new Promise((resolve, reject) => {
        supplierLists(data).then(res => {
          if (res.code == 1) {
            that.datalist = res.data.list;
            that.total = res.data.total;
            that.inbound_map = res.data.status_map;
            that.agent = res.agent_map;
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch(error => {
        console.log(error);
      });
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getDatalist();
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  ctivated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang='scss' scoped>
// @import url(); 引入公共css类
@import "src/styles/hide.scss";
</style>

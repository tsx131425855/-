<!-- tsx -->
<template>
  <div class="package">
    <div class="hide backtsx" style="align-items: center;">
      <span class="gaosizuobian">代理商</span>
      <el-select v-model="agent_id" class="gaosizuobian" placeholder="请选择代理商">
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <span class="gaosizuobian">管理员账号：</span>
      <el-input v-model="keyword" class="input" prefix-icon="el-icon-search" placeholder="单行输入" />
      <el-button type="success" @click="page=1,getData()">搜索</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
      tooltip-effect="dark"
    >
      <!-- <el-table-column fixed type="selection" width="55" /> -->
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="admin_id" label="管理员ID" width="100" />
      <el-table-column prop="admin_name" label="管理员账户" width="120" />
      <el-table-column prop="group_id" label="分组ID" width="80" />
      <el-table-column prop="group_name" label="分组名" width="160" />
      <el-table-column prop="rule_path" label="权限路径" width="180" />
      <el-table-column prop="rule_name" label="权限名称" />
      <el-table-column prop="method" label="请求方法" width="80" />
      <el-table-column prop="params" label="请求参数" width="160">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title
            width="200"
            trigger="hover"
            :content="scope.row.params"
          >
            <div class="one" slot="reference" style="cursor:pointer;">{{scope.row.params}}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="browser" label="浏览器" width="160">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title
            width="200"
            trigger="hover"
            :content="scope.row.browser"
          >
            <div class="one" slot="reference" style="cursor:pointer;">{{scope.row.browser}}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="IP" width="180" />
      <el-table-column prop="create_time_date" label="操作时间" width="100" />
    </el-table>
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

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { jurisdictionLog } from "@/api/Jurisdiction";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      tableData: [],
      loading: false,
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      agent: [],
      agent_id: JSON.parse(localStorage.getItem("user")).agent_id,
      keyword: "",
      uub: true
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
    seoverbrowser() {
      console.log("进入");
    },
    outbrowser() {
      console.log("划出");
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
    getData() {
      // 当前列表数据
      let data = {
        phone: this.keyword,
        agent_id: this.agent_id,
        page: this.page,
        limit: this.limit
      };
      this.loading = true;
      const that = this;
      jurisdictionLog(data)
        .then(res => {
          // console.log(res.data)
          this.loading = false;
          if (res.code == 1) {
            this.tableData = res.data.list;
            this.total = res.data.total;
            this.agent = res.agent_map;
          } else if (res.code === 2) {
            that.$message.error(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(src => {
          that.$message.error(src.msg);
          localStorage.setItem("Token", src.token);
          that.$store.dispatch("logout").then(() => {
            location.reload(); //
          });
        });
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getData();
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
.one {
  width: 120px;
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*不换行*/
  text-overflow: ellipsis; /*超出部分文字以...显示*/
}
</style>

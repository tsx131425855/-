<!-- tsx 楼盘管理  -->
<template>
  <div class="package">
    <div class="hide backtsx">
      <el-button type="primary" size="small" @click="isshowhide(1)">添加</el-button>
      <!-- <el-button type="primary" size="small" @click="isshowhide(0)">隐藏</el-button> -->
      <span class="gaosizuobian">所属代理</span>
      <el-select v-model="agent_id" size="small" class="gaosizuobian" placeholder="请选择">
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>

      <el-input
        v-model="keyword"
        size="small"
        class="input gaosizuobian"
        prefix-icon="el-icon-search"
        placeholder="楼盘名称"
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
      <el-table v-loading="loading" :data="datalist" border style="width: 100%">
        <el-table-column prop="property_name" label="楼盘名称" />
        <el-table-column prop="property_phone" label="楼盘电话" />
        <el-table-column prop="property_address_text" label="楼盘地址" />
        <el-table-column prop="property_household_num" label="总户数" />
        <el-table-column prop="property_deposit_num" label="认筹数" />
        <el-table-column prop="property_household_in_num" label="入住数" />
        <el-table-column prop="house_keeper_num" label="管家数" />
        <el-table-column prop="property_price" label="均价(约)" />
        <el-table-column prop="property_sell_time" label="开盘时间" />
        <el-table-column prop="property_status_text" label="楼盘状态" />
        <el-table-column prop="property_deposit_protocol" label="认筹协议" />
        <el-table-column prop="agent_name" label="所属代理商" />
        <el-table-column prop="property_sort" label="排序(数大靠前)">
          <template slot-scope="scope">
            <el-input v-model="scope.row.property_sort" @blur="blurdata(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="is_show_text" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editdata(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deletedata(scope.row)">删除</el-button>
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

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
// import { exporteurl, turnDate, sameDay, Day } from "@/utils/user";
import { propertylists, propertydel, propertysort } from "@/api/sales";
import { MessageBoxs } from "@/utils/elementEncapsulation";
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
      agent_id: "0",
      loading: false,
      datalist: [],
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
      val.map((res) => {
        arr.push(res.agent_id);
      });
      this.multipleSelection = arr;
    },
    isshowhide(is_show) {
      /** 跳转 */
      this.$router.push({ path: "/addORupdete" });
    },
    editdata(row) {
      this.$router.push({ path: "/addORupdete", query: { edit: 2, row } });
    },
    blurdata() {
      propertysort({ sort_data: this.datalist }).then((res) => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          this.page = 1;
          this.getDatalist();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    deletedata(row) {
      MessageBoxs({
        that: this,
        message: "是否确认删除？ ",
      }).then((res) => {
        if (res == true) {
          propertydel({ property_id: row.property_id }).then((res) => {
            if (res.code == 1) {
              this.page = 1;
              this.getDatalist();
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    getDatalist() {
      const that = this;
      const data = {
        agent_id: this.agent_id,
        keyword: this.keyword,
        page: this.page,
        limit: this.limit,
      };
      return new Promise((resolve, reject) => {
        propertylists(data).then((res) => {
          if (res.code == 1) {
            that.datalist = res.data.list;
            that.total = res.data.total;
            that.agent = res.agent_map;
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch((error) => {
        console.log(error);
      });
    },
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
  ctivated() {}, // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang='scss' scoped>
// @import url(); 引入公共css类
@import "src/styles/hide.scss";
</style>

<!-- tsx  认筹列表 -->
<template>
  <div class="package">
    <div class="hide backtsx">
      <span class="gaosizuobian">所属代理</span>
      <el-select
        v-model="agent_id"
        size="small"
        class="gaosizuobian"
        placeholder="请选择"
        @change="typeagent"
      >
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <span class="gaosizuobian">认筹状态</span>
      <el-select v-model="status" size="small" class="gaosizuobian" placeholder="请选择">
        <el-option
          v-for="item in status_map"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <span class="gaosizuobian">楼盘名称:</span>
      <el-select v-model="property_id" size="small" class="gaosizuobian" placeholder="请选择">
        <el-option
          v-for="item in property_map"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <span class="gaosizuobian">认筹时间</span>
      <el-date-picker
        v-model="tiem"
        style="margin-left:20px"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-input
        v-model="keyword"
        size="small"
        class="input gaosizuobian"
        prefix-icon="el-icon-search"
        placeholder="请填手机号"
      />
      <el-button
        type="success"
        size="small"
        class
        @click="page=1,getDatalist()"
        icon="el-icon-search"
      >查询</el-button>
      <el-button type="success" icon="el-icon-printer" @click="exporte">导出</el-button>
      <el-button type="primary" size="small" @click="isshowhide(1)">认筹成功</el-button>
      <el-button type="primary" size="small" @click="isshowhide(0)">认筹失败</el-button>
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
        <el-table-column prop="user_nickname" label="昵称" />
        <el-table-column prop="user_tel" label="手机号" />
        <el-table-column prop="property_name" label="认筹楼盘" />
        <el-table-column prop="total_pay_fee" label="认筹金额" />
        <el-table-column prop="add_time" label="认筹时间" />
        <el-table-column prop="butler_list" label="所属管家" />
        <el-table-column prop="status_text" label="认筹状态" />
        <el-table-column prop="agent_name" label="所属代理商" />
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
import { subscribelists, subscribehandle, subscribeexport } from "@/api/sales";
import { MessageBoxs } from "@/utils/elementEncapsulation";
import { exporteurl, turnDate, conversiontime, exportFile } from "@/utils/user";
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
      inbound: 2,
      inbound_map: [],
      property_id: "",
      status: "",
      status_map: [],
      property_map: [],
      tiem: [],
      multipleSelection: []
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
        arr.push(res.id);
      });
      this.multipleSelection = arr;
    },
    typeagent() {
      this.property_id = "";
      this.page = 1;
      this.getDatalist();
    },
    exporte() {
      /** 导出 */
      let tiem = conversiontime(this.tiem, 1);
      const url = `${exporteurl}${subscribeexport}?keyword=${
        this.keyword
      }&agent_id=${this.agent_id}&property_id=${this.property_id}&status=${
        this.status
      }&start_time=${tiem.start_time}&end_time=${
        tiem.end_time
      }&token=${localStorage.getItem("Token")}`;
      exportFile(url);
    },
    isshowhide(type) {
      /** 显示隐藏 */
      subscribehandle({
        type,
        order_id: this.multipleSelection
      }).then(res => {
        if (res.code == 1) {
          this.page = 1;
          this.getDatalist();
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getDatalist() {
      const that = this;
      let tiem = conversiontime(this.tiem, 1);
      const data = {
        agent_id: this.agent_id,
        keyword: this.keyword,
        property_id: this.property_id,
        status: this.status,
        start_time: tiem.start_time,
        end_time: tiem.end_time,
        page: this.page,
        limit: this.limit
      };
      return new Promise((resolve, reject) => {
        subscribelists(data).then(res => {
          if (res.code == 1) {
            that.datalist = res.data.list;
            that.total = res.data.total;
            that.agent = res.agent_map;
            that.status_map = res.data.status_map;
            that.property_map = res.data.property_map;
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

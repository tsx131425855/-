<!-- tsx招商 -->
<template>
  <div class="package">
    <div class="hide backtsx">
      <el-select v-model="agent_id" style="margin-left: 10px;" placeholder="请选择代理商">
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <el-select v-model="type" style="margin-left: 10px;" placeholder="请选择类型">
        <el-option v-for="item in typelist" :key="item.key" :label="item.value" :value="item.key" />
      </el-select>
      <span style="margin-left: 10px;">开始时间</span>
      <el-date-picker
        v-model="start_time"
        style="margin-left: 10px;"
        type="datetime"
        placeholder="选择日期时间"
      ></el-date-picker>
      <span style="margin-left: 10px;">结束时间</span>
      <el-date-picker
        v-model="end_time"
        style="margin-left: 10px;"
        type="datetime"
        placeholder="选择日期时间"
      ></el-date-picker>
      <el-input
        v-model="partner_name"
        class="input"
        style="margin-left: 10px;"
        prefix-icon="el-icon-search"
        placeholder="合伙人姓名"
      />
      <el-input
        v-model="partner_tel"
        class="input"
        style="margin-left: 10px;"
        prefix-icon="el-icon-search"
        placeholder="合伙人电话"
      />
      <el-button type="success" class icon="el-icon-search" @click="page=1,getDatalist()">查询</el-button>
      <el-button type="success" icon="el-icon-printer" @click="exporte">导出</el-button>
    </div>

    <template>
      <el-table v-loading="loading" :data="datalist" border style="width: 100%">
        <el-table-column prop="partner_id" label="合伙人活动ID" />
        <el-table-column prop="user_name" label="合伙人姓名" />
        <el-table-column prop="user_tel" label="合伙人电话" />
        <el-table-column prop="business_name" label="商家名称" />
        <el-table-column prop="product_name" label="供货产品" />
        <el-table-column prop="address_detail" label="详细地址" />
        <el-table-column prop="start_time" label="提交申请时间" />
        <el-table-column prop="type_text" label="类别" />
        <el-table-column prop="area_name" label="所在城市" />
        <el-table-column prop="store_type" label="店铺类型" />
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
import { turnDate, exportFile, exporteurl } from "@/utils/user";
import { businessList, businessexport } from "@/api/advertising";
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
      datalist: [],
      loading: false,
      agent_id: "0",
      agent: [],
      type: 5,
      partner_name: "",
      partner_tel: "",
      start_time: "",
      end_time: "",
      typelist: []
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
    exporte() {
      let start_time = "";
      let end_time = "";
      if (this.start_time instanceof Date) {
        start_time = turnDate(this.start_time, 3);
      } else start_time = this.start_time;
      if (this.end_time instanceof Date) end_time = turnDate(this.end_time, 3);
      else end_time = this.end_time;

      const url = `${exporteurl}${businessexport}?type=${this.type}&agent_id=${
        this.agent_id
      }&partner_name=${this.partner_name}&partner_tel=${
        this.partner_tel
      }&start_time=${start_time}&end_time=${end_time}&token=${localStorage.getItem(
        "Token"
      )}`;
      exportFile(url);
    },
    getDatalist() {
      let start_time = "";
      let end_time = "";
      if (this.start_time instanceof Date) {
        start_time = turnDate(this.start_time, 21);
      } else {
        start_time = this.start_time;
      }
      if (this.end_time instanceof Date) {
        end_time = turnDate(this.end_time, 21);
      } else {
        end_time = this.end_time;
      }
      const data = {
        type: this.type,
        agent_id: this.agent_id,
        partner_name: this.partner_name,
        partner_tel: this.partner_tel,
        start_time,
        end_time,
        limit: this.limit,
        page: this.page
      };
      this.loading = true;
      const that = this;
      return new Promise((resolve, reject) => {
        businessList(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            if (res.action) {
              res.action.map(val => {
                if (val.tag == "batch_recovery" && val.display == 1) {
                  that.recovery = 1;
                }
              });
            }
            if (res.agent_map) {
              that.agent = res.agent_map;
            }
            that.datalist = res.data.list;
            that.typelist = res.data.type_arr;
            that.total = res.data.total;
          } else if (res.code === 2) {
            that.$message.error(res.msg);
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

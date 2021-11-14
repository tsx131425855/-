<!-- tsx 搜索记录 -->
<template>
  <div class="package">
    <div class="hide backtsx">
      <span>搜索时间</span>
      <el-date-picker
        v-model="tiem"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="margin-left: 10px;"
      ></el-date-picker>
      <span class="gaosizuobian">所属代理商</span>
      <el-select v-model="agent_id" size="small" class="gaosizuobian" placeholder="请选择代理商">
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>

      <el-input
        v-model="keyword"
        class="input"
        style="margin-left: 10px;"
        prefix-icon="el-icon-search"
        placeholder="关键词"
      />
      <el-button type="success" icon="el-icon-search" @click="page=1,getDatalist()">查询</el-button>
      <el-button type="success" size="small" @click="exporte()" icon="el-icon-search">导出</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="datalist"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed type="selection" width="55" />
      <el-table-column prop="keyword" label="关键词" />
      <el-table-column prop="type_text" label="搜索入口" />
      <el-table-column prop="nick_name" label="用户昵称" />
      <el-table-column prop="phone" label="用户手机" />
      <el-table-column prop="create_time" label="搜索时间" />
      <el-table-column prop="agent_name" label="所属代理商"></el-table-column>
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

import { searchexport, searchinfo } from "@/api/search";
import { exportFile, exporteurl, conversiontime } from "@/utils/user";
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
      multipleSelection: [],
      loading: false,
      agent: [],
      agent_id: JSON.parse(localStorage.getItem("user")).agent_id,
      tiem: [],
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
      this.getDatalist();
    },
    handleSizeChange(val) {
      this.limit = val;
      localStorage.setItem("limit", val);
      this.page = 1;
      this.getDatalist();
    },
    handleSelectionChange(val) {
      /** 选中 */
      const arr = [];
      val.map((res) => {
        arr.push(res);
      });
      this.multipleSelection = arr;
    },
    exporte() {
      /** 导出 */
      const date = conversiontime(this.tiem, 3);
      const url = `${exporteurl}${searchexport}?start_time=${
        date.start_time
      }&end_time=${date.end_time}&agent_id=${this.agent_id}&keyword=${
        this.keyword
      }&token=${localStorage.getItem("Token")}`;
      exportFile(url);
    },
    getDatalist() {
      const tiem = conversiontime(this.tiem, 3);
      const data = {
        keyword: this.keyword,
        page: this.page,
        limit: this.limit,
        agent_id: this.agent_id,
        start_time: tiem.start_time,
        end_time: tiem.end_time,
      };
      searchinfo(data).then((res) => {
        if (res.code == 1) {
          this.datalist = res.data.list;
          this.total = res.data.total;
          this.agent = res.agent_map;
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
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

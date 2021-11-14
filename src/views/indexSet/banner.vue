<!-- tsx banner显示  -->
<template>
  <div class="package">
    <div class="hide backtsx">
      <el-button type="primary" size="small" @click="isshowhide(1)">显示</el-button>
      <el-button type="primary" size="small" @click="isshowhide(0)">隐藏</el-button>
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
        placeholder
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
        <el-table-column prop="area_name" label="代理区县" />
        <el-table-column prop="is_show_text" label="显示状态" />
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
import { indexbanner, bannercheck } from "@/api/indexPageSet/isBanner";
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
      agent_id: JSON.parse(localStorage.getItem("user")).agent_id,
      loading: false,
      datalist: [],
      inbound: 2,
      inbound_map: [],
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
      /** 显示隐藏 */
      if (this.multipleSelection.length == 1) {
        MessageBoxs({
          that: this,
          message: `是否确认${is_show == 1 ? "显示" : "隐藏"}？ `,
        }).then((ss) => {
          if (ss == true) {
            bannercheck({ is_show, agent_id: this.multipleSelection[0] }).then(
              (res) => {
                if (res.code == 1) {
                  this.page = 1;
                  this.getDatalist();
                  this.$message.success(res.msg);
                } else {
                  this.$message.error(res.msg);
                }
              }
            );
          }
        });
      } else {
        this.$message.error("请选择一条");
      }
    },

    getDatalist() {
      const that = this;
      const data = {
        agent_id: this.agent_id,
        keyword: this.keyword,
        is_show: this.inbound,
        page: this.page,
        limit: this.limit,
      };
      return new Promise((resolve, reject) => {
        indexbanner(data).then((res) => {
          if (res.code == 1) {
            that.datalist = res.data.list;
            that.total = res.data.total;
            that.inbound_map = res.data.banner_map;
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

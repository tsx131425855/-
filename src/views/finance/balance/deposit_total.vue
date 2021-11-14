<!-- 提现总额 -->
<template>
  <div class="package">
    <div v-if="addto" class="hide hide_title">
           <el-select v-if="options.length>0" v-model="agent_id" class="maright" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <span class="search_toast">日期：</span>

      <el-date-picker
        v-model="search_section"
        style="margin: 0 16px 0 10px;width: 390px"
        type="daterange"
        align="center"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      />
 
      <el-button type="success" @click="querySearch">搜索</el-button>
      <el-button v-if="derive==1" type="warning" @click="exportExcel()">导出</el-button>
      <!-- <el-button type="danger" v-if="cutoff.display==1" @click="del">删除</el-button> -->
    </div>
    <template>
      <el-table
        v-loading="loading"
        :data="dataList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
        <el-table-column align="center" prop="transfer_id" label="序号" width="70" />
        <el-table-column align="center" prop="create_time" label="提现时间" />
        <el-table-column align="center" prop="transfer_sn" label="支付单号" />
        <el-table-column align="center" prop="type" label="交易类型" />
        <el-table-column align="center" prop="amount_yuan" label="金额" />
        <el-table-column align="center" prop="status" label="交易状态" />
        <el-table-column align="center" prop="agent_name" label="代理商" />

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

<script>
// 提现总额
/* eslint-disable */
import { deposit_total, exportDepositTotal } from "@/api/finance";
import { pickerOptions, parseTime } from "@/utils/index";
export default {
  /* eslint-disable */
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      userId: "",
      keyword: "",
      dataList: [],
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      pageSize: 100,
      addto: {},
      cutoff: {},
      edit: {},
      screen_condition: "审核时间" /* 筛选时间段区域条件 */,
      search_section: [] /* 时间区段 */,
      pickerOptions: {
        shortcuts: pickerOptions
      },
      multipleSelection: [] /** 选中 */,
      elsec: 1 /** 1添加还是 0编辑 */,
      dialogVisible: false,
      options: [] /** 所属组 */,
      form: {
        phone: "",
        groups: [],
        status: "1",
        user_id: "",
        admin: ""
      },
      groups_map: "",
      addoredit: "立即创建",
      loading: false,
      derive: "",
      agent_id:
        JSON.parse(localStorage.getItem("user")).agent_id == 1
          ? ""
          : JSON.parse(localStorage.getItem("user")).agent_id,
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    handleCommand(value) {
      this.$data.screen_condition = value;
    },

    handleCurrentChange(val) {
      // 页数
      this.page = val;
      this.getData();
    },
    handleSizeChange(val) {
      this.limit = val;
      this.page = 1;
      this.getData();
    },
    handleSelectionChange(val) {
      /** 选中 */
      this.multipleSelection = val;
    },
    getData() {
      /** 列表数据 */
      this.loading = true;
      const data = {
        user_id: this.userId,
        page: this.page,
        limit: this.limit,
        agent_id: this.agent_id,
        start_date:
          this.search_section && this.search_section[0]
            ? parseTime(this.search_section[0], "{y}-{m}-{d}")
            : "",
        stop_date:
          this.search_section && this.search_section[1]
            ? parseTime(this.search_section[1], "{y}-{m}-{d}")
            : ""
      };
      const that = this;
      return new Promise(() => {
        deposit_total(data).then(res => {
          if (res.code == 1) {
            that.dataList = res.data.list;
            that.total = res.data.total;
            that.loading = false;
            if (res.action) {
              res.action.map(val => {
                if (val.tag == "transferrecordexport" && val.display == 1) {
                  that.derive = 1;
                }
              });
            }
            if (res.agent_map) {
              that.options = res.agent_map;
            }
            
          } else if (res.code == 2) {
            that.$message.error(res.msg);

          } else {
            that.$message.error(res.msg);
            
          }
        });
      });
    },
    exportExcel() {
      this.$confirm("请确认筛选条件是否符合", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$message({
          type: "success",
          message: "开始导出!"
        });
        const data = {
          user_id: this.userId,
          agent_id: this.agent_id,
          type: this.screen_condition,
          start_date:
            this.search_section && this.search_section[0]
              ? parseTime(this.search_section[0], "{y}-{m}-{d}")
              : "",
          stop_date:
            this.search_section && this.search_section[1]
              ? parseTime(this.search_section[1], "{y}-{m}-{d}")
              : ""
        };

        window.open(exportDepositTotal(data));
      });
    },
    handleChange(value) {
      this.groups_map = [value[value.length - 1]];
    },
    querySearch() {
      this.page = 1;
      this.saveData(true);
      this.getData();
    },
    // 从缓存中 存/取 条件数据
    saveData(bool) {
      // 判断浏览器是否支持此功能
      if (!window.sessionStorage) {
        console.log("您的浏览器太老了， 无法兼容此条件保存功能！！");
        return;
      }
      if (bool) {
        // 为true时为保存， 反之取出
        let data =
          JSON.parse(sessionStorage.getItem("deposit_total_condition")) || {};

        data["keyword"] = this.keyword;
        data["search_section"] = this.search_section;
        data["screen_condition"] = this.screen_condition;
        data["url"] = this.$route.fullPath;
        data["agent_id"] = this.agent_id;
        data["options"] = this.options;
        
        // console.log("存储条件 ==》", data);

        sessionStorage.setItem("deposit_total_condition", JSON.stringify(data));
      } else {
        // 取出缓存中的条件数据
        let data = JSON.parse(
          sessionStorage.getItem("deposit_total_condition")
        );
        if (!data) return; // 如果没有缓存， 则直接退出；
        if (data["url"] === this.$route.fullPath) {
          this.keyword = data["keyword"];
          this.search_section = data["search_section"];
          this.screen_condition = data["screen_condition"];
          this.agent_id = data["agent_id"] || '';
          this.options = data["options"] || [];
        }
      }
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.userId = this.$route.query.userId;
    let time = JSON.parse(this.$route.query.time);
    this.search_section[0] = time.start_date;
    this.search_section[1] = time.stop_date;
    this.$route.meta.title = this.$route.query.user_name + " - 提现总额";
    this.saveData();
    this.getData();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
@import "src/styles/hide.scss";

.hide_title {
  .search_toast {
    font-size: 16px;
    margin-right: 8px;
    color: #1e2024;
  }
}
</style>
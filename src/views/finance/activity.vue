<!-- 社区活动 -->
<template>
  <div class="package">
    <div class="hide hide_title">

      <el-select v-if="options.length>0" v-model="agent_id" class="maright" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <el-dropdown @command="handleCondition">
        <el-button type="primary">
          {{ type_show1 && type_show1.text || '请选择' }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in screen_list"
            :key="index"
            :command="item.value"
          >{{ item.text }}</el-dropdown-item>
          <!-- <el-dropdown-item command="订单更新时间">订单更新时间</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
      <el-date-picker
        v-model="search_section"
        style="margin: 0 16px 0 10px;width: 390px"
        type="datetimerange"
        align="center"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      />
      <span class="search_toast" style="margin: 0 12px 0 40px">状态:</span>
      <el-dropdown @command="handleCommand">
        <el-button type="primary">
          {{ type_show2 && type_show2.text || '请选择' }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in condition_list"
            :key="index"
            :command="item.value"
          >{{ item.text }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span class="search_toast"></span>
      <el-input
        v-model="keyword"
        class="input"
        prefix-icon="el-icon-search"
        placeholder="订单编号/用户账号/操作账号"
      />
      <el-button type="success" icon="el-icon-search" @click="page=1; getData()">查询</el-button>
      <el-button v-if="derive==1" type="warning" @click="exportExcel()">导出</el-button>
      <!-- <el-button type="danger" v-if="cutoff.display==1" @click="del">删除</el-button> -->
    </div>

    <template>
      <el-table
        v-loading="loading"
        :data="dataList"
        border
        style="width: 100%"
        fit
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
        <el-table-column fixed type="selection" align="center" width="55" />

        <!-- <el-table-column fixed label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editClick(scope.row)">查看</el-button>
          </template>
        </el-table-column>-->
        <el-table-column align="center" min-width="160" prop="create_time" label="下单日期" />
        <el-table-column fixed align="center" prop="order_sn" width="160" label="订单编号" />
        <el-table-column fixed align="center" prop="user_nickname" label="用户昵称" />
        <el-table-column align="center" prop="user_tel" min-width="110" label="用户账号" />
        <el-table-column align="center" prop="store_name" min-width="100" label="商家名称" />
        <el-table-column align="center" prop="amount" label="订单总金额" />
        <el-table-column align="center" prop="amount_pay" label="微信支出金额" />
        <el-table-column align="center" prop="fee" label="手续费" />
        <el-table-column align="center" prop="balance" label="余额支出金额" />
        <el-table-column align="center" prop="gold_coin" label="金币使用数" />
        <el-table-column align="center" prop="coupon" label="优惠券抵扣金额" />
        <el-table-column align="center" prop="status_text" label="订单状态" />
        <el-table-column align="center" prop="update_time" min-width="160" label="订单更新时间" />
        <el-table-column align="center" prop="is_service" label="是否申请售后" />
        <el-table-column align="center" prop="return_balance" label="退余额" />
        <el-table-column align="center" prop="return_money" label="退微信" />
        <el-table-column align="center" prop="return_fee" label="退手续费" />
        <el-table-column align="center" prop="return_gold_coin" label="退金币" />
        <el-table-column align="center" prop="brokerage" label="平台抽成" />
        <el-table-column align="center" prop="agent_name" label="代理商" />

        <!-- <el-table-column align="center" prop="create_time" label="一级代理商抽成"></el-table-column> -->
        <!-- <el-table-column align="center" prop="create_time" label="二级代理商抽成"></el-table-column> -->
        <!-- <el-table-column align="center" prop="create_time" label="三级代理商抽成"></el-table-column>-->
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
// 提现明细
/* eslint-disable */
import { activity, exportActivity } from "@/api/finance";
import { pickerOptions, parseTime } from "@/utils/index";

/* eslint-disable */
export default {
  /* eslint-disable */
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      keyword: "",
      dataList: [],
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      pageSize: 100,
      addto: {},
      cutoff: {},
      edit: {},
      condition: "", // 时间段筛选条件
      condition_list: [], //  条件列表
      search_section: [] /* 时间区段 */,
      screen_condition: "" /* 筛选状态条件 */,
      screen_list: [] /* 筛选条件列表 */,
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
  computed: {
    /**
     * 根据value获得对应value   -> 第一下拉菜单
     */
    type_show1() {
      let type_index = "";

      this.$data.screen_list.find((item, index) => {
        if (item.value === this.$data.screen_condition) {
          type_index = index;
          return true;
        }
      });
      return this.$data.screen_list[type_index];
    },

    /**
     * 根据value获得对应value   -> 第二下拉菜单
     */
    type_show2() {
      let type_index = "";

      this.$data.condition_list.find((item, index) => {
        if (item.value === this.$data.condition) {
          type_index = index;
          return true;
        }
      });
      return this.$data.condition_list[type_index];
    }
  },
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    handleCondition(val) {
      this.$data.screen_condition = val;
      this.search_section = [];
    },
    handleCommand(value) {
      console.log(value);
      this.$data.condition = value;
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
    // 查看订单详情
    editClick(row) {
      console.log("当前要查看此列的数据");
      console.log(row);
    },
    getData() {
      /** 列表数据 */
      this.loading = true;
      const data = {
        date_type: this.screen_condition,
        status: this.condition,
        keyword: this.keyword,
        page: this.page,
        limit: this.limit,
        agent_id:this.agent_id,
        start_date:
          this.search_section && this.search_section[0]
            ? parseTime(this.search_section[0])
            : "",
        stop_date:
          this.search_section && this.search_section[1]
            ? parseTime(this.search_section[1])
            : ""
      };
      const that = this;
      return new Promise((resolve, reject) => {
        activity(data).then(res => {
          console.log(res);
          that.loading = false;
          if (res.code == 1) {
            that.dataList = res.data.list;
            that.total = res.data.total;
            that.condition_list = res.data.status_map;
            that.screen_list = res.data.date_map;
            if(res.agent_map){
               that.options=res.agent_map
            }
            if (res.action) {
              res.action.map(val => {
                if (val.tag == "export" && val.display == 1) {
                  that.derive = 1;
                }
              });
            }
            
          } else if (res.code == 2) {
            that.$message.error(res.msg);

          } else {
            that.$message.error(res.msg);
            
          }
        });
        resolve();
      }).catch(error => {
        console.log(error);
      });
    },
    exportExcel() {
      const that = this;
      this.$confirm("请确认筛选条件是否符合", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "开始导出!"
          });

          const data = {
            date_type: this.screen_condition,
            status: this.condition,
            keyword: this.keyword,
            agent_id:this.agent_id,
            start_date:
              this.search_section && this.search_section[0]
                ? parseTime(this.search_section[0])
                : "",
            stop_date:
              this.search_section && this.search_section[1]
                ? parseTime(this.search_section[1])
                : ""
          };
          //开启新下载窗口
          window.open(exportActivity(data));
        })
        .catch(res => {
          console.log(res);
        });
    },
    handleChange(value) {
      console.log(value);
      this.groups_map = [value[value.length - 1]];
    },
    querySearch(queryString, cb) {}
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
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
    font-family: "微软雅黑";
    font-size: 18px;
    margin-left: 30px;
    margin-right: 8px;
    color: #1e2024;
  }
}
</style>
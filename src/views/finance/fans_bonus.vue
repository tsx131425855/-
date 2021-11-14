<!-- 粉丝佣金 -->
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
      <span class="search_toast">用户账号/操作账号：</span>
      <el-input
        v-model="keyword"
        class="input"
        prefix-icon="el-icon-search"
        placeholder="用户账号/操作账号"
      />
      <span class="search_toast">时间：</span>
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
        <el-table-column align="center" type="index" label="序号" width="70" />
        <el-table-column align="center" prop="create_time" label="到账时间" />
        <el-table-column align="center" prop="user_nickname" label="昵称" />
        <el-table-column align="center" prop="user_tel" label="用户账号" />
        <el-table-column align="center" prop="num" label="返佣总额" />
        <el-table-column align="center" prop="user_balance" label="余额" />
        <el-table-column align="center" prop="user_gold" label="金币" />
        <el-table-column align="center" prop="midou_money" label="蜜豆抵扣" />
        <el-table-column align="center" prop="table_id" label="订单号" />
        <el-table-column align="center" prop="status" label="交易状态" />
        <!-- <el-table-column prop="update_time" label="更新时间"></el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            size="small"
                            v-if="edit.display==1"
                            @click="editClick(scope.row)"
                        >编辑</el-button>
                    </template>
        </el-table-column>-->
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
// 提现明细
/* eslint-disable */
import { fans_bonus, exportFansBonus } from "@/api/finance";
import { pickerOptions, parseTime } from "@/utils/index";
export default {
  //import引入的组件需要注入到对象中才能使用
  /* eslint-disable */
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
      console.log(value);
      this.$data.screen_condition = value;
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
      /** 列表数据 */
      this.loading = true;
      const data = {
        keyword: this.keyword,
        page: this.page,
        limit: this.limit,
        agent_id:this.agent_id,
        start_time:
          this.search_section && this.search_section[0]
            ? parseTime(this.search_section[0])
            : "",
        end_time:
          this.search_section && this.search_section[1]
            ? parseTime(this.search_section[1])
            : ""
      };
      const that = this;
      return new Promise((resolve, reject) => {
        fans_bonus(data).then(res => {
          if (res.code == 1) {
            that.dataList = res.data.list.list;
            that.total = res.data.list.total;
            that.loading = false;
            if (res.action) {
              res.action.map(val => {
                if (val.tag == "combackexport" && val.display == 1) {
                  that.derive = 1;
                }
              });
            }
             if(res.agent_map){
               that.options=res.agent_map
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
            keyword: this.keyword,
            agent_id:this.agent_id,
            // type: this.screen_condition,
            start_time:
              this.search_section && this.search_section[0]
                ? parseTime(this.search_section[0])
                : "",
            end_time:
              this.search_section && this.search_section[1]
                ? parseTime(this.search_section[1])
                : ""
          };
          //开启新下载窗口
          window.open(exportFansBonus(data));
        })
        .catch(res => {
          console.log(res);
        });
    },
    handleChange(value) {
      console.log(value);
      this.groups_map = [value[value.length - 1]];
    },
    querySearch() {
      this.page = 1;
      this.getData();
      this.saveData(true);
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
          JSON.parse(sessionStorage.getItem("fans_bonus_condition")) || {};

        data["keyword"] = this.keyword;
        data["search_section"] = this.search_section;
        data["screen_condition"] = this.screen_condition;
         data["agent_id"] = this.agent_id || '';
        data["options"] = this.options || [];
        // console.log("存储条件 ==》", data);

        sessionStorage.setItem("fans_bonus_condition", JSON.stringify(data));
      } else {
        // 取出缓存中的条件数据
        let data = JSON.parse(sessionStorage.getItem("fans_bonus_condition"));
        if (!data) return; // 如果没有缓存， 则直接退出；

        this.keyword = data["keyword"];
        this.search_section = data["search_section"];
        this.screen_condition = data["screen_condition"];
        this.agent_id = data["agent_id"] || '';
          this.options = data["options"] || [];
      }
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
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
    font-family: "微软雅黑";
    font-size: 18px;
    margin-left: 30px;
    margin-right: 8px;
    color: #1e2024;
  }
}
</style>
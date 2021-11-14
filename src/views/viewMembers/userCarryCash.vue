<!-- tsx 用户提现 -->
<template>
  <div class="package">
    <div class="hide">
      <el-select
        v-if="statusarr.length>0"
        v-model="status"
        style="margin-bottom: 0px;"
        class="maright"
        placeholder="请选择"
      >
        <el-option v-for="item in statusarr" :key="item.key" :label="item.value" :value="item.key" />
      </el-select>

      <el-date-picker
        v-model="time"
        style="margin-right: 20px;"
        size="small"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-input
        v-model="keyword"
        class="input"
        prefix-icon="el-icon-search"
        placeholder="提现单号/用户账号"
      />
      <el-button type="success" class="maright" @click="page=1,getDatalist()">查询</el-button>
      <el-button type="success" icon="el-icon-printer" @click="exporte">导出</el-button>
    </div>

    <!-- 列表 -->
    <template>
      <el-table v-loading="loading" :data="datalist" border style="width: 100%">
        <el-table-column prop="transfer_sn" label="提现单号" />
        <el-table-column prop="amount" label="提现金额（元）" />
        <el-table-column prop="user_name" label="下单账号" />
        <el-table-column prop="store_name" label="商家" />
        <el-table-column prop="ip" label="提现IP" />
        <el-table-column prop="way" label="提现方式" />
        <el-table-column prop="type" label="提现渠道" />
        <el-table-column prop="status" label="交易状态">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              :disabled="scope.row.status==3?false:true "
              effect="dark"
              :content="scope.row.remark"
              placement="bottom"
            >
              <span>
                {{ scope.row.status_text }}
                <i
                  v-if="scope.row.status==3"
                  style="color: red;"
                  class="el-icon-view"
                />
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="交易时间" />
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status==0"
              type="danger"
              size="small"
              @click="bottonEvent(scope.row,'confirm')"
            >打款</el-button>
            <el-button
              v-if="scope.row.status==0"
              type="warning"
              size="small"
              @click="bottonEvent(scope.row,'reject')"
            >拒绝</el-button>
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
import {
  transferlist,
  actions,
  transferexport
} from "@/api/userAdministration";
import { turnDate, exportFile, exporteurl } from "@/utils/user";
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
      derive: "",
      agent: [],
      agent_id: "0",
      status: "",
      statusarr: [],
      time: []
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
    bottonEvent(row, val) {
      let that = this;
      this.$confirm("确定执行敏感操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return new Promise((resolve, reject) => {
            actions({ sn: row.transfer_sn, act: val }).then(res => {
              if (res.code == 1) {
                that.$message.success(res.msg);
              } else {
                that.$message.error(res.msg);
              }
            });
            resolve();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    exporte() {
      /** 导出 */
      let start_date = "";
      let stop_date = "";
      if (this.time) {
        start_date = this.time[0] ? turnDate(this.time[0], 3) : "";
        stop_date = this.time[1] ? turnDate(this.time[1], 3) : "";
      }
      const url = `${exporteurl}${transferexport}?keyword=${
        this.keyword
      }&status=${
        this.status
      }&start_date=${start_date}&stop_date=${stop_date}&token=${localStorage.getItem(
        "Token"
      )}`;
      exportFile(url);
    },
    getDatalist() {
      let start_date = "";
      let stop_date = "";
      if (this.time) {
        start_date = this.time[0] ? turnDate(this.time[0], 3) : "";
        stop_date = this.time[1] ? turnDate(this.time[1], 3) : "";
      }
      const data = {
        keyword: this.keyword,
        limit: this.limit,
        status: this.status,
        page: this.page,
        start_date,
        stop_date
      };
      this.loading = true;
      let that = this;
      return new Promise((resolve, reject) => {
        transferlist(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            if (res.action) {
              res.action.map(val => {
                switch (val.tag) {
                  case "add":
                    if (val.display == 1) {
                      that.Jurisdiction.add = 1;
                    }
                    break;
                  case "loop_delete":
                    if (val.display == 1) {
                      that.Jurisdiction.loop_delete = 1;
                    }
                    break;
                  case "edit":
                    if (val.display == 1) {
                      that.Jurisdiction.edit = 1;
                    }
                    break;
                  case "copy":
                    if (val.display == 1) {
                      that.Jurisdiction.copy = 1;
                    }
                    break;
                }
              });
            }
            if (res.agent_map) {
              that.agent = res.agent_map;
            }

            that.datalist = res.data.list;
            that.total = res.data.total;
            that.statusarr = res.data.status_map;
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

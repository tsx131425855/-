<!-- tsx 下级结算中心 -->
<template>
  <div class="package">
    <div class="geshi">
      <router-link class="xiaokuai" :to="{path:'/profit',query: {id: 1}}">
        <p class="biaoti">未入账</p>
        <div class="neirong">
          <span>{{summary.to_settle_amount}}</span>
          <span>未确定收货订单总额</span>
        </div>
      </router-link>

      <router-link class="xiaokuai" :to="{path:'/profit',query: {id: 2}}">
        <p class="biaoti">已入帐</p>
        <div class="neirong">
          <span>{{summary.settle_amount}}</span>
          <span>已确认收货打款订单总额</span>
        </div>
      </router-link>

      <!-- <div class="xiaokuai">
        <p class="biaoti">近三个月结算</p>
        <div class="neirong">
          <span>{{summary.settle_sum_2}}</span>
          <span></span>
        </div>
      </div>-->

      <router-link class="xiaokuai" :to="{path:'/profit',query: {id: 3}}">
        <p class="biaoti">已打款</p>
        <div class="neirong">
          <span>{{summary.remit_sum}}</span>
          <span>已打款总额</span>
        </div>
      </router-link>
    </div>

    <div class="hide backtsx">
      <span class>时间筛选</span>
      <!-- <el-select v-model="date_type" size="small" class="gaosizuobian" placeholder="请选择">
        <el-option
          v-for="item in date_typelist"
          :key="item.key"
          :label="item.text"
          :value="item.key"
        />
      </el-select>-->

      <el-date-picker
        style="margin-left: 30px"
        v-model="date_type"
        @change="page=1,getDatalist()"
        type="daterange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      ></el-date-picker>
      <span class="gaosizuobian">所属代理</span>
      <el-select v-model="agent_id" @change="dailis" class="gaosizuobian" placeholder="请选择">
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <span class="gaosizuobian">级别</span>
      <el-select
        v-model="level"
        size="small"
        class="gaosizuobian"
        @change="page=1,getDatalist()"
        placeholder="请选择"
      >
        <el-option v-for="item in levellist" :key="item.key" :label="item.text" :value="item.key" />
      </el-select>
      <div>
        <span class="gaosizuobian">代理区域</span>
        <el-select
          v-model="area"
          size="small"
          @change="page=1,getDatalist()"
          class="gaosizuobian"
          placeholder="请选择"
        >
          <el-option
            v-for="item in area_map"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </div>

      <div>
        <span class="gaosizuobian">状态</span>
        <el-select
          v-model="status"
          size="small"
          @change="page=1,getDatalist()"
          class="gaosizuobian"
          placeholder="请选择"
        >
          <el-option
            v-for="item in statuslist"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </div>

      <!-- <el-input
        v-model="keyword"
        size="small"
        class="input gaosizuobian"
        prefix-icon="el-icon-search"
        placeholder="商品名称/id"
      />-->
      <el-button
        type="primary"
        size="small"
        class="gaosizuobian"
        @click="page=1,getDatalist()"
        icon="el-icon-search"
      >查询</el-button>
      <el-button
        type="success"
        icon="el-icon-printer"
        v-if="agencyCenter.centerexport==1"
        @click="Settlementexporte()"
      >导出</el-button>
    </div>

    <div class="jieusnadaochu">
      <div>
        <span>已入账总额：{{summary.settle_amount}}</span>
        <el-button
          type="success"
          icon="el-icon-printer"
          v-if="agencyCenter.orderexport==1"
          @click="Orderexporte(3,1)"
        >导出商品订单</el-button>
        <el-button
          type="success"
          icon="el-icon-printer"
          v-if="agencyCenter.orderexport==1"
          @click="Orderexporte(2,1)"
        >导出外卖订单</el-button>
        <el-button
          type="success"
          icon="el-icon-printer"
          v-if="agencyCenter.orderexport==1"
          @click="Orderexporte(1,1)"
        >导出自营商品订单</el-button>
      </div>
      <el-button type="warning" @click="Money(1)">打款</el-button>
    </div>

    <template>
      <el-table
        v-loading="loading"
        :data="datalist"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @sort-change="sortfn"
        ref="multipleTable"
      >
        <el-table-column fixed type="selection" width="55" prop="product_category_id" />
        <el-table-column prop="data_id" label="ID" sortable />
        <el-table-column prop="name" label="代理名称" />
        <el-table-column prop="level" label="级别" />
        <el-table-column prop="area" label="代理区域" />
        <el-table-column prop="income1" label="自营商品订单提成收益" />
        <el-table-column prop="income2" label="外卖订单提成收益" />
        <el-table-column prop="income3" label="平台商品提成收益" />
        <el-table-column prop="samount" label="收益合计" sortable />
        <el-table-column v-if="agentuid==0" prop="fee" label="手续费" />
        <el-table-column v-if="agentuid==0" prop="real" label="实际收入" />
        <el-table-column prop="account" label="结算账户" />
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              v-if="agencyCenter.orderexport==1"
              @click="Orderexporte(1,2,scope.row)"
            >导出商品订单</el-button>
            <el-button
              type="text"
              size="small"
              v-if="agencyCenter.orderexport==1"
              @click="Orderexporte(3,2,scope.row)"
            >导出平台商品订单</el-button>
            <el-button
              type="text"
              size="small"
              v-if="agencyCenter.orderexport==1"
              @click="Orderexporte(2,2,scope.row)"
            >导出外卖订单</el-button>
            <el-button
              type="text"
              size="small"
              v-if="status==1"
              @click="MakeMoney(scope.row.data_id,scope.row.level_id)"
            >查看打款记录</el-button>
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

    <el-dialog
      title="打款"
      :visible.sync="money"
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleClose"
    >
      <template>
        <el-table :data="multipleSelection" border style="width: 100%">
          <el-table-column prop="data_id" label="ID" />
          <el-table-column prop="name" label="代理名称" />
          <el-table-column prop="level" label="级别" />
          <el-table-column prop="area" label="代理区域" />
          <el-table-column prop="income1" label="自营商品订单提成收益" />
          <el-table-column prop="income2" label="外卖订单提成收益" />
          <el-table-column prop="income3" label="平台商品提成收益" />
          <el-table-column prop="samount" label="收益合计" />
          <el-table-column prop="account" label="结算账户" />
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-delete" @click="deleteMakeMoney(scope)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <el-button type="primary" style="margin-top: 10px;" @click="Money(2)">打款</el-button>
    </el-dialog>

    <el-dialog
      title="打款记录"
      :visible.sync="dialogVisible"
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="zhaozi" v-for="(item,index) in remitLog" :key="index">
        <div class="tiazi">
          <div class="chuzi">
            <span>{{item.admin_name}}</span>
            <span>{{item.create_time}}</span>
          </div>
          <div class="lizi">
            <span>打款总额{{item.amount}}</span>
            <span>{{item.bank_number}}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  center,
  centerexport,
  orderexport,
  centerremit,
  centerremitlog
} from "@/api/agent";
import { exporteurl, turnDate, exportFile } from "@/utils/user";
import { pickerOptions } from "@/utils/index";
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
      agent_id: "0",
      level: 0,
      levellist: [],
      dialogVisible: false,
      date_type: [
        new Date(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      status: 0,
      statuslist: [],
      order: "ASC",
      sort: "data_id",
      date_typelist: [],
      subordinate: {},
      summary: {},
      agencyCenter: {},
      pickerOptions: {
        shortcuts: pickerOptions
      },
      money: false,
      remitLog: [],
      area: 0,
      area_map: [],
      agentuid: JSON.parse(localStorage.getItem("user")).role
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
      const arr = [];
      val.map(res => {
        arr.push(res);
      });
      this.multipleSelection = arr;
    },
    deleteMakeMoney(val) {
      console.log(val);
      this.multipleSelection.splice(val.$index, 1);
    },
    handleClose(done) {
      this.$refs.multipleTable.clearSelection();
      done();
    },
    dailis() {
      this.level = 0;
      this.area = 0;
      this.page = 1;
      this.getDatalist();
    },
    Money(val) {
      const that = this;
      if (this.multipleSelection.length == 0) {
        this.$message.error("请选择一条");
        return;
      }
      if (val == 1) {
        this.money = true;
      } else {
        const level_data_id = [];
        this.multipleSelection.map(res => {
          console.log(res);
          level_data_id.push(res.level_id + "&" + res.data_id);
        });
        const data = {
          start_date: turnDate(this.date_type[0], 1),
          stop_date: turnDate(this.date_type[1], 1),
          level_data_id: level_data_id
        };

        this.$confirm(
          "请确认打款金额是否正确，打款成功后不可撤回，请谨慎操作者 ",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            centerremit(data).then(res => {
              console.log(res);
              if (res.code == 1) {
                that.money = false;
                that.page == 1;
                that.getDatalist();
                that.$message.success(res.msg);
                that.$refs.multipleTable.clearSelection();
              } else if (res.code == 2) {
                that.$message.error(res.msg);
              } else {
                that.$message.error(res.msg);
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      }
    },
    MakeMoney(data_id, level) {
      centerremitlog({ data_id, level }).then(res => {
        console.log(res);
        if (res.code == 1) {
          this.remitLog = res.data.list;
          this.dialogVisible = true;
        } else if (res.code == 2) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    Orderexporte(val, val1, row) {
      /** 导出 */
      const level = val1 == 2 ? parseInt(row.level_id) : parseInt(this.level);
      const data_id = val1 == 2 ? row.data_id : "";
      let start_date = "";
      let stop_date = "";
      if (this.date_type[0] instanceof Date) {
        start_date = turnDate(this.date_type[0], 1);
      } else start_date = this.date_type[0];
      if (this.date_type[1] instanceof Date) {
        stop_date = turnDate(this.date_type[1], 1);
      } else stop_date = this.date_type[1];
      const url = `${exporteurl}${orderexport}?keyword=${
        this.keyword
      }&data_id=${data_id}&level=${level}&status=${
        this.status
      }&order_type=${val}&start_date=${start_date}&stop_date=${stop_date}&token=${localStorage.getItem(
        "Token"
      )}`;
      exportFile(url);
    },
    Settlementexporte() {
      /** 导出 */
      let start_date = "";
      let stop_date = "";
      if (this.date_type[0] instanceof Date)
        start_date = turnDate(this.date_type[0], 1);
      else start_date = this.date_type[0];
      if (this.date_type[1] instanceof Date)
        stop_date = turnDate(this.date_type[1], 1);
      else stop_date = this.date_type[1];
      const url = `${exporteurl}${centerexport}?keyword=${
        this.keyword
      }&status=${this.status}&agent_id=${this.agent_id}&level=${
        this.level
      }&start_date=${start_date}&stop_date=${stop_date}&token=${localStorage.getItem(
        "Token"
      )}`;
      exportFile(url);
    },
    sortfn(val) {
      if (val.order == "ascending") {
        // 上
        this.order = "ASC";
      } else if (val.order == "descending") {
        // 下
        this.order = "DESC";
      }
      if (val.prop == "data_id") {
        this.sort = "data_id";
      } else if (val.prop == "samount") {
        this.sort = "samount";
      }
      this.page == 1;
      this.getDatalist();
    },
    getDatalist() {
      const that = this;
      let start_date = "";
      let stop_date = "";
      if (this.date_type[0] instanceof Date) {
        start_date = turnDate(this.date_type[0], 1);
      } else start_date = this.date_type[0];
      if (this.date_type[1] instanceof Date) {
        stop_date = turnDate(this.date_type[1], 1);
      } else stop_date = this.date_type[1];
      const data = {
        keyword: this.keyword,
        level: this.level,
        status: this.status,
        start_date,
        stop_date,
        sort: this.sort,
        order: this.order,
        page: this.page,
        area: this.area,
        limit: this.limit,
        agent_id: this.agent_id
      };
      return new Promise((resolve, reject) => {
        center(data).then(res => {
          console.log(res);
          if (res.code == 1) {
            if (res.action) {
              res.action.map(val => {
                switch (val.tag) {
                  case "centerexport":
                    if (val.display == 1) {
                      that.agencyCenter.centerexport = 1;
                    }
                    break;
                  case "orderexport":
                    if (val.display == 1) {
                      that.agencyCenter.orderexport = 1;
                    }
                    break;
                  default:
                    break;
                }
              });
            }
            if (res.agent_map) {
              that.agent = res.agent_map;
            }
            that.datalist = res.data.list;
            that.total = res.data.total;
            that.summary = res.data.summary;
            that.statuslist = res.data.status_map;
            that.levellist = res.data.level;
            that.date_typelist = res.data.date_type;
            that.area_map = res.data.area_map;
            // console.log(that.levellist);
          } else if (res.code == 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
        });
        // resolve();
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
.geshi {
  width: 100%;
  display: flex;
  // align-items: center;
  justify-content: space-between;
  height: 100px;
  .xiaokuai {
    width: 280px;
    height: 80px;
    border-radius: 15px;
    background-color: rgb(211, 218, 230);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    padding: 10px;
    .biaoti {
      margin: 0;
    }
    .neirong {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      span:first-child {
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
}
.jieusnadaochu {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > span {
    margin-right: 20px;
  }
}
.zhaozi {
  width: 100%;
  background-color: #ffffff;
  border-top: 1px solid rgb(193, 193, 193);
  border-left: 1px solid rgb(193, 193, 193);
  border-right: 1px solid rgb(193, 193, 193);
  .chuzi {
    border-bottom: 1px solid rgb(193, 193, 193);
    height: 30px;
    line-height: 30px;
    display: flex;
    span {
      padding-left: 10px;
      width: 50%;
    }
  }
  .lizi {
    border-bottom: 1px solid rgb(193, 193, 193);
    height: 50px;
    line-height: 50px;
    display: flex;
    span {
      width: 50%;
      padding-left: 10px;
      display: inline-block;
    }
  }
}
</style>

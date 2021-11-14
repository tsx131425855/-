<!-- tsx 返佣编辑页 -->
<template>
  <div class="package">
    <div class="hide backtsx">
      <el-button
        type="success"
        :disabled="is_edit"
        size="small"
        icon="el-icon-circle-plus"
        @click="commit"
      >保存</el-button>
      <el-button type="info" size="small" @click="fanhui">返回</el-button>
    </div>
    <div v-if="base_info" class="hide hideinfo">
      <span>用户id：{{base_info.user_id}}</span>
      <span>会员昵称：{{base_info.nickname}}</span>
      <!-- <span>会员姓名：{{base_info.username}}</span> -->
      <span>粉丝数：{{base_info.fans_num}}</span>
      <span>会员手机：{{base_info.username}}</span>
    </div>
    <!-- 信息编辑  -->
    <div v-for="(tiem,index) in rebate_data" :key="index" class="editinfo">
      <p>
        <span>返佣信息{{index+1}} &nbsp; &nbsp; {{tiem.status_text}}</span>
        <el-button v-if="tiem.status==3" type="text" size="small" @click="delinfo(index,tiem)">删除</el-button>
      </p>
      <el-form ref="form" :model="form" :disabled="is_edit" label-width="80px">
        <el-form-item label="代理商" :required="true">
          <span>{{tiem.agent_name}}</span>
        </el-form-item>

        <el-form-item label="商品订单" prop="product_name">
          <el-input-number
            v-if="tiem.status==3"
            v-model="tiem.product_percent"
            :min="0"
            controls-position="right"
            placeholder="单行输入"
          />
          <span v-if="tiem.status!=3">{{tiem.product_percent}}</span>%
        </el-form-item>
        <el-form-item label="分销订单" prop="product_name">
          <el-input-number
            v-if="tiem.status==3"
            v-model="tiem.order_percent"
            :min="0"
            controls-position="right"
            placeholder="单行输入"
          />
          <span v-if="tiem.status!=3">{{tiem.order_percent}}</span>%
        </el-form-item>
        <el-form-item label="外卖订单" prop="product_name">
          <el-input-number
            v-if="tiem.status==3"
            v-model="tiem.take_out_percent"
            :min="0"
            controls-position="right"
            placeholder="单行输入"
          />
          <span v-if="tiem.status!=3">{{tiem.take_out_percent}}</span>%
        </el-form-item>
      </el-form>
    </div>
    <!-- 粉丝列表 -->
    <div class="hide backtsx">
      <!-- <span>代理商</span>
      <el-select v-model="agent_id" class="maright" placeholder="请选择代理商">
        <el-option
          v-for="item in agent_map"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>-->
      <span>粉丝明细</span>
      <el-select v-model="status" class="maright" placeholder="请选择">
        <el-option
          v-for="item in status_map"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <el-input
        v-model="keyword"
        class="input"
        prefix-icon="el-icon-search"
        placeholder="会员昵称/会员手机号"
      />
      <el-button type="primary" class icon="el-icon-search" @click="page=1,FansList()">查询</el-button>
      <el-button v-if="white.fansshift==1" type="info" size="small" @click="transfer">粉丝转移</el-button>
      <el-button v-if="white.fansclear==1" type="info" size="small" @click="release()">粉丝释放</el-button>
    </div>

    <template>
      <el-table
        v-loading="loading"
        :data="datalist"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          fixed
          type="selection"
          row-key="property_id"
          width="55"
          prop="property_id"
        />
        <el-table-column prop="lock_time" label="绑定粉丝时间" width="170" />
        <el-table-column prop="user_id" label="粉丝id" />
        <el-table-column prop="user_nickname" label="粉丝昵称" />
        <el-table-column prop="user_tel" label="粉丝手机" />
        <el-table-column prop="invalid_time" label="粉丝失效时间" width="170" />
        <el-table-column prop="v_days" label="剩余锁粉期" />
        <el-table-column prop="i_days" label="已失效天数" />
        <el-table-column prop="order_amount" label="累计订单金额" />
        <el-table-column prop="order_count" label="累积订单数" />
        <el-table-column prop="order_income" label="累积贡献收益" />
        <el-table-column prop="o_status" label="状态" />
        <el-table-column prop="identity_name" label="会员身份" />
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

    <!-- 粉丝订单 -->
    <div class="hide backtsx" style="margin-top: 20px;">
      <span>代理商</span>
      <el-select v-model="agent_id" class="maright" placeholder="请选择代理商">
        <el-option
          v-for="item in agent_map"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <span>订单类型</span>
      <el-select v-model="type" class="maright" placeholder="请选择">
        <el-option
          v-for="item in order_type_map"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <span>冻结状态</span>
      <el-select v-model="rebate_status" class="maright" placeholder="请选择">
        <el-option
          v-for="item in rebate_status_map"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <span>时间筛选：</span>
      <el-date-picker
        v-model="date_type"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        class="maright"
      />
      <el-input v-model="keywords" class="input" prefix-icon="el-icon-search" placeholder="订单编号" />
      <el-button type="primary" class icon="el-icon-search" @click="pages=1,FansOrder()">查询</el-button>
      <el-button type="info" size="small" @click="Reset()">重置</el-button>
      <el-button v-if="white.fansorderexport==1" type="info" size="small" @click="exporte()">导出</el-button>
    </div>

    <div style="margin-bottom: 20px;" class="hideinfo">
      <span>粉丝返佣总额：{{sum.all}}</span>
      <span>商品订单返佣：{{sum.sp}}</span>
      <span>外卖订单返佣：{{sum.wm}}</span>
      <span>分销订单返佣：{{sum.fx}}</span>
    </div>

    <template>
      <el-table v-loading="loading" :data="datalists" border style="width: 100%">
        <el-table-column prop="order_type" label="订单类型" />
        <el-table-column prop="agent_name" label="所属代理商" />
        <el-table-column prop="order_sn" label="订单号" />
        <el-table-column prop="user_tel" label="用户账号" />
        <el-table-column prop="user_nickname" label="用户昵称" />
        <el-table-column prop="amount" label="订单总额" />
        <el-table-column prop="rebate" label="粉丝返佣" />
        <el-table-column prop="order_status" label="订单状态" />
        <el-table-column prop="rebate_status" label="佣金状态" />
        <el-table-column prop="create_time" label="下单时间" />
      </el-table>
    </template>
    <div class="block">
      <el-pagination
        :current-page="pages"
        :page-sizes="[10, 20, 30, 40,50]"
        :page-size="limits"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totals"
        @size-change="handleSizeChanges"
        @current-change="handleCurrentChanges"
      />
    </div>

    <PublicDialog
      v-if="dialogVisible"
      :isShowVisible="dialogVisible"
      tsxTitle="粉丝转移"
      tsxWidth="600px"
      @handleClose="handleClose"
    >
      <div slot="forms">
        <span>会员</span>
        <el-input v-model="vip" class="input" :maxlength="11" placeholder="单行输入" />
        <div style="margin-top: 20px;">
          <el-button size="small" @click="dialogVisible=false">取消</el-button>
          <el-button type="primary" size="small" @click="committransfer">确定</el-button>
        </div>
      </div>
    </PublicDialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  whiteFanslist,
  whiteFansshift,
  whiteFansclear,
  whiteEdit,
  fansorderexport,
  whiteFansorder,
  whiteView,
  whiteDel
} from "@/api/membersBoon";
import { exporteurl, turnDate, exportFile } from "@/utils/user";
import { pickerOptions } from "@/utils/index";
import PublicDialog from "@/components/PublicDialog";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { PublicDialog },
  data() {
    // 这里存放数据
    return {
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      keyword: "",
      datalist: [],
      multipleSelection: [],
      agent_id: "0",
      agent_map: [],
      dialogVisible: false,
      loading: false,
      status: "1",
      status_map: [],
      form: {},
      base_info: {},
      rebate_data: [],
      date_type: [],
      pickerOptions: {
        shortcuts: pickerOptions
      },
      keywords: "",
      limits: parseInt(localStorage.getItem("limit")) || 10,
      totals: 0,
      pages: 1,
      order_type_map: [],
      rebate_status_map: [],
      rebate_status: "",
      type: "",
      sum: {},
      datalists: [],
      vip: "",
      is_edit: true /** 编辑还是查看 */,
      white: {}
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
      this.FansList();
    },
    handleSizeChange(val) {
      this.limit = val;
      console.log(`每页 ${val} 条`);
      localStorage.setItem("limit", val);
      this.page = 1;
      this.FansList();
    },
    handleSelectionChange(val) {
      /** 选中 */
      let arr = [];
      val.map(res => {
        arr.push(res);
      });
      this.multipleSelection = arr;
    },
    handleCurrentChanges(val) {
      // 页数
      this.pages = val;
      console.log(`当前页: ${val}`);
      this.FansOrder();
    },
    handleSizeChanges(val) {
      this.limits = val;
      console.log(`每页 ${val} 条`);
      localStorage.setItem("limit", val);
      this.pages = 1;
      this.FansOrder();
    },
    handleClose() {
      this.dialogVisible = false;
    },
    fanhui() {
      this.$router.back(-1);
    },
    commit() {
      whiteEdit(this.rebate_data).then(res => {
        if (res.code == 1) {
          this.getData(this.$route.query.white_id);
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    transfer() {
      if (this.multipleSelection.length > 0) {
        this.dialogVisible = true;
        this.vip = "";
      } else {
        this.$message("请选择一条");
      }
    },
    Reset() {
      this.date_type = [];
      this.keywords = "";
      this.agent_id = "0";
      this.pages = 1;
      (this.type = ""), (this.rebate_status = ""), this.FansOrder();
    },
    delinfo(index, val) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.rebate_data.splice(index, 1);
          whiteDel({ white_id: [val.white_id] }).then(res => {
            if (res.code == 1) {
              if (this.rebate_data.length > 0) {
                this.getData(this.$route.query.white_id);
              } else {
                this.$router.back(-1);
              }
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    committransfer() {
      this.$confirm("此操作将转移粉丝, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const fans_user_ids = [];
          this.multipleSelection.map(res => {
            fans_user_ids.push(res.user_id);
          });
          const data = {
            top_user_id: this.base_info.user_id,
            to_user_id: this.vip,
            fans_user_ids
          };
          whiteFansshift(data).then(res => {
            if (res.code == 1) {
              this.page = 1;
              this.FansList();
              this.dialogVisible = false;
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    release() {
      if (this.multipleSelection.length > 0) {
        this.$confirm("此操作将释放粉丝, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            const fans_user_ids = [];
            this.multipleSelection.map(res => {
              fans_user_ids.push(res.user_id);
            });
            const data = {
              top_user_id: this.base_info.user_id,
              fans_user_ids
            };
            whiteFansclear(data).then(res => {
              if (res.code == 1) {
                this.page = 1;
                this.FansList();
                this.$message.success(res.msg);
              } else {
                this.$message.error(res.msg);
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      } else {
        this.$message("请选择一条");
      }
    },
    exporte() {
      /** 导出 */
      let start_date = "";
      let stop_date = "";
      if (this.date_type.length > 0) {
        if (this.date_type[0] instanceof Date) {
          start_date = turnDate(this.date_type[0], 1);
        } else start_date = this.date_type[0];
        if (this.date_type[1] instanceof Date) {
          stop_date = turnDate(this.date_type[1], 1);
        } else stop_date = this.date_type[1];
      }
      const url = `${exporteurl}${fansorderexport}?keyword=${
        this.keywords
      }&agent_id=${this.agent_id}&type=${this.type}&rebate_status=${
        this.rebate_status
      }&top_user_id=${
        this.base_info.user_id
      }&start_date=${start_date}&stop_date=${stop_date}&is_recommend=${stop_date}&token=${localStorage.getItem(
        "Token"
      )}`;
      exportFile(url);
    },
    getData(val) {
      /** info  数据 */
      const that = this;
      whiteView({ white_id: val }).then(res => {
        if (res.code == 1) {
          this.base_info = res.data.base_info;
          this.rebate_data = res.data.rebate_data;
          this.FansList();
          this.FansOrder();

          if (res.action) {
            res.action.map(val => {
              switch (val.tag) {
                case "fansshift":
                  if (val.display == 1) {
                    that.white.fansshift = 1;
                  }
                  break;
                case "fansclear":
                  if (val.display == 1) {
                    that.white.fansclear = 1;
                  }
                  break;
                case "fansorderexport":
                  if (val.display == 1) {
                    that.white.fansorderexport = 1;
                  }
                  break;
              }
            });
            res.action.map(val => {
              if (val.tag == "orderexport" && val.display == 1) {
                that.derive = 1;
              }
            });
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    FansOrder() {
      /** 粉丝订单列表 */

      let start_date = "";
      let stop_date = "";
      if (this.date_type.length > 0) {
        if (this.date_type[0] instanceof Date) {
          start_date = turnDate(this.date_type[0], 4);
        } else start_date = this.date_type[0];
        if (this.date_type[1] instanceof Date) {
          stop_date = turnDate(this.date_type[1], 4);
        } else stop_date = this.date_type[1];
      }

      const data = {
        keyword: this.keywords,
        agent_id: this.agent_id,
        top_user_id: this.base_info.user_id,
        page: this.pages,
        limit: this.limits,
        type: this.type,
        rebate_status: this.rebate_status,
        start_date,
        stop_date
      };
      whiteFansorder(data).then(res => {
        if (res.code == 1) {
          this.datalists = res.data.list;
          this.totals = res.data.total;
          this.order_type_map = res.data.order_type_map;
          this.rebate_status_map = res.data.rebate_status_map;
          this.sum = res.data.sum;
          if (res.agent_map) {
            this.agent_map = res.agent_map;
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    FansList() {
      /** 粉丝列表 */
      const data = {
        keyword: this.keyword,
        e_status: this.status,
        top_user_id: this.base_info.user_id,
        page: this.page,
        limit: this.limit
      };
      whiteFanslist(data).then(res => {
        if (res.code == 1) {
          this.status_map = res.data.list.status_map;
          this.datalist = res.data.list.list;
          this.total = res.data.list.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getDatalist() {}
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    if (this.$route.query && this.$route.query.white_id) {
      this.getData(this.$route.query.white_id);
      this.is_edit = this.$route.query.type == 0 ? true : false;
    }
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
.editinfo {
  width: 100%;
  background-color: #fff;
  padding-bottom: 10px;
  margin-bottom: 20px;
  p {
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }
}
.hideinfo {
  span {
    margin-right: 20px;
    display: inline-block;
  }
}
.backtsx {
  span {
    margin-right: 10px;
  }
}
</style>

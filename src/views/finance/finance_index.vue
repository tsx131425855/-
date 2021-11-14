<!-- 财务统计总账首页 -->
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
      <span class="search_toast" style="margin: 0 12px 0 40px">订单状态:</span>
      <!-- <el-dropdown @command="handleCommand">
        <el-button type="primary">
          {{ type_show2 && type_show2.text || '请选择' }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in condition_list"
            :key="index"
            :command="item.value"
          >{{ item.text }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->

      <el-select v-model="status" placeholder="请选择">
        <el-option
          v-for="item in condition_list"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <span class="search_toast" style="margin: 0 12px 0 40px">日期:</span>

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

      <el-button type="success" icon="el-icon-search" @click="getData(),page=1">查询</el-button>
      <el-button v-if="derive==1" type="warning" @click="exportExcel()">导出</el-button>
      <!-- <el-button type="danger" v-if="cutoff.display==1" @click="del">删除</el-button> -->
    </div>
    <div class="main">
      <div class="mian-top">
        <div class="balance">
          <div class="top">
            <div>
              <span>就呢度账户总额:</span>
              <span style="font-size: 32px; font-weight: bold; margin-left: 20px">{{ dataList.balance_total }}元</span>
            </div>
            <div class="explain">* 账户总额 = 可提现余额 + 冻结余额</div>
          </div>
          <div class="bottom">
            <div>
              <span>可提现余额:</span>
              <span>{{ dataList.balance_tx_amount }}元</span>
            </div>
            <div>
              <span>冻结余额:</span>
              <span>{{ dataList.balance_dj_amount }}元</span>
            </div>
          </div>
        </div>
        <div class="gold">
          <div class="top">
            <div>
              <span>就呢度金币总额:</span>
              <span style="font-size: 32px; font-weight: bold; margin-left: 20px">{{ dataList.gold_total }}元</span>
            </div>
            <div class="explain">* 金币总额 = 可使用金币 + 冻结金币</div>
          </div>
          <div class="bottom">
            <div>
              <span>可使用金币:</span>
              <b>{{ dataList.gold_use_amount }}个</b>
            </div>
            <div>
              <span>冻结金币:</span>
              <b>{{ dataList.gold_dj_amount }}个</b>
            </div>
          </div>
        </div>
      </div>
      <div class="main-center">
        <div class="top">
          <div>
            <span>销售总额:</span>
            <span style="font-size: 32px; font-weight: bold; margin-left: 50px">{{ dataList.sale_total }}元</span>
          </div>
          <div class="explain">* 销售总额( 不含手续费 ) = 余额支付总额 + 微信支付总额 + 会员优惠总额 + 金币抵扣余额 + 优惠券优惠总额 - 退款总额</div>
        </div>
        <div class="bottom">
          <div class="item">
            <span>
              余额支付总额:
              <span class="price">
                <b>{{ dataList.balance_pay_total }}</b>元
              </span>
            </span>
            <span>
              微信支付总额:
              <span class="price">
                <b>{{ dataList.wxpay_total }}</b>元
              </span>

              <span class="explain">( 手续费: {{ dataList.wxpay_process_money }} 元 )</span>
            </span>
            <span />
          </div>
          <div class="item">
            <span>
              余额退款总额:
              <span class="price">
                <b>{{ dataList.balance_tk_toal }}</b>元
              </span>
            </span>
            <span>
              微信退款总额:
              <span class="price">
                <b>{{ dataList.wxpay_tk_total }}</b>元
              </span>
              <span class="explain">( 手续费: {{ dataList.wxpay_tk_process_money }} 元 )</span>
            </span>
            <span />
          </div>
          <div class="item">
            <span>
              会员优惠总额:
              <span class="price">
                <b>{{ dataList.member_dis_total }}</b>元
              </span>
            </span>
            <span>
              金币抵扣总额:
              <span class="price">
                <b>{{ dataList.gold_coin_total }}</b>元
              </span>
              <!-- <span class="explain">( 手续费: {{dataList.wxpay_total}} 元 )</span> -->
            </span>
            <span>
              优惠劵优惠总额:
              <span class="price">
                <b>{{ dataList.coupon_dis_total }}</b>元
              </span>
            </span>
          </div>
        </div>
      </div>
      <div class="main-bottom">
        <div class="item">
          <span class="title">提现总额:</span>
          <span class="money">{{ dataList.wxpay_total }}元</span>
          <span class="explain">* 提现总额 = 后台已通过提现审核的金额汇总</span>
        </div>
        <div class="item" style="background-color:#fff">
          <!-- <span class="title">提现总额:</span>
          <span class="money">{{ dataList.wxpay_total }}元</span>
          <span class="explain">* 提现总额 = 后台已通过提现审核的金额汇总</span> -->
        </div>
        <div class="item">
          <span class="title">平台分红:</span>
          <span class="money">{{ dataList.tx_total }}元</span>
          <span class="explain">* 平台分红 = 用户每日登录奖励</span>
        </div>
        <div class="item">
          <span class="title">自提点分成:</span>
          <span class="money">{{ dataList.pt_bonus_total }}元</span>
          <span class="explain">* 自提点收益 = 自提点的提货分成</span>
        </div>
        <div class="item">
          <span class="title">粉丝佣金:</span>
          <span class="money">{{ dataList.fans_amount }}元</span>
          <span class="explain">* 粉丝佣金 = 下线一级粉丝返佣余额 + 返佣金币</span>
        </div>
        <div class="item">
          <span class="title">平台抽成:</span>
          <span class="money">{{ dataList.pt_amount }}元</span>
          <span class="explain">* 平台抽成 = 服务类, 优惠买单抽成</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 提现明细
/* eslint-disable */
import { caiwu, cwexport } from "@/api/finance";
import { pickerOptions, parseTime } from "@/utils/index";
import { turnDate } from "@/utils/user";
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
      status:"1",
      condition_list: [
        {value:"1",label:"已完成"},
         {value:"2",label:"未完成"},
          {value:"3",label:"全部"},
        ], //  条件列表
      search_section: [] /* 时间区段 */,
      screen_condition: "1" /* 筛选状态条件 */,
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
    // type_show2() {
    //   let type_index = "";

    //   this.$data.condition_list.find((item, index) => {
    //     if (item.value === this.$data.condition) {
    //       type_index = index;
    //       return true;
    //     }
    //   });
    //   return this.$data.condition_list[type_index];
    // }
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
        agent_id:this.agent_id,
        status: this.status,
        start_time:turnDate(this.search_section[0],"1"),
        end_time:turnDate(this.search_section[1],"1")
      };
      const that = this;
      return new Promise((resolve, reject) => {
        caiwu(data).then(res => {
          console.log(res);
          if (res.code == 1) {
            that.dataList = res.data.list;
            that.loading = false;
            if (res.action) {
              res.action.map(val => {
                if (val.tag == "cwexport" && val.display == 1) {
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
             agent_id:this.agent_id,
            status: this.status,
            start_time:turnDate(this.search_section[0],"1"),
            end_time:turnDate(this.search_section[1],"1")
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
.main {
  padding: 40px;
  font-size: 16px;
  background-color: #fff;
  .explain {
    color: slategray !important;
    font-size: 14px !important;
  }
  .price {
    font-size: 18px;
    margin-left: 40px;
  }
  .mian-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div {
      width: 48%;
      height: 160px;
      background-color: aquamarine;
      border: 1px solid #666;
      display: flex;
      flex-direction: column;
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 25px 35px;
        border-bottom: 1px solid #666;
        background-color: #f5f5f5;
        div {
          display: flex;
          align-items: center;
        }
      }
      .bottom {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-around;
        background-color: #fff;
      }
    }
  }
  .main-center {
    margin: 30px 0;
    background-color: #f5f5f5;
    border: 1px solid #666;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 35px;
      border-bottom: 1px solid #666;
      div {
        display: flex;
        align-items: center;
      }
    }
    .bottom {
      padding: 20px 0;
      background-color: #fff;
      .item {
        margin: 40px 25px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        > span {
          flex: 1;
        }
      }
    }
  }
  .main-bottom {
    display: flex;
    flex-wrap: wrap;
    .item {
      margin-bottom: 30px;
      margin-right: 30px;
      width: 660px;
      display: flex;
      justify-content: space-between;
      text-align: left;
      padding: 20px;
      box-sizing: border-box;
      background-color: #f5f5f5;
      align-items: center;
      > span:last-child {
        text-align: right;
      }
      .title {
        flex: 1.5;
      }
      .money {
        flex: 3;
        font-size: 32px;
        font-weight: bold;
        color: rgb(35, 35, 185);
      }
      .explain {
        flex: 4.5;
      }
    }
  }
}
</style>
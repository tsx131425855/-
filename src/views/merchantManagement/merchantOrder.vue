<!-- tsx商家订单列表 -->
<template>
  <div class="package">
    <div class="hide" style="align-items: center;">
      <span style="margin-right: 10px;">代理商</span>
      <el-select
        class="ubbuout"
        v-if="agent.length>0"
        v-model="agent_id"
        placeholder="请选择"
        size="mini"
      >
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <span style="margin-right: 10px;">订单类型：</span>
      <el-select v-model="order_type" class="ubbuout" size="mini" placeholder="订单类型">
        <el-option
          v-for="item in order_types"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <span style="margin-right: 10px;">状态：</span>
      <el-select v-model="condition" class="ubbuout" size="mini" placeholder="订单状态">
        <el-option v-for="item in options" :key="item.key" :label="item.value" :value="item.key" />
      </el-select>
      <el-select v-model="date_type" class="ubbuout" size="mini" placeholder="时间选择">
        <el-option
          v-for="item in date_types"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <el-date-picker
        style="margin-right: 20px;"
        size="mini"
        v-model="time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="startend"
      />
      <el-input
        size="mini"
        v-model="keyword"
        class="input ubbuout"
        prefix-icon="el-icon-search"
        placeholder="商家名称/账号/下单账号/乡镇地区"
        @change="inputentry"
      />
      <el-button type="success" size="small " @click="page=1,getData()">查询</el-button>
      <el-button v-if="derive==1" size="small " plain @click="exporte">导出</el-button>
    </div>

    <template>
      <el-table
        v-loading="loading"
        :data="dataList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55" />
        <!-- <el-table-column prop="order_id" label="订单ID" width="80" /> -->
        <el-table-column prop="order_sn" label="订单号" width="160" />
        <el-table-column prop="order_type" label="订单类型" />
        <el-table-column prop="store_id" label="商家ID" />
        <el-table-column prop="agent_name" label="代理商" />
        <el-table-column prop="street_name" label="地区-乡镇" />
        <el-table-column prop="community_name" label="地区-村" />
        <el-table-column label="商家名称" width="150">
          <template slot-scope="scope">
            <pre>{{ scope.row.store_info | storeinfo }}</pre>
          </template>
        </el-table-column>
        <el-table-column prop="user_tel" label="下单账号" width="120" />
        <el-table-column prop="create_time" label="添加时间" width="90" />
        <el-table-column prop="status_text" label="状态" />
        <el-table-column prop="red_packet_dis" label="红包优惠" />
        <el-table-column prop="amount" label="订单总额" />
        <el-table-column prop="balance" label="余额" />
        <el-table-column prop="midou_money" label="蜜豆" />
        <el-table-column prop="wx_pay" label="微信支付" />
        <el-table-column prop="order_info" label="商品信息" width="180">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.order_info2" :key="index">{{item}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="store_comm" label="订单收益" />
        <el-table-column prop="platform_comm" label="平台服务费" v-if="role==0" />
        <el-table-column prop="agent_comm" label="区县提成" v-if="role==0||role==1" />
        <el-table-column prop="partner_comm" label="乡提成" v-if="role==2" />
        <el-table-column prop="village_comm" label="村提成" v-if="role==3" />
        <el-table-column prop="village_rebate_comm" label="粉丝返佣" />
        <el-table-column prop="referer_rebate_comm" label="推荐人返佣" />
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="scope.row.type==10"
              size="small"
              @click="SeeClick(scope.row)"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
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
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { turnDate, exporteurl, sameDay, Day, exportFile } from "@/utils/user";
import { businessOrderList, businessorderexport } from "@/api/business";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      dataList: [],
      keyword: "",
      options: [],
      agent: [],
      agent_id:
        JSON.parse(localStorage.getItem("user")).agent_id == 1
          ? ""
          : JSON.parse(localStorage.getItem("user")).agent_id,
      start_time: "",
      end_time: "",
      loading: false,
      condition: "",
      time: "",
      derive: 0,
      date_type: "",
      order_type: "",
      date_types: [],
      order_types: [],
      town: "",
      role: ""
    };
  },
  // 过滤器
  filters: {
    storeinfo(val) {
      if (val.indexOf("+") != -1) {
        return (
          val.substring(0, val.indexOf("+")) +
          "\n" +
          val.substring(val.indexOf("+") + 1, val.length)
        );
      } else {
        return val;
      }
    }
  },
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
      this.getData();
    },
    handleSizeChange(val) {
      this.limit = val;
      console.log(`每页 ${val} 条`);
      localStorage.setItem("limit", val);
      this.page = 1;
      this.getData();
    },
    inputentry(e) {
      // 搜索 输入
      this.keyword = e;
    },
    handleSelectionChange(val) {
      /** 选中 */
      let arr = [];
      val.map(res => {
        arr.push(res.service_id);
      });
      this.multipleSelection = arr;
    },
    startend(val) {
      /** 获取时间 */
      if (val) {
        this.start_time = turnDate(val[0]);
        this.end_time = turnDate(val[1]);
      } else {
        this.start_time = Day();
        this.end_time = sameDay();
        this.time = [Day(), sameDay()];
      }
    },
    SeeClick(val) {
      /** 查看 */
      console.log(val);
      this.$router.push({
        path: "/merchantOrderView",
        query: {
          order_id: val.order_id
        }
      });
    },
    exporte() {
      /** 导出 */
      let url = `${exporteurl}${businessorderexport}?name=${
        this.keyword
      }&agent_id=${this.agent_id}&order_type=${this.order_type}&start_date=${
        this.start_time
      }&stop_date=${this.end_time}&status=${this.condition}&service_id=${
        this.multipleSelection
      }&token=${localStorage.getItem("Token")}`;
      exportFile(url);
    },
    getData() {
      const data = {
        keyword: this.keyword,
        agent_id: this.agent_id,
        limit: this.limit,
        start_date: this.start_time,
        stop_date: this.end_time,
        status: this.condition,
        order_type: this.order_type,
        date_type: this.date_type,
        page: this.page
      };
      this.loading = true;
      const that = this;
      return new Promise((resolve, reject) => {
        businessOrderList(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            if (res.action) {
              res.action.map(val => {
                switch (val.tag) {
                  case "add":
                    if (val.display == 1) {
                      that.add = 1;
                    }
                    break;
                  case "del":
                    if (val.display == 1) {
                      that.del = 1;
                    }
                    break;
                  case "edit":
                    if (val.display == 1) {
                      that.edit = 1;
                    }
                    break;
                  default:
                    break;
                }
              });
              res.action.map(val => {
                if (val.tag == "orderexport" && val.display == 1) {
                  that.derive = 1;
                }
              });
            }
            if (res.agent_map) {
              that.agent = res.agent_map;
            }
            that.date_types = res.data.date_type;
            that.order_types = res.data.order_type;
            that.dataList = res.data.list;
            that.options = res.data.status_map;
            that.total = res.data.total;
            that.role = res.role;
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
    this.getData();
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
@import "src/styles/hide.scss";
</style>
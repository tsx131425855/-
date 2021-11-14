<template>
  <div class="root">
    <div class="handle">
      <el-button type="success" v-if="hasAdd" @click="onMask">添加</el-button>
      <el-button type="warning" v-if="hasChange" @click="changeCoupon(2)">作废</el-button>
      <el-button type="primary" v-if="hasChange" @click="changeCoupon(1)">激活</el-button>
    </div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="coupon_batch_number" placeholder="批次码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="coupon_name" placeholder="优惠券名"></el-input>
      </el-form-item>
      <el-form-item label="优惠券类型">
        <el-select v-model="coupon_type" placeholder="请选择">
          <el-option
            :label="item.val"
            v-for="(item, index) in coupon_type_map"
            :key="index"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="isSelf" label="代理商">
        <el-select v-model="agent_id" placeholder="请选择">
          <el-option
            :label="item.name"
            v-for="(item, index) in agent_map"
            :key="index"
            :value="item.agent_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="page=1; getData();">查询</el-button>
      </el-form-item>
    </el-form>
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

        <el-table-column fixed label="操作" align="center">
          <template slot-scope="scope">
            <router-link
              class="routeLike"
              :to="{ path: `/couponDetail?coupon_id=${scope.row.coupon_id}`}"
            >查看</router-link>
          </template>
        </el-table-column>
        <!-- <el-table-column fixed align="center" prop="service_id" label="售后ID" /> -->
        <el-table-column
          fixed
          min-width="100px"
          align="center"
          prop="coupon_batch_number"
          width="160"
          label="批次码"
        />
        <el-table-column min-width="100px" align="center" prop="coupon_type" label="优惠券类型" />
        <el-table-column align="center" prop="coupon_where" min-width="110" label="优惠条件" />
        <el-table-column align="center" prop="coupon_money" label="折扣金额" />
        <el-table-column fixed min-width="100px" align="center" prop="coupon_name" label="优惠券名称" />
        <el-table-column align="center" prop="coupon_discount_type" label="折扣类型" />
        <el-table-column align="center" prop="coupon_status" label="状态" />
        <el-table-column align="center" prop="is_delete" label="优惠券状态" />
        <el-table-column align="center" prop="coupon_amount" label="数量" />
        <el-table-column align="center" prop="coupon_user_limit" label="单人限领" />
        <el-table-column align="center" prop="everyday_limit" label="每日限领" />
        <el-table-column align="center" min-width="160px" prop="coupon_start_time" label="开始时间" />
        <el-table-column align="center" min-width="160px" prop="coupon_end_time" label="结束时间" />
        <el-table-column align="center" min-width="160px" prop="send_start_time" label="发送开始" />
        <el-table-column align="center" min-width="160px" prop="send_end_time" label="发送结束" />
        <el-table-column align="center" min-width="160px" prop="order_name" label="绑定白名单" />
        <el-table-column v-if="isSelf" align="center" prop="agent_name" label="供应商" />

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
    <el-dialog
      center
      title="添加优惠券"
      :visible.sync="showAdd"
      top="50px"
      width="900px"
      :before-close="handleClose"
      class="mask"
    >
      <el-form ref="form" :model="addMask" label-width="120px">
        <el-form-item style="width: 400px" label="批次码:">
          <el-input disabled v-model="addMask.coupon_batch_number" />
        </el-form-item>
        <div class="item">
          <el-form-item label="开始时间:" prop="title">
            <el-date-picker
              v-model="addMask.coupon_start_time"
              type="datetime"
              placeholder="选择开始时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间:" prop="title">
            <el-date-picker v-model="addMask.coupon_end_time" type="datetime" placeholder="选择结束时间"></el-date-picker>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="折扣类型:">
            <el-select v-model="addMask.coupon_discount_type" placeholder="请选择">
              <el-option
                :label="item.val"
                v-for="(item, index) in addMask.coupon_discount_type_list"
                :key="index"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="优惠条件:">
            <el-input
              :disabled="addMask.coupon_discount_type == 3"
              v-model="addMask.coupon_where"
              placeholder="输入优惠条件"
            />
          </el-form-item>
          <el-form-item label="优惠金额:">
            <el-input v-model="addMask.coupon_money" placeholder="输入优惠金额" />
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="优惠券数量">
            <el-input type="number" v-model="addMask.coupon_amount" placeholder="输入优惠券数量" />
          </el-form-item>
          <el-form-item label="优惠券类型">
            <el-select v-model="addMask.coupon_type" placeholder="请选择">
              <el-option
                :label="item.val"
                v-for="(item, index) in addMask.coupon_type_map"
                :key="index"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            v-for="item in addMask.menu_id_list"
            :key="item.key"
            v-show="item.key == addMask.agent_id"
            label="优惠劵白名单"
          >
            <el-select v-model="addMask.menu_id" placeholder="请选择">
              <el-option :label="i" v-for="(i, j) in item.val" :key="j" :value="j"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="单人限领:">
            <el-input v-model="addMask.coupon_user_limit" placeholder="输入限领数量" />
          </el-form-item>
          <el-form-item label="优惠券名称:">
            <el-input v-model="addMask.coupon_name" placeholder="输入优惠券名称" />
          </el-form-item>
          <el-form-item label="每日限领:">
            <el-input v-model="addMask.everyday_limit" placeholder="输入每日限领" />
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item v-if="isSelf" label="供应商:">
            <el-select @change="changAgent" v-model="addMask.agent_id" placeholder="请选择">
              <el-option
                :label="item.val"
                v-for="(item, index) in addMask.agent_map"
                :key="index"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="优惠说明:">
            <el-input v-model="addMask.coupon_sub_name" placeholder="说明" />
          </el-form-item>
        </div>

        <el-form-item>
          <el-radio-group v-model="addMask.coupon_usetime_type">
            <div style="margin: 10px 0 30px">
              <el-radio :label="1">固定日期</el-radio>
              <el-form-item label-width="100px" style="margin: 20px 0 0" label="开始时间: ">
                <el-date-picker
                  v-model="addMask.send_timeOut"
                  :disabled="addMask.coupon_usetime_type !== 1"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                ></el-date-picker>
              </el-form-item>
            </div>

            <div style="margin-top: 20px">
              <el-radio :label="2">固定时长:</el-radio>
              <div class="fixBox">
                <div>领取后:</div>
                <el-select
                  :disabled="addMask.coupon_usetime_type !== 2"
                  v-model="addMask.coupon_start_day"
                  placeholder="请选择"
                >
                  <el-option
                    :label="item.val"
                    v-for="(item, index) in addMask.coupon_start_day_list"
                    :key="index"
                    :value="item.key"
                  ></el-option>
                </el-select>
                <div>有效</div>
                <div style="margin-left: 40px">有效天数:</div>
                <el-select
                  :disabled="addMask.coupon_usetime_type !== 2"
                  v-model="addMask.coupon_valid_day"
                  placeholder="请选择"
                >
                  <el-option
                    :label="item.val"
                    v-for="(item, index) in addMask.coupon_valid_day_list"
                    :key="index"
                    :value="item.key"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="特殊资源:">
          <el-radio-group v-model="addMask.coupon_send_user_type">
            <el-radio label="1">游客+会员</el-radio>
            <el-radio label="2">全体会员</el-radio>
            <el-radio label="3">全体业主</el-radio>
            <el-radio label="4">全体管家</el-radio>
            <el-radio label="5">新用户</el-radio>
            <el-radio label="6">超级会员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="对象性别:">
          <el-radio-group v-model="addMask.coupon_send_sex">
            <el-radio label="1">不限</el-radio>
            <el-radio label="2">男</el-radio>
            <el-radio label="3">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item align="center" label-width="0">
          <el-button style="width: 120px;" type="primary" @click="commitMask">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  couponList,
  addCoupon,
  commitCoupon,
  changeCoupon,
} from "@/api/coupon";
import { pickerOptions, parseTime } from "@/utils/index";

export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: pickerOptions,
      },
      showAdd: false,
      addMask: {
        coupon_batch_number: "", // 批次码
        coupon_start_time: "", // 开始时间
        coupon_end_time: "", // 结束时间
        coupon_discount_type: "", // 折扣类型
        coupon_discount_type_list: [], // 折扣类型列表
        coupon_where: "", // 优惠条件
        coupon_money: "", // 优惠金额
        coupon_amount: "", // 优惠券数量
        coupon_type: "", //  优惠券类型
        coupon_type_map: [], // 优惠券类型列表
        menu_id: "", // 优惠券白名单
        menu_id_list: [], // 优惠券白名单列表
        coupon_user_limit: "", // 单人限领
        coupon_name: "", // 优惠券名称
        everyday_limit: "", // 每日限领
        coupon_sub_name: "", // 优惠说明
        agent_id: "", // 供应商ID
        agent_map: [], // 供应商列表
        coupon_usetime_type: 0, // 使用期限
        send_timeOut: [], // 开始时间
        coupon_start_day: "", // 领取后几天有效
        coupon_start_day_list: [], // 有效列表
        coupon_valid_day: "", // 有效天数
        coupon_valid_day_list: [], // 有效天数列表
        coupon_send_user_type: "", // 发送对象
        coupon_send_sex: "", // 对象性别
      },
      action: [],
      coupon_batch_number: "", // 批次号
      coupon_name: "", // 优惠券名
      coupon_type: "", // 优惠券类型
      coupon_type_map: [], // 优惠券类型列表
      agent_id: "", // 供应商ID
      agent_map: [], // 供应商列表
      dataList: [], // 数据
      limit: parseInt(localStorage.getItem("limit")) || 10,
      multipleSelection: [],
      total: 0,
      page: 1,
      loading: false,
      isSelf: false,
    };
  },
  created() {
    this.isSelf = JSON.parse(localStorage.getItem("user")).agent_id == 1;
    this.getData();
  },
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
      this.page = 1;
      this.getData();
    },

    handleSelectionChange(val) {
      /** 选中 */
      console.log(val);
      this.multipleSelection = val;
    },

    // 关闭添加弹窗
    handleClose() {
      this.$confirm("是否放弃添加", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.showAdd = false;
          this.addMask = {
            coupon_batch_number: "", // 批次码
            coupon_start_time: "", // 开始时间
            coupon_end_time: "", // 结束时间
            coupon_discount_type: "", // 折扣类型
            coupon_discount_type_list: [], // 折扣类型列表
            coupon_where: "", // 优惠条件
            coupon_money: "", // 优惠金额
            coupon_amount: "", // 优惠券数量
            coupon_type: "", //  优惠券类型
            coupon_type_map: [], // 优惠券类型列表
            menu_id: "", // 优惠券白名单
            menu_id_list: [], // 优惠券白名单列表
            coupon_user_limit: "", // 单人限领
            coupon_name: "", // 优惠券名称
            everyday_limit: "", // 每日限领
            coupon_sub_name: "", // 优惠说明
            agent_id: "", // 供应商ID
            agent_map: [], // 供应商列表
            coupon_usetime_type: 0, // 使用期限
            send_timeOut: [], // 开始时间
            coupon_start_day: "", // 领取后几天有效
            coupon_start_day_list: [], // 有效列表
            coupon_valid_day: "", // 有效天数
            coupon_valid_day_list: [], // 有效天数列表
            coupon_send_user_type: "", // 发送对象
            coupon_send_sex: "", // 对象性别
          };
        })
        .catch((res) => {
          console.log(res);
        });
    },

    // 修改供应商时 重置白名单数据
    changAgent() {
      this.addMask.menu_id = "";
    },

    // 打开弹窗, 获取其中条件
    onMask() {
      addCoupon({}).then((res) => {
        if (res.code == 1) {
          console.log(res);
          this.addMask.agent_map = res.data.agent_id;
          this.addMask.coupon_batch_number = res.data.coupon_batch_number;
          this.addMask.coupon_discount_type_list =
            res.data.coupon_discount_type;
          this.addMask.coupon_type_map = res.data.coupon_type;
          this.addMask.coupon_start_day_list = res.data.coupon_start_day;
          this.addMask.coupon_valid_day_list = res.data.coupon_valid_day;
          this.addMask.menu_id_list = res.data.menu_id;
          this.addMask.agent_id = res.data.menu_id[0].key;
          this.showAdd = true;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 提交添加优惠券
    commitMask() {
      let data = this.addMask;
      const val = {
        coupon_valid_day: data.coupon_valid_day,
        coupon_batch_number: data.coupon_batch_number,
        coupon_discount_type: data.coupon_discount_type,
        coupon_where: data.coupon_where,
        coupon_amount: data.coupon_amount,
        coupon_user_limit: data.coupon_user_limit,
        coupon_type: data.coupon_type,
        coupon_sub_name: data.coupon_sub_name,
        coupon_usetime_type: data.coupon_usetime_type,
        coupon_start_day: data.coupon_start_day,
        coupon_name: data.coupon_name,
        coupon_send_user_type: data.coupon_send_user_type,
        coupon_send_sex: data.coupon_send_sex,
        coupon_use_start_time:
          data.send_timeOut && data.send_timeOut[0]
            ? parseTime(data.send_timeOut[0])
            : "",
        coupon_use_end_time:
          data.send_timeOut && data.send_timeOut[1]
            ? parseTime(data.send_timeOut[1])
            : "",
        coupon_money: data.coupon_money,
        menu_id: data.menu_id,
        everyday_limit: data.everyday_limit,
        send_start_time: data.coupon_start_time
          ? parseTime(data.coupon_start_time)
          : "",
        send_end_time: data.coupon_end_time
          ? parseTime(data.coupon_end_time)
          : "",
        agent_id: data.agent_id,
      };

      commitCoupon(val).then((res) => {
        if (res.code == 1) {
          this.$message.success("添加成功");
          this.showAdd = false;
          this.addMask = {
            coupon_batch_number: "", // 批次码
            coupon_start_time: "", // 开始时间
            coupon_end_time: "", // 结束时间
            coupon_discount_type: "", // 折扣类型
            coupon_discount_type_list: [], // 折扣类型列表
            coupon_where: "", // 优惠条件
            coupon_money: "", // 优惠金额
            coupon_amount: "", // 优惠券数量
            coupon_type: "", //  优惠券类型
            coupon_type_map: [], // 优惠券类型列表
            menu_id: "", // 优惠券白名单
            menu_id_list: [], // 优惠券白名单列表
            coupon_user_limit: "", // 单人限领
            coupon_name: "", // 优惠券名称
            everyday_limit: "", // 每日限领
            coupon_sub_name: "", // 优惠说明
            agent_id: "", // 供应商ID
            agent_map: [], // 供应商列表
            coupon_usetime_type: 0, // 使用期限
            send_timeOut: [], // 开始时间
            coupon_start_day: "", // 领取后几天有效
            coupon_start_day_list: [], // 有效列表
            coupon_valid_day: "", // 有效天数
            coupon_valid_day_list: [], // 有效天数列表
            coupon_send_user_type: "", // 发送对象
            coupon_send_sex: "", // 对象性别
          };
          setTimeout(() => {
            this.getData();
          }, 600);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 获取数据
    getData() {
      this.loading = true;
      const DATA = {
        coupon_batch_number: this.coupon_batch_number,
        coupon_name: this.coupon_name,
        coupon_type: this.coupon_type,
        agent_id: this.agent_id,
        page: this.page,
        limit: this.limit,
      };

      couponList(DATA).then((res) => {
        console.log(res);
        this.loading = false;
        if (res.code == 1) {
          this.dataList = res.data.list;
          this.total = res.data.count;
          this.coupon_type_map = res.data.status;
          this.agent_map = res.agent_map;
          this.action = res.action;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 导出表格
    exportExcel() {
      const that = this;
      this.$confirm("请确认筛选条件是否符合", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "开始导出!",
          });

          const data = {};
          //开启新下载窗口
          window.open(exportProduct(data));
        })
        .catch((res) => {
          this.$message.error("导出出现故障,请联系管理员");
          console.log(res);
        });
    },

    // 修改优惠券
    changeCoupon(type) {
      changeCoupon({
        type,
        coupon_id: this.multipleSelection.map((item) => item.coupon_id),
      }).then((res) => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          setTimeout(() => {
            this.getData();
          }, 600);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
  computed: {
    // 是否有处理优惠券权限
    hasChange() {
      return this.action.some(
        (item) => item.path == "coupon/coupon/ajax" && item.display == 1
      );
    },
    // 是否为本平台人员
    hasAdd() {
      return this.action.some(
        (item) => item.path == "coupon/coupon/add" && item.display == 1
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.root {
  padding: 40px;
}
.block {
  margin-top: 20px;
}
.handle {
  margin-bottom: 20px;
}
.radio {
  width: 100%;
}

.fixBox {
  display: flex;
  align-items: center;
  padding-left: 30px;
  margin-top: 20px;
  > div {
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    font-weight: bold;
    margin: 0 6px;
  }
}
.item {
  display: flex;
  justify-content: space-evenly;
  align-content: center;
  width: 100%;
  > div {
    flex: 33%;
  }
}
.scope {
  height: 100%;
  display: flex;
  flex-direction: column;

  .scopeItem {
    box-sizing: border-box;
    min-height: 35px;
    padding: 12px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    position: relative;
    &::after {
      position: absolute;
      content: "";
      width: 100%;
      bottom: 0;
      left: 0;
      height: 1px;
      background-color: #ebeef5;
    }
    &:first-child {
      padding-top: 0;
    }
    &:last-child {
      padding-bottom: 0;
      &::after {
        display: none;
      }
    }
  }
}
.routeLike {
  color: chocolate;
}
</style>